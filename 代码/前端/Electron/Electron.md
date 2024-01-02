### 1. 安装

```bash
pnpm add -D electron
pnpm add -D electron-devtools-installer
pnpm add -D vite-plugin-electron
pnpm add -D rimraf
```

* electron-devtools-installer - 该包主要是为了方便我们开发和调试`electron`，可以去官网详细了解：[electron-devtools-installer](https://link.juejin.cn/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2FMarshallOfSound%2Felectron-devtools-installer)。
* vite-plugin-electron - 该包集成了`Vite`和`Electron`，比如使用它之后可以让我们方便的在渲染进程中使用`Node API`或者`Electron API`，详细使用用法可以去官网学习：[vite-plugin-electron](https://link.juejin.cn/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Felectron-vite%2Fvite-plugin-electron)。
* rimraf - 该包主要是辅助作用，让我们快速删除某些文件和文件夹。

### 2. 初始化

`Electron`项目分为了主进程和渲染进程，主进程其实就是我们的`Electron`，渲染进程就相当于我们的`Vue`项目。

#### 2.1 新建主进程

为了方便修改代码和查看，我们在项目根目录新建主进程文件夹`electron-main`，然后在其目录下新建`index.ts`文件，编写主进程代码。

```ts
// electron-main/index.ts
import { app, BrowserWindow } from "electron";
import path from "path";


const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      contextIsolation: false, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      preload: path.join(__dirname, "../electron-preload/index.js"), // 需要引用js文件
    },
  });


  // 如果打包了，渲染index.html
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../index.html"));
  } else {
    let url = "http://localhost:3000"; // 本地启动的vue项目路径
    win.loadURL(url);
  }
};


app.whenReady().then(() => {
  createWindow(); // 创建窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


// 关闭窗口
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

```

#### 2.2 新建预加载文件

`electron`中有一个预加载的概念，也就是我们常说的`preload`，在该文件里面可以在其它脚本文件执行之前运行，它可以调用一些`Node API`。

在项目根目录新建`electron-preload`文件夹，然后在其目录下新建`index.ts`文件，编写代码。

### 3. 修改tsconfig

```json
"include": [
	...
  "electron-main/**/*.ts",
  "electron-preload/**/*.ts"
],
```

### 4. 修改vite.config

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";


import * as path from "path";
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron/renderer";
import polyfillExports from "vite-plugin-electron/polyfill-exports";


export default defineConfig({
  plugins: [
    ...
    electron({
      main: {
        entry: "electron-main/index.ts", // 主进程文件
      },
      preload: {
        input: path.join(__dirname, "./electron-preload/index.ts"), // 预加载文件
      },
    }),
    electronRenderer(),
    polyfillExports(),
  ],
  build: {
    emptyOutDir: false, // 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录
  },
});

```

### 5. 修改package.json

1. 将项目入口 main 改为 dist/electron-main/index.js(因为electron不支持 ts，只能引用打包后的)
2. 修改打包命令`"build": "rimraf dist && vite build && electron-builder"`

```json
{
  ...
  "scripts": {
    "dev": "vite"
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "electron:dev": "vue-tsc --noEmit && electron ."
  ...
}
```

> `vue-tsc` 是对 TypeScript 自身命令行界面 `tsc` 的一个封装。它的工作方式基本和 `tsc` 一致。

### 6. 配置`electron-builder`打包脚本

[electron-builder](https://link.juejin.cn/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%3A%2F%2Fwww.electron.build%2F)

```json
// package.json
{
  ......
  "build": {
    "appId": "com.smallpig.desktop",
    "productName": "smallpig",
    "asar": true,
    "copyright": "Copyright © 2022 smallpig",
    "directories": {
      "output": "release/${version}"
    },
    "files": [
      "dist"
    ],
    "mac": {
      "artifactName": "${productName}_${version}.${ext}",
      "target": [
        "dmg"
      ]
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": [
            "x64"
          ]
        }
      ],
      "artifactName": "${productName}_${version}.${ext}"
    },
    "nsis": {
      "oneClick": false,
      "perMachine": false,
      "allowToChangeInstallationDirectory": true,
      "deleteAppDataOnUninstall": false
    },
    "publish": [
      {
        "provider": "generic",
        "url": "http://127.0.0.1:8080"
      }
    ],
    "releaseInfo": {
      "releaseNotes": "版本更新的具体内容"
    }
  }
}

```



### 7. 主进程与渲染进程通信

借助`vueuse`插件库中的一个插件`@vueuse/electron`来简化我们的工作[@vueuse/electron](https://link.juejin.cn/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%3A%2F%2Fvueuse.org%2Ffunctions.html%23category%3D%2540Electron)，[Add-ons | VueUse中文文档 (vueusejs.com)](https://www.vueusejs.com/add-ons.html)

```bash
pnpm add -D @vueuse/electron
```

App.vue

```vue
<script setup lang="ts">
import { useIpcRenderer } from "@vueuse/electron";
const ipcRenderer = useIpcRenderer();
ipcRenderer.send("window-new", "im render"); // 向主进程通信
</script>

```

`electron-main/index.ts`中主进程监听事件：

```ts
import { app, BrowserWindow, ipcMain } from "electron";
// 监听渲染进程方法
ipcMain.on("window-new", (e: Event, data: string) => {
  console.log(data);
});
```

