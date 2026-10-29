# fnm

> Fast Node Manager，用 Rust 写的 Node.js 版本管理器，支持 macOS / Linux / Windows，兼容 `.node-version` 和 `.nvmrc`。
>
> - 官方仓库：<https://github.com/Schniz/fnm>
> - 命令文档：<https://github.com/Schniz/fnm/blob/master/docs/commands.md>
> - 配置文档：<https://github.com/Schniz/fnm/blob/master/docs/configuration.md>
>
> 本文命令以 fnm 1.39 为准，不同版本参数可能略有差异，可用 `fnm --help` 查看。

## 安装

### 一键安装（macOS / Linux）

需要先有 `curl` 和 `unzip`：

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

> macOS 上官方更推荐 Homebrew：脚本检测到 macOS 时会自动改用 `brew install fnm`；只有加 `--force-install` 才真的下载二进制（官方已不推荐这种方式）：
>
> ```bash
> curl -fsSL https://fnm.vercel.app/install | bash -s -- --force-install
> ```

脚本常用参数：

- `--skip-shell`：不自动往 shell 配置里追加初始化语句（升级/重装时建议加，避免配置重复）
- `--install-dir <目录>`：自定义安装目录
- `--force-install`：在 macOS 上强制使用脚本安装

### 脚本升级

除 macOS 外，升级和安装命令基本一样。加上 `--skip-shell` 可以避免把初始化语句重复写进 shell 配置：

```bash
curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell
```

macOS（Homebrew 安装）用 `brew upgrade fnm`，见下面的“升级 fnm”。

### 手动安装

```bash
# macOS / Linux
brew install fnm

# Windows
winget install Schniz.fnm
scoop install fnm
choco install fnm

# 跨平台（需要 Rust 工具链）
cargo install fnm
```

