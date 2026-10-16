<template>
  <div class="comp-table">
    <!-- 顶部工具栏（列筛选 + 自定义按钮） -->
    <TableToolbar
      v-if="showTableToolBar"
      v-loading="list.loading"
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
      v-loading="list.loading"
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
  import type { FormatRow } from '@/hooks/useFormatValue'
  import type { DefineListEmits } from '@/hooks/useList'
  import type { TableColumnCtx } from 'element-plus'
  import type { VNode } from 'vue'
  import type { CompTableProp, TableColumn } from './types'

  import { ElTableColumn } from 'element-plus'

  import { useCheckAll } from '@/hooks/useCheckAll'
  import { useFormatValue } from '@/hooks/useFormatValue'
  import { useListAdaptor } from '@/hooks/useList'
  import { useRulesRequired } from '@/hooks/useRules'
  import { RequiredHeader, useTableHeight } from '@/hooks/useTable'
  import { useTempRefs } from '@/hooks/useTempRefs'

  import CompPrice from '@/components/Price/index.vue'
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

  interface CellScope {
    row: R
    column: TableColumnCtx<R>
    $index: number
  }

  interface HeaderScope {
    column: TableColumnCtx<R>
    $index: number
  }

  interface ColumnSlotProps {
    /** 是否为表头插槽 */
    header: boolean
    /** 表头模式下为空对象，不应在 header 分支中读取 */
    row: R
    /** 表头模式为列索引，单元格模式为行索引 */
    $index: number
    /** Element Plus 当前列作用域 */
    column: TableColumnCtx<R>
    /** 当前列的封装配置 */
    col: TableColumn<R>
    /** Element Plus 完整插槽作用域 */
    scope: CellScope | HeaderScope
  }

  interface Slots {
    toolbar: () => any
    [name: `col-${string}`]: (props: ColumnSlotProps) => any
  }
  defineSlots<Slots>()

  /** showSearch 双向绑定：TableToolbar 切换 → 透传给父组件 */
  const innerShowSearch = computed({
    get: () => props.showSearch,
    set: (val: boolean) => emit('update:showSearch', val),
  })

  /** 表格自适应高度 */
  const { ELTable } = useTempRefs('ELTable')
  const { tableHeight, refresh: refreshTableHeight } = useTableHeight(
    ELTable,
    props.bottomOffset
  )

  /**
   * 表格高度解析（优先级：isAutoHeight > height > isFixedHeight > maxHeight）
   * - isAutoHeight：忽略 height/maxHeight，表格自然撑开
   * - height：显式固定高度，直接使用（不参与视口计算，避免滚动时高度递增）
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

  /** 解析列的唯一 key */
  const resolveColKey = (col: TableColumn<R>, idx: number): string =>
    col.key ?? String(col.prop) ?? String(idx)

  /** 列显隐状态（RightToolbar 通过 v-model 直接修改 visible） */
  const columnVisibility = reactive(
    props.columns.map((col, idx) => ({
      key: resolveColKey(col, idx),
      label: col.label,
      visible: col.visible !== false,
    }))
  )

  /** 可见列（按 columns 原始顺序过滤） */
  const visibleColumns = computed(() =>
    props.columns.filter((col, idx) => {
      const key = resolveColKey(col, idx)
      const vis = columnVisibility.find(v => v.key === key)
      return vis ? vis.visible : true
    })
  )

  /** 序号列配置（columns 中 prop='index' 的项，用于覆盖默认序号列样式） */
  const indexColumnConfig = computed(() =>
    visibleColumns.value.find(col => col.prop === 'index')
  )

  /** 列是否显示必填红星：required 传表单规则时，按该列字段的规则判定（兼容深层校验 fields） */
  const isRequiredByRules = useRulesRequired(() => props.required)

  /** 解析列的 render-header：仅处理函数类型，true 和 headerSlot 走 #header 插槽 */
  const getRenderHeader = (col: TableColumn<R>) => {
    if (col.headerSlot || col.renderHeader === true) return undefined
    if (typeof col.renderHeader === 'function') return col.renderHeader
    return undefined
  }

  /** 数据列（过滤掉 prop='index'和disabled=true的列，序号列已单独渲染，序号列已单独渲染） */
  const dataColumns = computed(() =>
    visibleColumns.value.filter(col => col.prop !== 'index' && !col.disabled)
  )

  const slots = useSlots()

  /** 叶子列单元格内容（优先级：slot > price > format，与原模板保持一致） */
  const renderLeafCell = (col: TableColumn<R>, scope: CellScope) => {
    if (scope.$index < 0) return null
    if (col.slot) {
      return slots[`col-${String(col.prop)}`]?.({
        header: false,
        row: scope.row,
        $index: scope.$index,
        column: scope.column,
        col,
        scope,
      })
    }
    if (col.price) {
      return h(CompPrice, {
        price: scope.row[col.prop as keyof R],
        ...(col.priceConfig ?? {}),
      })
    }
    return useFormatValue(
      scope.row[col.prop as keyof R] as FormatRow,
      col.format?.type as never,
      col.format?.formatStr as never
    )
  }

  /** 自定义表头：renderHeader=true 渲染必填红星；headerSlot 走 col-{prop} 插槽 */
  const renderColumnHeader = (col: TableColumn<R>, scope: HeaderScope) => {
    if (col.renderHeader === true) {
      return h(RequiredHeader, {
        label: col.label,
        required: isRequiredByRules(String(col.prop)),
      })
    }
    return slots[`col-${String(col.prop)}`]?.({
      header: true,
      row: {} as R,
      $index: scope.$index,
      column: scope.column,
      col,
      scope,
    })
  }

  /** 递归渲染列：有 children 渲染为分组表头（el-table-column 嵌套），否则为叶子数据列 */
  const renderColumn = (col: TableColumn<R>, idx: number, depth = 0): VNode => {
    const hasChildren = !!col.children?.length
    const columnSlots: Record<string, (scope: any) => unknown> = {}

    if (hasChildren) {
      columnSlots.default = () =>
        col.children!.map((child, i) => renderColumn(child, i, depth + 1))
    } else {
      columnSlots.default = (scope: CellScope) => renderLeafCell(col, scope)
      if (col.headerSlot || col.renderHeader === true) {
        columnSlots.header = (scope: HeaderScope) => renderColumnHeader(col, scope)
      }
    }

    return h(
      ElTableColumn,
      {
        key: `${depth}-${resolveColKey(col, idx)}`,
        prop: hasChildren ? undefined : String(col.prop),
        label: col.label,
        width: col.width,
        minWidth: hasChildren ? col.minWidth : col.minWidth ?? props.minWidth,
        fixed: col.fixed,
        align: col.align,
        headerAlign: col.headerAlign ?? col.align,
        showOverflowTooltip: col.showOverflowTooltip,
        renderHeader: getRenderHeader(col),
      },
      columnSlots
    )
  }

  /** 动态列函数式组件（渲染期求值，自动追踪 dataColumns/columns 显隐变化） */
  const DynamicColumns = () => dataColumns.value.map((col, idx) => renderColumn(col, idx))
</script>

<style lang="scss" scoped>
  :deep(.el-table) {
    transition: max-height 0.25s ease;
  }
</style>
