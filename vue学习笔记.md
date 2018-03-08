# 一.遇见Vue
## 1.1 MVX模式
### 1.1.1 MVC
  MVC是应用最广泛的软件架构之一，一般分为Model（模型）、Controller（控制器）和View（视图）
  View一般通过Controller来和Model联系。Controller是Model和View的协调者，这二者不直接联系
  MVC通讯方式一：View -> Controller -> Model -> View
  MVC通讯方式二，添加了用户操作：User -> Controller -> Model -> View，用户通过Controller来操作Model以达到View的变化
### 1.1.2 MVP
  由MVC发展而来，Controller/Presenter负责逻辑的处理。Presenter完全把View和Model分开，主要逻辑在Presenter写
  通信方式：Model <-> Presenter <-> view
### 1.1. MVVM
vue.js用的就是这种模式
MVVM只是把Controller和Presenter变成了ViewModel。view和viewModel的变化都会同步到对方那里

## 1.2 Vue.js
Vue.js只聚焦视图层，是一个构建数据驱动的web界面的库。他通过简单的API提供高效的数据绑定和灵活的组件系统
特性：
1. 轻量化：他已经算是前端库里体积非常小的，但不依赖其他基础库
2. 数据绑定：数据绑定简单、方便
3. 指令，通过类似于AngularJS的指令或自定义指令可以修改对应DOM
4. 插件化

### 1.2.1 与其他框架区别

* 与AngularJS的区别
 + 相同点：
  - 支持指令
  - 支持过滤器
  - 支持双向绑定
  - 不支持低端浏览器（如IE678）
 + 不同点：
  - AngularJS学习成本高，而Vue本身提供的API比较简单，直观
  - 在性能上，A依赖对数据做脏检查,所以Watcher越多越慢
   > 脏检查：在 angular中，他没有办法判断你的数据是否做了更改， 
   > 所以它设置了一些条件，当你触发了这些条件之后，它就执行一个检测来遍历所有的数据，对比你更改了地方，然后执行变化。这个检查很不科学。
   > 而且效率不高，有很多多余的地方，所以官方称为 脏检查。
* 与React区别
 + 相同点：
  - React 采用特殊JSX语法，vue采用。vue特殊文件格式，二者都需要编译后使用
  - 中心思想相同： 一切都是组件
  - 都提供合理的钩子函数
   > 钩子函数：相当于生活中挂东西的钩子，在程序里来说就是你定义了一个小功能，可以在任何想用的地方挂上去。
   > 这个小功能利用钩子挂上去，比如评论列表展示，可以是一个钩子，在需要的地方挂上去。
   > 这个东西和插件其实差不多,插件的功能相对于钩子来说，更复杂，钩子的话，功能更单一更灵活。
  - 都不内置累死AJAX、Router等功能的和心包，而是以插件方式加载
  - 在组件开发中都支持mixins的特性
  - React依赖Virtual AOM，会对渲染出来的结果做脏检查
  - vue在模板中提供指令、过滤器等，方便、快捷操作DOM
  
### 1.2.2 如何使用vue
* 安装
 + script方式引用
 + npm
 
# 二.数据绑定 
## 2.1 语法
### 2.1.1 插值
  文本插值是最基本的形式，使用`{{}}`
例子：`<span>Text: {{text}} <span>`
  双大括号会把里面的值全部当做字符串处理，如果是HTML片段，则可以用`{{{}}}`来绑定
  例子
  ```
  <div>LOGO: {{{logo}}</div>
  logo: '<span>DDFF</span>'
  ```
   `{{}}`黑可以放在标签内`<li data-id="{{id}}"></li>`

### 2.1.2 表达式
  * `{{}}`中也只吃表达式形式，可以是各种数值、变量、运算符的综合体
  ```
  // 有效示例
  {{cents/100}}
  {{true?1:0}}
  
  // 无效示例
  {{var logo=1}}// 这是语句，不是表达式
  {{if(true) return 'ddff'}}// 条件控制语句是不支持的，可以使用三元表达式
  ```
  * vue允许在表达式后面添加过滤符`{{example | toUpperCase}}`，
  * 还支持传入参数`{{example | filter a b}}`
  
# 三.指令
  指令是带有特殊前缀`v-`的特性。指令的值限定为绑定表达式

## 3.1 内部指令  
### 3.1.1 v-if
  可以完全根据表达式的值在DOM中生成或者移除一个元素

### 3.1.2 v-show
  是根据表达式的值来显示或者隐藏HTML元素
  
### 3.1.3 v-else
  顾名思义，v-else就是js中else的意思，他必须跟着v-if

### 3.1.4 v-model
  用来在input、select、text、checkbox、radio等表单元素上创建
双向数据绑定。
  v-model后面还可以添加多个参数（number、lazy、debounce）
  * number：如果想将用户输入自动转换为Number类型
    > <input type="text" v-model="msg" number>
  * lazy 默认数据是同步变化的，加上lazy会将数据改到change事件中发生
  * debounce：设置一个最小延时，每次敲击后延时同步输入框的值与数据
   > <input type="text" v-model="msg" debounce="5000">
   > 内容会在5000ms后才改变
  
### 3.1.5 v-for
`<div v-for="(item, index) in items"></div>`
如果没有索引而报错，不防加上`:key=''`