---
title: "Node 后端安全与鉴权"
---

> 后端安全不是“加个 JWT”就结束。本文覆盖认证、授权、输入、注入、限流、审计、密钥与常见 OWASP 风险，示例以 Express/Nest 通用思路为主。

## 1. 认证与授权分开

- **认证（Authentication）**：你是谁；
- **授权（Authorization）**：你能做什么。

常见错误：只校验登录，不校验资源归属，导致水平越权。

```ts
// 错误：只校验登录
app.get('/orders/:id', auth, async (req, res) => {
  res.json(await db.order.findUnique({ where: { id: req.params.id } }))
})

// 正确：同时校验归属
app.get('/orders/:id', auth, async (req, res) => {
  const order = await db.order.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  })
  if (!order) return res.status(404).json({ error: 'not_found' })
  res.json(order)
})
```

## 2. 密码存储

- 用 Argon2id 或 bcrypt（cost 足够）；
- 永远不要明文/MD5/SHA1；
- 每个用户独立 salt（库自带）；
- 登录失败不区分“用户不存在/密码错误”；
- 限制失败次数，记录审计；
- 密码重置 token 一次性、短有效期、哈希存储。

```ts
import argon2 from 'argon2'

const hash = await argon2.hash(password)
const ok = await argon2.verify(user.password, password)
```

## 3. Session vs JWT

| 方案 | 优点 | 风险/成本 |
| --- | --- | --- |
| Session + Cookie | 可服务端撤销、实现简单 | 需要共享存储；CSRF |
| JWT | 无状态、跨服务 | 撤销困难；泄露后有效期长 |

建议：

- 浏览器同域优先 HttpOnly + Secure + SameSite Cookie；
- JWT 短期 access token + 可撤销 refresh token；
- 不要在前端 localStorage 存长期 token；
- 不要在 URL 传 token；
- 退出登录要能撤销 refresh token。

## 4. RBAC 与资源权限

```ts
type Role = 'USER' | 'ADMIN'

function requireRole(...roles: Role[]) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'forbidden' })
    }
    next()
  }
}
```

- 角色只解决“大权限”，资源归属要单独判断；
- 后台接口逐个鉴权，不要只靠前端隐藏按钮；
- 管理端与用户端分路由、分中间件；
- 高风险操作加二次确认/审计。

## 5. 输入校验

- 所有外部输入不可信：body/query/params/header/cookie/文件；
- 用 Zod/class-validator 做 schema 校验；
- 校验类型、长度、枚举、格式、范围；
- 拒绝未知字段（防 mass assignment）；
- 不在 ORM 里直接 `...req.body`。

```ts
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(50),
})

const data = schema.parse(req.body)
```

## 6. 注入与越权

- SQL：参数化查询/ORM，不拼字符串；
- Prisma `$queryRaw` 用模板参数，禁止 `$queryRawUnsafe` 拼用户输入；
- NoSQL：禁止把 `req.query` 直接作为 filter（`$ne` 注入）；
- 命令执行：避免 `exec` 拼接；必须用 `execFile` + 参数数组；
- 路径穿越：`path.resolve` 后校验仍在允许目录；
- SSRF：只允许白名单域名，禁止访问内网/元数据地址；
- 文件上传：限制类型/大小，重命名，存对象存储，不直接执行。

## 7. CSRF / CORS

- Cookie 认证的写接口要防 CSRF：SameSite + CSRF token；
- CORS 不要 `origin: '*'` 配合 credentials；
- 明确允许的 origin、methods、headers；
- 预检请求不要放行未知来源。

## 8. 限流与风控

```ts
import rateLimit from 'express-rate-limit'

app.use('/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
}))
```

- 登录、验证码、下单、导出等接口单独限流；
- 按 IP + 用户 + 设备维度；
- 分布式用 Redis 计数；
- 限流要返回 429 和 `Retry-After`；
- 高风险行为加验证码/二次验证/人工审核。

## 9. 审计与日志

记录：

- 谁、何时、从哪、做了什么、结果；
- 登录失败、权限拒绝、敏感数据导出、后台修改；
- 请求 id、用户 id、资源 id；
- 不记录密码、token、完整身份证/银行卡。

审计日志应只追加、可检索、有保留周期；不要和普通调试日志混在一起。

## 10. 密钥与配置

- 密钥放环境变量/密钥管理，不进仓库；
- 不同环境不同密钥；
- 定期轮换；
- `.env` 加入 `.gitignore`；
- CI 日志不打印密钥；
- 前端不能持有服务端密钥。

## 11. OWASP 检查清单

- [ ] 认证失败不泄露用户是否存在；
- [ ] 每个资源接口校验归属；
- [ ] 密码用 Argon2/bcrypt；
- [ ] 所有输入 schema 校验；
- [ ] SQL/命令/路径/SSRF 无拼接；
- [ ] Cookie HttpOnly/Secure/SameSite；
- [ ] 写接口有 CSRF 防护；
- [ ] CORS 白名单；
- [ ] 登录/敏感接口限流；
- [ ] 审计日志脱敏；
- [ ] 依赖漏洞扫描；
- [ ] 错误响应不暴露堆栈/SQL。

## 12. 相关文档

- [数据库、鉴权与安全](./数据库、鉴权与安全.md)
- [数据库设计与查询优化](./数据库设计与查询优化.md)
- [Express 项目规范](./Express项目规范.md)
- [NestJS 企业级实践](./NestJS企业级实践.md)
- [Node 后端测试与可观测性](./Node后端测试与可观测性.md)
