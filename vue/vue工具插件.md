* js-cookie：一个简单、轻量级的JavaScript API，用于处理cookie。适用于所有浏览器，接受任何字符，经过严格测试，无依赖关系，支持ES模块，支持AMD/Common

* normalize.css：Normalize.css 是一个可以定制的CSS文件，它让不同的浏览器在渲染网页元素的时候形式更统一。 Normalize.css 能干什么：保留有用的默认值，不同于许多 CSS 的重置标准化的样式，适用范围广的元素。纠正错误和常见的浏览器的不一致性。一些细微的改进，提高了易用性。使用详细的注释来解释代码。

* nprogress：这是一个类似youtube、Medium等网站顶部小进度条插件。

* 是一个增加了一些安全性的查询字符串解析和序列化字符串的库。`qs.parse()`是将URL解析成对象的形式`qs.stringify()`是将对象 序列化成URL的形式，以&进行拼接.`let data = qs.stringify({"username":this.username, "password":this.password});` =>`username=renping&password=123456`

* screenfull：实现全屏功能`npm install --save screenfull`

* v-viewer：vue图片点击放大`npm install v-viewer --save`

* vue-awesome-swiper：vue轮播插件，基于swiper`npm install --save vue-awesome-swiper`

* vue-countTo：数字滚动插件`npm install vue-count-to`

* vue-cropper：图片裁剪

* vue-drag-resize：拖拽缩放

* vue-svgicon：一个创建 svg 图标组件的工具

  ```json
  
  // package.json
  // 生成 svg 图标组件, -s: svg 源文件，-t: 图标组件生成路径
  {
      "scripts": {
      "svg": "vsvg -s ./src/icons/svg -t ./src/icons/components --ext ts --es6"
      }
  }
  // 执行命令 npm run svg
  ```

  ```css
  /* 首先，需要为 vue-svgicon 在全局写一些样式代码。 */
  /* recommended css code for vue-svgicon */
  .svg-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      color: inherit;
      vertical-align: middle;
      fill: none;
      stroke: currentColor;
  }
  
  .svg-fill {
      fill: currentColor;
      stroke: none;
  }
  
  .svg-up {
      /* 默认 */
      transform: rotate(0deg);
  }
  
  .svg-right {
      transform: rotate(90deg);
  }
  
  .svg-down {
      transform: rotate(180deg);
  }
  
  .svg-left {
      transform: rotate(-90deg);
  }
  ```

  ```js
  /* 在main.js中引入svgIcon组件并且全局注册 vue-svgicon 组件 */
  // main.js
  import Vue from 'vue'
  import App from './App.vue'
  import SvgIcon from 'vue-svgicon'
  
  // Default tag name is 'svgicon'
  Vue.use(SvgIcon, {
          tagName: 'svgicon'
      }
  
  ) new Vue( {
          el: '#app',
          render: h=> h(App)
      }
  
  )
  ```

  ```vue
  /* 在组件中使用 */
  <template>
      <div id="app">
          <p>
              <svgicon
                  name="404"
                  width="200"
                  height="200"
                  color="#42b983 #35495e"
              ></svgicon>
          </p>
      </div>
  </template>
   
  <script>
  // �使用之前需要引入生成的图标�
  import 'src/icons/components/404'
   
  export default {
      name: 'app',
      data() {
          return {
              msg: 'Welcome to Your Vue.js App'
          }
      }
  }
  </script>
  ```

* vuedraggable：拖拽，页面中使用需要引用组件vuedraggable

* vuex-module-decorators：TypeScriptES7装饰器，用于以声明方式创建Vuex模块

* vue-class-component：提供了Vue、Component等

* vue-property-decorator：深度依赖了vue-class-component，拓展出了更多操作符：@Prop、@Emit、@Inject、@Model、@Provide、@Watch

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

