# Process 流程设计器（bpmn-js）

> 若依 Vue3 + TS 版本里的流程设计器组件使用手册：界面结构、导入导出、核心模块与常用 API。
>
> 源码在同目录：`panel/` 属性面板、`customPanel/` 自定义面板、`common/` 公共方法、`flowable/` flowable 配置、`lang/` 国际化。

## 目录

- [界面布局结构](#界面布局结构)
- [导入与导出](#导入与导出)
- [内部模块 / 供应商 / 服务](#内部模块--供应商--服务)
- [获取一个模块](#获取一个模块)
- [事件总线 - eventBus](#事件总线---eventbus)
- [画布 - canvas](#画布---canvas)
- [元素注册表 - elementRegistry](#元素注册表---elementregistry)
- [模型 - moddle](#模型---moddle)
- [建模器 - modeling](#建模器---modeling)

## 界面布局结构

- `palette`（工具栏）：拖拽工具、框选工具、连线工具、基本图元
- `contextPad`（上下文面板）：可理解为快捷面板
- `propertiesPanel`（属性面板）：定义流程图中图形元素的属性
- `shape`（图形）：所有图形的基类（如 `Connection`、`Root`）

## 导入与导出

```ts
// 导入：异步方式（推荐）
let result = await bpmnModeler.importXML(xml)

// 导入：回调方式
bpmnModeler.importXML(xml, (result) => {})

// 导出 xml：异步方式
let { xml } = await bpmnModeler.saveXML()

// 导出 xml：回调方式
bpmnModeler.saveXML({ format: false }, ({ xml }) => {})

// 格式化导出的 xml
let { xml } = await bpmnModeler.saveXML({ format: true })

// 导出 svg：异步方式
let { svg } = await bpmnModeler.saveSVG()

// 导出 svg：回调方式
bpmnModeler.saveSVG(({ svg }) => {})
```

### 导入生命周期事件

| 事件 | 时机 |
| --- | --- |
| `import.parse.start` | 即将从 xml 读取模型 |
| `import.parse.complete` | 模型读取完成 |
| `import.render.start` | 图形导入开始 |
| `import.render.complete` | 图形导入完成 |
| `import.done` | 全部完成 |

## 内部模块 / 供应商 / 服务

- `eventBus`：事件总线，管理 bpmn 实例中所有事件
- `canvas`：画布，管理 svg 元素、连线/图形的添加删除、缩放等
- `commandStack`：命令堆栈，管理 bpmn 内部所有命令操作，提供撤销/重做
- `elementRegistry`：元素注册表，管理 bpmn 内部所有元素
- `moddle`：模型管理，用于管理 bpmn 的 xml 结构
- `modeling`：建模器，绘图时用到，提供更新画布元素的 API（移动、删除）
- `selection`、`alignElements`：选集与对齐工具

## 获取一个模块

```ts
// 第一个参数为模块名称，第二个参数表示是否严格模式
bpmnModeler.get('模块名称', false)
```

## 事件总线 - eventBus

```ts
// 获取事件总线模块
let eventBus = bpmnModeler.get('eventBus')

// 监听事件
eventBus.on('element.changed', (ev) => {})

// 监听多个事件
eventBus.on(
  ['shape.added', 'connection.added', 'shape.removed', 'connection.removed'],
  (ev) => {}
)

// 设置优先级
eventBus.on('element.changed', 100, (ev) => {})

// 传入上下文
eventBus.on('element.changed', (ev) => {}, that)

// 完整签名
eventBus.on('事件名称', 优先级（可选）, 回调函数, 上下文（可选）)
```

### 只监听一次事件

```ts
// 用法同 on
eventBus.once('事件名称', 优先级（可选）, 回调函数, 上下文（可选）)
```

### 取消监听事件

```ts
// 取消监听
eventBus.off('element.changed', callback)

// 取消监听多个事件
eventBus.off(
  ['shape.added', 'connection.added', 'shape.removed', 'connection.removed'],
  callback
)
```

### 触发事件

```ts
eventBus.fire('element.changed', data)
```

## 画布 - canvas

```ts
// 获取画布模块
let canvas = bpmnModeler.get('canvas')
```

### 缩放

```ts
/**
 * @param {'fit-viewport' | 'fit-content' | number} lvl
 * @param {'auto' | { x: number, y: number }} center
 */
function zoom(lvl, center) {
  const canvas = bpmnModeler.get('canvas')
  canvas.zoom(lvl, center)
}

// 适应容器缩放
zoom('fit-viewport', 'auto')

// 完全显示内容
zoom('fit-content', 'auto')
```

### 对齐（选择多个元素用 shift + 鼠标左键）

```ts
/**
 * 获取当前选集并对齐
 * @param {'left'|'right'|'top'|'bottom'|'middle'|'center'} mode
 */
function align(mode) {
  const align = bpmnModeler.get('alignElements')
  const selection = bpmnModeler.get('selection')
  const elements = selection.get()
  if (!elements || elements.length === 0) {
    return
  }
  align.trigger(elements, mode)
}
```

## 元素注册表 - elementRegistry

```ts
// 获取元素注册表模块
let elementRegistry = bpmnModeler.get('elementRegistry')

// 遍历所有元素
elementRegistry.forEach((shape, svgElement) => {})

// 获取指定元素
let shape = elementRegistry.get(元素id或者SVGElement)

// 获取过滤后的元素
let shapes = elementRegistry.filter((shape) => shape.type === 'bpmn:Task')

// 更新元素 ID
elementRegistry.updateId(shape, '123xxxxsssd')

// 删除一个元素
elementRegistry.remove(传入SVGElement)
```

## 模型 - moddle

```ts
let moddle = bpmnModeler.get('moddle')
```

实际项目基本没用到，需要读/改 XML 结构时再查 bpmn-js 的 moddle 文档。

## 建模器 - modeling

```ts
// 获取建模器模块
let modeling = bpmnModeler.get('modeling')
```

### 修改元素显示文本（常用）

```ts
modeling.updateLabel(shape, '审核')
```

### 修改元素属性（常用）

```ts
modeling.updateProperties(shape, { 属性名称: 属性值 })
```

### 对齐元素集合

```ts
const selection = bpmnModeler.get('selection')
const elements = selection.get()
modeling.updateProperties(elements, 'left')
```
