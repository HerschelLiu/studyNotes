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
   >  > 所以它设置了一些条件，当你触发了这些条件之后，它就执行一个检测来遍历所有的数据，对比你更改了地方，然后执行变化。
   >  >
   >  > > 这个检查很不科学。而且效率不高，有很多多余的地方，所以官方称为 脏检查。
* 与React区别
 + 相同点：
  - React 采用特殊JSX语法，vue采用.vue特殊文件格式，二者都需要编译后使用
  - 中心思想相同： 一切都是组件
  - 都提供合理的钩子函数
   > 钩子函数：相当于生活中挂东西的钩子，在程序里来说就是你定义了一个小功能，可以在任何想用的地方挂上去。
   >  > 这个小功能利用钩子挂上去，比如评论列表展示，可以是一个钩子，在需要的地方挂上去。
   >  >
   >  > > 这个东西和插件其实差不多,插件的功能相对于钩子来说，更复杂，钩子的话，功能更单一更灵活。
   > - 都不内置类似AJAX、Router等功能的核心包，而是以插件方式加载
   > - 在组件开发中都支持mixins的特性
   > - React依赖Virtual AOM，会对渲染出来的结果做脏检查
   > - vue在模板中提供指令、过滤器等，方便、快捷操作DOM

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
   >
   >  > 内容会在5000ms后才改变

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

# 六.过滤器
  过滤器本质上都是函数，其作用在于用户输入数据后，他能进行处理，并返回一个数据结果
使用管道符（|）进行连接`{{'abc' | uppercase}}// 'abc' => 'ABC'`，
这里使用了vue内置的过滤器uppercase将字符串中的字母全部转换为大写形式
除了双大括号形式，还可以在绑定指令的表达式后调用
```
<span v-text="message | uppercase"></span>
```
过滤器可以接受参数，参数跟在过滤器名称后面，参数之间以空格分隔
```
{{message | filterFunction 'arg1' arg2}}
```
强调：过滤器函数将始终以表达式的值作为第一个参数。带引号的参数会被当成字符串处理，
而不带引号的参数会被当作数据属性名来处理。
这里message将作为第一个参数，字符串arg1作为第二个参数，表达式arg2的值在计算出来后作为第三个参数传给过滤器

## 6.1 内置过滤器
  vue内置了一系列常用的过滤器，可以直接调用。这些内置过滤器相对比较简单，复杂的自己定义
  > 字母操作：capitalize（首字母大写）、uppercase（所有字母转换为大写）、lowercase（所有字母转换为小写）
  > 限制：
    用于处理并返回过滤后的数组，比如与v-for搭配使用
	注意：这三个过滤器所处理的表达式的值必须是数组
	1. limitBy：限制数组为开始的前N个元素，N由传入的第一个参数指定，第二个参数可选，用于指定开始的偏移量，默认为0，即不偏移
	   <!--只显示开始的10个元素-->
       <div v-for="item in items | limitBy 10"></div>
	   <!--只显示5到15个元素-->
       <div v-for="item in items | limitBy 10 5"></div>
	2. filterBy：使用比较灵活，第一个参数可以是字符串或函数
	     如果第一个参数是字符串，将在每个数组中搜索它，并返回包含该字符串的元素组成的数组
	3. orderBy：返回排序后的数组，>=0升序，order<0降序，第一个参数字符串||数组||函数。第二个参数order可选，决定结果为升序或降序，默认为1，即升序
  > json：JSON.stringify（）的精简缩略版，可将表达式的值转换为JSON字符串
    即输出表达式经过JSON.stringify（）处理厚的结果
	json可以接受一个类型为Number的参数，用于决定转换后的JSON字符串的缩进新，若不出入，默认为2
```
	 // 以4个空格的缩进打印一个对象
	  <pre>{{didiFamily | json 4}}</pre>    
	```
  > currency：将数字值转换为货币形式输出，第一个参数接受类型为String的货币符号，不输入默认为美元符号$，第二个参数接受NUmber类型的小数位，不输入默认为2
    如果第一个参数默认，第二个参数修改小数位，则第一参数不可省略
	 {{amount | currency '￥'}}
     // 12345 => ￥12,345.00
	 将小数位调整为3位
	 {{amount | currency '$' 3}}
     // 12345 => $12,345.000
  > debounce： 延迟处理器一定时间的执行，其接受的表达式的值必须为函数，因此一般与v-on等指令结合使用
     接受一个可选参数作为延迟时间，单位毫秒，默认为300毫秒

