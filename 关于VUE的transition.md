# 更多内容看vue注意事项.md

在2.0中因为`transition`属性变成了`<transition name=""></transition>`标签,
所以不再有`-transition`的类名，凡是`*-transition`的内容，写在被`<transition name=""></transition>`包裹的那个标签的样式里就行，
# `*-enter`等和包裹的标签类名是同一级
# .*-leave`应该是.*-leave-active`(即enter和leave-active状态的效果是相同的)
# `<transition-group>`写法：在他包裹的div中加上`:key="index"`就不会报错了
```
<transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
  <div class="ball" v-for="(ball, index) in balls" v-show="ball.show" :key="index">
    <div class="inner inner-hook"></div>
  </div>
</transition-group>
```
transition的钩子函数要放在methods中
2.0中属性
* 1.-enter  进入的初始状态
* 2.-enter-active  变化成什么样->当元素出来
* 3.-leave 离开的初始状态
* 4.-leave-active  变化成什么样->当元素离开（消失）
即1,4一对，2,3一对
例子
```
<transition name="fade"></transition>
.fade-enter-active,
.fade-leave-active{
  transition: 1s all ease;
}
.fade-enter,
.fade-leave-active{
  opacity:0;
  width: 100px;
  height: 100px
}
.fade-enter-active,
.fade-leave{
  opacity:1;
  width: 300px;
  height: 300px
}

```