## Linux子系统

### Linux子系统开启

1. 点开设置->更新和安全->开发者选项->选择开发人员模式
2. 设置->应用->右侧,程序和功能->启用或关闭Windows功能->适用于Linux的Windows子系统
3. 重启电脑

### 修改下载镜像站点

 默认的国外下载镜像站点比较慢，换成国内阿里云的镜像站点。

​      配置文件在    /etc/apt/   目录下，进入该目录：  **cd /etc/apt/**

​      首先备份source.list，命令为： **sudo  cp  sources.list   sources.list.bak**  (sudo 是以root权限运行，需输入密码)

​       然后删除原先的source.list，命令为：**sudo rm sources.list**

​      最后编辑新的source.list, 命令为：**sudo vim sources.list** 

​       阿里云镜像站点： <https://developer.aliyun.com/mirror/>  找到Ubuntu后，找到相关配置示例,复制，

​      将对应版本的镜像网址复制到新的souces.list中（如16.04版本的内容复制一下，粘贴到上边vim 打开的sources.list中）

​      Esc退出编辑模式，然后shift+：后输入wq 保存

​      然后更新一下新的镜像源地址：**sudo apt update**  （需要一小段时间）

## oh-my-zsh配置

shell的类型有很多种，linux下默认的是bash，虽然bash的功能已经很强大，但对于以懒惰为美德的程序员来说，bash的提示功能不够强大，界面也不够炫，并非理想工具。

而zsh的功能极其强大，只是配置过于复杂，起初只有极客才在用。后来，有个穷极无聊的程序员可能是实在看不下去广大猿友一直只能使用单调的bash, 于是他创建了一个名为【oh-my-zsh麻省理工学院许可下发布的】的开源项目...

https://github.com/robbyrussell/oh-my-zsh

自此，只需要简单的安装配置，小白程序员们都可以用上高档大气上档次，压屎了勒 有idea感觉oh my zsh


关于 **oh-my-zsh** 插件的管理是很简单的，有两个插件目录，其中 **user** 为你的用户名：

- **/Users/user/.oh-my-zsh/plugins**: oh-my-zsh 官方插件目录，该目录已经预装了很多实用的插件，只不过没激活而已；
- **/Users/user/.oh-my-zsh/custom/plugins**: oh-my-zsh 第三方插件目录；快捷命令：`$ZSH_CUSTOM/plugins`

需要安装哪个插件，只需要把插件下载到上面任何一个目录即可，然后在 `~/.zshrc` 配置文件中的 `plugins` 变量中添加对应插件的名称即可

1. **安装任何包之前一定要先更新！**`sudo apt-get update`

2. 安装zsh`sudo apt-get install zsh`

3. 安装oh-my-zsh`sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"`

4. *如果 遇到证书类似问题*`apt-get install ca-certificates`

5. 自动启动zsh`vim ~/.bashrc`

   ```
   # If not running interactively, don't do anything

   // 新增 S
   if test -t 1; then
       exec zsh
   fi
   // 新增 E

   case $~ in
   ```

### 修改主题

```
vim ~/.zshrc
ZSH_THEME="agnoster(主题名)"
```

终端字体补全
`sudo apt-get install fonts-powerline`

客户端字体补
注意： *有些字符在windows 上无法显示，所以需要安装字体*
`nerdfonts.com`
选择  `Hack`

更新配置 或者重启终端
`source ~/.zshrc`

### zsh插件安装

#### 命令提示

```
cd ~/.oh-my-zsh/plugins/
mkdir incr && cd incr
wget http://mimosa-pudica.net/src/incr-0.2.zsh
vim ~/.zshrc 在文件末尾添加一句启动命令
source ~/.oh-my-zsh/plugins/incr/incr*.zsh 

刷新配置
source ~/.zshrc
```

#### 快捷导航

```
sudo apt-get install autojump
vim ~/.zshrc
plugins=(
  autojump
)
刷新配置
source ~/.zshrc
```

当使用传统cd出现如下错误时`autojump_chpwd:4: nice(5) failed: operation not permitted`

```
vim ~/.zshrc
添加下面一句
unsetopt BG_NICE
刷新配置
source ~/.zshrc
```
#### 语法检测

```
cd ~/.oh-my-zsh/plugins/
wget https://github.com/zsh-users/zsh-syntax-highlighting/archive/0.6.0.tar.gz
tar xf 0.6.0.tar.gz
mv zsh-syntax-highlighting-0.6.0 zsh-syntax-highlighting
vim ~/.zshrc
plugins=(
  zsh-syntax-highlighting
)
刷新配置
source ~/.zshrc
```

**解决权限问题**

一般启动时会出现zsh-syntax-highlighting权限问题`compaudit | xargs chmod g-w,o-w`

#### 自动完成

````
cd ~/.oh-my-zsh/plugins/
mkdir zsh-autosuggestions
wget https://github.com/zsh-users/zsh-autosuggestions/archive/v0.4.3.tar.gz
tar xf v0.4.3.tar.gz
mv zsh-autosuggestions-0.4.3 zsh-autosuggestions
vim ~/.zshrc
plugins=(
  zsh-autosuggestions
)
刷新配置
source ~/.zshrc
````

**建议重启终端**

**提示：**

安装插件流程就是把git压缩包解压到`~/.oh-my-zsh/plugins/`目录下。

目录名字改成与`plugins=(pluginName)`一致就可以。

注意目录下面不能再有目录，在二级目录下插件不生效。

如果要求插件包最新状态，可以到git源仓库下复制下载链接，更换`wget xxxxx.tar.gz`作者：欧薇娅链接：https://www.jianshu.com/p/3b2b3e2a3824

**注意**:移动的时候，注意目录名后面不要有斜杠

### 配置Cmder

1. 语言改为简体中文

2. 启动，环境：新增预定义的任务，名字为Ubuntu，勾选“新建控制台的默认任务”，任务参数跟其他的一样就好`/icon "%CMDER_ROOT%\icons\cmder.ico"`,最下面命令`set "PATH=%ConEmuBaseDirShort%\wsl;%PATH%" & %ConEmuBaseDirShort%\conemu-cyg-64.exe --wsl --distro-guid={子系统唯一标识符} -cur_console:pm:/mnt`

   子系统唯一标识符：在注册表(`regedit`)中查找

   `计算机\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Lxss`

   **小提示：**
   因为系统版本不同，注册表路径可能不完全相同。
   但后面路径 **xxx\Software\Microsoft\Windows\CurrentVersion\Lxss** 应该是相同的。