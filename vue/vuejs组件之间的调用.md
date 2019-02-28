# vuejs组件之间的调用，另外一个重要的选项：components
## 假设src文件夹中有newDiv1.vue和newDiv2.vue两个文件
在app.vue中添加如下代码
```
import Header from './newDiv1'
import Header from './newDiv2'
  new Vue({
    data: {
      isShow: true
    },
    components: {
		newDiv1, newDiv2
	}
  })
```
光用import引用是不行的，<font color=red>*必须通过components来注册*</font>引用来的组件
之后就可以像正常的标签那样书写，就会将组件引用进来
```
<newDiv1></newDiv1>
<newDiv2></newDiv2>
```
在浏览器真实渲染时会将如上的标签替换成相应vue文件中的内容
```
components: {
		newDiv1, newDiv2
	}
```
此行代码直接加在data后面就好，不用照搬最开始的那个示例代码
components是与data，methods等并列的

## 标签的写法必须是<new-div></new-div>这种形式
但是写在模板里自创的标签，vue会自动将驼峰命名法“newDIV”转换成<new-div></new-div>，即<new-div></new-div>vue会自动找到newDiv这种写法
所以，上面的示例应该这个么写
```
<new-div1></new-div1>
<new-div2></new-div2>
```

## props可以自定义一个标签属性
## 子向父组件传参
```
# 例子1
# 子组件中代码
<new-div notes=“hello！”></new-div>
# 父组件中代码
new Vue({
    data: {
      isShow: true
    },
    components: {newDiv}，
	props: [notes]
  })
  
  # 例子2
  # 子组件中代码
  <new-div msgfromfather=“you die！”></new-div>
# 父组件中代码
new Vue({
    data: {
      isShow: true
    },
    components: {newDiv}，
	props: ['msgfromfather']  //因为msgfromfather明显是单词拼接的字符串，所以要加引号 
  })
```
