## 引入

```bash
pnpm add leaflet
pnpm add -D @types/leaflet
```



```ts
// 使用时
import L from 'leaflet'

// main
import 'leaflet/dist/leaflet.css'

```

### [leaflet-geoman](https://geoman.io/docs/leaflet/getting-started/free-version)

leaflet扩展。用于绘制和编辑几何图层的最强大的Leaflet插件。用于创建和编辑几何图层的Leaflet插件绘制、编辑、拖动、剪切、旋转、分割、缩放、测量、捕捉和固定图层支持标记、圆标记、折线、多边形、圆、直角、图像叠加、图层组、GeoJSON、多线串和多多边形。

```bash
pnpm add @geoman-io/leaflet-geoman-free
```

```ts
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
```

## 说明

### L.TileLayer.T

经常看到如下代码

```js
L.TileLayer.T = L.TileLayer.extend({
  getTileUrl(coords) {
    console.log(`calc = ${coords}`)
    const { x, y } = coords

    return './8/8_model_{x}_{y}.png'.replace('{x}', x).replace('{y}', y)
  },
  // 如果此项为true，在平移后不可见的切片被放入一个队列中，在新的切片开始可见时他们会被取回（而不是动态地创建一个新的）。这理论上可以降低内存使用率并可以去除在需要新的切片时预留内存。
  reuseTiles: true
})
```

**继承**：Leaflet 基于 `L.Class` 构建类继承体系。`L.TileLayer.extend` 用于创建 `L.TileLayer` 的子类，扩展自定义行为（如重写 `getTileUrl` 方法）.**为什么是 `T`？** `T` 是开发者自定义的命名（如 `CustomTileLayer`），此处用 `T` 仅为示例缩写。

**工厂函数简化调用**：

扩展后需提供工厂函数以实现 `L.tileLayer.t(...)` 的链式调用风格：

```js
L.tileLayer.t = function(url, options) {
  return new L.TileLayer.T(url, options);
};
```

Leaflet 约定：类名 `UpperCamelCase` (如 `TileLayer.T`)，工厂函数 `lowerCamelCase` (如 `tileLayer.t`)。

#### **TypeScript 报错的原因与解决方案**

TypeScript 依赖 `@types/leaflet` 的类型定义，但该库**不包含自定义扩展属性**（如 `T`）。因此 TS 编译器认为 `L.TileLayer.T` 不存在。

在项目中添加 `leaflet.d.ts` 类型声明文件：

```ts
// leaflet.d.ts
import 'leaflet';

declare module 'leaflet' {
  namespace TileLayer {
    export const T: any; // 简化声明
    // 或精细声明（推荐）
    export const T: {
      new (url: string, options?: TileLayerOptions): TileLayer;
      extend(props: any): any;
    };
  }
}
```





## 使用



## 其他

### 生成符合 leaftlet 的 CRS.Simple类型地图

1. 下载和安装 QGIS

首先，你需要下载并安装 QGIS。你可以从 QGIS 的官方网站下载适合你操作系统的版本：

[QGIS 官方网站](https://qgis.org/zh_Hans/site/forusers/download.html)

2. 加载地图图像

安装完成后，启动 QGIS，按照以下步骤操作：

  1. 打开 QGIS。
  2. 在顶部菜单栏中，选择 `图层 -> 添加图像图层 -> 添加栅格图层`。
  3. 选择你准备好的高分辨率地图图像并点击 `打开`。


接下来，使用 QGIS 的 `瓦片切割` 插件生成瓦片：

    1. 在顶部菜单栏中，选择 `插件 -> 管理和安装插件`。
    
    2. 在插件安装窗口中，搜索 `QTiles` 并进行安装。
    
    3. 安装完成后，回到 QGIS 主界面，选择 `插件 -> QTiles -> 创建瓦片`。
    
    4. 在QTiles窗口中，设置以下参数：
    
     - **输出目录**：选择一个目录来保存生成的瓦片。
     - **输出格式**：选择 `XYZ`。
     - **缩放级别**：选择你需要的缩放级别范围，例如 `0-5`。
     - **地图范围**：选择 `当前地图范围`（根据你的需要）。
    
    5. 点击 `确定`，QGIS 会开始生成瓦片。生成完成后，你可以在指定的输出目录中找到瓦片。

> 图片出来是白色不知道为啥