# 对比 Angular React
 + Vue.js更轻量，gzip后大小只有20k+，所以对于移动端，Vue.js更适合
 + Vue.js更易上手，学习曲线平稳
 + React的组件化

# Vue.js核心思想
 + 数据驱动
  - DOM是数据的一种自然映射
 + 组件化
  - 扩展HTML元素，封装可重用的代码
  - 组件设计原则:
    1. 页面上每个独立的可视/可交互区域视为一个组件
    2. 每个组件对应一个工程目录，组件所需要的各种资源在这个目录下就近维护

# vue-cli
 是vue的脚手架工具，就是写好基础代码的工具。
 它可以帮助我们搞定目录结构、本地调试、代码部署、热加载、单元测试等工作

# 项目文件介绍
 * build、config目录是与webpack配置相关 

 * node_modules文件夹是通过`npm install`安装的依赖代码库

 * src文件夹：存放项目源码，开发的所有代码都存在此目录下
   <span id="src">**项目准备1**</span>
   + components文件夹，存放所有组件文件。
      但是自己创建的每个组件都要在这个文件夹里新建名字是这个组件名字的文件夹，
	    因为一个组件除了本身的VUE文件会，还包含用到的图片字体等资源
   + assets文件夹可以删掉，我们不需要他
   + 还要自己新建一个名为`common`的文件夹，用来存放公共的资源，这个文件夹内还要有三个文件夹`js`、`stylus`、`fonts`
     - `stylus`是一个css的预处理器，与less、sass功能差不多，语法上略有差别。
	    1. 存放在这里的css文件要将后缀`.css`改为`.styl`
		2. 将css代码改为stylus格式，即将里面的大括号和分号删掉
   
 * static文件夹：存放第三方静态资源，初始只有一个`.gitkeep`文件，这个文件总用是即使此文件夹为空也可以将其添加到git仓库里，如果是空目录，git不会将其添加到仓库里

 * .babelrc：babe的一些配置。因为我们的代码都是es6，大部分浏览器不支持，需要用babe转换成es5，所以此文件就是保存babe的一些配置
   `presets`表示预设，`stage`表示ecma的草案，一共有4个阶段
   
 * .editorconfig：编辑器的配置
   + charset表示编码
   + indent_style表示缩进风格
   + indent_size缩进大小
   + end_of_line表示换行符风格
   + insert_final_newline自动在新创建的末尾插个新行
   + trim_trailing_whitespace 自动移除行尾多余空格
   
 * .eslintignore忽略语法检查的目录文件

 * .eslintrc.js：eslint的配置文件

 * index.html入口html文件

 * package.json：项目的配置文件，用来描述一个项目

# 项目准备
  1. 为src文件夹内添加内容，详情见[src](#src)
  2. mock数据：前后端分离的状态下，左右数据在后台那，前端需要一些虚假的数据去测试，这些模拟数据就是mock数据

# 指令
## v-bind
+ 作用：当表达式的值改变时，将其产生的连带影响，响应式的作用于DOM
+ 语法：v-bind:class
+ 简写：:class

## v-on
+ 作用：绑定事件
+ 语法：v-on:click=“”
+ 简写：@click=“”

## v-model
+ 在表单元素上创建双向数据绑定，监听用户的输入事件以及更新数据
+ <font color="red">**注意：**</font>只适用于input，select，textarea

## 2.0中不用`router.go('/goods')`用`router.push('/goods')`

## v-if和v-show

* 相同点：都是控制dom元素显示或隐藏
* 不同点：v-if是将元素添加或移除出dom树模型中，v-show只是在这个属性上加了display：none而已
* v-if有更高得切换消耗，安全性更高。v-show初始化消耗大一点。所以，如果需要频繁切换并对安全性没有要求时，可以使用v-show。如果运行时，条件不可能改变的话，使用v-if更好一点

