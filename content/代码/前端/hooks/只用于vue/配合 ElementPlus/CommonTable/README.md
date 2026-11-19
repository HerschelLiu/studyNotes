---
title: "CommonTable 组件说明"
---

> 基于 `element-plus` 的通用表格：动态列、可选多选列、列隐藏、固定列、操作按钮列。
> 本文与同目录 `index.vue` / `types.ts` 对齐；项目里位于 `src/components/CommonTable/`，本仓库保留一份示例副本。

## 目录

- [Props](#props)
- [事件](#事件)
- [插槽](#插槽)
- [TableColumn](#tablecolumn)
- [使用示例](#使用示例)
- [注意事项](#注意事项)

## Props

| prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `any[]` | `undefined` | 表格数据源，优先使用 |
| `tableData` | `any[]` | `[]` | 备用数据源，`data` 未传时使用 |
| `columns` | `TableColumn[]` | 必传 | 列配置 |
| `selectable` | `boolean` | `false` | 是否显示多选列 |

## 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `selectionChange` | `selection: any[]` | `el-table` 的 `selection-change`，仅在 `selectable` 为 `true` 时有意义 |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `tableTop` | 表格顶部自定义内容（工具栏、批量操作等） |

## TableColumn

定义在同目录 `types.ts`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` | 列字段名，对应数据对象的属性 |
| `title` | `string` | 列标题 |
| `type` | `'default' \| 'operation'` | 列类型；`operation` 时渲染 `buttons` |
| `width` | `string` | 列宽 |
| `fixed` | `'left' \| 'right'` | 固定列位置 |
| `align` | `'left' \| 'center' \| 'right'` | 对齐方式，默认 `left` |
| `hidden` | `boolean` | 是否隐藏该列 |
| `formatter` | `(row) => string` | 单元格内容格式化，仅 `type = 'default'` 生效 |
| `buttons` | `TableColumnButton[]` | 操作按钮，仅 `type = 'operation'` 生效 |

`TableColumnButton`：`{ label: string; type: 'primary' | 'success' | 'warning' | 'danger'; icon?: string; click: (row) => void }`。

## 使用示例

```vue
<template>
  <CommonTable
    :data="tableData"
    :columns="columns"
    selectable
    @selection-change="onSelectionChange">
    <template #tableTop>
      <div class="table-top">一些自定义操作</div>
    </template>
  </CommonTable>
</template>

<script lang="ts" setup>
  import type { TableColumn } from './types'

  import CommonTable from './index.vue'

  const tableData = [
    { id: 1, name: 'Test 1', status: 'Active' },
    { id: 2, name: 'Test 2', status: 'Disabled' },
  ]

  const columns: TableColumn[] = [
    { key: 'id', title: 'ID', width: '120' },
    { key: 'name', title: '名称' },
    { key: 'status', title: '状态', align: 'center', formatter: row => (row.status === 'Active' ? '启用' : '停用') },
    {
      key: 'action',
      title: '操作',
      type: 'operation',
      buttons: [{ label: '编辑', type: 'primary', click: row => console.log('edit', row) }],
    },
  ]

  const onSelectionChange = (selection: any[]) => {
    console.log('selected rows:', selection)
  }
</script>
```

## 注意事项

1. `columns` 必传，否则表头为空。
2. 操作列必须写 `type: 'operation'`，否则不渲染按钮；`buttons` 不传时该列内容为空。
3. `hidden: true` 的列不会渲染，也不会出现在表格里（不做列显隐持久化；需要持久化用项目里的 `CompTable`）。
4. 组件本身不处理分页、搜索、列宽拖拽；这些能力在项目封装 `CompTable` 里，两者不要混用。
5. `formatter` 只对默认列生效，`el-table` 原生 `formatter` 未被透传。

## 源码

### `index.vue`

```vue
<!-- components/CommonTable/index.vue -->
<template>
  <div>
    <div>
      <slot name="tableTop" />
    </div>
    <el-table
      :data="displayData"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange">
      <!-- 复选框列 -->
      <el-table-column
        v-if="selectable"
        type="selection"
        width="55"
        fixed />

      <!-- 动态列 -->
      <el-table-column
        v-for="col in visibleColumns"
        :key="col.key"
        :prop="col.key"
        :label="col.title"
        :width="col.width"
        :fixed="col.fixed"
        :align="col.align || 'left'">
        <template #default="{ row }">
          <div v-if="col.type === 'operation'">
            <el-button
              v-for="button in col.buttons"
              :key="button.label"
              :type="button.type"
              :icon="button.icon"
              @click="button.click(row)">
              {{ button.label }}
            </el-button>
          </div>
          <template v-else>
            {{ col.formatter ? col.formatter(row) : row[col.key] }}
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
  import type { TableColumn } from './types'

  import { computed } from 'vue'

  interface Props {
    /** 表格数据源，优先使用 */
    data?: any[]
    /** 备用数据源，data 未传时使用 */
    tableData?: any[]
    /** 列配置，必传 */
    columns: TableColumn[]
    /** 是否显示多选列，默认 false */
    selectable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    data: undefined,
    tableData: () => [],
    selectable: false,
  })

  const emit = defineEmits<{
    (e: 'selectionChange', selection: any[]): void
  }>()

  /** 数据源：优先 data，其次 tableData */
  const displayData = computed(() => props.data ?? props.tableData ?? [])

  /** 可见列：过滤 hidden === true */
  const visibleColumns = computed(() => props.columns?.filter(c => c.hidden !== true) ?? [])

  const handleSelectionChange = (selection: any[]) => {
    emit('selectionChange', selection)
  }
</script>
```

### `types.ts`

```ts
/** 列的展示类型 */
export type TableColumnType =
  /** 默认：直接渲染 row[key]，或走 formatter */
  | 'default'
  /** 操作列：渲染 buttons */
  | 'operation'

/** 操作列按钮配置 */
export interface TableColumnButton {
  /** 按钮文字 */
  label: string
  /** Element Plus 按钮类型 */
  type: 'primary' | 'success' | 'warning' | 'danger'
  /** 图标名（已全局注册的图标组件名） */
  icon?: string
  /** 点击回调，参数为当前行 */
  click: (row: any) => void
}

export interface TableColumn {
  /** 列字段名，对应数据对象的属性 */
  key: string
  /** 列标题 */
  title: string
  /** 列类型：默认 default；'operation' 时渲染 buttons */
  type?: TableColumnType
  /** 列宽 */
  width?: string
  /** 固定列位置 */
  fixed?: 'left' | 'right'
  /** 列对齐方式，默认 left */
  align?: 'left' | 'center' | 'right'
  /** 是否隐藏该列（visibleColumns 会过滤掉） */
  hidden?: boolean
  /** 单元格自定义格式化，仅 type = 'default' 时生效 */
  formatter?: (row: any) => string
  /** 操作按钮配置，仅 type = 'operation' 时生效 */
  buttons?: TableColumnButton[]
}
```
