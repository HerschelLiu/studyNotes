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

## 组件的使用

```vue
<template id="account"> //只能是id
    <div>
      <h3>账号组件的内容</h3>
      <a href="">账号</a>
      <a href="">密码</a>
    </div>
  </template>
  <div id="app">
      <account1></account1>
  </div>


Vue.component('account1', {
    template: '#account'
  }); 
/* vue.component('别名', {
    template: '#id'
  });
此为注册全局组件，
注意，注册组件要在new Vue之前
*/

  new Vue({
    el: '#app',
    data: {

    },
    methods: {
      myClick: function () {
        console.log('我被点击了');

      }
    }
  })
```

## 组件间传值

* 父->子：

```
<template id="account">
    <div>
      <h1>组件的内容:{{name1}}</h1>
    </div>
  </template>
  <div id="app">
    <account1 :name1="name"></account1>给子组件绑定数据
  </div>
</body>
<script>
  Vue.component('account1', {
    template: '#account',
    data: function () {
      return {
        
      }
    },
    props: {
      name1: String // 值类型，子组件接收数据
    }
  });
  new Vue({
    el: '#app',
    data: {
      name: 'haha'
    }
  })

</script>
```

* 子->父 ：运用methods以及v-on

```
<template id="account">
    <div>
      <h1 @click="sendData">发送数据</h1>
    </div>
  </template>
  <div id="app">
    <account1 @send='getDate'></account1>
  </div>
</body>
<script>
  Vue.component('account1', {
    template: '#account',
    data: function () {
      return {

      }
    },
    methods: {
      sendData() {
        this.$emit('send', 123) // this.$emit('父组件v-on绑定的名字', 数据)
      }
    }
  });
  new Vue({
    el: '#app',
    data: {
      name: 'haha'
    },
    methods: {
      getDate(input) {
        console.log(input);

      } 
      // 接受子组件传来的数据，另外，父子组件中的methods均可用function名字：function（）{}方式
    }
  })

</script>
```

## vue-router路由基本使用

在一个系统中或app中，由多个页面组成，通常会使用vue中的组件来实现。那么当从一个页面跳到另一个页面时，通过url路径来实现的哪个url对应哪个页面，在vue中时通过**vue-router**来实现

```
<script src="./vue.min.js"></script>
<script src="./vue-router.min.js"></script>

<body>
  <div id="app">
    <router-link to="/login">登陆</router-link>
    <router-link to="/register">注册</router-link>
    <!-- 占位符 -->
    <router-view></router-view>
  </div>
</body>
<script>
  // 定义根组件
  var App = Vue.extend()
  // 定义注册组件
  var register = Vue.extend({
    template: '<h2>注册</h2>'
  })

  // 定义登陆组件并注册路由规则
  var login = Vue.extend({
    template: '<h2>登陆</h2>'
  })

  // 定义路由
  /*
  {
      path: '/',
      redirect: './login'
    }
    为设置默认路径
  */
  var vueRouter = new VueRouter({
    routes: [{
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      component: login
    }, {
      path: '/register',
      component: register
    }]
  })

  // 使用路由
  new Vue({
    el: '#app',
    router: vueRouter
  })

</script>
```

## 路由传值

```
<body>
  <div id="app">
    <router-link to="/login">登陆</router-link>
    <router-link to="/register/haha">注册</router-link> // 传值
    <!-- 占位符 -->
    <router-view></router-view>
  </div>
</body>
<script>
  // 定义根组件
  var App = Vue.extend()
  // 定义注册组件
  var register = Vue.extend({
    template: '<h2>注册{{oname}}</h2>',
    data: function () {
      return {
        oname: '' 
      }
    },
    //接收数据
    created: function () {
      this.oname = this.$route.params.uname 
    }
  })

  // 定义登陆组件并注册路由规则
  var login = Vue.extend({
    template: '<h2>登陆</h2>'
  })

  // 定义路由
  /*
  {
      path: '/',
      redirect: './login'
    }
    为设置默认路径
  */
  var vueRouter = new VueRouter({
    routes: [{
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      component: login
    }, {
      path: '/register/:uname', // 传值
      component: register
    }]
  })

  // 使用路由
  new Vue({
    el: '#app',
    router: vueRouter
  })

</script>
```

