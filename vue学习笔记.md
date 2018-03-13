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
   > 所以它设置了一些条件，当你触发了这些条件之后，它就执行一个检测来遍历所有的数据，对比你更改了地方，然后执行变化。
   > 这个检查很不科学。而且效率不高，有很多多余的地方，所以官方称为 脏检查。
* 与React区别
 + 相同点：
  - React 采用特殊JSX语法，vue采用.vue特殊文件格式，二者都需要编译后使用
  - 中心思想相同： 一切都是组件
  - 都提供合理的钩子函数
   > 钩子函数：相当于生活中挂东西的钩子，在程序里来说就是你定义了一个小功能，可以在任何想用的地方挂上去。
   > 这个小功能利用钩子挂上去，比如评论列表展示，可以是一个钩子，在需要的地方挂上去。
   > 这个东西和插件其实差不多,插件的功能相对于钩子来说，更复杂，钩子的话，功能更单一更灵活。
  - 都不内置类似AJAX、Router等功能的核心包，而是以插件方式加载
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
   `{{}}`还可以放在标签内`<li data-id="{{id}}"></li>`

### 2.1.2 表达式
  * `{{}}`中也支持表达式形式，可以是各种数值、变量、运算符的综合体
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

 * 我们应该尽量避免直接设置数据绑定的数组元素，因为这些变化不会被Vue.js检测到，因而也不会更新视图渲染。
这时，我们可以使用`$set`方法：
```
、、 像demo.item[0] = ...
set`方法：demo.items.$set(0, {childMsg: 'Changed!'})
`items是数组`括号中的数字指代位置，后面是插入的内容，
意思就是在数组items[0]的位置插入 {childMsg: 'Changed!'}
``` 
 * `$remove`是splice的语法糖，用于从目标数组中查找并删除元素
  > demo.items.$remove(item)

### 3.1.6 v-bind
  用于响应更新HTML特性，将那个一个或多个attribute，或者一个组件prop动态绑定
到表达式，可以简写为`:`

### 3.1.7 v-on
  用于绑定时间监听器。如果在内联语句处理器中访问原生DOM时间，
则可以用特殊变量`$event`把他传入方法
  v-on后面不仅可以跟参数，还可以增加修饰符
  * .stop - 调用event.stopPropagation(),阻止冒泡
  * .prevent - 调用event.preventDefault(),阻止默认行为
  * .capture - 添加时间监听器时使用capture模式
  * .self - 只当事件是从监听器绑定的元素本身触发时才出发回调
  * .{keyCode | keyAlias} - 只在指定按键上触发回调
    > vue提供的键值有：esc：27、tab：9、enter：13
	> space：32、‘delete’[8,46]、up：38、left：39、down：40

### 3.1.8 v-ref
  在父组件上注册一个子组件的索引，便于直接访问，可以通过父组件的$refs对象访问子组件
  名字要是驼峰命名
## 3.2 自定义指令
### 3.2.1 基础
  除了内置指令，vue也允许注册自定义指令。自定义指令提供一种机制将数据的变化映射为DOM行为
  vue用`Vue.directive(id,definition)`方法注册一个全局自定义指令，他接收两个参数，
指令ID与定义对象

1. 钩子函数
  vue提供了几个钩子函数（都是可选的，相互之间没有制约关系）
  * bind：只调用一次，在指令第一次绑定到元素上时调用
  * update： 在bind之后立即以初始值为参数第一次调用，之后每当绑定值变化时调用，参数为新值与旧值
  * unbind：只调用一次，在指令从元素上解绑时调用
  ```
  Vue.directive(id,{
    bind: function(){
      // 准备工作
      //例如，添加事件处理器或只需要运行一次的高耗任务
    },
    update: function(newValue,oldValue){
      //值更新时的工作
      //也会以初始值为参数调用一次
    },
	unbind: function(){
	  //清理工作
	  //例如， 删除bind()添加的事件监听器
	}
  })
  ```
# 四.计算属性（computed: {}）
## 4.1 什么事计算属性
  计算属性就是当其依赖属性的值发生变化时，这个属性的值会自动更新
与之相关的DOM部分也会同步自动更新
## 4.2 计算属性缓存
  计算属性的特性很诱人，但是如果在计算属性方法中执行大量的耗时操作，则可能会
带来一些性能问题

# 五.表单控件绑定（v-model）
## 5.1 基本用法
### 5.1.1 text
  设置文本框v-model为name
  ```
  <span>Welcome {{name}} join DDFE</span>
  <input type="text" v-model="name">
  ```
  当用户操作文本框时`{{name}}`会自动更新为用户输入的值

### 5.1.2 checkbox
```
<input type="checkbox" v-model="checked" id="checkbox">
<label for="checkbox">{{checked}}</label>
```
当用户勾选checkbox时，label中的值也会随之改变

大多数时候使用的是复选框组，此时，被选中的值将会放入一个数组中
```
  <input type="checkbox" v-model="bizLines" id="flash">
  <label for="flash">快车</label>
  <input type="checkbox" v-model="bizLines" id="premium">
  <label for="premium">专车</label>
  <input type="checkbox" v-model="bizLines" id="bus">
  <label for="bus">公交</label>
  <span>Checked lines:{{bizLines | json}}</span>
  
  new Vue({
    el: '...'
    data: {
      bizLines:[]
    }
  })
```

### 5.1.3 radio
  当单选按钮被选中时，v-model中的变量值会被赋值为对应的value值
```
  <input type="radio" v-model="bizLine" id="flash">
  <label for="flash">快车</label>
  
  <input type="radio" v-model="bizLine" id="bus">
  <label for="bus">公交</label>
  <span>Picked:{{bizLine}}</span> 
```

### 5.1.4 select
  因为select控件分为单选和多选，所以v-model会又不同
  * 单选：
    ```
	<select v-model="bizLine">
      <option value="flash" selected>快车</option>
      <option value="premium">专车</option>
      <option value="bus">公交</option>
    </select>
    <span>Selected: {{bizLine}}</span>
	```
	当被选中的option有value属性时，vm.select为对应option的value值，否则为text值
	
	* 对于多选，被选中值会放入一个数组中
	```
	<select v-model="bizLines" multiple>
      <option value="flash" selected>快车</option>
      <option value="premium">专车</option>
      <option value="bus">公交</option>
    </select>
    <span>Selected: {{bizLines | json}}</span>
  ```
## 5.2 值绑定
  在通常情况下，对于radio、checkbox、select组件，通过v-model绑定的值都是字符串，
checkbox除外，checkbox可能是布尔值
```
<!--勾选时 toggle的值是布尔值true，否则为false-->
  <input type="checkbox" v-model="toggle">
```
可以用v-bind来代替直接使用value属性
1. checkbox
```
<input type="checkbox" 
         v-model="toggle" 
         :true-value="a" 
         :false-value="b">
```
* 勾选时。vm.toggle === v.a
* 未勾选时。vm.toggle === v.b
true-value，false-value只适合同一个checkbox组只有一个checkbox的情况，若有多个要用:value进行值绑定

2. radio
```
<input type="radio" v-model="pick" :value="a">
```
勾选时，vm.pick = vm.a

3. select
```
  <select v-model="selected">
    <option :value="{number:123}">123</option>
  </select>
```
勾选时vm.selected === {number:123}