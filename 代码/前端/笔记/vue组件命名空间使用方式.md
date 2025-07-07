使vue组件支持像React组件`<Form.Item />`一样的用法

```ts
import type Hello from "./hello";
import type HelloWorld from "./hello-world.vue";

type El = {
  Hello: typeof Hello;
  HelloWorld: typeof HelloWorld;
}

export default new Proxy<El>({} as El, {
  get(_, prop: string) {
    if (prop === "Hello") {
      return defineAsyncComponent(() => import("./hello"));
    }
    if (prop === "HelloWorld") {
      return defineAsyncComponent(() => import("./hello-world.vue"));
    }
  }
});

作者：阿骨哈哈
链接：https://zhuanlan.zhihu.com/p/1924518121508701198
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

使用

```
<script setup lang="ts">
import El from './el';
</script>

<template>
  <El.Hello name="52css" />
  <El.HelloWorld name="52css" />
</template>

作者：阿骨哈哈
链接：https://zhuanlan.zhihu.com/p/1924518121508701198
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

## 其他

### 封装 Element Plus 命名空间组件

```bash
pnpm install @52css/el
```

