import type { ComputedRef, Ref } from 'vue'

import { computed, reactive, unref, watch } from 'vue'

import { deleteSelectedList, putSelectedList, rowKeyOf, splitKeys } from '@/hooks/useCheckAll'
import { useError } from '@/hooks/useTip'

/** 选择操作 */
export const SelectAction = {
  /** 选择 */
  Select: 1,
  /** 取消 */
  Remove: 2
} as const
export type SelectAction = (typeof SelectAction)[keyof typeof SelectAction]

/** useSelect 依赖的组件 props */
export interface UseSelectProps<R = object> {
  /** 最大选择数量，0 表示不限制 */
  maxLength?: number
  /** 最小选择数量，默认 1 */
  minLength?: number
  /** 禁用选择的行：单行选择与全选本页都会跳过 */
  disabledRow?: (row: R) => boolean
}

/** 树形选择配置 */
export interface UseSelectTreeOptions<R = object> {
  /** all：父子都可选；leaf：只允许选择子级；cascade：父子联动 */
  mode: 'all' | 'leaf' | 'cascade'
  /** 子节点字段名 */
  childrenField: string
  /**
   * 联动选择结果是否包含全部子级
   * - false（默认）：只返回最上层被选中的节点，避免选中父级后产生大量子级标签
   * - true：父级及其全部后代都返回
   */
  includeChildren?: boolean
}

/** useSelect 依赖的列表对象 */
interface UseSelectList<Q, R> {
  /** 请求参数 */
  query: Q
  /** 当前页数据 */
  items: R[]
}

/** useSelect 依赖的跨页选择对象 */
interface UseSelectCheckAll<R> {
  /** 跨页已选数据 */
  selected: Ref<R[]>
}

/** 主键字段：'id' / 'id-type'（复合主键） */
type SelectKeys = Ref<string> | ComputedRef<string> | string

/**
 * 选择弹窗，用于抽屉中的选择组件
 *
 * - 主键比较统一复用 useCheckAll 的 `rowKeyOf`，与全选/清除本页保持一致的复合主键语义
 * - 已选主键用 reactive Set 按 key 缓存依赖，`includesRow` 为 O(1) 且只触发变化行的重新渲染
 * - `maxLength = 0` 表示不限制数量
 * - 传入 `tree` 时支持树形选择：只允许选择子级（leaf）或父子联动（cascade）
 */
