### 深度拷贝

如果里面有文件夹那就拷贝文件夹里的  如果文件夹里还有文件夹就继续往下找  知道把这个文件夹拷贝完



var fs=require("fs')  操作磁盘文件的内置模块

fs中每个方法都对应有同步异步两种形式，同步方法以Sync结尾，异步支持回调函数

fs中所有的异步方法都没有返回值

1、fs读取文件

  `fs.readFile（“文件路径”，[opt/str],function(err,data){})`

eg.

```
console.log('开始读取')；

fs.readFile("./index/html',function(err,data){

    console.log(“读取完成”)；

}

console.log("我不会阻塞")

fs.readFile("./index.html","utf-8",function(err,data){

    console.log(data)

}

```



err---->成功：null  失败：错误对象

data---->成功：文件内容 失败：undefined







同步读取显示报错

异步读取不显示报错得自己写错误信息

```javascript
fs.readFile('./2.png','base64',function(err,data)

{

    if(err){

         if (err) {
            console.error(err);     
        } else {
            console.log(data);

        }

    }

    console.log(data)

})


// 方法1
var data=fs.readFileSync(',/index.html','utf-8')

console.log(data)
// 方法2
var data=fs.readFileSync(',/index.html')

console.log(data.toString())




```

2、fs写入文件,文件不存在就创建，存在就替换内容

fs.writeFile(‘文件路径’，‘文件内容’，[opt,str],function(err){})

fs.writeFileSync(‘文件路径’，‘文件内容’，[opt,str])

fs.writeFile(‘./a.js’，'console.log('aaaa')')

eg

```javascript
fs.readFile('content.txt', 'utf-8', function (err, data) {
    if (err) {
        throw err;
    }
    fs.writeFile('bugFo.txt', data, function (err) {
        if (err) {
            throw err;
        }
    })
})
```
fs替换颜色
建一个style.css
1、找到新的颜色
2、找到旧的颜色的
3、替换

```javascript

var newColor=process.argv[2];
fs.readFile('./style.css','utf-8',function(err,data){
if(err){
       throw err;
}
var oldColor=data.split(":")[1].split(";")[0];
data=data.replace(oldColor,newColor);
fs.writeFileSync("./style.css",data);
})

  fs.appendFile("文件路径"，“内容")
```

3. 操作文件夹的方法

   fs读取文件夹（文件目录） read  directory



   ```
   fs.readdir('./a',function(err,paths){
   
       if(err){
   
           throw err;
   
       }
   
        console.log(paths)
   
   }
   
   ```



   paths是所有文件的集合

4. 文件批量拷贝

把src中文件拷贝到dist中

 1、读取src获取所有文件的集合

fs.readdir('./src',function(err,paths){

if(err){

throw err;

}

2、遍历数组

paths.forEach(function(file){

3、读取文件

```
fs.readFile(‘. / src / ’+file, function (err, data) {

    if (err) {

        throw err;

    }

    fs.writeFile('./dist/' + file, data, function (err) {

            if (err) {

                throw err;

            }

        }

    }

})

console.log(paths)

}
```



同步读取文件目录：fs.readdirSync("")

fs创建文件夹 makedir

fa判断文件/文件夹是否存在

fs.exists(file/dir,function(exist){

console.log(exist)；//返回布尔值  true（存在）或false（不存在）

})

判断有无dist文件夹，有就拷贝，没有就创建在拷贝



———dirname 表示当前js文件所在的绝对路径

———filename

4. 流拷贝

   流是node.js移动数据的方式，流可以是可读的和/或可写的

   由于数据是流，这就意味着在完成文件读取之前，从收到最初几个字节开始，就可以对数据动作

   1、只读数据流

   var rs=fs.ReadStream('./1.mp4');

   2、只写数据流

   ```
   var ws = fs.WriteStream("./3.mp4");
   
   
   
   rs.on('data', function (chunk) { // chunk每次触发
   
       ws.write(chunk)
   
   });
   
   rs.on("end", fucntion() {
   
       ws.end()
   
   })
   ```

   读停读取

   > 由于一次性读取再写入的方式不适用于大文件拷贝,容易造成内容爆仓,对于大文件,我们只能读一点写一点,直到拷贝完成

   ```javascript
   // 1.只读数据流
   var rs = fs.ReadStream('./1.mp4');
   
   // 2.只写数据流
   var ws = fs.WriteStream('./3.mp4');
   rs.on('data',function(chunk){
       if(!ws.write(chunk)){
           // 暂停只读数据流
           rs.pause();
       }
   });
   
   ws.on('drain',function(){
       rs.resume(); // 继续读取
   });
   
   rs.on('end',function(){
       ws.end();
   });
   ```

   1、创建一个只读数据流

   var rs=fs.createReadStream('./1.mp4')

   2、创建一个只写数据流

   var ws=fs.createWriteStream("./1.mp4");

   3、管道流输出

   rs.pipe(ws)



   drain事件表示什么时候只写数据流已经将缓存中的数据写入到目标，可传入下一段待写数据

### 分步拷贝

```javascript
var fs = require("fs");

var rs = fs.createReadStream("./3.mp4");
var ws = fs.createWriteStream("./4.mp4");
var totsize = fs.statSync("./3.mp4").size;
var passedlength = 0;
var num = 0;
rs.on("data", function(chunk) {
    passedlength += chunk.length;
    if (!ws.write(chunk)) {
        rs.pause();
    }
})

ws.on("drain", function() {
    rs.resume();
});
rs.on("end", function() {
    ws.end();
});
setInterval(function() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    var passedSize = Math.ceil(passedlength / 1024 / 1024);
    var prosedsize = Math.ceil(passedlength / totsize * 100);
    var size = Math.ceil((passedSize - num) / 1024 / 1024);
    num = passedlength;
    process.stdout.write("已完成:" + passedSize + "MB,百分比:" + prosedsize + "%,当前进度:" + size + "MB/S");
}, 1000)
```

