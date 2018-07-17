## package control安装

快捷键 Ctrl+Shift+P（菜单 – Tools – Command Paletter），输入 install 选中Install Package并回车 

## 汉化

package control搜索LocalizedMenu，安装好之后点击设置language选择简体中文

## emmet

package control搜索emmet，

1. 安装完成后我们利用Emmet插件去快速生成HTML代码，例如输入html:5按住Tab键即可生成HTML文件完整的结构，但是很多人在安装完成后输入html:5然后按住Tab键并没有反应，这是什么原因导致的呢？原来Emmet默认的快捷键是Ctrl+E，我们需要将其设置成常用的Tab键。

2. 6

   在菜单栏选择Preferences-->PackageSettings-->Emmet-->KeyBindings-->User，将以下信息粘贴进去即可。

   [{"keys": ["tab"], "args": {"action": "expand_abbreviation"}, "command": "run_emmet_action", "context": [{"key": "emmet_action_enabled.expand_abbreviation"}]}]

3. 7

   重启Sublime Text3此时我们便可以进行代码补全操作了，在新创建的文件上输入html:5

## AutoFileName

快速列出你想引用的文件夹里面所有文件的名字，比如想引用test/img/1.png。只需要输入/img,该插件就会自动提示/img下面的所有文件名

## BracketHighlighter

高亮显示[], (), {}, “”, ”, <tag></tag>符号，便于查看起始和结束标记

## ColorPicker

调色板，需要输入颜色时，可直接选取颜色。使用快捷键ctrl+shift+c即可打开调色板。需要注意的是，这个快捷键可能会打不开调色板，原因是该快捷键被占用了，最直接的解决办法是直接在Preferences→Key Bindings-User中配置：“{ "keys": ["ctrl+shift+c"], "command": "color_pick"},”

## JsFormat

