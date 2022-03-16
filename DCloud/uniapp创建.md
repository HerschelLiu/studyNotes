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

## 设置路径别名

```js
// vite.config.ts
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@/': resolve(__dirname, 'src')
    }
  }
});

// 同时tsconfig.json
{
  "compilerOptions": {
    ...
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    ...
}

```

## [使用uni-ui](https://uniapp.dcloud.io/component/uniui/quickstart)

在 `vue-cli` 项目中可以使用 `npm` 安装 `uni-ui` 库 ，或者直接在 `HBuilderX` 项目中使用 `npm` 。（不推荐后一种方式）

> **注意** cli 项目默认是不编译 `node_modules` 下的组件的，导致条件编译等功能失效 ，导致组件异常 需要在根目录创建 `vue.config.js` 文件 ，增加 `@dcloudio/uni-ui` 包的编译即可正常
>
> ```
> // vue.config.js
> module.exports = {
> 		transpileDependencies:['@dcloudio/uni-ui']
> }
> ```

**准备 sass**

`vue-cli` 项目请先安装 sass 及 sass-loader，如在 HBuliderX 中使用，可跳过此步。

- 安装 sass

  ```
  npm i sass -D   或   yarn add sass -D
  ```

- 安装 sass-loader

  ```
  npm i sass-loader@10.1.1 -D   或   yarn add sass-loader@10.1.1 -D
  ```

> 如果 `node` 版本小于 16 ，sass-loader 请使用低于 @11.0.0 的版本，[sass-loader@11.0.0 不支持 vue@2.6.12 ](https://stackoverflow.com/questions/66082397/typeerror-this-getoptions-is-not-a-function)如果 `node` 版本大于 16 ， `sass-loader` 建议使用 `v8.x` 版本

**安装 uni-ui**

```
npm i @dcloudio/uni-ui   或   yarn add @dcloudio/uni-ui
```

**配置easycom**

使用 `npm` 安装好 `uni-ui` 之后，需要配置 `easycom` 规则，让 `npm` 安装的组件支持 `easycom`

打开项目根目录下的 `pages.json` 并添加 `easycom` 节点：

```javascript
// pages.json
{
    "easycom": {
        "autoscan": true,
        "custom": {
            // uni-ui 规则如下配置
            "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
        }
    },

    // 其他内容
    pages:[
        // ...
    ]
}
```

## vscode编写uniapp

#### npm插件

* 安装组件语法提示`npm i @dcloudio/uni-helper-json`

#### vscode插件

* uni-helper
* create-uniapp-view：快速创建uniapp视图与组件!

#### 导入 HBuilderX 自带的代码块

从 github 下载 [uni-app 代码块](https://github.com/zhetengbiji/uniapp-snippets-vscode)（.code-snippets文件），放到项目目录下的 .vscode 目录即可拥有和 HBuilderX 一样的代码块。

>  HBuilderX 创建的工程默认不带 types 语法提示，在 vscode 中编辑的时候，可以自行安装uni-app 语法提示`npm i @types/uni-app @types/html5plus -D`
