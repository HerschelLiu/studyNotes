## 各框架如何使用unocss-preset-weapp

分享自uniapp, taro 如何使用 UnoCSS 原子化css - Mellow的文章 - 知乎 https://zhuanlan.zhihu.com/p/569976147

###[微信小程序原生](https://github.com/MellowCo/unocss-wechat)

两种预设任选一种

#### 预设一

> 此方法使用 `unocss` 内置预设，通过以下配置解决
>
> 1. 解决小程序不支持 * 选择器
> 2. rem单位 转 rpx

```bash
npm -D unocss
```

```js
// unocss.config
import { defineConfig, presetUno } from "unocss";

const remRE = /^-?[\.\d]+rem$/

export default defineConfig({
    presets: [
      presetUno(),
    ],
    theme:{
      // 解决小程序不支持 * 选择器
      preflightRoot: ["page,::before,::after"]
    },
    postprocess(util) {
      // 自定义rem 转 rpx
      util.entries.forEach((i) => {
        const value = i[1]
        if (value && typeof value === 'string' && remRE.test(value))
          i[1] = `${value.slice(0, -3) * 16 * 2}rpx`
      })
    },
  })
```

#### 预设二

> `unocss-preset-weapp` 内部已经解决小程序不兼容的相关问题
>
> 由于小程序不支持 \ \: \[ \$ \. 等转义类名,
>
> * 使用 `hex` 代替 `#` , `_` 代替 `:` `/`,例如 `bg-#81ecec/50` 可以使用 `bg-hex-81ecec_50` 表示
> * 针对 `hover:` 和 `avtive:`, 可以设置 `separators` 指定分隔符,例如设置 `separators` 为 `__`，`hover:bg-red-500` 可以使用 `hover__bg-red-500` 表示

```bash
npm -D unocss unocss-preset-weapp
```

```js
// unocss.config
import { defineConfig } from "unocss";
import presetWeapp from 'unocss-preset-weapp'

const include = [/\.wxml$/]

export default defineConfig({
  content:{
    pipeline:{
      include
    }
  },
  presets: [
    presetWeapp(),
  ],
  separators:'__'
})
```

#### 生成wxss

在`package.json`，设置 `script`.使用 `@unocss/cli` 监听文件内容，[参考文档](https://github.com/unocss/unocss/tree/main/packages/cli)

```json
{
  "scripts": {
     "unocss": "unocss pages/**/*.wxml -c unocss.config.js --watch -o unocss.wxss",
     "unocss:build": "unocss pages/**/*.wxml -c unocss.config.js -o  unocss.wxss"
  }
}
```

运行`npm run unocss，wxml` 内容变化，触发生成新的 `unocss.wxss

```css
/**app.wxss**/
@import "./unocss.wxss";

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 200rpx 0;
  height: 100%;
}
```

> vscode设置支持*.wxml

```json
  // settings.json
"files.associations": {
  "*.wxml": "html",
},
```





### [uniapp-vue2]([unocss-preset-weapp/examples/uniapp_vue2 at main · MellowCo/unocss-preset-weapp · GitHub](https://github.com/MellowCo/unocss-preset-weapp/tree/main/examples/uniapp_vue2))

1. App平台 v3 模式暂不支持在 js 文件中引用"uno.css" 请改在 style 内引用

> 解决方法：使用 [unocss-webpack-uniapp2](https://github.com/MellowCo/unocss-webpack-uniapp2#unocss-webpack-uniapp2) 替换 @unocss/webpack，unocss-webpack-uniapp2 同样支持 小程序 和 h5 平台

```bash
# unocss-webpack-uniapp2 兼容 vue2 app
# 解决 App平台 v3 模式暂不支持在 js 文件中引用"uno.css" 请改在 style 内引用
yarn add -D unocss unocss-webpack-uniapp2 unocss-preset-weapp
```

```js
// vue.config
// 兼容 app
// 解决 App平台 v3 模式暂不支持在 js 文件中引用"uno.css" 请改在 style 内引用
const UnoCSS = require('unocss-webpack-uniapp2').default

module.exports = {
  configureWebpack: {
    plugins: [
      // https://github.com/unocss/unocss
      UnoCSS(),
    ],
  },
}
```

```js
// unocss.config
// 添加unocss.config.js文件，搭配 unocss vscode 插件，智能提示
import presetWeapp from 'unocss-preset-weapp'
import { defineConfig } from 'unocss'
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'

const { transformerAttributify, presetWeappAttributify } = extractorAttributify()

export default defineConfig({
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp({
      // h5兼容
      // 只开发小程序可删除
      platform: 'uniapp',
      isH5: process.env.UNI_PLATFORM === 'h5',
    }),

    // attributify autocomplete
    presetWeappAttributify(),
  ],
  shortcuts: [
    {
      'border-base': 'border border-gray-500_10',
      'center': 'flex justify-center items-center',
    },
  ],

  transformers: [
    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify(),

    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass(),
  ],
})
```

```vue
<!-- App.vue -->
<!-- 将注释占位符改为css选择器占位符,使用uno-start和uno-end,作为占位符，内容随意 -->
<script>
export default {
  onLaunch() {
    console.log('App Launch')
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  },
}
</script>