JsForma可以自动帮助你格式化[JavaScript](http://lib.csdn.net/base/javascript)代码，形成一种通用的格式，比如对压缩、空格、换行的[js](http://lib.csdn.net/base/javascript)代码进行整理，使得js代码结构清晰，易于观看。在已压缩的JS文件中，右键选择jsFormat或者使用默认快捷键（Ctrl+Alt+F），如果该热键被占用了，可以在Preferences→Key Bindings-User中配置： { "keys": ["ctrl+shift+alt+j"], "command": "js_format","context": [{"key": "selector", "operator": "equal", "operand": "source.js,source.json"}]},

## DocBlockr

安装该插件后，可以快速生成各种注释格式，当需要生成注释符号时，输入/*、/然后回车系统即帮你自动生成，如果/后面刚好是一个函数的定义，注释格式会根据函数的参数生成。

## Sidebar Enhancements

sub侧栏右键文件提供的功能很少，但在实际开发中，文件通常会有各种处理请求，而该插件增强侧栏文件右键功能，比如可以直接右键将文件移入回收站，在浏览器中浏览，将文件复制到剪切板等。详情查看[sidebar文档](https://packagecontrol.io/packages/SideBarEnhancements)

安装该插件前，文件右键选项很少：

安装插件后，文件右键选项大大增强：

我常用的两个功能是设置文件使用浏览器打开的快捷键F12和重命名F2，需要自己往Key-Bindings-User里面添加
{ "keys": ["f12"], "command": "side_bar_open_in_browser","args":{"paths":[], "type":"testing", "browser":""}},
{ "keys": ["f2"], "command": "side_bar_rename"},

## Alignment

对定义的变量进行[智能](http://lib.csdn.net/base/aiplanning)对齐,一般是“=”号对齐，默认的快捷键是Ctrl+Alt+A，但这个热键和QQ截屏的热键冲突不能使用，需要自己重新设置，我通常设置成Ctr+Alt+Shift+A，以下粘贴到Key-Bindings-User里面：{ "keys": ["ctrl+alt+shift+a"], "command": "alignment" },

## CSS Format

CSS Format可以将任意的 CSS、SASS、SCSS、LESS 代码格式化为展开、紧凑、压缩的形式，选中需要格式化的样式代码，右键选中CSS Format，选择需要形成的格式即可。

## Tag

Tag插件提供各种对Tag标签的操作，具有功能：根据/自动关闭HTML标签，标签自动缩进（或选中ctrl+alt+f），删除标签和里面的内容，插入标签（对光标字符“ctrl+shift+,”生成标签），删除标签里的属性，关闭标签，检查标签等。有些功能是自动执行，有些功能需要手动执行，功能入口 菜单栏Edit→Tag。

## Trailing spaces

可以检测和一键删除代码的空格，保存时自动删除多余空格，让你的代码更加紧凑规范。功能入口：Edit→
Trailing Spaces→
Delete，也可以自己设置快捷键，我通常设置成ctrl+shift+alt+t，以下粘贴到Key-Bindings-User里面：{ "keys": ["ctrl+shift+alt+t"], "command": "delete_trailing_spaces" },

## HTML-CSS-JS Prettify 

格式化HTML,CSS,[javascript](http://lib.csdn.net/base/javascript)和Json代码格式。使用该插件，需要安装nodejs，而且要在Packages-Setting→
HTML/CSS/JS Prettify→
set node path中设置你node的安装路径。使用过程：Tools→
Command Palette(或者Ctrl+Shift+P)，输入选择htmlprettify即可完成整个文档的格式化。也可以设置快捷键：Packages-Setting→HTML/CSS/JS Prettify→set keyboard shortcuts，因为我的ctrl+shift+h已经被占用，所以我改成ctrl+shift+alt+h。

# sublimeCodeIntel

js智能提示，超级好用

1.操作
Ctrl + `： 打开Sublime Text控制台（Esc退出）
Ctrl+Shift+P：打开命令面板（Esc退出）
Ctrl + K, Ctrl + B： 组合键，显示或隐藏侧栏
Alt ：光标调到菜单栏，↑↓←→ 移动光标

2.编辑
Ctr+Shift+D：复制粘贴光标所在行
Alt+.：关闭标签
Ctrl+/：用//注释当前行。
Ctrl+Shift+/：用/**/注释。
Ctrl + Enter： 在当前行下面新增一行然后跳至该行
Ctrl + Shift + Enter： 在当前行上面增加一行并跳至该行
Ctrl + ←/→： 进行逐词移动，
Ctrl + Shift + ←/→： 进行逐词选择
Ctrl + Shift + ↑/↓： 移动当前行（文件会被修改）
Ctrl+KK ：从光标处删除至行尾
Ctrl+K Backspace ：从光标处删除至行首
Ctrl+Z：撤销
Ctrl+Y：恢复撤销
Ctrl+J：合并行（已选择需要合并的多行时）
Ctrl + [： 选中内容向左缩进
Ctrl + ]： 选中内容向右缩进

3.选择
Alt+F3：选中关键词后，选中所有相同的词。可以配合Ctrl+D使用。
Ctrl + D Ctrl + K Ctrl + U：Ctrl + D选择当前光标所在的词并高亮该词所有出现的位置，再次Ctrl + D，会选择该词出现的下一个位置。在多重选词的过程中，Ctrl + K会将当前选中的词进行跳过在多重选词的过程中，Ctrl + U进行回退
Ctrl+L ：选择光标所在整行
Ctrl+X：删除光标所在行
Ctrl + J： 把当前选中区域合并为一行
Ctrl+Shift+M：选中当前括号内容，重复可选着括号本身

4.查找
（如果有窗口弹出都是Esc退出弹出窗口）
Ctr+p：输入@显示容器（css或者js里面）
Ctrl + F： 调出搜索框
Ctrl + H： 调出替换框进行替换
Ctrl + Shift + H： 输入替换内容后，替换当前关键字
Ctrl + Alt + Enter： 输入替换内容后，替换所有匹配关键字。(NOTE: 注意此时如果鼠标焦点在编辑窗口中，则替换失败，将鼠标焦点调到替换框中，Ctrl + Alt + Enter才会起作用)
Ctrl + Shift + F： 开启多文件搜索&替换
Alt + C： 切换大小写敏感（Case-sensitive）模式
Alt + W： 切换整字匹配（Whole matching）模式
Alt + R： 切换正则匹配模式的开启/关闭

5.跳转
Ctrl + P：列出当前打开的文件（或者是当前文件夹的文件），输入文件名然后 Enter 跳转至该文件，输入@symbol跳转到symbol符号所在的位置，输入#keyword跳转到keyword所在的位置，输入:n跳转到文件的第n行
Ctrl + R：列出当前文件中的符号（例如类名和函数名，但无法深入到变量名），输入符号名称 Enter 即可以跳转到该处。
会列出Markdown文件的大纲
F12： 快速跳转到当前光标所在符号的定义处（Jump to Definition）。比如当前光标所在为一个函数调用，F12会跳转至该函数的定义处。
Ctrl + G： 输入行号以跳转到指定行
Ctrl+M：跳转到括号另一半。

6.窗口和Tab页
Ctrl + N： 在当前窗口创建一个新标签
Ctrl + Shift + N： 创建一个新窗口（该快捷键 和搜狗输入法快捷键冲突）
Ctrl + W： 关闭标签页，如果没有标签页了，则关闭该窗口
Ctrl+Shift+W：关闭所有打开文件
Ctrl + Shift + T： 恢复刚刚关闭的标签。
Ctrl +Tag：移动标签。

7.屏幕
F11： 切换普通全屏
Shift + F11： 切换无干扰全屏
Alt + Shift + 2： 进行左右分屏
Alt + Shift + 8进行上下分屏
Alt + Shift + 5进行上下左右分屏（即分为四屏）
Ctrl + 数字键： 跳转到指定屏
Ctrl + Shift + 数字键： 将当前屏移动到指定屏