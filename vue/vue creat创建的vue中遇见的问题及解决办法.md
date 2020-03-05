## vsCode编辑时出现大面积黄色波浪线

这是由于不符合eslint或prettier的规则造成的

解决: 如果选择项为eslint+prettier,使用单独的配置文件

根目录新建`prettier.config.js`文件

```jsx
module.exports = {
    tabWidth: 4, // 每个tab相当于多少个空格（默认2）
    singleQuote: true, // 使用单引号（默认false）
    semi: true // 声明结尾使用分号(默认true)
};
```

我们需要在`.eslintrc.js`中`rules`中中添加，`"prettier/prettier": "error"`，表示被prettier标记的地方抛出错误信息。

## 出现提示`Unexpected console statement.eslint(no-console)`

只是由于不符合eslint的规则造成的

解决:在`.eslintrc.js`中`rules`中添加`"no-console": "off"`(没有rules就新添加一个)

## 出现提示`xxx is defined but never used.eslint(no-unused-vars)`

只是由于不符合eslint的规则: 变量创建但是未使用

解决:在`.eslintrc.js`中`rules`中添加`"no-unused-vars": "off"`(没有rules就新添加一个)