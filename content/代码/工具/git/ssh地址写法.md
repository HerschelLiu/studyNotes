---
title: "ssh地址写法"
---

> 同一个仓库的 HTTPS 地址与 SSH 地址可以互相推导。

以 `https://gitee.com/FishSay/studyNotes` 为例：

| 协议 | 地址 |
| --- | --- |
| HTTPS | `https://gitee.com/FishSay/studyNotes` |
| SSH | `git@gitee.com:FishSay/studyNotes.git` |

规律：`https://<host>/<用户名>/<仓库>` → `git@<host>:<用户名>/<仓库>.git`。

## 把已有仓库切到 SSH

```bash
git remote set-url origin git@gitee.com:FishSay/studyNotes.git
git remote -v   # 确认
```

首次使用先配置密钥，见同目录 [生成新的 SSH 密钥对](生成新的%20SSH%20密钥对.md) 与 [查看ssh公钥](查看ssh公钥.md)。
