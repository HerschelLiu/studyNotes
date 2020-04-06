[TOC]



[赋值自少数派]: https://zhuanlan.zhihu.com/p/34950508	"少数派"

 <font color="red">标注（成功）的为尝试通过的</font>

# 与 Windows 通讯

目前 **子系统** 与 **Windows** 之间通过以下两种方式进行通讯

> 1. 通过 `tcp` 协议进行通讯（简单点说就是用网络，端口都是通的）

> 1. 通过 `/mnt/【盘符】/目录` 的方式访问Windows目录
>    试过在Windows的资源管理器中直接对子系统环境目录下的文件所做的修改不能被子系统所识别，因此需要在bash下进行操作。

[在任何情况下，请勿使用Windows应用程序，工具，脚本，控制台等创建或修改Linux文件](https://links.jianshu.com/go?to=https%3A%2F%2Fblogs.msdn.microsoft.com%2Fcommandline%2F2016%2F11%2F17%2Fdo-not-change-linux-files-using-windows-apps-and-tools%2F)

# 使用Cmder替换cmd，让开发更高效

## 为什么要更换为cmder

在做项目时，有些时候我想复制控制台上面的代码时，**cmd**有的时候复制粘贴很麻烦，**Cmder**则不会，并且**Cmder**可以分屏多开窗口，可以设置窗口颜色,字体大小，并且很多快捷键和谷歌浏览器操作类似,等等很多功能。

## 官网下载地址:

> [http://cmder.net/](https://links.jianshu.com/go?to=http%3A%2F%2Fcmder.net%2F)

## 关于下载

进入官网以后，有**mini版**和**完整版**，建议完整版，完整版功能更齐全，还可以使用`git`，下载好解压文件包以后就可以使用。

## 关于cmder的一些配置

### 1. 配置环境变量:

在系统属性里面配置环境变量，将`Cmder.exe`所在文件路径添加至`Path`里（示例：F:\zhijiekeyong\cmder\）

### 配置右键快捷启动:

以管理员身份打开`cmd`，执行以下命令即可，完了以后在任意地方点击右键即可使用cmder

```cpp
// 设置任意地方鼠标右键启动Cmder
Cmder.exe /REGISTER ALL
```

### 界面效果的设置

首先使用`windows+alt+p`进入界面设置

### 为多个子系统配置启动

启动-》任务

新建一个，名字叫Ubuntu，勾选新窗口默认任务，任务参数跟{cmd::Cmder}一样就行

```
set "PATH=%ConEmuBaseDirShort%\wsl;%PATH%" & %ConEmuBaseDirShort%\conemu-cyg-64.exe --wsl --distro-guid={xxxxxxxxxxxxxxxxxxxxxx} -cur_console:pm:/mnt
```

xxx为子系统唯一标识符，每个人都不一样

在注册表(`regedit`)中查找

**`计算机\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Lxss`**下的

点击通用（general）选择你的启动任务或者带参数的shell，选择刚刚新建的

**提示**
Shift+Alt+number 快捷启动不同终端
number 代表数字1、2、3、·····

* 如果想把显示的“”变成“$”，就在cmder目录下cmder\vendor\clink.lua中找到 `local lambda`,把值改为“\$”

## 启用 SSH 并使用SSH 客户端登录（成功）

虽说通过 App 或者应用的形式在 Windows 10 上体验 Linux 是一个不赖的选择，但对于很多软件开发的朋友而言，使用 Windows 内置的 CMD 或者 PowerShell 来操作Linux 依旧有着很多不习惯。而最为关键的是当需要对文件进行操作时，使用交互命令远不如使用 SFTP 来的更为「简单粗暴」。因此只要通过配置 SSH 远程登录，就可以像管理远程服务器那样来操作这个 Linux 系统了。

首先，因为 Ubuntu 系统限制，所以我们需要可以为 root 用户设置新密码，这里输入：

```
sudo passwd root
```

配置好之后，未来使用 SSH 客户端或者 SFTP 客户端登录系统时，我们就可以直接使用 root 权限进行登录，就不用使用之前的 `sudo -i` 提权操作了。

其次按照常规，我们使用`cp` 命令将 SSH 相关配置文件进行备份：

```
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
```

之后使用 vim 编辑器编辑 「sshd_config」文件：

```
sudo vim /etc/ssh/sshd_config
```

键盘上点击 「i」后进入编辑模式，编辑并调整以下设置项：

```text
  Port 8022（因为 Windows 10 的 SSH 端口已经默认被占用，所以我换成了一个新的端口）
  （去掉前面的 #）ListenAddress 0.0.0.0
  UsePrivilegeSeparation no（原来是 yes 改成 no）（我没找到）
  PermitRootLogin yes(修改成 yes)
  (在前面加上 #)StrictModes yes
  PasswordAuthentication yes（原来是 no，改成 yes）
```

之后点击 「Esc」退出编辑模式，直接输入 `:wq` 退出并保存。

然后输入命令：`service ssh start` 启动 SSH（要root权限）。

如何验证已经可以访问呢？我们首先打开 SSH 客户端，比如我目前使用 Xshell，选择「新建会话」。

之后在新建的会话设置框的「连接」中添加如下内容：

```text
 名称：WSL（这个随便填）
  协议：SSH
  主机：127.0.0.1（本机环回接口）
  端口号：8022
```

之后在「用户身份验证」中输入验证方法，方法选择 「Password」，然后在输入用户名：root，密码选择刚才新设置的 root 密码，最后点击确定。

然后在左侧的会话管理器找到刚才设置的新会话，双击后如果显示如下图所示的界面就算是成功了！

除了使用 Xshell 这种 SSH 客户端进行服务器操作之外，还可以使用 Xftp 进行文件上传和管理，唯一的区别是在新建会话处，协议选择「SFTP」，端口号和之前 Xshell 使用的端口号一致即可，点击确认之后出现类似 FTP 管理的界面就算是成功了！这样你就可以使用更为直观的工具来访问 WSL 系统的文件目录。新建文件上传文件也变得更为简单。
