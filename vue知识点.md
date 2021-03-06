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

# 更新vue-cli命令`npm update vue-cli`

# 更新npm`npm update -g`

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

 * .babelrc：babel的一些配置。因为我们的代码都是es6，大部分浏览器不支持，需要用babel转换成es5，所以此文件就是保存babe的一些配置
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

# 数据的写法

要这样写

```vue
export default {
    data () {
        return {
			msg: 'hello Vue'
        }
    }
}
```



# 指令

## v-bind
+ 作用：当表达式的值改变时，将其产生的连带影响，响应式的作用于DOM

+ 语法：v-bind:class

+ 简写：:class

  **样式绑定**(理解:除了第一个,其他都是花式绑定样式的方式.总的来说就是还可以用数组,对象,计算属性的方式来绑定样式)

```html+javascr
<style>
.current{text-decoration:underline}
</style>

<div id="app">
    <span class="side" v-bind:class="{current:isCurrent}">当前导航</span>
</div>

<script>
new Vue({
    el: '#app',
    data:{
        isCurrent: true
    }
})
</script>
```

**除此之外还可以绑定对象**

```html+javascript
<style>
.current{text-decoration:underline}
.is_nav{background-color:#2FA4E7}
.color{color:gray}
</style>

<div id="app">
    <span class="side" v-bind:class="objClass">当前导航</span>
</div>

<script>
new Vue({
    el: '#app',
    data:{
        objClass: {
            'current': true,
            'is_nav': false,
            'color': true
        }
    }
})
</script>
```

**还可以用数组**

```
<style>
.current{text-decoration:underline}
.color{color:red}
</style>    

<div id="app">
    <span class="side" v-bind:class="[currentClass, colorClass]">当前导航</span>
</div>

<script>
new Vue({
    el: '#app',
    data:{
        currentClass: 'current',
        colorClass: 'color'
    }
})
</script>
```

**数组里面也可以使用对象来更新class列表**，如下

```
<div id="app">
    <span class="side" v-bind:class="[{current:isCurrent}, colorClass]">当前导航</span>
</div>

<script>
new Vue({
    el: '#app',
    data:{
        isCurrent: true,
        colorClass: 'color'
    }
})
</script>
```

**组件**

```
<div id="app">
    <my-component class="color"></my-component>
</div>

<script>
Vue.component('my-component', {
    template: '<p class="first">Hello</p>'
}),
new Vue({
    el: '#app',
})
</script>
```

自定义组件上的属性将直接作用于根元素，上述代码中，<my-component> 上原有的class属性会被添加到 <p> 元素的class列表上.自定义组件上也可以使用【v-bind】指令,渲染后的效果跟前面是一样的。

**绑定内联样式（style）**

**注意：**属性名用驼峰式 (camelCase) 或 (配合引号的) 短横分隔命名 (kebab-case)。

1. 使用对象绑定style，推荐使用在data中赋值，如下：

```
<div id="app">
    <h2 v-bind:style="styleObj">明灯小站</h2>
</div>

<script>
new Vue({
    el: '#app',
    data:{
        styleObj:{
            color: 'red',
            fontSize: '14px'
        }
    }
})
</script>
```

上述代码也可以写成：

```
<h2 v-bind:style="{color: 'red', fontSize: '14px'}">明灯小站</h2>
```

上述代码还可以用计算属性

```
<div id="app">
    <h2 v-bind:style="comObj">明灯小站</h2>
</div>

<script>
new Vue({
    el: '#app',
    data:{
        color: 'red',
        fontSize: '14px'
    },
    computed: {
        comObj: function () {
            return {
                color: this.color,
                fontSize: this.fontSize,
            }
        },
    }
})
</script>
```

