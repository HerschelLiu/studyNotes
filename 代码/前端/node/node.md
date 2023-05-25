node.js简介 （解析器）

1. 用js语言做后台开发 2.是javaScript的运行环境 3.对V8引擎的封装 （速度快，性能好）

2. 优势：  

      a. 性能高
      b. 由nodejs带来的编译工具为前端开发提供了便利。（gulp,webpack）
      c. 省开发成本

3. 特点     
4. 单线程异步非阻塞

    1. 异步 I/O        I是input输入   O是onput输出
    2. 事件与回调函数
    3. 单线程
    4. 跨平台
4.环境变量
		意义：将node.exe应用程序所在的绝对路径，添加到环境变量中，目的是使node可以在全局被							          访问到。
步骤：计算机属性-->高级系统设置-->高级-->环境变量-->系统变量-->path-->将node.exe所在的绝对路径添加到path环境变量中

cls清屏
exit 退出终端   process.exit
type + 文件名    读取文件内容
mkdir + 文件夹名  创建文件夹
npm config ls 查看配置文件
npm config set cache 修改下包的缓存路径
npm config set prefix 修改下包的真实路径
npm updata 更新包
npm rebuild 重装包
commonJS
1.commonjs是一种规范，因为js没有模块的功能，所以commonjs应运而生，他希望js可以在任何地方运行，不只是在浏览器中。
2.Nodejs是commonjs规范的实现
3.Node程序由许多个模块组成，每个模块就是一个js文件，Node模块采用了commonjs规范。
4.根据commonJS规范，一个单独模块就是一个js文件，也就是说，在一个文件定义的变量（这包括函数和类），都是私有的，对其他文件是不可见的。
5.(function(require，exports，module){
所有变量都包在匿名函数里，所以不会污染全局变量
})()
6.特点
​          1.所有代码都运行在模块作用域，不会污染全局作用域。
​          2.模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后在加载，就直接读取缓存结果。（require.cache）
  3.模块加载的顺序，按照其代码的顺序。


require
1.require命令是commonJS规范之中，用来加载其他模块的命令。
2.require命令的基本功能是，读入并执行一个JavaScript文件，然后返回该模块的module.exports对象，如果没有发现制定模块，会报错
3.根据参数的不同格式，require命令去不同路径寻找模块文件
如果参数字符串以“/”开头，则表示加载的是一个绝对路径的模块文件
如果参数字符串以“./”开头，则表示加载的是一个相对路径的模块文件（相对当前文件）
如果参数字符串不以“./” “/”开头，则表示加载的是一个默认提供的核心模块，（位于node的系统	  的安装目录中）或者位于各级node-modules目录的已安装模块 --> 第三包（全局安装或局部安装）
4.require发现参数字符串指向一个目录以后，会自动查看该目录的packone.json文件，然后加载main字段指定 的入口文件。如果packone.json文件没有main字段，则会加载该目录下的index.js文件作为入口文件。
module
1.每个模块内部，都有一个module对象，代表当前模块。
2.Node内部提供一个Module构建函数，所有模块都是Module的实例。
eg1:function Module(){
this.exports = {};
}
var module = new Module();
console.log(module.exports)
3.module属性：
1.module.id 模块的表示符，通常是带有绝对路径的模块文件名。
2.module.filename 模块的文件名，带有绝对路径。
3.module.loaded 返回一个布尔值，表示模块是否已经完成加载
4.module.parent 返回一个对象 /null，表示调用该模块的模块
5.module.children 返回一个数字，表示该模块要用到的其他模块。
6.module.exports表示模块对外输出的值
7.module.dirname 返回当前模块的相对路径 
4.CommonJS规定，每个文件的对外接口是module.exports对象。这个对象的所哟与属性和方法，都可以被其他文件导入，让调用require方法引入模块时，其实是加载模块的module.exports属性。
5.module.exports初始值为一个空对象。
exports
exports与module.exports的区别
exports只能抛出对象
module.exports可以抛出当前内容形式
原因：
当调用require加载模块时，实则加载的是当前模块的module.exports的属性值，和exports并无直接联系，exports只是为了使用方便，在module内部提供了一个变量，指向了module.exports。如果直接对exports赋值，则切断的两者的联系，exports将不再指向，module.exports，故只能采用exports.key = val的形式将其抛出。
模块缓存
require.cache  （容器 每个模块的缓存）
清除缓存
for(var i in require.cache){
delete require.cache[i]
   }
2.Object.keys(require.cache).forEach(function(file){
delete require.cache[file]
   })
