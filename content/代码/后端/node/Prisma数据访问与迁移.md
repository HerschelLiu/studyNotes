---
title: "Prisma 数据访问与迁移"
---

> Prisma 是 Node/TypeScript 后端最常见的 ORM 之一：用 schema 描述数据模型，自动生成类型安全的 Client，并用 migration 管理数据库结构。
>
> 适用：Express、NestJS、Fastify、Serverless；数据库以 PostgreSQL 为例。

## 1. 什么时候用 Prisma

适合：

- 需要类型安全的 CRUD 和关联查询；
- 希望 schema 即文档、迁移可追踪；
- 团队以 TypeScript 为主；
- 需要较快完成业务，而不是手写大量 SQL。

不适合：

- 极端复杂的分析型 SQL、窗口函数、批量导入；
- 需要精细控制执行计划、锁和 hint；
- 数据库已有大量存储过程/触发器，ORM 反而增加阻抗。

结论：**Prisma 负责常规业务数据访问，复杂查询用 `$queryRaw` 或数据库视图兜底**。

## 2. 安装与初始化

```bash
npm i @prisma/client
npm i -D prisma
npx prisma init --datasource-provider postgresql
```

生成：

```text
prisma/
├── schema.prisma
└── migrations/
.env
```

`.env`：

```ini
DATABASE_URL="postgresql://app:app@localhost:5432/app?schema=public"
```

不要提交 `.env`；提交 `schema.prisma` 和 `migrations/`。

## 3. schema 基础

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([createdAt])
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([authorId, createdAt])
}

enum Role {
  USER
  ADMIN
}
```

要点：

- `@id`、`@unique`、`@default` 直接映射数据库约束；
- 关系字段用 `@relation`，外键列要有索引；
- 列表查询常用 `@@index([authorId, createdAt])`；
- 时间字段用 `DateTime`，不要用字符串。

## 4. 迁移

开发：

```bash
npx prisma migrate dev --name add_post
```

它会：

1. 比较 schema 和数据库；
2. 生成 SQL migration；
3. 应用迁移；
4. 重新生成 Client。

生产/CI：

```bash
npx prisma migrate deploy
npx prisma generate
```

规则：

- migration 文件必须提交；
- 生产不要用 `migrate dev`；
- 破坏性变更拆成多步：先加列/双写，再迁移数据，最后删旧列；
- 大表加索引/改类型要评估锁表时间；
- 回滚靠备份 + 向前修复 migration，不要依赖自动回滚。

## 5. Client 单例

Express/Nest 都要避免每次请求 `new PrismaClient()`。

```ts
// src/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

NestJS 用 `PrismaService extends PrismaClient implements OnModuleInit`，在 `onModuleInit` 里 `$connect()`，`onModuleDestroy` 里 `$disconnect()`。

## 6. 常用查询

```ts
// 创建
const user = await prisma.user.create({
  data: { email, name, password: hash },
})

// 条件 + 分页
const [items, total] = await prisma.$transaction([
  prisma.post.findMany({
    where: { published: true, title: { contains: keyword, mode: 'insensitive' } },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * size,
    take: size,
    select: { id: true, title: true, createdAt: true, author: { select: { name: true } } },
  }),
  prisma.post.count({ where: { published: true } }),
])

// 更新
await prisma.user.update({ where: { id }, data: { name } })

// upsert
await prisma.user.upsert({
  where: { email },
  update: { name },
  create: { email, name, password: hash },
})

// 删除
await prisma.post.delete({ where: { id } })
```

原则：

- 列表必须 `select` 需要的字段，避免把 `password`/大字段带出去；
- 关联查询避免 N+1，用 `include`/`select` 一次取；
- 分页优先 cursor：

```ts
const rows = await prisma.post.findMany({
  take: 20,
  ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  orderBy: { id: 'asc' },
})
```

## 7. 事务

```ts
await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: orderData })
  await tx.inventory.update({
    where: { productId },
    data: { stock: { decrement: quantity } },
  })
  return order
})
```

注意：

- 事务里不要做慢的外部 HTTP 调用；
- 控制事务时长，避免长事务锁表；
- 需要幂等时，用唯一键/幂等表，而不是只靠事务。

## 8. 原生 SQL

复杂统计、窗口函数、批量更新：

```ts
const rows = await prisma.$queryRaw<{ day: Date; count: bigint }[]>`
  SELECT date_trunc('day', "createdAt") AS day, count(*) AS count
  FROM "Post"
  WHERE "createdAt" >= ${since}
  GROUP BY 1
  ORDER BY 1
`
```

- 用参数化模板，不要拼接字符串；
- `$queryRawUnsafe` 只用于受控 SQL，绝不拼用户输入；
- 返回的 `count` 可能是 `bigint`，需要转换。

## 9. Seed 与测试

`prisma/seed.ts`：

```ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

await prisma.user.upsert({
  where: { email: 'admin@example.com' },
  update: {},
  create: { email: 'admin@example.com', name: 'Admin', password: 'hashed', role: 'ADMIN' },
})

await prisma.$disconnect()
```

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

集成测试：

- 每个测试用独立 schema/数据库；
- 测试前 `migrate deploy`，不要用 `db push` 代替迁移；
- 每个用例事务回滚，或按表清空；
- 测试数据工厂固定字段，避免依赖执行顺序。

## 10. 生产注意事项

| 问题 | 处理 |
| --- | --- |
| 连接池耗尽 | 单例 Client；Serverless 用连接池代理（如 PgBouncer/Prisma Accelerate） |
| N+1 | `include`/`select`、批量查询、看 SQL 日志 |
| 慢查询 | 加索引、`EXPLAIN ANALYZE`、限制返回字段 |
| 迁移锁表 | 拆迁移、在线加索引、低峰执行 |
| 敏感字段 | `select` 排除、日志脱敏、加密存储 |
| 事务过长 | 把外部调用移出事务 |
| 数据丢失 | 备份 + 迁移前快照 + 回滚预案 |

## 11. 排查清单

- [ ] `DATABASE_URL` 未提交，生产用密钥管理；
- [ ] migration 已提交，生产用 `migrate deploy`；
- [ ] 列表查询有索引、分页和字段限制；
- [ ] 关联查询没有 N+1；
- [ ] 事务内没有慢 HTTP；
- [ ] 原生 SQL 全部参数化；
- [ ] 测试使用真实迁移；
- [ ] 有备份与回滚方案。

## 12. 相关文档

- [数据库设计与查询优化](./数据库设计与查询优化.md)
- [数据库、鉴权与安全](./数据库、鉴权与安全.md)
- [Node 后端安全与鉴权](./Node后端安全与鉴权.md)
- [Express 项目规范](./Express项目规范.md)
- [NestJS 企业级实践](./NestJS企业级实践.md)
