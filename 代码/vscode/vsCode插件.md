[TOC]



## 美化

### IDE主题

* Atom One Dark Theme :atom主题

* Material Icon Theme： 图标主题

* Vibrancy：毛玻璃效果。安装好主体后，你需要按`F1`键,打开命令输入框，然后输入`Reload Vibrancy`后回车。如果不起作用，你就重新启动一下VSCode.

  需要注意的一点是，这个插件每次更新VSCode就要重新运行`Reload Vibrancy`。这个插件还支持透明度和两款主题样式的设置。设置方法是在VSCode中使用快捷键`Ctrl + ,`,打开设置界面，在左边找到`Extensions` ，然后再找到`Vibrancy Effect`进行设置。

  一共有三项设置：

  - Opacity：透明度设置，这个数值默认为-1，你可以输入自己喜欢的值0-1之间，比如0.8.
  - Theme： 毛玻璃的样式设置，一共有三个样式可选，以后可能还会增加。
  - Type： 这个有很多选项，你可以具体进行测试。

* Windows opacity:透明。现在的透明度可能看片还是有一点问题的，那我们就把透明度调的高一点。在VSCode中使用快捷键`Ctrl + ,`,打开设置界面，在左边找到`Extensions`选项卡，然后找到`Windows opacity`进行设置。

  这里边只有一个设置项，就是`Opacity`，也就是我们要设置的透明度，值从`0-255`,数值越小透明度越高，数值越大透明度越低。我一般摸鱼的透明度在230左右，再小就容易被发现了。
  
* **Dracula Theme Official**

* **Easy icon theme**

* **Monokai Pro**

* **One Dark Pro**

* **SynthWave '84**

### 其他

* **Power Mode**： 编码特效

## Flutter

* 运行调试插件：Dart、Flutter
* 代码片段：Flutter Widget Snippets、Awesome Flutter Snippets
* 高亮：Bracket Pair Colorizer
* api提示：flutter-stylizer
* 导包：Pubspec Assist：所有你需要做的就是打开你的pubspec.yaml文件，打开命令面板，选择“pubspec assist：add dependency”并输入你需要的依赖项的名称。您将自动将其添加到pubspec.yaml文件中，更新到最新版本，所有这些都不会留下代码。

## JSON

* **Paste JSON as Code**：支持将Json文件生成为对应的模型类，支持的语言有： TypeScript，Python，Go，Ruby，C#，Java，Swift，Rust，Kotlin，C++，Flow，Objective-C，JavaScript，Elm
* **JSON to TS**：将JSON对象转换为Typescript接口 
* **RAW to TS**

## COCOS

* **Cocos Effect**
* **Cocos Debug**
* **cocos-creator**

## Docker

* **Docker**

* **Dev Containers**

## 注释

* **koroFileHeader**：作为一个有思想有个性的程序员写的代码一定是要有风格的，比如什么`佛祖保佑永无Bug`、`神兽护体`等形式的注释，既有趣又个性。这个插件目前有1300+Star,全五星好评，8万次下载，所以是个非常不错的插件。插件的作用是生成文件头部注释和函数注释。如果你是windows电脑，使用`ctrl+shift+p`键,Mac电脑使用`shift+command+p`键，然后输入`codeDesign`插件里边的图案有`佛祖`、`佛曰`、`美女`、`龙图腾`......等等，你可以下载下来自己测试一下。其实这个"骚注释"只是插件的功能之一，更多的应用是自动根据我们的需求快速生成注释，比如在`test.js`中点击快捷键`ctrl+alt+i`（Windows）,如果你是Mac电脑点击`ctrl+cmd+i`.就会快速生成这样的代码注释(我这里以JS代码注释为例，但这个插件可以支持所有主流语言，支持自定义语言).这时候你会发现这里的`Author`是需要配置的，其实配置这个也非常的容易，我们简单配置一下。在`VSCode`菜单栏点击`File`-`Preferences`-`Settings`-`Extensions`里找到`File header Configuration`，在文件头部模块中(Fileheader)点击`Edit in settings.json`在光标处添加函数注释：windows:`ctrl+alt+t`,mac:"ctrl+cmd+t"

  ```json
  {
      "fileheader.configObj": {
  
      },
      "fileheader.customMade": {
          "Author": "技术胖",
          "Date": "Do not edit", // 文件创建时间(不变)
          "LastEditors": "技术胖", // 文件最后编辑者
          "LastEditTime": "Do not edit", // 文件最后编辑时间
          "FilePath": "Do not edit" ,// 增加此项配置即可
      } 
  
  
  }
  ```

  * **Nested Comments**：嵌套注释
    * mac: **<kbd>cmd + option + /</kbd>
    * Windows: **<kbd>ctrl + alt + /</kbd>
    * 自定义: **<kbd>cmd + option + /</kbd>

