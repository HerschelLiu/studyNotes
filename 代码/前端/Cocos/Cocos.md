## 脚本基础

[Cocos Creator 3.8 手册 - 配置代码编辑环境](https://docs.cocos.com/creator/manual/zh/scripting/coding-setup.html)

### VS Code扩展使用

可以在终端运行`curl`如果提示 `curl: try 'curl --help' or 'curl --manual' for more information`则代表支持，反之需要安装[Cocos Creator 3.8 手册 - 配置代码编辑环境](https://docs.cocos.com/creator/manual/zh/scripting/coding-setup.html#安装-curl)

### 添加 VS Code 编译任务

要在 VS Code 中激活脚本编译，需要执行以下步骤：

1. 在 Creator 顶部菜单栏点击 **开发者（Developer） -> VS Code Workflow -> 添加编译任务（AddCompile Task）**，该操作会在项目目录的 `.vscode` 文件夹下添加 `tasks.json` 任务配置文件。
2. 在 VS Code 里按下快捷键 Cmd/Ctrl + P，激活 **快速打开** 输入框，然后输入 `task CocosCreator compile`，选择 `Cocos Creator compile`。然后选择输出类型
3. 任务运行完成，会在 VS Code 窗口下方的输出面板中显示结果（根据 VS Code 版本及配置的不同，输出结果也会有所差异）。

> 第2步命令不是常驻任务，是一次性的，也就是说，如果你再次改动了脚本，想要直接去浏览器查看，就得再来一遍。解决方式：
>
> 1. 在vsode插件市场查找插件：**Run on Save**（作者pucelle）
>
> 2. 安装完后，在`.vscode`目录下新增`settings.json`文件，如果有这个文件就不用新建了。往该文件插入一下内容：
>
>    ```json
>    {
>      "runOnSave.statusMessageTimeout": 3000,
>      "runOnSave.commands": [
>        {
>          // Match scss files except names start with `_`.
>          "match": ".*\\.ts$",
>          "command": "curl http://localhost:7456/asset-db/refresh",// 自行去自己项目中的tasks.json文件中，找到args对应的那个地址，替换
>          "runIn": "terminal"
>        }
>      ]
>    }
>    ```
>
> 3. 此时，重启下vscode，我建议是重启，因为配置文件的更新不确定vscode能否动态检测到！重启后，我们去改动项目的ts脚本文件，保存后就会触发预览项目的更新，建议是第一次预览再Cocos Creator面板中操作，然后剩下的脚本改动就正常使用了。

### 使用VS Code调试网页游戏

需要安装

* 谷歌浏览器(type为chrome)/Microsoft Edge（插件Microsoft Edge Tools for VS Code；type为msedge活pwa-msedge。）
* JavaScript Debugger

1. 接下来在 Cocos Creator 顶部菜单栏中点击 **开发者（Developer） -> VS Code 工作流（VS Code Workflow） -> Add  Chrome Debug Settings**，这个菜单命令会在项目文件夹下添加一个 `.vscode/launch.json` 文件作为调试器的配置
2. 之后便可以在 VS Code 中点击左侧栏的 **调试** 按钮打开调试面板，并在最上方的调试配置中选择 `Cocos Creator Launch Chrome against localhost`，然后点击左侧绿色的开始按钮进行调试。

### VS Code插件

* Cocos Effect