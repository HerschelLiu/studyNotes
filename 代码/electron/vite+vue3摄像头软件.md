# 基础

## 简介

使用pnpm+vite+vue3+electron 实现摄像头软件

## Electron基础

[应用开发接口（文档）](https://www.electronjs.org/zh/docs/latest/api/app)

使用 commonJS 则后缀为`.cjs`

渲染进程即各种页面

### 初始化项目

* 新建项目&cd
* `pnpm init`
* `pnpm add -D electron`
* `pnpm add -D nodemon` 热更新
  * package.json修改 dev 命令`"dev": "nodemon --exec electron ."`
  * 可以使用配置文件配置`nodemon.json`
* package.json增加 script`"dev": "electron ."`

```js
/**
 * BrowserWindow 窗口管理
 */
const { app, BrowserWindow } = require('electron')
const path = require('path')
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 300,
    alwaysOnTop: true,
    x: 1000,
    y: 100,
    frame: false, // 关闭窗口标题栏，即关闭、缩小、放大图标以及标题的顶部栏
    transparent: true, // 设置窗口透明
  })
  
  mainWindow.webContents.openDevTools() // 打开调试工具
  mainWindow.setAspectRatio(1) // 设置缩放比例，1实际写法是1/1

  // mainWindow.loadURL('https://www.houdunren.com') // 主窗口加载网页
  mainWindow.loadFile(path.resolve(__dirname, 'index.html')) // 加载本地文件
}

app.whenReady().then(() => {
  createWindow()
  
  // app.on可以放到外边
  /* process.platform
   * win32是微软
   * darwin是苹果
   */
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  }) // 监听窗口全部关闭
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  }) // 监听窗口是否被激活
})
```

### 不同操作系统的处理方式

点击关闭时，window 用户会直接关闭，mac 用户是关闭窗口，实际程序还在，这不符合 mac 的习惯。此时则需要进行兼容写法，**看`window-all-closed`和`activate`部分**

### 使用样式控制渲染进程

比如`frame: false, // 关闭窗口标题栏，即关闭、缩小、放大图标以及标题的顶部栏`，但是这样就不能拖动标题栏了，此时就可以使用 css，关闭此选项后，加上以下 css，就可以在点击 dom 元素时拖动窗口了

```css
html {
  -webkit-app-region: drag;
}

textarea {
  -webkit-app-region: no-drag;
}
```

如果拖不动，那就是因为视口大小问题，设置 body 宽高为100vw，100vh 即可

### 使用现有框架

正常创建 vue

```bash
pnpm create vite

cd
pnpm install
pnpm add -D electron
pnpm add -D concurrently # 同时启动多个命令
```

在 package.json中加入命令

```
"dev": "concurrently \"vite\" \"electron .\""
// 或
"dev": "concurrently \"vite\" \"nodemon --exec electron .\""
```

在`script`同级增加`"main": "electron/main.js",`同时根目录创建

在 main.cjs中加载 vite 的地址`mainWindow.loadURL('http://localhost:5173/')`，这是开发时，实际最后爻打包 vue 项目，然后使用 loadFile 加载打包后的 vue



可以使用已有脚手架，如：[electron-vite](https://cn.electron-vite.org/)(支持 vue、react)、[electron-react-boilerplate](https://electron-react-boilerplate.js.org/)

### 代码调试

#### 网络请求安全处理

直接打开调试会有警告，在 html 的 加上meta配置就没有了

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self">
```

如果想引用其他域名

```
content="default-src 'self' xxx.com; script-src 'self'"
```

如果还有报错，添加`'unsafe-inline'`.如果你需要在 `<style>` 或 `<script>` 标签中使用内联样式或脚本，可以在 CSP 中添加 `unsafe-inline` 关键字。但是请注意，这会降低安全性。

#### 配置主进程调试

使用 vscode 的调试，创建`launch.json`.微软官方有写好的例子[vscode-recipes](https://github.com/Microsoft/vscode-recipes)

```json
{
  "version": "0.2.0",
  "configurations": [
      {
          "type": "node",
          "request": "launch",
          "name": "Electron: Main",
          "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
          "runtimeArgs": [
              "--remote-debugging-port=9223",
              "."
          ],
          "windows": {
              "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
          }
      },
      {
          "name": "Electron: Renderer",
          "type": "chrome",
          "request": "attach",
          "port": 9223,
          "webRoot": "${workspaceFolder}",
          "timeout": 30000
      }
  ],
  "compounds": [
      {
          "name": "Electron: All",
          "configurations": [
              "Electron: Main",
              "Electron: Renderer"
          ]
      }
  ]
}

```

调试时，比如主进程，在 main 中加上断点，再运行调试就可以了

#### 渲染进程断点调试

某个 页面就是渲染进程，要调试渲染进程，要先开始调试主进程，再开始调试渲染进程。可以直接选择全部调试，因为 launch 中已经配置

## 进程通信

### 预加载脚本

在渲染进程中，无法使用 node，但是可以改；瑜伽垫脚本可以使用部分 node，也可以改成支持全node。

是主进程和渲染进程的桥梁，所以 dom 操作应该在页面中。

渲染进程和主进程互相隔离，但是可以配置不隔离。

#### 预加载脚本可以使用部分 nodejs

```js
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 300,
    alwaysOnTop: true,
    x: 1000,
    y: 100,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'), // 预加载脚本
      nodeIntegration: true // 设置使用 node 全功能，建议不打开
    }
  })

  mainWindow.setAspectRatio(1) // 设置缩放比例
  mainWindow.loadFile(path.resolve(__dirname, 'index.html')) // 加载本地文件
}
```



preload

```js
const fs = require('fs');
const content = fs.readFileSync('package.json', 'utf-8');
console.log(content);