## 前端

### 格式化相关

* **Prettier**: Prettier 是目前 Web 开发中最受欢迎的代码格式化程序。安装了这个插件，它就能够自动应用 Prettier，并将整个 JS 和 CSS 文档快速格式化为统一的代码样式。如果你还想使用 ESLint，那么还有个 **Prettier – Eslint **插件，你可不要错过咯！
* **cssrem** 将css中的px自动转换为rem.再也不用计算器了

### 预编译器

* **language-stylus** CSS预处理器styl后缀文件的识别扩展
* **stylus Supremacy**：格式化stylue,并进行一下配置: Insert Colons(是否插入冒号),Insert Semicolons(是否插入分号),Insert Braces(是否插入大括号), Insert New Line Around Blocks(两个选择器中是否换行),insertNewLineAroundImports(import之后是否换行)都设置为false;再次格式化时，stylus的风格就不会发现变化了
* **SCSS Formatter**
* **Sass (.sass only)**
* **PostCSS Language Support**
* **Stylelint **： 是一个强大、先进的 CSS 代码检查器（linter），可以帮助你规避 CSS 代码中的错误并保持一致的编码风格。
* **stylus**
* **Tailwind CSS IntelliSense**
* **UnoCSS**

### react

* **ES7+ React/Redux/React-Native snippets**: react 代码片段
* **Simple React Snippets**
* **React Native Tools**

### vue

* **Vue Extension Box**（vue3）：插件合集包，包括：Path Intellisense、Auto Close Tag、Auto Rename Tag、Sass (.sass only)、SCSS Formatter、Prettier - Code formatter、ESLint、Vue - Official

* **Vue - Official**: vue3
* **Vetur** vue2。
* **Element Plus Snippets**
* **Vant Snippets**
* **Vue 3 Support - All In One**：  Vue 2/3 代码片段 语法高亮 格式化插件。你可以在 VS Code 编辑器底部栏右下角打开 `Auto Format Vue` 开关，它可能帮你在代码保存的时候自动格式化 `vue` 文件的格式，默认是关闭状态。
* **Vite**

### 小程序

#### 微信

* **小程序助手**： 作者debian001
* **Wechat-Extension-Pack**： 包含WXML - Language Service
* **wechat-snippet**

#### 字节跳动

* **tt-miniapp**

#### UNIAPP

* **UNIAPP**：

  * **uni-app-schemas**

  * **uni-app-snippets**

  * **uni-cloud-snippets**

  * **uni-helper**

  * **uni-highlight**

  * **uni-ui-snippets**

#### Taro

* **taro-api-snippets**



### Tailwind

* **Tailwind CSS IntelliSense**: 提示插件

### ES6

* ES6 格式化 JavaScript (ES6) code snippets  
* 检测JS必备 ESLint

### 类型相关

* **JSDoc Annotation**

* **JavaScript and TypeScript Nightly**

### NPM

* **npm intellisense**： 用于在import语句中自动填充npm模块。其实就是npm**相关的辅助提示**
* **NPM Browser**

### Astro

* **Astro**

## vscode功能补充

* **Dyno File Utils**：通过 vscode 的命令操作文件

* **bookmarks(书签)** - visual Studio中的Bookmark能加速代码导航能力。可能有一些代码，需要频繁的相互切换。通常你可能是滚动页面，找到该代码块的。Visual Studio已经提供了通过使用快捷键，非常快速地移动到指定的代码段。这就是代码的书签功能。

* 路径跳转：

  * **别名路径跳转**: 作者lihuiwang
  * **jump-import**：支持网易nej工程，vue工程，快速跳转到你import的文件里面去(无论你是 @还是 pool还是 ../都可以)，并支持跳转nei的mock数据data.json

