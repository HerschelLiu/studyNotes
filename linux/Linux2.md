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

在系统属性里面配置环境变量，将`Cmder.exe`所在文件路径添加至`Path`里

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

## 开启图形化界面

比起 Windows和 macOS，Linux 很多时候给普通用户都是冰冷的命令行形象，这让很多 Linux 初学者望而却步；但实际上 Linux 是可以使用我们所说的 GUI 图形化界面的，只不过图形化界面并没有默认安装，这里我尝试手动安装一个图形化桌面。

由于属于 Linux 子系统的限制，因此安装一些比较「重」的图形化界面组件会大量消耗系统资源，因此我选择较为轻量级的图形化桌面组件：MATE，也是 Ubuntu MATE 的默认桌面组件，当然另一个轻量级桌面 xfce 体验也不错。

首先在终端中输入以下命令安装 Mate 桌面：

```
sudo apt-get install mate-desktop-environment
```

这一步命令就是安装完整的 MATE 桌面，这个过程相当长，因为 WSL 默认没有桌面环境，对应的相关组件也没有安装，所以安装桌面会将相关的组件以及依赖都一并安装。

紧接着我们需要安装可以访问图形化界面的软件，这里使用图形化远程访问工具：VNC；你可以理解成 Windows 电脑中的远程访问。当然 VNC 服务端 WSL 也是不会默认安装的，所以需要输入以下命令安装：

```
sudo apt-get install vnc4server
```

安装完毕之后需要修改 VNC 的默认启动桌面，这时候输入：

```
sed -i 's$x-window-manager$mate-session$' ~/.vnc/xstartup
```

将默认启动桌面改成 Mate 桌面启动，然后输入：`vncserver` 启动服务端（第一次启动需要设置连接密码）。这里 WSL 端就基本设置完毕了。

之后我们需要在 PC 上安装 VNC 的客户端，我这里选择的是 Realvnc，然后直接选择 [Chrome 应用版本](https://link.zhihu.com/?target=https%3A//chrome.google.com/webstore/detail/vnc%C2%AE-viewer-for-google-ch/iabmpiboiopbgfabjmgeedhcmjenhbla%3Futm_source%3Dchrome-app-launcher-info-dialog)，在 Chrome 商店中添加为 Chrome 独立应用。

打开 realvnc 并在地址栏中输入：127.0.0.1:1 ，点连接并输入连接密码，如果不出意外，你就可以看到安装有 mate 桌面的 Ubuntu 界面了！

可视化桌面的终端里面，你可以输入 `sudo apt-get install firefox` 来安装 Firefox 浏览器，不一会儿你可以在左上角菜单栏的「Applications」中的「Internet」中找到 Firefox 浏览器啦！好了，接下来还能做什么就自己去探索吧！

## 一起动手做：搭建本地静态网站

经过以上的折腾，其实你应该对 WSL 有了比较清楚的认识了，其实对于很多开发者而言，WSL 最大的好处在于更接近项目生产环境，虽说 Windows 本身有 IIS 网页服务器可供选择。但目前大部分网站服务器系统都采用的是 Linux，而网页服务器也多是使用 Apache，所以在 WSL 在本机完成部署调试后可能会接近实际一些。所以这里我们做一个小实践：将开发好的一个静态网站部署到 WSL 里面并可以直接访问。

首先，我们要确保 WSL 中安装有 Apache 网页服务器，所以尝试安装（使用超级用户权限），在终端中输入：

```
apt-get install apache2
```

安装完毕之后在终端中输入以下命令开启 Apache 网页服务器：

```
service apache2 start
```

当终端里面显示诸如「 * Starting Apache httpd web server apache2」之后，打开本机的网页浏览器，访问：[http://127.0.0.1](https://link.zhihu.com/?target=http%3A//127.0.0.1/) ，当显示以下页面就表示 Apache 网页服务器已经生效！

接下来我们尝试将自己开发的静态网页项目传到对应的目录中，这里我们打开 Xftp 这个远程文件工具，连接到 WSL 这个站点，然后访问 /var/www/html 这个目录，然后将项目文件夹传到该目录下方。

例如我现在传过去的网页全景项目名为「xuyi」，那么传好后我打开浏览器，访问：[http://127.0.0.1/xuyi](https://link.zhihu.com/?target=http%3A//127.0.0.1/xuyi) 就可以看到做好的网页的效果啦！如果你是使用 chrome 访问的话，Wappalyzer 扩展还可以显示出当前网站项目使用的框架等。