<style>
.uno-start {
  --un: 0;
}
/* unocss 代码生成在这 */
.uno-end {
  --un: 0;
}
</style>
```



### [uniapp-vue3](https://github.com/MellowCo/unocss-preset-weapp/tree/main/examples/uniapp_vue3)

```bash
# 安装unocss
pnpm add -D unocss unocss-preset-weapp
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    // https://github.com/antfu/unocss
    Unocss(),
  ],
})
```

```ts
// unocss.config.ts
// 添加unocss.config.js文件，搭配 unocss vscode 插件，智能提示

import presetWeapp from 'unocss-preset-weapp'
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'

const { presetWeappAttributify, transformerAttributify } = extractorAttributify()

export default {
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp(),
    // attributify autocomplete
    presetWeappAttributify(),
  ],
  shortcuts: [
    {
      'border-base': 'border border-gray-500_10',
      'center': 'flex justify-center items-center',
    },
  ],

  transformers: [
    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify(),

    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass(),
  ]
}
```

```ts
// main.ts
import 'uno.css'
```

### [taro (webpack4)for react vue2 vue3](https://github.com/MellowCo/unocss-preset-weapp/tree/main/examples/taro_webpack4_vue3)

**说明**

* 默认生成 css 单位为 `rpx` ，`rpx` 在h5平台中，会自动转为 `rem`
* 由于 taro 建议使用 px，针对 `taro` 加入小程序 `px` 转 `rpx`，h5 `px` 转 `rem` , 设置 `designWidth` ,`deviceRatio` [转换说明](https://github.com/MellowCo/unocss-preset-weapp/tree/main/examples/taro_webpack4_vue3#taro-px-to-rpx-rem)
* taro `webpack4` 和 `webpack5` [h5根字体(rem)](https://github.com/MellowCo/unocss-preset-weapp/tree/main/examples/taro_webpack4_vue3#taro-h5兼容)大小不同，导致不同版本字体大小不同 [taro issues](https://github.com/NervJS/taro/issues/12361)

```bash
# 安装unocss
yarn add -D unocss @unocss/webpack unocss-preset-weapp
```

```js
// config/index.js
import UnoCSS from 'unocss/webpack'

const config = {
  mini: {
    // 合并webpack配置
    webpackChain(chain) {
      // https://github.com/unocss/unocss
      chain.plugin('unocss').use(UnoCSS())
    },
  },
  h5: {
    // 合并webpack配置
    webpackChain(chain) {
      // https://github.com/unocss/unocss
      chain.plugin('unocss').use(UnoCSS())
    },
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development')
    return merge({}, config, require('./dev'))

  return merge({}, config, require('./prod'))
}
```

```ts
// unocss.config.ts
import presetWeapp from 'unocss-preset-weapp'
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'

const { presetWeappAttributify, transformerAttributify } = extractorAttributify()

export default {
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp(
      // 以下配置为 webpack4 平台
      // h5兼容设置，默认为 750 标准（designWidth: 750），webpack4 平台(taroWebpack: webpack4)
      // 只开发小程序可删除
      {
        isH5: process.env.TARO_ENV === 'h5',
        platform: 'taro',
      }),
    // attributify autocomplete
    presetWeappAttributify(),
  ],
  shortcuts: [
    {
      'border-base': 'border border-gray-500/10',
      'center': 'flex justify-center items-center',
    },
  ],

  transformers: [
    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    // taro-react 不支持 Attributify Mode ，react不支持，react不支持，react不支持
    transformerAttributify(),

    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass(),
  ],
}
```

```ts
// app.ts
import 'uno.css'
```

```html
<!-- index.html -->
<!-- taro h5 的基准文字不是 16px ，默认字体较大.如需更改，可在index.html 中设置 bodyde class为 text-base -->
```

## 问题

### 原子化冲突

例如 tmui，自身有一套原子化 css，导致与 unocss 冲突

```ts
// unocss.config.ts
// presetWeapp 配置 prefix, transformerAttributify 配置 classPrefix
import presetWeapp from 'unocss-preset-weapp'
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'
import { defineConfig } from 'unocss'

const prefix = 'li-'

const { presetWeappAttributify, transformerAttributify } = extractorAttributify({
  classPrefix: prefix
})

export default defineConfig({
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp({
      prefix
    }),
    // attributify autocomplet
    presetWeappAttributify()
  ],
  transformers: [
    // options 见https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify(),

    // options 见https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass(),
  ],
})
```

