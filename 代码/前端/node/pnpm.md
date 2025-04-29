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

## `pnpm dlx`

是 pnpm 包管理器提供的一个高效命令，用于**临时执行 npm 包的命令，无需将其安装为项目依赖或全局依赖**(类似npx)。以下是其核心用途及典型场景的详细说明

### 核心用途

1. **临时运行脚手架或工具** 快速初始化项目或执行一次性任务，例如使用 `create-react-app` 或 `vite` 创建新项目。该命令会从 npm 仓库下载 `create-react-app` 并执行，完成后自动清理，不会残留依赖到项目中 
2. **指定包版本执行** 可精确控制使用的包版本，避免默认版本不兼容问题：`pnpm dlx typescript@latest init`此命令会下载最新版 TypeScript 并执行初始化
3. **组合多包命令（Shell 模式）** 通过 `-c` 或 `--shell-mode` 参数，在 Shell 环境中运行管道操作或多命令组合：`pnpm -c dlx 'echo "Hello" | cowsay | lolcatjs'`需配合 `--package` 预先安装所需包（如 `cowsay` 和 `lolcatjs`）`pnpm --package=yo --package=generator-webapp dlx yo webapp`.此功能适用于需要多包协作但无需长期保留依赖的场景
4. **绕过依赖安装直接调试工具** 快速测试 CLI 工具功能，例如检查 `eslint` 的版本或帮助信息：`pnpm dlx eslint --version`

### 典型使用场景

1. **项目初始化** 快速创建 React、Vue 或 Next.js 项目模板，避免全局安装工具：`pnpm dlx create-next-app@latest`
2. **执行一次性脚本** 例如生成文档或运行代码格式化：`pnpm dlx prettier --write .`
3. **调试工具链** 临时使用调试工具（如 `ndb` 或 `node-inspect`）分析代码：`pnpm dlx ndb server.js`