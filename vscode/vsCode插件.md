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

## Flutter

* 运行调试插件：Dart、Flutter
* 代码片段：Flutter Widget Snippets、Awesome Flutter Snippets
* 高亮：Bracket Pair Colorizer
* api提示：flutter-stylizer
* 导包：Pubspec Assist：所有你需要做的就是打开你的pubspec.yaml文件，打开命令面板，选择“pubspec assist：add dependency”并输入你需要的依赖项的名称。您将自动将其添加到pubspec.yaml文件中，更新到最新版本，所有这些都不会留下代码。

## 

## vscode功能补充

* Chinese （Simplified）Language Pack for Visual Studio Code中文

* bookmarks(书签) - visual Studio中的Bookmark能加速代码导航能力。可能有一些代码，需要频繁的相互切换。通常你可能是滚动页面，找到该代码块的。Visual Studio已经提供了通过使用快捷键，非常快速地移动到指定的代码段。这就是代码的书签功能。

* live-server   预览页面（ctrl+F1）  

* vscode-icons 侧栏的图标，对于一个有视觉强迫症的人是必须要的

* TODO Highlight:这个插件能够在你的代码中标记出所有的 TODO 注释，以便更容易追踪任何未完成的业务。在默认的情况下，它会查找 TODO 和 FIXME 关键字。当然，你也可以添加自定义表达式。

* Quokka:Quokka 是一个调试工具插件，能够根据你正在编写的代码提供实时反馈。它易于配置，并能够预览变量的函数和计算值结果。另外，在使用 JSX 或 TypeScript 项目中，它能够开箱即用。 

* 方便调试 Debugger for Chrome

* Path Intellisense ：路径自动补齐(vscode自带有路径补全)

* npm包代码提示 Npm Intellisense 

* vscode-Faker:使用流行的 JavaScript 库 – Faker，能够帮你快速的插入用例数据。Faker 可以随机生成姓名、地址、图像、电话号码，或者经典的乱数假文段落，并且每个类别还包含了各种子类别，你可以根据自身的需求来使用这些数据。 

* SVG Viewer:此插件在 Visual Studio 代码中添加了许多实用的 SVG 程序，你无需离开编辑器，便可以打开 SVG 文件并查看它们。同时，它还包含了用于转换为 PNG 格式和生成数据 URI 模式的选项。

* CSS Peek:使用此插件，你可以追踪至样式表中 CSS 类和 ids 定义的地方。当你在 HTML 文件中右键单击选择器时，选择“ Go to Definition 和 Peek definition ”选项，它便会给你发送样式设置的 CSS 代码。 

* Icon Fonts:这是一个能够在项目中添加图标字体的插件。该插件支持超过 20 个热门的图标集，包括了 Font Awesome、Ionicons、Glyphicons 和 Material Design Icons。

* Change Case:虽然 VSCode 内置了开箱即用的文本转换选项，但其只能进行文本大小写的转换。而此插件则添加了用于修改文本的更多命名格式，包括驼峰命名、下划线分隔命名，snake_case 命名以及 CONST_CAS 命名等。

* **markdownlint** 书写md文件的预览插件

* **View In Browser** 迅速通过浏览器打开html文件

* TODO Tree: Todo 树扩展程序扫描您的源文件以查找Todo标记，并构建其找到的所有引用的树视图，然后您可以单击该treeview项，它将打开并转到相应源文件中的引用。方便您快速找到您想要解决的项目。

* git lens:查看每行代码的修改历史。

* Image preview：光标悬浮在图片路径上时，显示图片预览，这样我们在敲代码的时候一下子就能知道有没有引用了正确的图片或图标。

* Terminal：可以在编辑器底边栏添加一个控制台按钮，便于鼠标快速访问

* Browser Preview：vscode直接预览效果.现在的默认地址确实烦人，每次都要重新输入，这是一个有贞操的程序员所不能忍受的。所以我们按住`ctrl + ,`打开设置，然后找到`Extensions`,再找到`Browser Preview`,找到`Start Url`写上你默认打开的地址就可以了。

