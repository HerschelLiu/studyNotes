import type { ComputedRef, VNode } from 'vue'
import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults'
import type { CellScope, CompTableProps, HeaderScope, TableColumn } from './types'
import type { ColumnNodeSlots } from './CompTableColumn'
import type { FormatRow } from '@/hooks/useFormatValue'

import { Fragment } from 'vue'
import { ElTableColumn } from 'element-plus'

import { useFormatValue } from '@/hooks/useFormatValue'
import { useRulesRequired } from '@/hooks/useRules'
import { RequiredHeader } from '@/hooks/useTable'

import CompPrice from '@/components/Price/index.vue'
import { CompTableColumn } from './CompTableColumn'

/** 列渲染需要的表格级默认值（全局对齐 / 最小宽度 / 必填规则） */
type ColumnDefaults<R extends DefaultRow> = Pick<CompTableProps<any, R>, 'minWidth' | 'required' | 'align' | 'headerAlign'>

interface CreateDynamicColumnsOptions<R extends DefaultRow> {
  /** 已过滤的渲染列（分组 + 叶子） */
  dataColumns: ComputedRef<TableColumn<R>[]>
  /** 表格级 props（列未配置时取这里的默认值） */
  getTableProps: () => ColumnDefaults<R>
}

/** 列标识（key 优先，否则取 prop） */
const resolveColKey = <R>(col: TableColumn<R>): string => col.key ?? String(col.prop)

/** 展平默认插槽里的 Fragment（在 Vue 3 中，Fragment（片段） 是一个内置的虚拟包装概念，它允许组件模板拥有多个根节点，而无需像 Vue 2 那样必须包裹在一个单一的 <div> 里） / 数组，拿到 <CompTableColumn> 标记的 VNode */
const flattenVNodes = (children: unknown): VNode[] => {
  if (Array.isArray(children)) return children.flatMap(item => flattenVNodes(item))
  if (children && typeof children === 'object') {
    const vnode = children as VNode
    if (vnode.type === Fragment) return flattenVNodes(vnode.children)
    if ('type' in vnode) return [vnode]
  }
  return []
}

/**
 * 创建动态数据列函数式组件：
 * - 支持 children 递归渲染多级表头
 * - 单元格优先级：<CompTableColumn>#default > price > format
 * - 表头优先级：<CompTableColumn>#header > renderHeader=true > label
 *
 * 必须在 setup 同步执行期间调用（内部使用 useSlots）
 */
export const createDynamicColumns = <R extends Record<string, any>>({ dataColumns, getTableProps }: CreateDynamicColumnsOptions<R>) => {
  const slots = useSlots()
  const isRequiredByRules = useRulesRequired(() => getTableProps().required)

  /** <CompTableColumn> 没有提供任何插槽时的告警去重 */
  const warnedEmptyColumnNodes = new Set<string>()
  const warnEmptyColumnNode = (prop: string) => {
    if (!import.meta.env.DEV || warnedEmptyColumnNodes.has(prop)) return
    warnedEmptyColumnNodes.add(prop)
    console.warn(`[CompTable] 列 "${prop}" 的 <CompTableColumn> 没有 #header/#default 插槽，已忽略。`)
  }

  /** 收集默认插槽里所有 <CompTableColumn prop="..."> 及其 #header/#default 插槽 */
  const collectColumnNodes = (): Map<string, ColumnNodeSlots<R>> => {
    const map = new Map<string, ColumnNodeSlots<R>>()
    flattenVNodes(slots.default?.()).forEach(vnode => {
      if (vnode.type !== CompTableColumn) return
      const prop = vnode.props?.prop
      if (prop == null) return

      const node: ColumnNodeSlots<R> = {}
      const raw = vnode.children
      if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
        const rawSlots = raw as Record<string, unknown>
        node.header = rawSlots.header as ColumnNodeSlots<R>['header']
        node.default = rawSlots.default as ColumnNodeSlots<R>['default']
      } else if (Array.isArray(raw)) {
        // 直接写在 <CompTableColumn> 里的内容视为单元格插槽
        node.default = () => raw
      }

      if (!node.header && !node.default) warnEmptyColumnNode(String(prop))
      map.set(String(prop), node)
    })
    return map
  }

  /** 叶子列单元格（优先级：<CompTableColumn>#default > price > format） */
  const renderLeafCell = (col: TableColumn<R>, scope: CellScope<R>, cellSlot?: ColumnNodeSlots<R>['default']) => {
    // el-table-column 渲染时会以 $index=-1 探测一次 default 插槽来收集子列，此时不渲染单元格
    if (scope.$index < 0) return null
    if (cellSlot) return cellSlot({ row: scope.row, column: scope.column, $index: scope.$index })
    if (col.price) {
      return h(CompPrice, {
        price: scope.row[col.prop as keyof R],
        ...(col.priceConfig ?? {})
      })
    }
    return useFormatValue(scope.row[col.prop as keyof R] as FormatRow, col.format?.type as never, col.format?.formatStr as never)
  }

  /** 表头：<CompTableColumn>#header 优先；其次 renderHeader=true 必填红星 */
  const renderColumnHeader = (col: TableColumn<R>, scope: HeaderScope<R>, headerNode?: ColumnNodeSlots<R>['header']) => {
    if (headerNode) return headerNode({ column: scope.column, $index: scope.$index })
    if (col.renderHeader === true) {
      return h(RequiredHeader, {
        label: col.label,
        required: isRequiredByRules(String(col.prop))
      })
    }
  }

  /** 递归渲染单列：有 children 渲染为分组表头，否则为叶子数据列 */
  const renderColumn = (col: TableColumn<R>, idx: number, depth: number, columnNodes: Map<string, ColumnNodeSlots<R>>): VNode => {
    const defaults = getTableProps()
    const node = columnNodes.get(String(col.prop))
    const cellSlot = node?.default
    const headerNode = node?.header
    // 父列（有 children）也写了 #default 时降级为叶子列渲染插槽，children 被忽略
    const hasChildren = !!col.children?.length && !cellSlot

    const columnSlots: Record<string, (scope: any) => unknown> = {
      default: hasChildren
        ? () => col.children!.map((child, i) => renderColumn(child, i, depth + 1, columnNodes))
        : (scope: CellScope<R>) => renderLeafCell(col, scope, cellSlot)
    }
    if (headerNode || col.renderHeader === true) {
      columnSlots.header = (scope: HeaderScope<R>) => renderColumnHeader(col, scope, headerNode)
    }

    return h(
      ElTableColumn,
      {
        key: `${depth}-${idx}-${resolveColKey(col)}`,
        prop: hasChildren ? undefined : String(col.prop),
        label: col.label,
        width: col.width,
        minWidth: hasChildren ? col.minWidth : col.minWidth ?? defaults.minWidth,
        fixed: col.fixed,
        align: col.align ?? defaults.align,
        headerAlign: col.headerAlign ?? defaults.headerAlign ?? col.align ?? defaults.align,
        showOverflowTooltip: col.showOverflowTooltip,
        // 有自定义表头插槽时不能再传 renderHeader 函数，否则 Element Plus 会优先用函数
        renderHeader: !headerNode && typeof col.renderHeader === 'function' ? col.renderHeader : undefined
      },
      columnSlots
    )
  }

  /** 函数式组件：渲染期求值，自动追踪 dataColumns 显隐变化与 <CompTableColumn> 子节点变化 */
  return () => {
    const columnNodes = collectColumnNodes()
    return dataColumns.value.map((col, idx) => renderColumn(col, idx, 0, columnNodes))
  }
}
