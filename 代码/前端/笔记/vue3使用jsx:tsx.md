通常使用官方脚手架 create-vue 初始化，它会帮你配好所有东西。

```bash
npm install @vitejs/plugin-vue-jsx -D
```



**`vite.config.ts` 中注册插件**

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx' // 引入插件

export default defineConfig({
  plugins: [
    vue(),
    vueJsx() // 启用 JSX/TSX 支持
  ]
})
```



**在 `tsconfig.json` 中开启 TSX 类型推断**

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue" // Vue 3.3+ 必须设置，才能正确推断 props 等类型
  }
}
```