* REST Client：vscode中调试接口。简单的使用

  1. 创建一个 `.http`文件

  你可以在任意你喜欢的地方新建一个接口测试文件，

  1. 编写测试接口文件

  最简单的方法，就是直接写上请求方式和要请求的地址，例如下面的就可以请求到我博客首页的数据列表。

  ```
  GET https://apiblog.jspang.com/default/getArticleList  
  ```

  当然你也可以再增加一些内容，让你的请求更标准些。比如加入HTTP传输协议版本，还比如你提交的是一个POST数据表达，你可以要求表达的数据是以`json`的形式提交，你就可以加入下面的代码。

  ```
  GET https://apiblog.jspang.com/default/getArticleList  HTTP/1.1
  
  content-type: application/json
  
  {
      "data":"胖哥是最帅的"
  }
  ```

  1. 发送请求，测试接口

  点击`Send Request`，或者右键选择`Send Request`,都可以发送请求，如果一切顺利就会得到请求的结果。

* koroFileHeader：作为一个有思想有个性的程序员写的代码一定是要有风格的，比如什么`佛祖保佑永无Bug`、`神兽护体`等形式的注释，既有趣又个性。这个插件目前有1300+Star,全五星好评，8万次下载，所以是个非常不错的插件。插件的作用是生成文件头部注释和函数注释。如果你是windows电脑，使用`ctrl+shift+p`键,Mac电脑使用`shift+command+p`键，然后输入`codeDesign`插件里边的图案有`佛祖`、`佛曰`、`美女`、`龙图腾`......等等，你可以下载下来自己测试一下。其实这个"骚注释"只是插件的功能之一，更多的应用是自动根据我们的需求快速生成注释，比如在`test.js`中点击快捷键`ctrl+alt+i`（Windows）,如果你是Mac电脑点击`ctrl+cmd+i`.就会快速生成这样的代码注释(我这里以JS代码注释为例，但这个插件可以支持所有主流语言，支持自定义语言).这时候你会发现这里的`Author`是需要配置的，其实配置这个也非常的容易，我们简单配置一下。在`VSCode`菜单栏点击`File`-`Preferences`-`Settings`-`Extensions`里找到`File header Configuration`，在文件头部模块中(Fileheader)点击`Edit in settings.json`在光标处添加函数注释：windows:`ctrl+alt+t`,mac:"ctrl+cmd+t"

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

* Quokka.js是编辑器中的原型平台，可以访问项目文件，内联报告等。代码中的值在运行时更新

* jump-import：支持网易nej工程，vue工程，快速跳转到你import的文件里面去(无论你是 @还是 pool还是 ../都可以)，并支持跳转nei的mock数据data.json

* JSON to TS：将JSON对象转换为Typescript接口 

* Local History：每次修改保存文件，都会在根目录生成一个`.history`目录，里面是修改的记录,可以修改历史文件的保存路径

* Polacode: 生成代码截图。使用：F1-> 输入Polacode（会在代码右侧出现新标签页） -> 在左侧选中代码 -> 点击Polacode标签页中，图片下方的按钮保存图片

## 

## 颜色相关

* Color Info:这个便捷的插件，将为你提供你在 CSS 中使用颜色的相关信息。你只需在颜色上悬停光标，就可以预览色块中色彩模型的（HEX、 RGB、HSL 和 CMYK）相关信息了。
* **Bracket Pair Colorizer2** 每一对括号用不同颜色区别 （括号强迫症必备）
* **Color Highlight**：在十六进制颜色值添加所代表的颜色的背景

## 摸鱼

* Thief-Book：小说，支持在底部状态栏阅读

## 其他

* HTML Snippets 支持HTML5的标签提示

* Path Autocomplete引入文件时路径提示

* ES6 格式化 JavaScript (ES6) code snippets  

* jquery 自动提示 jQuery Code Snippets

* 检测JS必备 ESLint

* 自动同步修改标签 Auto Rename Tag

* bootstrap必备 Bootstrap 3 Snippets

* vue必备 Vue 2 Snippets

* vue VSCode Snippets：vue 提示

* wepy：minapp（微信小程序标签、属性的智能补全（同时支持原生小程序、mpvue 和 wepy 框架，并提供 snippets）其实只需要这个就好）、vscode wxml（为 VSCode 提供 wxml 语法支持及代码片段）、wechat-snippet、wxml：wxml格式化（其实用vetur就好）

* HTML Boilerplate:通过使用 HTML 模版插件，你就摆脱了为 HTML 新文件重新编写头部和正文标签的苦恼。你只需在空文件中输入 html，并按 Tab 键，即可生成干净的文档结构。 （不需要按，就有）

* Prettier:Prettier 是目前 Web 开发中最受欢迎的代码格式化程序。安装了这个插件，它就能够自动应用 Prettier，并将整个 JS 和 CSS 文档快速格式化为统一的代码样式。如果你还想使用 ESLint，那么还有个 Prettier – Eslint 插件，你可不要错过咯！

