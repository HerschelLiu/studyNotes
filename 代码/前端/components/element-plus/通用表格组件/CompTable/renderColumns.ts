import type { ComputedRef, VNode } from 'vue'
import type { CellScope, ColumnSlotProps, CompTableProp, HeaderScope, TableColumn } from './types'
import type { FormatRow } from '@/hooks/useFormatValue'

import { ElTableColumn } from 'element-plus'

import { useFormatValue } from '@/hooks/useFormatValue'
import { useRulesRequired } from '@/hooks/useRules'
import { RequiredHeader } from '@/hooks/useTable'

import CompPrice from '@/components/Price/index.vue'

interface CreateDynamicColumnsOptions<R extends Record<string, any>> {
  /** 已过滤的渲染列（分组 + 叶子） */
  dataColumns: ComputedRef<TableColumn<R>[]>
  /** 叶子列最小宽度（叶子未配置时兜底） */
  getMinWidth: () => CompTableProp<Record<string, any>, R>['minWidth']
  /** 表头必填红星规则（boolean 或 useRules 规则对象） */
  getRequired: () => CompTableProp<Record<string, any>, R>['required']
  /** 全局单元格对齐（列 col.align 优先） */
  getAlign: () => CompTableProp<Record<string, any>, R>['align']
  /** 全局表头对齐（列 col.headerAlign 优先，未传则跟随 align） */
  getHeaderAlign: () => CompTableProp<Record<string, any>, R>['headerAlign']
}

/** 渲染 vnode 用的兄弟级唯一 key */
const resolveColKey = <R>(col: TableColumn<R>, idx: number): string => col.key ?? String(col.prop) ?? String(idx)

/**
 * 创建动态数据列函数式组件：
 * - 支持 children 递归渲染多级表头
 * - 叶子单元格优先级：slot > price > format
 * - 表头支持 renderHeader 函数 / renderHeader=true 必填红星 / headerSlot 插槽
 *
 * 必须在 setup 同步执行期间调用（内部使用 useSlots）
 */
export const createDynamicColumns = <R extends Record<string, any>>(options: CreateDynamicColumnsOptions<R>) => {
  const { dataColumns, getMinWidth, getRequired, getAlign, getHeaderAlign } = options
  const slots = useSlots()
  const isRequiredByRules = useRulesRequired(getRequired)

  /** render-header 仅处理函数类型；true / headerSlot 走 #header 插槽 */
  const getRenderHeader = (col: TableColumn<R>) => {
    if (col.headerSlot || col.renderHeader === true) return undefined
    if (typeof col.renderHeader === 'function') return col.renderHeader
    return undefined
  }

  /** 调用 col-{prop} 插槽（单元格 / 表头共用，靠 header 参数区分） */
  const callColumnSlot = (col: TableColumn<R>, payload: Omit<ColumnSlotProps<R>, 'col'>): unknown =>
    slots[`col-${String(col.prop)}`]?.({ col, ...payload })

  /** 叶子列单元格内容（优先级：slot > price > format） */
  const renderLeafCell = (col: TableColumn<R>, scope: CellScope<R>) => {
    if (scope.$index < 0) return null
    if (col.slot) {
      return callColumnSlot(col, {
        header: false,
        row: scope.row,
        $index: scope.$index,
        column: scope.column,
        scope
      })
    }
    if (col.price) {
      return h(CompPrice, {
        price: scope.row[col.prop as keyof R],
        ...(col.priceConfig ?? {})
      })
    }
    return useFormatValue(scope.row[col.prop as keyof R] as FormatRow, col.format?.type as never, col.format?.formatStr as never)
  }

  /** 自定义表头：renderHeader=true 渲染必填红星；headerSlot 走 col-{prop} 插槽 */
  const renderColumnHeader = (col: TableColumn<R>, scope: HeaderScope<R>) => {
    if (col.renderHeader === true) {
      return h(RequiredHeader, {
        label: col.label,
        required: isRequiredByRules(String(col.prop))
      })
    }
    return callColumnSlot(col, {
      header: true,
      row: {} as R,
      $index: scope.$index,
      column: scope.column,
      scope
    })
  }

  /** 递归渲染单列：有 children 渲染为分组表头，否则为叶子数据列 */
  const renderColumn = (col: TableColumn<R>, idx: number, depth = 0): VNode => {
    const hasChildren = !!col.children?.length
    const columnSlots: Record<string, (scope: any) => unknown> = {}

    // 分组与叶子均支持自定义表头插槽 / 必填红星
    const useCustomHeader = col.headerSlot || col.renderHeader === true
    if (hasChildren) {
      columnSlots.default = () => col.children!.map((child, i) => renderColumn(child, i, depth + 1))
    } else {
      columnSlots.default = (scope: CellScope<R>) => renderLeafCell(col, scope)
    }
    if (useCustomHeader) {
      columnSlots.header = (scope: HeaderScope<R>) => renderColumnHeader(col, scope)
    }

    return h(
      ElTableColumn,
      {
        key: `${depth}-${resolveColKey(col, idx)}`,
        prop: hasChildren ? undefined : String(col.prop),
        label: col.label,
        width: col.width,
        minWidth: hasChildren ? col.minWidth : col.minWidth ?? getMinWidth(),
        fixed: col.fixed,
        align: col.align ?? getAlign(),
        headerAlign: col.headerAlign ?? getHeaderAlign() ?? col.align ?? getAlign(),
        showOverflowTooltip: col.showOverflowTooltip,
        renderHeader: getRenderHeader(col)
      },
      columnSlots
    )
  }

  /** 函数式组件：渲染期求值，自动追踪 dataColumns 显隐变化 */
  return () => dataColumns.value.map((col, idx) => renderColumn(col, idx))
}
