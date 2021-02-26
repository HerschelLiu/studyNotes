[TOC]

# vite-1.0.0-rc.13+vue3.0(alpha)

## 快速上手

1. Vite 官方目前提供了一个比较简单的脚手架：create-vite-app，可以使用这个脚手架快速创建一个使用 Vite 构建的 Vue.js 应用

   ```bash
   npm init vite-app <project-name>
   cd <project-name>
   npm install
   npm run dev
   ```

**注：Vite 目前只支持 Vue.js 3.0 版本**。

## 开箱即用

- TypeScript - 内置支持
- less/sass/stylus/postcss - 内置支持（需要单独安装所对应的编译器）

## 配置

新建`vite.config.js`(相当于`vue.config.js`)

```js
const path = require('path');
// import path from 'path'; 此种写法会使npm run dev不能运行，不知道vue.config,js是否也如此

module.exports = {
    base: './', //在生产中服务时的基本公共路径。@default '/'
    alias: {
        '/@/': path.resolve(__dirname, './src'),
        '/@views/': path.resolve(__dirname, './src/views'),
        '/@components/': path.resolve(__dirname, './src/components'),
    },
    outDir: 'dist', //构建输出将放在其中。如果目录存在，它将在构建之前被删除。@default 'dist'
    minify: 'esbuild', //压缩
    hostname: 'localhost', //ip地址
    port: 8888, //端口号
    open: false, //是否自动在浏览器打开
    https: false, //是否开启 https
    ssr: false, //是否服务端渲染
    optimizeDeps: {
        // 引入第三方的配置
        include: ['lodash'],
    },
    proxy: {
        //配置代理
        // 如果是 /lsbdb 打头，则访问地址如下
        // '/lsbdb': 'http://10.192.195.96:8087',
        // 如果是 /lsbdb 打头，则访问地址如下
        // '/lsbdb': {
        //   target: 'http://10.192.195.96:8087/',
        //   changeOrigin: true,
        //   // rewrite: path => path.replace(/^\/lsbdb/, '')
        // }
        '/api': {
            target: 'http://10.0.11.7:8090',
            changeOrigin: true,
            ws: true,
            rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
    },
};
```

* setup是一个新的组件选项，也是其他API的入口。也就是说，你所有的操作都将在setup函数内部定义和执行.setup 函数会在 `beforeCreate` 之后、`created` 之前执行

## 搭配 Typescript(index.html只要把main的后缀改为ts就不能运行)

* 全局安装`Typescript`， `npm install typescript -g`

* 根目录创建tsconfig.json`tsc --init`

  ```json
  {
    "compilerOptions": {
      ...// 其他配置
      "paths": {
        "/@/*": [
          "./src/*"
        ]
      },
      "lib": [
        "esnext",
        "dom",
        "dom.iterable",
        "scripthost"
      ]
    },
    "include": [
      "src/**/*.ts",
      "src/**/*.tsx",
      "src/**/*.vue",
      "src/types/images.d.ts",
      "tests/**/*.ts",
      "tests/**/*.tsx"
    ],
    "exclude": [
      "node_modules"
    ]
  }
  ```

* src 目录下新建 types 文件夹，里面需要配置 ts 的类型

  * 新建`shims-vue.d.ts`

    ```typescript
    declare module '*.vue' { // 在项目根目录或 src 文件夹下新建`shims-vue.d.ts`解决 VSCode 找不到 vue 模块问题
      import { ComponentOptions } from 'vue'
      const componentOptions: ComponentOptions
      export default componentOptions
    }
    ```

  * `images.d.ts`

    ```typescript
    declare module '*.svg'
    declare module '*.png'
    declare module '*.jpg'
    declare module '*.jpeg'
    declare module '*.gif'
    declare module '*.bmp'
    declare module '*.tiff'
    ```

* 将`main.js`改为`main.ts`，并将 `index.html` 中引入的 `main.js` 改为 `main.ts`。

  ```typescript
  // main
  // 3.0支持链式语法
  createApp(App).use(xxx).mount('#app')
  // 也可以
  const app = createApp(App)
  app.use(xxx)
  app.mount('#app')
  ```

  