npm 默认的包管理器
内置模块：node自带的模块，下载node时已存于本地硬盘的模块。（fs,http,path,url,querystring）
第三方包：存于npm官网中，需要下载，  www.npmjs.com，且必须放入node_modules目录下
npm 强大的包管理工具（负责包的上传，下载，卸载）
package.json 包管理文件 （包名，作者等） npm-init       version版本 author作者 dependencies依赖  main入口文件 description描述
scripts字段可以封装一些命令函数指令  {  start:指令------> 运行方式：npm start      自定义指令：指令-------->运行方式：  npm run 自定义指令}   多个指令之间用&隔开
6.没有window对象
下载：	
npm install 包名
npm install 包名 --save
npm install 包名 --S
 都会在package中生成dependencies依赖     生产环境   会下载依赖文件
npm install 包名 --save-dev
npm install 包名 --D
 都会在package中生成devDendencies依赖     开发环境   不会下载依赖文件
npm install 包名 --global
npm install 包名 -g
全局安装
npm root -g  查看npm全局路径
npm root	    查看本地路径
配置环境
加-g只能保证把包下载到npm root -g所指向的路径中（全局路径），并不能把包被全局访问到，则必须设置NODE_PATH环境变量（必须大写）
步骤：
环境变量--》系统变量--》新建NODE_PATH--》将npm root -g所返回的路径添加到变量值中
修改全局路径
1.找到npmrc文件直接进行修改  可以通过查看npm 的默认配置查找到npmrc的位置。
2.npm config set cache " " 更改下包的缓存路径
3.npm config set prefix " " 更改全局下载的第三方的存放路径
4.npm config ls 查看npm的默认配置（node存放位置，npmrc文件存放位置，当前执行文件位置）
​     批量下载包
1.命令行   npm install 包名1 包名2...
2.‘package.json
（1）手动添加 dependencies依赖 devdependencies依赖
（2）{
"包名1"："版本号"，
“包名2”：“版本号”
  }   *代表当前的最新版本
（3） npm install 批量下载包
卸载
本地：  npm uninstall 包名
全局： npm uninstall 包名 -g

 上传包
第三方包加载规则：以当前工作目录为基准依次向上查找
var ejs = require("ejs")  require加载第三方包，加载的实则是包内的某一个js文件，该文件被称为入口文件。
特点 
必须放置于node_modules           
必须配置入口文件 
入口文件必须提供对外的接口 module.exports
是个文件夹
入口文件
var a = require(./lib/a.js)  package.json
var a = require("./lib")   index.js(默认入口文件)

上传
1.本地登录   npm adduser第一次登录
​                    npm login  非第一次登录
2.发布      npm publish
注意：
发布包中必须有package.json文件，且文件中必须有name和version两个字段
发布的包不能与网上的包重名

3.卸载
注意：
发布的包24小时之内予以卸载
卸载后再次发布必须修改版本号 原始版本1.0.0
版本号修改规则
如果修复了上个文件的bug，则修改第三位版本号  1.0.1
如果新增了一些功能，且兼容上个版本，则修改第二位版本号 1.1.0
如果新增了一些功能且不兼容上个版本，则修改第一位版本号2.0.0
命令行程序
新建一个.cmd为后缀的文件
在文件中输入要执行的命令，并以%*结尾、   node + js文件的相对路径
输入@pause  防止程序执行完毕退出终端
双击运行


命令
1.安装包，默认会安装最新的版本 npm i package
2.安装指定版本 npm install package@version
3.-S, --save 安装包信息将加入到dependencies（生产阶段的依赖）
4.-D, --save-dev 安装包信息将加入到devDependencies（开发阶段的依赖），所以开发阶段一般使用它
5.-E, --save-exact 精确安装指定模块版本 (输入命令npm install gulp -ES，留意package.json 文件的 dependencies 字段，以看出版本号中的^消失了)
6.npm install 模块的依赖都被写入了package.json文件后，他人打开项目的根目录（项目开源、内部团队合作），使用npm install命令可以根据dependencies配置安装所有的依赖包
7.npm install package全局安装（global）,使用-g 或 --global
8.npm ls查看安装的模块
9.npm ls -g 查看全局安装的模块及依赖
10.npm uninstall 卸载模块
11.卸载模块
1) npm uninstall
2) 如卸载开发版本的模块 npm uninstall package --save-dev
12.npm update更新模块
13. npm outdated检查模块是否已经过时
   14.npm init在项目中引导创建一个package.json文件
   15.npm help 查看某条命令的详细帮助
   例如输入npm help install，系统在默认的浏览器或者默认的编辑器中打开本地nodejs安装包的文件

