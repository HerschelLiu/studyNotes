[three.js docs (threejs.org)](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene)

## 安装与使用

安装

```bash
pnpm add three
```

使用

在 main.js 文件中引入

```js
import * as THREE from 'three'
```



## 开始

某些设备以及浏览器直到现在仍然不支持WebGL，需要进行**WebGL兼容性检查**

```js
import WebGL from 'three/examples/jsm/capabilities/WebGL'

console.log(WebGL.isWebGLAvailable());
```



场景Scene、相机Camera、渲染器Renderer这是三个基本概念。

创建他们三个

```js
import * as THREE from 'three'

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75, // 视角。数值越大，视野越大。
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面，即相机最近能看到的是什么
  1000 // 远平面，即相机最远能看到的是什么
)

// 渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight) // 要渲染的尺寸
document.body.appendChild(renderer.domElement) // 渲染到body中
```

设置相机

```js
// 设置相机位置，可不写，使用默认，如果想完整看到三个坐标轴，就需要调整位置
camera.position.z = 5 // 至少设置相机的 z 轴，不然默认为0，页面中会看不到几何体
camera.position.y = 2
camera.position.x = 2

// 相机看向位置，默认原点即可
// camera.lookAt(0, 0, 0)
```



创建几何体

```js
// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// 创建网格，即实际创建物体
const cube = new THREE.Mesh(geometry, material) // 第二个参数可以为数组
// 将网格添加到场景中
scene.add(cube)
```


### 添加辅助坐标系

```js
 
/**
 * 添加辅助坐标系
 * 参数表示坐标系坐标轴线段尺寸大小
 * 坐标轴颜色红R、绿G、蓝B分别对应坐标系的x、y、z轴
 * 默认 y轴朝上，x 轴水平
 */
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
```

重复动画

```js
// 渲染。但是只会渲染当前，我们需要一个函数来重复渲染
// renderer.render(scene, camera)
function animate() {
  requestAnimationFrame(animate)
  // 旋转
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  // 渲染
  renderer.render(scene, camera)
}
animate()
```

### 轨道控制器

此时，如果想缩放、旋转、平移的话，就需要**轨道控制器**

```js
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// ...

// 创建轨道控制器,必须在动画循环里调用.update()
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼，让控制器更有真实效果。
// controls.enableDamping = true
// 设置阻尼系数
// controls.dampingFactor = 0.05
// 旋转速度
// controls.rotateSpeed = 0.05
// 自动旋转
// controls.autoRotate = true

function animate() {
  // 更新轨道控制器
  controls.update()
  requestAnimationFrame(animate)

  // 渲染
  renderer.render(scene, camera)
}
animate()
```

### 画布自适应

```js
// 监听窗口变化
window.addEventListener('resize', () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机投影矩阵
  camera.updateProjectionMatrix()
})
```

### 全屏

```js
const btn = document.createElement('button')
btn.innerHTML = '点击全屏'
btn.style.position = 'absolute'
btn.style.top = '10px'
btn.style.left = '10px'
btn.style.zIndex = '999'
btn.onclick = () => {
  renderer.domElement.requestFullscreen() // 这是 web 的 api，前边指的是哪个元素全屏
  // 退出全屏
  // document.exitFullscreen() // 这是 web 的 api
}
document.body.appendChild(btn)
```

## GUI 调试开发3D 效果

threejs 本身自带 GUI，lil-gui

有一些调试代码，可以使用 gui 来修改

```js
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

// 创建 gui
const gui = new GUI()
gui.add(eventObj, 'Fullscreen').name('全屏') // 第二个参数为属性名称
gui.add(eventObj, 'exitFullscreen').name('退出全屏') // 设置名称，没有 name()会显示属性名
```

### 调节 cube 的一些属性

```js
// 控制立方体位置
gui.add(cube.position, 'x', -10, 10, 0.01).name('立方体x轴位置')
// 另一种写法
// gui.add(cube.position, 'x').min(-10).max(10).step(1).name('立方体x轴位置')
```

