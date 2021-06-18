1、http ->操作服务的内置模块

var http=require('http')

console.log(http)

2、搭建服务

​     客户端

服务器（电脑）->被请求的一方

客户端（http)  发起请求的一方

客户端向服务器发起请求，服务器向客户端做出响应

服务器地址：协议（http/https)+域名（www.baidu.com/localhost）+端口（80/8080）+地址（/根路径的请求）+查询参数

`http://localhost:8080/patj?id=1&num=3`

地址栏参数 查询参数 查询入参



1、引入

var  http=require('http');

2、创建服务

http.createServer(function(request,response){

* (1)  ck什么时候执行：当客户端发起请求

* (2) ck执行次数与什么有关，与客户端的请求次数有关

```javascript
response.write('hello')

response.end();

}).listen(8080);

console.log(2)

```



require ->请求 ->客户端

```javascript
// 1.引入
var http = require('http');
//2.创建服务(1.接受请求2.返回数据)
var server = http.createServer(function (request, response) {
    // console.log(request.method);
    // 设置响应头信息
    response.writeHead(500, {
        'Content-Type': 'text/plain'
    }); // 纯文本

    // 4.设置响应内容 str/buffer
    response.write(JSON.stringify({
        id: 1
    }));

    // 5.结束响应
    response.end();
});
// 6.监听端口
server.listen(8080);
```

* 动态监听端口号

`console.log('port is:' + server.address().port);`

* 创建buffer 内容`response.write(Buffer.from('hello')`

* 设置响应内容并结束`response.end(Buffer.from('www'));`

1、引入  require 

2、创建服务 http.createServer(function(request,response){})

3、设置响应头信息（可省略）response.writeHead(状态码，[opt]）

4、设置响应内容（可省略）response.write(str/buf)'

5、结束响应  response.end(str/buf)

6、监听端口号 server .listen(port,[ck];

**特别重要** 当把html文件放到服务器环境下时，在页面中发起的每一次文件请求都会默认去该服务器下加载

跳转页面

```javascript
var path = require('path');
require('http').createServer(function (req, res) { 
    if (req.url === '/favicon.ico') {
        return;
    }

    var pathname = '';
    if (req.url === '/') {
        pathname = './www/index.html';
    } else {
        pathname = path.join(__dirname, 'www', req.url);
    }

    try {
        res.writeHead(200, {
            'content-type': 'text/html;charset=utf8'
        });
        res.end(require('fs').readFileSync(pathname));
    } catch (e) {
        res.writeHead(404, {
            'content-type': 'text/html;charset=utf8'
        });
        res.end('很抱歉,您访问的页面不存在!');
    }
 }).listen(8008);
 // 服务器接到每一条请求路径都以/作为第一个字符
```

**服务器接到每一条请求路径都以/作为第一个字符** 

> content-type
>
> text/plain 纯文本
>
> text/html;charset =utf-8
>
> text/css
>
> text/javascript
>
> application.json
>
> image/png
>
> image/gif
>
>
>
> buffer 代表一个缓冲区，存储二进制数据，是字节流，网络传输时，就传输的这种字节流，写文件时，也是写的字节流
>
>
>
> Buffer  方法
>
> Buffer.from ()
>
> Buffer.alloc()  创建
>
>
>
> Buffer.write ()  写入

get

```javascript
require('http').createServer(function (req, res) { 
    if (req.url === '/favicon.ico') {
        return;
    }

    var obj = {};
    req.url.split('?')[1].split('&').forEach(function (file) { 
        obj[file.split('=')[0]] = file.split('=')[1];
     });
     console.log(obj);
     res.end('hello');
 }).listen(8899);
```

post

```javascript
require('http').createServer(function (req, res) { 
    if (req.url === '/favicon.ico') {
        return;
    }

    req.setEncoding('utf-8');
    req.on('data', function (chunk) { 
        console.log(chunk);
        
     });
     res.end('hello');
 }).listen(8899);
console.log('port is:' + server.address().port);
```

```html
<form action="http://localhost:8899/src" method="post">
    <input type="text" name="user">
    <input type="password" name="pwd">
    <textarea name="text" id="" cols="30" rows="10"></textarea>
    <input type="submit" value="register">
</form>
```

end是get post都会触发的

```javascript
require('http').createServer(function (req, res) {
    if (req.url === '/favicon.ico') {
        return;
    }

    var str = '';
    req.on('data', function (chunk) {
        str += chunk;
    });
    req.on('end', function (chunk) {
        console.log(0);
    });
    res.end('hello');
}).listen(8899);
```

```javascript
// querystring 某块用于实现url参数字符串与参数对象的相互转换， 以及对参数进行解码 / 编码
var querystring = require('querystring');
var params = 'id=1&name=zs&pwd=123';
var obj = querystring.parse(params); 
{
    id: '1',
    name: 'zs',
    pwd: "123'
}
    var str = querystring.stringfy(obj);
    id = 1 & name = zs & pwd = 123
    var data = '{"name":"zs"}';
    console.log(JSON.parse(data);
```

编码解码

```javascript
var querystring = require('querystring');
var params = 'name=张三&sex=男';
console.log(querystring.escape(params));
```

#### 起服务 node-dev

语法:

1、querystring.parse(str,[分隔符&]，[分配符=]）;

```javascript
var querystring = require('querystring');
require('http').createServer(function (req, res) {
    if (req.url === '/favicon.ico') {
        return;
    }
    var obj = querystring.parse(req.url.split('?')[1]);
    res.end(JSON.stringify(obj));
}).listen(8080);
```

res.end()  参数只能是字符串或buffer

res.setHeader('content-type','text/palain;charset-utf8");  防止乱码

解析url

url 操作整条地址

querystring ？之后的参数



`http://localhost:8080/path?name=zs&pwd=123`

* `http://`协议protocol
* `localhost:8080`域名hostname
* `path`路径pathname
* `?name=zs&pwd=123`query查询参数

### ajax

1、创建对象

```
var  xml=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP‘）
```



2、连接服务器

`xml.open('get','.data.json',true)`

3、发送请求

`xml.send()`

4、接收服务器的响应值

```javascript
xml.onreadystatechange = function () {

    if (xml.readyState === 4) {

        if (xml.readyState === 200) {

            console.log(xml.responseText);

        }

    }

}
```



放在服务器环境下  读取文件

```javascript
res.writeHead(200, {
    'Access-Control-Allow-Origin': '*'
});// 设置服务器接受所有客户端发起的跨域访问
```

判断是对文件访问还是对接口访问

接口就是端口号后边加一个/



取后缀名  

`var  ext=path.extname(pathname)`