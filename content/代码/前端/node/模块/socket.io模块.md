---
title: "socket.io模块"
---

> socket.io 在浏览器与服务器之间建立**双工、实时、长连接**通信（底层优先 WebSocket，不支持时降级轮询）。

## 安装

```bash
npm i socket.io socket.io-client
```

## 服务端

```js
const http = require('http')
const socketIo = require('socket.io')

const server = http.createServer(app)
const io = socketIo.listen(server)

io.on('connection', socket => {
  console.log('客户端已连接', socket.id)

  socket.on('chat', msg => {
    // 广播给所有客户端
    io.emit('chat', msg)
  })

  socket.on('disconnect', () => {
    console.log('客户端断开', socket.id)
  })
})

server.listen(3000)
```

## 客户端

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io('http://localhost:3000')
  socket.emit('chat', 'hello')
  socket.on('chat', msg => console.log(msg))
</script>
```

- 服务端会把 `socket.io.js` 挂在 `/socket.io/socket.io.js`，不需要单独下载。
- Vue / React 项目里用 `socket.io-client` 包替代 script 引入。
