[Hyper官网](https://hyper.is/)

## 基础配置

​    首先，我们需要配置 Hyper 的字体，shell 等属性，选择 Hyper 的`Preferences`

​    和其他软件常见的`Preferences`不同，`Hyper`是使用`json`。在这里主要关注3个配置项`fontSize、fontFamily、shell`，macOs设置shell为zsh`shell: "zsh"`

`Hyper` 本身是支持插件系统的，在安装扩展插件前，你需要先安装 `Hyper` 命令行程序。你可以点击菜单，选择 `Plugin` 选项，然后点击 `Install Hyper CLI command in PATH`。

## 主题

`Hyper` 做为一个高颜值终端工具，自然就少不了对主题的支持。官方首页推荐了 4 种不同颜色的主题，你可以在官方主题地址 [Hyper的官方主题地址](https://hyper.is/themes)  直接查看并安装。

## 插件配置

[Hyper的官方插件地址](https://hyper.is/plugins)

在plugin选项填写。字段中写入需要的插件名称，然后保存配置文件即可，Hyper 会自动完成插件的安装。

* hyper-snazzy：提供终端颜色主题
* hyper-transparent-dynamic：提供终端窗口毛玻璃半透明效果
  * 窗口透明度调整：在`config`中添加如下代码`hyperTransparentDynamic: {    alpha: 0.5 // 默认 50% 透明度 },`
* hyperpower：安装后每次字符输入都会在光标处迸发出一串小水花
* Hyper-letters：安装后每次字符输入都会在光标处迸发出当前字母
* hyper-search：这个插件主要是可以让你在终端里面按ctrl-f的时候可以搜索。
* hyper-pane：这就是一个增强的多多窗口插件，通过快捷键你可以快速切换窗口。在gif里你可以看到创建窗口和切换窗口的快捷键。
* hyper-launch-menu：从菜单启动多种shell
* hyper-fading-scrollbar：不使用时淡化滚动条
* hyper-quit：关闭最后一个window时退出Hyper
* hyper-opacity：设置不透明度.`config`种新增opacity设置
* hypercwd：cd不同文件夹会新打开基于此文件夹的tab

例如`plugins: ["hyper-snazzy", "hyper-transparent-dynamic"]`

## 其他

### 将文件夹拖进窗口来获取其路径

Hyper 目前无法支持将文件夹拖进窗口来获取其路径，替代解决方案是：在 Finder 中选中文件夹，按下快捷键`command⌘ + option⌥ + C`，即可将该文件夹的路径复制到剪贴板中。在 Hyper 中 `command⌘ + V` 粘贴获取到的路径，回车即可。

### 中文乱码

如果中文乱码问题，打开zshrc文件，最后加上内容：

`export LC_ALL=en_US.UTF-8export LANG=en_US.UTF-8`