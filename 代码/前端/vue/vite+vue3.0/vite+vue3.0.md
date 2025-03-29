[TOC]

# vite+vue3.0

## 快速上手

vue [快速上手 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/quick-start.html)

```bash
npm/pnpm/yarn/bun create vue@latest
```

Vite

```bash
npm create vite@latest
yarn/pnpm create vite
bunx create-vite
```

然后按照提示操作即可！

你还可以通过附加的命令行选项直接指定项目名称和你想要使用的模板。例如，要构建一个 Vite + Vue 项目，运行:

```bash
# npm 7+, extra double-dash is needed:
npm create vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app --template vue

# bun
bunx create-vite my-vue-app --template vue
```

>  查看 [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) 以获取每个模板的更多细节：`vanilla`，`vanilla-ts`, `vue`, `vue-ts`，`react`，`react-ts`，`react-swc`，`react-swc-ts`，`preact`，`preact-ts`，`lit`，`lit-ts`，`svelte`，`svelte-ts`，`solid`，`solid-ts`，`qwik`，`qwik-ts`。



**注：Vite 目前只支持 Vue.js 3.0 版本**。

## 开箱即用

- TypeScript - 内置支持
- less/sass/stylus/postcss - 内置支持（需要单独安装所对应的编译器）

## 配置

**设置运行命令**package.json

```json
{
  "scripts": {
    "dev": "vite --mode development",
    "build:dev": "vite build --mode dev",
    "build:test": "vue-tsc --noEmit && vite build --mode test",
    "build:uat": "vue-tsc --noEmit && vite build --mode uat",
    "build:prod": "vue-tsc --noEmit && vite build --mode production"
  }
}
```



新建`vite.config.ts`(相当于`vue.config.js`)

```js
import vue from '@vitejs/plugin-vue' // 通过@vitejs/plugin-vue这个插件来支持Vue
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer' // 依赖分析插件。可视化并分析汇总捆绑包，以查看哪些模块占用了空间。
import { defineConfig, loadEnv } from 'vite' // loadEnv加载环境变量
import viteImagemin from 'vite-plugin-imagemin' // 压缩图片资源的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' // 用于生成 svg 雪碧图。当你使用该插件的时候，指定好存放svg的文件夹。再按照指定的方式去访问svg图片。就可以再不产生http请求的情况下渲染出svg图片。使用该插件时，插件会自动将所有svg图片加载到HTML中。并且每一个svg将会被过滤去无用的信息数据。让svg达到最小的值。之后使用svg图片就只需要操作DOM即可，而不需要发送http请求。

// https://vitejs.dev/config/
// https://cn.vitejs.dev/config/
export default ({ mode }) => {
  /**
   * 1. Vite 默认是不加载 .env 文件的，因为这些文件需要在执行完 Vite 配置后才能确定加载哪一个，举个例子，root 和 envDir 选项会影响加载行为。不过当你      的确需要时，你可以使用 Vite 导出的 loadEnv 函数来加载指定的 .env 文件
   * 2. process.cwd()项目根目录（index.html 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的相对路径。
   */
  const env = loadEnv(mode, process.cwd()) // cwd指当前工作路径。根据当前工作目录中的 `mode` 加载 .env 文件

  // 全局变量
  const define = {}
  if (mode !== 'development') define['process.platform'] = 'win32'
  else define['process.env'] = process.env

  return defineConfig({
    base: env.VITE_APP_BASE_URL, // 开发或生产环境服务的公共基础路径。VITE_为.env文件变量名默认前缀，可通过envPrefix配置项配置
    define,
    resolve: {
      alias: { // 配置路径别名
        '@': resolve(__dirname, './src')
      }
    },
    css: {
      preprocessorOptions: { // 指定传递给 CSS 预处理器的选项。
        scss: {
          additionalData: `@import "@/styles/elementVariables.scss"; @import "@/styles/_mixins.scss"; @import "@/styles/_variables.scss";`, // 全局引入scss文件
          charset: false
        }
      }
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [
          resolve(__dirname, './src/icons'),
          resolve(__dirname, './src/views/custom/icons'),
          resolve(__dirname, './node_modules/@element-plus/icons-svg')
        ],
        symbolId: 'icon-[name]'
      }),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false
        },
        optipng: {
          optimizationLevel: 7
        },
        mozjpeg: {
          quality: 20
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox'
            },
            {
              name: 'removeEmptyAttrs',
              active: false
            }
          ]
        }
      }),
      // stats.html
      visualizer()
    ],
    optimizeDeps: {
      include: ['vue']
    },
    server: {
      open: false,
      host: '0.0.0.0',
      port: 9527,
      strictPort: false
    },
    build: {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      minify: 'terser',
      cssCodeSplit: true,
      assetsInlineLimit: 1024 * 1,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const name = id.toString().split('node_modules/')[1].split('/')[0].toString()
              return ['tinymce', 'element-plus', ''].includes(name) && name
            }
          }
        }
      }
    }
  })
}

```

