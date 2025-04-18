## 版本管理

### nvm、fnm

使用node版本管理工具，安卓不同版本node，在不同版本node中安装盘pnpm

### 使用pnpm自带版本管理功能

从 PNPM 6.10.0 版本开始，PNPM 支持了内置的版本管理功能，允许用户方便地切换不同版本的 PNPM。使用 `pnpm env` 命令可以管理不同的 Node.js 和 PNPM 环境。

```bash
# 安装 LTS（长期支持）版本
pnpm env use --global lts
# 安装最新版本
pnpm env use --global latest
# 安装特定版本（如 18.16.0）
pnpm env use --global 18.16.0

# 查看已安装的 Node.js 版本
pnpm env list

# 移除指定版本
pnpm env remove --global 18.16.0

# 查看远程可用的 Node.js 版本
pnpm env list --remote  # 查看所有远程版本
pnpm env list --remote 18  # 查看 v18 系列的所有版本

# 多版本共存：通过 pnpm env add 可安装多个版本但不激活
pnpm env add --global 16 18 20  # 同时安装 v16、v18、v20

# 预发布版本支持：可安装 nightly 或 rc 版本
pnpm env use --global nightly  # 安装最新开发版
```

`--global`（简写 `-g`）表示全局安装