```js
// 绑定块元素方式一
<div id="app">
  <p>{{ message }}</p>
    <p>{{ good }} </p>
</div>

<script>
new Vue({
  el :'#app'
  data: {
    message: 'Hello Vue.js!',
      good:'this ia a el test'
  }
})
</script>

// 绑定块元素方式二
<div id="app">
  <p>{{ message }}</p>
    <p>{{ good }} </p>
</div>

<script>
new Vue({
  render: h => h(App) // 暂且可理解为是渲染App组件
}).$mount('#app')
</script>
```

二者从使用效果上没有区别，目的都是将vue示例化的对象挂载到DOM元素上。

指定el，在模板渲染的时候会将对象渲染到模板中，如果未指定，vue对象属于*未挂载*状态，需要手动指定挂载，在对象后面加`.$mounted('#id')`，表示延时挂载