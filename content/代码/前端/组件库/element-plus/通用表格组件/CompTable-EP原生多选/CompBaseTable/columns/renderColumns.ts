import type { ComputedRef, ShallowRef, VNode } from 'vue'
import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults'
import type { BaseCompTableProps, CellScope, HeaderScope, TableColumn, TableColumnFormat } from '../types'
import type { ColumnNodeSlots } from './CompTableColumn'
import type { FormatRaw } from '@/hooks/useFormatValue'
import type { CellColumnRef } from './CellRenderer'

import { computed, Fragment, shallowRef } from 'vue'
import { ElTableColumn } from 'element-plus'

import { useFormatValue } from '@/hooks/useFormatValue'
import { useRulesRequired } from '@/hooks/useRules'
import { RequiredHeader } from '@/hooks/useTable'

import CompPrice from '@/components/Price/index.vue'
import { CompTableCell } from './CellRenderer'
import { resolveColPath } from './columnPath'
import { CompTableColumn } from './CompTableColumn'

/** 列渲染需要的表格级默认值（全局对齐 / 最小宽度 / 必填规则） */
type ColumnDefaults<R extends DefaultRow> = Pick<BaseCompTableProps<any, R>, 'minWidth' | 'required' | 'align' | 'headerAlign' | 'isolateCellSlots'>

/** 按列格式化配置分派，保留 useFormatValue 各重载的参数约束 */
const formatCellValue = (raw: FormatRaw, format?: TableColumnFormat) => {
  if (!format) return useFormatValue(raw)
  if (format.type === 'enum') return useFormatValue(raw, 'enum', format.formatStr)
  if (format.type === 'dict') return useFormatValue(raw, 'dict', format.formatStr)
  return useFormatValue(raw, format.type, format.formatStr)
}

interface CreateDynamicColumnsOptions<R extends DefaultRow> {
  /** 已过滤的渲染列（分组 + 叶子） */
  dataColumns: ComputedRef<TableColumn<R>[]>
  /** 表格级 props（列未配置时取这里的默认值） */
  getTableProps: () => ColumnDefaults<R>
  /** 同一 prop 多个列声明的处理方式 */
  getColumnSlotMode: () => 'merge' | 'override'
}

/**
 * 稳定列 key 生成器（按列身份 = 层级 + 路径）：
 * - 列显隐只增删自身，其余列的 key 不变，避免 el-table-column 整体重挂载
 *   （重挂载会重新注册列、丢失列配置并触发多次 layout）
 * - 身份重复（未按约定传 key）时追加序号，保证同一级 vnode key 唯一
 */