### 6.2.1 fillter（自定义过滤器的语法）
```
//此为es6写法
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
```
# 七.Class与Style绑定
  常见需求是操作元素的class列表和他的内联样式，可以用v-bind处理他们

## 7.1 绑定HTML Class
### 7.1.1 对象语法
  可以传给v-bind：class一个对象，以动态的切换class
注意：v-bind：class可以与普通class并存

### 7.1.2 数组语法
我们可以把一个数组传给v-bind:class，以应用一个class列表

## 7.2 绑定内联样式
### 7.2.1 对象语法
  v-bind:style对象语法非常直观，看着非常像CSS
  ```
   通常直接绑定到一个样式对象更好,让模板更清晰。代码示例如下：
 <div id-example'v-bind:style="ddfe"></div>
 new Vue ({
   el: 'example',
   data: {
     ddfe: {
	   color: orange,
       fontSize: 13px
	 }
   }
 })
  ```
### 7.2.2 数组语法
  v-bind：style的数组语法可以将多个样式对象应用到一个元素上
  ```
  <div v-bind:style="[ddfe, didiFamily]"></div>
  ```
##### 7.2.3 自动添加前缀
  当v-bind：style使用需要前缀的css属性，vue会自动添加

# 八.过渡（2.0版本）[vue.js文档transition](https://cn.vuejs.org/v2/api/#transition)
  应用过渡效果，需要用`<transition name='myname'></transition>`包裹想要进行过渡效果的标签，其中name是定义过渡属性类名的前缀
  transition的类名要与被包裹元素的类名同级

  说明：
 * *-enter：进入过渡的开始状态，元素被插入时生效
 * *-enter-active：进入过渡的结束状态
 * *-leave：离开过渡的开始状态
 * *-leave-active：离开过渡的结束状态
 * *-enter，*-leave-active这两个设置样式时一起设置

 还可以使用钩子函数（在methods中写）：beforeEnter，enter，afterEnter，enterCancelled，beforeLeave，leave，afterLeave，leaveCancelled

# 九.methods
  vue的事件监听一般通过v-on指令配置在HTML中
## 9.1 如何绑定事件
### 9.1.1 内联方式
```
<button v-on:click="greet">Greet</button>
```
这中内联方式下，一个事件处理器只能绑定一个方法，如需绑定多个方法，仍需在js代码中使用
addEventListener方法来绑定

### 9.1.2 methods配置
  当用户将click时间与某个方法绑定时，需要在vue实例中进行定义，所有定义的方法都放在
methods属性下

### 9.1.3 $event应用
  创建的方法需要访问原生DOM事件时可以传入event来获取

# 十 vue实例方法 
  vue实例提供的一些有用得属性和方法，这额都以$前缀开头
## 10.1 实例属性
* 组件树访问：
  + $parent:访问当前组件实例的父实例
  + $root：访问当前组件树的根实例，若当前组件无父实例，$root表示当前组件本身
  + $children：访问当前组件实例的的直接子组件实例
  + $refs： 用来访问ref指令的子组件
* DOM访问: $el, $els（2.0中已经不存在，而是用$refs）
* 数据访问：
  + $data：访问组件实例观察的数据对象
  + $options： 访问组件实例化时的初始化选项对象
  
## 10.2 实例方法
### 10.2.1 实例DOM方法的使用
 callback可选
* 内部插入：
  + $appendTo(字符串或DOM元素, callback)：将ref所指的DOM元素或片段插入到目标元素中
* 同级插入
  + $after(字符串或DOM元素, callback)：将ref所指的DOM元素或片段插入到目标元素之后
  + $before(字符串或DOM元素, callback)：将ref所指的DOM元素或片段插入到目标元素之前
* 删除
  + $remove(callback)：将ref所指的DOM元素或片段从DOM中删除
* 延迟
  + $nextTick(callback)：用来在下次DOM更新循环后执行指定的回调函数，
     +使用他可以保证DOM中内容已经与最新数据保持同步（异步更新）

## 10.2.2 实例Event方法的使用
* 触发
  + $dispatch, $broadcast(被$emit取代)
  + $emit(event(字符串), args(可选，传递给监听函数的参数))：用来触发事件
* 监听
  + $on(event(字符串), callback)：用来监听实例上的自定义事件
  + $once(event(字符串), callback): 与$on相同，但只触发一次
