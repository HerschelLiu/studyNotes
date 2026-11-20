---
title: "Express 项目规范与最佳实践"
---

> 前置：[HTTP 与 REST](./HTTP与REST.md)。
>
> 目标：从“会写路由”升级到“能按团队规范交付一个可维护的 Express 项目”。

## 1. 目录结构

```text
src/
├── app.js              # 创建 app、注册中间件与路由（不 listen）
├── server.js           # 启动、优雅退出
├── config/
│   └── index.js        # 环境变量读取与校验
├── routes/             # 路由声明，只做转发
├── controllers/        # 解析请求、调用 service、返回响应
├── services/           # 业务逻辑
├── repositories/       # 数据访问（SQL / ORM）
├── middlewares/        # 鉴权、错误处理、请求日志
├── schemas/            # zod 校验
├── lib/                # 数据库、Redis、第三方客户端
└── utils/              # 纯函数工具
tests/
├── unit/
└── integration/
```

约定：

- `app.js` 只导出 app，方便测试用 `supertest` 直接注入；
- 业务逻辑放 service，controller 不写 SQL；
- 一个业务模块尽量集中在一个目录，避免按技术类型无限拆分。

## 2. 启动与配置

```js
// src/config/index.js
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
})

export const config = schema.parse(process.env)
```

```js
// src/server.js
import { app } from './app.js'
import { config } from './config/index.js'
import { logger } from './lib/logger.js'
import { pool } from './lib/db.js'

const server = app.listen(config.PORT, () => {
  logger.info({ port: config.PORT }, 'server started')
})

async function shutdown(signal) {
  logger.info({ signal }, 'shutting down')
  server.close(async () => {
    await pool.end()
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10_000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
```

## 3. 常用中间件选型

| 中间件 | 作用 | 说明 |
| --- | --- | --- |
| `helmet` | 安全响应头 | 默认开启，按需调整 CSP |
| `cors` | 跨域 | 明确 origin，带 Cookie 时不能用 `*` |
| `express.json({ limit })` | JSON 解析 | 限制体积，默认 100kb 偏小 |
| `cookie-parser` | 解析 Cookie | Session 场景需要 |
| `express-rate-limit` | 限流 | 登录、短信、导出接口必加 |
| `pino-http` | 请求日志 | 输出结构化日志，带 request id |
| `compression` | gzip | 文本响应收益明显 |
| `multer` / `busboy` | 文件上传 | 限制类型与大小，存对象存储更常见 |
| `zod` | 参数校验 | 校验与类型推断一体 |

> CSRF：现代方案优先 `SameSite=Lax/Strict` + 只接受 JSON 请求；跨站表单场景再加 CSRF token。`csurf` 已停止维护，不要直接照搬旧教程。

## 4. 分层与路由

```js
// routes/todos.js
import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { createTodoSchema } from '../schemas/todo.js'
import * as controller from '../controllers/todo.js'

export const todoRouter = Router()

todoRouter.use(requireAuth)
todoRouter.get('/', controller.list)
todoRouter.post('/', validate(createTodoSchema), controller.create)
todoRouter.patch('/:id', controller.update)
todoRouter.delete('/:id', controller.remove)
```

```js
// controllers/todo.js
import * as service from '../services/todo.js'

export const create = async (req, res) => {
  const todo = await service.create(req.user.id, req.body)
  res.status(201).json(todo)
}

export const list = async (req, res) => {
  const result = await service.list(req.user.id, req.query)
  res.json(result)
}
```

原则：

- 路由只声明“方法 + 路径 + 中间件”；
- controller 不包含业务规则；
- service 不直接依赖 `req/res`，方便单测与复用。

## 5. 统一响应与错误处理

```js
// 成功
{ "data": { ... } }
// 失败
{ "message": "参数不合法", "code": "VALIDATION_ERROR", "details": [] }
```

```js
// middlewares/error.js
export const notFound = (req, res) => {
  res.status(404).json({ message: 'Not Found', code: 'NOT_FOUND' })
}

export const errorHandler = (err, req, res, next) => {
  req.log.error({ err }, 'request failed')
  const status = err.statusCode || 500
  res.status(status).json({
    message: status === 500 ? '服务器内部错误' : err.message,
    code: err.code || 'INTERNAL_ERROR',
  })
}
```

