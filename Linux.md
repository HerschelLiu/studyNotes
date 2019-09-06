# 更换Linux软件源并更新软件（windows的Linux子系统，Ubuntu)

使用 Ubuntu /debian 系最大的好处就是可以使用「软件源」进行软件安装，使用 Ubuntu 自带的 deb 包管理系统安装软件可以减少直接下载源码编译的麻烦，所以这里就要用到「apt-get」系列命令了。

因为默认的软件源是 Ubuntu 的官方源，我们可以选择替换为国内的软件源，比如说阿里云镜像的软件源。在当前命令行下面输入：

```
sudo -i 
```

提权后输入密码，使用 root 权限登录。然后接下来备份当前源，输入以下命令：

```
cp /etc/apt/sources.list /etc/apt/sources.list.old
```

不难看出管理源的文件就是 sources.list，我们选择编辑它，编辑器我这里选用的是 vim，所以命令是：

```
vim /etc/apt/sources.list
```

使用 vim 后会进入命令模式，敲键盘上的 「i」键键入编辑模式，然后复制下面这段代码（拷贝代码，然后在编辑器上鼠标右击就可以复制）：

```text
# deb cdrom:[Ubuntu 16.04 LTS _Xenial Xerus_ - Release amd64 (20160420.1)]/ xenial main restricted
  deb-src http://archive.ubuntu.com/ubuntu xenial main restricted #Added by software-properties
  deb http://mirrors.aliyun.com/ubuntu/ xenial main restricted
  deb-src http://mirrors.aliyun.com/ubuntu/ xenial main restricted multiverse universe #Added by software-properties
  deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted
  deb-src http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted multiverse universe #Added by software-properties
  deb http://mirrors.aliyun.com/ubuntu/ xenial universe
  deb http://mirrors.aliyun.com/ubuntu/ xenial-updates universe
  deb http://mirrors.aliyun.com/ubuntu/ xenial multiverse
  deb http://mirrors.aliyun.com/ubuntu/ xenial-updates multiverse
  deb http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse
  deb-src http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse #Added by software-properties
  deb http://archive.canonical.com/ubuntu xenial partner
  deb-src http://archive.canonical.com/ubuntu xenial partner
  deb http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted
  deb-src http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted multiverse universe #Added by software-properties
  deb http://mirrors.aliyun.com/ubuntu/ xenial-security universe
  deb http://mirrors.aliyun.com/ubuntu/ xenial-security multiverse
```

完成之后再敲键盘上的「esc」退出编辑模式，然后再输入`:wq`点击保存并退出编辑器 vim。

紧接着我们更新软件源让编辑的文件生效：

```
apt-get update
```

这里我们就将 Ubuntu 的软件源切换到阿里云的源了。

之后再输入：`apt-get upgrade` 对当前系统的软件和类库进行来更新。如果不出意外系统会自动对现有的软件包进行更新，经过这一系列的操作，目前 Ubuntu 的软件以及类库都是最新的，而系统版本也升级到 Ubuntu 16.04.4 LTS。