export function useSelect<Q, R extends object>(
  props: UseSelectProps<R>,
  context: { emit: (event: any, ...args: any[]) => void },
  checkAll: UseSelectCheckAll<R>,
  list: UseSelectList<Q, R>,
  keys: SelectKeys,
  callback?: () => void,
  tree?: ComputedRef<UseSelectTreeOptions<R>>
) {
  /** 主键字段列表（支持运行时切换，如 id -> dept_id） */
  const fields = computed(() => splitKeys(unref(keys)))

  /**
   * 已选主键集合（按主键粒度收集依赖）。
   * 使用 reactive Set 增量同步：选择某一行时只触发该行（含主键变化行）的重新渲染，
   * 避免每次选择都重建 computed Set 导致表格所有操作列整体重渲染（大数据量下会卡死）。
   */
  const selectedKeySet = reactive(new Set<string>())

  /** 增量同步已选主键：逐项 add/delete，不用 clear()，否则会触发所有行重新渲染 */
  const syncSelectedKeySet = () => {
    const nextKeys = checkAll.selected.value.map(row => rowKeyOf(row, fields.value))
    const nextKeySet = new Set(nextKeys)

    selectedKeySet.forEach(key => {
      if (!nextKeySet.has(key)) selectedKeySet.delete(key)
    })
    nextKeys.forEach(key => {
      if (!selectedKeySet.has(key)) selectedKeySet.add(key)
    })
  }

  // pre：在本轮渲染前完成集合同步，includesRow 读到的仍是同一帧的最新值；
  // 不用 sync，避免 watcher 遍历集合时被 add 触发的 ITERATE_KEY 重入
  watch([() => checkAll.selected.value, fields], syncSelectedKeySet, { immediate: true })

  /** 最大选择数量，0 表示不限制 */
  const getMaxLength = () => props.maxLength ?? 0

  /** 最小选择数量，默认 1 */
  const getMinLength = () => props.minLength ?? 1

  // #region 树形选择
  const treeMode = computed(() => tree?.value.mode ?? 'all')
  const childrenField = computed(() => tree?.value.childrenField ?? 'children')

  /** 读取行的子节点 */
  const childrenOf = (row: R): R[] => {
    const children = (row as Record<string, unknown>)[childrenField.value]
    return Array.isArray(children) ? (children as R[]) : []
  }

  /** 是否非叶子节点（leaf 模式下父级不可选） */
  const isTreeParent = (row: R) => childrenOf(row).length > 0

  /** 树索引：节点、父节点、先序 / 后序列表 */
  const treeIndex = computed(() => {
    const nodeMap = new Map<string, R>()
    const parentMap = new Map<string, R>()
    const rows: R[] = []
    const postOrder: R[] = []

    const walk = (nodes: R[], parent?: R) => {
      nodes.forEach(node => {
        const key = rowKeyOf(node, fields.value)
        nodeMap.set(key, node)
        if (parent) parentMap.set(key, parent)
        rows.push(node)
        walk(childrenOf(node), node)
        postOrder.push(node)
      })
    }

    walk(list.items)
    return { nodeMap, parentMap, rows, postOrder }
  })

  /** 节点及其全部后代 */
  const collectWithDescendants = (row: R): R[] => [
    row,
    ...childrenOf(row).flatMap(child => collectWithDescendants(child))
  ]

  /** 按树顺序排序；不在当前树中的跨页行追加在末尾 */
  const sortByTree = (rows: R[]) => {
    const rowMap = new Map(rows.map(row => [rowKeyOf(row, fields.value), row]))
    const ordered = treeIndex.value.rows.filter(row => rowMap.has(rowKeyOf(row, fields.value)))
    const inTreeKeys = new Set(ordered.map(row => rowKeyOf(row, fields.value)))
    return [...ordered, ...rows.filter(row => !inTreeKeys.has(rowKeyOf(row, fields.value)))]
  }

  /** 父子联动：子级全选时自动带上父级，否则移除父级 */
  const syncParents = (rows: R[]) => {
    const rowMap = new Map(rows.map(row => [rowKeyOf(row, fields.value), row]))

    treeIndex.value.postOrder.forEach(parent => {
      const children = childrenOf(parent)
      if (!children.length) return
      const key = rowKeyOf(parent, fields.value)
      const allChecked = children.every(child => rowMap.has(rowKeyOf(child, fields.value)))
      // 禁用行不能因为子级全选而被被动选中
      allChecked && !props.disabledRow?.(parent)
        ? rowMap.set(key, parent)
        : rowMap.delete(key)
    })

    return sortByTree([...rowMap.values()])
  }

  /**
   * 选择结果收敛：
   * - 非 cascade 或 includeChildren=true：原样返回
   * - cascade 且 includeChildren=false：只保留最上层被选中的节点
   */
  const getResultRows = (rows: R[]): R[] => {
    if (treeMode.value !== 'cascade' || tree?.value.includeChildren) return rows

    const keySet = new Set(rows.map(row => rowKeyOf(row, fields.value)))
    return sortByTree(
      rows.filter(row => {
        const parent = treeIndex.value.parentMap.get(rowKeyOf(row, fields.value))
        return !parent || !keySet.has(rowKeyOf(parent, fields.value))
      })
    )
  }

  /** 回显归一化：leaf 去掉父级，cascade 用当前树补齐后代 / 父级 */
  const normalizeTreeSelected = (rows: R[]): R[] => {
    if (treeMode.value === 'all' || !treeIndex.value.rows.length) return rows

    if (treeMode.value === 'leaf') {
      return sortByTree(
        rows.filter(row => {
          const node = treeIndex.value.nodeMap.get(rowKeyOf(row, fields.value))
          return !node || !isTreeParent(node)
        })
      )
    }

    const expanded = new Map<string, R>()
    rows.forEach(row => {
      const node = treeIndex.value.nodeMap.get(rowKeyOf(row, fields.value))
      const nodes = node ? collectWithDescendants(node) : [row]
      nodes.forEach(item => expanded.set(rowKeyOf(item, fields.value), item))
    })

    return syncParents([...expanded.values()])
  }
  // #endregion

  /** 保存 */
  const handleSave = () => {
    const selected = checkAll.selected.value
    // 树形联动：按 includeChildren 决定是否只返回最上层节点
    const resultRows = getResultRows(selected)
    const maxLength = getMaxLength()
    const minLength = getMinLength()

    if (resultRows.length < minLength) {
      useError(`至少需要选择${minLength}条数据`)
      return
    }
    if (maxLength > 0 && resultRows.length > maxLength) {
      useError(`最多只能选择${maxLength}条数据`)
      return
    }

    // 当前页存在的行用最新对象回填，跨页行保留原对象。
    // 快路径：选中对象全部来自当前页（绝大多数场景）时无需回填，直接复用，
    // 跳过对整页行做复合主键 JSON 序列化（大数据量下是保存卡顿的主要来源）。
    const currentItemSet = new WeakSet<object>(list.items)
    let rows: R[]
    if (resultRows.every(item => currentItemSet.has(item))) {
      // 保持与原实现一致：返回新数组，避免调用方修改 change 参数时影响内部已选数据
      rows = resultRows.slice()
    } else {
      // 跨页 / 列表已刷新：按主键建 Map 一次性回填，避免逐个 find
      const currentItems = new Map<string, R>()
      list.items.forEach(item => currentItems.set(rowKeyOf(item, fields.value), item))
      rows = resultRows.map(item => currentItems.get(rowKeyOf(item, fields.value)) ?? item)
    }

    context.emit('update:modelValue', false)
    context.emit('change', rows)
    callback?.()
  }

  /** 选择 / 取消 */
  const handleChecked = (row: R, action: SelectAction = SelectAction.Select) => {
    const selected = checkAll.selected.value
    const rowKey = rowKeyOf(row, fields.value)

    if (action === SelectAction.Remove) {
      const affected =
        treeMode.value === 'cascade'
          ? new Set(collectWithDescendants(row).map(item => rowKeyOf(item, fields.value)))
          : new Set([rowKey])
      const next = selected.filter(item => !affected.has(rowKeyOf(item, fields.value)))
      checkAll.selected.value = treeMode.value === 'cascade' ? syncParents(next) : next
      return
    }

    // 禁用行兜底：UI 已禁用选择按钮，避免函数被直接调用时误选
    if (props.disabledRow?.(row)) return
    // 只允许选择子级：父级不参与选择
    if (treeMode.value === 'leaf' && isTreeParent(row)) return

    const maxLength = getMaxLength()

    if (treeMode.value === 'cascade') {
      const next = syncParents(putSelectedList(selected, collectWithDescendants(row), unref(keys)))
      const resultCount = getResultRows(next).length
      if (maxLength > 0 && resultCount > maxLength) {
        useError(`最多只能选择${maxLength}条数据`)
        return
      }
      checkAll.selected.value = next
      // 达到上限自动保存（赋值后即可判定，无需 nextTick）
      if (maxLength > 0 && resultCount >= maxLength) handleSave()
      return
    }

    // 先按主键去重，避免同一行重复入列
    const rest = selected.filter(item => rowKeyOf(item, fields.value) !== rowKey)

    let next: R[]
    if (maxLength === 1) {
      next = [row]
    } else if (maxLength === 0) {
      next = [...rest, row]
    } else {
      // 超出上限时移除末位，为新选择腾出名额（保持原有交互）
      next = [...rest.slice(0, maxLength - 1), row]
    }

    checkAll.selected.value = next

    // 达到上限自动保存（赋值后即可判定，无需 nextTick）
    if (maxLength > 0 && next.length >= maxLength) handleSave()
  }

  /** 清除所有 */
  const handleRemove = () => {
    checkAll.selected.value = []
  }

  /** 全选本页（跳过禁用行） */
  const handleSelectedPage = () => {
    const isDisabled = props.disabledRow
    const maxLength = getMaxLength()

    if (treeMode.value !== 'all') {
      const candidates =
        treeMode.value === 'leaf'
          ? treeIndex.value.rows.filter(row => !isTreeParent(row))
          : treeIndex.value.rows
      const rows = isDisabled ? candidates.filter(row => !isDisabled(row)) : candidates
      let next = putSelectedList(checkAll.selected.value, rows, unref(keys))
      if (treeMode.value === 'cascade') next = syncParents(next)
      if (maxLength > 0 && getResultRows(next).length > maxLength) {
        useError(`最多只能选择${maxLength}条数据`)
        return
      }
      checkAll.selected.value = next
      return
    }

    const rows = isDisabled ? list.items.filter(item => !isDisabled(item)) : list.items
    checkAll.selected.value = putSelectedList(checkAll.selected.value, rows, unref(keys))
  }

  /** 清除本页 */
  const handleRemovePage = () => {
    if (treeMode.value !== 'all') {
      checkAll.selected.value = deleteSelectedList(checkAll.selected.value, treeIndex.value.rows, unref(keys))
      return
    }
    checkAll.selected.value = deleteSelectedList(checkAll.selected.value, list.items, unref(keys))
  }

  /** 是否已选择 */
  const includesRow = (row: R) => selectedKeySet.has(rowKeyOf(row, fields.value))

  /** 是否已有选择 */
  const isChecked = computed(() => list.items.some(includesRow))

  return {
    /** 选择 */
    handleChecked,
    /** 保存 */
    handleSave,
    /** 清除所有 */
    handleRemove,
    /** 全选本页 */
    handleSelectedPage,
    /** 清除本页 */
    handleRemovePage,
    /** 是否已选择 */
    includesRow,
    /** 是否已有选择 */
    isChecked,
    /** 是否父级节点（树形表格用） */
    isTreeParent,
    /** 回显归一化（树形表格用） */
    normalizeTreeSelected
  }
}
