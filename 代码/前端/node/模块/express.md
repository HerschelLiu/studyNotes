```javascript
// express 是完全是由路由和中间件构成一个的web开发框架,非侵入式
// 1.下载+引入
var express = require('express');
// 2.实例化
var app = express(); //application
// 3.注册路由
app.get('/', function (req, res, next) {
    res.end('hello /');
});
// 4.监听端口号
var ser = app.listen(8899, function () {
    console.log(ser.address().port);

});
```

路由（Routing）是有一个URL(或者叫服务端路径)和一个特定的HTTP方法（GET,POST等）组成的，路由涉及到用用如何响应客户端对某个网站节点（客 户端的请求路径（的访问。

怎么去响应：当路由匹配时对客户端做出响应（执行回调函数）；

什么叫路由匹配：客户端的路径===服务器的路径且请求当时相同时，则路由匹配

htttp.createServer(function(req,res){})



app请求方式:get post all 



/ab?cd  匹配b   0-1

/ab+cd   匹配b 1-多

/ab*cd  匹配以ab开头 cd结尾的路径

```javascript
app.get('/src/:user/:age', function (req, res) { 
    res.end('hello');
 });
```

带冒号表示是变量

req.params提取路由路径参数

```javascript
// 3.注册路由
app.get('/user', function (req, res, next) {
    console.log('cb1');
    next(); // 将控制权交给下一个处理器函数
    next('route'); // 跳过当前处理器函数,直接将控制权交给下一个路由
}, function (req, res) { 
    res.end('cb');
 });
app.get('./user', function (req, res, next) { 
    res.end('user');
 });
```

跳转下一个路由  next(route);



next函数主要输用来确保所有注册的中间件被一个接一个的执行，如果我们定义的中间件中结了本次请求，那就不应该再调用next函数

```javascript
app.get('./user', function (req, res) {
   var obj = require('url').parse(req.url, true);
   var pathname = obj.pathname;
   var query = obj.query;
   console.log(pathname, query);
   res.end('ss');
});
```

路由定义由如下结构组成：app.METHOD(PATH,HANDLE).其中，app是一个expresss实例 ；

Method是某个HTTP请求方式的一个：PATH是服务器的路径 HANDLER是当路由匹配到时需要执行的函数

**响应方式**

res.download(文件路径)     提示下载文件  

res.json()  发送一个JSON格式的响应

res.jsonp()  发送一个支持jsonp的JSON格式的响应

res.redirect() 重定向请求



res.render()  渲染视图模板  数据文件





res.sendStatus 设置响应状态码，并将其以字符串形式作为响应体的一部分发送

res.sendFile  以八位字节流的形式发送文件  必须写绝对路径





post方式获取参数



 req.on("data")

转对象  querystring.parse()

app.route()创建路由路径的链式路由句柄 定义一个路径，拆分了多种请求方式

express.Router 创建模块化，可挂载的路由句柄



挂载至应用app.user([虚拟路径]，router)

**中间件**：

应用级中间件 绑定到app对象 使用app.user ()和app.METHOD() 三个参数

放在注册路由的下边

路由级中间件 router.user  router.method 



错误处理中间件app.user(function( err req res next){} ) 必须是这四个参数

该中间件会在路由中发生未预期异常时执行

```javascript
// 请求未注册的路由时该中间件会被执行
applicationCache.use(function (err, req, res, next) { 
    res.end('not found!');
 });
 // 该中间件会在路由中发生未预期异常时执行
 app.use(function (err, req, res, next) { 
     res.end('error');
  });
  app.listen(8080);
```

next(new Error('sss'));  将控制权交给下一个错误处理中间件

```
// 该中间件会在路由中发生未预期异常时执行
app.use(function (err, req, res, next) { 
    res.status(err.status || 500).send(err.message);
 });
```

内置中间件“：express 自带



1、该root参数指定从中提供静态资源的根目录，该函数通过req.path与提供的root目录相结合来确定要提供的文件

2、当找不到文件时，它不是发送404响应，而是调用next()调用下一个文件







第三方中间件：需要下载 

1、bodyParser中间件  post请求

bodyParser 中间件用来解析http请求体（post)

bodyParser.urlencoded 则用来解析我们通常的form表单提交的数据

当extended 为false的时候，键值对中的值就为‘String’或'Array'形式















三种渲染方式；





res.render()  渲染带数据

res.locals()

app.locals()



1、package.json  包管理文件（npm init）;

2、node_modules  存放第三方包的目录

3、app.js/main.js/index.js  主入口文件

4、views 存放视图模板 （user.html  index.ejs）

5、static /public  存放静态资源  （js,css,image,json）客户端js  在浏览器中运行的

6、routers 存放路由 （login.js  register.js）

7、config ->configMysql.js-> 数据库配置

​                       configRouter.js--->路由配置





express应用生成器

1、npm i express-generator -g

2、expess 文件夹名称

3、npm install   安装依赖