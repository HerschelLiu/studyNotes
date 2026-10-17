import type { ComputedRef } from 'vue'
import type { TableColumn } from './types'

import cache from '@/plugins/cache'

/** 显隐面板条目（RightToolbar 仅识别 label/visible，层级信息烤进 label） */
interface ColumnVisibilityItem {
  /** 列层级路径 key，全局唯一 */
  key: string
  /** 展示文案（子列带缩进前缀） */
  label: string
  /** 是否显示（RightToolbar 通过 v-model 直接修改） */
  visible: boolean
  /** 表头层级，0 为顶层 */
  level: number
  /** 父级路径 key，顶层列为空 */
  parentKey?: string
}

/** 全角空格不被 HTML 折叠，用于显隐面板中子列的层级缩进（RightToolbar 不支持层级结构） */
const LEVEL_INDENT = '　'

/** 列层级路径 key（全局唯一，显隐匹配 / vnode 渲染共用） */
export const resolveColPath = <R>(col: TableColumn<R>, parentPath = ''): string => `${parentPath}/${col.key ?? String(col.prop)}`

/**
 * 递归扁平化显隐列表（分组表头与子列均进入面板）：
 * - disabled 列不进入面板
 * - 分组列的子列全部 disabled 时，整组不进入面板
 * - 子列 label 前缀全角空格 + └ 表达层级
 */
const flattenVisibility = <R>(cols: TableColumn<R>[], level = 0, parentKey?: string, parentPath = ''): ColumnVisibilityItem[] =>
  cols.flatMap(col => {
    if (col.disabled) return []
    const key = resolveColPath(col, parentPath)
    const label = level > 0 ? `${LEVEL_INDENT.repeat(level)}└ ${col.label}` : col.label
    if (col.children?.length) {
      const children = flattenVisibility(col.children, level + 1, key, key)
      if (!children.length) return []
      return [{ key, label, visible: col.visible !== false, level, parentKey }, ...children]
    }

    return [{ key, label, visible: col.visible !== false, level, parentKey }]
  })

/** 查找首个匹配的叶子列 */
const findLeafColumn = <R>(cols: TableColumn<R>[], predicate: (col: TableColumn<R>) => boolean): TableColumn<R> | undefined => {
  for (const col of cols) {
    if (col.children?.length) {
      const hit = findLeafColumn(col.children, predicate)
      if (hit) return hit
    } else if (predicate(col)) {
      return col
    }
  }
  return undefined
}

interface UseColumnVisibilityOptions<R extends Record<string, any>> {
  /** 列配置（getter，保持对 props.columns 替换的响应） */
  getColumns: () => TableColumn<R>[]
  /** 显隐持久化 localStorage key，空串不持久化 */
  getStorageKey: () => string
}

interface UseColumnVisibilityReturn<R extends Record<string, any>> {
  /** 传给工具栏的扁平显隐列表（RightToolbar 直接改 visible） */
  columnVisibility: ColumnVisibilityItem[]
  /** 实际渲染的数据列（已按祖先显隐级联过滤，剔除 disabled/序号列） */
  dataColumns: ComputedRef<TableColumn<R>[]>
  /** 序号列样式覆盖配置（任意层级中 prop='index' 的叶子列） */
  indexColumnConfig: ComputedRef<TableColumn<R> | undefined>
}

/**
 * 多级表头列显隐：父子级联
 */
