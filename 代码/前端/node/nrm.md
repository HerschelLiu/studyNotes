## 镜像源管理工具

nrm(npm registry manager )是npm的镜像源管理工具，有时候国外资源太慢，使用这个就可以快速地在 npm 源间切换

**2.安装nrm**

在命令行执行命令，npm install -g nrm，全局安装nrm。

**3.使用**

执行命令nrm ls查看可选的源。其中，带*的是当前使用的源，上面的输出表明当前源是官方源。

**5.切换**

如果要切换到taobao源，执行命令nrm use taobao。

**6.增加**

你可以增加定制的源，特别适用于添加企业内部的私有源，执行命令 nrm add <registry> <url>，其中reigstry为源名，url为源的路径。

> nrm add registry http://registry.npm.frp.trmap.cn/

**7.删除**

执行命令nrm del <registry>删除对应的源。

**8.测试速度**

你还可以通过 nrm test 测试相应源的响应时间。

> nrm test npm                                                               

------

**9 报错**

最近安装好npm时候，再安装nrm 后，

nrm ls 报错internal/validators.js:124 throw new ERR_INVALID_ARG_TYPE(name, ‘string‘, value)

解决方法

1、首先检查node.js是否安装成功，输入 node -v 若可查看版本号

若不一致则重新安装node.js。

node.js官方下载地址：[https://nodejs.org/en/download/](https://links.jianshu.com/go?to=https%3A%2F%2Fnodejs.org%2Fen%2Fdownload%2F)

2.查看npm是否安装成功，如下图成功，反之则重新安装

npm -v

3、报错截图中可见 cli.js文件中 第17行报错，

![img](https:////upload-images.jianshu.io/upload_images/13658013-4b06b0dfcac36348.png?imageMogr2/auto-orient/strip|imageView2/2/w/720/format/webp)

17行

按路径找到该文件：

打开文件找到报错的第17行，注掉原17行改为如图：

//const NRMRC = path.join(process.env.HOME, '.nrmrc');(注掉)

const NRMRC = path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.nrmrc');

再管理员模式运行cmd，输入nrm ls ：