dejs

de_modules/npm

ml/doc/cli/npm-install.html
16. npm root查看包的安装路径 npm root -g查看包的安装路径
   17.npm cache clean --force 管理模块的缓存
17. npm view package 看到模块所有版本的信息
   cd\ ==》 根目录
   cd.. ==》返回上一级目录
   cd +文件目录 ==》进入文件目录
   退出终端==》exit 全称==》process.exit()
   清屏：cls
   新建文件夹  mkdir +文件夹名字
   查看当前文件下有什么目录 dir
   type + js

ml/css  =>查看文件内容


//封装
module.exports = {
//封装forEach
​    forEach: function(arr, cbc) {
​        for (var i = 0; i < arr.length; i++) {
​            cbc && cbc(arr[i], i)
​        }
​        return arr;
​    },
//封装map
​    map: function(arr, cbc) {
​        var newArr = [];
​        for (var i = 0; i < arr.length; i++) {
​            cbc && newArr.push(cbc(arr[i]))
​        }
​        return newArr;
​    },
//随机数 去重
​    randomArr: function(arr, len) {
​        var newArr = [];
​        for (var i = 0; i < len; i++) {
​            var sui = Math.floor(Math.random() * len);
​            newArr.push(arr[sui]);
​            arr.splice(sui, 1)
​        }
​        return newArr;
​    }
}
var arr = require('arr');
var arrs = [1, 2, 3, 4, 10, 6, 7, 8, 9, 20];

arr.forEach(arrs, function(item, index) {
​    console.log(item, index) //数据项， 索引
});

var newArr = arr.map(arrs, function(item, index) {
​    return 1 + item
});
console.log(newArr); //[2,3,4,5,11,7,8,9,21]
// //随机结果
var newArr = arr.randomArr(arrs, 5);
console.log(newArr); //[2,4,10,6,20]

XMLHttpRequest对象的使用
①建立XMLHttpRequest对象
②注册回调函数
③使用open方法设置和服务器端的交互的基本信息
④设置发送的数据，开始和服务器端进行交互
⑤在回调函数中判断交互式否结束，相应是否正确，并根据需要获取服务器返回的数据，更新页面内容。
对象与数组的互转
module.exports = {
​    parse: function(str) {
​        var obj = {};
​        str.split("&").forEach(function(file) {
​            var key = file.split("=")[0];
​            var val = file.split("=")[1];
​            obj[key] = val
​        })
​        return obj;
​    },
​    strify: function(obj) {
​        var str = "";
​        var arr = [];
​        for (var i in obj) {
​            arr.push(i + "=" + obj[i])
​            str = arr.join("&")
​        }
​        return str;
​    }
}

fs  操作磁盘文件的内置模块
var fs = require("fs") console.log(fs)
1.fs中每个方法都对应有同步异步两种，同步方法名以Sync结尾，异步支持回调函数
2.fs所有异步函数都没有返回值
1.fs读取文件
异步：
fs.readFile(文件路径，【str/obj】，function(err,data){
(1)if(err){
throw err;
}
console.log(data.toString()) //转为字符串
(2)if(err){
return console.error(err)
}
})
解释：
err ： null / {错误内容}
data: 文件内容/undefined
同步：
var data = fs.readFileSync(文件路径，【str/obj】)；//有返回值
2.fs写入文件
异步：fs.writeFille（文件路径，内容，【str/obj】，function(err){
if(err){
throw err
}
}）
同步：fs.writeFillSync（文件路径，内容，【str/obj】）
例子
小文件拷贝
异步：
fs.readFile("./index.html", "utf-8", function(err, data) {
​        if (err) {
​            throw err;
​        }
​        //写入文件
​        fs.writeFile("./new.html", data, function(err) {
​            if (err) {
​                throw err;
​            }
​            console.log(process.argv)
​        })
​    })


同步：
同步
​    var data = fs.readFileSync("./index.html", "utf-8");
​    console.log(data)



更换背景颜色
获取新颜色   node index color     newcolor = process.argv[2]
找到旧颜色 oldcolor
替换
fs.readFile("./index.css", "utf-8", function(err, data) {
​    if (err) {
​        throw err;
​    }
​    var newColor = process.argv[2];
​    console.log(newColor)
​    var oldColor = data.split(":")[1].split(";")[0];
​    data = data.replace(oldColor, newColor);
​    fs.writeFileSync("./index.css", data)

})
3.fs向文件内追加内容
异步  fs.appendFile(文件名，内容，function(err){
if(err){
throw err;
}
})
同步 fs.appendFileSync(文件名,内容)
4.fs读取文件夹
、异步： fs.readdir(文件夹名，function(err,paths){
if(err){
throw err;
}
paths.fotEach(function(file){
fs.readFile("./src/" + file,function(){})
})
})

