**[官网](https://github.com/nvm-sh/nvm#installing-and-updating)**

**安装时迁移全局包**

```bash
# 如果要安装新版本的 Node.js并从以前的版本迁移 npm 包：

nvm install node --reinstall-packages-from=node
```

请注意，重新安装软件包*不会显式更新 npm 版本* — 这是为了确保 npm 不会意外升级到新节点版本的损坏版本。

要同时更新 npm，请添加标志，如下所示：`--latest-npm`

```bash
nvm install 'lts/*' --reinstall-packages-from=default --latest-npm
```

或者，您可以随时运行以下命令，以获取当前节点版本上受支持的最新 npm 版本：

```bash   
nvm install-latest-npm
```



**卸载**

```bash
rm -rf "$NVM_DIR"
```

编辑（或其他 shell 资源配置）并删除以下行：`~/.bashrc`

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[[ -r $NVM_DIR/bash_completion ]] && \. $NVM_DIR/bash_completion
```



## 使用gitee源安装nvm

使用`gitee镜像`安装nvm到本地

```bash
git clone https://gitee.com/mirrors/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags` 
```

配置nvm环境变量

mac 在`～/.zshrc`

看过两种

官网

```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

百度查到的

```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"
```

