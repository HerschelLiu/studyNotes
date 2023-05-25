## 下载插件

下载debugger for chrome插件

## 切换到debugger模式

点击左侧像蜘蛛一样的图标，然后点击齿轮，选择chrome，之后会得到下面这个文件

```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:8080",
            "webRoot": "${workspaceFolder}/index.html"
        }
    ]
}
```

默认url如果打开网页显示打不开，就右键运行open whith live server(安装了live server的话)，复制地址栏的的地址`http://127.0.0.1:5500`，之后运行就可以了，如果控制台打印错误
(Error processing "setBreakpoints": Error: Could not resolve breakpoint): 需要再次检验项目是否开启sourcemap。

# attach的开启

该模式是基于已开启浏览器窗口的监听，在配置上url 一定是当前浏览器显示的路径,否则启动时会报错，要开启chrome浏览器的远程调试端口，找到chrome浏览器快捷方式所在的文件夹 在目标一栏末尾添加一个空格后 在加入 --remote-debugging-port=9222，注意端口要和配置的一致

点击确定后 重启浏览器，请直接双击配置好的快捷方式,其他地方的快捷方式可能为何其产生关联从而导致程序失效，报如下错误`Cannot connect to runtime...`