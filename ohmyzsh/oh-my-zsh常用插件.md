## 开始

首先安装[oh-my-zsh](https://link.zhihu.com/?target=http%3A//ohmyz.sh/)，打开`~/.zshrc`文件找到`plugins=( git )`

> [alias](https://link.zhihu.com/?target=http%3A//man.linuxde.net/alias%3Foqnsle%3Docthb)命令用来设置指令的别名。我们可以使用该命令可以将一些较长的命令进行简化。使用alias时，用户必须使用单引号''将原来的命令引起来，防止特殊字符导致错误。

如果想要启用某个插件，装好之后直接修改

> plugins = (插件A 插件B 插件C ...)

## 插件

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

[其他别名]([ohmyzsh/plugins/git at master · ohmyzsh/ohmyzsh (github.com)](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git))

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

[官网](https://link.zhihu.com/?target=https%3A//github.com/zsh-users/zsh-autosuggestions)，非常好用的一个插件，会记录你之前输入过的所有命令，并且自动匹配你可能想要输入命令，然后按`control+e`→补全

安装

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

### **zsh-syntax-highlighting**

[官网](https://link.zhihu.com/?target=https%3A//github.com/zsh-users/zsh-syntax-highlighting)，命令太多，有时候记不住，等输入完了才知道命令输错了，这个插件直接在输入过程中就会提示你，当前命令是否正确，错误红色，正确绿色

安装

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~
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