* setup是一个新的组件选项，也是其他API的入口。也就是说，你所有的操作都将在setup函数内部定义和执行.setup 函数会在 `beforeCreate` 之后、`created` 之前执行

## 搭配 Typescript(index.html只要把main的后缀改为ts就不能运行)

* 全局安装`Typescript`， `npm install typescript -g`

* 根目录创建tsconfig.json`npx tsc --init`

  ```json
  {
    "compilerOptions": {
      "target": "esnext",
      "useDefineForClassFields": true,
      "module": "esnext",
      "moduleResolution": "node",
      "strict": true,
      "jsx": "preserve",
      "sourceMap": true,
      "baseUrl": ".",
      "resolveJsonModule": true,
      "isolatedModules": false,
      "esModuleInterop": true,
      "lib": ["esnext", "dom"],
      "paths": {
        "@/*": [
          "src/*"
        ]
      }
    },
    "include": [
      "src/**/*.ts",
      "src/**/*.d.ts",
      "src/**/*.tsx",
      "src/**/*.vue",
      "node_modules/element-plus/global.d.ts",
      "node_modules/vite/types"
    ],
    "references": [{ "path": "./tsconfig.node.json" }]
  }
  
  ```

  **tsconfig.node.json**

  ```json
  {
    "compilerOptions": {
      "composite": true,
      "module": "esnext",
      "moduleResolution": "node"
    },
    "include": ["vite.config.ts"]
  }
  ```

  

* src 目录下新建 types 文件夹，里面需要配置 ts 的类型

  **自动创建组件的类型文件**

  ```ts
  import chalk from 'chalk'
  import fg from 'fast-glob' // devDependencies
  import fs from 'fs-plus' // devDependencies
  
  const entries = await fg(['src/components/**/index.vue'], { dot: true })
  let localComponents = ''
  entries.sort((v1, v2) => {
    return v1.localeCompare(v2)
  })
  entries.forEach(path => {
    path = path.replace(/^src/g, '@')
    let name = path.replace(/\/index\.vue$/g, '')
    name = name.replace(/^@\/components\/(mini\/)?/g, '')
    name = name.replace(/-[a-z]|\/[a-z]/g, $1 => {
      return $1.replace(/[-/]/g, '').toUpperCase()
    })
    name = name.replace(/^[a-z]/g, $1 => {
      return $1.toUpperCase()
    })
    localComponents += `\n    Comp${name}: typeof import('${path}')['default']`
  })
  
  const text = `/** eslint-disable spaced-comment */
  
  /// <reference types="vite/client" />
  
  declare module 'vue' {
    export interface GlobalComponents {${localComponents}
    }
  }
  
  export {}
  `
  
  fs.writeFile('src/types/components.d.ts', text, () => {
    // eslint-disable-next-line no-console
    console.log(chalk.green('类型文件创建成功！！'))
  })
  ```
  
  ```json
  // package.json
  {
    "scripts": {
      "generate:components.d.ts": "node --loader ts-node/esm src/types/index.ts"
    }
  }
  ```
  
  
  
  **shims.axios.d.ts**
  
  ```tsx
  import { AxiosRequestConfig } from 'axios'
  
  declare module 'axios' {
    export interface AxiosRequestConfig {
      shotToast?: boolean
      /** 接口的base类型 */
      base?: 'component'
    }
  }
  ```
  
  **vite-env.d.ts**
  ```tsx
   /** eslint-disable spaced-comment */
   
  // / <reference types="vite/client" />
  ```

