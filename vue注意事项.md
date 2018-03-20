# vue使用过程中需要注意的问题
## 一.对象赋值要有空格<font color="red">属性名:(空格)值</font>
```
# 正确示范
new Vue({
    el: '#app'
})

# 错误示范
new Vue({
    el : '#app'
})
```



## 二.运算符空格<font color="orange">(待定，此条应该是书写规范)</font>
### 使用<font color="red">*</font>或者<font color="red">+</font>等运算符的时候，两边<font color="red">必须有空格</font>
```
# 正确示范
var a = '123'
#错误示范
var a= '123'
var a ='123'
```
# 三.`<template></template>`中只能有一个根元素



## 三.函数空格<font color="orange">(待定)</font>
### <font color="red">()</font>两边都必须加空格，没有参数的时候括号内部不能有空格
```
# 正确示范
function fun () { ... }
# 错误示范
function fun(){ ... }
function fun ( ) { ... }
```
### 有多个参数的时候,分隔符右侧必须有空格，左边不能有空格<font color="orange">(待定，此条应该是书写规范)</font>
```
# 正确示范
function fun (a, b) { ... }
# 错误示范
function fun (a , b) { ... }
function fun (a ,b) { ... }
```
### 其他空格
####if和for语句的空格处理办法和上面函数是一样的，这里就不多说，尝试一遍就清楚了



## 四.分号结束符
### 以前写JS的时候，喜欢在每一行的结束加上<font color="red">;</font>作为结束，但是这里就不用了。如果写了反而会报错。
```
#### 正确示范
var a = '123'
#### 错误示范
var a = '123';
```
## 五.vue2.0中没有了`$index`，所以
```
## 错误：
<li class="support-item" v-for="item in seller.supports">
    <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
    <span class="text">{{ seller.supports[$index].description }}</span>
</li>
```
改为
```
<li class="support-item" v-for="(item,index) in seller.supports">
    <span class="icon" :class="classMap[seller.supports[index].type]"></span>
    <span class="text">{{ seller.supports[index].description }}</span>
</li>
```

## 六.import引用
是`export default`的import时不用{}
是`export function`的用{}

## 七.数据绑定
{{msg}} 数据更新，模板变化
{{*msg}} 数据只绑定一次
{{{msg}}} HTML转义输出

## 八.子组件获取父组件数据用props
  父组件中，给子组件的标签进行数据绑定，即v-bind就可以传值进子组件，子组件用props接受父组件数据
## 九.父组件获取子组件数据
  子组件将数据发送给父组件
  在子组件中`this.$emit('事件名', 数据)`，父组件用`v-on`接收
  ```
  //子组件中（bbb）
  this.$emit('child', c)
  
  //父组件中（aaa）
  <aaa>
	<bbb @child="sth"></bbb>
  </aaa>
  
  methods：sth（c）{}
  ```
## 十.ready
  2.0中变为mounted
## 十一.生命周期（钩子函数）（2.0）
beforeCreate 组件实例刚刚被创建，属性都没有
created 实例已经创建完成，属性已经绑定
beforeMount 模板编译之前
mounted 模板编译之后
beforeUpdate 组件更新之前
updated 组件更新完毕
beforeDestroy 组件销毁之前
destroyed 组件销毁之后

## 十二.track-by=“id”
2.0中变成了 :key="index"
## 十三.自定义键盘指令
之前：
  Vue.directive('on').keyCodes.ctrl=17
2.0:
  Vue.config.keyCodes.ctrl=17
## 十四.过滤器
之前：系统自带很多过滤器
2.0：内置过滤器全删除了
自定义过滤器传参：
之前：参数用空格隔开
2.0：用函数写法：sth（a，b）


