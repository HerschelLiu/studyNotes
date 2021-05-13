## 前言

微信小程序开发者工具本身就可以直接创建Typescript的项目

## 准备

0. 全局安装`gulp``(c)npm install gulp-cli -g`

1. 微信开发者工具创建项目，语言使用`TypeScript`

2. 进入项目根目录，`(c)npm install gulp -D`

3. 根目录创建`gulpfile.js`

    ```js
    // gulpfile.js
    const gulp = require('gulp')
    const rename = require('gulp-rename')
    const sass = require('gulp-sass')
    const bulkSass = require('gulp-sass-bulk-import')
    const htmlmin = require('gulp-htmlmin')
    const minify = require('gulp-minify')
    const clean = require('gulp-clean')
    const replace = require('gulp-replace')
    
    gulp.task('clear', done => {
      gulp.src('dist/', { read: false, allowEmpty: true })
        .pipe(clean())
      done()
    })
    
    gulp.task('wxml', function() {
      return gulp.src('./miniprogram/**/*.wxml', { 'base': '' })
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true, keepClosingSlash: true, caseSensitive: true }))
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('json', function() {
      return gulp.src('./miniprogram/**/*.json', { 'base': '' })
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('js', function() {
      return gulp.src('./miniprogram/**/*.js', { 'base': '' })
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('wxss', function() {
      return gulp.src('./miniprogram/**/*.wxss', { 'base': '' })
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('wxs', function() {
      return gulp.src('./miniprogram/**/*.wxs', { 'base': '' })
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('png', function() {
      return gulp.src('./miniprogram/**/*.png', { 'base': '' })
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('scss', function() {
      return gulp.src('./miniprogram/**/*.scss', { 'base': '' })
        .pipe(bulkSass())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename({
          extname: '.wxss'
        }))
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('mini', function() {
      return gulp.src('./dist/**/*.js', { 'base': '' })
        .pipe(minify({
          ext: {
            min: [/(.*)\.js$/, '$1.js']
          },
          mangle: false,
          noSource: true,
          exclude: ['tasks']
        }))
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('version', function() {
      return gulp.src('./dist/**/*.js', { 'base': '' })
        .pipe(replace('___version___', `${ new Date().getFullYear() }.${ (new Date().getMonth() + 1).toString().padStart(2, '0') }.${ new Date().getDate().toString().padStart(2, '0') }`))
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('watch', function() {
      gulp.watch('./miniprogram/**/*.wxml', gulp.series('wxml'))
      gulp.watch('./miniprogram/**/*.json', gulp.series('json'))
      gulp.watch('./miniprogram/**/*.scss', gulp.series('scss'))
      gulp.watch('./miniprogram/**/*.wxss', gulp.series('wxss'))
      gulp.watch('./miniprogram/**/*.wxs', gulp.series('wxs'))
      gulp.watch('./miniprogram/**/*.js', gulp.series('js'))
      gulp.watch('./miniprogram/**/*.png', gulp.series('png'))
    })
    
    gulp.task('default', gulp.series(['wxml', 'json', 'wxss', 'wxs', 'scss', 'js', 'png'], 'watch'))
    
    ```

    ```json
    // package.json
    {
      "name": "mini-program",
      "version": "1.0.0",
      "scripts": {
        "tsc": "tsc -w",
        "gulp": "gulp",
        "lint": "eslint --ext .ts,.wxml miniprogram",
        "dev": "gulp clear && concurrently \"npm run tsc\" \"npm run gulp\"",
        "build:tsc": "node ./node_modules/typescript/lib/tsc.js",
        "build:gulp": "gulp wxml json wxss wxs scss js png version && gulp mini",
        "build": "gulp clear && npm run build:tsc && npm run build:gulp"
      },
      "devDependencies": {
        "@vue/cli-plugin-eslint": "^4.1.2",
        "@vue/eslint-config-standard": "^4.0.0",
        "@vue/eslint-config-typescript": "^4.0.0",
        "babel-eslint": "^10.0.3",
        "concurrently": "^5.3.0",
        "eslint": "^6.5.1",
        "eslint-plugin-vue": "^5.2.3",
        "gulp": "^4.0.2",
        "gulp-clean": "^0.4.0",
        "gulp-htmlmin": "^5.0.1",
        "gulp-minify": "^3.1.0",
        "gulp-rename": "^2.0.0",
        "gulp-replace": "^1.0.0",
        "gulp-sass": "^4.1.0",
        "gulp-sass-bulk-import": "^1.0.1",
        "gulp-sass-glob-import": "^0.1.0",
        "node-sass": "^4.14.1",
        "typescript": "^3.2.1"
      },
      "dependencies": {
        "@types/node": "^14.14.30"
      }
    }
    
    ```
    
    ```js
    // babel.config.js
    module.exports = {
      presets: [
        '@vue/cli-plugin-babel/preset'
      ]
    }
    
    ```
    
    ```json
    // tsconfig.json
    {
      "compilerOptions": {
        "strictNullChecks": true,
        "noImplicitAny": true,
        "module": "esnext",
        "target": "esnext",
        "allowJs": false,
        "experimentalDecorators": true,
        "noImplicitThis": true,
        "noImplicitReturns": true,
        "alwaysStrict": true,
        "inlineSourceMap": false,
        "inlineSources": false,
        "noFallthroughCasesInSwitch": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "strict": true,
        "removeComments": true,
        "pretty": true,
        "strictPropertyInitialization": true,
        "outDir": "./dist",
        "types": [
          "node"
        ]
      },
      "include": [
        "./miniprogram/**/*.ts",
        "./plugin/**/*.ts"
      ],
      "exclude": [
        "node_modules",
        "miniprogram_dist",
        "**/*.spec.ts",
        "typings"
      ]
    }
    
    ```
    
    ```text
    // .eslintignore
    dist/*.js
    src/assets
    tests/unit/coverage
    node_modules/*.js
    
    ```
    
    ```js
    // .eslintrc.js
    
    module.exports = {
      root: true,
      env: {
        browser: true,
        node: true,
        es6: true
      },
      extends: [
        'eslint:recommended',
        'plugin:vue/recommended',
        '@vue/standard',
        '@vue/typescript'
      ],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error"
        ],
        "vue/max-attributes-per-line": [2, {
          "singleline": 10,
          "multiline": {
            "max": 1,
            "allowFirstLine": false
          }
        }],
        "vue/no-unused-components": "error",
        "vue/no-unused-vars": "error",
        "no-unused-vars": "error",
        "vue/singleline-html-element-content-newline": "off",
        "vue/multiline-html-element-content-newline":"off",
        "vue/name-property-casing": ["error", "PascalCase"],
        "vue/no-v-html": "off",
        'accessor-pairs': 2,
        'arrow-spacing': [2, {
          'before': true,
          'after': true
        }],
        'block-spacing': [2, 'always'],
        'brace-style': [2, '1tbs', {
          'allowSingleLine': true
        }],
        'camelcase': [0, {
          'properties': 'always'
        }],
        'comma-dangle': [2, 'never'],
        'comma-spacing': [2, {
          'before': false,
          'after': true
        }],
        'comma-style': [2, 'last'],
        'constructor-super': 2,
        'curly': [2, 'multi-line'],
        'dot-location': [2, 'property'],
        'eol-last': 2,
        'eqeqeq': ["error", "always", {"null": "ignore"}],
        'generator-star-spacing': [2, {
          'before': true,
          'after': true
        }],
        'handle-callback-err': [2, '^(err|error)$'],
        'indent': [2, 2, {
          'SwitchCase': 1
        }],
        'jsx-quotes': [2, 'prefer-single'],
        'key-spacing': [2, {
          'beforeColon': false,
          'afterColon': true
        }],
        'keyword-spacing': [2, {
          'before': true,
          'after': true
        }],
        'new-cap': [2, {
          'newIsCap': true,
          'capIsNew': false
        }],
        'new-parens': 2,
        'no-array-constructor': 2,
        'no-caller': 2,
        'no-console': 'off',
        'no-class-assign': 2,
        'no-cond-assign': 2,
        'no-const-assign': 2,
        'no-control-regex': 0,
        'no-delete-var': 2,
        'no-dupe-args': 2,
        'no-dupe-class-members': 2,
        'no-dupe-keys': 2,
        'no-duplicate-case': 2,
        'no-empty-character-class': 2,
        'no-empty-pattern': 2,
        'no-eval': 2,
        'no-ex-assign': 2,
        'no-extend-native': 2,
        'no-extra-bind': 2,
        'no-extra-boolean-cast': 2,
        'no-extra-parens': [2, 'functions'],
        'no-fallthrough': 2,
        'no-floating-decimal': 2,
        'no-func-assign': 2,
        'no-implied-eval': 2,
        'no-inner-declarations': [2, 'functions'],
        'no-invalid-regexp': 2,
        'no-irregular-whitespace': 2,
        'no-iterator': 2,
        'no-label-var': 2,
        'no-async-promise-executor': 0,
        'no-labels': [2, {
          'allowLoop': false,
          'allowSwitch': false
        }],
        'no-lone-blocks': 2,
        'no-mixed-spaces-and-tabs': 2,
        'no-multi-spaces': 1,
        'no-multi-str': 2,
        'no-multiple-empty-lines': [2, {
          'max': 1
        }],
        'no-native-reassign': 2,
        'no-negated-in-lhs': 2,
        'no-new-object': 2,
        'no-new-require': 2,
        'no-new-symbol': 2,
        'no-new-wrappers': 2,
        'no-obj-calls': 2,
        'no-octal': 2,
        'no-octal-escape': 2,
        'no-path-concat': 2,
        'no-proto': 2,
        'no-redeclare': 2,
        'no-regex-spaces': 2,
        'no-return-assign': [2, 'except-parens'],
        'no-self-assign': 2,
        'no-self-compare': 2,
        'no-sequences': 2,
        'no-shadow-restricted-names': 2,
        'no-spaced-func': 2,
        'no-sparse-arrays': 2,
        'no-this-before-super': 2,
        'no-throw-literal': 2,
        'no-trailing-spaces': 2,
        'no-undef': 2,
        'no-undef-init': 2,
        'no-unexpected-multiline': 2,
        'no-unmodified-loop-condition': 2,
        'no-unneeded-ternary': [2, {
          'defaultAssignment': false
        }],
        'no-unreachable': 2,
        'no-unsafe-finally': 2,
        'no-useless-call': 2,
        'no-useless-computed-key': 2,
        'no-useless-constructor': 2,
        'no-useless-escape': 0,
        'no-whitespace-before-property': 2,
        'no-with': 2,
        'one-var': [2, {
          'initialized': 'never'
        }],
        'operator-linebreak': [2, 'after', {
          'overrides': {
            '?': 'before',
            ':': 'before'
          }
        }],
        'padded-blocks': [2, 'never'],
        'quotes': [2, 'single', {
          'avoidEscape': true,
          'allowTemplateLiterals': true
        }],
        'semi': [2, 'never'],
        'semi-spacing': [2, {
          'before': false,
          'after': true
        }],
        'space-before-blocks': [2, 'always'],
        'space-before-function-paren': [2, 'never'],
        'space-in-parens': [2, 'never'],
        'space-infix-ops': 2,
        'space-unary-ops': [2, {
          'words': true,
          'nonwords': false
        }],
        'spaced-comment': [2, 'always', {
          'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
        }],
        'template-curly-spacing': [2, 'always'],
        'use-isnan': 2,
        'valid-typeof': 2,
        'wrap-iife': [2, 'any'],
        'yield-star-spacing': [2, 'both'],
        'yoda': [2, 'never'],
        'prefer-const': 2,
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'object-curly-spacing': [2, 'always', {
          objectsInObjects: false
        }],
        'array-bracket-spacing': [2, 'never'],
        'prefer-promise-reject-errors': ["error", {"allowEmptyReject": true}]
      },
      parserOptions: {
        parser: '@typescript-eslint/parser'
      },
      overrides: [
        {
          files: [
            '**/__tests__/*.{j,t}s?(x)',
            '**/tests/unit/**/*.spec.{j,t}s?(x)'
          ],
          env: {
            jest: true
          }
        }
      ],
      globals: {
        'wx': true,
        'getApp': true,
        'getCurrentPages': true,
        'Page': true,
        'Component': true,
        'Behavior': true,
        'App': true
      }
    }
    
    ```
    
    ```text
    // .gitignore
    node_modules/
    dist/
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    **/*.log
    tests/**/coverage/
    tests/e2e/reports
    
    !miniprogram/miniprogram_npm/**/*.js
    miniprogram/**/style/*.wxss
    
    # Editor directories and files
    .idea
    *.suo
    *.ntvs*
    *.njsproj
    *.sln
    *.local
    json/
    ```
    
    ```json
    // project.config.json 修改
    {
        "miniprogramRoot": "dist/",
        "packOptions": {
            "ignore": [
                {
                    "type": "suffix",
                    "value": ".ts"
                }
            ]
        },
        "scripts": {
            "beforeCompile": "",
            "beforePreview": "",
            "beforeUpload": "npm run build"
        },
        "setting": {
            "urlCheck": false,
            "nodeModules": true,
            "useApiHostProcess": false,
            "bundle": true,
            "userConfirmedBundleSwitch": true,
            "packNpmManually": true,
            "packNpmRelationList": [
                {
                    "packageJsonPath": "./package.json",
                    "miniprogramNpmDistDir": "./miniprogram/"
                }
            ],
            ...
        },
        "condition": {
            "plugin": {
                "list": []
            },
            "game": {
                "list": []
            },
            "gamePlugin": {
                "list": []
            },
            "miniprogram": {
                "list": []
            }
        },
        ...
    }
    ```
    
    
    