​      **env.d.ts**

      ```tsx
      /** eslint-disable spaced-comment */
      
      // / <reference types="vite/client" />
      
      declare module '*.vue' {
        import type { DefineComponent } from 'vue'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
        const component: DefineComponent<{}, {}, any>
        export default component
      }
      
      declare module '*.svg'
      declare module '*.png'
      declare module '*.jpg'
      declare module '*.jpeg'
      declare module '*.gif'
      declare module '*.bmp'
      declare module '*.tiff'
      declare module '*.yaml'
      declare module '*.json'
      declare module 'vue3-drag-resize'
      
      declare type ImageFit = '' | 'fill' | 'none' | 'contain' | 'cover' | 'scale-down'
      
      interface AnyObject {
        [key: string]: any
      }
      
      type Words =
        | 'a'
        | 'b'
        | 'c'
        | 'd'
        | 'e'
        | 'f'
        | 'g'
        | 'h'
        | 'i'
        | 'j'
        | 'k'
        | 'l'
        | 'm'
        | 'n'
        | 'o'
        | 'p'
        | 'q'
        | 'r'
        | 's'
        | 't'
        | 'u'
        | 'v'
        | 'w'
        | 'x'
        | 'y'
        | 'z'
      
      /** 限定首字母大写 */
      type Cap = `${Capitalize<Words>}${string}`
      
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

  ### 生命周期

  | Vue3.0生命周期  |                          说明                           |                    对应的Vue2.0生命周期                     |
  | :-------------: | :-----------------------------------------------------: | :---------------------------------------------------------: |
  |      setup      | 初始化数据阶段的生命周期，介于beforeCreate与created之间 | 相当于beforeCreate、created的合并（运行在beforeCreate之前） |
  |  onBeforeMount  |                       组件挂载前                        |                         beforeMount                         |
  |    onMounted    |                      实例挂载完毕                       |                           mounted                           |
  | onBeforeUpdate  |                    响应式数据变化前                     |                        beforeUpdate                         |
  |    onUpdated    |                   响应式数据变化完成                    |                           updated                           |
  | onBeforeUnmount |                       实例销毁前                        |                        beforeDestroy                        |
  |   onUnmounted   |                       实例已销毁                        |                          destroyed                          |
  | onErrorCaptured |                      错误数据捕捉                       |                              -                              |

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
        
          

### ref 接受一个参数值并返回一个响应式且可改变的 ref 对象。ref 对象拥有一个指向内部值的单一属性 .value。

```js
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1

// 语法糖
ref: count = 0
```
**注：**

* ref函数仅能监听基本类型的变化，不能监听复杂类型的变化（比如对象、数组）
* 在vue中使用ref的值不用通过value获取；在js中使用ref的值必须通过value获取

### reactive

监听复杂类型的变化（比如对象、数组）

### toRefs 把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref ，和响应式对象 property 一一对应。

可以用toRefs配合结构赋值使用

toRefs用于将一个reactive对象转化为属性全部为ref对象的普通对象。

```js
import { reactive, toRefs } from 'vue';

