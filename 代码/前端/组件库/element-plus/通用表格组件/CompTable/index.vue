<template>
  <div
    v-loading="list.loading"
    class="comp-table">
    <!-- 顶部工具栏（列筛选 + 自定义按钮） -->
    <!-- 列显隐状态由 useColumnVisibility 统一读写 storageKey，不再透传给 RightToolbar，避免同一份数据双写双读 -->
    <TableToolbar
      v-if="showTableToolBar"
      :columns="columnVisibility"
      :show-tool-bar-search="showToolBarSearch"
      :show-right-toolbar="showRightToolbar"
      v-model:show-search="innerShowSearch"
      @query-table="emit('queryTable')">
      <slot name="toolbar" />
    </TableToolbar>

    <!-- 表格 -->
    <el-table
      ref="ELTable"
      :data="list.items"
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
      <!-- 选择列 -->
      <el-table-column
        v-if="selectable"
        label="选择"
        :width="selectionWidth"
        align="center"
        fixed>
        <template #header>
          <el-checkbox v-model="isCheckAll" />
        </template>

        <template #default="{ row }">
          <el-checkbox
            v-model="row.checked"
            :disabled="row.disabled"
            @change="handleChecked(row)" />
        </template>
      </el-table-column>

      <!-- 序号列：仅当 index prop 为 true 时显示；columns 中 prop='index' 的项用于覆盖默认样式 -->
      <el-table-column
        v-if="index"
        type="index"
        :label="indexColumnConfig?.label ?? '序号'"
        :width="indexColumnConfig?.width ?? 80"
        :min-width="indexColumnConfig?.minWidth"
        :fixed="indexColumnConfig?.fixed ?? 'left'"
        :align="indexColumnConfig?.align ?? 'center'" />

      <!-- 展开列：存在 #expand 插槽时自动显示；columns 中 prop='expand' 的项用于覆盖默认样式 -->
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

      <!-- 动态数据列（支持 children 多级表头，递归渲染；过滤掉 prop='index'/'expand' 和 disabled） -->
      <component :is="DynamicColumns" />
    </el-table>
  </div>
</template>

<script lang="ts">
  export { useCompTable } from './useCompTable'
</script>

