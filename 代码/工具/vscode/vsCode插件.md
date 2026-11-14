# vsCode插件

> 按「用途 → 插件」组织，条目格式统一为 `- **插件名**：用途 / 配置`。
> 快捷键汇总见 [常用快捷键.md](./常用快捷键.md)，团队统一推荐见 [团队安装项目推荐的vscode插件.md](./团队安装项目推荐的vscode插件.md)。

## 目录

- [外观](#外观)
- [注释与标记](#注释与标记)
- [通用效率](#通用效率)
- [前端](#前端)
- [语言与框架](#语言与框架)
- [工程与协作](#工程与协作)
- [摸鱼](#摸鱼)
- [不必安装 / 已弃用](#不必安装--已弃用)

## 外观

### 编辑器主题

- **Catppuccin for VSCode**：低饱和马卡龙配色，含 Latte、Frappé、Macchiato、Mocha 四套变体。
- **Gradient Theme**：暗色渐变主题。
  - 开启渐变：`⌘/Ctrl + Shift + P` → `Gradient Theme: Enable Gradient`
  - 关闭渐变：`⌘/Ctrl + Shift + P` → `Gradient Theme: Disable Gradient`
- **Atom One Dark Theme**：Atom 经典 One Dark 配色。
- **One Dark Pro**：同为 One Dark 风格，维护活跃、可调项更多。
- **Dracula Theme Official**：德古拉暗色主题。
- **Monokai Pro**：Monokai 增强版，配色精致（收费）。
- **SynthWave '84**：霓虹复古风，可配合自定义 CSS 开启发光字体。

### 图标主题

- **Material Icon Theme**：Material Design 风格的文件 / 文件夹图标。
- **vscode-icons**：侧栏图标包，视觉强迫症必备。
- **Easy icon theme**：轻量图标主题。

### 透明与毛玻璃

- **Vibrancy**（仅 macOS）：毛玻璃效果。
  - 安装后按 `F1` → 输入 `Reload Vibrancy` 回车；不生效则重启 VS Code。
  - 注意：VS Code 每次更新后都要重新执行一次 `Reload Vibrancy`。
  - 设置：`⌘ + ,` → `Extensions` → `Vibrancy Effect`，共三项。
    - `Opacity`：透明度，默认 `-1`，可填 `0~1`（如 `0.8`）。
    - `Theme`：毛玻璃样式，目前 3 种。
    - `Type`：效果类型，选项较多，按需试。
- **Windows opacity**（仅 Windows）：窗口整体透明。
  - 设置：`Ctrl + ,` → `Extensions` → `Windows opacity` → `Opacity`
  - 取值范围 `0~255`，数值越小越透明。摸鱼建议 `230` 左右，再低容易被发现。

### 编码特效

- **Power Mode**：敲代码时的爆炸、抖动特效，纯娱乐。

## 注释与标记

### 文件头 / 函数注释

- **koroFileHeader**：自动生成文件头注释与函数注释，支持所有主流语言及自定义语言；附带 `佛祖保佑`、`佛曰`、`美女`、`龙图腾` 等「骚注释」图案（命令面板输入 `codeDesign`）。

  快捷键（Windows / Mac）：

  - 文件头部注释：`Ctrl + Alt + I` / `Ctrl + Cmd + I`
  - 函数注释：`Ctrl + Alt + T` / `Ctrl + Cmd + T`

  配置 `Author` 等字段：`File` → `Preferences` → `Settings` → `Extensions` → `File header Configuration` → `Fileheader` → `Edit in settings.json`，在 `fileheader.customMade` 中修改：

  ```json
  {
    "fileheader.customMade": {
      "Author": "你的名字",
      "Date": "Do not edit",
      "LastEditors": "你的名字",
      "LastEditTime": "Do not edit",
      "FilePath": "Do not edit"
    }
  }
  ```

### 嵌套注释

- **Nested Comments**：支持在注释里再嵌套注释。
  - Mac：`Cmd + Option + /`
  - Windows：`Ctrl + Alt + /`

### TODO 与高亮

- **TODO Highlight**：高亮代码中的 `TODO`、`FIXME`，可自定义关键字与表达式。
- **TODO Tree**（已不再更新，使用Better Todo Tree）：扫描并汇总项目内所有 TODO，生成树视图，点击直接跳转到源码位置。
- **Better Comments**：给注释分类型着色，写出更易读的注释。
  - `!` Alert 警告
  - `?` Queries 疑问
  - `TODO` 待办
  - `//` Highlights 重点

### 折叠标记（#region）

在源码中用 `// #region` 与 `// #endregion` 注释划定可折叠区域。

- **#region folding for VS Code**：为 `// #region` 提供更好的折叠支持。
- **region-generator**：选中文本后自动生成 `#region` 注释，快捷键 `Ctrl + Shift + /`（Mac：`Cmd + Shift + /`；本机自定义为 `Ctrl + Shift + Cmd + /`）。
- **Region Highlighter**：高亮 region，`⌘/Ctrl + Shift + P` → `Region Highlighter: Mark Region` 配置颜色。

> 若 `#region` 没有折叠：把设置 `Editor: Folding Strategy` 改为 `auto`。

## 通用效率

### 编辑辅助

- **Dyno AIO**（`dynonguyen.dyno-aio`）：通过命令面板执行文件操作。前身 Dyno File Utils 已弃用。
  - `dyno.indentRainbow.enabled`：缩进彩虹，建议关掉。
  - `dyno.quitControl.enabled`：退出控制，针对 `⌘Q`、`⌘W`、`⌘⇧W` 弹确认框，防止误关。
- **Auto Rename Tag**：改开始标签时自动同步结束标签。
- **Auto Close Tag**：自动补全闭合标签。
- **Auto Import**：自动导入 TypeScript / JS 模块。
- **Error Lens**：把错误、警告直接显示在对应代码行尾。
- **indent-rainbow**：用四种颜色交替标识缩进层级，缩进不到位时变红。
- **Dot Log**：选中变量后输入 `.log`，自动展开为 `console.log(变量)`。
- **驼峰翻译助手**（作者 svenzhao）：中英互译并转驼峰，解决命名困难。
- **codelf**：变量命名搜索 / 推荐。
- **Terminal**：在编辑器底部栏加一个终端按钮，鼠标一键打开控制台。
- **Version Lens**：在 `package.json` 中直接显示每个依赖的当前版本与最新版本。
- **Iconify IntelliSense**：光标悬停图标名时直接预览图标。

### 导航与跳转

- **bookmarks**：代码书签，快速在常用代码块之间切换（对标 Visual Studio 的 Bookmark）。
- **别名路径跳转**（作者 lihuiwang）：让 `@/xxx` 之类的路径别名可以 `⌘/Ctrl + 点击` 跳转。
- **jump-import**：支持网易 NEJ 工程、Vue 工程，`@`、`pool`、`../` 等写法都能跳到 import 的源文件，也支持跳转 NEJ 的 mock 数据 `data.json`。
- **Path Intellisense**：路径自动补全。新版 VS Code 已内置，一般无需再装。
- **CSS Peek**：在 HTML 中右键选择器 → `Go to Definition` / `Peek Definition`，直接查看对应 CSS 类或 id 的定义。

### 正则

- **any-rule**：常用正则速查 / 插入。
- **Regex Previewer**：实时测试正则，在当前文件上高亮全部匹配项。

### 颜色

- **Color Info**：光标悬停颜色值时，预览色块并显示 HEX、RGB、HSL、CMYK。
- **Color Highlight**：给十六进制颜色值加上对应颜色的背景。

### 假数据

- **vscode-Faker**：基于 Faker 快速插入测试数据，可生成姓名、地址、图片、电话、乱数假文等，分类细。
- **Lorem ipsum**：生成英文假文。
- **Chinese Lorem**：生成中文假文。

### 预览

- **live-server**：起本地服务实时预览页面（`Ctrl + F1`）。
- **open in browser** / **View In Browser**：把 HTML 文件快速丢到浏览器打开。
- **Browser Preview**：在 VS Code 内嵌浏览器里预览。
  - 默认地址每次都要重新输入：`⌘/Ctrl + ,` → `Extensions` → `Browser Preview` → `Start Url` 填默认地址。
- **Microsoft Edge Tools for VS Code**：Edge 调试与元素检查。
- **SVG Viewer**：直接打开并查看 SVG，支持转 PNG、生成 Data URI。
- **Image preview**：光标悬停图片路径时显示预览，快速确认引用是否正确。

### 运行与调试

- **Code Runner**：一键运行单文件代码片段，支持多语言。
- **Quokka**：JS / TS 实时求值，边写边看变量、函数返回值，JSX 与 TS 项目开箱即用。
- **Debugger for Chrome**：调试浏览器里的代码。已被内置 JS 调试器取代，无需安装。
- **Redth.mobile-canvas**：在 Mobile Canvas 编辑器里直接跑 iOS、Android App。

## 前端

### 格式化与 Lint

- **Prettier**：目前 Web 开发最流行的代码格式化器，可把整份 JS / CSS 统一成一致的风格。
- **Prettier – ESLint**：同时用 Prettier 和 ESLint 时选它，避免两者打架。
- **ESLint**：JS / TS 代码检查必备。
- **Stylelint**：强大的 CSS 检查器，规避错误并统一风格。
- **Pretty TypeScript Errors**：把 TypeScript 的类型错误排版得更易读。
- **cssrem**：把 CSS 里的 `px` 自动换算成 `rem`，不用再开计算器。

### 样式与预处理器

- **language-stylus**：识别 `.styl` 后缀。
- **stylus**：Stylus 语言支持。
- **stylus Supremacy**：格式化 Stylus。
  - 建议把 `Insert Colons`、`Insert Semicolons`、`Insert Braces`、`Insert New Line Around Blocks`、`insertNewLineAroundImports` 全部设为 `false`，再次格式化时风格才不会被改动。
- **SCSS Formatter**：格式化 SCSS。
- **Sass (.sass only)**：缩进式 `.sass` 语法支持。
- **PostCSS Language Support**：PostCSS 语法支持。
- **CSS Modules**：CSS Modules 支持（类名补全、跳转）。
- **CSS Var Complete**：CSS 变量智能感知。

### Tailwind / UnoCSS

- **Tailwind CSS IntelliSense**：Tailwind 类名补全、悬浮预览、Lint。
- **UnoCSS**：UnoCSS 类名补全与提示。

### React

- **ES7+ React/Redux/React-Native snippets**：React 生态代码片段。
- **Simple React Snippets**：更轻量的 React 片段。
- **React Native Tools**：RN 调试与运行支持。

### Vue

- **Vue - Official**（原 Volar）：Vue 3 官方支持，TS、模板类型检查、格式化一体。
- **Vetur**：Vue 2 支持。Vue 3 项目请改用 Vue - Official。
- **Vue Extension Box**：Vue 3 插件合集，含 Auto Close Tag、Auto Rename Tag、Sass (.sass only)、SCSS Formatter、Prettier、ESLint、Vue - Official 等（包内的 Path Intellisense 已非必需）。
- **Vue 3 Support - All In One**：Vue 2/3 代码片段、语法高亮、格式化。
  - 编辑器右下角可打开 `Auto Format Vue` 开关，保存时自动格式化 `.vue`（默认关闭）。
- **Element Plus Snippets**：Element Plus 组件片段。
- **Vant Snippets**：Vant 组件片段。
- **Vite**：Vite 配置与命令支持。

### 小程序

#### 微信

- **小程序助手**（作者 debian001）：小程序开发辅助。
- **Wechat-Extension-Pack**：微信小程序插件合集，含 WXML - Language Service。
- **wechat-snippet**：WXML / WXSS 代码片段。

#### 字节跳动

- **tt-miniapp**：字节小程序开发支持。

#### uni-app

- **uni-app-schemas**：`pages.json`、`manifest.json` 校验与补全。
- **uni-app-snippets**：uni-app API 片段。
- **uni-cloud-snippets**：uniCloud 片段。
- **uni-helper**：uni-app 辅助增强。
- **uni-highlight**：uni-app 语法高亮。
- **uni-ui-snippets**：uni-ui 组件片段。

#### Taro

- **taro-api-snippets**：Taro API 片段。

### JS / TS

- **JavaScript (ES6) code snippets**：ES6 代码片段。
- **JSDoc Annotation**：JSDoc 注释辅助。
- **JavaScript and TypeScript Nightly**：尝鲜最新 TypeScript 引擎。

### NPM

- **npm intellisense**：在 `import` 语句中自动补全依赖名。
- **NPM Browser**：在编辑器内浏览 npm 包信息。

### Astro

- **Astro**：Astro 官方支持。

## 语言与框架

### Flutter / Dart

- **Dart**、**Flutter**：运行与调试。
- **Flutter Widget Snippets**：Widget 片段。
- **Awesome Flutter Snippets**：更全的 Flutter 片段。
- **flutter-stylizer**：Flutter 代码自动整理。
- **Pubspec Assist**：加依赖不用手写 `pubspec.yaml`。
  - 用法：打开 `pubspec.yaml` → 命令面板 → `Pubspec Assist: Add dependency` → 输入依赖名，自动写入并更新到最新版本。

### Python

- **Python Extension Pack**：含 Python、IntelliCode、Django、Python Indent、autoDocstring、Jinja 等（其中 Python Environment Manager 已弃用）。
- **Python Snippets**：常用片段。
- **Python Debugger**：调试器。
- **Python Test Explorer for Visual Studio Code**：单元测试。
- **Python Preview**：把调试过程转成带动画和图解的交互式会话，直观展示程序状态。
- **Python Type Hint**：为内置类型、typing 模块提供类型提示补全，并可在工作区中推断类型（类比 TS 的类型系统）。
- **Jupyter**：Notebook 支持（Python 扩展已内置），数据分析、机器学习的常用形态，也支持 Java、R、Julia 等内核。

### Java

- **Extension Pack for Java**：Java 开发全家桶。

### Go

- **Go**：官方 Go 语言支持。

### PHP

- **PHP Extension Pack**：PHP 开发基础包。
- **PHP IntelliSense**（作者 Damjan Cvetko）：补全、跳转、重构。
- **PHP DocBlocker**：文档注释。
- **PHP Debug**：Xdebug 调试。
- **php-cs-fixer**：代码格式化。

  需在 `settings.json` 里配好 `php.exe` 路径，已有就改、没有就加：

  ```json
  {
    "php.validate.executablePath": "C:/phpstudy_pro/Extensions/php/php7.3.4nts/php.exe"
  }
  ```

### Cocos

- **Cocos Effect**：Effect 着色器语法支持。
- **Cocos Debug**：调试。
- **cocos-creator**：Cocos Creator 支持。

### AL（Dynamics 365 Business Central）

- **AZ AL Dev Tools / AL Code Outline**：随时查看 AL 文件的结构大纲。
- **waldo's CRS AL Language Extension**：AL 语言开发辅助。（用不上）

### Shader

- **Shader languages support for VS Code**：ShaderLab、CG/HLSL 等语法高亮与补全。

### JSON 转类型

- **Paste JSON as Code**：把 JSON 直接生成模型类，支持 TypeScript、Python、Go、Ruby、C#、Java、Swift、Rust、Kotlin、C++、Flow、Objective-C、JavaScript、Elm。
- **JSON to TS**：把 JSON 对象转成 TypeScript 接口。
- **RAW to TS**：JSON → TS 类型。

### Markdown

- **Markdown All in One**：快捷键、目录、列表自动续写等一站式增强。
- **markdownlint**：Markdown 规范检查。

## 工程与协作

### Git

- **Git Graph**（mhutchie）：图形化查看仓库分支与提交流转。
- **Git History**（donjayamanne）：查看文件历史，定位「谁改的、改了哪次影响最大」。
  - 当前文件下 `⌘/Ctrl + Shift + P` → `file history`（Mac：`Option + H`）
- **GitHub Pull Requests**：在编辑器内查看、检出、评论 PR。
- **GitHub Repositories**（预览版）：直接浏览、编辑 GitHub 仓库。
- **GitLens**：逐行查看修改历史与 blame。重度功能需付费，不推荐。

### Docker

- **Docker**：容器、镜像管理。
- **Dev Containers**：用容器作为开发环境。

### 其他

- **DotENV**：`.env` 文件语法高亮。
- **leetcode**：在编辑器里刷题。
  - 登录失败时：网页版登录 → 任取一个接口复制 Cookie → `F1` → `LeetCode: Sign in by Cookie` → 输入邮箱和 Cookie。

## 摸鱼

- **Thief-Book**：在底部状态栏看小说。
- **Cloudmusic**：在 VS Code 里听网易云音乐。

## 不必安装 / 已弃用

以下功能 VS Code 已内置，或插件已停止维护、仅适用于旧场景，新手不必再装：

- **Bracket Pair Colorizer** / **Bracket Pair Colorizer 2**：括号彩虹已内置，`editor.bracketPairColorization.enabled` 开启即可。
- **Path Intellisense**：内置路径补全已覆盖。
- **Debugger for Chrome**：内置 JS 调试器已取代。
- **Polacode**：已停更，改用 **CodeSnap**。
- **Vetur**：仅支持 Vue 2；Vue 3 项目请用 **Vue - Official**，Vue 2 项目仍可继续用。
- **Dyno File Utils**：已并入 **Dyno AIO**。
- **Python Environment Manager**：已弃用（Python 扩展包内仍带，忽略即可）。
