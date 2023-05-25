* 修改模块在package.json中的dependencies或devDependencies区域
* 修改eslint规则在.eslintrc.js中的rules区域

```json
rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'indent': 'off',
      'semi': 'off'
  }
```

* 常用修改的规则 

  ```json
  // 0/'off'为关闭 ，1/'warn'开启这个规则检查并提示（不影响退出状态）,2/'error'开启规则检查并报错
  {
      'indent': 'off' // 缩进
      'space-before-function-paren': 0, // 匿名函数function关键字后或函数名后，'()'之前是否有空格，
      // ['error', 
      	// 'always' 默认，总是显示
      	// 'named' 函数名之后才有空格
      	// 'never' 不管怎样都没有
  	// ]
      'quotes': [
            'error',
            'single'       // 改成字符串必须由单引号括起来而不是双引号，'string'不报错，"string"报错
        ],
  	'semi': 0, // 末尾是否有分号,
  	'no-trailing-spaces': 0, // 是否允许语句之间有空行
  }
```
  
  