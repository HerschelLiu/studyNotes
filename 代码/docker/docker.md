## Docker名词解释

**镜像（image）：**docker镜像就好比是一个模板，可以通过这个模板来创建容器服务。通过这个镜像可以创建多个容器（最终服务运行或者项目运行就是在容器中）

**容器（container）：**Docker利用容器技术，独立运行一个或者一个组应用，通过镜像来创建。目前可以吧这个容器理解为一个简易的linux系统

**仓库（repository）：**就是存放镜像的地方。仓库分为共有仓库和私有仓库

## Docker安装

在 Ubuntu 上安装 Docker 非常直接。我们将会启用 Docker 软件源，导入 GPG key，并且安装软件包。

首先，更新软件包索引，并且安装必要的依赖软件，来添加一个新的 HTTPS 软件源：

```bash
sudo apt update
sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

使用下面的 `curl` 导入源仓库的 GPG key：

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

将 Docker APT 软件源添加到你的系统：

```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

现在，Docker 软件源被启用了，你可以安装软件源中任何可用的 Docker 版本。

01.想要安装 Docker 最新版本，运行下面的命令。如果你想安装指定版本，跳过这个步骤，并且跳到下一步。

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io
```

02.想要安装指定版本，首先列出 Docker 软件源中所有可用的版本：

```bash
sudo apt update
apt list -a docker-ce
```

可用的 Docker 版本将会在第二列显示。在写作这篇文章的时候，在官方 Docker 软件源中只有一个 Docker 版本（`5:19.03.9~3-0~ubuntu-focal`）可用：

```bash
docker-ce/focal 5:19.03.9~3-0~ubuntu-focal amd64
```

通过在软件包名后面添加版本`=<VERSION>`来安装指定版本：

```bash
sudo apt install docker-ce=<VERSION> docker-ce-cli=<VERSION> containerd.io
```

一旦安装完成，Docker 服务将会自动启动。你可以输入下面的命令，验证它：

```bash
sudo systemctl status docker
```

输出将会类似下面这样：

```bash
● docker.service - Docker Application Container Engine
     Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2020-05-21 14:47:34 UTC; 42s ago
...
```

当一个新的 Docker 发布时，你可以使用标准的`sudo apt update && sudo apt upgrade`流程来升级 Docker 软件包。

如果你想阻止 Docker 自动更新，锁住它的版本：

```bash
sudo apt-mark hold docker-ce
```

## 开启镜像

```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
#【docker run  设置项   镜像名  】 镜像启动运行的命令
# -d：后台运行，没有配置后台运行
# --restart=always: 开机自启
# -p端口映射 主机端口：被映射的docker容器端口，举例如下
docker run --name mynginx   -d  --restart always -p  88:80   nginx
# 查看正在运行的容器
docker ps
# 查看所有
docker ps -a
# 删除停止的容器
docker rm  容器id/名字
docker rm -f mynginx   #强制删除正在运行中的

#停止容器
docker stop 容器id/名字
#再次启动
docker start 容器id/名字

#应用开机自启，但是update函数不能够临时修改映射端口
docker update 容器id/名字 --restart=always
```

