<template>
  <div
    v-loading="resolvedLoading"
    class="comp-table">
    <slot name="toolbar" />

    <el-table
      ref="ELTable"
      :data="rows"
      style="width: 100%"
      :max-height="resolvedMaxHeight"
      :height="resolvedHeight"
      :show-summary="showSummary"
      :summary-method="summaryMethod"
      :span-method="spanMethod"
      :row-key="resolvedRowKey"
      :tree-props="treeProps"
      :default-expand-all="defaultExpandAll"
      :size="size"
      border>
      <el-table-column
        v-if="selectable"
        label="选择"
        :width="selectionWidth"
        align="center"
        fixed>
        <template #header>
          <CompTableHeaderCheckbox
            :row-keys="checkableSelectionKeys"
            :state="selectionState"
            :on-toggle-all="toggleAllChecked" />
        </template>

        <template #default="{ row }">
          <CompTableRowCheckbox
            :row="row"
            :row-key="getSelectionKey(row)"
            :disabled="row.disabled"
            :state="selectionState"
            :on-toggle="toggleRowChecked" />
        </template>
      </el-table-column>

      <el-table-column
        v-if="index"
        type="index"
        :label="indexColumnConfig?.label ?? '序号'"
        :width="indexColumnConfig?.width ?? 80"
        :min-width="indexColumnConfig?.minWidth"
        :fixed="indexColumnConfig?.fixed ?? 'left'"
        :align="indexColumnConfig?.align ?? 'center'" />

      <el-table-column
        v-if="$slots.expand"
        type="expand"
        :width="expandColumnConfig?.width"
        :min-width="expandColumnConfig?.minWidth">
        <template #default="{ row, $index }">
          <slot
            name="expand"
            :row="row"
            :$index="$index" />
        </template>
      </el-table-column>

      <!-- 动态数据列（支持 children 多级表头，递归渲染） -->
      <component :is="DynamicColumns" />
    </el-table>
  </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>, R extends Record<string, any>">
  import type { BaseCompTableProps, BaseCompTableSlots } from './types'

  import { rowKeyOf, splitKeys } from '@/utils/selectionKey'
  import { useTempRefs } from '@/hooks/useTempRefs'
  import { createDynamicColumns } from './columns/renderColumns'
  import { useCompTableHeight } from './composables/useCompTableHeight'
  import { useTableColumns } from './composables/useTableColumns'
  import { useTableData } from './composables/useTableData'
  import { CompTableHeaderCheckbox, CompTableRowCheckbox } from './selection/SelectionCheckbox'
  import { useCompTableSelection } from './selection/useCompTableSelection'

  defineOptions({ name: 'CompBaseTable' })

  const props = withDefaults(defineProps<BaseCompTableProps<T, R>>(), {
    selected: () => [],
    keys: '',
    tableKey: 'default',
    /** 显式 undefined：避免 Boolean prop 缺席时被 Vue 转成 false，导致读不到 list.loading */
    loading: undefined,
    selectable: true,
    selectionWidth: 55,
    minWidth: 100,
    showSummary: false,
    summaryMethod: undefined,
    heightMode: 'fixed',
    index: false,
    defaultExpandAll: false,
    treeProps: () => ({ hasChildren: 'hasChildren', children: 'children', checkStrictly: false }),
    required: false,
    isolateCellSlots: true,
    columnSlotMode: 'override',
    bottomOffset: 20 + 20 + 32,
  })

  interface Emits {
    'update:selected': [value: R[]]
  }
  const emit = defineEmits<Emits>()
  defineSlots<BaseCompTableSlots<R>>()

  const { rows, resolvedLoading, allRows } = useTableData(props)

  const { ELTable } = useTempRefs('ELTable')
  const {
    resolvedHeight,
    resolvedMaxHeight,
    refresh: refreshTableHeight
  } = useCompTableHeight(ELTable, props)
  defineExpose({ refreshHeight: refreshTableHeight })

  const { dataColumns, indexColumnConfig, expandColumnConfig } = useTableColumns(props)

  const {
    state: selectionState,
    keyOf: getSelectionKey,
    checkableKeys: checkableSelectionKeys,
    toggle: toggleRowChecked,
    toggleAll: toggleAllChecked
  } = useCompTableSelection<R>({
    getKeys: () => props.keys,
    getSelected: () => props.selected ?? [],
    getRows: () => allRows.value,
    getCheckableRows: () => rows.value,
    onSelectedChange: rows => emit('update:selected', rows)
  })

  const resolvedRowKey = computed(() => {
    if (props.rowKey) return props.rowKey
    if (!props.keys) return undefined
    const fields = splitKeys(props.keys)
    return (row: R) => rowKeyOf(row, fields)
  })

  const DynamicColumns = createDynamicColumns<R>({
    dataColumns,
    getTableProps: () => props,
    getColumnSlotMode: () => props.columnSlotMode
  })
</script>

<style lang="scss" scoped>
  :deep(.el-table) {
    transition: max-height 0.25s ease;
  }
</style>
