# 组件库（业务组件封装）

> Element Plus 之上的业务组件封装。**文档与同目录源码一一对应**：每个组件目录里既有 `.md` 文档，也有实现代码；改代码必须同步改文档里的「源码」章节。

## 目录

| 组件 | 文档 | 源码 | 说明 |
| --- | --- | --- | --- |
| CompTable 通用表格 | [通用表格组件](element-plus/通用表格组件/通用表格组件.md) | `通用表格组件/CompTable/`（8 个文件） | 列声明插槽、格式化、分组表头、树形、列显隐持久化 |
| CompSelect 通用选择抽屉 | [CompSelect](element-plus/通用选择抽屉/CompSelect.md) | `通用选择抽屉/CompSelect/`（3 个文件） | 抽屉 + 搜索 + 表格的选择器，跨页选择、动态主键 |
| 树选择 | [树选择完整例子](element-plus/通用选择抽屉/树选择完整例子.md) | 参考 `CompSelect/` | 父子联动、仅末级、前端过滤的完整实现 |
| TableSearch 搜索区 | [公共表格搜索](element-plus/公共表格搜索/公共表格搜索search.md) | 源码内嵌于文档 | 搜索表单 + 查询/重置/返回，支持纵向布局与 `rules` 校验 |
| CommonSearchItem 搜索子项 | [CommonSearchItem](element-plus/公共表格搜索/公共表格搜索子项CommonSearchItem.md) | `公共表格搜索/CommonSearchItem/`（9 个文件） | 一份 `options` 渲染一排搜索控件 |
| CompForm 表单展示切换 | [CompForm](element-plus/通用表单编辑态和展示切换组件/CompForm.md) | `通用表单编辑态和展示切换组件/CompForm/`（3 个文件） | 编辑态 / 展示态一键切换 |
| Preview 文件预览 | [文件预览](element-plus/通用预览组件/文件预览.md) | `通用预览组件/Preview/`（5 个文件）+ `file-viewer.ts` | 图片 / PDF / Word / Excel 预览 |
| Drawer 抽屉 | [公共组件抽屉](element-plus/公共组件抽屉Drawer.md) | 源码内嵌于文档 | header 固定 / 内容滚动、宽度自适应、嵌套递减、save/cancel |
| 预览（历史） | [预览](element-plus/预览.md) | —— | 基于 `@vue-office` 的旧方案，仅留对比 |
| 其他 | [tabs](element-plus/tabs.md)（动态页签：子组件切换 + defineExpose 统一刷新）、[tree 与 form 配合](element-plus/tree与form配合.md)、[金额输入框与展示](element-plus/金额输入框与展示.md) | —— | 页面级用法片段 |

## 若依页面组件

`若依/` 下是若依 Vue3 + TS 版本里的页面级组件改造记录（TreePanel 右键菜单、动态路由问题、vue-draggable 拖拽标签页），模块源码在 `若依/vue3+ts版本/`。

## 维护约定

1. 组件文档结构：概述 → API（Props / 事件 / 插槽）→ 使用示例 → 源码 → 注意事项。
2. 「源码」章节与目录内文件**逐字一致**（含注释），便于直接复制；不要只贴片段。
3. 组件行为变更时，同步更新「关键机制 / 注意事项」，不要只换代码块。
4. 多个相似封装存在时（如两套预览方案），文档里必须写清哪套是现行方案。
