1、path -> 操作磁盘路径的内置模块 带盘符的相对路径或者绝对路径

2、格式化路径  path.normalize(p)

3、提供特定于平台的路径分隔符  path.delimiter

4、******获取文件后缀名  path.extname(p)   

如果路径中不带.,或者只有点，或以点开头，则该方法返回空字符串

 eg   path.extname('index.js'）  js

​        path.extname('index')     空字符串

​        path.extname('.')     空字符串

​        path.extname('index.')     空字符串

5、使用平台特定的分隔符将所有给定的段连接在一起，然后对结果路径进行格式化

*********path.join() 可以传 0- 多个参数  _dirname+'/lib'+file 

6、返回代表文件夹的部分

path.dirname()

7、返回路径的最后一部分

path.basename(path,[ext];    ext可选文件扩展名

8、*********将一系列路径或路径段解析为绝对路径

  path.resolve()

与path.join()的区别：

path.join() 拼接路径

path.resolve 返回当前的工作目录所在的绝对路径（小黑板的路径）

__dirname 在哪个文件夹里返回的就是当前的绝对路径

​                  是该变量所在的js文件的绝对路径，会随自身的位置发生改变



`process.cwd()  ==path.resolve()  `

```javascript
console.log(path.join(process.cwd(),'src'));
console.log(path.resolve());
```

如果没有path段传值,path.resolve()将返回当前工作目录的绝对路径.如果在处理所有给定path段之后,还没有生成绝对路径,则使用当前工作目录进行追加.路径从右往左依次追加,直到找到绝对路径就停止追加,直接返回



如果dir存在，则忽略root；

base如果存在，则忽略ext和name



重点：join extname resolve format

 

深度拷贝：

 思路： 1、找出所有文件

​              2、分类拷贝   big  small  

​      (1)  引入模块

               ```javascript
var  fs=require("fs");

var path=require("path")

               ```



​       (2) 读取src文件目录，获取到src中所有文件的集合

```javascript
fs.readdir(path.join(__dirname, 'src'), function (err, path) {
    if (err) {
        return console.error(err);
    }
});
```



(3)  遍历目录

 ```javascript
paths.forEach(funcntion(file){

// 拼接路径

var  pathname=path.join(_dirname,'src',file);

 ```



(5) 查看文件信息

```javascript
fs.stat(pathname, function (err, st) {

    if (err) {

        throw err;

    }
});
```



(6)判断

`if(st.isDirectory()){`

(1) 读取文件信息

`fs.readdir(pathname,function(err,paths){`

(2）遍历

```javascript
paths.forEach(function(file){

}

}

}

}

}

})
path.extname(index)     // 空字符串
```

深度拷贝

```javascript
// main
var fs = require("fs");
var path = require("path");

function allcable(src, olds) {
    fs.readdir(src, function(err, paths) {
        if (err) {
            throw err;
        }
        paths.forEach(function(file) {
            var oldsrc = src + "/" + file;
            var newsrc = olds + "/" + file;
            fs.stat(oldsrc, function(err, st) {
                if (err) {
                    throw err;
                }
                var size = st.size / 1024 / 1024;
                if (size < 100) {

                    if (!fs.existsSync(olds)) {
                        fs.mkdirSync(olds);
                        if (st.isFile()) {
                            fs.readFile(oldsrc, function(err, data) {
                                if (err) {
                                    throw err;
                                }
                                fs.writeFileSync(newsrc, data);
                            })
                        } else {
                            if (!fs.existsSync(newsrc)) {
                                fs.mkdir(newsrc, function(err) {
                                    if (err) {
                                        throw err;
                                    }
                                })
                                allcable(oldsrc, newsrc);
                            }
                        }

                    } else {
                        if (st.isFile()) {
                            fs.readFile(oldsrc, function(err, data) {
                                if (err) {
                                    throw err;
                                }
                                fs.writeFileSync(newsrc, data);
                            })
                        } else {
                            if (!fs.existsSync(newsrc)) {
                                fs.mkdir(newsrc, function(err) {
                                    if (err) {
                                        throw err;
                                    }

                                })
                                allcable(oldsrc, newsrc);
                            }
                        }
                    }
                } else {
                    if (!fs.existsSync(olds)) {
                        fs.mkdirSync(olds);
                        var ls = fs.createReadStream(oldsrc);
                        var ws = fs.createWriteStream(newsrc);
                        ls.pipe(ws);
                    } else {
                        var ls = fs.createReadStream(oldsrc);
                        var ws = fs.createWriteStream(newsrc);
                        ls.pipe(ws);
                    }
                }
            })
        })
    })
}
allcable(path.resolve(__dirname + "/src"), path.resolve(__dirname + "/dit"));
```

```javascript
// index.js

var fs = require('fs'),
    stat = fs.stat;


var path = require("path");
/*
05
 * 复制目录中的所有文件包括子目录
06
 * @param{ String } 需要复制的目录
07
 * @param{ String } 复制到指定的目录
08
 */
var copy = function(src, dst) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function(err, paths) {
        if (err) {
            throw err;
        }

        paths.forEach(function(path) {
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;

            stat(_src, function(err, st) {
                if (err) {
                    throw err;
                }

                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(_src);
                    // 创建写入流
                    writable = fs.createWriteStream(_dst);
                    // 通过管道来传输流
                    readable.pipe(writable);
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    exists(_src, _dst, copy);
                }
            });
        });
    });
};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function(src, dst, callback) {
    fs.exists(dst, function(exists) {
        // 已存在
        if (exists) {
            callback(src, dst);
        }
        // 不存在
        else {
            fs.mkdir(dst, function() {
                callback(src, dst);
            });
        }
    });
};

// 复制目录

exists('./src', './dit', copy);
console.log(path.resolve(__dirname + "/src"));
```