```

#### 还可以进行 dom 操作

preload

```js
window.addEventListener('DOMContentLoaded', () => {
  console.log(document.querySelector('h1'));
})
```

### 单向通信

#### 渲染进程向主进程通信

##### 事件订阅方式

###### 预加载脚本向主进程通信

```js
// main.js
// ...
ipcMain.on('saveFile', () => { // 'saveFile'为事件名
  console.log('saveFile');
})
```

```js
// preload
ipcRenderer.send('saveFile'); // (事件名，传值)
```

###### 渲染进程通过预加载脚本向主进程通信

```js
// preload

contextBridge.exposeInMainWorld('api', { // 'api'为变量名，在渲染进程中就可以调用此变量
  a: 333,
  hd: () => { 
    ipcRenderer.send('saveFile');
  }
})
```

```html
// index.html
<button id="btn"> 向主进程发送通知</button>
<script>
  console.log(window.api.a); // 控制台会打印333
  
  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('#btn')
    btn.addEventListener('click', () => {
      window.api.hd()
    })
  })
</script>
```

点击按钮后，命令行中就会打印主进程的 log

##### 渲染进程向主进程传递参数

```html
<input type="text">
<button id="btn">设置标题</button>

<script>
  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('#btn')
    btn.addEventListener('click', () => {
      const title = document.querySelector('input').value
      window.api.changeTitle(title)
    })
  })
</script>
```

```js
// preload.js

contextBridge.exposeInMainWorld('api', {
  changeTitle: (newTitle) => {
    ipcRenderer.send('updateTitle', newTitle)
  }
})
```

```js
// main.js
// ...

ipcMain.on('updateTitle', (event, value) => {
  BrowserWindow.fromWebContents(event.sender).setTitle(value)
  // 或
  BrowserWindow.fromWebContents(event.sender).title = value
})
```

#### 主进程向渲染进程通信

##### 创建菜单

```html
// index.html

<div id="counter">1</div>
```

```js
// menu.js

const { Menu } = require('electron')
const createMenu = (win) => {
  const menu = [
    {
      label: '菜单',
      submenu: [
        {
          label: '增加',
          click: () => {
            console.log(win.webContents);
          }
        }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
}

module.exports = {
  createMenu
}

```

```js
// main.js

const { createMenu } = require('./menu')
const createWindow = () => {
  // ... mainWindow
  createMenu(mainWindow)
}
```



##### 主进程向预加载脚本发送指令

```js
// preload.js

ipcRenderer.on('test', () => { 
  const el = document.querySelector('#counter');
  el.innerHTML = Number(el.textContent) + 1;
});
```

```js
// menu.js
click: () => {
  win.webContents.send('test')
}
```

仅为一半展示，实际 dom 操作要放在渲染进程中

##### 主进程通过预加载脚本向渲染进程通信

```js
// menu.js
click: () => {
  win.webContents.send('test', 1)
}
```



```js
// preload.js

contextBridge.exposeInMainWorld('api', {
  counter: (callback) => {
    ipcRenderer.on('test', (event, value) => {
      callback(value)
    })
  }
})
```

```html
// index.html

<script>
  window.api.counter((value) => {
    const el = document.querySelector('#counter');
    el.innerHTML = Number(el.textContent) + value;
  })
</script>
```



### 双向通信

#### 方式一：两种单向通信结合

```html
// index.html
<button id="btn"> 向主进程发送通知</button>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('#btn')
    btn.addEventListener('click', () => {
      window.api.hd()
    })
  })
</script>
```



```js
// main.js
// ...
ipcMain.on('saveFile', (event) => { // 'saveFile'为事件名
  BrowserWindow.fromWebContents(event.sender).send('msg', '已经收到通知')
})
```



```js
// preload.js

contextBridge.exposeInMainWorld('api', { // 'api'为变量名，在渲染进程中就可以调用此变量
  hd: () => { 
    ipcRenderer.send('saveFile');
  }
})

ipcRenderer.send('msg', (event, value) => {
  console.log(value)
});
```



#### 方式二：invoke

```html
// index.html
<input type="text" />
<button id="btn">上传文件</button>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('#btn')
    btn.addEventListener('click', () => {
      window.api.upload((file) => {
        document.querySelector('input').value = file;
      })
    })
  })
