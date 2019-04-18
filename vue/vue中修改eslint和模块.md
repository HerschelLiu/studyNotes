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