* Minify:是一款用于压缩合并 JavaScript 和 CSS 文件的应用程序。它提供了大量自定义的设置，以及自动压缩保存并导出为.min文件的选项。它能够分别通过 uglify-js、clean-css 和 html-minifier，与 JavaScript、CSS 和 HTML 协同工作

* Regex Previewer:这是一个用于实时测试正则表达式的实用工具。它可以将正则表达式模式应用在任何打开的文件上，并高亮所有的匹配项。

* **Beautify** 美化vscode代码

* **cssrem** 将css中的px自动转换为rem.再也不用计算器了（大漠大神推介）

* px-to-vw: px转vw，Alt + Z

* **HTML CSS Support** vscode对html，css文件支持，便于你快速书写属性

* **Vetur** 添加对.vue后缀文件的快速书写支持。

* **language-stylus** CSS预处理器styl后缀文件的识别扩展

* **Easy LESS** :会默认生成css文件到less文件所在的目录。这是插件实现的（我想node.js是必须安装的）。

* canvas-snippets

* Add jsdoc comments：只生成函数的jsDoc注释，function完整的类型

* Document this/Document This Core: 生成jsDoc注释，选中方法 按两次快捷键 ctrl+alt+D 就可以了。这个插件支持 注释比较多，但是只支持html和js文件

* stylus Supremacy：格式化stylue,并进行一下配置: Insert Colons(是否插入冒号),Insert Semicolons(是否插入分号),Insert Braces(是否插入大括号), Insert New Line Around Blocks(两个选择器中是否换行),insertNewLineAroundImports(import之后是否换行)都设置为false;再次格式化时，stylus的风格就不会发现变化了

* PHP IntelliSense(自动补全) + PHP DocBlocker(文档注释) + PHP Debug(代码调试) +  php-cs-fixer (代码格式化): 要在settings.json中配置php.exe的路径,有就改没有就加一个，`"php.validate.executablePath": "C:/phpstudy_pro/Extensions/php/php7.3.4nts/php.exe"`

* github pull requests: 连接github，进行相应操作

* leetcode：如果登陆失败，区网页版登录，然后找到任意一个接口，复制cookie，转到vscode，F1键，找leetcode：sign in by cookie，然后输入邮箱以及cookie

* npm相关

  * npm
  * npm intellisense： 用于在import语句中自动填充npm模块。其实就是npm相关的辅助提示

* TypeScript TSLint Plugin：用于在代码编写阶段检测代码语法准确性，通过编辑tslint.json可以更改默认的配置。配置官方注解地址:https://palantir.github.io/tslint/rules/

* Paste JSON as Code：支持将Json文件生成为对应的模型类，支持的语言有： TypeScript，Python，Go，Ruby，C#，Java，Swift，Rust，Kotlin，C++，Flow，Objective-C，JavaScript，Elm

* JSON Tools：格式化Json文件，再也不用在浏览器上找在线格式化Json文件网站做校验啦~ (注意有文件大小限制，如果json文件太大是不能解析的，具体的阈值是多少忘了

* vscode-fileheader：插入文件头注释，并能自动更新文件修改时间，默认快捷键为 ctrl + alt + i，如果有冲突，到 文件 - 首选项 - 键盘快捷方式中进行修改（下面有更好用的）

* Code Spell Checker：我们日常敲代码很多命名都是使用英文单词，粗心的小伙伴可能会拼错，这个插件就是单词拼写错时的拯救神器，它可以标志错的单词，还可以提示单词的正确拼法。有了它，就再也不用因为单词拼错找半天的 bug 了

* indent-rainbow：写代码的时候，能提示我们的缩进是否到位，每步交替四种不同的颜色，没有到位的话颜色变红，看着代码整整齐齐的就很舒心。

* codelf：变量命名神器

* Better Comments：编写更加人性化的注释，征程使用注释就好，不同样式会变色，比如todo

* any-rule: 正则插件

* Version Lens: 显示package.json文件中每个软件包的最新版本

* javascript Booster: 你有没有怀疑过你写的`JavaScript`代码？如何让自己的代码更专业？VSCode中的`JavaScript Booster`可以快速提升你的代码专业度。插件会帮助你在你写的不合理的地方显示黄色感叹号，单击黄色感叹号后，就会跟我们变成更好的代码。

  

