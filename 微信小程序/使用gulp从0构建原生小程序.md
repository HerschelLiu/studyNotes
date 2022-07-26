[toc]

## 准备

### 使用小程序开发工具创建代码

* 选择默认模板，进行ts改造

### typescript

`npm i -D typescript @vue/eslint-config-typescript ts-node`

* **@vue/eslint-config-typescript**: 内部预置了ts-loader的配置，无需单独配置
* **ts-node**: ts的node环境，可直接运行ts文件

#### 修改tsconfig.json文件和package.json

```diff
{
  "compilerOptions": {
-   "strictNullChecks": true, // 在严格的 null检查模式下， null和 undefined值不包含在任何类型里，只允许用它们自己和 																	 any来赋值（有个例外， undefined可以赋值到 void）。启用strict：true相当于启用此选项
-   "noImplicitAny": true, // 在表达式和声明上有隐含的 any类型时报错。启用strict：true相当于启用此选项
-   "module": "CommonJS",
+   "module": "esnext", // 指定生成哪个模块系统代码： "None"， "CommonJS"， "AMD"， "System"， "UMD"， "ES6"或       													"ES2015"。
-   "target": "ES2020",
+   "target": "esnext", // 指定ECMAScript目标版本 "ES3"（默认）， "ES5"， "ES6"/ "ES2015"， "ES2016"， "ES2017"或 														"ESNext"。ESNext 是一个动态的 ECMAScript 版本，指当前最新发布的版本没有包含，但已经定案（确														 定明年发布），包含新特性的 ECMAScript 版本。
-   "allowJs": true, 
+  	"allowJs": false, // 允许编译javascript文件
-   "allowSyntheticDefaultImports": true, // 允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检																						 查。
-   "esModuleInterop": true, // 支持在 CommonJS/AMD/UMD 模块其中的一种模块下使用 import d from 'cjs'
    "experimentalDecorators": true, // 启用实验性的ES装饰器。
-   "noImplicitThis": true, // 当 this表达式的值为 any类型的时候，生成一个错误。启用strict：true相当于启用此选项
    "noImplicitReturns": true, // 不是函数的所有返回路径都有返回值时报错。
-   "alwaysStrict": true, // 以严格模式解析并为每个源文件生成 "use strict"语句。启用strict：true相当于启用此选项
    "noFallthroughCasesInSwitch": true, // 报告switch语句的fallthrough错误。（即，如果没有break语句后面不会执行）
    "noUnusedLocals": true, // 若有未使用的局部变量则抛错。
    "noUnusedParameters": true, // 若有未使用的参数则抛错。
    "strict": true, // 启用所有严格类型检查选项。
                       启用 strict相当于启用 noImplicitAny, noImplicitThis, alwaysStrict， strictNullChecks和              											 strictFunctionTypes和strictPropertyInitialization。
-   "strictPropertyInitialization": true, // 确保类的非undefined属性已经在构造函数里初始化。若要令此选项生效，需要同时																						 启用strictNullChecks。启用strict：true相当于启用此选项
-   "lib": ["ES2020"], // 编译过程中需要引入的库文件的列表。注意：如果--lib没有指定默认注入的库的列表。默认注入的库为：► 针													对于--target ES5：DOM，ES5，ScriptHost► 针对于--target ES6：DOM，ES6，DOM.Iterable，														ScriptHost
-   "typeRoots": [ // 要包含的类型声明文件路径列表。
-     "./typings"
-   ],
	  "outDir": "./dist", // 输出目录
	  "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
	  "removeComments": true, // 删除所有注释，除了以 /!*开头的版权信息。
	  "pretty": true, // 给错误和消息设置样式，使用颜色和上下文
	  "types": [ 
      "node" // 需要安装@types/node
    ]
  },
  "include": [
    "./**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}

// wxml
{
	...
	"include": [
    "./miniprogram/**/*.ts",
    "./plugin/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "miniprogram_dist",
    "**/*.spec.ts",
    "typings",
    "miniprogram/package**/**/*.d.ts",
    "miniprogram_npm/**/*.d.ts"
  ]
}

// vue
{
	"include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "node_modules/element-plus/global.d.ts",
    "node_modules/vite/types"
  ],
  "references": [{ "path": "./tsconfig.node.json" }]
}
// tsconfig.node.json
{
  "compilerOptions": {
    "composite": true,
    "module": "esnext",
    "moduleResolution": "node"
  },
  "include": ["vite.config.ts"]
}
```