</script>
```

```js
// preload.js

contextBridge.exposeInMainWorld('api', {
  upload: async () => {
    const file = await ipcRenderer.invoke('selectFile')
    callback(file)
  }
})
```

```js
// main.js
// ...

ipcMain.handle('selectFile', async (event) => {
  // const obj = await dialog.showOpenDialog({})
  // console.log(obj); // {canceled: false, filePaths: []} filePaths: string[]
  
  const { filePaths } = await dialog.showOpenDialog({})
  return filePaths[0]
})
```



## 隔离进程

### contextIsolation使用场景

```js
// window.js

// ...
webPreferences: {
  preload: path.resolve(__dirname, 'preload.js'),
  contextIsolation: false // 取消 preload 与渲染进程的全局 api window的隔离。
}
```

此时就不需要``contextBridge.exposeInMainWorld`方式，在 preload 中直接

```js
window.api = {
  toMain: () => { }
}
```

 可以在渲染进程中直接调用`window.api`

### 在预加载脚本与渲染脚本中使用 node 模块

```js
// window.js

// ...
webPreferences: {
  preload: path.resolve(__dirname, 'preload.js'),
  nodeIntegration: true
}
```

设置此属性即可在预加载脚本和渲染进程中使用全部 node 模块。

这两个属性放开，安全会降低，所以非必要不要放开。

### 沙盒模式

可以单独支持预加载脚本中使用全部 node 模块和 electron 模块，而渲染脚本不支持使用。

```js
// window.js

// ...
webPreferences: {
  preload: path.resolve(__dirname, 'preload.js'),
  sandbox: false
}
```

### 动态设置窗口尺寸

```js
// window.js
// ...
const win = new BrowserWindow({
    width: 300,
    height: 300,
    fullscreen: true, // 全屏
  	center: true, // 窗口居中
  })

// 动态修改
win.center() 
win.setBounds({
  width: 600,
  height: 200,
  x: 0,
  y: 0
}, true) // true的位置是开启了动画过渡
```

### 使用 screen 模块控制窗口居中

```JS
// window.js
// ...
const { width } = screen.getPrimaryDisplay().workAreaSize // 获取屏幕尺寸
```

### 向主进程中传递窗口尺寸

```html
宽度：<input type="text" name="width" value="100"><br>
高度：<input type="text" name="height" value="100"><br>
<button>修改尺寸</button>

<script>
  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('button')
    btn.addEventListener('click', () => {
      const width = Number(document.querySelector('input[name="width"]').value)
      const height = Number(document.querySelector('input[name="height"]').value)
      window.api.changeSize({ width, height })
    })
  })
</script>
```

```js
// preload.js

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('api', {
  changeSize: (options) => {
    ipcRenderer.send('setWindowPosition', options)
  }
})
```

```js
// main.js
// ...
ipcMain.on('setWindowPosition', (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender) // 获取相应窗口
  win.setBounds({ ...options }, true)
})
```

## 菜单管理

### 设置基础菜单

