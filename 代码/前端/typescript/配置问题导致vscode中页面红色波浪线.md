## 每个文件首行红波浪（Parsing error: Cannot read file ‘**\tsconfig.json‘）

`.eslintrc.js` 文件下新增

```js
parserOptions: {
	tsconfigRootDir: __dirname,
}
```

## .eslintrc.js首行报错

```
Parsing error: "parserOptions.project" has been set for @typescript-eslint/parser
The file does not match your project config: .eslintrc.js.
The file must be included in at least one of the projects provided
```

在`tsconfig.json`中include添加`".eslintrc.js"`