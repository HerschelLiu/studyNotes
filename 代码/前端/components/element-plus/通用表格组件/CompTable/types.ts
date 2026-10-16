import type { VNode } from 'vue'
import type { DefineCheckAllProps } from '@/hooks/useCheckAll'
import type { DefineListProps } from '@/hooks/useList'
import type { ToolbarButton } from '@/components/TableToolbar/types'
import type { RuleValue } from '@/hooks/useRules'

import { FormatFmt, FormatValueType } from '@/hooks/useFormatValue'
import { Props as CompPriceProps } from '@/components/Price/index.vue'

/** 列格式化配置（驱动 useFormatValue） */
export type TableColumnFormat = { type: FormatValueType; formatStr?: FormatFmt }

type PriceConfig = Omit<CompPriceProps, 'price'>

/** 单列配置 */
export interface TableColumn<T> {
  /** 唯一标识（prop 重复时必须传），兼作 localStorage 显隐 key */
  key?: string
  /**
   * 数据字段名
   * - 默认按 T 的键校验；'index' 为序号列（type=index），'action' 为操作列
   * - `custom-` 前缀为自定义列不做 T 键校验
   */
  prop: keyof T | 'action' | 'index' | `custom-${string}`
  /** 列标题 */
  label: string
  /** 多级表头子列：存在时渲染为分组表头，自身不绑定数据字段 */
  children?: TableColumn<T>[]
  /** 固定宽度 */
  width?: string | number
  /** 最小宽度，不传时自动调用 calcColumnMinWidth(label) */
  minWidth?: string | number
  /** 固定列 */
  fixed?: boolean | 'left' | 'right'
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 表头对齐方式（不传则跟随 align） */
  headerAlign?: 'left' | 'center' | 'right'
  /** 内容溢出 tooltip */
  showOverflowTooltip?: boolean
  /** true → 单元格使用具名插槽 col-{prop} 自定义渲染；与 format/price 互斥 */
  slot?: boolean
  /** true → 表头复用 col-{prop} 插槽，通过插槽参数 header 区分表头和单元格 */
  headerSlot?: boolean
  /** 自定义表头渲染：传函数直接用作 render-header；传 true 则由 CompTable 自动渲染必填红星 */
  renderHeader?: ((scope: any) => VNode) | true
  /** useFormatValue 格式化配置；与 slot/price 互斥 */
  format?: TableColumnFormat
  /** 默认是否显示，默认 true */
  visible?: boolean
  /** true → 价格列，自动用 CompPrice 格式化金额；与 slot/format 互斥 */
  price?: boolean
  /** CompPrice 配置项，仅当 price=true 时生效 */
  priceConfig?: PriceConfig
  /** true → 禁用列，不显示在表格中 */
  disabled?: boolean
}

export interface CompTableProp<T, R> extends Omit<DefineListProps<T, R>, 'list'>, DefineCheckAllProps<R> {
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
  /** 自动高度：true 时忽略 height/maxHeight,让表格随内容自然撑开 */
  isAutoHeight?: boolean
  /** 固定高度：true 时将 height 设为 useTableHeight 计算的高度（不随内容滚动） */
  isFixedHeight?: boolean
  /** 是否显示序号 */
  index?: boolean
  /** 是否显示搜索开关图标 */
  showToolBarSearch?: boolean
  /**
   * 表头必填红星，配合 column.renderHeader=true 使用
   * - true：所有列均显示
   * - false：不显示
   * - 传表单校验规则（useRules 生成，async-validator 格式，字段值可为单条规则或规则数组）：仅该列规则中存在 required 时显示
   */
  required?: boolean | Record<string, RuleValue>
  showLabel?: boolean
  bottomOffset?: number
}
