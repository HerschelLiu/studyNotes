## 准备

`vue create xxx`选择ts和TSLint

安装`vue-class-component`装饰器，可以使用基于类的API。例如

```jsx
import Vue from 'vue'
import Component from 'vue-class-component'
import home from "../views/home.vue";//导入组件

@Component({
  components: { home },
  props: {
    propMessage: String
  }
})
export default class App extends Vue {
  // 初始 data
  msg = 123

  // use prop values for initial data
  helloMsg = 'Hello, ' + this.propMessage

  // 生命钩子lifecycle hook
  mounted () {
    this.greet()
  }

  // 计算属性computed
  get computedMsg () {
    return 'computed ' + this.msg
  }

  // 方法method5
  greet () {
    alert('greeting: ' + this.msg)
  }
}
```

如果想使用@Emit、@Inject、@Model、@Prop、@Provide、@Watch等装饰器,可以安装 `npm i -S vue-property-decorator`


如果想在项目中使用Vuex,可以安装 `npm install --save vuex-class`
