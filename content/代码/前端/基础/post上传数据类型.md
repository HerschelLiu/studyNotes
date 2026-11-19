---
title: "post上传数据类型"
---

> HTTP 表单提交的两种常见 `Content-Type`，以及各自适用的场景。

| 数据格式 | Content-Type | 适用场景 |
| --- | --- | --- |
| `form-data` | `multipart/form-data` | 上传文件、二进制数据（可同时带普通字段） |
| `x-www-form-urlencoded` | `application/x-www-form-urlencoded` | 普通键值对表单提交（体积小、编码简单） |

实际项目中：普通表单提交用 `x-www-form-urlencoded`，涉及文件上传用 `form-data`。

## 参考

- [form-data 和 x-www-form-urlencoded 的区别（阿里云开发者社区）](https://developer.aliyun.com/article/1432987)
- 大文件上传的分片处理见 [大文件分片](大文件分片.md)
