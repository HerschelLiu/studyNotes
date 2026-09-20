import type { VNode } from 'vue'
import { FormatFmt, FormatValueType } from '@/hooks/useFormatValue'
import { Props as CompPriceProps } from '@/components/Price/index.vue'

/** 列格式化配置（驱动 useFormatValue） */
export type TableColumnFormat = { type: FormatValueType; formatStr?: FormatFmt }

type PriceConfig = Omit<CompPriceProps, 'price'>

/** 单列配置 */
export interface TableColumn<T> {
  /** 唯一标识（prop 重复时必须传），兼作 localStorage 显隐 key */
  key?: string
  /** 数据字段名；'index' 为序号列（type=index），'action' 为操作列 */
  prop: keyof T | 'action' | 'index'
  /** 列标题 */
  label: string
  /** 固定宽度 */
  width?: string | number
  /** 最小宽度，不传时自动调用 calcColumnMinWidth(label) */
  minWidth?: string | number
  /** 固定列 */
  fixed?: boolean | 'left' | 'right'
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 内容溢出 tooltip */
  showOverflowTooltip?: boolean
  /** true → 单元格使用具名插槽 col-{prop} 自定义渲染；与 format/price 互斥 */
  slot?: boolean
  /** true → 表头复用 col-{prop} 插槽，通过插槽参数 header 区分表头和单元格 */
  headerSlot?: boolean
  /** 自定义表头渲染，可直接传入 useTableForm 的 renderRequiredHeader(...) */
  renderHeader?: (scope: any) => VNode
  /** useFormatValue 格式化配置；与 slot/price 互斥 */
  format?: TableColumnFormat
  /** 默认是否显示，默认 true */
  visible?: boolean
  /** true → 价格列，自动用 CompPrice 格式化金额；与 slot/format 互斥 */
  price?: boolean
  /** CompPrice 配置项，仅当 price=true 时生效 */
  priceConfig?: PriceConfig
}
