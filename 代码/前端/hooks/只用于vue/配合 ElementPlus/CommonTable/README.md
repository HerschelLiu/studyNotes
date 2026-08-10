# CommonTable 组件说明

## 概述
`CommonTable` 是一个基于 `element-plus` 的通用表格组件，用于展示动态列和可选的多选框选择功能。它支持列隐藏、列对齐、固定列、以及操作按钮列的配置。

## 文件位置
- `src/components/CommonTable/index.vue`
- `src/components/CommonTable/types.ts`

## 组件 Props

### `data?: any[]`
- 类型: `any[]`
- 说明: 表格数据源，优先使用该字段。

### `tableData?: any[]`
- 类型: `any[]`
- 说明: 备用的数据源。当 `data` 未传入时，组件会使用 `tableData`。

### `columns: TableColumn[]`
- 类型: `TableColumn[]`
- 说明: 列配置，必传。

### `selectable?: boolean`
- 类型: `boolean`
- 说明: 是否显示多选列，默认关闭。

## `TableColumn` 类型说明
`TableColumn` 定义在 `src/components/CommonTable/types.ts`，字段如下：

- `key: string` - 列字段名，对应数据对象的属性。
- `title: string` - 列标题。
- `width?: string` - 列宽度。
- `fixed?: 'left' | 'right'` - 固定列位置。
- `align?: 'left' | 'center' | 'right'` - 列对齐方式，默认 `left`。
- `slot?: boolean` - 是否使用自定义插槽（当前组件模板未实现插槽渲染，仅保留配置项）。
- `formatter?: (row: any) => string` - 自定义格式化函数（组件当前未应用此字段，仅保留配置空间）。
- `buttons?: { label: string; type: 'primary' | 'success' | 'warning' | 'danger'; click: (row: any) => void }[]` - 操作按钮配置，用于 `type === 'operation'` 的列。

## 组件行为

### 数据渲染
- `displayData` 计算属性会优先使用 `props.data`，如果不存在则使用 `props.tableData`。

### 列渲染
- `visibleColumns` 计算属性会过滤掉 `hidden === true` 的列。
- 每个可见列被渲染为一个 `el-table-column`。
- 对于 `type === 'operation'` 的列，会在单元格中渲染按钮组。

### 事件

#### `selectionChange`
- 触发时机: `el-table` 的 `selection-change` 事件。
- 参数: `selection: any[]`。
- 说明: 仅在 `selectable` 为 `true` 时可用，用于向父组件回传当前选中项。

## 插槽
- `tableTop` - 用于在表格顶部插入自定义内容。

## 使用示例

```vue
<template>
  <CommonTable
    :data="tableData"
    :columns="columns"
    :selectable="true"
    @selectionChange="onSelectionChange"
  >
    <template #tableTop>
      <div class="table-top">一些自定义操作</div>
    </template>
  </CommonTable>
</template>

<script setup lang="ts">
import CommonTable from '@/components/CommonTable/index.vue';
import type { TableColumn } from '@/components/CommonTable/types';

const tableData = [
  { id: 1, name: 'Test 1', status: 'Active' },
  { id: 2, name: 'Test 2', status: 'Disabled' },
];

const columns: TableColumn[] = [
  { key: 'id', title: 'ID', width: '120' },
  { key: 'name', title: '名称' },
  { key: 'status', title: '状态', align: 'center' },
  {
    key: 'action',
    title: '操作',
    type: 'operation',
    buttons: [
      { label: '编辑', type: 'primary', click: (row) => console.log('edit', row) },
    ],
  },
];

const onSelectionChange = (selection: any[]) => {
  console.log('selected rows:', selection);
};
</script>
```

## 注意事项
- 当前组件模板未使用 `formatter` 和 `slot` 字段，如需支持请在组件中扩展对应渲染逻辑。
- `columns` 属性必须传入，否则表格无法正常显示列头。