<script lang="ts" setup generic="T extends Record<string, any>, R extends Record<string, any>">
  import type { DefineCheckAllEmits } from '@/hooks/useCheckAll'
  import type { DefineListEmits } from '@/hooks/useList'
  import type { CompTableProps, CompTableSlots, TableColumn } from './types'

  import { useCheckAll } from '@/hooks/useCheckAll'
  import { useListAdaptor } from '@/hooks/useList'
  import { useTableHeight } from '@/hooks/useTable'
  import { useTempRefs } from '@/hooks/useTempRefs'
  import { compTableColumnsKey } from './CompTableColumn'
  import { createDynamicColumns } from './renderColumns'
  import { useColumnVisibility } from './useColumnVisibility'

  import TableToolbar from '@/components/TableToolbar/index.vue'

  defineOptions({ name: 'CompTable' })

  const props = withDefaults(defineProps<CompTableProps<T, R>>(), {
    selected: () => [],
    keys: '',
    storageKey: '',
    tableKey: 'default',
    showTableToolBar: true,
    showSearch: true,
    selectable: true,
    selectionWidth: 55,
    minWidth: 100,
    showSummary: false,
    summaryMethod: undefined,
    showRightToolbar: true,
    heightMode: 'fixed',
    index: false,
    defaultExpandAll: false,
    treeProps: () => ({ hasChildren: 'hasChildren', children: 'children', checkStrictly: false }),
    showToolBarSearch: true,
    required: false,
    bottomOffset: 20 + 20 + 32,
  })

  interface Emits
    extends Omit<DefineListEmits<T, R>, 'update:list'>,
      DefineCheckAllEmits<R> {
    /** 刷新按钮点击 */
    queryTable: []
    /** 搜索区显隐切换 */
    'update:showSearch': [val: boolean]
    /** List 模式回传整个 List；数组模式回传 items 数组 */
    'update:list': [value: List<T, R> | R[]]
  }
  const emit = defineEmits<Emits>()
  defineSlots<CompTableSlots<R>>()

  /** showSearch 双向绑定：TableToolbar 切换 → 透传给父组件 */
  const innerShowSearch = computed({
    get: () => props.showSearch,
    set: (val: boolean) => emit('update:showSearch', val),
  })

  // ---------- 表格高度 ----------
  const { ELTable } = useTempRefs('ELTable')
  const { tableHeight, refresh: refreshTableHeight } = useTableHeight(
    ELTable,
    props.bottomOffset
  )

  /**
   * 高度解析：
   * - 显式 height 优先，直接使用（不参与视口计算）
   * - fixed（默认）：height = 视口剩余高度
   * - max：max-height = maxHeight ?? 视口剩余高度
   * - auto：不限制高度
   */
  const resolvedHeight = computed<ID | undefined>(() => {
    if (props.height != null) return props.height
    return props.heightMode === 'fixed' ? tableHeight.value : undefined
  })
  const resolvedMaxHeight = computed<ID | undefined>(() => {
    if (props.height != null || props.heightMode !== 'max') return undefined
    return props.maxHeight ?? tableHeight.value
  })

  /** 搜索区显隐 / 高度策略变化后表格尺寸变化，需在新一帧布局完成后重新计算高度 */
  let heightRaf = 0
  const scheduleHeightRefresh = () => {
    cancelAnimationFrame(heightRaf)
    heightRaf = requestAnimationFrame(() => refreshTableHeight())
  }
  watch([() => props.showSearch, () => props.heightMode], scheduleHeightRefresh)
  onScopeDispose(() => cancelAnimationFrame(heightRaf))

  /** el-table row-key：优先 rowKey prop，回退 keys */
  const resolvedRowKey = computed(() => props.rowKey ?? (props.keys || undefined))

  // ---------- 列表数据 ----------
  /** List 模式下的空行数组（引用稳定，避免每次求值新建数组参与深度监听） */
  const EMPTY_ROWS: R[] = []

  /** 数组模式经 useListAdaptor 适配为 List；List 模式直接透传（两种模式都原地操作，不回写数组） */
  const adaptorList = useListAdaptor<R>(() => (Array.isArray(props.list) ? props.list : EMPTY_ROWS))

  const list = computed<List<T, R>>({
    get: () =>
      Array.isArray(props.list) ? ((adaptorList as unknown) as List<T, R>) : props.list,
    set: val => emit('update:list', val),
  })

  /** 跨页选择 v-model:selected + 全选 + 单行勾选 */
  const { isCheckAll, handleChecked } = useCheckAll(props.keys, list, props, { emit })

  // ---------- 列显隐（多级表头父子级联 / 持久化 / 渲染过滤） ----------
  /** 列来源：读取最近一次 useCompTable 注入的响应式 columns（按 tableKey 选择） */
  const columnsMap = inject(compTableColumnsKey, null)
  const sourceColumns = computed<TableColumn<R>[]>(() => (columnsMap?.get(props.tableKey)?.value ?? []) as TableColumn<R>[])

  /** 未注册 table-key 的开发期告警（放在 watchEffect 中，保持 computed 纯函数；已告警过的 key 不再刷屏） */
  const warnedTableKeys = new Set<string>()
  watchEffect(() => {
    if (!import.meta.env.DEV || !columnsMap || columnsMap.has(props.tableKey) || warnedTableKeys.has(props.tableKey)) return
    warnedTableKeys.add(props.tableKey)
    console.warn(`[CompTable] table-key "${props.tableKey}" 未在 useCompTable 中注册，已注册：${[...columnsMap.keys()].join(', ') || '(无)'}`)
  })

  const { columnVisibility, dataColumns, indexColumnConfig, expandColumnConfig } = useColumnVisibility<R>({
    getColumns: () => sourceColumns.value,
    getStorageKey: () => props.storageKey,
  })

  // ---------- 动态数据列（递归渲染） ----------
  const DynamicColumns = createDynamicColumns<R>({
    dataColumns,
    getTableProps: () => props,
  })
</script>

<style lang="scss" scoped>
  :deep(.el-table) {
    transition: max-height 0.25s ease;
  }
</style>
