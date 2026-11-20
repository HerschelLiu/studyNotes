---
title: "Node 后端缓存、队列与幂等"
---

> 缓存解决“读得快”，队列解决“削峰解耦”，幂等解决“重复执行不坏数据”。三者经常一起出现，本文给可落地的模式与检查清单。

## 1. Redis 缓存模式

最常用 cache-aside：

```ts
async function getProduct(id: string) {
  const key = `product:${id}`
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  const product = await db.product.findUnique({ where: { id } })
  if (!product) {
    await redis.set(key, JSON.stringify(null), 'EX', 60) // 空值缓存，防穿透
    return null
  }

  await redis.set(key, JSON.stringify(product), 'EX', 300 + Math.floor(Math.random() * 60))
  return product
}
```

更新时删除缓存，而不是只写缓存：

```ts
await db.product.update({ where: { id }, data })
await redis.del(`product:${id}`)
```

复杂场景可用“先更新数据库，再删缓存 + 延迟双删”，但不要把它当成强一致方案。

## 2. 缓存三大问题

| 问题 | 现象 | 处理 |
| --- | --- | --- |
| 穿透 | 查询不存在的数据，每次打到数据库 | 空值缓存、布隆过滤器、参数校验 |
| 击穿 | 热点 key 过期瞬间大量回源 | 互斥重建、逻辑过期、热点永不过期 |
| 雪崩 | 大量 key 同时过期/Redis 故障 | TTL 加随机、分批预热、降级限流 |

互斥重建：

```ts
const lockKey = `lock:${key}`
const locked = await redis.set(lockKey, '1', 'NX', 'EX', 10)
if (locked) {
  try {
    // 只有拿到锁的请求回源并写缓存
  } finally {
    await redis.del(lockKey)
  }
} else {
  // 等待短暂时间后重试读缓存
}
```

## 3. 缓存 key 与失效

- key 带业务前缀和版本：`v1:product:123`；
- TTL 按数据变化频率设置，加随机抖动；
- 用户私有数据不要放公共缓存；
- 缓存值带 schema 版本，升级时避免反序列化错误；
- 删除缓存失败要有重试/补偿，不能静默忽略。

## 4. 队列适合什么

- 发送邮件/短信/推送；
- 生成报表、导入导出；
- 订单超时关闭；
- 第三方回调重试；
- 削峰填谷。

不适合：必须同步返回、强一致、极低延迟的核心路径。

## 5. BullMQ 基本用法

```ts
import { Queue, Worker } from 'bullmq'

const connection = { host: '127.0.0.1', port: 6379 }

export const mailQueue = new Queue('mail', { connection })

await mailQueue.add('send', { to, template }, {
  attempts: 5,
  backoff: { type: 'exponential', delay: 1000 },
  removeOnComplete: 1000,
  removeOnFail: 5000,
})

new Worker('mail', async (job) => {
  await sendMail(job.data)
}, { connection, concurrency: 5 })
```

- 任务要幂等；
- 设置最大重试和退避；
- 失败进入死信/失败队列，人工补偿；
- 监控队列深度、失败率、最老任务年龄；
- Worker 要优雅关闭，处理完当前任务再退出。

## 6. 幂等

重复请求的来源：

- 用户重复点击；
- 网关/客户端重试；
- 队列至少一次投递；
- 第三方回调重复。

实现：

### 6.1 唯一键

```sql
CREATE TABLE payments (
  id text PRIMARY KEY,
  idempotency_key text NOT NULL UNIQUE,
  amount numeric NOT NULL
);
```

插入冲突时返回已存在结果，而不是重复扣款。

### 6.2 状态机

```text
PENDING -> PAID
PENDING -> FAILED
PAID -> REFUNDED
```

只允许合法状态迁移，重复回调直接返回当前状态。

### 6.3 幂等表

```sql
CREATE TABLE idempotency_keys (
  key text PRIMARY KEY,
  request_hash text NOT NULL,
  response jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

同一个 key + 相同请求返回缓存响应；不同请求返回冲突。

## 7. Outbox / 最终一致

写业务表和发消息不能靠“先写库再发 MQ”保证原子性。用 outbox：

```text
事务内：写 orders + 写 outbox(event)
事务外：轮询 outbox -> 发 MQ -> 标记已发送
```

- 事件至少一次投递；
- 消费端必须幂等；
- 失败重试 + 死信 + 对账；
- 不要宣称“ exactly once”，用幂等实现业务上的“不重复”。

## 8. 观测与告警

- 缓存命中率、Redis 延迟、内存/eviction；
- 队列 waiting/active/failed/delayed 数量；
- 最老等待任务年龄；
- 重试次数、死信数量；
- 幂等冲突率；
- 对账差异。

## 9. 检查清单

- [ ] 缓存 key 有前缀/版本/TTL；
- [ ] 防止穿透/击穿/雪崩；
- [ ] 更新数据库后失效缓存；
- [ ] 队列任务幂等、可重试、有死信；
- [ ] 支付/订单有唯一键或幂等表；
- [ ] 状态迁移合法；
- [ ] 关键消息有 outbox/对账；
- [ ] 有队列和缓存监控告警。

## 10. 相关文档

- [数据库设计与查询优化](./数据库设计与查询优化.md)
- [Prisma 数据访问与迁移](./Prisma数据访问与迁移.md)
- [Node 后端测试与可观测性](./Node后端测试与可观测性.md)
- [Express 项目规范](./Express项目规范.md)