2. 数组进行style绑定，有以下几种方法可选择。

   第一种方法是直接在元素中操作，如下：

   ```
   <h2 v-bind:style="[{color:'red'}, {fontSize: '14px'}]">明灯小站</h2>
   ```

   第二种方法是使用data属性进行赋值，推荐使用此种，如下：

   ```
   <div id="app">
       <h2 v-bind:style="arrStyle">明灯小站</h2>
   </div>
   
   <script>
   new Vue({
       el: '#app',
       data: {
           arrStyle: [
               {color:'red'}, 
               {fontSize: '14px'}
           ]        
       }
   })
   </script>
   ```

   第三种方法是以对象数组的形式绑定，如下：

   ```
   <div id="app">
       <h2 v-bind:style="[colorObj, fontObj]">明灯小站</h2>
   </div>
   
   <script>
   new Vue({
       el: '#app',
       data: {
           colorObj:{color: 'red'},
           fontObj: {fontSize: '14px'}
       }
   })
   </script>
   ```

## v-on

v-on 指令用于监听 dom 事件，对应的处理方法在 methods 属性中执行。

+ 作用：绑定事件
+ 语法：v-on:click=“”
+ 简写：@click=“”

### 内联语句处理器

内联语句允许你传递数值到方法中。

```
<div id="app">
    <a href="http:://www.mingtern.com" v-on:click="say('hello', $event)">{{message}}</a>
</div>

<script>  
new Vue({  
    el: '#app',  
    data: {
        message: "点击看看"
    },
    methods: {
        say: function(value, e){
            e.preventDefault();
            alert(value);
        }
    }    
})  
</script>
```

上述方法中，除了向say方法传递一个值外，还传递了一个特殊变量，这个变量的作用是当点击时，对原生 dom 事件进行处理，在该实例中是阻止 <a> 标签的跳转事件。<font color='red'>(理解:就是把onclick中传this改成了传$event)</font>

**v-on 修饰符**

vue.js 为 v-on 提供了修饰符来处理 DOM 事件细节，比如上述实例2中，我们使用传统的方法传递了一个变量到方法中阻止事件的冒泡。

使用 vue.js 的修饰符后，可以直接写成：

```
<a href="http:://www.mingtern.com" v-on:click.prevent="say('hello')">{{message}}</a>
```

**v-on 支持的修饰符**

| 名称                   | 用途                                             |
| ---------------------- | ------------------------------------------------ |
| .stop                  | 调用 event.stopPropagation(),阻止冒泡            |
| .prevent               | 调用 event.preventDefault(),组织点击穿透         |
| .capture               | 添加事件侦听器时使用 capture 模式                |
| .self                  | 只当事件是从侦听器绑定的元素本身触发时才触发回调 |
| .{keyCode \| keyAlias} | 只当事件是从特定键触发时才触发回调               |
| .native                | 监听组件根元素的原生事件                         |
| .once                  | 只触发一次回调                                   |
| .left                  | (2.2.0) 只当点击鼠标左键时触发。                 |
| .right                 | (2.2.0) 只当点击鼠标右键时触发                   |
| .middle                | (2.2.0) 只当点击鼠标中键时触发                   |
| .passive               | (2.3.0) 以 { passive: true } 模式添加侦听器      |

## v-model

**v-model 支持的修饰符**

| 名称    | 用途                        |
| ------- | --------------------------- |
| .lazy   | 取代 input 监听 change 事件 |
| .number | 输入字符串转为数字          |
| .trim   | 输入首尾空格过滤            |

+ 在表单元素上创建双向数据绑定，监听用户的输入事件以及更新数据
+ <font color="red">**注意：**</font>只适用于input，select，textarea

**Select 列表**

单选:single,多选:multiple,动态:dynamic

