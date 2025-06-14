### unocss

```bash
pnpm add -D unocss@0.58.9 unocss-preset-weapp@0.58.8 @unocss/transformer-attributify 
pnpm install @unocss/preset-icons
```

[unocss-preset-weapp](https://github.com/MellowCo/unocss-preset-weapp/tree/main/examples/taro4_vite_vue3)

**config/index.ts**

```ts
import Unocss from 'unocss/vite'

compiler: {
  type: 'vite',
  vitePlugins: [
    Unocss()
  ]
},
```



**uno.config**

```ts
import { defineConfig } from 'unocss'
import presetWeapp from 'unocss-preset-weapp'
import { transformerClass } from 'unocss-preset-weapp/transformer'

export default defineConfig({
  presets: [
    presetWeapp({  // 小程序专属预设
      whRpx: true, // 使用 rpx 单位（默认 true）
      platform: 'taro', // 指定平台
      designWidth: 750, // 与taro配置一致
      deviceRatio: { // 与taro配置一致
        640: 2.34 / 2,
        750: 1,
        375: 2,
        828: 1.81 / 2,
      },
    }),
  ],
  transformers: [
    transformerClass(), // 转换特殊字符类名（如 : / [ 等）
  ]
})
```

**app.ts**

```ts
import 'uno.css'
```