同步 fs.readdirSync(文件夹名)     返回值为数组
5.fs创建文件夹（若存在。便报错）
异步： fs.mkdir("./文件夹名"，function(err){
if(err){
throw err;
}
})
同步： fs.mkdirSync("./文件夹名")
6.fs查看文件/文件夹是否存在 （返回布尔值）
异步：fs.exists("文件名/文件夹"，function(exist){
console.log(exist)
if(!exist){
//创建
}else{
}
})
同步： fs.existsSync("文件/文件夹名")
7.fs查看文件/文件夹信息（返回查看文件或文件夹的内容）
异步：fs.stat("文件/文件夹"，function(err,st){
st.isFile()是否为文件
st.isdirectory()是否为文件夹
})
同步 fs.statSync("文件/文件夹")
​      
流（node.js的移动数据的方式 可读可写）
特点：由于数据是流，这就意味着在完成数据读取之前，从收到的最初几个字节开始，就可以对数据动作。
简介：
流是nodejs中一个非常重要的概念 也是nodejs之所以适用于I/O密集型场景的重要原因之一
流是nodejs移动数据的方式 流可以是可读/可写的 在nodejs很多模块中都用到了流 包括http和fs模块
由于一次性读取在写入的方式不适用大文件拷贝 容易造成内存爆仓 对于大文件 我们只能读一点写一点直至拷贝完成
由于数据是流 这就意味着在完成文件读取之前 从收到最初几个字节开始 就可以对数据动作
drain时间来判断什么时候只写数据流已经将缓存的数据写入目标 可以传入下一个待写数据
流的原理：
var fs = require("fs");
var rs = fs.createReadStream("./src/2.mp4"); //读取
var ws = fs.WriteStream("./list/1.mp4"); //写入
rs.on("data", function(chunk) {
​    if (!ws.write(chunk)) {
​        //读完 未写完 暂停读取
​        rs.pause();
​    }
})
ws.on("drain", function() {
​    //当流读取完 中断时
​    //循环读取
​    rs.resume()
})
rs.on("end", function() {
​    //读取完成之后 停止写
​    ws.end();
})															
流的可读可写
1. 创建一个可读数据流
  var rs = fs.createReadStream
2. 创建一个可写数据流
  var ws = fs.createWriteStream
