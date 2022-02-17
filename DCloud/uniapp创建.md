## [创建uni-app](https://uniapp.dcloud.net.cn/quickstart-cli?id=创建uni-app)

使用Vue3/Vite版`npx degit dcloudio/uni-preset-vue#vite-ts my-vue3-project`

> 如果不能运行，是因为m1的问题，node@15一下会有问题，切换到最新node，如果还是不好使，出了最新node外，再使用yarn安装node插件

## [eslint+prettier安装、配置]([HBuilderX 使用eslint实时校验、自动修复代码错误（适用于HBuilderX 2.6.8+） - DCloud问答](https://ask.dcloud.net.cn/article/37070))

`yarn add --save eslint eslint-plugin-vue eslint-plugin-html eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard eslint-config-standard-with-typescript prettier`

> 安装报错`vue-eslint-parser@8.2.0: The engine "node" is incompatible with this module. Expected version "^12.22.0 || ^14.17.0 || >=16.0.0". Got "14.16.1"`的错误是兼容性问题，使用此命令`yarn config set ignore-engines true`

```js
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['plugin:vue/vue3-essential', 'standard', 'eslint-config-standard-with-typescript', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
    extraFileExtensions: ['.vue']
  },
  globals: {
    uni: true,
    UniApp: true,
    plus: true
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-new': 'off',
    'no-unused-vars': 'off',
    'no-useless-catch': 'off',
    'no-unsafe-finally': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    'vue/no-v-model-argument': 'off',
    '@typescript-eslint/return-await': 'off'
  }
}

// .eslintignore
unpackage/*
uni_modules/*
js_sdk/**/*.js
utils/*
```

```js
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 120
}
```

