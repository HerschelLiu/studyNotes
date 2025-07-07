## Vue3(uniapp)+tsx（玩玩得了）

[vue Macros示例](https://vue-macros.dev/zh-CN/interactive/)

[jsx](https://cn.vuejs.org/guide/extras/render-function)

主要使用[vue-simple-props](https://github.com/sxzz/vue-simple-props)+@vitejs/plugin-vue-jsx



## vue-simple-props

```bash
pnpm add @vitejs/plugin-vue-jsx -D
pnpm add vue-simple-props
```

单独使用它就可以



### **项目配置与基础集成**



### 启用tsx支持

**tsconfig.json**

```json
{
 "compilerOptions": {
   "jsx": "preserve",       // 保留 JSX 结构
   "jsxImportSource": "vue", // 让TSX使用Vue的JSX类型
   // 开启上边的两个就可以了，跟下边两个开启貌似没什么区别
   // "jsxFactory": "h",       // 使用 Vue 的 h 函数
   // "jsxFragmentFactory": "Fragment" // 支持 Fragment
   // "types": ["vue-macros/macros-global" /* ... */]
 },
 "vueCompilerOptions": {
  "plugins": ["vue-macros/volar"],
},
}
```



### vite.config

```ts
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default async ({ mode }) => {
  const VueJsx = await import('@vitejs/plugin-vue-jsx').then(m => m.default)

  return defineConfig({
    plugins: [
      VueJsx({
        defineComponentName: ['defineComponent', 'defineFunctionalComponent', 'defineSimpleComponent']
      })
    ],
  })
}

```



### 注意

**页面必须使用`.vue`**

组件`.tsx`中不能直接导出`export default defineFunctionalComponent(() => {})`,必须 导出`const `

```tsx
import { defineFunctionalComponent } from 'vue-simple-props'

interface Props {
  msg: string
}

const Test = defineFunctionalComponent((props: Props) => {
  return () => (
    <>
      <div>
        <span>Hello World</span>
        <div>from: {props.msg}</div>
      </div>
    </>
  )
})

export default Test

```

**tsx不能在小程序中使用**

**tsx中只能使用HTML标签，使用uniapp的小程序标签类型会报错，还不知道如何解决**

**只能return 一个函数返回tsx，不能直接return tsx，会报错**



## [Vue Macros](https://vue-macros.dev/macros/setup-sfc.html)

```bash
npm i -D vue-macros
```



#### vite插件配置

**vite.config.ts**

```ts
import Vue from '@vitejs/plugin-vue'
import VueMacros from 'vue-macros/vite'
// import VueJsx from '@vitejs/plugin-vue-jsx'
// import VueRouter from 'unplugin-vue-router/vite'

export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue({
          include: [/\.vue$/, /\.setup\.[cm]?[jt]sx?$/],
          //                   ⬆️ 需要添加 setup 模式
        }),
        // vueJsx: VueJsx(), // 如有需要
        // vueRouter: VueRouter({ // 如有需要
        //   extensions: ['.vue', '.setup.tsx']
        // })
      },
      // 覆盖插件选项
    }),
  ],
})
```

```tsx
// 基本用法
// Foo.setup.tsx
defineProps<{
  foo: string
}>()

defineEmits<{
  (evt: 'change'): void
}>()

export default () => (
  <div>
    <h1>Hello World</h1>
  </div>
)
```



#### [Eslint+Vue Macros](https://vue-macros.dev/zh-CN/guide/eslint-integration.html)

```bash
pnpm add -D @vue-macros/eslint-config
```

**Flat风格**

```js
import vueMacros from '@vue-macros/eslint-config/flat'
export default [
  vueMacros,
  // ...其他配置
]
```

**传统风格**

```json
{
  "extends": [
    "@vue-macros/eslint-config",
    // ...其他配置
  ],
}
```



## 其他

### 虚拟滚动长列表

```ts
 import { useVirtualList } from '@vueuse/core';

 const { list, containerProps } = useVirtualList(longArray, { itemHeight: 50 });

 return () => (
   <div {...containerProps} style={{ height: '300px', overflowY: 'auto' }}>
     {list.value.map(item => <div key={item.index}>{item.data}</div>)}
   </div>
 );
```

### [vue模板和tsx混合开发](https://juejin.cn/post/7282692088016437307)