```javascript
// 1、引入
var mysql = require('mysql');
// 2、创建连接对象 （与数据库建连接）
var options = { //数据库地址
    protocol: 'http', //默认http
    hostname: 'localhost', //默认 localhost
    port: 3306, //默认 3306
    user: 'root',
    password: '10086',
    database: '1606a'
}
var con = mysql.createConnection(options);
// 连接数据库
con.connect(function (err) {
    if (err) {
        throw err;
    }
});
// 操作数据表
con.query('delete from where id=1', function (err, result, field) { 
    if (err) {
        throw err;
    }
    console.log(result);
    
 });
```

1、下载+引入

require ('mysql');

2、创建连接对象  var con=mysql.createConnection({数据库地址})

3、连接数据库  con.connet(function(err){})

4、操作数据表  con.query(sql,[arr],function(err,result,filed){})

5、断开连接 con.end()

**连接池**

连接池的思想就是在系统初始化的时候，将数据库乱接作为对象储存在内存中，

当用户需要访问数据库时，并非建立一个新的连接。而是从连接池中取出一个已经建立的空闲连接对象；使用完毕后，用户也并非将连接关闭，而是将连接放回连接池中，以供下一个请求访问使用

```javascript
var pool = mysql.createPool({
    protocol: 'http',
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: '1606a'
})
```

步骤：

1、下载+引入 mysql

2、创建连接池  var pool=mysql.createPool()

3、在请求发起时。从连接池中取出一个连接对象  pool.getConnection(function(err,con){}

4、利用连接对象操作数据表  con.query(sql,[arr],function(err,result,filed){})

5、将连接对象归还连接池  以供下一个连接对象使用  con.release()