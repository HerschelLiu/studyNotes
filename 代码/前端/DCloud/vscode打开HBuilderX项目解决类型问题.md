```bash
npm i -D @dcloudio/types @types/node vue-tsc
npm i pinia
```



**vite.config**

```ts
import { resolve } from 'path'

{
  resolve: {
    alias: {
      '@': resolve(__dirname, '.')
    }
  }
}
```



**tsconfig**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
     "paths": {
      	"@/*": ["./*"]
     },
    "types": ["@dcloudio/types", "@types/node"]
  },
  "include": ["./**/*.ts", "./**/*.d.ts", "./**/*.tsx", "./**/*.vue", "./types", "*.d.ts", "**/*.ts"],
}
```



**shims-vue.d.ts**

```ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

```

