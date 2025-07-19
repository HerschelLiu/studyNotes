浏览器（Node.js14+）已经为我们内置了UUID生成方法`crypto.randomUUID()`

这是 W3C 标准和现代浏览器提供的**官方解决方案**。`crypto` 是一个浏览器内置的全局对象，提供了加密相关的能力，而 `randomUUID()` 方法专门用于生成一个符合 **RFC 4122 v4** 规范的通用唯一标识符（UUID）。