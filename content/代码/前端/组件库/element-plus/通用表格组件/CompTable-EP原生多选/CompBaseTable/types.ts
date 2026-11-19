import type { VNode } from 'vue'
import type { RuleValue } from '@/hooks/useRules'
import type { TableColumnCtx } from 'element-plus'
import type { DefaultRow, SummaryMethod, TableProps, TreeProps } from 'element-plus/es/components/table/src/table/defaults'
import type { Props as CompPriceProps } from '@/components/Price/index.vue'
import type { DictList, EnumObject } from '@/hooks/useFormatValue'

/** 单元格插槽作用域（Element Plus default 插槽） */
export interface CellScope<R extends Record<string, any>> {
  row: R
  column: TableColumnCtx<R>
  $index: number
}

/** 表头插槽作用域（Element Plus header 插槽） */
export interface HeaderScope<R extends Record<string, any>> {
  column: TableColumnCtx<R>
  $index: number
}

/** CompBaseTable（EP 自定义层）插槽定义 */
export interface BaseCompTableSlots<R extends Record<string, any>> {
  /** 列声明插槽：承载 <CompTableColumn> 标记，由 CompBaseTable 读取其中的 #header / #default，不直接渲染 */
  default?: () => any
  /** 通用工具栏插槽：若依层放 TableToolbar，非若依项目可放任意按钮 */
  toolbar?: () => any
  /** 静态展开列内容插槽，传入后自动渲染 type=expand 列 */
  expand?: (props: { row: R; $index: number }) => any
}

/** 列格式化配置（驱动 useFormatValue，按类型约束 formatStr） */
export type TableColumnFormat =
  | { type: 'boolean' | 'date'; formatStr?: string }
  | { type: 'enum'; formatStr: EnumObject }
  | { type: 'dict'; formatStr: DictList }

/** 单元格合并方法（el-table span-method） */
export type TableSpanMethod = NonNullable<TableProps<any>['spanMethod']>

/** 表格高度策略 */
export type TableHeightMode =
  /** 固定为视口剩余高度（默认），不随内容滚动 */
  | 'fixed'
  /** 以视口剩余高度为上限，内容少时收缩 */
  | 'max'
  /** 不限制高度，随内容自然撑开 */
  | 'auto'

type PriceConfig = Omit<CompPriceProps, 'price'>

/** 单列配置 */
export interface TableColumn<T> {
  /** 唯一标识（prop 重复时必须传），兼作 localStorage 显隐 key */
  key?: string
  /**
   * 数据字段名
   * - 默认按 T 的键校验；'index' 为序号列（type=index），'expand' 为展开列（type=expand），'action' 为操作列
   * - `custom-` 前缀为自定义列不做 T 键校验
   */
  prop: keyof T | 'action' | 'index' | 'expand' | `custom-${string}`
  /** 列标题 */
  label: string
  /** 多级表头子列：存在时渲染为分组表头，自身不绑定数据字段 */
  children?: TableColumn<T>[]
  /** 固定宽度 */
  width?: string | number
  /** 最小宽度，不传时使用表格级 minWidth 兜底 */
  minWidth?: string | number
  /** 固定列 */
  fixed?: boolean | 'left' | 'right'
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 表头对齐方式（不传则跟随 align） */
  headerAlign?: 'left' | 'center' | 'right'
  /** 内容溢出 tooltip */
  showOverflowTooltip?: TableColumnCtx<any>['showOverflowTooltip']
  /** 自定义表头渲染：传函数直接用作 render-header；传 true 则由 CompTable 自动渲染必填红星 */
  renderHeader?: ((scope: any) => VNode) | true
  /** useFormatValue 格式化配置；与 price 互斥 */
  format?: TableColumnFormat
  /** 默认是否显示，用于列显隐工具栏中 */
  visible?: boolean
  /** true → 价格列，自动用 CompPrice 格式化金额；与 format 互斥 */
  price?: boolean
  /** CompPrice 配置项，仅当 price=true 时生效 */
  priceConfig?: PriceConfig
  /** true → 彻底不渲染该列，且不出现在列显隐工具栏中（功能关闭/预留列），用户无法开启 */
  disabled?: boolean
}

