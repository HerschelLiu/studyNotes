---
title: "Stream、Buffer 与文件"
---

> 前置：了解 `fs` 的基本读写。
>
> 目标：处理大文件不爆内存，理解流、背压和编码。

## 1. 为什么不能总是 readFile

```js
const text = await fs.readFile('access.log', 'utf8')
```

小文件没问题，但日志、导出文件、上传文件可能几百 MB 到几 GB：

- `readFile` 会把整个文件读进内存；
- 字符串还会再占一份内存；
- 同时处理多个大文件时，进程很容易 OOM。

流的思想是：**分块读取，处理完一块就丢掉一块**。

## 2. Buffer 与编码

```js
const buf = Buffer.from('你好', 'utf8')
console.log(buf)              // <Buffer e4 bd a0 e5 a5 bd>
console.log(buf.length)       // 6，字节数，不是字符数
console.log(buf.toString('utf8')) // 你好
```

要点：

- `Buffer` 是字节数组，长度按字节算；
- 中文一个字符通常占 3 个字节；
- 文件读写默认是 `Buffer`，指定 `'utf8'` 才得到字符串；
- 图片、压缩包必须用 `Buffer` / 二进制流，不能转字符串。

## 3. 最小示例：逐行处理日志

```js
import fs from 'node:fs'
import readline from 'node:readline'

const input = fs.createReadStream('access.log', 'utf8')
const rl = readline.createInterface({ input, crlfDelay: Infinity })

let errors = 0

for await (const line of rl) {
  if (line.includes(' 500 ')) errors += 1
}

console.log(`5xx 行数：${errors}`)
```

`readline` 帮你处理跨块的行边界，避免自己拼字符串时漏掉半行。

## 4. pipe 与 pipeline

```js
import fs from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { createGzip } from 'node:zlib'

await pipeline(
  fs.createReadStream('app.log'),
  createGzip(),
  fs.createWriteStream('app.log.gz'),
)
```

- `pipe` 只负责转发数据，**不会把错误传下去**；
- `pipeline` 会处理错误、销毁流，并返回 Promise，推荐优先使用；
- 可以用 `Transform` 插入自定义处理：

```js
import { Transform } from 'node:stream'

const upper = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase())
  },
})

await pipeline(fs.createReadStream('a.txt'), upper, fs.createWriteStream('b.txt'))
```

## 5. 背压是什么

当写入速度跟不上读取速度时：

- 可写流的 `write()` 返回 `false`；
- 正确做法是暂停读取，等 `drain` 再继续；
- `pipe` / `pipeline` 已经帮你处理，手写 `data` 事件时容易忽略。

```js
// 不推荐：无视背压
readable.on('data', (chunk) => writable.write(chunk))

// 推荐
await pipeline(readable, writable)
```

## 6. 常见坑

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 内存暴涨 | 大文件用 `readFile` / `readFileSync` | 改用流 |
| 中文乱码 | 按字节截断后直接 `toString` | 用 `readline` 或 `StringDecoder` |
| 文件只写了一半 | 没等 `finish` / `pipeline` 完成 | `await pipeline(...)` |
| 出错后进程不退出 | `pipe` 不传播错误 | 用 `pipeline` 并捕获异常 |
| 压缩包损坏 | 用字符串模式读写二进制 | 保持 `Buffer`，不要指定编码 |
| 读目录报 `EISDIR` | 把目录当文件读 | 先用 `stat` 判断类型 |

## 7. 项目里怎么用

- 日志分析：`createReadStream` + `readline` 逐行统计；
- 文件上传：请求流直接 `pipeline` 到磁盘，不要先读完再写；
- 导出大文件：边查数据库边写流，避免一次性拼 JSON；
- 压缩备份：`createGzip` + `pipeline`；

延伸阅读：[模块/fs模块.md](../模块/fs模块.md)、[模块/zlib模块.md](../模块/zlib模块.md)。

## 8. 练习

1. 统计一个 500MB 日志文件里各状态码的数量，限制内存占用；
2. 把一个目录下的 `.log` 批量压缩为 `.gz`，用 `pipeline` 并记录失败文件；
3. 用 `Transform` 实现一个“脱敏流”，把手机号中间四位替换为 `****`；
4. 写一个上传接口，把请求体直接流式写入磁盘，并限制最大体积。
