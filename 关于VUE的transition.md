在2.0中因为`transition`属性变成了`<transition name=""></transition>`标签,
所以不再有`-transition`的类名，凡是`*-transition`的内容，写在被`<transition name=""></transition>`包裹的那个标签的样式里就行，
# `*-enter`等和包裹的标签类名是同一级
# .*-leave`应该是.*-leave-active`
# `<transition-group>`写法：在他抱过的div中加上`:key="index"`就不会报错了
```
<transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
  <div class="ball" v-for="(ball, index) in balls" v-show="ball.show" :key="index">
    <div class="inner inner-hook"></div>
  </div>
</transition-group>
```