export default defineComponent({
    setup () {
        const obj = reactive({ count: 0 })
        return { ...toRefs(obj) }
    }
})
```

toRef 可以用来为一个 reactive 对象的属性创建一个 ref。这个 ref 可以被传递并且能够保持响应性。

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


### watch 与 watchEffect 的用法

watch 函数用来侦听特定的数据源，并在回调函数中执行副作用。默认情况是惰性的，也就是说仅在侦听的源数据变更时才执行回调。

```js
watch(source, callback, [options])
```

参数说明：

- source: 可以支持string,Object,Function,Array; 用于指定要侦听的响应式变量
- callback: 执行的回调函数
- options：支持deep、immediate 和 flush 选项。`{ deep: true, immediate: true }`

```vue
import { defineComponent, ref, reactive, toRefs, watch } from "vue";
export default defineComponent({
  setup() {
    // 修改age值时会触发 watch的回调
	// 监听reactive
	const state = reactive({ nickname: "xiaofan", age: 20 });

    setTimeout(() =>{
        state.age++
    },1000)

    watch(
      () => state.age,
      (curAge, preAge) => {
        console.log("新值:", curAge, "老值:", preAge);
      }
    );

	// 监听ref()
    const year = ref(0)

    setTimeout(() =>{
        year.value ++ 
    },1000)

    watch(year, (newVal, oldVal) =>{
        console.log("新值:", newVal, "老值:", oldVal);
    })

	// 监听多个值
	watch([() => state.age, year], ([curAge, preAge], [newVal, oldVal]) => {
        console.log("新值:", curAge, "老值:", preAge);
        console.log("新值:", newVal, "老值:", oldVal);
    });

    return {
		year,
        ...toRefs(state)
    }
  },
});
```

#### stop 停止监听

我们在组件中创建的`watch`监听，会在组件被销毁时自动停止。如果在组件销毁之前我们想要停止掉某个监听， 可以调用`watch()`函数的返回值，操作如下：

```js
const stopWatchRoom = watch(() => state.room, (newType, oldType) => {
    console.log("新值:", newType, "老值:", oldType);
}, {deep:true});

setTimeout(()=>{
    // 停止监听
    stopWatchRoom()
}, 3000)
```

#### watchEffect

```vue
import { defineComponent, ref, reactive, toRefs, watchEffect } from "vue";
export default defineComponent({
  setup() {
    const state = reactive({ nickname: "xiaofan", age: 20 });
    let year = ref(0)

    setInterval(() =>{
        state.age++
        year.value++
    },1000)

    watchEffect(() => {
        console.log(state);
        console.log(year);
      }
    );

    return {
        ...toRefs(state)
    }
  },
});
```

从上面的代码可以看出， 并没有像`watch`一样需要先传入依赖，`watchEffect`会自动收集依赖, 只要指定一个回调函数。在组件初始化时， 会先执行一次来收集依赖， 然后当收集到的依赖中数据发生变化时， 就会再次执行回调函数。所以总结对比如下：

1. watchEffect 不需要手动传入依赖
2. watchEffect 会先执行一次用来自动收集依赖
3. watchEffect 无法获取到变化前的值， 只能获取变化后的值

## 自定义 Hooks

我们约定这些「自定义 Hook」以 use 作为前缀，和普通的函数加以区分。

```vue
// 使用ts
import { ref, Ref, computed } from "vue";

type CountResultProps = {
    count: Ref<number>;
    multiple: Ref<number>;
    increase: (delta?: number) => void;
    decrease: (delta?: number) => void;
};

export default function useCount(initValue = 1): CountResultProps {
    const count = ref(initValue);

    const increase = (delta?: number): void => {
        if (typeof delta !== "undefined") {
            count.value += delta;
        } else {
            count.value += 1;
        }
    };
    const multiple = computed(() => count.value *2 )

    const decrease = (delta?: number): void => {
        if (typeof delta !== "undefined") {
            count.value -= delta;
        } else {
            count.value -= 1;
        }
    };

    return {
        count,
        multiple,
        increase,
        decrease,
    };
}
```

```vue
// 使用
<template>
  <p>count: {{ count }}</p>
  <p>倍数： {{ multiple }}</p>
  <div>
    <button @click="increase()">加1</button>
    <button @click="decrease()">减一</button>
  </div>