3. 管道流输出
  rs.pipe(ws）
   if (!exist) {
   	   fs.mkdirSync("./list/big")
  ​         var data = fs.createReadStream(beginName);
  ​         var path=fs.createWriteStream("./list/big/2.mp4")
  ​         data.pipe(path)
  ​        } else {
  ​           var data = fs.createReadStream(beginName);
  ​           var path = fs.createWriteStream("./list/big/2.mp4")
  ​           data.pipe(path)
  ​        }
  path(操作磁盘路径的内置模块)
  path.normalize()  格式化路径 将不标准路径转为标准路径
  path.delimiter   提供特定平台的路径分隔符   
  ;对于windows
  ：对于POSIX
  3.path.extname(index.html)  获取文件的后缀名   //html
  当参数没有 . 或只有一个 . 或以 . 开头则都返回空字符串
  以 . 结尾   则返回 . 
  4.path.join() 可以穿0 - 多个参数
  使用平台特定分隔符将所有给定的段连接在一起，然后对结果路径进行规范化
  5.path.dirname()  返回代表文件夹的部分
  6.path.basename（path,[后缀名/可选文件拓展名]） 返回路径的最后一部分
  7.path.resolve() 0-多个参数  将一系列路径或路径段解析为绝对路径
  --dirname  当前所在的js文件的绝对路径
  path.resolve（） node执行的js的绝对路径（当前工作目录）
  特点：
  如果没有path段传递，path.resolve（）将返回当前工作目录的绝对路径
  如果在处理所有给定path段之后，还没有生成绝对的路径，则使用当前工作目录进行追加
  路径从右到左依次追加，查找到绝对路径则停止追加，直接返回
  8.path.isAbsolute() 是否返回绝对路径
  9.path.parse(obj)  字符串 ------》 对象
  10.path.format(str) 对象 -------》 字符串
  如果存在 dir，则忽略 root
  如果存在 base ， 则忽略ext 和 name
  整条路径 = path.dirname + path.basename
  http（操作服务的内置模块）
  步骤：
  //1引入
  var http = require("http")
  //2搭建服务器
  var server = http.createServer(function(request,response){	
    //回调函数什么时候执行   当客户端发起请求时被执行
    //回调函数执行的次数与客户端的请求次数有关系
    //3设置响应头信息
    response.writeHead(200,{
  ​      "content-type":"text/html"
    })
    //4 设置响应内容
    response.write('<h1 style = "color:red;">hello world</h1>'); //str/buffer
    //5 结束响应  ！！！！！！必须！！！！！！！结束响应，否则客户端请求会一直挂起
    response.end();
  })
  //监听端口号
  server.listen(8080,function(){
    //打印端口号
    console.log(server.address().port)
  })
  访问服务器：
  在浏览器地址栏输入服务器地址进行访问
  服务器地址---》协议 http/https + 域名localhost + 端口 + 路径
  http://localhost:8080/
  request.url 请求路径
  request.method 请求方式
  request ---》 请求对象 ---》客户端提供
  请求对象是由客户端提供给服务器的，里面包含了与客户端请求相关的一些信息，例如：请求路径，请求方式，请求头等，在客户端向服务器端发起请求时该对象被发送给服务器，服务器会拿到对象进行解析，从而返回给客户需要的数据。
  content-type解析类型
  text/plain 纯文本
  text/html
  text/css
  text/JavaScript
  image/png
  image/gif
  application/json
  1.当把html文件放到服务器环境下，那么文件夹中发起的请求都会去该服务器下寻找
  2.服务器接到的每个请求路径都是以 / 开头的
  var http = require("http");//服务器搭建
  var fs = require("fs");
  var path = require("path")
  var server = http.createServer(function(request, response) {
    if (request.url === "/favicon.ico") {
  ​      return;
    }  //或者不用判断 上传一张名为favicon.ico的图片
    response.writeHead(200, //状态码{
  ​      "content-type": getType(request.url) || "text/html;charset=utf-8'"//当不满足所有条件时，默认
    })
    var bgname = "";
    if (request.url === "/") {//如若是默认路径/ 则进入index.html
  ​      bgname = "index.html";
    } else {
  ​      bgname = path.join(__dirname, request.url)//否则进入发起请求的页面
    }
    	var data = fs.readFileSync(bgname);
  ​      response.write(data)
  ​      response.end();
    })
  })
  server.listen(8080, function() {
    console.log(server.address().port)
  })

function getType(url) {
​    var ext = path.extname(url);
​    switch (ext) {
​        case "":
​        case ".html":
​            return 'text/html;charset=utf-8';
​        case ".css":
​            return 'text/css';
​        case ".js":
​            return 'text/javascript';
​    }
}

捕捉同步异常
try{}catch(e){}
例如
try {
​        response.writeHead(200, {
​            "content-type": getType(request.url) || "text/html;charset=utf-8'"
​        })
​        response.end(fs.readFileSync(bgname));
​    } catch (e) {
​        response.writeHead(404)
​        response.end("not found");
​    }
get   请求方式 -----》     req.url
var obj = {};
​    if (req.method === "get") {
​        req.url.split("?")[1].split("&").forEach(function(file) {
​            obj[file.split("=")[0]] = file.split("=")[1]
​        })
​        res.end("hello" + obj.name)
​    }
if (req.method === "GET") {
​        var obj = url.parse(req.url, true).query;
​        var user = obj.name;
​        res.end(JSON.stringify({ "mes": "hello:" + user }))
​    } 
post  请求方式 -----》 
req.on（“data”，function（）{}）
​    req.on（“end”，function（）{}）
监听body体中传递的数据    （传值时触发------》 异步）
else if (request.method === "post") {
​        var str = ""
​        req.on("data", function(chunk) {
​            str += chunk;
​        })
//console.log(str) 
//空字符串   原因：函数回调是异步的，而post是在传值时触发的，在这段时间内，先输出了str，所以是空字符串
​        req.on("end", function() {
​            str.split("&").forEach(function(file) {
​                obj[file.split("=")[0]] = file.split("=")[1];
​            })
​            res.end("hello" + obj.name)
​        })
​    }
else if (req.method === "POST") {
​        var str = ""
​        req.on("data", function(chunk) {
​            str += chunk;
​        })
/空字符串   原因：函数回调是异步的，而post是在传值时触发的，在这段时间内，先输出了str，所以是空字符串
​        req.on("end", function() {
​            var obj = querystring.parse(str);
​            var user = obj.name;
​            res.end(JSON.stringify({ "mes": "hello:" + user }))
​        })
​    }
//post事件触发的次数和前端传来的数据的大小有关，当前端传输的数据的量较大时，会将数据分段传送，每发一段，该事件就会被触发一次


