优势：

1. 性能高

2. 与前台配合非常方便
3. 节省开发成本
      * 前端javascript→运行在浏览器→操作DOM
      * 后台javascript→运行在服务器端→操作服务、文件、进程
      * 特点：
      * 1. 异步I/O     I→输入 （input）      O→输出（output）
        2. 事件与回调函数
        3. 单线程
        4. 跨平台
> 配置环境变量，可以使node.exe应用程序被全局访问到
  ​          步骤：计算机属性→高级系统设置→高级→环境变量→系统变量→Path→将node.exe所在的绝对路径添加到Path变量中（多个路径之间要以分号隔开）
  ​          运行方式：
  ​          1.终端：打开命令行→输入node→回车→键入node的执行环境→输入要执行的js→连按两遍ctrl+c退出此环境
  ​          输入cls清屏
  ​          2.外部文件：
  ​          node --version(简写 -v)    查看nodejs的版本号
  ​          npm --version(简写 -v) 
  ​                  查看npm的版本号
  ​          cd 文件夹                        进入文件夹
  ​          cd..                                        退出上一级
  ​          cd/                                        退出到根目录
  ​          e:
  ​          ​        d:        f:                        切换盘符
  ​          mkdir 文件夹                        新建文件夹（make directory）
  ​          type 文件                                查看文件内容（后缀名不能省略）
  ​          cls                                        清屏
  ​          exit                                        退出终端
  ​          nodejs
  ​          ​                                运行环境
  ​          commonjs                        是nodejs的规范
  ​          1.require的功能是读入并执行一个javascript文件
  ​          2.require方法的返回值是当前所加载的模块的module.exports的属性值
  ​          3.require的参数
  ​          相对路径 
  ​          ​        ./../的路径
  ​          绝对路径                带盘符
  ​          C:/src        D:/src
  ​          ​        不带盘符
  ​          /a
  ​          module
  ​          module.loaded 
  ​          ​        表示模块是否已经完成加载，返回一个布尔值
  ​          module.parent                表示调用该模块的模块，返回一个对象、null
  ​          module.children         表示该模块要用到的其他模块，返回一个数组
  ​          module.exports         表示模块对外输出的值
  ​          exports是为了使用方便，node内部提供的一个全局对象，指向module.exports
  ​          区别：exports只能抛出对象，但module.exports可以抛出当前的内容形式
  ​          原因：如果用exports=xxx的方式抛出，则相当于切断了module.exports与exports的联系，
  ​          此时exports将不再指向module.exports，require将永远返回一个{}，故只能采用exports.key=val的形式将其抛出
  ​          require.cache
  ​          ​                模块的缓存
  ​          清楚模块的缓存：
  ​          ​                1.for(var i in
  ​          require.cache){
  ​          ​                    delete
  ​          require.cache[i];
  ​          ​                }
  ​          ​               
  ​          2.Object.keys(require.cache).forEach(function(file){
  ​          ​                    delete
  ​          require.cache[file];
  ​          ​               
  ​          })
  ​          process.cwd()        返回当前工作目录所在的绝对路径
  ​          __dirname         当前所在js文件的绝对路径
  ​          当发现require方法里的参数是个文件夹时，则自动加载该文件夹中的index.js。index.js被称之为这个文件夹的入口文件
  ​          不带路径：1、内置模块2、第三方包
  ​          内置：自带，安装node时已存于本地硬盘，用时需先引入
  ​          模块          js
  ​          ​        文件        
  ​          包        文件夹
  ​          [www.npmjs.com](http://www.npmjs.com)
  ​          当加载第三方包时，实则加载的是 该包中的某一个js文件，这个文件被称为入口文件
  ​          入口文件存在的两种形式：
  ​          1、index.js
  ​          2、package.json→main字段指向了入口文件所在路径
  ​          require(package)
  ​          先找本地，再找全局，本地依次向上查找（module.exports）
  ​          package.json中的name的属性值不能与要下载的包重名
  ​          npm install 包名 --global/-g
  ​          下载第三方包的命令：
  ​          npm install 包名→ 会在p.j中生成dependencies依赖
  ​          npm i 包名 --save 
  ​          /   -S → 会在p.j中生成dependencies依赖
  ​          npm i 包名 --save-dev 
  ​          /  -D → 会在p.j中生成devDependencies依赖
  ​          dependencies  生成环境  （依赖包）
  ​          devDependencies  开发环境  （编程工具）eslint gulp
  ​          批量下载包 npm install
  ​          package.json 中的name 的属性值不能与要下载的包重名
  ​          npm i jquery
  ​          ​        dependencies
  ​          npm i jquery --save / -S 
  ​          ​           dependencies（依赖包）
  ​          npm i jquery --save-dev / -D
  ​          ​        devDependencies（构建工具）
  ​          npm install
  ​          全局安装
  ​          npm install 包名 --global / -g
  ​          npm root 查看npm包的全局路径
  ​          环境变量        path
  ​          node 命令
  ​          NODE-PATH
  ​          加-g参数只能保证将第三方包下载到全局路径（npm root -g 命令所指向的路径），并不能保证包被全局访问到，要想被全局访问，必须配置NODE-PATH
  ​          require发现参数字符串指向一个目录以后，会自动查看目录的package.json文件，然后加载main字段指定的入口文件。如果package.json文件没有main字段，则会加载该目录下的index.js文件作为入口文件。
  ​          第三包特点：
  ​          1、是个文件夹
  ​          2、必须存于node_modules目录下
  ​          3、包中必须提供对外的接口（module.exports / exports）
  ​          注：入口文件、package.json、README.md
  ​          命令行程序：
  ​          1、新建一个以.cmd为后缀名的文件
  ​          NODE_PATH
  ​          Node.exe         npm.cmd
  ​          ​        node-dev.cmd        →
  ​          path
  ​          npm i node-dev -g
  ​          express-gennerator -g
  ​          npm root -g
  ​          node-dev.cmd
  ​          express.cmd
  ​          1、注册
  ​          2、本地登录 npm adduser （第一次）        npm
  ​          login（非第一次）        
  ​          注：密码不会显
  ​          3、发布包：在包的内部，与package.json同级下打开cmd.        npm
  ​          publish进行发布
  ​          4、卸载：npm unpublish 包名@版本号
  ​          注意：
  ​          1、发布的包中必须有package.json文件，且文件中必须有name和version两个属性
  ​          2、发布的包不能与npm服务器已存在的包重名
  ​          3、卸载包必须24小时之后才能重新发布
  ​          4、重新发布包时，必须修改其版本号
  ​          5、发布的24小时只能予以卸载
  ​          网址：
  ​          <http://www.runoob.com/nodejs/nodejs-event-loop.html>