```js
// menu.js
const { app, Menu, shell, BrowserWindow } = require('electron')

const isMac = process.platform === 'darwin'

const createMenu = (win) => {
  const config = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              {
                label: '访问网站',
                click: () => {
                  shell.openExternal('https://baidu.com/')
                }
              },
              {
                label: '渲染进程事件',
                click: () => {
                  win.webContents.send('toPreload', 'hello')
                }
              }
            ]
          }
        ]
      : []),
    {
      label: '操作',
      submenu: [
        {
          label: '打开窗口',
          accelerator: 'CommandOrControl+A', // 快捷键
          click: () => {
            new BrowserWindow({
              width: 300,
              height: 300
            })
          }
        },
        {
          type: 'separator'
        },
        { label: '隐藏', role: 'hide' },
        { label: '关闭', role: isMac ? 'close' : 'quit' },
        {
          label: '退出',
          click: () => {
            app.quit()
          }
        }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(config))
}

module.exports = {
  createMenu
}

```

```js
// window.js

const { BrowserWindow, screen } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 300,
    height: 300,
    center: true,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js')
    }
  })

  win.webContents.openDevTools()
  win.loadFile(path.resolve(__dirname, 'index.html'))

  return win
}

module.exports = { createWindow }

```



```js
// main.js
const { app } = require('electron')
const { createWindow } = require('./window')
const { createMenu } = require('./menu')

app.whenReady().then(() => {
  const win = createWindow()
  createMenu(win)
})

```

```js
// preload.js

const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld('api', {
  menuEvent: (callback) => {
    ipcRenderer.on('toPreload', (event, value) => {
      callback(value)
    })
  }
})

```

```html
// index.html

<script>
  window.addEventListener('DOMContentLoaded', () => {
    window.api.menuEvent((value) => {
      console.log(value);
    })
  })
</script>
```



### 右键菜单(弹出菜单)渲染进程事件定义

```js
// preload.js
window.addEventListener('contextmenu', () => {
  ipcRenderer.send('mainPopMenu')
})
```



```js
// contextmenu.js

const { ipcMain, app, Menu, BrowserWindow } = require("electron");

ipcMain.on('mainPopMenu', (event) => {
  const template = [
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ]

  const menu = Menu.buildFromTemplate(template)

  menu.popup(BrowserWindow.fromWebContents(event.sender))
})

```

```js
// main.js
require('./contextmenu')
```



## 对话框

### 基本使用

```js
// menu.js
// ...
{
label: '退出',
click: async () => {
  const res = await dialog.showMessageBox({
    title: '退出',
    message: '你确定要退出吗？',
    buttons: ['取消', '确定'],
    // cancelId: 1 // 此为按 esc 触发第几个按钮，默认是点击第一个按钮，即response: 0，可以设置esc 按钮是点击哪个按钮
    // checkboxLabel: '确定访问吗？' // 设置复选框， 选中取消即checkboxChecked
    // checkboxChecked: false // 修改复选框默认是否选中,默认不选中
  })
  // console.log(res) // 点击确定 { response: 1, checkboxChecked: false } checkboxChecked复选框是否点击
  
  if (res.response === 1) app.quit()
}
```

### 警告框与确认框结合使用

```js
// menu.js
{
  label: '访问网站',
  click: async () => {
    const res = await dialog.showMessageBox({
      title: '退出',
      message: '你确定要退出吗？',
      buttons: ['取消', '确定'],
      checkboxLabel: '确定访问吗？'
    })

    if (!res.checkboxChecked) {
      return dialog.showErrorBox('温馨提示', '你没有确认复选框')
    }

    if (res.response === 1) {
      shell.openExternal('https://baidu.com/')
    }
  }
}
```

### renderer与 preload 通信(例子：选择图片)

```html
// index.html

<textarea name="content" cols="30" rows="10">请输入</textarea><br>
<button id="saveBtn">保存文件</button>
<br>
<button id="selectBtn">选择文件</button>
<div id="container"></div>

<script>
// 选择文件
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('#selectBtn');
  const container = document.querySelector('#container');
  btn.addEventListener('click', async () => {
    const files = await window.api.selectFilePreload()
    for (const file of files) {
      const input = document.createElement('input');
      input.value = file;
      container.appendChild(input);
    }
  })
})
  
// 保存文件
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('#saveBtn');
  btn.addEventListener('click', async () => {
    const textarea = document.querySelector('textarea[name="content"]')
    window.api.saveToFile(textarea.value)
  })
})
</script>
```

```js
// preload.js

const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld('api', {
  selectFilePreload: () => {
    return ipcRenderer.invoke('selectFileMain')
  },
  saveToFile: (value) => {
    ipcRenderer.send('saveToFileMain', value)
  }
})
```

```js
// main
require('./ipcMain')
```

