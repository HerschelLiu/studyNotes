windows命令行工具，在windows商店直接可以下载

## 加入右键菜单

1. 测试后续要用的两个常量是否正常

   ```text
   echo %USERPROFILE%
   
   echo %LOCALAPPDATA%
   ```
   
2. 如果此处没有报错，则后续可直接使用这两个常量.

   否则请手动在后文中进行如下替换:
   ```text
   %USERPROFILE% → C:\Users\[userName]
   %LOCALAPPDATA% → C:\Users\[userName]\AppData\Local
   这里的 [userName] 请换为自己的用户名，比如我的是Bruce。
   ```
   
3. 在命令行中执行如下命令:`mkdir "%USERPROFILE%\AppData\Local\terminal"`

4. 将windows terminal图标复制到目录 `%USERPROFILE%\AppData\Local\terminal`, 该图标在github repo中可以获得 [icons - yanglr](https://link.zhihu.com/?target=https%3A//github.com/yanglr/WindowsDevTools/tree/master/awosomeTerminal/icons)， 就是里面的文件 wt_32.ico

5. 将如下内容另存为`wt.reg`, 然后以"管理员权限"运行

   ```text
   Windows Registry Editor Version 5.00
   
   [HKEY_CLASSES_ROOT\Directory\Background\shell\wt]
   @="Windows terminal here"
   "Icon"="%USERPROFILE%\\AppData\\Local\\terminal\\wt_32.ico"
   
   [HKEY_CLASSES_ROOT\Directory\Background\shell\wt\command]
   @="C:\\Users\\[your_user_name]\\AppData\\Local\\Microsoft\\WindowsApps\\wt.exe"
   ```
   
6. 在windows terminal设置中的`profiles`下的`defaults`加上`"startingDirectory": "."`,就可以右键时在当前页面打开

## 加入git bash

在设置的配置文件的list中加入

```json
{
    "guid": "{b453ae62-4e3d-5e58-b989-0a998ec441b7}",
    "hidden": false,
    "name": "git bash",
    "commandline": "C:\\Program Files\\Git\\bin\\bash.exe",
    "icon": "C:\\Program Files\\Git\\git-icon.png"
},
```

guid值与其他终端不同就行