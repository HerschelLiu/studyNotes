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

##

## 数据库（mysql）

```bash
npm install mysql --save
```

新建`util/db.js`封装连接mysql

```js
const mysql = require('mysql');

// 新建mysql连接池
const pool = mysql.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '123',
  database: 'db_test'
})

// 连接数据库并查询
let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = { query }
```



## 注意事项

### linux子系统node+express

* 启动的网址还是localhost
* 最好给读写权限，不然不能创建文件夹`chmod -R 777 文件夹`

### post数据

使用body-parser解析post的数据

```bash
npm install body-parser --save
```

```js
// app.js
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
```

这样我们就可以通过 request.body 来拿到post 请求过来的 数据了

**注意：**如果是用express命令生成的，不需要它

### res.render、res.send、res.json

* res.json是先把对象序列化成了字符串类型然后在通过res.send发送出去，所以在数据处理中，res.json相对更全面！
* res.render应该是运行html模板的

### 解决跨域问题

```js
// CORS模块，处理web端跨域问题
const cors = require('cors')
app.use(cors())
```

### node热更新

安装热更新nodemon。安装完了之后关闭进程，输入nodemon app.js 开启nodemon