一直在纠结一个npm安装的包依赖管理的问题。是这样的：

我们在使用npm install 安装模块或插件的时候，有两种命令把他们写入到 package.json 文件里面去，他们是：--save-dev或--save

首先需要说明的是Dependencies一词的中文意思是依赖和附属的意思，而dev则是

develop（开发）的简写。

所以它们的区别在 package.json 文件里面体现出来的就是，使用 --save-dev 安装的 插件，被写入到 devDependencies 域里面去，而使用 --save 安装的插件，则是被写入到 dependencies 区块里面去。



**那 package.json 文件里面的 devDependencies  和 dependencies 对象有什么区别呢？**

* devDependencies  里面的插件只用于开发环境，不用于生产环境

* dependencies  是需要发布到生产环境的。

比如我们写一个项目要依赖于jQuery，没有这个包的依赖运行就会报错，这时候就把这个依赖写入dependencies ；

而我们使用的一些构建工具比如glup、webpack这些只是在开发中使用的包，上线以

后就和他们没关系了，所以将它写入devDependencies。