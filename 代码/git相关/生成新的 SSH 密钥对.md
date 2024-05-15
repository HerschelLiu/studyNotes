要使用 `ssh-keygen` 命令生成新的 SSH 密钥对，你可以按照以下步骤操作：

* `ssh-keygen -t ed25519 -C "your_email@example.com"`

  * `-t ed25519` 表示生成的密钥类型为 ED25519 算法，这是一种现代且安全的算法。
  * `-C "your_email@example.com"` 用于添加注释，可以替换成你的邮箱地址。

* 系统会提示你选择保存密钥对的位置，默认会保存在 `~/.ssh/id_ed25519`（私钥）和 `~/.ssh/id_ed25519.pub`（公钥）

* 将公钥内容添加到 GitHub 或其他需要的地方。你可以使用以下命令将公钥内容复制到剪贴板：

  ```bash
  pbcopy < ~/.ssh/id_ed25519.pub   # macOS
  cat ~/.ssh/id_ed25519.pub | clip   # Windows
  ```

  