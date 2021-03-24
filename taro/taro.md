[TOC]



## 安装&使用

```bash
# 1.安装脚手架
# 使用 npm 安装 CLI
$ npm install -g @tarojs/cli
# OR 使用 yarn 安装 CLI
$ yarn global add @tarojs/cli
# OR 安装了 cnpm，使用 cnpm 安装 CLI
$ cnpm install -g @tarojs/cli
# 查看 Taro 版本信息
npm info @tarojs/cli
# 项目初始化
taro init myApp

# 2.使用npx
# 项目初始化
npx @tarojs/cli init myApp


# 诊断项目的依赖、设置、结构，以及代码的规范是否存在问题，并尝试给出解决方案。
taro doctor

#快速创建新页面:能够在当前项目的pages目录下快速生成新的页面文件，并填充基础代码，是一个提高开发效率的利器。
Taro create --name [页面名称] 
```

## 编译&打包

没有`--watch `将不会监听文件修改，并会对代码进行压缩打包

* 微信小程序`npm run [dev|build]:weapp`
* 百度小程序``npm run [dev|build]:swan`
* 支付宝小程序`npm run [dev|build]:alipay`
* 字节跳动小程序`npm run [dev|build]:tt`
* QQ小程序`npm run [dev|build]:qq`
* 京东小程序`npm run [dev|build]:jd`

## 定义路径

在`config.index.js`加上如下代码

```
const path = require('path')

const config = {
	alias: {
		'@': path.resolve(__dirname, '../src') // 因为此文件在config文件夹中，路径这么写，或者写成path.resolve(__dirname, '..', 'src')
	}
}
```

