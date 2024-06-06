[toc]

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

  // 方法methods
  greet () {
    alert('greeting: ' + this.msg)
  }
}
```

使用@Emit、@Inject、@Model、@Prop、@Provide、@Watch等装饰器,可以安装 `npm i -S vue-property-decorator`，**深度依赖了vue-class-component**,所以安装`vue-property-decorator`就要安装`vue-class-component`,然后单独饮用`vue-property-decorator`即可

`vuex-module-decorators`TypeScriptES7装饰器，用于以声明方式创建Vuex模块

```js
  import {Component, Prop, Vue} from 'vue-property-decorator'
   
  @Component
  export default class App extends Vue {
   name:string = 'Simon Zhang'
   
   // computed
   get MyName():string {
   	return `My name is ${this.name}`
   }
   
   // methods
   sayHello():void {
   	alert(`Hello ${this.name}`)
   }
   
   mounted() {
     this.sayHello();
    }
  }
```

  相当于

  ```js
  export default {
   data () {
     return {
      name: 'Simon Zhang'
     }
   },
   
   mounted () {
   	this.sayHello()
   },
   
   computed: {
     MyName() {
      return `My name is ${this.name}`
     }
   },
   
   methods: {
     sayHello() {
      alert(`Hello ${this.name}`)
     },
   }
  }
  ```

## 使用

```typescript
import { Component, Emit, Inject, Model, Prop, Provide, Vue, Watch } from 'vue-property-decorator'

// @Component // @Component 修饰符注明了此类为一个 Vue 组件

@Component({
  name: '',
  components: {},
  // 所有的组件选项都可以放在这里
  template: '<button @click="onClick">Click!</button>'
})
export class MyComponent extends Vue {
  
  @Prop()
  propA: number = 1

  @Prop({ default: 'default value' })
  propB: string

  @Prop([String, Boolean])
  propC: string | boolean

  @Prop({ type: null })
  propD: any

  @Watch('child')
  onChildChanged(val: string, oldVal: string) { }
}
```

相当于

```js
export default {
  props: {
    checked: Boolean,
    propA: Number,
    propB: {
      type: String,
      default: 'default value'
    },
    propC: [String, Boolean],
    propD: { type: null }
  }
  methods: {
    onChildChanged(val, oldVal) { }
  },
  watch: {
    'child': {
      handler: 'onChildChanged',
      immediate: false,
      deep: false
    }
  }
}
```



## 注意

### 当从 npm 安装第三方库时，还要同时安装这个库的类型声明文件

可以从 [TypeSearch](https://links.jianshu.com/go?to=https%3A%2F%2Fmicrosoft.github.io%2FTypeSearch%2F) 中找到并安装这些第三方库的类型声明文件
 如果没有这个库的声明文件的话，我们需要手动声明这个库。`src`目录下新建一个`types`目录,然后在types 目录下新建一个 `index.d.ts`文件

```cpp
//index.d.ts
declare module "vuedraggable";
```

### 使用装饰器都需要在页面中引用

```js
import Component from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator' // 从它引用就可以
```

[vue-property-decorator](https://github.com/kaorun343/vue-property-decorator) 是在 `vue-class-component` 上增强了更多的结合 `Vue` 特性的装饰器，新增了这 7 个装饰器：

- `@Emit`
- `@Inject`
- `@Model`
- `@Prop`
- `@Provide`
- `@Watch`
- `@Component` (从 `vue-class-component` 继承)

## 错误及解决

### 单独使用装饰器出现的错误

#### Parsing error: Using the export keyword between a decorator and a class is not allowed. Please use `export @dec class` instead.

.eslintrc.js 中增加如下配置

```json
parserOptions: {
  parser: 'babel-eslint',
+  ecmaFeatures: {
+    "legacyDecorators": true // 主要是这个选项
+  }
},
```

#### Missing class properties transform.

安装`@babel/plugin-proposal-class-properties`和`"@babel/plugin-proposal-decorators"`

.babelrc.js 中增加如下配置

```json
"plugins": [
  ...
  ["@babel/plugin-proposal-decorators", { "legacy": true }],
  "@babel/plugin-proposal-class-properties"
]
```