```
<div id="app">
    <p>单选列表：</p>
    <select v-model="single">
        <option disabled value="">请选择</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
    </select>
    <span>选择的值是: {{ single }}</span>
    
    <p>多选列表：</p>
    <select v-model="multiple" style="width:50px" multiple>
        <option>A</option>
        <option>B</option>
        <option>C</option>
    </select>
    <span>选择的值是: {{ multiple }}</span>    
    
    <p>动态列表：</p>
    <select v-model="dynamic">
        <option disabled value="">请选择</option>
        <option v-for="item in items" v-bind:value="item.value">
        {{ item.text }}
        </option>
    </select>
    <span>选择的值是: {{ dynamic }}</span>    
</div>
 
<script>
new Vue({
    el: '#app',
    data: {
        single : '',
        multiple: '',
        dynamic: '',
        items: [
            {text: 'first', value: 'A' },
            {text: 'second', value: 'B' },
            {text: 'third', value: 'C' }
        ]
    }
})
</script>
```

**复选框**

单个复选框将v-model等于checked,多个复选框v-model的值为相同的名字

```
<div id="app">
    <p>单个复选框：</p>
    <input type="checkbox" id="checkbox" v-model="checked">
    <label for="checkbox">{{ checked }}</label>

    <p>多个复选框：</p>    
    <input type="checkbox" id="iphone" value="iphone" v-model="checkedNames">
    <label for="iphone">iPhone</label>
    <input type="checkbox" id="xiaomi" value="xiaomi" v-model="checkedNames">
    <label for="xiaomi">小米</label>
    <input type="checkbox" id="huawei" value="huawei" v-model="checkedNames">
    <label for="huawei">华为</label>
    <span>选择的值: {{ checkedNames }}</span>
</div>

<script>
new Vue({
    el: "#app",
    data:{
        checked: false,
        checkedNames: []
    }
})
</script>
```

**单选按钮**


```
<div id="app">
    <input type="radio" id="mingtern" value="mingtern" v-model="choosed">
    <label for="mingtern">mingtern</label>
    <br>
    <input type="radio" id="baidu" value="baidu" v-model="choosed">
    <label for="baidu">baidu</label>
    <br>
    <span>选中值为:{{ choosed }}</span>
</div>
 
<script>
new Vue({
    el: '#app',
    data: {
        choosed : 'mingtern'
    }
})
</script>
```

## 2.0中不用`router.go('/goods')`用`router.push('/goods')`

## v-if和v-show

* 相同点：都是控制dom元素显示或隐藏
* 不同点：v-if是将元素添加或移除出dom树模型中，v-show只是在这个属性上加了display：none而已
* v-if有更高得切换消耗，安全性更高。v-show初始化消耗大一点。所以，如果需要频繁切换并对安全性没有要求时，可以使用v-show。如果运行时，条件不可能改变的话，使用v-if更好一点

## v-for

## 遍历对象

```html
<ul>
    <li v-for="value in object">{{value}}</li>
</ul>
```

上述代码是一个标准的 v-for 使用格式，object是你要遍历的对象，value是遍历出来的值。

例子

```
<div id="app">
    <ul>
        <li v-for="value in object">{{value}}</li>
    </ul>
</div>

<script>  
new Vue({  
    el: '#app',  
    data: {  
        object: {  
            first: "A",  
            second: "B",  
            third: "C"
        }  
    }  
})  
```

跟 js 类似，遍历时你也可以获取对象的索引和键值。

```
<ul>
    <li v-for="(value, key, index) in object">{{value}}</li>
</ul>
```

上述代码中，value为对象的值，key为键，index为索引。或者(item,index)item每一项,index索引.在遍历数组时，你也可以使用 of 代替 in，结果是一样的。

## 遍历 <template>

遍历中如果要赋值给一组元素，可在 <template> 标签中使用 v-for 指令。(理解:相当于微信小程序中的<block>)

```
<div id="app">
    <template v-for="item in items">
    <div>
        <h2>{{item.title}}</h2>
        <p>{{item.content}}</p>
    </div>
    </template>
</div>

<script>  
new Vue({  
    el: '#app',  
    data: {
        items: [
            {title: "Vue.js 教程", content: '学习vue.js，我们需要掌握···'},
            {title: "HTML 教程", content: 'HTML 是前端知识的入门基础···'}
        ]
    }  
})  
</script>
```

## 组件的使用

注册一个组件的语法如下：