</template>

<script lang="ts">
import useCount from "../hooks/useCount";
 setup() {
    const { count, multiple, increase, decrease } = useCount(10);
        return {
            count,
            multiple,
            increase,
            decrease,
        };
    },
</script>
```

## Teleport

Teleport 就像是哆啦A梦中的「任意门」，任意门的作用就是可以将人瞬间传送到另一个地方。

在子组件`Header`中使用到`Dialog`组件，我们实际开发中经常会在类似的情形下使用到 `Dialog` ，此时`Dialog`就被渲染到一层层子组件内部，处理嵌套组件的定位、`z-index`和样式都变得困难。

`Dialog`从用户感知的层面，应该是一个独立的组件，从dom结构应该完全剥离Vue顶层组件挂载的DOM；同时还可以使用到Vue组件内的状态（`data`或者`props`）的值。简单来说就是,**即希望继续在组件内部使用`Dialog`,又希望渲染的DOM结构不嵌套在组件的DOM中**。

此时就需要Teleport上场，我们可以用`<Teleport>`包裹`Dialog`, 此时就建立了一个传送门，可以将`Dialog`渲染的内容传送到任何指定的地方。

我们希望Dialog渲染的dom和顶层组件是兄弟节点关系, 在`index.html`文件中定义一个供挂载的元素:

```
<body>
<div id="app"></div>
+ <div id="dialog"></div>
</body>
```

定义一个`Dialog`组件`Dialog.vue`, 留意 `to` 属性， 与上面的`id`选择器一致：

```
<template>
    <teleport to="#dialog">
        <div class="dialog">
            <div class="dialog_wrapper">
                <div class="dialog_header" v-if="title">
                    <slot name="header">
                        <span>{{title}}</span>
                    </slot>
                </div>
            </div>
            <div class="dialog_content">
                <slot></slot>
            </div>
            <div class="dialog_footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </teleport>
</template>
```

最后在一个子组件`Header.vue`中使用`Dialog`组件,这里主要演示 Teleport的使用，不相关的代码就省略了。`header`组件

```
<div class="header">
    ...
    <navbar />
+    <Dialog v-if="dialogVisible"></Dialog>
</div>
...
```

我们使用 `teleport` 组件，通过 `to` 属性，指定该组件渲染的位置与 `<div id="app"></div>` 同级，也就是在 `body` 下，但是 `Dialog` 的状态 `dialogVisible` 又是完全由内部 Vue 组件控制.

## Suspense

`Suspense`是Vue3.x中新增的特性, vue2.x中应该经常遇到这样的场景：

```vue
<template>
<div>
    <div v-if="!loading">
        ...
    </div>
    <div v-if="loading">
        加载中...
    </div>
</div>
</template>
```

在前后端交互获取数据时， 是一个异步过程，一般我们都会提供一个加载中的动画，当数据返回时配合`v-if`来控制数据显示。

如果你使用过`vue-async-manager`这个插件来完成上面的需求， 你对`Suspense`可能不会陌生，Vue3.x感觉就是参考了`vue-async-manager`.

Vue3.x新出的内置组件`Suspense`, 它提供两个`template` slot, 刚开始会渲染一个fallback状态下的内容， 直到到达某个条件后才会渲染default状态的正式内容， 通过使用`Suspense`组件进行展示异步渲染就更加的简单。:::warning 如果使用 `Suspense`, 要返回一个promise :::`Suspense` 组件的使用：

```html
 <Suspense>
        <template #default>
            <async-component></async-component>
        </template>
        <template #fallback>
            <div>
                Loading...
            </div>
        </template>
    </Suspense>
