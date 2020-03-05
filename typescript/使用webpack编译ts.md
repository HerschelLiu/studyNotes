## 全局安装`typescript`

```
npm install -g typescript
```

## 生成`tsconfig.json`文件，位于项目根目录

```
tsc --init
```

## 编辑`tsconfig.json`配置文件，修改如下配置项：

- 指定ECMAScript目标版本

> ```bash
> "target": "es5"
> ```

- 指定生成哪个模块系统代码

> ```bash
> "module": "es6"
> ```

- 编译过程中需要引入的库文件的列表

> 针对不同的项目需求，引入的库文件可能不同。
>
> 
>
> ```bash
> "lib": ["es2015", "dom"]
> ```

- 允许编译javascript文件

> ```bash
> "allowJs": true
> ```

- 设置模块解析策略

> ```bash
> "moduleResolution": "node"
> ```

## 编辑完成后，再安装`webpack`和`webpack-cli`，这两个库建议本地安装，不要全局安装：

```
npm install --save-dev webpack webpack-cli
```

## 由于`webpack`自身只理解`JavaScript`，因此要处理`.ts`文件，我们还要安装`ts-loader`库，并在本地安装`typescript`：

```undefined
npm install --save-dev typescript ts-loader
```

1. 完成上述动作后，接下来在项目根目录创建`webpack.config.js`文件，并编辑它，设置配置属性：



```tsx
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
};
```

## 我们还要编辑`package.json`文件，添加运行`webpack`的脚本：

```
"scripts": {
  "build": "webpack"
},
```

## `npm run build`运行