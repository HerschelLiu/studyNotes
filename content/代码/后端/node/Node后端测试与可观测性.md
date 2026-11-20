---
title: "Node 后端测试与可观测性"
---

> 测试保证“改得动”，可观测性保证“出事能定位”。本文补技能地图里测试分层、覆盖率、测试数据、日志、指标、链路、告警与发布回滚。

## 1. 测试分层

| 层级 | 测什么 | 工具 | 数量 |
| --- | --- | --- | --- |
| 单元 | 纯函数、领域逻辑 | node:test / Vitest | 多 |
| 集成 | 路由 + 数据库 + 中间件 | supertest + 测试库 | 中 |
| 契约 | API 请求/响应 schema | OpenAPI/Zod | 中 |
| E2E | 关键用户路径 | Playwright/真实环境 | 少 |

不要只写“controller mock service”的假集成测试；关键接口要连真实数据库跑一遍。

## 2. 接口测试示例

```ts
import request from 'supertest'
import { test, before, after } from 'node:test'
import { app } from '../src/app.js'
import { migrate, truncate, close } from './db.js'

before(async () => {
  await migrate()
})

after(async () => {
  await close()
})

test('未登录返回 401', async () => {
  await request(app).get('/api/orders').expect(401)
})

test('创建订单并返回 201', async () => {
  const res = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${token}`)
    .send({ productId: 'p1', quantity: 1 })
    .expect(201)
  // 断言响应，再用数据库确认副作用
  const row = await db.order.findUnique({ where: { id: res.body.id } })
  if (!row) throw new Error('order not persisted')
})
```

原则：

- 断言状态码、错误码、响应 schema、数据库副作用；
- 覆盖成功/未登录/无权限/参数错误/不存在/冲突；
- 测试数据独立，不依赖执行顺序；
- 每个测试事务回滚或清表；
- 测试库用迁移创建，不用 `db push` 模拟。

## 3. 覆盖率与质量

- 覆盖率是下限，不是目标；
- 核心领域逻辑、权限、金额/库存路径必须覆盖；
- 不追求 100%，但关键分支不能漏；
- 快照测试不要滥用；
- 测试失败要能复现，避免随机数据。

## 4. 测试数据管理

- 工厂函数统一造数据；
- 固定测试用户/租户，避免串数据；
- 敏感数据用假值；
- 测试数据库与开发/生产隔离；
- CI 中每次从空库迁移；
- 需要外部服务时用容器或 mock server。

## 5. 日志

结构化日志：

```ts
logger.info({
  event: 'order.created',
  requestId: req.id,
  userId: req.user.id,
  orderId: order.id,
  durationMs,
}, 'order created')
```

- JSON 格式，便于检索；
- 每条请求带 `requestId`；
- 记录耗时、状态码、错误码、关键业务 id；
- 不记录密码/token/完整敏感信息；
- 错误日志带 stack，但响应不返回 stack；
- 日志级别：debug/info/warn/error，生产别全开 debug。

## 6. 指标

至少：

- 请求量、错误率、P95/P99 延迟；
- 数据库连接数、慢查询数；
- 队列积压、任务失败数；
- 缓存命中率；
- 进程 CPU/内存/事件循环延迟。

Prometheus 命名示例：

```text
http_requests_total{route="/api/orders",status="200"}
http_request_duration_seconds_bucket{route="/api/orders",le="0.2"}
```

指标标签不要放用户 id/订单号，避免高基数。

## 7. 链路追踪

- 入口生成/透传 traceId；
- 数据库、Redis、HTTP 下游都带上；
- 用 OpenTelemetry 自动埋点 + 手动关键 span；
- 采样率按环境调整；
- 日志里带 traceId，指标能关联。

## 8. 告警

- 告警要可行动，避免“响了没人管”；
- 基于症状：错误率、P95、队列积压、磁盘、连接数；
- 设置阈值和持续时间，避免抖动；
- 分级：P0 电话，P1 群，P2 工单；
- 每个告警有 runbook：怎么确认、怎么降级、怎么回滚。

## 9. 发布与回滚

- 构建产物不可变，镜像打版本；
- 先灰度/小流量，再全量；
- 数据库迁移向前兼容，先加后删；
- 回滚要能回代码和配置，数据库迁移要有预案；
- 发布后看错误率/延迟/业务指标，不只看进程活着。

## 10. 故障排查顺序

1. 影响面：哪些接口/用户/地区；
2. 最近变更：发布、配置、迁移、流量；
3. 指标：错误率、延迟、连接池、CPU；
4. 日志：requestId/traceId 串起来；
5. 依赖：数据库、Redis、队列、第三方；
6. 止损：限流、降级、回滚、切流；
7. 复盘：根因、改进项、负责人和截止时间。

## 11. 检查清单

- [ ] 关键接口有集成测试；
- [ ] 测试库用迁移创建；
- [ ] 覆盖成功/失败/权限/参数错误；
- [ ] 结构化日志带 requestId；
- [ ] 有错误率/延迟/队列指标；
- [ ] 有 traceId；
- [ ] 告警有 runbook；
- [ ] 发布可灰度、可回滚；
- [ ] 敏感信息不落日志。

## 12. 相关文档

- [测试、日志与部署](../../前端/node/工程化/测试、日志与部署.md)
- [Node 后端安全与鉴权](./Node后端安全与鉴权.md)
- [Node 后端缓存、队列与幂等](./Node后端缓存、队列与幂等.md)
- [Express 项目规范](./Express项目规范.md)