```

`asyncComponent.vue`:

```vue
<template>
<div>
    <h4>这个是一个异步加载数据</h4>
    <p>用户名：{{user.nickname}}</p>
    <p>年龄：{{user.age}}</p>
</div>
</template>

<script>
import { defineComponent } from "vue"
import axios from "axios"
export default defineComponent({
    setup(){
        const rawData = await axios.get("http://xxx.xinp.cn/user")
        return {
            user: rawData.data
        }
    }
})
</script>
```

### 在 Vue2.x 中， `template`中只允许有一个根节点,但是在 Vue3.x 中，你可以直接写多个根节点

### 示例

  ```js
  import { computed, onMounted, ref, watch } from 'vue';
  import { useStore, mapState } from 'vuex'
  export default {
      name: 'Home',
      setup(props, ctx) { 
          /* 
           * 不可以使用ES6解构，解构会消除它的响应式。
           * props 父组件传值
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

## vite插件

### vite-plugin-imagemin图片压缩插件

**配置说明**

|   参数   | 类型                                  | 默认值  | 说明                                                        |
| :------: | ------------------------------------- | ------- | ----------------------------------------------------------- |
| verbose  | `boolean`                             | `true`  | 是否在控制台输出压缩结果                                    |
|  filter  | `RegExp or (file: string) => boolean` | -       | 指定哪些资源不压缩                                          |
| disable  | `boolean`                             | `false` | 是否禁用                                                    |
|   svgo   | `object` or `false`                   | -       | 见 [Options](https://github.com/svg/svgo/#what-it-can-do)   |
| gifsicle | `object` or `false`                   | -       | 见 [Options](https://github.com/imagemin/imagemin-gifsicle) |
| mozjpeg  | `object` or `false`                   | -       | 见 [Options](https://github.com/imagemin/imagemin-mozjpeg)  |
| optipng  | `object` or `false`                   | -       | 见 [Options](https://github.com/imagemin/imagemin-optipng)  |
| pngquant | `object` or `false`                   | -       | 见 [Options](https://github.com/imagemin/imagemin-pngquant) |
|   webp   | `object` or `false`                   | -       | 见 [Options](https://github.com/imagemin/imagemin-webp)     |

**默认配置**

```ts
import viteImagemin from 'vite-plugin-imagemin'

export default () => {
  return {
    plugins: [
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 20,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
    ],
  }
}
```

### vite-plugin-svg-icons用于生成 svg 雪碧图.

**配置说明**

| 参数        | 类型                   | 默认值                | 说明                                                         |
| ----------- | ---------------------- | --------------------- | ------------------------------------------------------------ |
| iconDirs    | `string[]`             | -                     | 需要生成雪碧图的图标文件夹                                   |
| symbolId    | `string`               | `icon-[dir]-[name]`   | svg 的 symbolId 格式，见下方说明                             |
| svgoOptions | `boolean｜SvgoOptions` | `true`                | svg 压缩配置，可以是对象[Options](https://github.com/svg/svgo) |
| inject      | `string`               | `body-last`           | svgDom 默认插入的位置，可选`body-first`                      |
| customDomId | `string`               | `__svg__icons__dom__` | svgDom 插入节点的 ID                                         |

**symbolId**

```
icon-[dir]-[name]
```

**[name]:**

svg 文件名

**[dir]**

该插件的 svg 不会生成 hash 来区分，而是通过文件夹来区分.

如果`iconDirs`对应的文件夹下面包含这其他文件夹

例：

则生成的 SymbolId 为注释所写

```
# src/icons
- icon1.svg # icon-icon1
- icon2.svg # icon-icon2
- icon3.svg # icon-icon3
- dir/icon1.svg # icon-dir-icon1
- dir/dir2/icon1.svg # icon-dir-dir2-icon1
```

### 自动导入'unplugin-auto-import’

见《个人使用创建新项目准备》