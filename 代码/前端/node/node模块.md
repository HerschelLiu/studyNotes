## nodemon

`npm i nodemon -g`

由于每次修改了js代码之后，都需要使用node命令重新启动服务器，这样不是太方便

我们可以通过nodemon这个小工具，来实现自动帮助我们重启

**nodemon使用**

`nodemon app.js // 启动服务器	`

## nrm的使用

`nrm：npm registry manager`（npm仓库地址管理工具）

**安装**`npm i -g nrm`

**查看当前镜像源`nrm ls 

**切换镜像源地址**`nrm use ** `

## MIME

## MIME的说明

[MIME 类型](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_Types)

- 1.MIME(Multipurpose Internet Mail Extensions)多用途Internet邮件扩展类型 是一种表示文档性质和格式的标准化方式
- 2.浏览器通常使用MIME类型（而不是文件扩展名）来确定如何处理文档；
- 3.常见的[mime类型](https://baike.baidu.com/item/MIME/2900607?fr=aladdin)
- 4.因此服务器将正确的MIME类型附加到响应对象的头部是非常重要的
- 5.通过响应头的`content-type`可以设置mime类型
- 6.如果没有给浏览器设置正确的mime类型，浏览器会根据响应的内容猜测对应的mime类型。
- 7.但是不能保证所以浏览器能够得到一致的效果。
- 对于服务器开发，需要给每一个响应都设置一个正确的mime类型

## mime模块的使用

nodejs核心并没有提供用于处理mime的模块。但是我们可以在`npm`上下载开发中遇到的第三方包。

安装：

```json
npm i mime
```

使用：

```json
// 引入mime模块
const mime = require('mine')
// 获取路径对应的MIME类型
console.log(mime.getType('.css'))
console.log(mime.getType('.html'))
console.log(mime.getType('.gif'))
...
// 也可以根据路径来生成指定的mime类型
console.log(mime.getType('http://127.0.0.1:3000/views/index.html'))
console.log(mime.getType('http://127.0.0.1:3000/views/index.css'))
console.log(mime.getType('http://127.0.0.1:3000/views/index.js'))
console.log(mime.getType('http://127.0.0.1:3000/images/aa.jpg'))
console.log(mime.getType('http://127.0.0.1:3000/images/aa.gif'))
```