```js
// app.js
app.use(notFound)
app.use(errorHandler)
```

注意：

- 错误中间件必须是 4 个参数；
- Express 4 的 async 路由错误不会自动进入错误中间件，需要包装：

```js
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
```

- Express 5 已支持 async 错误自动转发，但项目中混用时仍建议统一包装。

## 6. 参数校验与鉴权

```js
export const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse({ body: req.body, query: req.query, params: req.params })
  if (!parsed.success) {
    return res.status(422).json({
      message: '参数不合法',
      code: 'VALIDATION_ERROR',
      details: parsed.error.issues,
    })
  }
  Object.assign(req, parsed.data)
  next()
}
```

鉴权中间件只做“解析身份 + 拒绝未登录”，资源归属校验放在 service：

```js
export const requireAuth = async (req, res, next) => {
  const user = await getUserFromSession(req)
  if (!user) return res.status(401).json({ message: '未登录', code: 'UNAUTHORIZED' })
  req.user = user
  next()
}
```

## 7. 真实业务场景

### 7.1 文件上传

- 小文件：`multer` 内存/磁盘存储，限制 5MB；
- 生产：直传对象存储（S3/OSS），服务端只签发临时凭证；
- 永远不要用用户提供的文件名直接拼路径。

### 7.2 第三方回调（Webhook）

- 校验签名与时间戳，防重放；
- 用业务单号做**幂等**，重复回调直接返回成功；
- 先落库再异步处理，避免超时导致对方重试风暴。

### 7.3 幂等

创建订单、支付这类接口要求客户端带 `Idempotency-Key`：

```text
Idempotency-Key: 8f2c...
```

服务端用唯一索引或 Redis `SETNX` 占位，重复请求返回第一次的结果。

### 7.4 限流

```js
import rateLimit from 'express-rate-limit'

export const loginLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: true,
  message: { message: '请求过于频繁', code: 'TOO_MANY_REQUESTS' },
})
```

### 7.5 调用第三方

- 必须设置超时；
- 只对幂等请求重试，带指数退避；
- 记录耗时与失败率，避免雪崩。

## 8. 测试

```js
import request from 'supertest'
import { app } from '../src/app.js'

test('未登录返回 401', async () => {
  const res = await request(app).get('/api/todos')
  expect(res.status).toBe(401)
})
```

- 集成测试覆盖：成功、未登录、无权限、参数错误、资源不存在；
- service 层用单元测试覆盖边界条件；
- 测试使用独立数据库或事务回滚。

## 9. 从零搭建流程

1. 需求拆解：列出角色、资源、操作、权限；
2. 数据建模：表、字段、索引、外键；
3. 接口契约：路径、方法、请求/响应、错误码，先写 OpenAPI；
4. 初始化骨架：config、logger、db、错误处理、健康检查；
5. 按模块实现：schema → service → controller → route；
6. 测试：先接口测试，再补 service 单测；
7. 安全：鉴权、限流、输入校验、日志脱敏；
8. 部署：Docker → Nginx → HTTPS → 监控告警；
9. 文档：README、环境变量说明、接口文档、部署手册。

## 10. 反模式

| 反模式 | 后果 |
| --- | --- |
| controller 里写 SQL 和业务判断 | 无法复用、难测试 |
| 所有逻辑塞进一个 `app.js` | 文件上千行，冲突频繁 |
| 直接返回数据库实体 | 泄露字段、耦合表结构 |
| 用 `console.log` 当日志 | 无法检索、没有级别 |
| 全局可变状态存用户数据 | 并发串数据 |
| 无超时调用第三方 | 请求堆积、雪崩 |
| 无限制查询列表 | 内存与数据库压力 |
| 错误统一返回 200 | 前端无法区分失败 |

## 11. 检查清单

- [ ] 分层清晰，controller 不写业务与 SQL
- [ ] 参数全部校验，错误结构统一
- [ ] 鉴权与资源归属校验齐全
- [ ] 日志结构化、带 request id、敏感字段脱敏
- [ ] 关键接口有限流与超时
- [ ] 有接口测试，CI 可运行
- [ ] 优雅退出、健康检查
- [ ] 环境变量校验，密钥不入库