* **驼峰翻译助手**： 作者svenzhao

* **TODO Highlight**: 这个插件能够在你的代码中标记出所有的 TODO 注释，以便更容易追踪任何未完成的业务。在默认的情况下，它会查找 TODO 和 FIXME 关键字。当然，你也可以添加自定义表达式。

* **TODO Tree**: Todo 树扩展程序扫描您的源文件以查找Todo标记，并构建其找到的所有引用的树视图，然后您可以单击该treeview项，它将打开并转到相应源文件中的引用。方便您快速找到您想要解决的项目。

* **#region**：在 VS Code 中，可以使用 *#region* 和 *#endregion* 注释来定义一个可折叠的代码区域。

  * **#region folding for VS Code**: 此插件对`// #region`提供更好的支持
  * **region-generator**: 自动生成*#region*注释，选中文本后，按下快捷键`Ctrl+Shift+/`（Mac: `Cmd+Shift+/`）(自定义改为了**<kbd>ctrl + shift + cmd + /</kbd>)
  * **Region Highlighter**: 高亮region.通过`Ctrl+Shift+P`执行命令`Region Highlighter: Mark Region`配置颜色

  > 注意，在#region部分没有折叠标记：设置：Editor: Folding Strategy设置为auto

  

* **vscode-icons** 侧栏的图标，对于一个有视觉强迫症的人是必须要的

* **live-server **  预览页面（ctrl+F1）  

* **Quokka**:Quokka 是一个调试工具插件，能够根据你正在编写的代码提供实时反馈。它易于配置，并能够预览变量的函数和计算值结果。另外，在使用 JSX 或 TypeScript 项目中，它能够开箱即用。 

* 方便调试 Debugger for Chrome

* **Path Intellisense** ：路径自动补齐(vscode自带有路径补全)

* **vscode-Faker**：使用流行的 JavaScript 库 – Faker，能够帮你快速的插入用例数据。Faker 可以随机生成姓名、地址、图像、电话号码，或者经典的乱数假文段落，并且每个类别还包含了各种子类别，你可以根据自身的需求来使用这些数据。 

* **SVG Viewer**:此插件在 Visual Studio 代码中添加了许多实用的 SVG 程序，你无需离开编辑器，便可以打开 SVG 文件并查看它们。同时，它还包含了用于转换为 PNG 格式和生成数据 URI 模式的选项。

* **CSS Peek**:使用此插件，你可以追踪至样式表中 CSS 类和 ids 定义的地方。当你在 HTML 文件中右键单击选择器时，选择“ Go to Definition 和 Peek definition ”选项，它便会给你发送样式设置的 CSS 代码。 

* **View In Browser** 迅速通过浏览器打开html文件

* **Lorem ipsum**： 生成随机数据

* **Chinese Lorem**: 生成中文随机数据

* **git lens**:查看每行代码的修改历史。

* **Image preview**：光标悬浮在图片路径上时，显示图片预览，这样我们在敲代码的时候一下子就能知道有没有引用了正确的图片或图标。

* **Terminal**：可以在编辑器底边栏添加一个控制台按钮，便于鼠标快速访问

* **Browser Preview**：vscode直接预览效果.现在的默认地址确实烦人，每次都要重新输入，这是一个有贞操的程序员所不能忍受的。所以我们按住`ctrl + ,`打开设置，然后找到`Extensions`,再找到`Browser Preview`,找到`Start Url`写上你默认打开的地址就可以了。

* Polacode**: 生成代码截图。使用：F1-> 输入Polacode（会在代码右侧出现新标签页） -> 在左侧选中代码 -> 点击Polacode标签页中，图片下方的按钮保存图片

* **any-rule**：正则表达式

* **Regex Previewer**： 正则预览

* **DotENV**

* **Error Lens**: 代码行错误提示

* **Microsoft Edge Tools for VS Code**

* **open in browser**：打开网页到浏览器

* **Shader lanaguages support for VS code**： 对 ShaderLab、CG/HLSL 等语法进行高亮显示，帮助开发者快速识别代码结构、代码自动补全

## Git

