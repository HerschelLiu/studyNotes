---
title: "HTTP 与 REST"
---

> 前置：能读 `async/await`，知道 JSON 和状态码的基本含义。
>
> 目标：先用 `node:http` 手写一个接口，再理解框架替你做了什么。

## 1. 一个 HTTP 请求由什么组成

```text
POST /api/todos?done=false HTTP/1.1
Content-Type: application/json
Authorization: Bearer xxx

{"title":"写文档"}
```

- 方法：`GET` 查询、`POST` 创建、`PATCH/PUT` 更新、`DELETE` 删除；
- 路径与查询串；
- 请求头：内容类型、鉴权、Cookie；
- 请求体：通常是 JSON；
- 响应：状态码 + 响应头 + 响应体。

## 2. 用 node:http 手写最小接口

```js
import http from 'node:http'

const todos = []

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(data))
  }

  if (req.method === 'GET' && url.pathname === '/api/todos') {
    return send(200, todos)
  }

  if (req.method === 'POST' && url.pathname === '/api/todos') {
    const body = await readJson(req)
    if (!body?.title) return send(422, { message: 'title 必填' })
    const todo = { id: crypto.randomUUID(), title: body.title, done: false }
    todos.push(todo)
    return send(201, todo)
  }

  send(404, { message: 'Not Found' })
})
```

读取 JSON 请求体：

```js
async function readJson(req, limit = 1024 * 1024) {
  let size = 0
  const chunks = []
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) throw new Error('请求体过大')
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}
```

这些就是框架里 `bodyParser`、路由、错误处理所做的事。

## 3. REST 设计约定

| 操作 | 方法 + 路径 | 成功状态码 |
| --- | --- | --- |
| 列表 | `GET /api/todos` | 200 |
| 详情 | `GET /api/todos/:id` | 200 / 404 |
| 创建 | `POST /api/todos` | 201 + `Location` |
| 全量更新 | `PUT /api/todos/:id` | 200 |
| 局部更新 | `PATCH /api/todos/:id` | 200 |
| 删除 | `DELETE /api/todos/:id` | 204 |

几个习惯：

- 路径用名词复数，动作交给 HTTP 方法；
- 分页用 `?page=1&pageSize=20`，返回 `{ items, total, page, pageSize }`；
- 错误统一结构，前端好处理：

```json
{ "message": "title 必填", "code": "VALIDATION_ERROR", "details": [] }
```

- 时间统一用 ISO 8601 字符串或时间戳，不要混用。

## 4. 参数校验

不要相信任何请求数据。用 zod 这类库把校验和类型推断放在一起：

```js
import { z } from 'zod'

const createTodoSchema = z.object({
  title: z.string().min(1).max(100),
  done: z.boolean().optional().default(false),
})

const parsed = createTodoSchema.safeParse(body)
if (!parsed.success) {
  return send(422, { message: '参数不合法', details: parsed.error.issues })
}
```

校验应发生在**进入业务逻辑之前**，并且覆盖：类型、长度、范围、枚举、必填。

## 5. 框架怎么选

| 框架 | 特点 | 适合 |
| --- | --- | --- |
| Express | 生态最大、资料多、约定少 | 入门、老项目 |
| Koa | 中间件洋葱模型、轻量 | 想自己掌控结构 |
| Fastify | 性能好、schema 校验、插件体系 | 新项目、API 服务 |
| Hono | 轻量、跨运行时（Node/边缘） | Serverless、边缘部署 |
| NestJS | 依赖注入、模块化、企业级约定 | 团队大、长期维护 |

学习顺序建议：**先手写，再用 Fastify/Express，最后按需看 NestJS**。否则只会记装饰器和 CLI，不知道底层发生了什么。

Fastify 最小示例：

```js
import Fastify from 'fastify'

const app = Fastify({ logger: true })

app.get('/api/todos', async () => todos)

app.post('/api/todos', {
  schema: {
    body: {
      type: 'object',
      required: ['title'],
      properties: { title: { type: 'string', minLength: 1 } },
    },
  },
}, async (request, reply) => {
  const todo = { id: crypto.randomUUID(), title: request.body.title, done: false }
  todos.push(todo)
  return reply.code(201).send(todo)
})

await app.listen({ port: 3000 })
```

已有速查：[模块/express.md](../模块/express.md)、[koa开发.md](../koa开发.md)、[使用nodejs写个接口.md](../使用nodejs写个接口.md)。

项目规范与进阶框架：

- [Express 项目规范](./Express项目规范.md)：目录结构、中间件选型、错误处理、上传/幂等/限流等真实场景；
- [NestJS 企业级实践](./NestJS企业级实践.md)：模块化、依赖注入、分层架构与落地方式。

## 6. 常见坑

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 请求一直挂起 | 没读请求体 / 没 `res.end()` | 确保每条分支都有响应 |
| `req.body` 是 undefined | 没有 body 解析 | 框架注册解析插件，或自己读流 |
| 大请求打爆内存 | 没限制请求体大小 | 设置 1MB 左右上限 |
| 异步错误导致进程退出 | 路由里 throw 没人接 | 用框架的错误处理钩子 |
| 前端报 CORS | 浏览器同源策略 | 配置允许的来源，不要无脑 `*` + 凭证 |
| 404 与 405 混用 | 路径存在但方法不对 | 方法不匹配返回 405 |
| 中文乱码 | 没写 `charset=utf-8` | `Content-Type` 带 charset |

## 7. 项目里怎么用

按顺序完成：

1. 用 `node:http` 实现 `GET/POST/DELETE /api/todos`；
2. 加上统一错误结构、请求体大小限制、404；
3. 换成 Fastify，对比代码少了什么；
4. 把接口拆成 `routes/`、`services/`、`schemas/`；
5. 写接口测试（见[测试、日志与部署](../工程化/测试、日志与部署.md)）。

## 8. 练习

1. 给手写服务器加上 `PATCH /api/todos/:id` 和 405 处理；
2. 实现分页与按 `done` 过滤；
3. 用 zod 校验查询参数 `page`、`pageSize`，限制最大 100；
4. 用 Fastify 重写同一组接口，保持响应结构完全一致。
