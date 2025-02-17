## 基础

### 基础配置

#### 全局变量`runtimeConfig`

运行时的全局变量

```ts
// `nuxt.config`
runtimeConfig: {
  public: { // 既能在客户端，也能在服务端期间获取到
    baseUrl: 'localhost:3000'
  },
  private: {}, // 只能在服务端期间获取到
  // 以下只能在服务端期间获取到
  count: 1
}
```

```vue
<script setup>
cosnt config = useRuntimeConfig()
  console.log(config.count); // 只能在服务端期间获取到
console.log(config.public.baseUrl);
</script>
```

#### 引入全局样式

资源放在根目录的`assets`中

```ts
// nuxt.config
// ...
css: ['~/assets/css/base.scss'] // 在 nuxt 中根目录用的是‘~’，而不是‘@’。（但是有弹幕说都可以）
```

**注意：**这种方式仅仅是为了引入样式，爻使用全局样式中预处理 css 的变量，不能在页面中使用，必须在`nuxt.config`中的 vite 配置

```ts
// nuxt.config
// ...
// css: ['~/assets/css/base.scss'], // 用vite配置就行，这个就可以删掉，不然报错重复引入
vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/css/base.scss";' // @use是 sass 的导入命令，与 vite无关
        }
      }
    }
  }
```