```
Vue.component(tagName, options)
```

调用一个组件的语法如下：

```
<tagName></tagName>
```

上述两行代码中，tagName表示组件的名字，调用的时候直接使用即可，options表示配置选项，可在里面配置相关信息。

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

**局部注册**

局部组件只能在当前实例中生效，使用关键字 components 注册。

```
<div id="app">
    <mingtern></mingtern>
</div>
    
<script>
var Child = {
    template: '<h2>明灯小站</h2>'
}
// 创建根实例
new Vue({
    el: "#app",
    components: {
        'mingtern': Child
    }    
})
</script>
```



## 组件间传值

* 父->子：
* 通过prop向子组件传递数据

Prop 是你可以在组件上注册的一些自定义特性。当一个值传递给一个 prop 特性的时候，它就变成了那个组件实例的一个属性。为了给博文组件传递一个标题，我们可以用一个 `props` 选项将其包含在该组件可接受的 prop 列表中：

```
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
```

一个组件默认可以拥有任意数量的 prop，任何值都可以传递给任何 prop。在上述模板中，你会发现我们能够在组件实例中访问这个值，就像访问 `data` 中的值一样。

一个 prop 被注册之后，你就可以像这样把数据作为一个自定义特性传递进来：

```
<blog-post title="My journey with Vue"></blog-post>
<blog-post title="Blogging with Vue"></blog-post>
<blog-post title="Why Vue is so fun"></blog-post>
```

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
    props: ['name1']
  });
  new Vue({
    el: '#app',
    data: {
      name: 'haha'
    }
  })

</script>
```

父组件想传值给子组件的话,在子组件`<account1>`上用v-bind绑定一个名字`name1`,把父组件中的`name`值赋给name1,子组件用prop接收`name1`



**Prop 类型**

到这里，我们只看到了以字符串数组形式列出的 prop：

```
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```

但是，通常你希望每个 prop 都有指定的值类型。这时，你可以以对象形式列出 prop，这些属性的名称和值分别是 prop 各自的名称和类型：

```
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object
}
```

* 子->父 ：运用methods以及v-on

  父级组件可以像处理 native DOM 事件一样通过 `v-on` 监听子组件实例的任意事件,同时子组件可以通过调用内建的 [**$emit** 方法](https://cn.vuejs.org/v2/api/#vm-emit) 并传入事件名称来触发一个事件.`$emit`第二个参数是要传给父元素函数的值,然后当在父级组件监听这个事件的时候，我们可以通过 `$event` 访问到被抛出的这个值.如果这个事件处理函数是一个方法,那么这个值将会作为第一个参数传入这个方法

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

自定义事件也可以用于创建支持 `v-model` 的自定义输入组件。记住：

```
<input v-model="searchText">
```

等价于：

```
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

当用在组件上时，`v-model` 则会这样：

```
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```

为了让它正常工作，这个组件内的 `<input>` 必须：

- 将其 `value` 特性绑定到一个名叫 `value` 的 prop 上
- 在其 `input` 事件被触发时，将新的值通过自定义的 `input` 事件抛出

写成代码之后是这样的：

```
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```

## vue-router路由基本使用(详细笔记看vue-router笔记)

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

# 属性

## 计算属性(computed)

如果在模板中使用一些复杂的表达式，会让模板显得过于繁重，且后期难以维护。对此，vue.js 提供了计算属性（computed），你可以把这些复杂的表达式写到里面。

模板内的表达式非常便利，但是设计它们的初衷是用于简单运算的。在模板中放入太多的逻辑会让模板过重且难以维护。例如：

```html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

在这个地方，模板不再是简单的声明式逻辑。你必须看一段时间才能意识到，这里是想要显示变量 `message` 的翻转字符串。当你想要在模板中多次引用此处的翻转字符串时，就会更加难以处理。

所以，对于任何复杂逻辑，你都应当使用**计算属性**。

缓存是计算属性的一大特点，使用计算属性时，每次获取的值是基于依赖的缓存值，也就是说，当数据源未发生变动时，获取的值将一直是缓存值。**对于一些依赖于被绑定的状态值变化来更新数据的变量，我们可以把它放到计算属性中。**

```
<style>
.color{color:red}
</style> 