* 将 `App.vue` 的 `<script>` 修改为 `<script lang="ts">`，就可以编写 `TypeScript `语法。

## Router

下载预览版

```dash
(c)npm install vue-router@next
```

在 src 下新建 router 文件夹，并在文件夹内创建 index.js

```js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
    path: '/',
    name: 'index',
    redirect: '/home'
}, {
    path: '/home',
    name: 'home',
    component: () => import('/@views/Home.vue')
}]

export default createRouter({
  history: createWebHistory(),
  routes
})
```

**main.js**

```js
import { createApp } from 'vue'
import router from '/@/router'

import App from '/@/App.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

**页面**

```js
import {useRoute, useRouter} from 'vue-router'

const route = useRoute() // 相当于 vue2 中的 this.$route
const router = useRouter() // 相当于 vue2 中的 this.$router
```

**注：**如果出现`[vite] Failed to resolve module import "vue-router". (imported by /@/router/`错误，重新npm安装就行了。

## vuex

* `npm install vuex@next`

* 新建`/src/store/index.js`

  ```js
  import { createStore } from 'vuex'
  
  export default createStore({
      state () {
          return {
              count: 0
          }
      },
      mutations: {
          increment (state) {
              state.count++
          }
      },
      actions: {
          increment ({ commit }) {
              commit('increment')
          }
      }
  })
  ```

* `main.js`

  ```js
  import store from '/@/store'
  createApp(App)
      .use(store)
      .mount('#app')
  // 或
  const app = createApp(App)
  app.use(store)
  app.mount('#app')
  ```

* 页面

  ```js
  import { useStore } from 'vuex'
  
  const store = useStore() // 相当于 vue2 中的 this.$store
  store.dispatch() // 通过 store 对象来 dispatch 派发异步任务
  store.commit() // commit 修改 store 数据
  ```

  ## vue3.0新特性

  ### `template`模板

  `vue2.0`里`template`只支持单一根节点，在`vue3.0`里可以使用多个根节点

  ```html
  <template>
  	<!-- vue3.0组件的根节点可以有多个，或者使用<Fragment> 空标签 -->
  	<div class="login"></div>
  	<div class="main"></div>
  	<div></div>
  </template>
  ```

  ### 选用Function_based API（Composition API）

  **生命周期**

  | Vue3.0生命周期  |                          说明                           |       对应的Vue2.0生命周期        |
  | :-------------: | :-----------------------------------------------------: | :-------------------------------: |
  |      setup      | 初始化数据阶段的生命周期，介于beforeCreate与created之间 | 相当于beforeCreate、created的合并 |
  |  onBeforeMount  |                       组件挂载前                        |            beforeMount            |
  |    onMounted    |                      实例挂载完毕                       |              mounted              |
  | onBeforeUpdate  |                    响应式数据变化前                     |           beforeUpdate            |
  |    onUpdated    |                   响应式数据变化完成                    |              updated              |
  | onBeforeUnmount |                       实例销毁前                        |           beforeDestroy           |
  |   onUnmounted   |                       实例已销毁                        |             destroyed             |
  | onErrorCaptured |                      错误数据捕捉                       |                 -                 |

  **为什么撤销 Class API ?**

  1. 更好地支持TypeScript

  2. 除了类型支持以外 Class API 并不带来任何新的优势

  3. vue中的UI组件很少用到继承，一般都是组合，可以用Function-based API

  4. `main.js`支持链式语法（例子见**vuex**部分）

  5. reactive 接收一个普通对象然后返回该普通对象的响应式代理。等同于 2.x 的 Vue.observable(),注意在源码中明确显示需要传递一个对象，否则会抛出异常，如果想要对一个单独的变量使用响应式，可以使用ref。

     ```js
     const obj = reactive({ count: 0 }) // 返回的就是响应式对象
     // 使用
     obj.count ++
     console.log(obj.count) // 输出的是1
     ```
    * 如果想要在组件内使用这个变量需要在setup中返回

        + 第一种返回形式

          ```html
          <template>
              <!-- 这种形式在组件内使用的时候需要obj.count -->
              <p>{{ obj.count }}</p> 
          </template>
          ```
        
          ```js
          import { reactive } from 'vue';
          
          export default defineComponent({
              setup () {
                  const obj = reactive({ count: 0 })
                  return { obj } // 这种形式在组件内使用的时候需要obj.count
              }
          })
          ```
        
        + 第二种返回形式
        
          ```html
          <template>
              <!-- 这种形式在组件内使用的时候跟之前一样 -->
              <p>{{ count }}</p> 
          </template>
          ```
        
          ```js
          import { reactive, toRefs } from 'vue';
          
          export default defineComponent({
              setup () {
                  const obj = reactive({ count: 0 })
                  return { ...toRefs(obj) }
              }
          })
          ```
        
          


  6. ref 接受一个参数值并返回一个响应式且可改变的 ref 对象。ref 对象拥有一个指向内部值的单一属性 .value。

     ```js
     const count = ref(0)
     console.log(count.value) // 0
     
     count.value++
     console.log(count.value) // 1
     ```

  7. toRefs 把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref ，和响应式对象 property 一一对应。

     ```js
     import { reactive, toRefs } from 'vue';
     
     export default defineComponent({
         setup () {
             const obj = reactive({ count: 0 })
             return { ...toRefs(obj) }
         }
     })
     ```

  8. toRef 可以用来为一个 reactive 对象的属性创建一个 ref。这个 ref 可以被传递并且能够保持响应性。

     ```js
     const state = reactive({
       foo: 1,
       bar: 2,
     })
     
     const fooRef = toRef(state, 'foo')
     
     fooRef.value++
     console.log(state.foo) // 2
     
     state.foo++
     console.log(fooRef.value) // 3
     ```

  9. nextTick 跟之前的作用一样只不过呢写法略有不同。

     ```js
     import { nextTick } from 'vue';
     
     export default defineComponent({
         setup () {
             nextTick(() => {
                 console.log('--- DOM更新了 ---')
             })
         }
     })
     ```

     

  **示例**

  ```js
  import { computed, onMounted, ref, watch } from 'vue';
  import { useStore, mapState } from 'vuex'
  export default {
      name: 'Home',
      setup(props, ctx) { 
          /* props 父组件传值
           * context/ctx上下文对象，这个上下文对象中包含了一些有用的属性，这些属性在 Vue2.0 中需要通过 this 才能访问到(3.0无法访问this)，在 vue3.0 中，访问他们变成以下形式：
           * context.parent--> this.$parent 
           * context.root--> this
           * context.emit-->this.$emit
           * context.refs-->this.$refs
           * context.slots --> this.$slots
           * 程序执行setup时，组件尚未被创建，因此能访问到的有用属性有： root、parent、refs、attrs、listeners、isServer、ssrContext、emit 于此同时 data、computed、methods等是访问不到的
           */
          // data
          const count = ref(0)
          // computed
          const plusOne = computed(() => count.value++)
          // method
          const increment = () => count.value++
          // watch
          // 共三个参数，前两个是function，第三个为配置。
          // 第一个参数是监听的值，第二个是监听时候的回调
          watch(() => count.value * 2, v => console.log(v), {
                  //是否深度监听
                  deep: true,
                  //是否先执行一次
                  immediate: true
              })
          // 监听多个值
          watch(
          	[() => count.value, () => name.value],
              ([newData1, newData2], [oldData1, oldData2]) => {
                  console.log(newData1, newData2)
                  console.log(oldData1, oldData2)
              }
          )
          // 生命周期
          onMounted(() => console.log('mounted!')) // 会自动引入
  		// 利用watchEffect可以监听props。
          // 监听器的升级版本，立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数。
          watchEffect(() => { // 利用watchEffect监听props 
     			console.log(props.val); // 首次以及props改变才会执行这里的代码
          })
          // 暴露给模板或渲染函数.可以返回对象或方法
          return { count, plusOne }
      }
  };
  ```

  * setup是一个新的组件选项，也是其他API的入口。也就是说，你所有的操作都将在setup函数内部定义和执行， Vue3.0也将用函数代替Vue2.x的类也就是new 