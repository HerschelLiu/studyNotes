<template>
  <div
    v-loading="list.loading"
    class="comp-table">
    <!-- 顶部工具栏（列筛选 + 自定义按钮） -->
    <TableToolbar
      v-if="showTableToolBar"
      :buttons="buttons"
      :columns="columnVisibility"
      :storage-key="storageKey"
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
      element-loading-text="正在加载..."
      style="width: 100%"
      :max-height="resolvedMaxHeight"
      :height="resolvedHeight"
      :show-summary="showSummary"
      :summary-method="summaryMethod"
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

      <!-- 动态数据列（支持 children 多级表头，递归渲染；过滤掉 prop='index' 和 disabled） -->
      <component :is="DynamicColumns" />
    </el-table>
  </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>, R extends Record<string, any>">
  import type { DefineCheckAllEmits } from '@/hooks/useCheckAll'
  import type { DefineListEmits } from '@/hooks/useList'
  import type { CompTableProp, CompTableSlots } from './types'

  import { useCheckAll } from '@/hooks/useCheckAll'
  import { useListAdaptor } from '@/hooks/useList'
  import { useTableHeight } from '@/hooks/useTable'
  import { useTempRefs } from '@/hooks/useTempRefs'
  import { createDynamicColumns } from './renderColumns'
  import { useColumnVisibility } from './useColumnVisibility'

  import TableToolbar from '@/components/TableToolbar/index.vue'

  const props = withDefaults(defineProps<CompTableProp<T, R>>(), {
    selected: () => [],
    keys: '',
    buttons: () => [],
    storageKey: '',
    showTableToolBar: true,
    showSearch: true,
    selectable: true,
    selectionWidth: 55,
    minWidth: 100,
    showSummary: false,
    summaryMethod: undefined,
    showRightToolbar: true,
    maxHeight: '',
    height: '',
    isAutoHeight: false,
    isFixedHeight: true,
    index: false,
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
   * 高度解析（优先级：isAutoHeight > height > isFixedHeight > maxHeight）
   * - isAutoHeight：忽略 height/maxHeight，表格自然撑开
   * - height：显式固定高度（不参与视口计算，避免滚动时高度递增）
   * - isFixedHeight：height=tableHeight（按视口剩余空间自动计算）
   * - maxHeight：兜底最大高度
   */
  const resolvedHeight = computed<number | string | undefined>(() => {
    if (props.isAutoHeight) return undefined
    if (props.height !== '') return props.height
    if (props.isFixedHeight) return tableHeight.value
    return undefined
  })
  const resolvedMaxHeight = computed<number | string | undefined>(() => {
    if (props.isAutoHeight) return undefined
    if (props.height !== '') return undefined
    if (props.isFixedHeight) return undefined
    return props.maxHeight || tableHeight.value
  })

  /** 搜索区显隐切换后表格 top 变化，需重新计算高度 */
  watch(
    () => props.showSearch,
    () => requestAnimationFrame(refreshTableHeight)
  )

  // ---------- 列表数据 ----------
  const adaptorList = useListAdaptor<R>(() => (Array.isArray(props.list) ? props.list : []))

  const list = computed<List<T, R>>({
    get: () =>
      Array.isArray(props.list) ? ((adaptorList as unknown) as List<T, R>) : props.list,
    set: val => emit('update:list', val),
  })

  watch(
    () => adaptorList.items,
    items => {
      if (Array.isArray(props.list) && toRaw(props.list) !== toRaw(items)) {
        emit('update:list', items as R[])
      }
    },
    { deep: true }
  )

  /** 跨页选择 v-model:selected + 全选 + 单行勾选 */
  const { isCheckAll, handleChecked } = useCheckAll(props.keys, list, props, { emit })

  // ---------- 列显隐（多级表头父子级联 / 持久化 / 渲染过滤） ----------
  const { columnVisibility, dataColumns, indexColumnConfig } = useColumnVisibility<R>({
    getColumns: () => props.columns,
    getStorageKey: () => props.storageKey,
  })

  // ---------- 动态数据列（递归渲染，详见 ./renderColumns） ----------
  const DynamicColumns = createDynamicColumns<R>({
    dataColumns,
    getMinWidth: () => props.minWidth,
    getRequired: () => props.required,
    getAlign: () => props.align,
    getHeaderAlign: () => props.headerAlign,
  })
</script>

<style lang="scss" scoped>
  :deep(.el-table) {
    transition: max-height 0.25s ease;
  }
</style>
