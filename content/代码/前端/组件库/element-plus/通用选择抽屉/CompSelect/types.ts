import type { CommonSearchItemOptions, CommonSearchItemProps } from '@/components/CommonSearchItem/types'
import type { CompTableProps, TableColumn } from '@/components/CompTable/types'
import type { AjaxResult, TableDataInfo } from '@/types'
import type { QueryKey } from '@tanstack/vue-query'
import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults'

export interface CompSelectColumn<T, R extends DefaultRow> {
  search: {
    attr: Partial<CommonSearchItemProps<T>>
    options: CommonSearchItemOptions<T>[]
  }
  table: {
    attr: Partial<CompTableProps<T, R>>
    options: TableColumn<R>[]
  }
}

export type ListResult = AjaxResult | TableDataInfo

export interface CompSelectProps<T, R extends DefaultRow> {
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
  /**
   * 树形选择模式
   * - all：父子都可选（默认）
   * - leaf：只允许选择子级，父级不可选
   * - cascade：父子联动，选父级自动选中全部后代，取消同理
   */
  treeSelection?: 'all' | 'leaf' | 'cascade'
  /**
   * 父子联动时，选择结果是否包含全部子级
   * - false（默认）：只返回最上层被选中的节点
   * - true：父级及其全部后代都返回
   */
  includeChildren?: boolean
  /** 查询条件 */
  query?: T
  /** 跨页选择依据字段 */
  keys?: string
  /** 是否选择模式：false 时仅查看，隐藏选择按钮、已选/批量操作与保存按钮 */
  selectable?: boolean
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
