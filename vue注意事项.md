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