## 十五.通信
之前：子组件可以直接更改父组件信息
2.0:不允许
问题：就想子组件更改父组件数据
  * 方法1（最靠谱）：父组件每次传一个对象给子组件，对象之间引用
  例子
  ```
  //父组件：
  <div>
    父级：{{giveData.a}}
	<child :msg="giveData"></child>
  </div>
  
  data:{
    giveData: {
	  a: '我是父组件数据'
	}
  }
  
  //子组件：
  <template>
    <div>
	  <span>我是子组件</span>
	  <input type="button" value="按钮" @click="change">
	  <span>{{msg.a}}</span>
	</div>
  </template>
  
  props: {
    msg
  },
  methods: {
    change () {
	  this.msg.a = '被改了'
	}
  }
  ```
 
  * 方法2：只是不报错，mounted中转
  例子
  ```
  //父组件：
  <div>
    父级：{{a}}
	<child :msg="a"></child>
  </div>
  
  data:{
    a: '我是父组件数据'
  }
  
  //子组件：
  <template>
    <div>
	  <span>我是子组件</span>
	  <input type="button" value="按钮" @click="change">
	  <span>{{b}}</span>
	</div>
  </template>
  
  data () {
    return {
	  b: ''
	}
  },
  mounted () {
    this.b = this.msg
  },
  props: {
    msg
  },
  methods: {
    change () {
	  this.b = '被改了'
	}
  }
  ```
  ===========================
  单一事件管理组件通信
  例子
  ```
  //父组件
  <div id="box">
    <com-a></com-a>
    <com-b></com-b>
    <com-c></com-c>
  </div>
  // 准备一个全局空对象
  var Event = new Vue({})
  // a组件
  <div>
    <span>我是a组件</span> -> {{a}}
    <input type="button" value="把a数据传给c" @click="send">
  </div>
  data () {
    return {
	  a: '我是a数据'
	}
  },
  methods: {
    send(){
	  Event.$emit('a-msg',this.a)
	}
  }
  // b组件
  <div>
    <span>我是b组件</span> -> {{a}}
    <input type="button" value="把b数据传给c" @click="send">
  </div>
  data () {
    return {
	  a: '我是b数据'
	},
	methods: {
    send(){
	  Event.$emit('b-msg',this.a)
	}
  }
  }
  // c组件
  <div>
    <span>我是c组件</span>
	<span>接收过来的a的数据为</span>->{{A}}
	<span>接收过来的b的数据为</span>->{{B}}
  </div>
  data () {
    return {
	  A: ''
	  B: ''
	}
  },
  mounted(){
  // 接受a的数据
    Event.$on('a-msg',function(a){
	var _this = this
	  _this.B = a
	})
	// 接受b的数据
    Event.$on('b-msg',function(a){
	var _this = this
	  _this.A = a
	})
  }
  
  // 或者
  mounted(){
    Event.$on('a-msg',function(a){
	  this.A = a
	}.bind(this))
  }
  ```
## 十六.transition与animate.js组合使用(animate.js)[https://daneden.github.io/animate.css/]
直接在<transition>上添加
例子
```
<transition enter-active-class="bounceInLeft" 
   leave-active-class="bounceOutRight">
  <p v-show="show" class="animated">
</transition>

// 或者
<transition enter-active-class="animated bounceInLeft" 
   leave-active-class="animated bounceOutRight">
  <p v-show="show">
</transition>
```

## 十七 <transition-group>多元素运动
```
<transition-group enter-active-class="bounceInLeft" 
   leave-active-class="bounceOutRight">
  <p v-show="show" class="animated" :key="1">
  <p v-show="show" class="animated" :key="2">
</transition-group>

// 循环添加(效果为输入框中输入‘a’，则有‘a’的元素展示)
new  Vue({
  el: '#box',
  data:{
    show:"",
    list:['apple','banana','orange','pear']
  },
  computed: {
    lists: function(){
	  var arr = []
	  this.list.forEach(function(val){
	    if(val.indexOf(this.show)!=-1){
		  arr.push(val)
		}
	  }.bind(this))
	  return arr
	}
  }
})

<div id="box">
  <input type="text" v-model="show">
  <transition-group enter-active-class="bounceInLeft" 
     leave-active-class="bounceOutRight">
    <p class="animated" v-for="(val,index) in lists" :key="index">
	  {{val}}
	</p>
  </transition-group>
</div>
```

## 十八.路由
(路由官网)[https://router.vuejs.org/zh-cn/index.html]
重定向(想一打开就是主页)
打开src/router/index.js，加上如下代码
```
    {
      path: '*',
      redirect: '/home'
    }
```
### 路由嵌套
```
<router-link to="/user">
  <router-link to="/user/username"></router-link>
  <router-view></router-view>
</router-link>

    {
      path: '/user',
      component: User
	  children: [
	    path: 'username'
		component: Username
	  ]
    }
```
路由实例方法
router.push（{path:'home'}）// 直接添加一个路由,表现切换路由，本质往历史记录了添加一个
router.replace（{path:'news'}）// 替换路由,不会往历史记录里添加