post请求加一个设置头部
xml.setRequestHeader("content-type", "application/x-www-form-urlencoded");


querystring 
querystring模块用于实现url参数字符串与参数对象的互相转换，以及对参数进行编码解码。
querystring.parse()     字符串转对象
querystring.stringify()  对象转字符串
//有三个参数
参数1：对象/字符串
参数2：分隔符
参数3：分配符
querystring.escape（）  编码（符号和汉字）
querystring.unescape（） 解码
url 
  url模块允许解析url，生成url
url.parse(address,true)  默认false，加true是可以把query由一个string转为object


适用场景
​                                               转对象                       转字符串                适用场景
​            path parse format 磁盘路径（后缀名，文件名）
querystring parse stringify 操作查询参数name=zs&age=20
url parse format 操作整条url地址
JSON parse stringify JSON数据
 xml
var xml = window.XMLHttpRequest ? new XMLHttpRequest() : newActiveXObject('Microsoft.XMLHTTP');
​    xml.onreadystatechange = function() {
​        if (xml.readyState === 4) {
​            if (xml.status === 200) {
​                console.log(xml.responseText)
​            }
​        }
​    }
​    xml.open('post', 'http://localhost:8000/?name=zs&age=20', true);
​    xml.send("name=zs&age=20");
ajax请求详细注释
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
http.createServer(function (req, res) {
​    // /favicon.ico是谷歌浏览器默认发起的网站图标请求，所有的请求路径都是以/作为第一个字符，所以此处不能写成 favicon.ico或 ./favicon.ico
​    if (req.url === '/favicon.ico') {
​        return;
​    }
​    // 拆分地址，分别把协议、域名、端口等拆分出来，没有的部分，值是null
​    var obj = url.parse(req.url);
​    // pathname是地址（协议+域名+端口+路径+参数）中代表路径的部分
​    var pathname = obj.pathname;
​    // 如果客户端请求的是服务器根路径的话，返回index.html文件作为网站的首页
​    if (pathname === '/') {
​        res.end(fs.readFileSync('./www/index.html'));
​    } else {
​        // 走进else中的分别是index.html里链接的静态资源(css,js,img)以及ajax请求
​        // /style.css
​        // /timg.jpg
​        // /getData
​        // /a.html
​        // 如果是对于文件的访问的话，服务器需要读取文件并返回，如果是对于ajax的访问的话，服务器要返回相应的json数据，所以对于两种类型的访问，返回的数据也不同，故此要加以判断，根据两者的不同作为条件，返回不同的数据
​        // 不同点：文件有后缀名，ajax请求的路径不带后缀名
​        // 因为req.url可能带有地址栏参数，会影响后缀名的获取，所以，去pathname的后缀名
​        var ext = path.extname(pathname);
​        // 如果没有后缀名,那么ext是空字符串
​        if (ext) {
​            // /style.css /timg.jpg /a.html 文件路径./www/
​            // 因为是根据请求路径去服务器读取文件，而pathname的值是由客户端决定，所以，客户端请求的文件服务器不一定存在，那么，就要在不存在的时候友好的返回异常信息
​            try {
​                res.end(fs.readFileSync(path.join(__dirname, 'www', pathname)));
​            } catch (e) {
​                res.writeHead(404, {
​                    'Content-Type': 'text/plain;charset=utf-8'
​                });
​                // req.setEncoding('utf-8'); // 当前端发起post方式的请求，并且传递数据时，服务器接到的是二进制数据，此方法是将客户端传来的二进制数据转为字符串
​                res.end('此页面不存在!');
​            }
​        } else {
​            // 对于ajax的请求，要返回json数据,end里只能放string / buffer，故此，要将json对象转化成json格式的字符串后再返回
​            res.end(JSON.stringify({msg: 'hello'}));
​        }
​    }
}).listen(8000);               
http状态码为300表示 不成功 还需要进一步操作 比如重定向

buffor 
代表一个缓冲区，存储二进制数据，是字节流，网络传输时，就传输的这种字节流，写文件时，也是写的字节流。、
zlib  压缩与解压
压缩
1.
//创建一个只读流
var rs = fs.createReadStream("./baidu.html");
//创建一压缩流                                                          
var gzip = zlib.createGzip();
//创建一个只写流
var ws = fs.createWriteStream("./bdw.html");
rs.pipe(gzip).pipe(ws)
2.
zlib.gzip(fs.readFileSync("./baidu.html"), function(err, decoded) {
​    if (err) {
​        throw err
​    };
​    fs.writeFileSync("./bd.html", decoded)
});
解压
1.
//创建一个只读流
var rs = fs.createReadStream("./bd.html");
//创建一解压流
var gzip = zlib.createGunzip();
//创建一个只写流
var ws = fs.createWriteStream("./bdws.html");
rs.pipe(gzip).pipe(ws)；

