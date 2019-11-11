1. 使用`npm init`生成配置文件

2. 下载模块：mysql(主要)、express(主要)、body-parser( `body-parser`是非常常用的一个`express`中间件，作用是对post请求的请求体进行解析 )、cookie-parser、cors（ 解决跨域问题 ）、multer

3.  在文件夹下新建一个index.js文件 （可自定义文件名）,写入以下代码

   ```js
   const express = require('express')
   const app = express();
   
   app.listen(88, () => {
       console.log('----------服务启动----------\n');
   });
   
   app.get('/', (req, res) => {
       res.json('HelloWorld');
   });
   
   app.post('/', (req, res) => {
       res.json('post');
   });
   
   app.all('*', (req, res, next) => { // 这个支持所有的请求方式， *代表通配符，这样不管什么路径都能触发
    res.json('****');
       next();
   });
   
   /*
    * res.json这个方法是以json对象的形式返回去
    * res.send以页面的方式返回去
    * res.download以文件的方式返回去，前端请求会下载此文件
   */
   ```
   
   package.json的scripts字段是 自己定义脚本命令 ，可以增加`"start":"node index.js"`,可以使用hotnode模块，可以让node程序热更新`npm install -g hotnode`,必须是全局安装，之后改成`"start":"hotnode index.js"`,然后就可以使用`npm start`就可以

```js
// body-parser:使用下列两行代码，大部分场景都够用
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
```

