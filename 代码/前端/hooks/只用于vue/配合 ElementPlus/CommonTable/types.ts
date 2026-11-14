/** 列的展示类型 */
export type TableColumnType =
  /** 默认：直接渲染 row[key]，或走 formatter */
  | 'default'
  /** 操作列：渲染 buttons */
  | 'operation'

/** 操作列按钮配置 */
export interface TableColumnButton {
  /** 按钮文字 */
  label: string
  /** Element Plus 按钮类型 */
  type: 'primary' | 'success' | 'warning' | 'danger'
  /** 图标名（已全局注册的图标组件名） */
  icon?: string
  /** 点击回调，参数为当前行 */
  click: (row: any) => void
}

export interface TableColumn {
  /** 列字段名，对应数据对象的属性 */
  key: string
  /** 列标题 */
  title: string
  /** 列类型：默认 default；'operation' 时渲染 buttons */
  type?: TableColumnType
  /** 列宽 */
  width?: string
  /** 固定列位置 */
  fixed?: 'left' | 'right'
  /** 列对齐方式，默认 left */
  align?: 'left' | 'center' | 'right'
  /** 是否隐藏该列（visibleColumns 会过滤掉） */
  hidden?: boolean
  /** 单元格自定义格式化，仅 type = 'default' 时生效 */
  formatter?: (row: any) => string
  /** 操作按钮配置，仅 type = 'operation' 时生效 */
  buttons?: TableColumnButton[]
}