```json
{
  ...
  "engines": { // 设置了此软件包/应用程序在哪个版本的 Node.js 上运行
    "node": "^14.17.0"
  },
  "devDependencies": {
    "@types/node": "^18.0.3",
    "mddir": "^1.1.1", // 生成文件目录
-   "miniprogram-api-typings": "^2.8.3-1",
    "gulp": "^4.0.2",
    "gulp-clean": "^0.4.0", // 清除文件及文件夹
    "gulp-htmlmin": "^5.0.1", // 压缩html，可以压缩页面javascript、css，去除页面空格、注释，删除多余属性等操作。
    "gulp-uglify": "^3.0.2", // 使用UglifyJS缩小js文件
    "concurrently": "^7.2.2",
  },
  "dependencies": {
    
  }
  ...
}
```

> 注意：1.如果使用微信开发工具中的ts默认模板创建则将typing文件夹移入miniprogram文件夹中并更新
>
> 2。如果不是则在此地址下载到项目中，名称为wx微信声明文件地址[wechat-miniprogram/api-typings: Type definitions for APIs of Wechat Mini Program in TypeScript (github.com)](https://github.com/wechat-miniprogram/api-typings)

控制台会有报错，好的解决办法没找到，只能先删除，所以微信的声明文件最好放在项目中。删除typings/wx/index.d.ts中以下代码

```
/** 引入模块。返回模块通过 `module.exports` 或 `exports` 暴露的接口。 */
declare function require(
    /** 需要引入模块文件相对于当前文件的相对路径，或 npm 模块名，或 npm 模块路径。不支持绝对路径 */
    module: string
): any
```

```
/** 当前模块对象 */
declare let module: {
    /** 模块向外暴露的对象，使用 `require` 引用该模块时可以获取 */
    exports: any
}
/** `module.exports` 的引用 */
declare let exports: any
```



### npm相关配置文件

设置npm为国内源

```
// .npmrc
registry=http://registry.npmmirror.com
```



### 修改typings结构

```diff
|-- typings
    |-- index.d.ts
    |-- types
        |-- index.d.ts
        |-- wx
            |-- index.d.ts
            |-- lib.wx.api.d.ts
            |-- lib.wx.app.d.ts
            |-- lib.wx.behavior.d.ts
            |-- lib.wx.cloud.d.ts
            |-- lib.wx.component.d.ts
            |-- lib.wx.event.d.ts
            |-- lib.wx.page.d.ts
```

将types下文件移动到typings下，删除types/index.d.ts

### gulp

安装

```bash
npm i -D gulp gulp-htmlmin gulp-uglify gulp-clean
```



```js
// gulpfile.js
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');

// 清除旧文件目录及文件
gulp.task('clear', done => {
  gulp.src('dist', { read: false, allowEmpty: true }).pipe(clean());
  done();
})

gulp.task('npm', () => 
  gulp.src('miniprogram/**/miniprogram_npm/**', { base: '' }).pipe(gulp.dest('dist'))
)

gulp.task('wxml', () => gulp
  .src(['miniprogram/**/*.wxml', '!./miniprogram/**/miniprogram_npm/**'], { base: '' })
  .pipe(htmlmin({
    // 更多配置项https://github.com/kangax/html-minifier#user-content-options-quick-reference
    collapseWhitespace: true, //压缩HTML
    removeComments: true, //清除HTML注释
    keepClosingSlash: true, // 保留关闭标签
    caseSensitive: true // 忽略大小写
  }))
  .pipe(gulp.dest('dist'))
)

gulp.task('json', () => 
  gulp.src(['./miniprogram/**/*.json', '!./miniprogram/**/miniprogram_npm/**'], { base: '' }).pipe(gulp.dest('dist'))
)

gulp.task('js', () => 
  gulp.src(['./miniprogram/**/*.js', '!./miniprogram/**/miniprogram_npm/**'], { base: '' }).pipe(gulp.dest('dist'))
)

gulp.task('wxss', () =>
  gulp.src(['./miniprogram/**/*.wxss', '!./miniprogram/**/miniprogram_npm/**'], { base: '' }).pipe(gulp.dest('dist'))
)

gulp.task('wxs', function () {
  return gulp.src(['./miniprogram/**/*.wxs', '!./miniprogram/**/miniprogram_npm/**'], { base: '' }).pipe(gulp.dest('dist'))
})

gulp.task('images', function () {
  return gulp
    .src(
      [
        './miniprogram/**/*.png',
        './miniprogram/**/*.jpg',
        './miniprogram/**/*.jpeg',
        './miniprogram/**/*.gif',
        '!./miniprogram/**/miniprogram_npm/**'
      ],
      { base: '' }
    )
    .pipe(gulp.dest('dist'))
})

gulp.task('uglify', function () {
  return gulp
    .src(['./dist/**/*.js', '!./miniprogram/**/miniprogram_npm/**'], { base: '' })
    .pipe(
      uglify({
        compress: false, // 是否完全压缩
        mangle: true // 是否修改变量名
      })
    )
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', function () {
  gulp.watch('./miniprogram/**/miniprogram_npm/**', gulp.series('npm'))
  gulp.watch(['./miniprogram/**/*.wxml', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('wxml'))
  gulp.watch(['./miniprogram/**/*.json', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('json'))
  gulp.watch(['./miniprogram/**/*.wxss', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('wxss'))
  gulp.watch(['./miniprogram/**/*.wxs', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('wxs'))
  gulp.watch(['./miniprogram/**/*.js', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('js'))
  gulp.watch(
    ['./miniprogram/**/*.png', './miniprogram/**/*.jpg', './miniprogram/**/*.jpeg', './miniprogram/**/*.gif', '!./miniprogram/**/miniprogram_npm/**'],
    gulp.series('images')
  )
})

gulp.task('default', gulp.series(['npm', 'wxml', 'json', 'wxss', 'wxs', 'js', 'images'], 'watch'))

```

#### 使用预编译css

##### SASS

```bash
npm i -D gulp-sass@4.1.0 gulp-sass-bulk-import
```

> Gulp-saas@5不再有默认的 Sass 编译器。如果使用需要安装相应sass以及调用
>
> `npm i -D sass gulp-sass gulp-sass-bulk-import`

```js
const rename = require('gulp-rename');
const sass = require('gulp-sass'); // ^4.1.0
// const sass = require('gulp-sass')(require('sass')); // ^5.1.0
const bulkSass = require('gulp-sass-bulk-import'); // 不理解有啥用

// 在压缩任务之前添加
gulp.task('scss', function () {
  return gulp
    .src(['./miniprogram/**/*.scss', '!./miniprogram/**/miniprogram_npm/**'], { base: '' })
    .pipe(bulkSass())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      rename({
        extname: '.wxss'
      })
    )
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', function () {
  ...
  gulp.watch(['./miniprogram/**/*.scss', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('scss'))
  gulp.watch(['./miniprogram/**/*.wxss', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('wxss'))
	...
})

gulp.task('default', gulp.series([..., 'scss',  ...], 'watch'))
```

##### stylus

`npm i -D gulp-stylus`

```js
const stylus = require('gulp-stylus');

// 在压缩任务之前添加
gulp.task('stylus', () => gulp
  .src(['miniprogram/**/*.styl', '!./miniprogram/**/miniprogram_npm/**'], { base: '' })
  .pipe(stylus({
    compress: true
  }))
  .pipe(
    rename({
      extname: '.wxss'
    })
  )
  .pipe(gulp.dest('dist'))
)

gulp.task('watch', function () {
  ...
  gulp.watch(['./miniprogram/**/*.styl', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('stylus'))
  gulp.watch(['./miniprogram/**/*.wxss', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('wxss'))
	...
})

gulp.task('default', gulp.series([..., 'stylus',  ...], 'watch'))
```

### stylelint-css代码规范工具

`npm i -D stylelint stylelint-config-standard stylelint-order stylelint-config-property-sort-order-smacss stylelint-[scss|stylus|..] [stylelint-config-recess-order] [stylelint-prettier stylelint-config-prettier] [stylelint-config-standard-scss]`

* **stylelint-order**: 该插件的作用是强制你按照某个顺序编写 css。例如先写定位，再写盒模型，再写内容区样式，最后写 CSS3 相关属性。这样可以极大的保证我们代码的可读性。
* **stylelint-config-standard**: 作用：配置 Stylelint 规则。
* **stylelint-config-recess-order**: stylelint-order 插件的第三方配置
* **stylelint-[scss|stylus|..]**: 与编译器语法扩展
  * **stylelint-prettier**: 基于 `prettier` 代码风格的 `stylelint` 规则。**搭配prettier**
  * **stylelint-config-prettier**: 禁用所有与格式相关的 Stylelint 规则，解决 prettier 与 stylelint 规则冲突，确保将其放在 `extends` 队列最后，这样它将覆盖其他配置。**搭配prettier**
* **stylelint-config-property-sort-order-smacss**: 基于 [SMACSS](http://smacss.com/) 方法排序样式
* **stylelint-config-standard-[scss]**: 扩展 [`stylelint-config-standard` 共享配置](https://github.com/stylelint/stylelint-config-standard).**未找到stylus的**

```json
// 根目录添加.stylelintrc 文件
// stylelint中文文档https://stylelint.bootcss.com/  https://segmentfault.com/a/1190000041521952
{
  "plugins": ["stylelint-order", "stylelint-prettier"],
  "extends": ["stylelint-config-standard", "stylelint-config-prettier", "stylelint-config-standard-scss(如果用scss的话)", "stylelint-config-property-sort-order-smacss"],
  "rules": {
    // at-rule-no-unknown: 屏蔽一些scss等语法检查
    "at-rule-no-unknown": [ // 禁止使用未知的 at 规则
      true,
      {
        "ignoreAtRules": ["mixin", "include", "extend", "import", "if"]
      }
    ],
    /*
     'rule-empty-line-before': [
      // 要求或禁止在规则声明之前有空行
      'always-multi-line',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    */
    "declaration-empty-line-before": "never", // 要求或禁止在声明语句之前有空行
    "no-descending-specificity": null, // 禁止低优先级的选择器出现在高优先级的选择器之后
    "selector-pseudo-element-no-unknown": [ // 不允许未知的伪元素选择器。
      true,
      {
        "ignorePseudoElements": ["v-deep"]
      }
    ],
    "selector-pseudo-class-no-unknown": [ // 不允许未知的伪类选择器。
      true,
      {
        "ignorePseudoClasses": ["deep"]
      }
    ],
    "unit-no-unknown": [ // 不允许未知单位。
      true,
      {
        "ignoreUnits": ["/rpx/"]
      }
    ],
    "selector-type-no-unknown": [ // 禁止未知的类型选择器。（input，ul，li。。。）
      true,
      {
        "ignoreTypes": [
          "/page/"
        ]
      }
    ],
    "custom-property-no-missing-var-function": [ // 不允许 var 自定义属性缺少功能。
      true,
      {
        "ignoreAtRules": ["$"]
      }
    ],
    "prettier/prettier": [
      true
    ],
    "function-no-unknown": [ // 禁止未知功能。
      true,
      {
        "ignoreFunctions": ["constant", "env"]
      }
    ],
    "value-no-vendor-prefix": null, // 禁止给值添加浏览器引擎前缀
    "color-function-notation": "legacy", // 为适用的颜色功能指定现代或传统符号（可自动修复）。
		"order/order": [
      "at-rules",
      "declarations",
      "rules",
      "dollar-variables",
      "custom-properties"
    ],
    "alpha-value-notation": null // 指定 alpha 值的百分比或数字表示法（可自动修复）。
  }
}
```

>```json
>module.exports = {
>  extends: ['stylelint-config-standard', 'stylelint-config-rational-order', 'stylelint-prettier/recommended'],
>  rules: {
>    // 'prettier/prettier': [true, { singleQuote: false }],
>    // at-rule-no-unknown: 屏蔽一些scss等语法检查
>    'at-rule-no-unknown': [true, { ignoreAtRules: ['mixin', 'extend', 'content'] }], // 禁止使用未知的 at 规则
>    'rule-empty-line-before': [
>      // 要求或禁止在规则声明之前有空行
>      'always-multi-line',
>      {
>        except: ['first-nested'],
>        ignore: ['after-comment'],
>      },
>    ],
>    'at-rule-empty-line-before': [
>      // 要求或禁止在 at 规则之前有空行
>      'always',
>      {
>        except: ['blockless-after-same-name-blockless', 'first-nested'],
>        ignore: ['after-comment'],
>      },
>    ],
>    'comment-empty-line-before': [
>      // 要求或禁止在注释之前有空行
>      'always',
>      {
>        except: ['first-nested'],
>        ignore: ['stylelint-commands'],
>      },
>    ],
>    'block-no-empty': true, // 禁止出现空块
>    'declaration-empty-line-before': 'never', // 要求或禁止在声明语句之前有空行。
>    'declaration-block-no-duplicate-properties': true, // 在声明的块中中禁止出现重复的属性
>    'declaration-block-no-redundant-longhand-properties': true, // 禁止使用可以缩写却不缩写的属性。
>    'shorthand-property-no-redundant-values': true, // 禁止在简写属性中使用冗余值。
>    'function-url-quotes': 'always', // 要求或禁止 url 使用引号。
>    'color-hex-length': 'short', // 指定十六进制颜色是否使用缩写
>    'color-named': 'never', // 要求 (可能的情况下) 或 禁止使用命名的颜色
>    'comment-no-empty': true, // 禁止空注释
>    'font-family-name-quotes': 'always-unless-keyword', // 指定字体名称是否需要使用引号引起来 | 期待每一个不是关键字的字体名都使用引号引起来
>    'font-weight-notation': 'numeric', // 要求使用数字或命名的 (可能的情况下) font-weight 值
>    'property-no-vendor-prefix': true, // 禁止属性使用浏览器引擎前缀
>    'value-no-vendor-prefix': true, // 禁止给值添加浏览器引擎前缀
>    'selector-no-vendor-prefix': true, // 禁止使用浏览器引擎前缀
>    'no-descending-specificity': null, // 禁止低优先级的选择器出现在高优先级的选择器之后
>  },
>};
>
>作者：慕小白_
>链接：https://juejin.cn/post/6878121082188988430
>来源：稀土掘金
>著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
>```

```
// .stylelintignore

dist/

miniprogram_npm/
miniprogram/module/

miniprogram/package**
```



### prettier

`npm i -D prettier`

首先要做的就是在vscode安装prettierrc-代码格式化插件

[What is Prettier? · Prettier 中文网](https://www.prettier.cn/docs/index.html)

> 联动：stylelint,eslint

```json
// 根目录.prettierrc

{
  "singleQuote": true, // 使用单引号而不是双引号。
  "semi": false, // 在语句末尾增加分号。
  "bracketSpacing": true, // 在对象文本中的括号之间打印空格。
  "trailingComma": "none", // 尽可能在多行逗号分隔的语法结构中打印尾随逗号。（例如，单行数组永远不会得到尾随逗号。
  "bracketSameLine": false, // 将多行 HTML的'>'（HTML、JSX、Vue、Angular）元素放在最后一行的末尾，而不是单独放在下一行（不适用于自闭合元素）
  "arrowParens": "avoid", // 在唯一箭头函数参数两边加上括号。"avoid"- 尽可能省略；"always"- 始终包含
  "endOfLine": "auto",
  "printWidth": 150, // 指定打印机将换行的行长度。
  "htmlWhitespaceSensitivity": "ignore", // 指定 HTML、Vue、Angular 和 Handlebar 的全局空格敏感性。
  "overrides": [
    {
      "files": "*.wxml",
      "options": {
        "parser": "html"
      }
    },
    {
      "files": "*.html",
      "options": {
        "parser": "html"
      }
    },
    {
      "files": "*.vue",
      "options": {
        "parser": "vue"
      }
    }
  ]
}

```



### eslint

`npm i -D eslint eslint-plugin-eslint-plugin eslint-plugin-import eslint-plugin-node eslint-plugin-simple-import-sort  [eslint-plugin-local eslint-plugin-self] [eslint-config-prettier eslint-plugin-prettier]

**wxml+eslint**: `npm i -D eslint-plugin-wxml`

**vue+eslint**: `npm i -D vue-eslint-parser eslint-plugin-vue`

> 使用vue3+vite：安装@vitejs/plugin-vue提供 Vue 3 单文件组件支持
>
> [插件 | Vite 官方中文文档 (vitejs.dev)](https://cn.vitejs.dev/plugins/)

**eslint+ts**`@typescript-eslint/eslint-plugin  @typescript-eslint/parser `

**eslint+ts+vue**: [eslint+ts] @vue/eslint-config-typescript`

* **一个用于插入ESLint插件的ESLint插件**: ??不懂
* **eslint-plugin-import**：这个插件意在提供对ES6+ import/export语法的支持，有助于防止你写错文件路径或者引用的变量名。
* **eslint-plugin-node**：添加对node的eslint支持
* **eslint-plugin-local**：允许使用本地eslint的plugin，因为只支持远端地址
* **eslint-plugin-self**: 允许ESLint插件自行运行
* **eslint-plugin-simple-import-sort**：使用 eslint 自动调整 import 代码顺序
* **eslint-plugin-vue**：为vue添加ESLint校验
* **eslint-plugin-wxml**：wxml 代码检查插件
* **vue-eslint-parser**: .vue文件的ESLint自定义解析器

[Configuring ESLint - ESLint中文文档 (bootcss.com)](https://eslint.bootcss.com/docs/user-guide/configuring)

```json
// 根目录.eslintrc
// 小程序
// author：molvqingtai
{
  "root": true,
  "env": { // 一个环境定义了一组预定义的全局变量
    "browser": true, // 浏览器环境中的全局变量
    "node": true, // Node.js 全局变量和 Node.js 作用域
    "es6": true // 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）。
  },
  "extends": [
    "eslint:recommended", 
    "plugin:vue/recommended", 
    "@vue/typescript", 
    "plugin:prettier/recommended", 
    "plugin:eslint-plugin/recommended"
  ],
  "plugins": ["simple-import-sort", "import", "@typescript-eslint"],
  "rules": {
    "no-undef": "off",
    "no-async-promise-executor": "off",
    "prettier/prettier": "error",
    "spaced-comment": "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "no-console": 1,
    "@typescript-eslint/no-unused-vars": "error"
  },
  "parserOptions": { // 想要支持的 JavaScript 语言选项
    "parser": "@typescript-eslint/parser",
    "ecmaVersion": 6, // 指定你想要使用的 ECMAScript 版本
    "ecmaFeatures": { // 表示你想使用的额外的语言特性
      "experimentalObjectRestSpread": true // 启用实验性的 object rest/spread properties 支持
      // "globalReturn" 允许在全局作用域下使用 return 语句
      // "impliedStrict" 启用全局 strict mode (如果 ecmaVersion 是 5 或更高)
      // "jsx" 启用 JSX
    }
  },
  "overrides": [ // 为特定类型的文件指定处理器
    {
      "files": ["*.wxml"],
      "rules": {
        "wxml/empty-tag-self-closing": "error",
        "wxml/report-wxml-syntax-error": "error",
        "wxml/colon-style-event-binding": "error",
        "wxml/report-wxs-syntax-error": "error",
        "wxml/wxs-must-be-top-level": "error",
        "wxml/wxs-module-prop": "error",
        "wxml/quotes": ["error", "double"],
        "wxml/wx-key": "error",
        "wxml/no-wx-if-string": "error",
        "wxml/no-wx-for-with-wx-if": "error",
        "wxml/no-wx-for-with-wx-else": "error",
        "wxml/no-vue-directive": "error",
        "wxml/no-unnecessary-block": "off",
        "wxml/no-unexpected-string-bool": "error",
        "wxml/no-inline-wxs": "error",
        "wxml/no-index-in-wx-key": "off",
        "wxml/no-dynamic-wx-key": "error",
        "wxml/no-duplicate-attributes": "error",
        "wxml/no-dot-this-in-wx-key": "error",
        "wxml/no-const-and-let-in-wxs": "error",
        "wxml/forbid-tags": "error",
        "wxml/required-attributes": [
          "error",
          {
            "tag": "comp-auth",
            "attrs": ["id"]
          },
          { "tag": "comp-price", "attrs": ["price"] },
          { "tag": "comp-product", "attrs": ["product"] },
          { "tag": "comp-checkbox", "attrs": ["checked"] }
        ],
        "local/space-style": "error",
        "local/order-attributes": "error",
        "local/capitalize-attributes-key": "error"
      },
      "plugins": ["wxml", "local"],
      "parser": "@wxml/parser"
    }
  ],
  "globals": { // 当访问当前源文件内未定义的变量时，no-undef 规则将发出警告。如果你想在一个源文件里使用全局变量，推荐你在 ESLint 中定义这些全局变量，这样 ESLint 就不会发出警告了。你可以使用注释或在配置文件中定义全局变量。
    "wx": true,
    "getApp": true,
    "getCurrentPages": true,
    "Page": true,
    "Component": true,
    "Behavior": true,
    "App": true
  }
}


// vue
{
  "root": true,
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "vue/setup-compiler-macros": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/recommended",
    "@vue/typescript",
    "plugin:vue/base",
    "plugin:vue/vue3-essential",
    "plugin:vue/vue3-strongly-recommended",
    "plugin:vue/vue3-recommended",
    "plugin:vue/essential",
    "plugin:vue/strongly-recommended",
    "plugin:vue/recommended",
    "plugin:prettier/recommended",
    "plugin:eslint-plugin/recommended"
  ],
  "plugins": ["simple-import-sort", "import", "@typescript-eslint"],
  "rules": {
    "vue/max-attributes-per-line": [
      2,
      {
        "singleline": 8,
        "multiline": 3
      }
    ],
    "vue/singleline-html-element-content-newline": "off",
    "template-curly-spacing": "off",
    "vue/no-v-model-argument": 0,
    "vue/multi-word-component-names": "off",
    "vue/no-v-for-template-key": "off",
    "vue/no-v-html": "off",
    "no-undef": "off",
    "vue/no-multi-spaces": [
      2,
      {
        "ignoreProperties": false
      }
    ],
    "vue/html-self-closing": ["error", {
      "html": {
        "void": "always",
        "normal": "always",
        "component": "always"
      },
      "svg": "always",
      "math": "always"
    }],
    "prettier/prettier": "error",
    "eslint-plugin/report-message-format": ["error", "^[^a-z].*\\.$"],
    "vue/no-multiple-template-root": "off",
    "vue/first-attribute-linebreak": [
      "error",
      {
        "singleline": "ignore",
        "multiline": "ignore"
      }
    ],
    "no-async-promise-executor": "off",
    "spaced-comment": "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "no-console": 1,
    "@typescript-eslint/no-unused-vars": ["error"]
  },
  "parserOptions": {
    "parser": "@typescript-eslint/parser"
  },
  "globals": {
    "window": true
  }
}

```

```js
// .eslintplugin.js
// 微信小程序html属性排序
const DIRECTIVE = 'DIRECTIVE'
const OTHER_ATTR = 'OTHER_ATTR'
const CLASS_ATTR = 'CLASS_ATTR'
const STYLE_ATTR = 'STYLE_ATTR'
const EVENT_BINDING = 'EVENT_BINDING'

const ATTRS_ORDER = new Map([
  // wx: 指令
  [DIRECTIVE, 0],
  // 其他属性
  [OTHER_ATTR, 1],
  // class 属性
  [CLASS_ATTR, 2],
  // style 属性
  [STYLE_ATTR, 3],
  // 事件绑定
  [EVENT_BINDING, 4]
])

const getAttributeType = attribute => {
  const { key } = attribute
  if (/^wx:/.test(key)) {
    return DIRECTIVE
  } else if (/^class$/.test(key) || /class-|-class/.test(key)) {
    return CLASS_ATTR
  } else if (/^style$/.test(key) || /style-|-style/.test(key)) {
    return STYLE_ATTR
  } else if (/^bind:|catch:|mut-bind:|capture-bind:|capture-catch:/.test(key)) {
    return EVENT_BINDING
  } else {
    // 其他属性
    return OTHER_ATTR
  }
}

const getAttributeAndPositionList = attributes => {
  return attributes
    .map(attribute => {
      const type = getAttributeType(attribute)
      const position = ATTRS_ORDER.get(type) ?? null
      return {
        attribute,
        position
      }
    })
    .filter(item => item.position !== null)
}

const reportIssue = (context, node, previousNode) => {
  const sourceCode = context.getSourceCode()
  context.report({
    node,
    message: `Attribute "${node.key}" should go before "${previousNode.key}".`,
    fix(fixer) {
      const attributes = node.parent.attributes
      const previousNodes = attributes.slice(attributes.indexOf(previousNode), attributes.indexOf(node))
      const moveNodes = [node, ...previousNodes]
      return moveNodes.map((moveNode, index) => {
        // 可能是 @wxml/parser 的 bug，range 结束位置不准确，需 +1
        // const text = sourceCode.getText(moveNode)
        // const res = fixer.replaceText(previousNodes[index] || node, text)
        // return fixer.replaceText(previousNodes[index] || node, text)
        const text = sourceCode.getText(moveNode, 0, 1)
        const range = (previousNodes[index] || node).range
        return fixer.replaceTextRange([range[0], range[1] + 1], text)
      })
    }
  })
}

module.exports = {
  processors: {
    '.wxml': {
      preprocess(code) {
        return [code]
      },
      postprocess(messages) {
        return messages[0]
      },
      supportsAutofix: true
    }
  },
  rules: {
    'space-style': {
      meta: {
        type: 'problem',
        docs: {
          description: 'style error',
          categories: []
        },
        fixable: null,
        deprecated: true,
        messages: {
          compileWarn: 'need fix this style error'
        },
        schema: []
      },
      create: function (context) {
        return {
          WXAttribute(node) {
            if (node && node.value) {
              const flag =
                /^\{\{(?=[^\s])/.test(node.value) ||
                /\s{2}/.test(node.value) ||
                /(?<=[^\s])\}\}$/.test(node.value) ||
                /{{.*(?<! )===|===(?! ).*}}/.test(node.value) ||
                /{{.*(?<! )&&|&&(?! ).*}}/.test(node.value) ||
                /{{.*(?<! )\|\||\|\|(?! ).*}}/.test(node.value)
              if (flag) {
                context.report({
                  node: node,
                  messageId: 'compileWarn'
                })
              }
            }
          }
        }
      }
    },
    'order-attributes': {
      meta: {
        type: 'problem',
        docs: {
          description: 'order error',
          categories: []
        },
        fixable: 'code',
        schema: []
      },
      create: function (context) {
        return {
          WXStartTag(node) {
            const attributes = node.attributes
            if (!attributes?.length) return

            const attributeAndPositions = getAttributeAndPositionList(attributes)
            if (attributeAndPositions.length) {
              let { attribute: previousNode, position: previousPosition } = attributeAndPositions[0]
              for (let index = 1; index < attributeAndPositions.length; index++) {
                const { attribute, position } = attributeAndPositions[index]
                const valid = previousPosition <= position
                if (valid) {
                  previousNode = attribute
                  previousPosition = position
                } else {
                  reportIssue(context, attribute, previousNode)
                }
              }
            }
          }
        }
      }
    },
    'capitalize-attributes-key': {
      meta: {
        type: 'problem',
        docs: {
          description: 'word error',
          categories: []
        },
        fixable: 'code',
        messages: {
          compileWarn: 'Attribute\'s Key must be lowercase'
        }
      },
      create: function (context) {
        return {
          WXAttribute(node) {
            if (node && node.value) {
              const flag = /[A-Z]/.test(node.key)
              if (flag) {
                context.report({
                  node,
                  messageId: 'compileWarn',
                  fix(fixer) {
                    const range = node.range
                    const replaceKey = node.key.replace(/[A-Z]/g, function ($1, index) {
                      return `${index === 0 ? '' : '-'}${$1.toLowerCase()}`
                    })
                    return fixer.replaceTextRange([range[0], range[0] + node.key.length], replaceKey)
                  }
                })
              }
            }
          }
        }
      }
    }
  }
}

```





### 修改小程序配置文件

project.config.json

```diff
{
  ...
- "miniprogramRoot": "miniprogram/",
+ "miniprogramRoot": "miniprogram/",
- "useCompilerPlugins": [
-     "typescript"
-   ],
+ "useCompilerPlugins": false,
  ...
}
```



### vue3+vite相关

`npm i -D rollup-plugin-visualizer rollup-plugin-visualizer`

* **rollup-plugin-visualizer**：打包分析插件
* **vite-plugin-svg-icons**： 使用svg

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  // 全局变量
  const define = {}
  if (mode !== 'development') define['process.platform'] = 'win32'
  else define['process.env'] = process.env

  return defineConfig({
    base: env.VITE_APP_BASE_URL,
    define,
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/elementVariables.scss"; @import "@/styles/_mixins.scss"; @import "@/styles/_variables.scss";`,
          charset: false
        }
      }
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [
          resolve(__dirname, './src/icons'),
          resolve(__dirname, './src/views/permission/custom/icons'),
          resolve(__dirname, './node_modules/@element-plus/icons-svg')
        ],
        symbolId: 'icon-[name]'
      }),
      // stats.html
      visualizer()
    ],
    optimizeDeps: {
      include: ['vue']
    },
    server: {
      open: false,
      host: '0.0.0.0',
      port: 9527,
      strictPort: false
    },
    build: {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      minify: 'terser',
      cssCodeSplit: true,
      assetsInlineLimit: 1024 * 1,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const name = id.toString().split('node_modules/')[1].split('/')[0].toString()
              return ['tinymce', 'element-plus', ''].includes(name) && name
            }
          }
        }
      }
    }
  })
}

```