const createColumnKey = () => {
  const occurrences = new Map<string, number>()
  return (identity: string) => {
    const times = occurrences.get(identity) ?? 0
    occurrences.set(identity, times + 1)
    return times ? `${identity}#${times}` : identity
  }
}

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
export const createDynamicColumns = <R extends Record<string, any>>({
  dataColumns,
  getTableProps,
  getColumnSlotMode
}: CreateDynamicColumnsOptions<R>) => {
  const slots = useSlots()
  const isRequiredByRules = useRulesRequired(() => getTableProps().required)

  /** <CompTableColumn> 没有提供任何插槽时的告警去重 */
  const warnedEmptyColumnNodes = new Set<string>()
  const warnEmptyColumnNode = (prop: string) => {
    if (!import.meta.env.DEV || warnedEmptyColumnNodes.has(prop)) return
    warnedEmptyColumnNodes.add(prop)
    console.warn(`[CompTable] 列 "${prop}" 的 <CompTableColumn> 没有 #header/#default 插槽，已忽略。`)
  }

  /** 合并同一 prop 的重复列声明：按声明顺序依次渲染（如内置操作列 + 消费方操作列） */
  const mergeSlot = <S>(prev?: (scope: S) => unknown, next?: (scope: S) => unknown) =>
    prev && next ? (scope: S) => [prev(scope), next(scope)] : next ?? prev

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
      const propKey = String(prop)
      const existing = map.get(propKey)
      // 默认 override：后声明的列覆盖先声明的；merge：按声明顺序合并渲染
      map.set(
        propKey,
        existing && getColumnSlotMode() === 'merge'
          ? {
              header: mergeSlot(existing.header, node.header),
              default: mergeSlot(existing.default, node.default),
            }
          : node
      )
    })
    return map
  }

  interface ColumnRenderContext {
    columnNodes: Map<string, ColumnNodeSlots<R>>
    defaults: ColumnDefaults<R>
    keyOf: (identity: string) => string
    isolateCellSlots: boolean
  }

  interface LeafCellInput {
    col: TableColumn<R>
    scope: CellScope<R>
    cellSlot: ColumnNodeSlots<R>['default'] | undefined
    columnRef: CellColumnRef<R>
    indexRefs: WeakMap<object, ShallowRef<number>>
  }

  const renderLeafCell = ({ col, scope, cellSlot, columnRef, indexRefs }: LeafCellInput, ctx: ColumnRenderContext) => {
    // el-table-column 渲染时会以 $index=-1 探测一次 default 插槽来收集子列，此时不渲染单元格
    if (scope.$index < 0) return null
    if (cellSlot) {
      if (!ctx.isolateCellSlots) return cellSlot({ row: scope.row, column: scope.column, $index: scope.$index })
      columnRef.value = scope.column
      let indexRef = indexRefs.get(scope.row)
      if (!indexRef) {
        indexRef = shallowRef(scope.$index)
        indexRefs.set(scope.row, indexRef)
      } else if (indexRef.value !== scope.$index) {
        indexRef.value = scope.$index
      }
      return h(CompTableCell, {
        render: cellSlot,
        row: scope.row,
        columnRef,
        indexRef
      })
    }
    if (col.price) {
      return h(CompPrice, {
        price: scope.row[col.prop as keyof R],
        ...(col.priceConfig ?? {})
      })
    }
    return formatCellValue(scope.row[col.prop as keyof R] as FormatRaw, col.format)
  }

  const renderColumnHeader = (col: TableColumn<R>, scope: HeaderScope<R>, headerNode?: ColumnNodeSlots<R>['header']) => {
    if (headerNode) return headerNode({ column: scope.column, $index: scope.$index })
    if (col.renderHeader === true) {
      return h(RequiredHeader, {
        label: col.label,
        required: isRequiredByRules(String(col.prop))
      })
    }
  }

  const renderColumn = (col: TableColumn<R>, ctx: ColumnRenderContext, parentPath = '', depth = 0): VNode => {
    const path = resolveColPath(col, parentPath)
    const node = ctx.columnNodes.get(String(col.prop))
    const cellSlot = node?.default
    const headerNode = node?.header
    const hasChildren = !!col.children?.length && !cellSlot
    const columnRef: CellColumnRef<R> = { value: undefined }
    const indexRefs = new WeakMap<object, ShallowRef<number>>()

    const columnSlots: Record<string, (scope: any) => unknown> = {
      default: hasChildren
        ? () => col.children!.map(child => renderColumn(child, ctx, path, depth + 1))
        : (scope: CellScope<R>) => renderLeafCell({ col, scope, cellSlot, columnRef, indexRefs }, ctx)
    }
    if (headerNode || col.renderHeader === true) {
      columnSlots.header = (scope: HeaderScope<R>) => renderColumnHeader(col, scope, headerNode)
    }

    return h(
      ElTableColumn,
      {
        key: ctx.keyOf(`${depth}|${path}`),
        prop: hasChildren ? undefined : String(col.prop),
        label: col.label,
        width: col.width,
        minWidth: hasChildren ? col.minWidth : col.minWidth ?? ctx.defaults.minWidth,
        fixed: col.fixed,
        align: col.align ?? ctx.defaults.align,
        headerAlign: col.headerAlign ?? ctx.defaults.headerAlign ?? col.align ?? ctx.defaults.align,
        showOverflowTooltip: col.showOverflowTooltip,
        renderHeader: !headerNode && typeof col.renderHeader === 'function' ? col.renderHeader : undefined
      },
      columnSlots
    )
  }

  /**
   * 列 VNode 缓存：仅当 dataColumns（列结构/显隐）或表格级默认 props 变化时重建。
   * 行增删不改变 dataColumns，直接复用缓存引用。
   */
  const columnsRender = computed(() => {
    const defaults = getTableProps()
    const ctx: ColumnRenderContext = {
      columnNodes: collectColumnNodes(),
      defaults,
      keyOf: createColumnKey(),
      isolateCellSlots: defaults.isolateCellSlots !== false
    }
    return dataColumns.value.map(col => renderColumn(col, ctx))
  })

  return () => columnsRender.value
}