也可以直接从 [Releases](https://github.com/Schniz/fnm/releases) 下载对应平台的二进制文件，放进 `PATH`。

> 手动安装后需要自己把 `fnm env` 的输出写进 shell 配置，见下一节。

### 配置 shell

把对应的一行加到配置文件末尾，然后重开终端或 `source` 一下：

```bash
# Bash：~/.bashrc
eval "$(fnm env --use-on-cd --shell bash)"

# Zsh：~/.zshrc
eval "$(fnm env --use-on-cd --shell zsh)"

# Fish：~/.config/fish/conf.d/fnm.fish
fnm env --use-on-cd --shell fish | source

# PowerShell：$PROFILE 末尾
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

说明：

- `--shell` 可以省略（fnm 会自己推断），但显式指定更快，也能避免在 Windows 或非交互环境里推断错。
- `fnm env` 的输出里已经包含 `FNM_DIR`、`FNM_MULTISHELL_PATH`、`PATH` 等变量，不要把输出内容再手抄一份到配置里。
- 如果 `eval "$(fnm env ...)"` 之后 `fnm` 还是不可用，依次检查：
  1. `which fnm` 能否找到（没装好或不在 `PATH`）；
  2. 是否写进了当前 shell 真正读取的启动文件（zsh 是 `~/.zshrc`，bash 交互式 shell 通常是 `~/.bashrc`）；
  3. 是否把 PowerShell 的写法贴进了 bash/zsh（或反过来）；
  4. 改完后有没有 `source` 或重开终端。

> `--use-on-cd` 会生成一段切目录时自动切换版本的 hook：zsh 里是 `chpwd` hook，bash 里会用 `alias cd=__fnmcd` 接管 `cd`。如果同时用了 zoxide、autojump 等会改写 `cd` 的工具，注意加载顺序。

## 常用命令

```bash
# 安装
fnm install --lts                 # 安装最新 LTS
fnm install --latest              # 安装最新正式版
fnm install 20                    # 安装 20.x 中最新的版本
fnm install 20.11.1               # 安装精确版本
fnm install 'lts/*'               # 安装最新 LTS
fnm install lts/jod               # 按 LTS 代号安装
fnm install 20 --use              # 装完立即在当前 shell 使用

# 切换
fnm use 20                        # 切到 20.x（当前 shell 生效）
fnm use --install-if-missing 20   # 没安装就先安装再切换
fnm use                           # 按 .nvmrc / .node-version / package.json 切换
fnm use system                    # 临时改用系统自带的 node
fnm current                       # 查看当前使用的版本

# 默认版本与别名
fnm default 20                    # 设置默认版本（等价于 fnm alias 20 default）
fnm default                       # 查看当前默认版本
fnm alias 20 my-alias             # 给版本起别名
fnm use my-alias
fnm unalias my-alias              # 删除别名

# 查看
fnm ls                            # 已安装的版本（含别名和 system）
fnm ls-remote --lts               # 官方所有 LTS 版本
fnm ls-remote --filter '^20'      # 按 semver 范围过滤
fnm ls-remote --latest            # 只显示最新版本

# 卸载
fnm uninstall 18
fnm uninstall my-alias            # 注意：会卸载别名指向的版本，且同版本的其他别名一起消失

# 用指定版本执行命令（不改变当前 shell 的版本）
fnm exec --using=20 node -v
fnm exec --using=20 npm ls -g --depth=0
```

`fnm use` 只影响当前 shell。新开的终端会用 `default` 别名对应的版本；想让某个项目固定版本，见下面的版本文件。

## 自动切换与版本文件策略

`fnm env --use-on-cd` 会在切换目录时自动执行 `fnm use --silent-if-unchanged`，但具体行为取决于两个参数：

### `--use-on-cd`

进入包含 `.nvmrc` / `.node-version`（以及 `package.json` 的 `engines.node`，见下）的目录时，自动切到文件里指定的版本。

### `--version-file-strategy`

- `local`（默认）：只看当前目录里的版本文件。当前目录没有版本文件时不会触发切换，所以**离开项目目录后仍停留在项目版本**。
- `recursive`：从当前目录逐级向上查找版本文件；离开所有项目目录后，回退到 `default` 别名指向的版本（需要先设置过 `default`）。

```bash
# 开启递归查找
eval "$(fnm env --use-on-cd --version-file-strategy=recursive --shell zsh)"
```

### `--resolve-engines`

较新的 fnm 默认开启：当目录里没有 `.nvmrc` / `.node-version` 时，会读取 `package.json` 的 `engines.node`（semver 范围），使用满足条件的最新版本。想关闭就加 `--resolve-engines=false`。

## 项目中指定版本

在项目根目录放 `.node-version` 或 `.nvmrc`，内容可以是：

```text
20.11.1
```

也支持 `v20.11.1`、`20`（大版本）、`lts/*`、`lts/jod` 这类写法。

用命令生成 `.node-version`：

```bash
node --version > .node-version
```

查找顺序：同一目录下 fnm 先看 `.nvmrc`，再看 `.node-version`，最后才看 `package.json` 的 `engines.node`。

```bash
// 下载最新 LTS，lts-latest 自动指过去
fnm install --lts	
```

下载最新 LTS+指定default封装成一条命令写进 `~/.zshrc`

```bash
# 一键更新到最新 LTS：fnm-lts
fnm-lts() {
  fnm install --lts || return 1
  fnm default lts-latest
  fnm use default
  echo "✅ 已切到 $(node -v)"
}
```



## 共享 npm 全局模块

Node 的全局包默认装在“当前 Node 版本”的目录里，切换版本后就看不到之前装的包。有两种做法：

| 方式           | 命令                                    | 安装位置                                                       | 适用场景                                   |
| -------------- | --------------------------------------- | -------------------------------------------------------------- | ------------------------------------------ |
| 默认（按版本） | `npm i -g <pkg>`                        | `$FNM_DIR/node-versions/vX.Y.Z/installation/lib/node_modules`  | 依赖原生模块、只在某个 Node 版本下用的工具 |
| 共享目录       | `npm i -g --prefix ~/.npm-global <pkg>` | `~/.npm-global/lib/node_modules`（bin 在 `~/.npm-global/bin`） | 跨版本都要用的纯 JS 工具（pnpm、serve 等） |

`$FNM_DIR` 的默认值一般是 `~/.local/share/fnm`，用 `fnm env --json` 查看实际路径。

共享目录需要自己加进 `PATH`：

```bash
# ~/.zshrc 或 ~/.bashrc
export PATH="$HOME/.npm-global/bin:$PATH"
```

补充：

- 路径名可以自定义，但建议统一用 `~/.npm-global`（连字符），别一会儿 `~/.npm-global`、一会儿 `~/.npm_global`。
- 不想每次都带 `--prefix`，可以执行 `npm config set prefix ~/.npm-global`。但这样**所有** `npm i -g` 都会装到共享目录，不再按 Node 版本隔离，按需取舍。
- 用 `npm root -g` 查看当前全局模块目录，`npm prefix -g` 查看当前 prefix。
- 共享的包如果含原生模块（node-gyp、N-API ABI 相关），跨 Node 版本可能直接报错，这类包请按版本安装。
- 上面是 macOS / Linux 的目录结构；Windows 下 `--prefix` 的可执行文件直接放在 prefix 根目录，没有 `bin` 子目录。

## 修改 Node 下载源

```bash
# 单次生效
fnm install 20 --node-dist-mirror=https://npmmirror.com/mirrors/node

# 长期生效：写进 shell 配置
export FNM_NODE_DIST_MIRROR="https://npmmirror.com/mirrors/node"
```

注意：

- 镜像地址必须指向“包含 `index.json` 和 `vX.Y.Z/` 的目录”，也就是 Node 官方 `dist` 的镜像。
- `https://registry.npmmirror.com/` 是 **npm 包注册表**，不是 Node 二进制源，填进去会下载失败。
- 可用的镜像还有 `https://registry.npmmirror.com/-/binary/node`（和上面那个最终都指向同一个 CDN）。
- 环境变量和 `--node-dist-mirror` 二选一即可；临时切换用参数，长期用变量。

## 升级 fnm

```bash
# macOS（Homebrew）
brew update && brew upgrade fnm

# Windows
winget upgrade Schniz.fnm
scoop update fnm
choco upgrade fnm

# cargo 安装的（crates.io 有新版本时会更新）
cargo install fnm

# 脚本安装的（不会重复写 shell 配置）
curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell

# 确认版本
fnm --version
```

## 卸载 fnm

```bash
# 1. 先记下数据目录（Node 版本和别名都在里面）
fnm env --json | grep FNM_DIR

# 2. 卸载可执行文件（脚本安装的直接删掉对应目录里的 fnm 二进制）
brew uninstall fnm

# 3. 删除数据目录（用第 1 步得到的路径）
rm -rf "$HOME/.local/share/fnm"
```

数据目录的位置因安装方式和版本而异，常见的有：

- `~/.local/share/fnm`（新版默认）
- `~/Library/Application Support/fnm`（macOS 脚本安装）
- `~/.fnm`（旧版本）

删除前建议确认目录里只有 `node-versions`、`aliases` 等内容，别误删其他东西。

最后删除 shell 配置里由 `fnm env` 生成的内容，形如下面这样（路径、`arch` 因人而异，关键是删掉整段由 fnm 生成的 `export` 和 hook，不要动其他无关的 `PATH` 配置）：

```bash
export PATH="/Users/you/.local/state/fnm_multishells/49559_1670052262156/bin":$PATH
export FNM_MULTISHELL_PATH="/Users/you/.local/state/fnm_multishells/49559_1670052262156"
export FNM_VERSION_FILE_STRATEGY="local"
export FNM_DIR="/Users/you/.local/share/fnm"
export FNM_LOGLEVEL="info"
export FNM_NODE_DIST_MIRROR="https://nodejs.org/dist"
export FNM_RESOLVE_ENGINES="true"
export FNM_COREPACK_ENABLED="false"
export FNM_ARCH="arm64"
rehash
```

如果之前用过 `--use-on-cd`，还会多出 hook 脚本，例如 zsh 的：

```bash
autoload -U add-zsh-hook
_fnm_autoload_hook() {
  if [[ -f .node-version || -f .nvmrc || -f package.json ]]; then
    fnm use --silent-if-unchanged
  fi
}
add-zsh-hook -D chpwd _fnm_autoload_hook
add-zsh-hook chpwd _fnm_autoload_hook
```

bash 的则是 `__fnmcd` 函数和 `alias cd=__fnmcd`，一起删掉即可。

`fnm_multishells` 软链接目录（一般在 `~/.local/state/fnm_multishells`）删不删都行，每个新 shell 会重新生成。

## 移除 nvm

在移除之前，先看看 nvm 下装了哪些全局包，然后换到 fnm 里重装：

```bash
nvm use 16
npm list -g --depth=0
```

删除 nvm 的安装目录（默认是 `~/.nvm`）：

```bash
rm -rf "${NVM_DIR:?NVM_DIR is not set}"
```

再删掉 shell 配置里与 nvm 相关的行：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                    # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

## 其他常用配置

```bash
# 每次安装 Node 后自动执行 corepack enable
export FNM_COREPACK_ENABLED=true
# 或单次安装时开启
fnm install 20 --corepack-enabled

# 查看 fnm 会导出哪些环境变量（调试用）
fnm env --json

# 安装 shell 补全（把输出按对应 shell 的方式加载）
fnm completions --shell zsh
```

## 注意

1. **不要手动设置或抄写 `FNM_DIR`、`FNM_MULTISHELL_PATH` 这类变量**，它们由 `fnm env` 自动生成。要改安装目录，用 `--fnm-dir`（或在 `fnm env` 之前设置 `FNM_DIR`），并且只在一处设置；装完再改会“丢”掉已安装的版本和别名。
2. **`fnm use` 只影响当前 shell**。新终端使用 `default` 别名；要固定项目版本，用版本文件或 `fnm default`。
3. **没有版本文件时**，`local` 策略下 `fnm use` 会报错；`recursive` 策略下会回退到 `default`（前提是设置过 `default` 别名）。
4. **IDE / GUI 程序可能找不到 fnm 管理的 Node**。VS Code、JetBrains 等不一定加载 shell 配置，可以在设置里直接指向 `fnm exec --using=20 which node` 输出的路径，或指向 `$FNM_DIR/node-versions/vXX/installation/bin/node`。
5. **注意 PATH 顺序**。如果同时用 Homebrew 的 `node`，`eval "$(fnm env ...)"` 应放在 `brew shellenv` 之后；用 `which -a node` 检查到底命中了哪个。
6. **Windows 注意**：`winget install` 之后要开新终端才生效；PowerShell 如果禁止执行 profile，需要调整执行策略（如 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`）；cmd.exe 需要额外的 autorun 脚本，建议直接用 PowerShell 或 Git Bash。
7. **下载很慢或失败**：优先配 `FNM_NODE_DIST_MIRROR`（见“修改 Node 下载源”），必要时加 `--progress never` 减少进度条干扰（CI 里也适合）。
