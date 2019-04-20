1. 在main.js中引用 rem.js`require('../static/rem') /import '../static/rem'`
2. 加载postcss-pxtorem  `npm install postcss-pxtorem --save-dev`

**配置**

```json
// vue2.0,在.postcssrc.js（没有则新建一个）
"postcss-pxtorem": {
        "rootValue": 20, // 换算的比例
        "propList": ["*"], // 属性的选择器，*表示通用
    	"selectorBlackList:['.ig-']" //忽略的选择器   .ig-  表示 .ig- 开头的都不会转换
    	"replace": true
    }

```

