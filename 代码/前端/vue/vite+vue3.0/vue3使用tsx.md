# vue3使用tsx

`create-vue` 和 Vue CLI 都有预置的 JSX 语法支持。如果你想手动配置 JSX，请参阅 [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next) 文档获取更多细节。

Vue 的类型定义也提供了 TSX 语法的类型推导支持。当使用 TSX 语法时，确保在 `tsconfig.json` 中配置了 `"jsx": "preserve"`，这样的 TypeScript 就能保证 Vue JSX 语法转换过程中的完整性。

## JSX 类型推断[](https://cn.vuejs.org/guide/extras/render-function.html#jsx-type-inference)

与转换类似，Vue 的 JSX 也需要不同的类型定义。

从 Vue 3.4 开始，Vue 不再隐式注册全局 `JSX` 命名空间。要指示 TypeScript 使用 Vue 的 JSX 类型定义，请确保在你的 `tsconfig.json` 中包含以下内容：

json

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
    // ...
  }
}
```