编组

```js
// 控制立方体位置
const folder = gui.addFolder('立方体位置')
folder.add(cube.position, 'x').min(-10).max(10).step(1).name('立方体x轴位置').onChange((val) => { // 监听变化
  console.log(val);
})
folder.add(cube.position, 'y').min(-10).max(10).step(1).name('立方体y轴位置').onFinishChange(val => { // 调整结束时的监听
  console.log(val)
})
folder.add(cube.position, 'z').min(-10).max(10).step(1).name('立方体z轴位置')
```

调整布尔值

```js
// 设置材质为线框
material.wireframe = true

gui.add(material, 'wireframe').name('是否显示线框')
```

实际会自带判断是数值还是布尔值

### 颜色

```js
const colorsParams = {
  cubeColor: '#ff0000' // 或者0x00ff00也可以
}
gui.addColor(colorsParams, 'cubeColor').onChange((val) => {
  material.color.set(val)
})
```

## 常用类

根据不同名称，可在 threejs 的文档中搜索

### 几何体 Geometry

[几何体– three.js docs (threejs.org)](https://threejs.org/docs/index.html?q=geometry#api/zh/geometries/BoxGeometry)

* 立方缓冲几何体BoxGeometry，即四边形的原始几何类

* 平面缓冲几何体PlaneGeometry，用于生成平面几何体的类

### 材质Material

[材质 – three.js docs (threejs.org)](https://threejs.org/docs/index.html?q=Material#api/zh/geometries/PlaneGeometry)

* 基础网格材质MeshBasicMaterial，一个以简单着色（平面或线框）方式来绘制几何体的材质。

* 基础线条材质LineBasicMaterial，一种用于绘制线框样式几何体的材质。

### 纹理Texture

[Texture – three.js docs (threejs.org)](https://threejs.org/docs/index.html#api/zh/textures/Texture)

```js
// 创建纹理加载器
const textureLoader = new THREE.TextureLoader()
// 加载纹理
const texture = textureLoader.load('./textures/door/color.jpg')

const planeMeterial = new THREE.MeshBasicMaterial({ map: texture })
// 或planeMeterial.map = texture
```

### 雾

```js
const boxGeometry = new THREE.BoxGeometry(1, 1, 100)
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)

// 创建场景 雾
scene.fog = new THREE.Fog(0x999999, 0.1, 50)
// 创建场景 指数雾
scene.fog = new THREE.FogExp2(0x999999, 0.1)
// 设置场景背景，设置了背景，就更有雾的感觉,最好是雾的颜色与背景颜色一致
scene.background = new THREE.Color(0x999999)
```



## 加载模型

一个个新增物体并组合，很麻烦，所以直接 在建模软件上创建好，导入3D模型。

用的最多的是 GLTF格式，后缀为`.glb`（转为了二进制的模型数据）、`gltf`（json 格式模型数据）

three 中有 GLTF 加载器（GLTFLoader）

[50个最好的免费下载3D模型的网站（内附网址） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/40680702)

[Newsfeed - Sketchfab](https://sketchfab.com/feed)

[Poliigon - Textures, Models and HDRIs for 3D rendering](https://www.poliigon.com/)

```js
// 导入 GLTF 加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入环境贴图加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

// 实例化加载器
const gltfLoader = new THREE.GLTFLoader()
// 加载模型
gltfLoader.load(
  // 模型路径
  './model/scene.gltf',
  // 加载完成回调
  (gltf) => {
    // 默认都是基础材质，即没有灯光、贴图等，所以加载出来的物体是黑色的
    scene.add(gltf.scene) 
})

// 加载环境贴图（hdr）https://polyhaven.com/zh
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync(
  // 纹理路径
  './hdr/rostock_laage_airport_4k.hdr',
  // 加载成功回调函数，第三个参数是加载失败回调函数
  texture => {
    // 球面全景图映射。每个图可能映射不同，使用适合的映射
    texture.mapping = THREE.EquirectangularReflectionMapping
    // 设置环境贴图
    scene.environment = texture
  }
)
```

### 加载压缩过的模型DRACOLoader

一个用于加载经过Draco压缩的图形库

```js
// 导入 DRACO 加载器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// 实例化加载器
const dracoLoader = new DRACOLoader()
// 设置路径
dracoLoader.setDecoderPath('./draco/')
// 设置 gltf 加载器的draco 解码器
gltfLoader.setDRACOLoader(dracoLoader)
```



## 光线投射 Raycaster

用于三维空间场景中的交互事件

光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。

[Raycaster – three.js docs (threejs.org)](https://threejs.org/docs/index.html?q=Raycaster#api/zh/core/Raycaster)

```js

// 创建三个球
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
sphere1.position.set(-4, 0, 0)
scene.add(sphere1)

const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
sphere2.position.set(4, 0, 0)
scene.add(sphere2)

const sphere3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xff00ff })
)
sphere3.position.set(0, 0, 0)
scene.add(sphere3)


// 创建射线
const raycaster = new THREE.Raycaster()
// 创建鼠标向量
const mouse = new THREE.Vector2()
// 创建点击事件
document.addEventListener('click', onMouseClick, false)
function onMouseClick(event) {
  // 计算鼠标点击位置的归一化设备坐标（NDC）
  /*
   * 屏幕中心为(0, 0)，数值最大为1，以此建立坐标系，那么左上角为(-1, 1)，右下角为(1， -1)
   * 比如屏幕为1920x1080
   * 则 点击一个位置，浏览器从0开始，在横向上点x坐标就为 x/1920,但是在此场景下是中间为0则横向上是-1到1，这就是两倍，所以以0开始就是0到2为(x/1920)*2，那么这个数减去1则为从-1到1的
   * y的逻辑是相同的，但是 y 轴是1到-1，x 则是-1到1，所以y 轴实际上为-((y / 1080) * 2 - 1)
   */
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  // 通过摄像机和鼠标点击位置的NDC计算出射线与场景中的物体相交的点
  raycaster.setFromCamera(mouse, camera)
  // 计算物体和射线的焦点
  // 这里就是传数组的，但是如果加载了辅助坐标线，那么也算是一个物体，即3个球+1个辅助坐标，那么可以直接传入三个球的数组[sphere1, sphere2, sphere3]
  const intersects = raycaster.intersectObjects(scene.children) 
  if (intersects.length > 0) {
    // 如果有相交的物体，则改变其颜色,如果点击过则改回原本颜色
    const intersect = intersects[0]
    if (intersect.object._isSelected) {
      intersect.object.material.color.set(intersect.object._originColor)
      intersect.object._isSelected = false
      return
    }
    intersects[0].object._isSelected = true // 为当前增加自定义属性_isSelect表示是否点击过
    intersects[0].object._originColor = intersects[0].object.material.color.getHex() // 为当前增加自定义属性_originColor表示原颜色
    intersect.object.material.color.set(0xff0000)
  }
}
```



## 补间动画 tween

[tween.js 用户指南 | tween.js (tweenjs.github.io)](https://tweenjs.github.io/tween.js/docs/user_guide_zh-CN.html)

threejs 自带

补间（动画）（来自 [in-between](https://en.wikipedia.org/wiki/Inbetweening)）是一个概念，允许你以平滑的方式更改对象的属性。你只需告诉它哪些属性要更改，当补间结束运行时它们应该具有哪些最终值，以及这需要多长时间，补间引擎将负责计算从起始点到结束点的值。

```js
import * as TWEEN from 'three/examples/jsm/libs/tween.module'


const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
sphere1.position.set(-4, 0, 0)
scene.add(sphere1)

// 可以链式调用也可以单独调用
const tween = new TWEEN.Tween(sphere1.position)
  .to({ x: 4 }, 2000)
  .easing(TWEEN.Easing.Quadratic.InOut) // 运动方式 https://tweenjs.github.io/tween.js/examples/03_graphs.html
  .repeat(Infinity)
  .yoyo(true) // 往复，即来回动
	.delay(3000) // 延迟
	.onUpdate(() => {})
	.onStart(() => {})
  .onStop(() => {})
  .onComplete(() => {})

tween.start()

;(function animate() {
  requestAnimationFrame(animate)

  // 渲染
  renderer.render(scene, camera)
  
  tween.update()
})()
```

动画衔接

```js

const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
sphere1.position.set(-4, 0, 0)
scene.add(sphere1)

const tween = new TWEEN.Tween(sphere1.position)
  .to({ x: 4 }, 1000)
  .easing(TWEEN.Easing.Quadratic.InOut)

  
const tween2 = new TWEEN.Tween(sphere1.position)
  .to({ y: -4 }, 1000)

tween.chain(tween2)
  
tween.start()
;(function animate() {
  requestAnimationFrame(animate)

  // 渲染
  renderer.render(scene, camera)
  
  tween.update()
  tween2.update()
})()
```



## UV

在3D 计算机图形学中，UV 映射是一种将2D 纹理映射到3D 模型表面的方法。在这里，“U”和“V”代表了2D 纹理空间的坐标，这与2D 笛卡尔坐标系统中的“X”和“Y”是类似的。



## 法向

在3D 计算机图形学中，“法向量”是一个向量，表示3D 模型表面在某一点的方向。在每个顶点上，都会有一个关联的法向量，这个向量通常被归一化，也就是说它的长度为1。

跟物体的反射有关，如果没有反射，就是没有法向量。

```js
// 计算出法向量
geometry.computeVertexNormals()
```



```js
// 导入顶点法向量辅助器
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js'

// 看某一个物体的法向量，就在那个物体创建方向量辅助器
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
sphere1.position.set(-4, 0, 0)
scene.add(sphere1)
// 创建法向量辅助器传入物体、法向量长度、颜色
const helper = new VertexNormalsHelper(sphere1, 2) 
scene.add(helper)
```



## 几何体顶点转化

[Object3D – three.js docs (threejs.org)](https://threejs.org/docs/index.html?q=obj#api/zh/core/Object3D)



## 包围盒

比如有一个鸭子，点击这个鸭子，周围会出现一个立方体包裹鸭子，这个立方体就是包围盒。比如实现碰撞盒。

包围盒是所有几何体([BufferGeometry – three.js docs (threejs.org)](https://threejs.org/docs/index.html?q=buffer#api/zh/core/BufferGeometry))都有的属性。`.boundingBox`(立方体)，`.boundingSphere`（球体）。如果模型没有给包围盒的化，就需要先找到这个物体（[Object3D – three.js docs (threejs.org)](https://threejs.org/docs/index.html#api/zh/core/Object3D)）比如根据 id 或者 name 获取，来调用方法计算`.computeBoundingBox`、`.computeBoundingSphere`

```js
gltfLoader.load(
  // 模型路径
  './model/scene.gltf',
  // 加载完成回调
  (gltf) => {
    const duckMesh = gltf.scene.getObjectByName('LOD3spShape')
    const duckGeometry = duckMesh.geometry
    // 计算包围盒
    duckGeometry.computeBoundingBox()
    // 获取包围盒
    const duckBox = duckGeometry.boundingBox
    // 创建包围盒辅助器
    const boxHelper = new THREE.Box3Helper(duckBox, 0xffff00)
    scene.add(boxHelper)
    
    // -----------分割线---------
    // 获取包围球
    const duckSphere = duckGeometry.boundingSphere
    // 创建包围球辅助器
    const sphereHelper = new SphereHelper(duckSphere, 0xffff00)
})
```

如果看到包围盒很大，那就看看这个物体有没有缩放、旋转等，物体的父级有没有缩放等，所以需要计算、更新世界矩阵`Object3D.updateMatrix()`等方法

```js
// 更新世界矩阵
duckMesh.updateWorldMatrix(true, true)
// 更新包围盒（将包围盒转换到世界坐标系）
duckBox.applyMatrix4(duckMesh.matrixWorld)
```



### 获取多个物体组合的包围盒

思路是获取每个物体的包围盒，每个包围盒拼成一个最大的包围盒。

[Box3 – three.js docs (threejs.org)](https://threejs.org/docs/index.html?q=box3#api/zh/math/Box3)

### .[union](https://threejs.org/docs/index.html#api/zh/math/Box3.union) ( box : [Box3](https://threejs.org/docs/index.html#api/zh/math/Box3) ) : this

[box](https://threejs.org/docs/index.html#api/zh/math/Box3) - 将被用于与该盒子计算并集的盒子。

在 [box](https://threejs.org/docs/index.html#api/zh/math/Box3) 参数的上边界和已有box对象的上边界之间取较大者，而对两者的下边界取较小者，这样获得一个新的较大的联合盒子。

```js
// 创建三个球
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
sphere1.position.set(-4, 0, 0)
scene.add(sphere1)

const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
sphere2.position.set(4, 0, 0)
scene.add(sphere2)

const sphere3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xff00ff })
)
sphere3.position.set(0, 0, 0)
scene.add(sphere3)

const box = new THREE.Box3()
// scene.children爻注意，在此之前是否添加了别的辅助器，如果有的话，也会在 children 中，那么最好这里是创建只有这三个球的数组，用这个数组替换scene.children。const arrSphere = [sphere1, sphere2, sphere3]
for(let i = 0; i < scene.children.length; i++) {
  // 计算当前物体包围盒
  scene.children[i].geometry.computeBoundingBox()
  // 获取包围盒
  const box3 = scene.children[i].geometry.boundingBox
  // 更新世界矩阵
  scene.children[i].updateWorldMatrix(true, true)
  // 将包围盒转换到世界坐标系
  box3.applyMatrix4(scene.children[i].matrixWorld)
  
  // -------分割线---------
  // 或者也可以直接使用.setFromObject,会自动计算实际坐标，这种方法更便捷
  const box3 = new THREE.Box3().setFromObject(scene.children[i])
  
  // ---------------分割线---------------
  // 合并包围盒
  box.union(box3)
}
// 创建包围盒辅助器
const boxHelper = new THREE.Box3Helper(box, 0xffff00)
scene.add(boxHelper)
```







## 几何体居中与获取几何体中心

使包围盒的中心点跑到坐标原点就居中了，包围盒的中心点就是物体的中心点。

```js
  // 模型路径
  './model/scene.gltf',
  // 加载完成回调
  (gltf) => {
    // ...
    // 计算包围盒
    duckGeometry.computeBoundingBox()
    // 设置包围盒居中
    duckGeometry.center()
    
    // 更新包围盒
		duckBox.applyMatrix4(duckMesh.matrixWorld)
    // 获取包围盒中心点
    const center = duckBox.getCenter(new THREE.Vector3()) // 此时中心点是0，0，0因为设置了居中
    
    // ...
})
```



## 边缘几何体与线框几何体

在 threejs 中，爻使物体使用线框的方式展示的话，有两种类实现：

[WireframeGeometry – three.js docs (threejs.org)](https://threejs.org/docs/index.html?q=WireframeGeometry#api/zh/geometries/WireframeGeometry)这种方式实际是直接使用线框材质



另一种就是边缘几何体[EdgesGeometry – three.js docs (threejs.org)](https://threejs.org/docs/index.html?q=Edge#api/zh/geometries/EdgesGeometry)





## 3D建模工具

[Download — blender.org](https://www.blender.org/download/)