* 删除
  + $off(event(字符串), callback(可选))：删除事件监听器
  
# 十一.组件
  可重用性高。把组件代码按照template、style、script拆分，放到对应的.vue文件里
  * 模板（template）
  * 初始数据（data）
  * 接受的外部参数（props）：组件之间通过参数来进行数据的传递和共享
  * 方法（methods）
  * 生命周期钩子函数（created、attached、destroyed）

## 11.1 基础
### 11.1.1 注册
1.全局注册
vue.component（'name', 组建的构造函数）
2.局部注册
在本组件内components中注册你想使用标签的名字比如demo，注册之后在父组件就可以以自定义元素<demo></demo>的形式在本组件内使用

### 11.1.2 数据传递
vue组件之间有三种数据传递方式：props，组件通信，slot
1.props是组件数据的一个字段，期望从父组件传下来数据。可以是字面量，表达式，还可以绑定修饰符。默认是单向绑定，
  为了防止子组件无意修改父组件状态
  + .sync双向绑定
  + .once单次绑定

#### 添加keep-alive指令：可以把切换出去的组件保留在内存中。，，可以保留它的状态或避免重新渲染

## 11.2 相关拓展
### 11.2.1 组件和v-for
  自定义组件可以像普通元素一样直接使用v-for
### 11.2.2 编写可复用组件
### 11.2.4 资源命名约定
vue支持资源的名字使用camelCase或PascalCase形式，并且在模板中自动转换为kebab-case形式

# 十二.表单校验
  表单校验在web应用中是很重要的一环，在vue中可以使用vue-validator
## 12.1 安装
1. npm：npm install vue-validator
## 12.2 基本使用
  将要校验的表单元素包裹在<validator>之中，而在要校验的表单控件元素的v-validate
属性上绑定相应的校验规则。结果会保存在组件实例的$validation属性下，$validation是由validator元素的name属性和前缀$组成的

# 十三.与服务端通信（vue-resource）
## 13.1 配置
### 13.1.4 基本HTTP调用
1. 底层方法
  全局的Vue.http和vue组件的实例方法this.$http都属于底层方法，他们根据所传option参数
的methods属性来判断请求方式是GET还是POST，或者是其他HTTP的合法方法
  （1）全局方法
    ```
	Vue.http(option)
	  ```
  （2）组件实例调用
    ```
	this.$http(option)
	  ```
	二者接受相同option参数，都返回Promise对象。不同的是，全局调用方式
  回调中this指向window，而组建实例调用方式回调指向组件实例
  
  2.便捷方法
    是对底层方法的封装，在调用时可以省去配置需选项option中的method属性，
  以下为vue-resource提供的便捷方法
  ```
  get/post/put/patch/delete/jsonp(url,[data],[options])(data可选)
  ```
  
# 十四.路由与视图
  vue并没有提供路由机制，但是官方以插件（vue-router）的形式提供了对路由的支持
## 14.1安装
  npm install vue-router
## 14.2 基本使用
  ```
  <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
  <router-link to="/foo">Go to Foo</router-link>
  
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
  ```
# 十五.Scrat与vue
## 15.1 安装Scrat
  1.`npm install -g scrat`
  安装后执行 `scrat -v` 查看工具版本
  如果安装失败可以用淘宝镜像`cnpm install -g scrat`
  2.初始化项目
    Scrat 自带脚手架功能，通过`scrat init`命令生成一个scrat脚手架项目
	生成的目录结构如下：
	vue-scrat-demo
	 |- components（模块化资源）
	 |- server（服务端代码）
	 |- views（非模块化资源）
	 |- component.json（模块化资源描述文件）
	 |- fis-conf.js（构建工具配置文件）
	 |- package.json（项目描述文件）
  3.安装依赖组件库
   Scrat采用component作为生态模块，因此可以通过安装component组件，方便开发和团队共享
   打开component.接收文件，修改依赖关系，如下：
   ```
   {
     "name": "scrat-vue",
	 "version": "1.0.0",
	 "dependencies": {
	   "scrat-team/fastclick": "1.0.2"
	 }
   }
   ```
   生态模块名称的结构是"用户名/仓库名回@版本号"，
   这里的fastclick是一个Java Script库，是由github用户scrat-team创建的，版本是1.0.2。
   接节来我们在项目目录下执行scrat install命令,依赖的fastclick库会安装到当前项目
   模块安装后，我们可以在js代码中通过`require('fastclick')`来引用这个模块