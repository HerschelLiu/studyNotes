<template>
  <CompBaseTable
    ref="baseTableRef"
    v-bind="baseProps"
    @update:selected="emit('update:selected', $event)">
    <template #toolbar>
      <CompTableToolbar
        v-if="showTableToolBar"
        v-model:show-search="innerShowSearch"
        :columns="columnVisibility"
        :show-tool-bar-search="showToolBarSearch"
        :show-right-toolbar="showRightToolbar"
        @query-table="emit('queryTable')">
        <slot name="toolbar" />
      </CompTableToolbar>
    </template>

    <template #default>
      <slot />
    </template>

    <template
      v-if="$slots.expand"
      #expand="scope">
      <slot
        name="expand"
        v-bind="scope" />
    </template>
  </CompBaseTable>
</template>

<script lang="ts">
  export { useCompTable } from './CompBaseTable/composables/useCompTable'
</script>

<script lang="ts" setup generic="T extends Record<string, any>, R extends Record<string, any>">
  import type { DefineCheckAllEmits } from '@/hooks/useCheckAll'
  import type { DefineListEmits } from '@/hooks/useList'
  import type { CompTableProps, CompTableSlots, TableColumn } from './types'

  import { useTemplateRef } from 'vue'
  import { compTableColumnsKey } from './CompBaseTable/columns/CompTableColumn'
  import { useColumnVisibility } from './ColumnVisibility'

  import CompBaseTable from './CompBaseTable/index.vue'
  import CompTableToolbar from './Toolbar/index.vue'

  defineOptions({ name: 'CompTable' })

  const props = withDefaults(defineProps<CompTableProps<T, R>>(), {
    storageKey: '',
    tableKey: 'default',
    /** CompBaseTable 的 selectable 默认 true；wrapper 也必须显式声明，否则 Boolean 缺席会被转成 false */
    selectable: true,
    isolateCellSlots: true,
    columnSlotMode: 'override',
    showTableToolBar: true,
    showSearch: true,
    showRightToolbar: true,
    showToolBarSearch: true,
  })

  interface Emits
    extends Omit<DefineListEmits<T, R>, 'update:list'>,
      DefineCheckAllEmits<R> {
    queryTable: []
    'update:showSearch': [val: boolean]
    'update:list': [value: List<T, R> | R[]]
  }
  const emit = defineEmits<Emits>()
  defineSlots<CompTableSlots<R>>()

  const innerShowSearch = computed({
    get: () => props.showSearch,
    set: (val: boolean) => emit('update:showSearch', val),
  })

  /** 优先 columns prop；否则读 useCompTable 注入的列 */
  const columnsMap = inject(compTableColumnsKey, null)
  const injectedColumns = computed<TableColumn<R>[]>(
    () => (columnsMap?.get(props.tableKey)?.value ?? []) as TableColumn<R>[]
  )
  const sourceColumns = computed<TableColumn<R>[]>(() => props.columns ?? injectedColumns.value)

  const warnedTableKeys = new Set<string>()
  watchEffect(() => {
    if (!import.meta.env.DEV || props.columns || !columnsMap || columnsMap.has(props.tableKey) || warnedTableKeys.has(props.tableKey)) return
    warnedTableKeys.add(props.tableKey)
    console.warn(
      `[CompTable] table-key "${props.tableKey}" 未在 useCompTable 中注册，已注册：${[...columnsMap.keys()].join(', ') || '(无)'}`
    )
  })

  const { columnVisibility, dataColumns, indexColumnConfig, expandColumnConfig } = useColumnVisibility<R>({
    getColumns: () => sourceColumns.value,
    getStorageKey: () => props.storageKey,
  })

  const baseProps = computed(() => ({
    list: props.list,
    selected: props.selected,
    keys: props.keys,
    tableKey: props.tableKey,
    // 只有显式 true 才覆盖；否则交给 CompBaseTable 读 list.loading（Boolean prop 缺席会被 Vue 转成 false）
    ...(props.loading === true ? { loading: true } : {}),
    selectable: props.selectable,
    selectionWidth: props.selectionWidth,
    minWidth: props.minWidth,
    align: props.align,
    headerAlign: props.headerAlign,
    showSummary: props.showSummary,
    summaryMethod: props.summaryMethod,
    spanMethod: props.spanMethod,
    rowKey: props.rowKey,
    heightMode: props.heightMode,
    height: props.height,
    maxHeight: props.maxHeight,
    index: props.index,
    defaultExpandAll: props.defaultExpandAll,
    treeProps: props.treeProps,
    size: props.size,
    required: props.required,
    isolateCellSlots: props.isolateCellSlots,
    columnSlotMode: props.columnSlotMode,
    bottomOffset: props.bottomOffset,
    columns: dataColumns.value,
    indexColumnConfig: indexColumnConfig.value,
    expandColumnConfig: expandColumnConfig.value,
  }))

  const baseTableRef = useTemplateRef<{ refreshHeight: () => void }>('baseTableRef')
  let refreshRaf = 0
  const scheduleHeightRefresh = () => {
    cancelAnimationFrame(refreshRaf)
    refreshRaf = requestAnimationFrame(() => baseTableRef.value?.refreshHeight())
  }
  watch([() => props.showSearch, () => props.showTableToolBar], scheduleHeightRefresh)
  // onScopeDispose 而非 onUnmounted：组件卸载或 effectScope.stop 时都生效，
  // 取消未执行的 rAF，避免作用域销毁后仍回调刷新高度
  onScopeDispose(() => cancelAnimationFrame(refreshRaf))
</script>
