[transition用法](https://cn.vuejs.org/v2/guide/transitions.html)
# 2.0用法与1.0不同，以下是2.0用法与
## 用`<transition name="fade"></transition>`包裹想要进行动画的代码
## 以饿了么为例，弹出层的背景为`background: rgba(7,17,27,.8);`
## 添加如下代码
```
.fade-enter-active,
  .fade-leave-active{
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-active{
  opacity: 0;
}
```
 * `.fade-enter`进入之前，此时样式等同于`.fade-leave-active`
 * `.fade-enter-active`进入后，此时样式等同于`.fade-leave`