2.
zlib.gunzip(fs.readFileSync("./bd.html"), function(err, decoded) {
​    if (err) {
​        throw err
​    };
​    fs.writeFileSync("./bgs.html", decoded)
})
服务器与客户端
服务器：
接受请求头信息（res.headers） 设置响应头信息(res.writeHead(200,{""}))
服务器接到请求，设置响应头信息，content-encoding 解析请求头，和告诉客户端所返回的是个被gzip算法压缩过的文件
客户端：
获取响应头信息(res.headers)设置请求头信息opt--->headers
客户端向服务器发起请求，并歙州头信息为accept-encoding（）告诉服务器请求的是个被gzip算法压缩的文件。
accept-encoding：gzip；
向服务器请求一个被gzip算法压缩过的文件；
好处：
为了加快传输速度，节省流量，（网络传输过程中通常会把服务器的静态资源压缩并返回，由客户端解压输出）
优化性能
 Express基于 Node.js 平台，快速、开放、极简的 web 开发框架。
一个路由只写一个响应方式。
express是个非侵入式的web框架。
简单使用
//引入
var express = require("express");
//实例化
var app = express();
//注册路由
app.get("/", function(req, res)//处理器函数 {
​    res.end("hello")
});
//监听
app.listen("8080")
响应方式
res.download() 提示下载文件 参数：下载内容的路径
res.end()   结束响应
res.json()  发送json格式的响应
res.jsonp()
res.redirect（）  重定向请求  参数：定向的路由 
res.render()  渲染视图模板
res.send()  发送各类型的响应 除了buffer格式 参数：send里面如果传入number会将其解析为状态码
res.sendStatus()  设置状态码，并以字符串作为响应的一部分返回
res.sendFile()  以八位字节流的形式发送文件   参数：文件的绝对路径
解析
路由（Routing）是由一个url（服务器路径）和一个特定的HTTP方法（get，post等）组成的，涉及到应用如何响应客户端对某个网站节点的访问。
路由匹配 = 请求方式匹配 + 路径匹配
路由定义由如下结构组成  app.method(path,handler)   app:express实例 method:某个http方式的一个   path服务器端的路径 handler路由匹配到时需执行的函数
app.all（） 是一个特殊的路由方法，没有任何吧http方法与其对应，它的作用是对于一个路径上的所有请求加载中间件（函数）app.all("*", function(req, res) {
​    res.end("all")
})
express是个非侵入式的web框架
一个路由只写一个响应方式
req方法
req.path(请求路径) 不含参  url.parse(req.url).pathname
req.url  含参的路径
req.method 请求方式
req.params  获取以“:”隔开的参数数值     路由路径参数  
app.get("/getUser/:name/:pwd", function(req, res, next) {
​    var obj = req.params; //获取/:name/:pwd变量值
​    if (obj.name === "zs" && obj.pwd === "1123") {
​        next("route"); //如果符合 则移交控制权给下一个路由
​    } else {
​        next(); //如果不符合 则移交控制权至下一个处理器函数
​    }
}, function(req, res) {
​    res.send({ msg: "error" }) //发送内容
}); 
req.query  获取？后面的地址栏参数   url.parse(req.url,true).query
res.setHeader    只能设一个
res.writeHead(200,{})  可以设多个值
res.Status（） 设置响应状态码
res.header()  设置响应头信息
next
next函数主要负责将控制权交给下一个中间件，如果当前中间件没有终结请求，并且next没有调用， 那么请求将被挂起，后边定义的中间件将得不到被执行的命令。
next函数主要是用来确保所注册的中间件被一个接一个地执行，如果我们定义的中间件终结了本次请求，那就不应该再调next方法
可使用 express.Router 类创建模块化、可挂载的路由句柄。Router 实例是一个完整的中间件和路由系统
var express = require('express');
   var router = express.Router();
