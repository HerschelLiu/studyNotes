## 安装

### 创建项目

```bash
# npm
npx nuxi init 项目名

# pnpm
pnpm dlx nuxi init 项目名
```

### 安装依赖

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Modules

在[Modules · Nuxt](https://nuxt.com/modules)中的可以直接在`nuxt.config.ts`中配置引用，其他的需要在`plugins/`目录下新建配置文件[插件 plugins | Nuxt 3 - 中文文档 (nuxtjs.org.cn)](https://www.nuxtjs.org.cn/directory-structure/plugins.html#插件目录)



### [Pinia](https://pinia.vuejs.org/)安装配置

[Pinia Module · Nuxt](https://nuxt.com/modules/pinia)

[Pinia引入](https://pinia.vuejs.org/zh/ssr/nuxt.html#using-the-store-outside-of-setup)

```bash
# npm
npm i @pinia/nuxt

#yarn
yarn add @pinia/nuxt

# pnpm
pnpm add @pinia/nuxt
```

```js
// nuxt.config.ts
export default defineNuxtConfig({
  // ...other
  modules: ['@pinia/nuxt']
})
```

### 出现的问题及解决办法

#### Cannot start nuxt:  Cannot find module 'pinia/dist/pinia.mjs’

```bash
npm install --save pinia @pinia/nuxt pinia-plugin-persist --legacy-peer-deps
```

#### missing peer vue@"^2.6.14 || ^3.2.0”

是因为 配置文件中没有 vue3 的依赖 需要安装vue3 在 package.json

```bash
pnpm add vue
```





### Element-plus安装配置

因为 `element-plus` 属于第三方插件，需要在 `plugins` 目录配置

```bash
npm install element-plus
npm install @element-plus/icons-vue
```

```ts
// plugins/element-plus.client.ts
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus, {
    locale: zhCn
  })
})

```

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  // ...other
  css: ['element-plus/dist/index.css'],
  vite: {
    plugins: [
      Components({
        resolvers: [ElementPlusResolver()],
      })
    ]
  }
})
```

> 服务端id `import { ID_INJECTION_KEY } from 'element-plus';`
>
> **nuxt3目前不支持自动按需引入，需要在页面中import，不然报错**。[Element Plus按需导入](https://element-plus.gitee.io/zh-CN/guide/quickstart.html#按需导入)，其中不需要AutoImport



### prettier

```bash
npm i -D prettier
```



```js
// .prettierrc
{
  "singleQuote": true,
  "semi": false,
  "bracketSpacing": true,
  "trailingComma": "none",
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "auto",
  "printWidth": 150,
  "htmlWhitespaceSensitivity": "ignore",
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "html"
      }
    },
    {
      "files": "*.vue",
      "options": {
        "parser": "vue"
      }
    }
  ]
}

```

#### 与`eslint`联动

```bash
npm i -D eslint eslint-plugin-prettier eslint-config-prettier
```

> 其中 `eslint-config-prettier` 是用来避免和原先的`eslint`规则起冲突的。
>
> `eslint-plugin-prettier` 才是把 `prettier format rules` 变成 `eslint rules` 的工具。

```js
// .eslintrc
// 以下另需安装 eslint-plugin-eslint-plugin、eslint-plugin-import、eslint-plugin-node、eslint-plugin-self、eslint-plugin-simple-import-sort、eslint-plugin-vue
```



### SASS

```bash
npm i -D sass
```

创建文件`assets/styles/default.scss`

```ts
// 全局引入
export default defineNuxtConfig({
    // ...other
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/assets/styles/default.scss" as *;'	
                }
            }
        }
    }
})
```



