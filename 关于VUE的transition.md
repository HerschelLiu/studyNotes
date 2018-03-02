在2.0中因为`transition`属性变成了`<transition name=""></transition>`标签,
所以不再有`-transition`的类名，凡是`*-transition`的内容，写在被`<transition name=""></transition>`包裹的那个标签的样式里就行，
# `*-enter`等和包裹的标签类名是同一级
# .*-leave`应该是.*-leave-active`