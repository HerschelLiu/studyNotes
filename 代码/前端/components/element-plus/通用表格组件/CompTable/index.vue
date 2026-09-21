<template>
  <div class="comp-table">
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
      v-loading="list.loading"
      :data="list.items"
      element-loading-text="正在加载..."
      style="width: 100%"
      :max-height="maxHeight || tableHeight"
      :height="height"
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

      <!-- 动态数据列（过滤掉 prop='index'，序号列已单独渲染） -->
      <el-table-column
        v-for="(col, idx) in dataColumns"
        :key="col.key ?? String(col.prop) ?? idx"
        :prop="String(col.prop)"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth ?? minWidth"
        :fixed="col.fixed"
        :align="col.align"
        :show-overflow-tooltip="col.showOverflowTooltip"
        :render-header="col.headerSlot ? undefined : col.renderHeader">
        <template
          v-if="col.headerSlot"
          #header="scope">
          <slot
            :name="`col-${String(col.prop)}`"
            :header="true"
            :row="({} as R)"
            :$index="scope.$index"
            :column="scope.column"
            :col="col"
            :scope="scope" />
        </template>

        <template #default="scope">
          <template v-if="col.slot">
            <slot
              v-if="scope.$index >= 0"
              :name="`col-${String(col.prop)}`"
              :header="false"
              :row="scope.row"
              :$index="scope.$index"
              :column="scope.column"
              :col="col"
              :scope="scope" />
          </template>

          <template v-else>
            <CompPrice
              v-if="col.price"
              :price="scope.row[col.prop as keyof R]"
              v-bind="col.priceConfig" />
            <template v-else>
              {{
                useFormatValue(
                  scope.row[col.prop as keyof R] as FormatRow,
                  col.format?.type as never,
                  col.format?.formatStr as never
                )
              }}
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup generic="T extends Record<string, any>, R extends Record<string, any>">
  import type { TableColumnCtx } from 'element-plus'
  import type { ToolbarButton } from '@/components/TableToolbar/types'
  import type { DefineCheckAllEmits, DefineCheckAllProps } from '@/hooks/useCheckAll'
  import type { DefineListEmits, DefineListProps } from '@/hooks/useList'
  import type { FormatRow } from '@/hooks/useFormatValue'
  import type { TableColumn } from './types'

  import { useCheckAll } from '@/hooks/useCheckAll'
  import { useFormatValue } from '@/hooks/useFormatValue'
  import { useListAdaptor } from '@/hooks/useList'
  import { useTableHeight } from '@/hooks/useTable'
  import { useTempRefs } from '@/hooks/useTempRefs'

  import TableToolbar from '@/components/TableToolbar/index.vue'
  import CompPrice from '@/components/Price/index.vue'

  interface Prop extends Omit<DefineListProps<T, R>, 'list'>, DefineCheckAllProps<R> {
    /**
     * 数据列表
     * - 传 List 对象：直接关联（v-model 绑定整个 List）
     * - 传数组：内部经 useListAdaptor 适配（v-model 绑定的是 items 数组）
     */
    list: List<T, R> | R[]
    /** 列配置 */
    columns: TableColumn<R>[]
    /** 工具栏按钮配置 */
    buttons?: ToolbarButton[]
    /** 列显隐 localStorage key，不传则不持久化 */
    storageKey?: string
    /** 是否显示顶部列工具栏 */
    showTableToolBar?: boolean
    /** 是否显示搜索区（由 TableToolbar 的搜索开关控制） */
    showSearch?: boolean
    /** 是否启用选择列 */
    selectable?: boolean
    /** 选择列宽度，默认 50 */
    selectionWidth?: number | string
    /** 列最小宽度，默认 100 */
    minWidth?: number | string
    /** 是否显示合计行，默认 false */
    showSummary?: boolean
    /** 合计行计算方法 */
    summaryMethod?: (param: { columns: any[]; data: R[] }) => (string | VNode)[]
    /** 是否显示右侧工具栏 */
    showRightToolbar?: boolean
    /** 表格最大高度 */
    maxHeight?: number | string
    /** 表格高度*/
    height?: number | string
    /** 显示序号 */
    index?: boolean
    /** 是否显示搜索开关图标 */
    showToolBarSearch?: boolean
  }

  const props = withDefaults(defineProps<Prop>(), {
    selected: () => [],
    keys: '',
    buttons: () => [],
    storageKey: '',
    showTableToolBar: true,
    showSearch: true,
    selectable: true,
    selectionWidth: 50,
    minWidth: 100,
    showSummary: false,
    summaryMethod: undefined,
    showRightToolbar: true,
    maxHeight: '',
    height: '',
    index: false,
    showToolBarSearch: true,
  })

  interface Emits extends Omit<DefineListEmits<T, R>, 'update:list'>, DefineCheckAllEmits<R> {
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
  const { tableHeight, refresh: refreshTableHeight } = useTableHeight(ELTable)

  /** 搜索区显隐切换后表格 top 变化，需重新计算高度 */
  watch(
    () => props.showSearch,
    () => requestAnimationFrame(refreshTableHeight)
  )

  const adaptorList = useListAdaptor<R>(() => (Array.isArray(props.list) ? props.list : []))

  const list = computed<List<T, R>>({
    get: () => (Array.isArray(props.list) ? (adaptorList as unknown as List<T, R>) : props.list),
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

  /** 数据列（过滤掉 prop='index'和disabled=true的列，序号列已单独渲染，序号列已单独渲染） */
  const dataColumns = computed(() =>
    visibleColumns.value.filter(col => col.prop !== 'index' && !col.disabled)
  )
</script>

<style lang="scss" scoped>
  :deep(.el-table) {
    transition: max-height 0.25s ease;
  }
</style>
