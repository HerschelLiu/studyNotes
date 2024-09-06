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