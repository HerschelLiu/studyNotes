启动cmd输入

```bash
# 自定义全局安装路径
npm config set prefix "C:/Program File\nodejs\node_global"
npm config set cache "C:/Program File\nodejs\node_cache"
```

“我的电脑”右键“属性”-“高级系统设置”-“高级”-“环境变量”。进入环境变量对话框，在系统变量下新建"NODE_PATH"，输入”C:\ProgramFiles\nodejs\node_global\node_modules“（自定义全局安装路径）