* **Git Graph** - mhutchie： 该插件提供了`可视化存储库并跟踪所有正在进行的工作`
* **Git History** - donjayamanne：该插件提供了`确定对文件的影响最大的更改以及由谁进行的更改`在当前文件下，使用 `cmd+shift+p/ctrl+shift+p` 输入 `file history` (<kbd>option + h</kbd>)即可得到右侧见历史提交信息
* **GitHub Pull Requests**： 会在插片商店同级有切换
* **GitHub Repositories*预览版***
* **GitLens — Git supercharged**付费。不要

## Java

* **Extension Pack for Java**

## Go

* **Go**

## Python

* **Python Extension Pack**： 包含Python、Python Environment Manager (deprecated)、IntelliCode、Django、Python Indent、autoDocstring - Python Docstring Generator、Jinja

* **Python Snippets**
* **Python Debugger**
* **Python Test Explorer for Visual Studio Code**: 单元测试
* **Python Preview**：它将调试代码转换为包含动画和图形元素的交互式会话，以表示应用程序状态
* **Python Type Hint**： 我们可以把 Python 的 Type Hints 想象成 JavaScript 的 TypeScript。Python Type Hint 为内置类型、预估类型、typing 模块提供类型提示补全目录。此外，它还可以在工作区中搜索 Python 文件以进行类型估计。
* **Jupyter**： upyter Notebook 现已成为[数据分析](https://cloud.tencent.com/product/bi?from_column=20065&from=20065)、[机器学习](https://cloud.tencent.com/product/ti?from_column=20065&from=20065)的必备工具，因为它可以让数据分析师集中精力向用户解释整个分析过程。除了 Python 之外，Jupyter Notebook 还可以支持 Java、R、Julia 和其他流行的编程语言。VS Code Python 插件已提供了对 Jupyter Notebook 的本地支持。

## PHP

* **PHP Extension Pack**
* **PHP IntelliSense**： 作者：Damjan Cvetko

## 颜色相关

* **Color Info**:这个便捷的插件，将为你提供你在 CSS 中使用颜色的相关信息。你只需在颜色上悬停光标，就可以预览色块中色彩模型的（HEX、 RGB、HSL 和 CMYK）相关信息了。
* **Bracket Pair Colorizer2** 每一对括号用不同颜色区别 （括号强迫症必备）
* **Color Highlight**：在十六进制颜色值添加所代表的颜色的背景

## markdown

* **AZ AL Dev Tools/AL Code Outline**: 可以随时查看文档结构
* **markdownlint** 书写md文件的预览插件
* **Markdown All in One**

## 摸鱼

* **Thief-Book**：小说，支持在底部状态栏阅读
* **Cloudmusic**

## 其他

* **Auto Rename Tag**自动同步修改标签 

* **Auto Close Tag**

* **Auto Import**

* **Regex Previewer**:这是一个用于实时测试正则表达式的实用工具。它可以将正则表达式模式应用在任何打开的文件上，并高亮所有的匹配项。

* **PHP IntelliSense(自动补全) + PHP DocBlocker(文档注释) + PHP Debug(代码调试) +  php-cs-fixer (代码格式化)**: 要在settings.json中配置php.exe的路径,有就改没有就加一个，`"php.validate.executablePath": "C:/phpstudy_pro/Extensions/php/php7.3.4nts/php.exe"`

* **github pull requests**: 连接github，进行相应操作

* **leetcode**：如果登陆失败，区网页版登录，然后找到任意一个接口，复制cookie，转到vscode，F1键，找leetcode：sign in by cookie，然后输入邮箱以及cookie

* **indent-rainbow**：写代码的时候，能提示我们的缩进是否到位，每步交替四种不同的颜色，没有到位的话颜色变红，看着代码整整齐齐的就很舒心。

* **codelf**：变量命名神器

* **Better Comments**：编写更加人性化的注释，征程使用注释就好，不同样式会变色，比如todo

* **any-rule**: 正则插件

* **Version Lens**: 显示package.json文件中每个软件包的最新版本

* **Code Runner**

* （用不上）**waldo's CRS AL Language Extension**：是专为 Microsoft Dynamics 365 Business Central（基于 AL 语言）开发者设计的 Visual Studio Code 插件，旨在提升 AL 语言开发效率，优化代码质量，并深度集成 Dynamics 365 开发流程。以下是其核心用途和功能：

  

