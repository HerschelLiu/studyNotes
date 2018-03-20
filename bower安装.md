# 什么是bower
 是一个客户端技术的软件包管理器，他可用于搜索，安装和卸载如javascript
HTML、css之类的网络资源。其他一些建立在Bower基础之上的开发工具

# 准备工作
1. 安装node环境
2. 安装git，bower从远程git仓库获取代码包
# 全局安装bower‘
npm install -g bower

# 开始使用
使用`help`命令查看帮助
## 自定义包的安装路径
首先进入项目目录下，新建文件1.txt

然后命令行进入项目目录下，输入命令重命名该文件为.bowerrc：

> rename 1.txt .bowerrc

这个.bowerrc文件是自定义bower下载的代码包的目录，比如现在我的项目结构如下：
|- css
|- js
  |- app
  |- lib
那我的.bowerrc文件内容如下：
```
{
  "directory" : "js/lib"
}
```
## bower初始化
命令行进入项目目录中，输入命令如下：

> bower init
会提示你输入一些基本信息，根据提示按回车或者空格即可，然后会生成一个bower.json文件，用来保存该项目的配置
## 包的安装
下面终于开始安装需要的包了！
比如我要安装一个jquery，输入如下命令：

> bower install jquery --save

然后bower就会从远程下载jquery最新版本到你的js/lib目录下
其中--save参数是保存配置到你的bower.json

## 包的信息
比如我们想要查找jquery都有哪些个版本，输入如下命令：

> bower info jquery
会看到jquery的bower.json的信息，和可用的版本信息

## 包的更新
上面安装的是最新版的高版本jquery，假如想要兼容低版本浏览器的呢？
已经查到兼容低版本浏览器的jquery版本为1.11.3，下面直接修改bower.json文件中的jquery版本号如下：
```
  "dependencies": {
    "jquery": "~1.11.3"
  }
```
然后执行如下命令：

> bower update
bower就会为你切换jquery的版本了

## 包的查找
还有一个很重要的功能，就是包的查找，比如我想要安装bootstrap的某个插件，但是记不住名字了，就可以直接在命令行输入：

> bower search bootstrap
bower就会列出包含字符串bootstrap的可用包了

## 包的卸载
卸载包可以使用uninstall 命令：

> bower uninstall jquery