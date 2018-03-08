# 命令：`npm run build`
# 启动`HTTP server`来运行打包的文件
 * 在根目录下创建`prod.server.js`文件，添加以下语句
 ```
 var express = require('express');
 var config = require('./config/index');

 var port = process.env.PORT || config.build.port;

 var app = express();

 var router = express.Router();

 router.get('/', function (req, res, next) {
  req.url = '/index.html';
  next();
 });

 app.use(router);

 var appData = require('./data.json');
 var seller = appData.seller;
 var goods = appData.goods;
 var ratings = appData.ratings;

 var apiRoutes = express.Router();

 apiRoutes.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  });
 });

 apiRoutes.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  });
 });

 apiRoutes.get('/ratings', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  });
 });

 app.use('/api', apiRoutes);

 app.use(express.static('./dist'));

 module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
 });

 ```
 * 在`config`目录下的`index.js`文件中的`module.exports`中的`build`中`productionGzipExtensions`后添加如下语句
   `port: 9000`
 * 在命令行输入`node prod.server.js`
 * 把兼通的端口网址用浏览器打开即可
 
# 将`config`目录下的`index.js`文件中的`module.exports`中的`build`中`productionSourceMap`的值改为`false`再重新打包，就可以关闭调试了