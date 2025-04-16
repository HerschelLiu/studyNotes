## 开始

首先安装[oh-my-zsh](https://link.zhihu.com/?target=http%3A//ohmyz.sh/)，打开`~/.zshrc`文件找到`plugins=( git )`

> [alias](https://link.zhihu.com/?target=http%3A//man.linuxde.net/alias%3Foqnsle%3Docthb)命令用来设置指令的别名。我们可以使用该命令可以将一些较长的命令进行简化。使用alias时，用户必须使用单引号''将原来的命令引起来，防止特殊字符导致错误。

如果想要启用某个插件，装好之后直接修改

> plugins = (插件A 插件B 插件C ...)

Mac自带了zsh，Linux下安装oh-my-zsh需要先安装zsh

安装zsh(ubuntu)

```bash
sudo apt install zsh
```



安装oh-my-zsh

**注意：**mac默认使用的是zsh，安装oh-my-zsh会替换掉mac的`~/.zshrc`，在安装前请备份下自己加的配置

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

> 通过简单地修改omz的安装脚本，可以通过gitee的镜像下载omz并在之后用gitee进行更新。
>
> 可以使用以下方式，也可以使用上述方式，把链接改成gitee的install.sh链接
>
> 首先全部拷贝下网址中的代码，并在本地创建叫做install.sh的文件，将代码复制进该文件。
> [tools/install.sh · Gitee 极速下载/oh-my-zsh](https://gitee.com/mirrors/oh-my-zsh/blob/master/tools/install.sh)
>
> 在该脚本中有这样一段代码，指定了上游的仓库
>
> ```sh
> ZSH=${ZSH:-~/.oh-my-zsh}
> REPO=${REPO:-ohmyzsh/ohmyzsh}
> REMOTE=${REMOTE:-https://github.com/${REPO}.git}
> BRANCH=${BRANCH:-master} 
> ```
>
> 由于我们想要用gitee加速，所以应该将该代码改为
>
> ```sh
> ZSH=${ZSH:-~/.oh-my-zsh}
> REPO=${REPO:-mirrors/oh-my-zsh} 	# 修改
> REMOTE=${REMOTE:-https://gitee.com/${REPO}.git}  #修改
> BRANCH=${BRANCH:-master}
> ```
>
> 修改完成之后，在install.sh的文件夹下执行sh install.sh命令，即可加速安装omz。之后可以通过omz update命令更新omz。

国内源

- 使用 curl 安装

```bash
sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"
```

- 使用 wget 安装

```bash
sh -c "$(wget -O- https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"
```

> 或
>
> ```bash
> wget https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh
> ```
>
> 然后给`install.sh`添加权限：
>
> ```bash
> chmod +x install.sh
> ```
>
> 然后执行`install.sh`：`./install.sh`
> 如果发现很慢，可以修改为`gitee`：
> `vim install.sh`进入编辑状态：
> 找到以下部分：
>
> ```cmd
> # Default settings
> ZSH=${ZSH:-~/.oh-my-zsh}
> REPO=${REPO:-ohmyzsh/ohmyzsh}
> REMOTE=${REMOTE:-https://github.com/${REPO}.git}
> BRANCH=${BRANCH:-master}
> ```
>
> 然后将中间两行改为：
>
> ```cmd
> REPO=${REPO:-mirrors/oh-my-zsh}
> REMOTE=${REMOTE:-https://gitee.com/${REPO}.git}
> ```
>
> 

**手动更新**`omz update`

## 插件

下载插件仓库到oh my zsh 的 plugins 目录下，然后修改配置文件添加支持的插件：

```bash
vi ~/.zshrc

# i
plugins=(xxx xxx)

# esc :wq

source ~/.zshrc
```



### **git**

这个是装好[oh-my-zsh](https://link.zhihu.com/?target=http%3A//ohmyz.sh/)就默认已经开启的

查看所有的git命令[alias](https://link.zhihu.com/?target=http%3A//man.linuxde.net/alias%3Foqnsle%3Docthb)

```bash
~/.oh-my-zsh/plugins/git/git.plugin.zsh
```

```bash
# 终端内
ga == git add
gaa == git add --all
gb == git branch
gcmsg == git commit -m
gco == git checkout
ggl == git pull origin $(current_branch)
ggp == git push origin $(current_branch)
gm == git merge
gmom == git merge origin/$(git_main_branch)
gru == git reset --
gst = git status
```

其他别名([ohmyzsh/plugins/git at master · ohmyzsh/ohmyzsh (github.com)](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git))

### **z**

这个是oh-my-zsh默认就装好的，需要自己开启。还有一个`autojump`的插件和`z`功能差不多，`autojump`需要单独装，

如果z插件历史记录太多，并且有一些不是自己想要的，可以删除

```bash
z -x 不要的路径
```

### **vscode**

[官网](https://link.zhihu.com/?target=https%3A//github.com/Microsoft/vscode)，随着Visual Studio Code越来越火，用的人也越来越多，可以装一下这个插件

打开一个文件

> vs 文件路径

安装

```bash
git clone https://github.com/valentinocossar/vscode.git ${ZSH_CUSTOM:-~/.oh-my-zsh/cu
```

### **zsh-autosuggestions**

[官网](https://github.com/zsh-users/zsh-autosuggestions)，非常好用的一个插件，会记录你之前输入过的所有命令，并且自动匹配你可能想要输入命令，然后按`control+e`→补全

安装

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

### **zsh-syntax-highlighting**

语法高亮。[官网](https://github.com/zsh-users/zsh-syntax-highlighting)，命令太多，有时候记不住，等输入完了才知道命令输错了，这个插件直接在输入过程中就会提示你，当前命令是否正确，错误红色，正确绿色

安装

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

```bash
brew install zsh-syntax-highlighting
```



### **sudo**

偶尔输入某个命令，提示没有权限，需要加sudo，这个时候按两下ESC，就会在命令行头部加上sudo

### **themes**

自带，用来随时手动切换主题。在想要尝试各种主题的时候很实用，不需要一直改 zshrc 然后重载。

```bash
theme 主题名
```

### **gitignore**

自带，提供一条 gi 命令，用来查询 gitignore 模板。比如你新建了一个 python 项目，就可以用

```bash
 gi python > .gitignore 
```

### **git-open**

在浏览器中打开当前所在 git 项目的远程仓库地址。

```bash
git clone https://github.com/paulirish/git-open.git $ZSH_CUSTOM/plugins/git-open
```

### Pure

[pure prompt](https://link.zhihu.com/?target=https%3A//github.com/sindresorhus/pure)是[sindresorhus大神](https://link.zhihu.com/?target=https%3A//github.com/sindresorhus)开源的一款简洁快速的zsh prompt，简洁是因为它的只会提示**路径、git状态、git分支等必要的信息**，而不是又多又杂，快速是因为它检查git状态是异步检查的。

```bash
npm i -g pure-prompt
```

在`.zshrc`(打开Finder，进入当前用户目录，按下快捷键command⌘ + shift⇧ + .，即可显示当前文件夹中的隐藏文件，找到`.zshrc`)中在`source $ZSH/oh-my-zsh.sh`下添加如下代码

```
autoload -U promptinit; promptinit
prompt pure
```

**m1芯片mac通过上述方式无效：**使用手动方式

```bash
mkdir -p "$HOME/.zsh"
git clone https://github.com/sindresorhus/pure.git "$HOME/.zsh/pure"

# 在.zsh中加入
fpath+=$HOME/.zsh/pure
```



### Spaceship

Spaceship是一个功能强大的zsh的扩展，具体可以从官网查看https://denysdovhan.com/spaceship-prompt/

```bash
npm install -g spaceship-prompt
```

