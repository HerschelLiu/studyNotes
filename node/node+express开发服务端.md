## 一.准备工作

首先你需要Node环境

1. 安装Express

   ```bash
   npm install express -g
   npm install express-generator -g
   ```

2. 初始化项目

   ```bash
   cd 项目
   express 项目名称
   cd 项目跟目录
   npm install
   ```

   要使用cmd，powershell需要管理员权限

   /bin:用来启动应用（服务器）
    /public: 存放静态资源目录
    /routes：**路由**用于确定应用程序如何响应对特定端点的客户机请求，包含一个 URI（或路径）和一个特定的 HTTP 请求方法（GET、POST 等）。每个路由可以具有一个或多个处理程序函数，这些函数在路由匹配时执行。
    /views: 模板文件所在目录 文件格式为**.jade**
    目录app.js程序main文件 这个是服务器启动的入口

 ## 启动服务器

```bash
npm start
```

启动完成后终端将输出 node ./bin/www
在浏览器中访问 `http://localhost:3000/`

## 基本使用

```js
///=======路由信息 （接口地址）开始 存放在./routes目录下===========//
var indexRouter = require('./routes/index');//home page接口
var usersRouter = require('./routes/users'); //用户接口

app.use('/', indexRouter); //在app中注册routes该接口 
app.use('/users', usersRouter);//在app中注册users接口
///=======路由信息 （接口地址 介绍===========//



///=======模板 开始===========//
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
///=======模板 结束===========//
```

当我们在浏览器中 `http://localhost:3000/`访问调用的就是index中的接口

定义一个路由的基本格式为：



```js
app.METHOD(PATH, HANDLER)
```

其中：
app 是 express 的实例。
METHOD是HTTP 请求方法。
PATH 是服务器上的路径。
HANDLER 是在路由匹配时执行的函数。
以上的定义代表
在根路由 (/) 上（应用程序的主页）对 GET 请求进行响应：

**例子**

在users.js中加入以下代码

```js
var URL = require('url');
class User {
  constructor() {
    this.name;
    this.city;
    this.age;
  }
}

router.get('/getUserInfo', (request, response, next) => {
  var user = new User();
  var param = URL.parse(request.url, true).query;
  if (param.id == 1) {
    user.name = 'ligh';
    user.age = 1;
    user.city = '北京市'
  } else {
    user.name = 'SPTING';
    user.age = 1;
    user.city = '杭州市'
  }
  let res = { status: 200, data: user };
  response.send(JSON.stringify(res));
});
```