当路由名一致，请求方式不一致时
app.route(服务器路径)
.method1(function(req,res){})
.method2(function(req,res){})
4.创建路由路径的链式路由句柄  定义一个路径，拆分多种请求方式 app.route()
5.express.Router   创建模块化 可挂载的路由句柄
必须挂载     
挂载到应用 app.use([虚拟路径]，router)  虚拟路劲默认“/”      若app.use("./src",router)  访问 ./src/app
​      6.next() 将控制权交给下一个处理器函数
​      7.next("route") 将控制权交给下一个同名路由器
（请求的端点可以是字符串、字符串模式或者正则表达式）
路由路径和请求方法一起定义了请求的端点，它可以是字符串、字符串模式或者正则表达式。
?前面的字符可有可无
* 所有的
+ 前面的字符 1-多个
  正则场景：
  /ab?cd/      匹配b  0-多个 可有可无
  /ab+cd       匹配b  1-多个
  /ab*cd/       匹配以ab开头 以cd结尾
  /a/               匹配任何含a的路径
  /ab(cd)?e/  匹配cd 0-多个 可有可无
  /.*fly$/        匹配以fly结尾的路径
  中间件
  中间件（Middleware） 是一个函数，它可以访问请求对象（request object (req)）, 响应对象（response object (res)）, 和 web 应用中处于请求-响应循环流程中的中间件，一般被命名为 next 的变量。

如果当前中间件没有终结请求-响应循环，则必须调用 next() 方法将控制权交给下一个中间件，否则请求就会挂起。
next() 将控制权交给下一个处理器函数
next("route") 将控制权交给下一个同名路由

应用级中间件  三个参数
应用级中间件绑定到 app 对象 使用 app.use() 和 app.METHOD()， 其中， METHOD 是需要处理的 HTTP 请求的方法，例如 GET, PUT, POST 等等
app.use([虚拟路径]，所绑定的中间件)
特点：
执行任何代码
可以修改和请求响应对象
终结请求--响应循环  res.end() res.send()
调用堆栈中的下一个中间件  next()
路由级中间件
1.路由级中间件和应用级中间件一样，只是它绑定的对象为 express.Router()。
2.路由级使用 router.use() 或 router.VERB() 加载。
3.app.use(req,res,next)
错误级中间件  四个参数
错误处理中间件有 4 个参数，定义错误处理中间件时必须使用这 4 个参数。即使不需要 next 对象，也必须				   在签名中声明它，否则中间件会被识别为一个常规中间件，不能处理错误。
错误处理中间件和其他中间件定义类似，只是要使用 4 个参数，而不是 3 个，其签名如下： (err, req, res, next)。
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.use(function(req, res, next) {
​    var err = new Error("很抱歉，您访问的页面不存在"); //定义错误
​    err.status = 404; //设置状态码
​    next(err) //传递错误
});
app.use(function(err, req, res, next) {
​    var msg = err.status ? err.message : "服务器错误";
​    res.status(err.status || 500).send(msg) //响应错误
});
第三方  
body-parser  获取post方式传递的参数；
var bodyParser = require("body-parser");
var urlParser = bodyParser.urlencode({extended:false})         =express.urlencoded({extended:false}); 
获取body体内的内容
内置中间件
express.static() ------> 返回值是中间件     //加载静态资源
参数：静态资源所在的文件夹 相对路径
 该root参数制定从中提供静态资源的根目录，该函数通过req.url与提供的root目录组合来确				定需提供的文件，当找不到文件时，他不是发送404来响应而是调用next()继续下一个中间件。允许堆叠和回退。
express.urlencoded({extended:false}); 
中间件小结：
应用级：绑定在app上  三个参数
路由级：绑定在router上
错误处理  四个参数 err,req，res,next
内置  express自带
第三方 去下载


增删改查
增：添加数据
语句： insert into 表名(列命1，列名2，列名3...) values(值1，值2，值3...)
删：删除数据
语句：delete from 表名 where条件表达式
注释：条件表达式 列名= 值 列名>值 列名<值
改：修改数据
语句：update 表名 set 列名1=值1，列名2=值1 where条件表达式
多个表达式之间用","隔开
查：
查询全部
语句： select 列名/* from 表名
按条件查询
语句： select 列名/* from 表名 where条件表达式
限制条数
语句：select 列名/* from 表名 limit （开始下标，长度）
多个表达式之间用"and"隔开
模糊查询
语句： select 列名/* from 表名 where 列名 like "%val%" 查询语句中带val的信息
语句： select 列名/* from 表名 where 列名 like "val%" 查询语句以val开头的信息
语句： select 列名/* from 表名 where 列名 like "%val" 查询语句中以val结尾的信息
排序
​      语句：select  * from 表名 order by 列名      升序排列
​      语句：  select * from 表名 order by 列名  desc  降序排列