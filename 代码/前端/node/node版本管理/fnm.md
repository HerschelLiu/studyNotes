## 安装

一键安装

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

在除了 macOS其他操作系统上，升级几乎与安装相同。为防止 shell 配置文件中出现重复，请添加 to install 命令。`curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell`

手动安装

```bash
# macOS/Linux
brew install fnm
# window winget
winget install  Schniz.fnm
# window scoop
scoop install fnm
# window chocolatey
choco install fnm

# window/macOS/Linux cargo
cargo install fnm
```

> 这种手动安装，需要自己配置环境变量
>
> ```bash
> # Bash .bashrc
> eval "$(fnm env --use-on-cd)"
> 
> # zsh .zshrc
> eval "$(fnm env --use-on-cd)"
> 
> # shell ~/.config/fish/conf.d/fnm.fish
> fnm env --use-on-cd | source
> 
> # powerShell Add the following to the end of your profile file
> fnm env --use-on-cd | Out-String | Invoke-Expression
> ```
>
> 也可以直接访问 [Releases · Schniz/fnm (github.com)](https://github.com/Schniz/fnm/releases)下载对应的 exe 文件

## 使用

```bash
# 安装最新的 LTS 版本
fnm install --lts

# 设置为全局默认版本
fnm default 18

# 仅当前环境
fnm use 18

# 查看本地已安装的版本
fnm ls

# 查看官方已发布的所有版本
fnm ls-remote | grep v16

# 速度慢的时候，可以切换到国内源
fnm install 16 --node-dist-mirror=https://npmmirror.com/mirrors/node

# 使用指定版本来执行某个全局命令
fnm exec --using=18 node -v

# 删除
fnm uninstall <version>
fnm uninstall <alias-name>

# 别名
fnm alias <指定版本号> <别名>

# 取消别名
fnm unalias <alias-name>
```

## 项目中指定版本

可以通过在项目根目录下添加 .node-version 或 .nvmrc 文件，并在其中指定版本

##  共享 npm 全局模块

配置统一的全局模块安装路径

```bash
mkdir -p ~/.npm_global
npm config set prefix ~/.npm_global
```

还需配置对于的 Shell 环境变量

```bash
echo "export PATH=~/.npm_global/bin:$PATH" >> ~/.zshrc
source ~/.zshrc
```

## 卸载 fnm

若是通过 `brew` 安装的 `fnm`，则：

```shell
$ brew uninstall fnm
```

接着，再移除 `~/.fnm` 目录。

```shell
$ rm -rf ~/.fnm
```

最后，移除 `bash` 或 `zsh` 的配置文件中与 `fnm` 相关的配置。比如：

```shell
export PATH="/Users/frankie/Library/Caches/fnm_multishells/49559_1670052262156/bin":$PATH
export FNM_VERSION_FILE_STRATEGY="local"
export FNM_DIR="/Users/frankie/Library/Application Support/fnm"
export FNM_NODE_DIST_MIRROR="https://nodejs.org/dist"
export FNM_MULTISHELL_PATH="/Users/frankie/Library/Caches/fnm_multishells/49559_1670052262156"
export FNM_ARCH="x64"
export FNM_LOGLEVEL="info"
autoload -U add-zsh-hook
_fnm_autoload_hook() {
  if [[ -f .node-version || -f .nvmrc ]]; then
    fnm use --silent-if-unchanged
  fi
}

add-zsh-hook chpwd _fnm_autoload_hook &&
  _fnm_autoload_hook

rehash
```

##  移除nvm

在移除之前，通过以下方式查看使用 `nvm` 所安装的全局包，然后切换到 `fnm` 安装一下：

```shell
$ nvm use 16
Now using node v16.14.0 (npm v8.3.1)

$ npm list -g
```

移除 `nvm` 的安装目录，通常是 `~/.nvm`。执行以下命令即可：

```shell
$ rm -rf "$NVM_DIR"
```

移除 `bash` 或 `zsh` 的配置文件中与 `nvm` 相关的配置。比如：

```shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" --no-use          # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion
```