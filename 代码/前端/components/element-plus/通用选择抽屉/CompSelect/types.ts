import type { CommonSearchItemOptions, CommonSearchItemProps } from '@/components/CommonSearchItem/types'
import type { CompTableProp, TableColumn } from '@/components/CompTable/types'
import type { AjaxResult, TableDataInfo } from '@/types'
import type { QueryKey } from '@tanstack/vue-query'

export interface CompSelectColumn<T, R> {
  search: {
    attr: Partial<CommonSearchItemProps<T>>
    options: CommonSearchItemOptions<T>[]
  }
  table: {
    attr: Partial<CompTableProp<T, R>>
    options: TableColumn<R>[]
  }
}

export type ListResult = AjaxResult | TableDataInfo

export interface CompSelectProps<T, R> {
  /** 抽屉标题 */
  title?: string
  /** 描述标题 */
  tip?: string
  /** 指定弹窗层级 */
  zIndex?: number
  selected?: Partial<R>[]
  /** 最小选择数据 */
  minLength?: number
  /** 最大选择数据 */
  maxLength?: number
  /** 禁用选择行 */
  disabledRow?: (row: Partial<R>) => boolean
  /** 查询条件 */
  query?: T
  /** 跨页选择依据字段 */
  keys?: string
  /** 搜索 + 表格列配置 */
  columns: CompSelectColumn<T, R>
  /** 列表接口（兼容 AjaxResult / TableDataInfo，rows 与 total 均允许为空） */
  apiFn: (query?: T & ListBaseQuery) => Promise<ListResult>
  /** queryKey */
  queryKey: QueryKey | ((query?: T & ListBaseQuery) => QueryKey)
  showPagination?: boolean
  showResetBtn?: boolean
  showDrawerSaveBtn?: boolean
}
