---
title: "通用选择抽屉 CompSelect"
---

> 把「抽屉 `CompDrawer` + 搜索区 `CompTableSearch`/`CommonSearchItem` + 表格 `CompTable`」三件套封装成一个**表格选择器**：
> 跨页选择、动态主键、单选/多选/不限数量、搜索与分页、自定义搜索控件、自定义列单元格都已内置。

## 目录

- [概述](#概述)
- [目录结构](#目录结构)
- [快速上手](#快速上手)
- [组件 API](#组件-api)
  - [Props](#props)
  - [v-model 与事件](#v-model-与事件)
  - [只读模式（selectable=false）](#只读模式selectablefalse)
  - [插槽](#插槽)
  - [columns 配置](#columns-配置)
- [关键机制](#关键机制)
  - [列配置与内置操作列](#列配置与内置操作列)
  - [单元格插槽：useCompTable + CompTableColumn](#单元格插槽usecomptable--comptablecolumn)
  - [跨页选择的三个角色](#跨页选择的三个角色)
  - [树形选择模式](#树形选择模式)
  - [maxLength 的三种语义](#maxlength-的三种语义)
  - [请求、分页与搜索](#请求分页与搜索)
  - [打开回填](#打开回填)
  - [插槽转发规则](#插槽转发规则)
- [使用示例](#使用示例)
  - [基础：核算账簿多选](#基础核算账簿多选)
  - [单选](#单选maxlength--1)
  - [动态主键](#动态主键keys)
  - [自定义搜索控件](#自定义搜索控件)
  - [自定义单元格](#自定义单元格)
  - [树形数据](#树形数据)
- [与旧版写法的差异](#与旧版写法的差异)
- [注意事项](#注意事项)
- [源码](#源码)
  - [index.vue](#indexvue)
  - [types.ts](#typestts)
  - [index.ts](#indexts)
  - [useSelect.ts](#useselectts)

## 概述

- **一套配置、两种数据**：搜索区用 `columns.search`，表格用 `columns.table`，其余全部由组件托管。
- **跨页选择**：翻页、搜索、重新查询都不会丢失已选数据，主键由 `keys` 指定（支持复合主键 `id-type`）。
- **行内按钮选择**：表格不展示勾选列，操作列给每行一个「选择 / 取消」按钮，避免与业务表格的勾选语义冲突。
- **数量约束**：`minLength` / `maxLength` 由 `useSelect` 统一校验，`maxLength = 1` 即单选，`maxLength = 0` 表示不限。
- **懒请求**：抽屉打开时才请求列表（`useListQuery` 的 `enabled`），组件挂载不空跑接口。
- **插槽全透传**：组件上写的具名插槽会同时转发给搜索区与表格，搜索控件、单元格都能在一个组件里定制。

## 目录结构

```
通用选择抽屉/
├── CompSelect/
│   ├── index.vue     # 组件实现（模板 + 选择逻辑装配）
│   ├── index.ts      # props 默认值工厂 compSelectProps(omit?)
│   └── types.ts      # 对外类型 CompSelectProps / CompSelectColumn
├── CompSelect.md     # 本文档
└── 树选择完整例子.md  # 树形数据 + 父子联动的完整实现
```

## 快速上手

```vue
<template>
  <CompSelect
    v-model="show"
    title="核算账簿"
    :selected="form.accountingBooksList"
    keys="accountingBooksId"
    :query="query"
    :query-key="queryKey"
    :api-fn="apiFn"
    :columns="columns"
    @change="handleChange" />
</template>

<script lang="ts" setup>
  const show = ref(false)

  /** 搜索条件：字段与 columns.search.options 的 prop 一一对应 */
  const query = reactive({ accountingBooksCode: '', accountingBooksName: '' })

  const queryKey = (q?: any) => queryKeys.basicPlatform.accountBook.list(q)
  const apiFn = (q?: any) => listCheckedAccountBook(q ?? {})

  const columns = {
    search: {
      attr: { labelWidth: 0 },
      options: [
        { prop: 'accountingBooksCode', label: '账簿编码' },
        { prop: 'accountingBooksName', label: '账簿名称' },
      ],
    },
    table: {
      attr: { index: true },
      options: [
        { prop: 'accountingBooksCode', label: '账簿编码' },
        { prop: 'accountingBooksName', label: '账簿名称' },
      ],
    },
  }

  const handleChange = (rows: any[]) => {
    form.accountingBooksList = rows
  }
</script>
```

`change` 触发后抽屉已自动关闭（`useSelect.handleSave` 会 `emit('update:modelValue', false)`），配合 `v-model` 无需手动置 `show = false`。

> 示例省略了 `CompSelect`、`queryKeys` 以及项目 API/类型的 import（按各自项目的约定引入或自动导入）。

## 组件 API

### Props

| prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `'选择'` | 抽屉标题 |
| `tip` | `string` | — | 标题右侧红字提示，如「最多选择 5 个」 |
| `zIndex` | `number` | `1` | 弹窗层级；嵌套在其他抽屉里要调大 |
| `selected` | `Partial<R>[]` | `[]` | 回显数据，**可只带主键**（如 `[{ id: 1 }]`） |
| `minLength` | `number` | `1` | 最少选择数量，保存时校验 |
| `maxLength` | `number` | `500` | 最大选择数量；`1` = 单选，`0` = 不限 |
| `disabledRow` | `(row: Partial<R>) => boolean` | `() => false` | 禁止选择的行（按钮置灰） |
| `treeSelection` | `'all' \| 'leaf' \| 'cascade'` | `'all'` | 树形选择模式：父子都可选 / 只选子级 / 父子联动 |
| `includeChildren` | `boolean` | `false` | cascade 时结果是否包含全部后代；false 只保留最上层被选节点 |
| `query` | `T` | `{}` | 初始搜索条件；变化时会同步进 `list.query` |
| `keys` | `string` | `'id'` | 跨页选择主键；复合主键用 `-` 连接，如 `id-type` |
| `selectable` | `boolean` | `true` | 是否选择模式；`false` 时仅查看，隐藏选择按钮、已选/批量操作和保存按钮 |
| `columns` | `CompSelectColumn<T, R>` | 必传 | 搜索项 + 表格列配置，见下文 |
| `apiFn` | `(query?: T & ListBaseQuery) => Promise<ListResult>` | 必传 | 列表接口，兼容 `AjaxResult` / `TableDataInfo` / 纯数组 |
| `queryKey` | `QueryKey \| ((query) => QueryKey)` | 必传 | vue-query 的 key 或 key 工厂，建议按查询条件生成 |
| `showPagination` | `boolean` | `true` | 是否显示分页（树形/不分页接口传 `false`） |
| `showResetBtn` | `boolean` | `true` | 搜索区是否显示重置按钮 |
| `showDrawerSaveBtn` | `boolean` | `true` | 抽屉是否显示保存按钮 |

### v-model 与事件

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `v-model` | `boolean` | 抽屉显隐 |
| `change` | `(selected: R[]) => void` | 保存时抛出的已选数据（已按主键去重、当前页行取最新对象） |

### 只读模式（selectable=false）

```vue
<CompSelect
  v-model="show"
  :selectable="false"
  ... />
```

- 不显示保存按钮；
- 不显示右侧「已选 N 条 / 全选本页 / 清除本页 / 清除所有」；
- 不渲染内置操作列；
- 打开时不回填 `selected`，只做查看；
- 消费方自己的操作列仍可通过 `#default` 渲染。

### 插槽

| 名称 | 作用域 | 说明 |
| --- | --- | --- |
| `default` | — | 列声明插槽，写 `CompTableColumn`；同名 `action` 列与内置选择按钮合并渲染 |
| 其余任意具名插槽 | 由下游组件决定 | 同时转发给 `CommonSearchItem`（搜索区）和 `CompTable`（列插槽），见[插槽转发规则](#插槽转发规则) |

> 插槽只对 `columns` 里**已声明**的 `prop` 生效：列不存在时插槽不会被调用。

### columns 配置

```ts
interface CompSelectColumn<T, R extends DefaultRow> {
  search: {
    attr: Partial<CommonSearchItemProps<T>>      // 传给 CommonSearchItem 的额外属性
    options: CommonSearchItemOptions<T>[]        // 搜索项
  }
  table: {
    attr: Partial<CompTableProps<T, R>>          // 传给 CompTable 的额外属性（index、defaultExpandAll…）
    options: TableColumn<R>[]                    // 表格列
  }
}
```

## 关键机制

### 列配置与内置操作列

```ts
const consumerOptions = props.columns.table.options
const hasAction = consumerOptions.some(col => col.prop === 'action')
const tableOptions: TableColumn<R>[] =
  props.selectable && !hasAction
    ? [...consumerOptions, { prop: 'action', label: '操作', width: 100, fixed: 'right' }]
    : consumerOptions
```

- 选择模式且消费方没有 `action` 列时，自动追加一列操作列（固定右侧）；
- 消费方已声明 `action` 列时直接复用其配置（label / width / fixed 可自定义），不再额外追加，避免重复列；
- 内置选择按钮通过 `<CompTableColumn prop="action">` 提供，消费方同名的 `action` 列通过 `column-slot-mode="merge"` 合并渲染；
- 只读模式（`selectable=false`）不追加、不渲染内置操作列。

### 单元格插槽：useCompTable + CompTableColumn

当前 `CompTable` 的列来自 `useCompTable()` 注册（`columns` 已不是 `CompTable` 的 prop），因此操作列的内容用列声明插槽提供：

```ts
const { CompTableColumn } = useCompTable(computed(() => localColumns.value.table.options))
```

```vue
<CompTable
  v-model:list="list"
  :selectable="false"
  column-slot-mode="merge"
  v-bind="localColumns.table.attr"
  :loading="list.loading">
  <CompTableColumn
    v-if="selectable"
    prop="action">
    <template #default="{ row }">
      <el-button v-if="!includesRow(row)" ... @click="handleChecked(row, 1)">选择</el-button>
      <el-button v-else ... @click="handleChecked(row, 2)">取消</el-button>
    </template>
  </CompTableColumn>

  <slot name="default" />
</CompTable>
```

`TableColumn` 已经没有 `slot` 字段，旧写法 `{ prop: 'action', slot: true }` + `#col-action` 不再生效。

### 跨页选择的三个角色

| 角色 | 职责 | 说明 |
| --- | --- | --- |
| `useListQuery` | 查数据、分页、loading | **只做请求**，行对象保持接口原始引用，不回写 `checked` |
| `useCheckAll` | 已选数据容器 | 仅用它的 `selected`，因为表格没有勾选列，不需要回写行状态 |
| `useSelect` | 全部选择逻辑 | 主键比较（支持动态 `keys`）、单选/上限替换、全选本页/清除本页、保存校验与 `change` 事件 |

```ts
const checkAll = useCheckAll<T, Partial<R>>(props.keys)
const { isChecked, handleChecked, handleRemove, handleRemovePage, handleSelectedPage, handleSave, includesRow }
  = useSelect<T, Partial<R>>(props, { emit }, checkAll, list, checkedKeys)
```

- 主键比较统一走 `rowKeyOf`（`useCheckAll` 导出的工具），复合主键语义与表格全选保持一致。
- `checkedKeys` 是 `computed(() => props.keys)`：父组件运行时切换主键（如 `id` → `dept_id`）会立即生效。
- 已选主键在 `useSelect` 内部用 **reactive Set 增量同步**，`includesRow` 是 O(1)，不会逐行扫已选数组；选择一行只触发该行相关依赖。
- `watch` 用 `pre`（渲染前）同步集合，避免 `sync` 在渲染过程中改集合触发额外更新。

### 树形选择模式

树形数据需要同时配置：

```ts
const columns = {
  // ...
  table: {
    attr: {
      keys: 'id',
      treeProps: { children: 'children' },
    },
    // ...
  },
}
```

`CompSelect` 会从 `columns.table.attr.treeProps.children` 取子节点字段，透传给 `useSelect`。

| `treeSelection` | 行为 |
| --- | --- |
| `all`（默认） | 行级选择；父子互不影响，父级也可选 |
| `leaf` | 只允许选择叶子节点；父级操作列显示 `-`，不可选 |
| `cascade` | 父子联动：选父级自动选中全部后代，取消同理；子级全选时自动补父级 |

`cascade` 的保存结果由 `includeChildren` 控制：

- `false`（默认）：只返回**最上层被选中节点**，避免选父级后产生大量子级标签；
- `true`：父级与全部后代都返回。

打开抽屉时会对已选数据做一次归一化：

- `leaf`：去掉已选中的父级；
- `cascade`：用当前树补齐后代 / 父级，再按 `includeChildren` 收敛结果。

`maxLength` 校验按收敛后的结果数量计算，而不是内部展开的节点数。

### maxLength 的三种语义

| `maxLength` | 交互 |
| --- | --- |
| `0` | 不限数量，已选数量只显示数字 |
| `1` | 单选：点某行「选择」立即保存并关闭；不显示「清除所有 / 全选本页」按钮组 |
| `n > 1` | 多选：达到 `n` 条立即保存并关闭；若已选数量本就超出上限（父组件传多了），再选新行会移除末位为新选择腾位 |

保存时 `useSelect` 还会校验 `minLength` / `maxLength`，不满足则 `useError` 提示且不关闭抽屉。

### 保存性能

- 已选对象全部来自当前页时走快路径：用 `WeakSet` 判断后直接 `selected.slice()`，不再对整页行做 `rowKeyOf` 的 JSON 序列化；
- 跨页 / 列表已刷新时才按主键建 `Map` 回填最新行对象；
- 返回新数组，保持 `change` 参数的独立性。

### 请求、分页与搜索

```ts
const { list, getList, resetList } = useListQuery<T, R>(
  computed(() => ({ ...props.query })),
  props.queryKey,
  props.apiFn,
  { enabled: computed(() => show.value) }   // 抽屉打开才请求
)
```

- `getList` 就是 `refetch`，分页组件 `@pagination="getList"` 直接生效。
- 搜索：`list.query.pageNum = 1` 后 `getList()`，避免停留在越界页码。
- 重置：`resetList()` 会把 `query` 还原成 `props.query` + 分页字段，并清空 `items/total`，再重新搜索。
- 接口返回 `rows` / `data` / 纯数组都能解析；`total` 缺失按 `0` 处理。

### 打开回填

```ts
const handleOpen = () => {
  checkAll.selected.value = props.selected.slice()   // 拷贝，避免直接改父组件数组
  if (!list.items.length) handleSearch()             // 首次打开才请求
}
watch(show, val => { if (val) handleOpen() })
```

回显数据可以只带主键，`includesRow` 比较的是主键而不是整个对象。

### 插槽转发规则

- `forwardedSlots = Object.keys(slots).filter(name => name !== 'default')`，这些插槽会**同时**转发给 `CommonSearchItem` 和 `CompTable`。
- `default` 被排除并在 `<CompTable>` 内以 `<slot name="default" />` 渲染，这样消费方的 `<CompTableColumn>` 与内置操作列不会互相覆盖。
- 转发给搜索区时会额外注入 `:query`（即 `props.query`），供自定义控件双向绑定。

## 使用示例

### 基础：核算账簿多选

```vue
<template>
  <el-button type="primary" @click="show = true">选择核算账簿</el-button>

  <CompSelect
    v-model="show"
    title="核算账簿"
    tip="最多选择 5 个"
    :selected="form.accountingBooksList"
    :max-length="5"
    keys="accountingBooksId"
    :query="query"
    :query-key="checkedQueryKey"
    :api-fn="apiFn"
    :columns="compSelectColumns"
    @change="handleChange" />
</template>

<script lang="ts" setup>
  import type { CompSelectColumn } from '@/components/CompSelect/types'

  import { check_accountbook_nature } from '@/utils/dict'

  const show = ref(false)
  const form = reactive({ accountingBooksList: [] as CheckedAccountBook[] })

  /** 搜索条件：预先声明所有搜索字段，resetList 才能正确复位 */
  const query = reactive<CheckedAccountBookQueryParams>({
    accountingBooksNature: '',
    accountingBooksCode: '',
    accountingBooksName: '',
  })

  /** 每个查询条件一个 key，避免不同条件命中同一份缓存 */
  const checkedQueryKey = (q?: CheckedAccountBookQueryParams & ListBaseQuery) =>
    queryKeys.basicPlatform.accountBook.list(q)

  const apiFn = (q?: CheckedAccountBookQueryParams & ListBaseQuery) => listCheckedAccountBook(q ?? {})

  const compSelectColumns: CompSelectColumn<CheckedAccountBookQueryParams, CheckedAccountBook> = {
    search: {
      attr: { labelWidth: 0 },
      options: [
        {
          prop: 'accountingBooksNature',
          label: '核算账簿性质',
          type: 'select',
          props: { data: check_accountbook_nature },
        },
        { prop: 'accountingBooksCode', label: '账簿编码' },
        { prop: 'accountingBooksName', label: '账簿名称' },
      ],
    },
    table: {
      attr: { index: true },
      options: [
        {
          prop: 'accountingBooksNature',
          label: '核算账簿性质',
          format: { type: 'dict', formatStr: check_accountbook_nature },
        },
        { prop: 'accountingBooksCode', label: '账簿编码' },
        { prop: 'accountingBooksName', label: '账簿名称' },
      ],
    },
  }

  const handleChange = (rows: CheckedAccountBook[]) => {
    form.accountingBooksList = rows
  }
</script>
```

### 单选（maxLength = 1）

```vue
<CompSelect
  v-model="show"
  title="选择核算账簿"
  :selected="form.accountingBooksId ? [{ accountingBooksId: form.accountingBooksId }] : []"
  :max-length="1"
  keys="accountingBooksId"
  :query-key="checkedQueryKey"
  :api-fn="apiFn"
  :columns="compSelectColumns"
  @change="rows => (form.accountingBooksId = rows[0]?.accountingBooksId)" />
```

点「选择」即保存关闭；此时组件内不渲染「清除所有 / 全选本页」按钮组。

### 动态主键（keys）

`keys` 支持运行时切换，父组件用 `computed` 传入即可：

```vue
<script lang="ts" setup>
  /** 按部门选择时主键换成 dept_id */
  const keys = computed(() => (props.scene === 'dept' ? 'dept_id' : 'id'))
</script>

<template>
  <CompSelect :keys="keys" v-bind="rest" />
</template>
```

此时 `selected`、去重、`includesRow`、全选/清除本页全部按新主键计算，无需重建组件。

### 自定义搜索控件

搜索项配置里标 `slot: true`，再用 `#control-<prop>` 接管控件；插槽可拿到 `query`：

```vue
<CompSelect :query="query" v-bind="rest">
  <template #control-accountingBooksCode="{ query }">
    <el-select v-model="query.accountingBooksCode" clearable filterable placeholder="选择编码">
      <el-option v-for="item in codeOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </template>
</CompSelect>
```

```ts
const compSelectColumns = {
  search: {
    attr: {},
    options: [
      { prop: 'accountingBooksCode', label: '账簿编码', type: 'select', slot: true },
      { prop: 'accountingBooksName', label: '账簿名称' },
    ],
  },
  // table 省略…
}
```

> 插槽里的 `query` 就是 `props.query`：`useListQuery` 会监听它并把非分页字段同步进 `list.query`，所以自定义控件改完 `query` 直接点搜索即可生效。

### 自定义单元格

插槽名与 `CompTable` 的列声明一致（`prop` 需已在 `columns.table.options` 中声明）：

```vue
<CompSelect v-bind="rest">
  <CompTableColumn prop="accountingBooksName">
    <template #default="{ row }">
      <el-tag :type="row.accountingBooksNature === '1' ? 'success' : 'info'">
        {{ row.accountingBooksName }}
      </el-tag>
    </template>
  </CompTableColumn>
</CompSelect>
```

### 树形数据

`columns.table.attr` 透传 `CompTable` 的树形属性，`treeSelection` 控制选择规则。

#### 行级选择（默认）

```vue
<CompSelect
  v-model="show"
  title="归口科室"
  keys="id"
  :selected="selected"
  :max-length="0"
  :show-pagination="false"
  :query-key="() => queryKeys.rollDept.tree()"
  :api-fn="q => treeRollDept(q)"
  :columns="columns"
  @change="handleChange" />
```

- 父子互不影响，父级也可选；
- 适合只需要行 ID、不要求层级语义的场景。

#### 只选叶子：treeSelection="leaf"

```vue
<CompSelect
  v-model="show"
  title="选择末级科室"
  keys="id"
  tree-selection="leaf"
  :selected="selected"
  :max-length="0"
  :show-pagination="false"
  :query-key="() => queryKeys.rollDept.tree()"
  :api-fn="q => treeRollDept(q)"
  :columns="columns"
  @change="handleChange" />
```

- 父级操作列显示 `-`，点击父级不会选中；
- 已选数据里如果带了父级，打开抽屉时会自动去掉；
- `maxLength` 只统计叶子节点。

#### 父子联动：treeSelection="cascade"

```vue
<!-- 选父级后，保存结果只返回父级 -->
<CompSelect
  v-model="show"
  title="选择科室"
  keys="id"
  tree-selection="cascade"
  :selected="selected"
  :max-length="0"
  :show-pagination="false"
  :query-key="() => queryKeys.rollDept.tree()"
  :api-fn="q => treeRollDept(q)"
  :columns="columns"
  @change="handleChange" />

<!-- 选父级后，保存结果返回父级 + 全部后代 -->
<CompSelect
  v-model="show"
  title="选择科室"
  keys="id"
  tree-selection="cascade"
  :include-children="true"
  :selected="selected"
  :max-length="0"
  :show-pagination="false"
  :query-key="() => queryKeys.rollDept.tree()"
  :api-fn="q => treeRollDept(q)"
  :columns="columns"
  @change="handleChange" />
```

- 选父级会自动选中全部后代，取消父级会取消全部后代；
- 子级逐个选全后，父级自动补上；
- `includeChildren=false`（默认）只把最上层节点交给 `change`，适合只保存父级 ID 的业务；
- `includeChildren=true` 把父级和全部后代都交给 `change`，适合需要展开保存的场景。

#### 接口与分页

- 分页要关掉（树接口通常不分页）：`:show-pagination="false"`；
- 筛选若由后端完成，直接透传查询条件；若只能前端过滤，用[树选择完整例子](./树选择完整例子.md)里的自定义实现；
- 树形表格还需要 `row-key`：在 `columns.table.attr.keys` 或 `rowKey` 里传，顶层 `keys` 只用于跨页选择。

## 与旧版写法的差异

| 旧写法 | 现写法 | 原因 |
| --- | --- | --- |
| `{ prop: 'action', slot: true }` + `#col-action` | `{ prop: 'action' }` + `<CompTableColumn prop="action">` | `TableColumn` 已无 `slot` 字段，`CompTable` 只认列声明插槽 |
| `:columns="localColumns.table.options"` | `useCompTable()` 注册列，`CompTable` 不再有 `columns` prop | 列由注入表提供，支持类型推导与显隐持久化 |
| 接口 `rows` 回写 `checked`（`checkAll.isCheckedItem`） | 不回写，用 `includesRow(row)` 判断 | 表格没有勾选列，减少一层数据加工 |
| `useCheckAll(checkedKeys.value)` + `watch` 同步 `keys` | `useCheckAll(props.keys)` 只当容器，主键交给 `useSelect` 的 `checkedKeys` | 少一个 watch，动态主键仍生效 |
| `{{ count }} / {{ maxLength }}` | `selectedText` | `maxLength = 0` 时不显示 `/ 0` |
| `v-if="maxLength > 1"` | `v-if="maxLength !== 1"` | `0`（不限）也要显示批量按钮 |

## 注意事项

1. **搜索字段要预先声明**：`resetList()` 会删除不在 `props.query` 中的键，未声明的字段能搜但复位不干净。推荐把搜索字段全写进 `query`。
2. **`keys` 与 `CompTable` 的 `keys` 是两回事**：顶层 `keys` 只用于跨页选择；树形表格还需要 `row-key`，需在 `columns.table.attr` 里再传一次 `keys`（或 `rowKey`）。`treeSelection` 只影响选择规则，不替代 `row-key`。
3. **`useCheckAll` 内部的 `keys` 不跟随 `props.keys`**：组件只把它当已选数据容器，主键比较全部由 `useSelect` 的 `checkedKeys` 完成；不要在 CompSelect 外部依赖 `checkAll.keys`。
4. **跨页已选数据是独立数组**：翻页、搜索、刷新列表都不会清理 `checkAll.selected`；如果接口数据里删掉了某些行，需要父组件自行剔除。
5. **`change` 的顺序是选择顺序**（先选的在前），不做业务排序；当前页存在的行会用接口最新对象替换，跨页行保留原对象。
6. **内置操作列固定右侧、宽 100**：消费方自定义 `action` 列时以自定义 label / width / fixed 为准；业务列过多时注意给表格留够宽度（组件已设 `min-width="120"`）。
7. **抽屉内表格高度**：`CompDrawer` 传了 `:enable-scroll="false"`，表格高度由 `CompTable` 的视口计算负责（`heightMode` 默认 `fixed`）。

## 源码

### `index.vue`

```vue
<template>
  <comp-drawer
    v-model="show"
    :z-index="zIndex"
    :enable-scroll="false"
    :title="title"
    :tip="tip"
    :show-save-button="selectable && showDrawerSaveBtn"
    @save="handleSave">
    <div class="app-container">
      <!-- 搜索条件 start -->
      <CompTableSearch
        :model="list.query"
        :loading="list.loading"
        :show-reset-btn="showResetBtn"
        @search="handleSearch"
        @reset="handleReset">
        <template #left>
          <CompCommonSearchItem
            v-model="list.query"
            v-bind="localColumns.search.attr"
            :options="localColumns.search.options">
            <template
              v-for="(_, forward) in $slots"
              :key="forward"
              #[forward]="slotProps">
              <slot
                :name="forward"
                v-bind="slotProps"
                :query />
            </template>
          </CompCommonSearchItem>
        </template>

        <template
          v-if="selectable"
          #right>
          <el-text class="mr10">{{ selectedText }}</el-text>
          <!-- maxLength = 1 时选择即自动保存，不需要批量操作 -->
          <el-button-group v-if="maxLength !== 1">
            <el-button
              size="default"
              type="danger"
              :loading="list.loading"
              @click="handleRemove">
              清除所有
            </el-button>
            <el-button
              v-if="isChecked"
              size="default"
              type="danger"
              :loading="list.loading"
              @click="handleRemovePage">
              清除本页
            </el-button>
            <el-button
              v-else
              size="default"
              :loading="list.loading"
              @click="handleSelectedPage">
              全选本页
            </el-button>
          </el-button-group>
        </template>
      </CompTableSearch>
      <!-- 搜索条件 end -->

      <!-- 表格 start -->
      <CompTable
        v-model:list="list"
        :show-table-tool-bar="false"
        :selectable="false"
        column-slot-mode="merge"
        v-bind="localColumns.table.attr"
        :loading="list.loading"
        :min-width="120">
        <template
          v-for="forward in forwardedSlots"
          :key="forward"
          #[forward]="slotProps">
          <slot
            :name="forward"
            v-bind="slotProps" />
        </template>

        <!-- 内置选择操作列：写在自定义列之前，与消费方 action 列合并时选择/取消按钮在前 -->
        <CompTableColumn
          v-if="selectable"
          prop="action">
          <template #default="{ row }">
            <span v-if="treeSelection === 'leaf' && isTreeParent(row)">-</span>
            <el-button
              v-else-if="!includesRow(row)"
              type="primary"
              size="default"
              link
              :disabled="disabledRow(row)"
              @click="handleChecked(row, 1)">
              选择
            </el-button>
            <el-button
              v-else
              size="default"
              type="warning"
              link
              @click="handleChecked(row, 2)">
              取消
            </el-button>
          </template>
        </CompTableColumn>

        <!-- 默认插槽：消费者自定义列（<CompTableColumn>）与内置操作列并列渲染，避免与 #default 模板冲突 -->
        <slot name="default" />
      </CompTable>
      <!-- 表格 end -->

      <pagination
        v-if="showPagination"
        v-show="list.total > 0"
        :total="list.total"
        v-model:page="list.query.pageNum"
        v-model:limit="list.query.pageSize"
        @pagination="getList" />
    </div>
  </comp-drawer>
</template>

<script lang="ts" setup generic="T extends Record<string, any>, R extends Record<string, any>">
  import type { TableColumn } from '@/components/CompTable/types'
  import type { UseSelectTreeOptions } from '@/hooks/useSelect'
  import type { CompSelectProps } from './types'

  import { useCheckAll } from '@/hooks/useCheckAll'
  import { useSelect } from '@/hooks/useSelect'

  import CompCommonSearchItem from '@/components/CommonSearchItem/index.vue'
  import CompTable, { useCompTable } from '@/components/CompTable/index.vue'
  import CompDrawer from '@/components/Drawer/index.vue'
  import CompTableSearch from '@/components/TableSearch/index.vue'
  import { compSelectProps } from '.'

  defineOptions({ name: 'CompSelect' })

  const props = withDefaults(defineProps<CompSelectProps<T, R>>(), compSelectProps<T>())
  const emit = defineEmits<{
    change: [selected: R[]]
  }>()
  const show = defineModel<boolean>({
    default: false,
  })

  const slots = useSlots()
  /** 转发给 CompTable 的具名插槽名（default 通过 <slot name="default"> 直接渲染，避免与内置操作列冲突） */
  const forwardedSlots = computed(() => Object.keys(slots).filter(name => name !== 'default'))

  /** 列配置：消费方已声明操作列时复用其配置（单元格内容与内置按钮合并），否则追加内置操作列 */
  const localColumns = computed(() => {
    const consumerOptions = props.columns.table.options
    const hasAction = consumerOptions.some(col => col.prop === 'action')
    const tableOptions: TableColumn<R>[] =
      props.selectable && !hasAction
        ? [...consumerOptions, { prop: 'action', label: '操作', width: 100, fixed: 'right' }]
        : consumerOptions
    return {
      ...props.columns,
      table: {
        ...props.columns.table,
        options: tableOptions,
      },
    }
  })

  /** 当前生效的主键字段（支持父组件动态切换，如 id -> dept_id） */
  const checkedKeys = computed(() => props.keys)

  /**
   * 跨页已选数据
   * - 行主键比较统一由 useSelect 负责（支持动态主键），此处仅复用 useCheckAll 作为已选数据容器
   * - 表格不展示勾选列，因此无需回写行的 checked 状态
   */
  const checkAll = useCheckAll<T, Partial<R>>(props.keys)

  /**
   * 列表请求
   * - 仅在抽屉打开时启用，避免组件挂载即空跑一次请求
   * - 行数据直接使用接口原始对象：选择状态由 useSelect 的 Set 维护，无需给每行回写 checked
   */
  const { list, getList, resetList } = useListQuery<T, R>(
    computed(() => ({ ...props.query })),
    props.queryKey,
    props.apiFn,
    {
      enabled: computed(() => show.value),
    }
  )

  /** 树形子节点字段：优先取 columns.table.attr.treeProps.children */
  const treeChildrenField = computed(() => props.columns.table.attr?.treeProps?.children ?? 'children')

  /** 树形选择配置：透传给 useSelect 处理 leaf / cascade */
  const treeOptions = computed<UseSelectTreeOptions<Partial<R>>>(() => ({
    mode: props.treeSelection,
    childrenField: treeChildrenField.value,
    includeChildren: props.includeChildren
  }))

  /** 选择弹窗 hook：禁用行过滤、最大/最小数量校验、树形联动均在此处理 */
  const {
    isChecked,
    handleChecked,
    handleRemove,
    handleRemovePage,
    handleSelectedPage,
    handleSave,
    includesRow,
    isTreeParent,
    normalizeTreeSelected,
  } = useSelect<T, Partial<R>>(props, { emit }, checkAll, list, checkedKeys, undefined, treeOptions)

  /** 已选数量文案：maxLength = 0 表示不限数量，只展示已选数量 */
  const selectedText = computed(() =>
    props.maxLength > 0
      ? `${checkAll.selected.value.length} / ${props.maxLength}`
      : `${checkAll.selected.value.length}`
  )

  /** 搜索 */
  const handleSearch = () => {
    list.query.pageNum = 1
    getList()
  }

  /** 重置 */
  const handleReset = () => {
    resetList()
    handleSearch()
  }

  /** 打开抽屉：选择模式下回填父组件的已选数据；列表尚未加载过时触发首次查询 */
  const handleOpen = () => {
    if (props.selectable) checkAll.selected.value = props.selected.slice()
    if (!list.items.length) handleSearch()
  }

  /** 初始化 */
  watch(show, val => {
    if (val) handleOpen()
  })

  /**
   * 树形回显归一化：
   * - leaf：去掉已选中的父级
   * - cascade：用当前树补齐后代 / 父级
   * 需等列表加载完成后执行，每次打开只处理一次
   */
  const treeEchoed = ref(false)
  watch([show, () => list.items], ([visible]) => {
    if (!visible) {
      treeEchoed.value = false
      return
    }
    if (props.treeSelection === 'all' || treeEchoed.value || !list.items.length) return
    checkAll.selected.value = normalizeTreeSelected(checkAll.selected.value)
    treeEchoed.value = true
  })

  const { CompTableColumn } = useCompTable(computed(() => localColumns.value.table.options))
</script>
```

### `types.ts`

```ts
import type { CommonSearchItemOptions, CommonSearchItemProps } from '@/components/CommonSearchItem/types'
import type { CompTableProps, TableColumn } from '@/components/CompTable/types'
import type { AjaxResult, TableDataInfo } from '@/types'
import type { QueryKey } from '@tanstack/vue-query'
import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults'

export interface CompSelectColumn<T, R extends DefaultRow> {
  search: {
    attr: Partial<CommonSearchItemProps<T>>
    options: CommonSearchItemOptions<T>[]
  }
  table: {
    attr: Partial<CompTableProps<T, R>>
    options: TableColumn<R>[]
  }
}

export type ListResult = AjaxResult | TableDataInfo

export interface CompSelectProps<T, R extends DefaultRow> {
  /** 抽屉标题 */
  title?: string
  /** 描述标题 */
  tip?: string
  /** 指定弹窗层级 */
  zIndex?: number
  selected?: Partial<R>[]
  /** 最小选择数据 */
  minLength?: number
  /** 最大选择数据 */
  maxLength?: number
  /** 禁用选择行 */
  disabledRow?: (row: Partial<R>) => boolean
  /**
   * 树形选择模式
   * - all：父子都可选（默认）
   * - leaf：只允许选择子级，父级不可选
   * - cascade：父子联动，选父级自动选中全部后代，取消同理
   */
  treeSelection?: 'all' | 'leaf' | 'cascade'
  /**
   * 父子联动时，选择结果是否包含全部子级
   * - false（默认）：只返回最上层被选中的节点
   * - true：父级及其全部后代都返回
   */
  includeChildren?: boolean
  /** 查询条件 */
  query?: T
  /** 跨页选择依据字段 */
  keys?: string
  /** 是否选择模式：false 时仅查看，隐藏选择按钮、已选/批量操作与保存按钮 */
  selectable?: boolean
  /** 搜索 + 表格列配置 */
  columns: CompSelectColumn<T, R>
  /** 列表接口（兼容 AjaxResult / TableDataInfo，rows 与 total 均允许为空） */
  apiFn: (query?: T & ListBaseQuery) => Promise<ListResult>
  /** queryKey */
  queryKey: QueryKey | ((query?: T & ListBaseQuery) => QueryKey)
  showPagination?: boolean
  showResetBtn?: boolean
  showDrawerSaveBtn?: boolean
}
```

### `index.ts`

```ts
export const compSelectProps = <T extends Record<string, any>>(omit: string[] = []) => {
  const obj = {
    title: '选择',
    tip: undefined,
    zIndex: 1,
    selected: () => [],
    minLength: 1,
    maxLength: 500,
    disabledRow: () => false,
    /** 树形选择模式：all / leaf / cascade */
    treeSelection: 'all' as const,
    /** 父子联动结果是否包含全部子级 */
    includeChildren: false,
    query: () => ({} as T),
    keys: 'id',
    /** 是否选择模式：false 时仅查看，隐藏选择按钮、已选/批量操作与保存按钮 */
    selectable: true,
    showPagination: true,
    showResetBtn: true,
    showDrawerSaveBtn: true
  }

  if (!omit.length) return obj

  return Object.fromEntries(Object.entries(obj).filter(([key]) => !omit.includes(key))) as typeof obj
}
```

> `compSelectProps(omit: string[])` 的用途：在别的选择器里复用同一份默认值，同时去掉不适用的项（例如树选择不需要 `showPagination`）。

### `useSelect.ts`

> 对应文件：`useSelect.ts`。

```ts
import type { ComputedRef, Ref } from 'vue'

import { computed, reactive, unref, watch } from 'vue'

import { deleteSelectedList, putSelectedList, rowKeyOf, splitKeys } from '@/hooks/useCheckAll'
import { useError } from '@/hooks/useTip'

/** 选择操作 */
export const SelectAction = {
  /** 选择 */
  Select: 1,
  /** 取消 */
  Remove: 2
} as const
export type SelectAction = (typeof SelectAction)[keyof typeof SelectAction]

/** useSelect 依赖的组件 props */
export interface UseSelectProps<R = object> {
  /** 最大选择数量，0 表示不限制 */
  maxLength?: number
  /** 最小选择数量，默认 1 */
  minLength?: number
  /** 禁用选择的行：单行选择与全选本页都会跳过 */
  disabledRow?: (row: R) => boolean
}

/** 树形选择配置 */
export interface UseSelectTreeOptions<R = object> {
  /** all：父子都可选；leaf：只允许选择子级；cascade：父子联动 */
  mode: 'all' | 'leaf' | 'cascade'
  /** 子节点字段名 */
  childrenField: string
  /**
   * 联动选择结果是否包含全部子级
   * - false（默认）：只返回最上层被选中的节点，避免选中父级后产生大量子级标签
   * - true：父级及其全部后代都返回
   */
  includeChildren?: boolean
}

/** useSelect 依赖的列表对象 */
interface UseSelectList<Q, R> {
  /** 请求参数 */
  query: Q
  /** 当前页数据 */
  items: R[]
}

/** useSelect 依赖的跨页选择对象 */
interface UseSelectCheckAll<R> {
  /** 跨页已选数据 */
  selected: Ref<R[]>
}

/** 主键字段：'id' / 'id-type'（复合主键） */
type SelectKeys = Ref<string> | ComputedRef<string> | string

/**
 * 选择弹窗，用于抽屉中的选择组件
 *
 * - 主键比较统一复用 useCheckAll 的 `rowKeyOf`，与全选/清除本页保持一致的复合主键语义
 * - 已选主键用 reactive Set 按 key 缓存依赖，`includesRow` 为 O(1) 且只触发变化行的重新渲染
 * - `maxLength = 0` 表示不限制数量
 * - 传入 `tree` 时支持树形选择：只允许选择子级（leaf）或父子联动（cascade）
 */
export function useSelect<Q, R extends object>(
  props: UseSelectProps<R>,
  context: { emit: (event: any, ...args: any[]) => void },
  checkAll: UseSelectCheckAll<R>,
  list: UseSelectList<Q, R>,
  keys: SelectKeys,
  callback?: () => void,
  tree?: ComputedRef<UseSelectTreeOptions<R>>
) {
  /** 主键字段列表（支持运行时切换，如 id -> dept_id） */
  const fields = computed(() => splitKeys(unref(keys)))

  /**
   * 已选主键集合（按主键粒度收集依赖）。
   * 使用 reactive Set 增量同步：选择某一行时只触发该行（含主键变化行）的重新渲染，
   * 避免每次选择都重建 computed Set 导致表格所有操作列整体重渲染（大数据量下会卡死）。
   */
  const selectedKeySet = reactive(new Set<string>())

  /** 增量同步已选主键：逐项 add/delete，不用 clear()，否则会触发所有行重新渲染 */
  const syncSelectedKeySet = () => {
    const nextKeys = checkAll.selected.value.map(row => rowKeyOf(row, fields.value))
    const nextKeySet = new Set(nextKeys)

    selectedKeySet.forEach(key => {
      if (!nextKeySet.has(key)) selectedKeySet.delete(key)
    })
    nextKeys.forEach(key => {
      if (!selectedKeySet.has(key)) selectedKeySet.add(key)
    })
  }

  // pre：在本轮渲染前完成集合同步，includesRow 读到的仍是同一帧的最新值；
  // 不用 sync，避免 watcher 遍历集合时被 add 触发的 ITERATE_KEY 重入
  watch([() => checkAll.selected.value, fields], syncSelectedKeySet, { immediate: true })

  /** 最大选择数量，0 表示不限制 */
  const getMaxLength = () => props.maxLength ?? 0

  /** 最小选择数量，默认 1 */
  const getMinLength = () => props.minLength ?? 1

  // #region 树形选择
  const treeMode = computed(() => tree?.value.mode ?? 'all')
  const childrenField = computed(() => tree?.value.childrenField ?? 'children')

  /** 读取行的子节点 */
  const childrenOf = (row: R): R[] => {
    const children = (row as Record<string, unknown>)[childrenField.value]
    return Array.isArray(children) ? (children as R[]) : []
  }

  /** 是否非叶子节点（leaf 模式下父级不可选） */
  const isTreeParent = (row: R) => childrenOf(row).length > 0

  /** 树索引：节点、父节点、先序 / 后序列表 */
  const treeIndex = computed(() => {
    const nodeMap = new Map<string, R>()
    const parentMap = new Map<string, R>()
    const rows: R[] = []
    const postOrder: R[] = []

    const walk = (nodes: R[], parent?: R) => {
      nodes.forEach(node => {
        const key = rowKeyOf(node, fields.value)
        nodeMap.set(key, node)
        if (parent) parentMap.set(key, parent)
        rows.push(node)
        walk(childrenOf(node), node)
        postOrder.push(node)
      })
    }

    walk(list.items)
    return { nodeMap, parentMap, rows, postOrder }
  })

  /** 节点及其全部后代 */
  const collectWithDescendants = (row: R): R[] => [
    row,
    ...childrenOf(row).flatMap(child => collectWithDescendants(child))
  ]

  /** 按树顺序排序；不在当前树中的跨页行追加在末尾 */
  const sortByTree = (rows: R[]) => {
    const rowMap = new Map(rows.map(row => [rowKeyOf(row, fields.value), row]))
    const ordered = treeIndex.value.rows.filter(row => rowMap.has(rowKeyOf(row, fields.value)))
    const inTreeKeys = new Set(ordered.map(row => rowKeyOf(row, fields.value)))
    return [...ordered, ...rows.filter(row => !inTreeKeys.has(rowKeyOf(row, fields.value)))]
  }

  /** 父子联动：子级全选时自动带上父级，否则移除父级 */
  const syncParents = (rows: R[]) => {
    const rowMap = new Map(rows.map(row => [rowKeyOf(row, fields.value), row]))

    treeIndex.value.postOrder.forEach(parent => {
      const children = childrenOf(parent)
      if (!children.length) return
      const key = rowKeyOf(parent, fields.value)
      const allChecked = children.every(child => rowMap.has(rowKeyOf(child, fields.value)))
      // 禁用行不能因为子级全选而被被动选中
      allChecked && !props.disabledRow?.(parent)
        ? rowMap.set(key, parent)
        : rowMap.delete(key)
    })

    return sortByTree([...rowMap.values()])
  }

  /**
   * 选择结果收敛：
   * - 非 cascade 或 includeChildren=true：原样返回
   * - cascade 且 includeChildren=false：只保留最上层被选中的节点
   */
  const getResultRows = (rows: R[]): R[] => {
    if (treeMode.value !== 'cascade' || tree?.value.includeChildren) return rows

    const keySet = new Set(rows.map(row => rowKeyOf(row, fields.value)))
    return sortByTree(
      rows.filter(row => {
        const parent = treeIndex.value.parentMap.get(rowKeyOf(row, fields.value))
        return !parent || !keySet.has(rowKeyOf(parent, fields.value))
      })
    )
  }

  /** 回显归一化：leaf 去掉父级，cascade 用当前树补齐后代 / 父级 */
  const normalizeTreeSelected = (rows: R[]): R[] => {
    if (treeMode.value === 'all' || !treeIndex.value.rows.length) return rows

    if (treeMode.value === 'leaf') {
      return sortByTree(
        rows.filter(row => {
          const node = treeIndex.value.nodeMap.get(rowKeyOf(row, fields.value))
          return !node || !isTreeParent(node)
        })
      )
    }

    const expanded = new Map<string, R>()
    rows.forEach(row => {
      const node = treeIndex.value.nodeMap.get(rowKeyOf(row, fields.value))
      const nodes = node ? collectWithDescendants(node) : [row]
      nodes.forEach(item => expanded.set(rowKeyOf(item, fields.value), item))
    })

    return syncParents([...expanded.values()])
  }
  // #endregion

  /** 保存 */
  const handleSave = () => {
    const selected = checkAll.selected.value
    // 树形联动：按 includeChildren 决定是否只返回最上层节点
    const resultRows = getResultRows(selected)
    const maxLength = getMaxLength()
    const minLength = getMinLength()

    if (resultRows.length < minLength) {
      useError(`至少需要选择${minLength}条数据`)
      return
    }
    if (maxLength > 0 && resultRows.length > maxLength) {
      useError(`最多只能选择${maxLength}条数据`)
      return
    }

    // 当前页存在的行用最新对象回填，跨页行保留原对象。
    // 快路径：选中对象全部来自当前页（绝大多数场景）时无需回填，直接复用，
    // 跳过对整页行做复合主键 JSON 序列化（大数据量下是保存卡顿的主要来源）。
    const currentItemSet = new WeakSet<object>(list.items)
    let rows: R[]
    if (resultRows.every(item => currentItemSet.has(item))) {
      // 保持与原实现一致：返回新数组，避免调用方修改 change 参数时影响内部已选数据
      rows = resultRows.slice()
    } else {
      // 跨页 / 列表已刷新：按主键建 Map 一次性回填，避免逐个 find
      const currentItems = new Map<string, R>()
      list.items.forEach(item => currentItems.set(rowKeyOf(item, fields.value), item))
      rows = resultRows.map(item => currentItems.get(rowKeyOf(item, fields.value)) ?? item)
    }

    context.emit('update:modelValue', false)
    context.emit('change', rows)
    callback?.()
  }

  /** 选择 / 取消 */
  const handleChecked = (row: R, action: SelectAction = SelectAction.Select) => {
    const selected = checkAll.selected.value
    const rowKey = rowKeyOf(row, fields.value)

    if (action === SelectAction.Remove) {
      const affected =
        treeMode.value === 'cascade'
          ? new Set(collectWithDescendants(row).map(item => rowKeyOf(item, fields.value)))
          : new Set([rowKey])
      const next = selected.filter(item => !affected.has(rowKeyOf(item, fields.value)))
      checkAll.selected.value = treeMode.value === 'cascade' ? syncParents(next) : next
      return
    }

    // 禁用行兜底：UI 已禁用选择按钮，避免函数被直接调用时误选
    if (props.disabledRow?.(row)) return
    // 只允许选择子级：父级不参与选择
    if (treeMode.value === 'leaf' && isTreeParent(row)) return

    const maxLength = getMaxLength()

    if (treeMode.value === 'cascade') {
      const next = syncParents(putSelectedList(selected, collectWithDescendants(row), unref(keys)))
      const resultCount = getResultRows(next).length
      if (maxLength > 0 && resultCount > maxLength) {
        useError(`最多只能选择${maxLength}条数据`)
        return
      }
      checkAll.selected.value = next
      // 达到上限自动保存（赋值后即可判定，无需 nextTick）
      if (maxLength > 0 && resultCount >= maxLength) handleSave()
      return
    }

    // 先按主键去重，避免同一行重复入列
    const rest = selected.filter(item => rowKeyOf(item, fields.value) !== rowKey)

    let next: R[]
    if (maxLength === 1) {
      next = [row]
    } else if (maxLength === 0) {
      next = [...rest, row]
    } else {
      // 超出上限时移除末位，为新选择腾出名额（保持原有交互）
      next = [...rest.slice(0, maxLength - 1), row]
    }

    checkAll.selected.value = next

    // 达到上限自动保存（赋值后即可判定，无需 nextTick）
    if (maxLength > 0 && next.length >= maxLength) handleSave()
  }

  /** 清除所有 */
  const handleRemove = () => {
    checkAll.selected.value = []
  }

  /** 全选本页（跳过禁用行） */
  const handleSelectedPage = () => {
    const isDisabled = props.disabledRow
    const maxLength = getMaxLength()

    if (treeMode.value !== 'all') {
      const candidates =
        treeMode.value === 'leaf'
          ? treeIndex.value.rows.filter(row => !isTreeParent(row))
          : treeIndex.value.rows
      const rows = isDisabled ? candidates.filter(row => !isDisabled(row)) : candidates
      let next = putSelectedList(checkAll.selected.value, rows, unref(keys))
      if (treeMode.value === 'cascade') next = syncParents(next)
      if (maxLength > 0 && getResultRows(next).length > maxLength) {
        useError(`最多只能选择${maxLength}条数据`)
        return
      }
      checkAll.selected.value = next
      return
    }

    const rows = isDisabled ? list.items.filter(item => !isDisabled(item)) : list.items
    checkAll.selected.value = putSelectedList(checkAll.selected.value, rows, unref(keys))
  }

  /** 清除本页 */
  const handleRemovePage = () => {
    if (treeMode.value !== 'all') {
      checkAll.selected.value = deleteSelectedList(checkAll.selected.value, treeIndex.value.rows, unref(keys))
      return
    }
    checkAll.selected.value = deleteSelectedList(checkAll.selected.value, list.items, unref(keys))
  }

  /** 是否已选择 */
  const includesRow = (row: R) => selectedKeySet.has(rowKeyOf(row, fields.value))

  /** 是否已有选择 */
  const isChecked = computed(() => list.items.some(includesRow))

  return {
    /** 选择 */
    handleChecked,
    /** 保存 */
    handleSave,
    /** 清除所有 */
    handleRemove,
    /** 全选本页 */
    handleSelectedPage,
    /** 清除本页 */
    handleRemovePage,
    /** 是否已选择 */
    includesRow,
    /** 是否已有选择 */
    isChecked,
    /** 是否父级节点（树形表格用） */
    isTreeParent,
    /** 回显归一化（树形表格用） */
    normalizeTreeSelected
  }
}
```