4. `(c)npm install`

5. 运行`npm run dev`，打包`npm run build`

微信小程序开发工具导入整个包

## 推荐目录结构

```
|- 项目
   |- miniprogram
      |- api
		|- xx.ts
		|- components
		   |- xx
		      |- index.json
		      |- index.ts
		      |- index.wxml
               |- index.wxss
		|- images
		   |- ...
		|- pages
		   |- xx
		      |- xx.json
		      |- xx.ts
		      |- xx.wxml
               |- xx.wxss
               |- components
                  |- xx
		            |- index.json
		            |- index.ts
		            |- index.wxml
		            |- index.wxss
         |- style
            |- page
               |- _xx.scss
            |- components
               |- _xx.scss
            |- _style.scss
            |- page.scss
            |- components.scss
         |- 子包
            |- pages
               |- xx
                  |- xx.json
                  |- xx.ts
                  |- xx.wxml
                  |- xx.wxss
                  |- components
                     |- xx
                        |- index.json
                        |- index.ts
                        |- index.wxml
                        |- index.wxss
             |- style
                |- page
                   |- _xx.scss
                |- page.scss
	|- node_modules
	|- .eslintignore
	|- .eslintrc.js
	|- .gitignore
	|- babel.config.js
	|- gulpfile.js
	|- package.json
	|- project.config.json
	|- project.private.config.json
	|- tsconfig.json
```

**主包/style/_style.scss**：公共样式

**主包/style/page.scss**：存放页面样式集合；**主包/page/**：存放页面样式

```scss
@import './style';
@import './page/*';

```

**主包/style/components.scss**：存放公共组件样式集合；**主包/components/**：存放公共组件样式

```scss
@import './style';
@import './components/*';

```

**主包/style/page/xx/xx.wxss**：`@import '../../style/page.wxss'`

**主包/style/components/xx/index.wxss**：`@import '../../style/page.wxss'`

**分包/style/page.scss**：

```scss
@import '../../style/style';
@import './page/*';

```



**注意**：
	* 文件所在位置都是dist/，所以wxss引用的事dist/中的文件
	* 公共组件在页面的` usingComponents`中起名叫`comp-xx`,只有本页使用的组件起名为`the-xx`