/** 表格数据：数组，或带 items / loading 的对象（若依 List<T, R> 可直接传入） */
export type TableData<T, R> = R[] | { items: R[]; loading?: boolean; total?: number }

interface TableDataProps<T, R> {
  /** 数据列表：数组或 { items, loading } 对象 */
  list: TableData<T, R>
  /** 数组模式的加载态；对象模式读取 list.loading */
  loading?: boolean
}

interface TableSelectionProps<R> {
  /** 跨页已选数据 */
  selected?: R[]
  /** 主键字段，复合主键用 '-' 连接（如 'id'、'id-type'） */
  keys?: string
  /** 是否启用选择列 */
  selectable?: boolean
  /** 选择列宽度，默认 55 */
  selectionWidth?: ID
}

interface TableColumnProps<R> {
  /** 多表区分 key，对应 useCompTable(columns, key) 的第二个参数 */
  tableKey?: string
  /** 渲染列：不传时读取 useCompTable 注入的列；非若依项目可直接传 */
  columns?: TableColumn<R>[]
  /** 序号列配置覆盖，不传时从 columns 中找 prop='index' */
  indexColumnConfig?: TableColumn<R>
  /** 展开列配置覆盖，不传时从 columns 中找 prop='expand' */
  expandColumnConfig?: TableColumn<R>
  /** 列最小宽度，默认 100 */
  minWidth?: ID
  /** 单元格水平对齐（全局默认，列 col.align 优先） */
  align?: 'left' | 'center' | 'right'
  /** 表头水平对齐（全局默认，列 col.headerAlign 优先） */
  headerAlign?: 'left' | 'center' | 'right'
  /** 表头必填红星配置（配合 column.renderHeader=true） */
  required?: boolean | Record<string, RuleValue>
  /**
   * 同一 prop 出现多个 <CompTableColumn> 声明时的处理方式：
   * - 'override'（默认）：后声明的覆盖先声明的
   * - 'merge'：按声明顺序合并渲染（如内置操作列 + 消费方操作列）
   */
  columnSlotMode?: 'merge' | 'override'
}

interface TableLayoutProps<R extends DefaultRow> {
  /** 高度策略，默认 'fixed' */
  heightMode?: TableHeightMode
  /** 显式高度，传入后直接使用，不参与视口计算 */
  height?: number
  /** 高度上限，仅 heightMode='max' 时生效 */
  maxHeight?: number
  /** 底部预留高度兜底值 */
  bottomOffset?: number
  /** 表格尺寸（el-table size） */
  size?: TableProps<any>['size']
  /** 是否显示合计行，默认 false */
  showSummary?: boolean
  /** 合计行计算方法 */
  summaryMethod?: SummaryMethod<R>
  /** 合并行或列（el-table span-method） */
  spanMethod?: TableSpanMethod
  /** 是否显示序号 */
  index?: boolean
  /** 是否默认展开所有行 */
  defaultExpandAll?: boolean
  /** 树形表格子节点映射（el-table tree-props） */
  treeProps?: TreeProps
  /** 树形表格行唯一标识（el-table row-key）。不传时回退 keys */
  rowKey?: TableProps<any>['rowKey']
}

interface TableCellProps {
  /** 自定义单元格插槽是否包一层渲染组件（默认 true），让编辑态只重渲染当前单元格 */
  isolateCellSlots?: boolean
}

/** EP 自定义表格（CompBaseTable）的 props，按数据 / 选择 / 列 / 布局 / 单元格分组 */
export interface BaseCompTableProps<T, R extends DefaultRow>
  extends TableDataProps<T, R>,
    TableSelectionProps<R>,
    TableColumnProps<R>,
    TableLayoutProps<R>,
    TableCellProps {}