export const useColumnVisibility = <R extends Record<string, any>>(options: UseColumnVisibilityOptions<R>): UseColumnVisibilityReturn<R> => {
  const { getColumns, getStorageKey } = options

  /** 列显隐结构静态 */
  const columnVisibility = reactive(flattenVisibility(getColumns()))

  /** key -> 自身可见状态（渲染过滤时沿层级路径匹配） */
  const visibilityMap = computed(() => new Map(columnVisibility.map(item => [item.key, item.visible])))

  // ---------- 多级表头父子级联的索引缓存 ----------
  /** `visibilityItemMap` —— 按 key 查条目 */
  const visibilityItemMap = new Map(columnVisibility.map(item => [item.key, item]))
  /** 按 key 查直接子条目 */
  const visibilityChildrenMap = (() => {
    const map = new Map<string, ColumnVisibilityItem[]>()
    columnVisibility.forEach(item => {
      if (!item.parentKey) return
      const list = map.get(item.parentKey) ?? []
      list.push(item)
      map.set(item.parentKey, list)
    })
    return map
  })()

  /** 分组下全部后代 */
  const getDescendants = (key: string): ColumnVisibilityItem[] =>
    (visibilityChildrenMap.get(key) ?? []).flatMap(kid => [kid, ...getDescendants(kid.key)])

  /** 分组下全部叶子后代 */
  const getLeafDescendants = (key: string): ColumnVisibilityItem[] => getDescendants(key).filter(d => !visibilityChildrenMap.get(d.key)?.length)

  /**
   * 程序性级联标记
   */
  // 记录本批被程序级联修改的列 key。
  const cascadedKeys = new Set<string>()
  // 级联赋值的唯一入口：
  const setCascadedVisible = (item: ColumnVisibilityItem, visible: boolean) => {
    if (item.visible === visible) return
    cascadedKeys.add(item.key)
    item.visible = visible
  }

  /** 用户手动切换（RightToolbar 直接改 visible，无标记即视为用户操作） */
  const handleUserToggle = (item: ColumnVisibilityItem) => {
    if (visibilityChildrenMap.get(item.key)?.length) {
      // 分组勾选/取消：整组显隐，中间分组与叶子全部同步
      getDescendants(item.key).forEach(d => setCascadedVisible(d, item.visible))
      return
    }
    // 叶子切换：自底向上归并祖先，分组 visible = 子树是否存在可见叶子
    let parentKey = item.parentKey
    while (parentKey) {
      const parent = visibilityItemMap.get(parentKey)
      if (parent) {
        const anyVisible = getLeafDescendants(parent.key).some(leaf => leaf.visible)
        setCascadedVisible(parent, anyVisible)
      }
      parentKey = parent?.parentKey
    }
  }

  /** 级联完成后覆写 localStorage（RightToolbar 点击当刻写入的是级联前中间态） */
  const persistColumnVisibility = () => {
    if (!getStorageKey()) return
    const state: Record<number, boolean> = {}
    columnVisibility.forEach((item, index) => (state[index] = item.visible))
    cache.local.setJSON(getStorageKey(), state)
  }

  /**
   * 初始化保护：RightToolbar 挂载时会按 localStorage 恢复 visible，这批变更不是
   * 用户操作，watcher 一律忽略；挂载结束后按叶子状态自底向上归并分组显隐，
   * 修复历史存储中“父隐藏/子显示”的不一致
   */
  let visibilityReady = false
  onMounted(() =>
    nextTick(() => {
      ;[...columnVisibility].reverse().forEach(item => {
        if (visibilityChildrenMap.get(item.key)?.length) {
          item.visible = getLeafDescendants(item.key).some(leaf => leaf.visible)
        }
      })
      visibilityReady = true
      persistColumnVisibility()
    })
  )

  columnVisibility.forEach(item =>
    watch(
      () => item.visible,
      () => {
        if (!visibilityReady) return
        if (cascadedKeys.delete(item.key)) return
        handleUserToggle(item)
        persistColumnVisibility()
      }
    )
  )

  // ---------- 渲染过滤 ----------
  /**
   * 递归过滤多级表头列（渲染用）：
   * - 叶子生效可见 = 自身可见 && 所有祖先可见（父隐藏级联隐藏全部子列）
   * - disabled / prop='index' 叶子剔除（序号列单独静态渲染）
   * - 分组列无生效子列时整组剔除
   */
  const filterTreeColumns = (cols: TableColumn<R>[], parentPath = '', parentVisible = true): TableColumn<R>[] =>
    cols.flatMap(col => {
      if (col.disabled) return []
      const key = resolveColPath(col, parentPath)
      const ownVisible = visibilityMap.value.get(key) ?? col.visible !== false
      const effectiveVisible = parentVisible && ownVisible
      if (col.children?.length) {
        const children = filterTreeColumns(col.children, key, effectiveVisible)
        return children.length ? [{ ...col, children }] : []
      }
      if (col.prop === 'index') return []
      return effectiveVisible ? [col] : []
    })

  const dataColumns = computed(() => filterTreeColumns(getColumns()))

  const indexColumnConfig = computed(() => findLeafColumn(getColumns(), col => col.prop === 'index'))

  return { columnVisibility, dataColumns, indexColumnConfig }
}
