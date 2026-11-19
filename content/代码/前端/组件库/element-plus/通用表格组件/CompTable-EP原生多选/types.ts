import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults'
import type { BaseCompTableProps, BaseCompTableSlots } from './CompBaseTable/types'

/** 转出 EP 自定义层的通用类型（TableColumn / CellScope / BaseCompTableProps ...） */
export * from './CompBaseTable/types'

/**
 * 若依拼装层 CompTable 的 props：在 CompBaseTable 之上增加工具栏 / 列显隐 / 搜索等能力。
 * 所有既有页面继续使用这个类型，无需修改。
 */
export interface CompTableProps<T, R extends DefaultRow> extends BaseCompTableProps<T, R> {
  /** 列显隐 localStorage key，不传则不持久化 */
  storageKey?: string
  /** 是否显示顶部列工具栏（CompTableToolbar） */
  showTableToolBar?: boolean
  /** 是否显示搜索区（由工具栏的搜索开关控制） */
  showSearch?: boolean
  /** 是否显示搜索开关图标 */
  showToolBarSearch?: boolean
  /** 是否显示右侧工具栏 */
  showRightToolbar?: boolean
}

/** CompTable（若依拼装层）插槽：与 CompBaseTable 一致，保留旧类型名 */
export interface CompTableSlots<R extends Record<string, any>> extends BaseCompTableSlots<R> {}