```js
// ipcMain.js

const { ipcMain, dialog } = require('electron')
const fs = require('fs')

// 选择图片
ipcMain.handle('selectFileMain', async (event) => {
  const { filePaths } = await dialog.showOpenDialog({
    title: '选择图片文件',
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'Images',
        extensions: ['jpg', 'jpeg', 'png', 'gif']
      }
    ]
  })

  return filePaths
})

// 保存文件
ipcMain.on('saveToFileMain', async (event, value) => {
  const res = await dialog.showSaveDialog({
    title: '保存文件'
  })
  // console.log(res); // { filePath: '', canceled: true }
  fs.writeFileSync(res.filePath, value)
})

```

### 使用`setWindowOpenHandler`定义链接打开方式

```html
// index.html

<a href="https://www.baidu.com" target="_blank">百度</a>
```

```js
// window.js
// ... 
// createWindow中
win.webContents.setWindowOpenHandler(details => {
  // console.log(details);
  // {
  //   url: 'https://www.baidu.com/',
  //   frameName: '',
  //   features: '',
  //   disposition: 'foreground-tab',
  //   referrer: { url: '', policy: 'strict-origin-when-cross-origin' },
  //   postBody: undefined
  // }

  shell.openExternal(details.url)

  return {
    action: 'deny' // 设置打开链接默认行为，allow: 允许打开,即新窗口打开，deny: 禁止打开，在默认浏览器打开，ignore: 忽略，使用默认行为
  }
})
```

## [系统托盘（菜单栏）](https://www.electronjs.org/zh/docs/latest/api/tray)图标管理

主进程

### 系统托盘图标定义

```ts
// tray.ts

import { Menu, Tray } from 'electron'
import path from 'path'

export const createTray = () => {
   // darwin为苹果
  const tray = new Tray(
    path.resolve(__dirname, process.platform == 'darwin' ? '../../resources/trayTemplate@2x.png' : '../../resources/windowTray.png')
  )

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      role: 'quit'
    }
  ])

  tray.setToolTip('摄像头')
  tray.setContextMenu(contextMenu)
}

```

放在主进程的`app.whenReady().then`中，在 createWindow之下就行

MacOs 中，图片名要以Template 单词结尾， 32x32要加上@2x，详情查看文档

### 隐藏 dock 栏图标

```ts
// 主进程
// createWindow
{
  skipTaskbar: false, // window中会消失
}

// app.when createWindow()之后
//隐藏 dock 图标 - 苹果
app.dock.hide()
```



## 打包

如果使用了脚手架，则根据脚手架配置，目前来讲，众多脚手架使用的是[electron-builder](https://www.electron.build/)；这里使用了electron-vite

如果没使用脚手架，则根据 Electron 配置

### 配置文件说明

`electron-builder.yml`文件为打包配置

* `asarUnpack`为将要打包成压缩包的文件
* `nsis`为专门制作 window安装程序的包
  * `artifactName`安装包名称
  * `shortcutName`桌面图标名称
  * `uninstallDisplayName`卸载时显示的名字
  * `createDesktopShortcut`是否创建桌面快捷图标

### 打包软件图标设置

图标要放在`build/`中

### 生成安装软件

查看`package.json`中的打包命令

注意：在 mac 中不能打包 window 的程序，在window虚拟机中也不行。

提示`proxyconnect tcp: dial tcp :0: connect: can't assign requested address`，则浏览器下载相应 Electron 包(控制台有地址)，放在:

* Linux: $XDG_CACHE_HOME or ~/.cache/electron/
* MacOS: ~/Library/Caches/electron/
* Windows: %LOCALAPPDATA%/electron/Cache or ~/AppData/Local/electron/Cache/

# 实战

## 开发桌面摄像头软件

[WebAPI](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices)

### 安装 

[electron-vite](https://cn.electron-vite.org/guide/introduction.html)脚手架：`pnpm create @quick-start/electron`

如果没有自动更新，在 package.json 中的 dev 后加上`--watch`

[element-plus](https://element-plus.org/zh-CN/guide/quickstart.html)：`pnpm install element-plus`

[Tailwindcss](https://www.tailwindcss.cn/)：`https://www.tailwindcss.cn/docs/installation/framework-guides`

[IconPark](https://bytedance.larkoffice.com/wiki/wikcnrOVHCJQ4V3a7mDvmLjrePf): `pnpm add @icon-park/vue-next`vue3的

[pinia](https://pinia.vuejs.org/zh/introduction.html)：

* `npm install pinia`
* [持久化](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/)：`pnpm add pinia-plugin-persistedstate`

**注意：**窗体没有透明的话，设置 body 为透明
