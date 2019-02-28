# 安装 #
+ npm install -g vue
  >全局安装vue
+ npm install -g vue-cli
  >全局安装vue-cli
---------------------------
# 项目准备

+ vue init webpack name
  > 创建一个基于webpack模板且名字为name的新项目。
	注意：你可以在你想要放文件的位置调出命令行，并写这行代码。
+ cd name
  > 进入到创建好的name文件夹内
+ 安装依赖
	-npm install
	  > 可以用cnpm
	-npm run dev
	  > 把地址复制进浏览器就好
--------------------------------------------

# 网页的文件要放在src文件夹中
# 运行项目就是 npm run dev,并且要注意，命令行窗口不能关

# 下载webpack（手动配置自己webpack，webpack+vue-loader）
在你想要的位置
`(c)npm install webpack webpack-dev-server`
这其实是两条命命令下载两个东西。这么写就直接两个都下在了