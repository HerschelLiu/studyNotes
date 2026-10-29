import type { VNode } from 'vue'
import type { DefineCheckAllProps } from '@/hooks/useCheckAll'
import type { DefineListProps } from '@/hooks/useList'
import type { RuleValue } from '@/hooks/useRules'
import type { TableColumnCtx } from 'element-plus'
import type { DefaultRow, SummaryMethod, TableProps, TreeProps } from 'element-plus/es/components/table/src/table/defaults'

import { FormatFmt, FormatValueType } from '@/hooks/useFormatValue'
import { Props as CompPriceProps } from '@/components/Price/index.vue'

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

/** CompTable 插槽定义 */
export interface CompTableSlots<R extends Record<string, any>> {
  toolbar?: () => any
  /** 静态展开列内容插槽，传入后自动渲染 type=expand 列 */
  expand?: (props: { row: R; $index: number }) => any
}

/** 列格式化配置（驱动 useFormatValue） */
export type TableColumnFormat = { type: FormatValueType; formatStr?: FormatFmt }

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

export interface CompTableProps<T, R extends DefaultRow> extends Omit<DefineListProps<T, R>, 'list'>, DefineCheckAllProps<R> {
  /**
   * 数据列表
   * - 传 List 对象：直接关联（v-model 绑定整个 List）
   * - 传数组：内部经 useListAdaptor 适配
   */
  list: List<T, R> | R[]
  /**
   * 多表区分 key，对应 `useCompTable(columns, key)` 的第二个参数
   * - 默认 `'default'`
   * - 同一页面多个列结构不同的表格时使用
   */
  tableKey?: string
  /** 列显隐 localStorage key，不传则不持久化 */
  storageKey?: string
  /** 是否显示顶部列工具栏 */
  showTableToolBar?: boolean
  /** 是否显示搜索区（由 TableToolbar 的搜索开关控制） */
  showSearch?: boolean
  /** 是否启用选择列 */
  selectable?: boolean
  /** 选择列宽度，默认 55 */
  selectionWidth?: ID
  /** 列最小宽度，默认 100 */
  minWidth?: ID
  /** 单元格水平对齐（全局默认，列 col.align 优先） */
  align?: 'left' | 'center' | 'right'
  /** 表头水平对齐（全局默认，列 col.headerAlign 优先；未传则跟随 align） */
  headerAlign?: 'left' | 'center' | 'right'
  /** 是否显示合计行，默认 false */
  showSummary?: boolean
  /** 合计行计算方法 */
  summaryMethod?: SummaryMethod<R>
  /** 是否显示右侧工具栏 */
  showRightToolbar?: boolean
  /** 高度策略，默认 'fixed' */
  heightMode?: TableHeightMode
  /** 显式高度，传入后直接使用，不参与视口计算 */
  height?: number
  /** 高度上限，仅 heightMode='max' 时生效；不传则使用视口剩余高度 */
  maxHeight?: number
  /** 是否显示序号 */
  index?: boolean
  /** 是否默认展开所有行 */
  defaultExpandAll?: boolean
  /** 树形表格：子节点字段映射（el-table tree-props），默认 { children: 'children', hasChildren: 'hasChildren' } */
  treeProps?: TreeProps
  /** 树形表格：行唯一标识（el-table row-key）。不传时回退使用 keys；树形组件必传 rowKey 或 keys */
  rowKey?: TableProps<any>['rowKey']
   /** 表格尺寸（el-table size），不传则使用 Element Plus 默认尺寸 */
  size?: TableProps<any>['size']
  /** 是否显示搜索开关图标 */
  showToolBarSearch?: boolean
  /**
   * 表头必填红星，配合 column.renderHeader=true 使用
   * - true：所有列均显示
   * - false：不显示
   * - 传表单校验规则（useRules 生成，async-validator 格式，字段值可为单条规则或规则数组）：仅该列规则中存在 required 时显示
   */
  required?: boolean | Record<string, RuleValue>
  bottomOffset?: number
}