<div id="app">
    <span class="side" v-bind:class="comClass">当前导航</span>
</div>

<script>
new Vue({
    el: '#app',
    data:{
        isColor: true
    },
    computed: {
        comClass: function () {
            return {
                'color': this.isColor
            }
        }
    }
})
</script>
```

上述代码中，当isColor的值更新的时候，计算属性才会重新计算，否则将一直从缓存中获取值并作用于class列表。

**计算属性与methods的区别**

1. vue.js 计算属性有两个方法，分别为 getter 和 setter，当没有指明方法时，默认使用 getter。

```javascript
<div id="app">{{message}}</div>
<script>
var vm = new Vue({
    el: '#app',
    data: {
        title: 'my first lesson'
    },
    computed: {
        message: {
            // getter
            get: function () {
                return this.title
            },
            // setter
            set: function (newValue) {
                this.title = newValue
            }
        }
    }
})
vm.message = 'my second lesson';
</script>
```

上述实例中，在给message重新赋值时，vue.js会执行set方法，从而改变message的值，如果不使用set方法，message值为“my first lesson”。

2. **计算属性是基于它们的依赖进行缓存的**。只在相关依赖发生改变时它们才会重新求值,否则计算属性会立即返回之前的计算结果，而不必再次执行函数。

## 观察者(watch)

watch 属性用于监视 vue 实例上的数据变动，并相应的改变其他变量的值。

```javascript
<div id="app">
    <input type="text" v-model="firstName"/>
    <input type="text" v-model="lastName"/>
    <p>我的名字是：{{fullName}}</p>
</div>

<script>
new Vue({
    el: '#app',
    data: {
        firstName: 'stephen',
        lastName: 'curry',
        fullName: 'stephen curry'
    },
    watch: {
        firstName: function (curVal, oldVal) {
            this.fullName = curVal + ' ' + this.lastName
        },
        lastName: function (curVal, oldVal) {
            this.fullName = this.firstName + ' ' + curVal
        }
    }
})
</script>
```

上述代码中，监视了firstName和lastName这两个变量，当用户输入新的数据改变其值时，watch就会执行对应的函数，返回处理后的值并赋值给fullName变量。

**注释：**1. curVal 表示当前数据，oldVal 表示前一步数据（或默认数据）.另外，oldVal 参数可缺省。

   	   2. 当监视的数据是一个数组或者对象时，curVal 和 oldVal 是相等的，因为这两个形参指向的是同一个数据对象。

**Watch deep 选项**

类型是对象的变量，当键值发生变化时，为了监听到数据变化，需要设置deep选项为true，如下：

```javascript
<div id="app">
    <input type="text" v-model="fruits.count"/>
    <input type="text" v-model="fruits.name"/>
    <p>fruits：{{message}}</p>
</div>

<script>
new Vue({
    el: '#app',
    data: {
        fruits: {
            name: "香蕉",
            count: 5
        },
        message: '5条香蕉'
    },
    watch: {
        fruits: {
            handler(obj){
                this.message = obj.count + '条' + obj.name
            },
            deep: true
        }
    }
})
</script>
```

## 计算属性 与 watch

计算属性在大多数情况下更合适，但有时也需要一个自定义的 watcher 。这是为什么 Vue 提供一个更通用的方法通过 watch 选项，来响应数据的变化。当你想要在数据变化响应时，执行异步操作或开销较大的操作，这是很有用的。

## 生命周期钩子函数

**注意**:不要在选项属性或回调上使用箭头函数.因为箭头函数是和父级上下文绑定在一起的,this不会是如你预期的Vue实例,经常导致`Uncaught TypeError: Cannot read property of undefined`或`Uncaught TypeError: this.myMethod is not a function`之类的错误