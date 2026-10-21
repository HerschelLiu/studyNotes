import type { TableColumn } from './types'

import cache from '@/plugins/cache'

/** 全角空格用于显隐面板子列缩进（RightToolbar 不支持层级结构） */
const LEVEL_INDENT = '　'

/** 列层级路径 key（显隐匹配 / vnode 渲染共用，全局唯一） */
export const resolveColPath = <R>(col: TableColumn<R>, parent = ''): string => `${parent}/${col.key ?? String(col.prop)}`

/** 显隐面板条目 */
interface VisItem {
  key: string
  label: string
  visible: boolean
  level: number
  parentKey?: string
}

/**
 * 递归扁平化列结构为显隐列表：
 * - disabled 列跳过；分组子列全 disabled 时整组跳过
 * - 子列 label 加缩进前缀表达层级
 */
const flatten = <R>(cols: TableColumn<R>[], level = 0, parentKey?: string, parentPath = ''): VisItem[] =>
  cols.flatMap(col => {
    if (col.disabled) return []
    const key = resolveColPath(col, parentPath)
    const label = level ? `${LEVEL_INDENT.repeat(level)}└ ${col.label}` : col.label
    if (col.children?.length) {
      const children = flatten(col.children, level + 1, key, key)
      return children.length ? [{ key, label, visible: col.visible !== false, level, parentKey }, ...children] : []
    }
    return [{ key, label, visible: col.visible !== false, level, parentKey }]
  })

/** 查找首个匹配的叶子列 */
const findLeaf = <R>(cols: TableColumn<R>[], fn: (c: TableColumn<R>) => boolean): TableColumn<R> | undefined => {
  for (const col of cols) {
    if (col.children?.length) {
      const hit = findLeaf(col.children, fn)
      if (hit) return hit
    } else if (fn(col)) {
      return col
    }
  }
}

interface Options<R extends Record<string, any>> {
  /** 列配置（getter，保持对 props.columns 替换 / 动态列结构的响应） */
  getColumns: () => TableColumn<R>[]
  /** 显隐持久化 localStorage key，空串不持久化 */
  getStorageKey: () => string
}

/**
 * 多级表头列显隐（父子级联）。支持运行时列结构变化（如切换预算任务），
 * 结构变化时重建条目并按 key 保留各列已有显隐状态
 */
export const useColumnVisibility = <R extends Record<string, any>>({ getColumns, getStorageKey }: Options<R>) => {
  /** 显隐条目列表（结构变化时原地 splice 重建，保留各列显隐状态） */
  const items = reactive(flatten(getColumns()))

  /** key -> 自身可见状态（渲染过滤用） */
  const visMap = computed(() => new Map(items.map(i => [i.key, i.visible])))
  /** key -> 条目（级联时查父节点） */
  const itemMap = computed(() => new Map(items.map(i => [i.key, i])))
  /** 父 key -> 直接子条目列表（级联用） */
  const childrenMap = computed(() => {
    const map = new Map<string, VisItem[]>()
    items.forEach(i => {
      if (!i.parentKey) return
      const list = map.get(i.parentKey) ?? []
      list.push(i)
      map.set(i.parentKey, list)
    })
    return map
  })

  /** 某分组下全部后代 */
  const descendants = (key: string): VisItem[] => (childrenMap.value.get(key) ?? []).flatMap(kid => [kid, ...descendants(kid.key)])

  /** 某分组下全部叶子后代 */
  const leafDescendants = (key: string): VisItem[] => descendants(key).filter(d => !childrenMap.value.get(d.key)?.length)

  /** 持久化到 localStorage（按数组下标，与 RightToolbar 的恢复方式一致） */
  const persist = () => {
    if (!getStorageKey()) return
    const state: Record<number, boolean> = {}
    items.forEach((i, idx) => (state[idx] = i.visible))
    cache.local.setJSON(getStorageKey(), state)
  }

  // ---------- 三种"非用户主动"变更的标记，watcher 据此跳过级联处理 ----------
  // ready=false        ：挂载时 RightToolbar 从 localStorage 恢复显隐
  // isRebuilding=true  ：列结构变化（切换预算任务等）重建条目
  // cascading=true     ：本次级联正在写子孙 / 祖先的 visible
  let ready = false
  let isRebuilding = false
  let cascading = false

  /** 对用户切换的列执行父子级联 */
  const cascade = (changed: VisItem[]) => {
    cascading = true
    changed.forEach(item => {
      if (childrenMap.value.get(item.key)?.length) {
        // 分组：整组子孙跟随
        descendants(item.key).forEach(d => {
          d.visible = item.visible
        })
      } else {
        // 叶子：自底向上，分组 visible = 子树是否存在可见叶子
        let pKey = item.parentKey
        while (pKey) {
          const parent = itemMap.value.get(pKey)
          if (parent) parent.visible = leafDescendants(parent.key).some(l => l.visible)
          pKey = parent?.parentKey
        }
      }
    })
    persist()
    nextTick(() => {
      cascading = false
    })
  }

  /**
   * 列结构变化时重建条目，按 key 保留显隐状态。
   * 用原地 splice 替换，保持 reactive 引用不变（RightToolbar 仍绑定同一数组）
   */
  const rebuild = () => {
    const prevVisible = new Map(items.map(i => [i.key, i.visible]))
    const next = flatten(getColumns()).map(i => ({
      ...i,
      visible: prevVisible.get(i.key) ?? i.visible
    }))
    isRebuilding = true
    items.splice(0, items.length, ...next)
    nextTick(() => {
      isRebuilding = false
    })
  }
  // 深度监听列配置：结构相同则不触发，结构变化才重建（Vue 内部做深度比较）
  watch(getColumns, rebuild, { deep: true })

  /**
   * 挂载后：按叶子状态归并分组显隐（修复历史存储中"父隐藏/子显示"的不一致），
   * 之后才开始接收用户操作
   */
  onMounted(() =>
    nextTick(() => {
      items.forEach(i => {
        if (childrenMap.value.get(i.key)?.length) {
          i.visible = leafDescendants(i.key).some(l => l.visible)
        }
      })
      persist()
      ready = true
    })
  )

  /**
   * 监听各列 visible 变化：仅处理用户主动切换，级联 / 恢复 / 重建都跳过。
   * 通过 getter 返回新数组，拿到 prevVal 做 diff，找出本次变化的列
   */
  watch(
    () => items.map(i => [i.key, i.visible] as const),
    (_curr, prev) => {
      if (!ready || isRebuilding || cascading) return
      const prevVisible = new Map(prev)
      const changed = items.filter(i => prevVisible.get(i.key) !== i.visible)
      if (!changed.length) return
      cascade(changed)
    }
  )

  // ---------- 渲染过滤 ----------
  /**
   * 递归过滤多级表头：
   * - 叶子生效可见 = 自身可见 && 所有祖先可见（父隐藏级联隐藏全部子列）
   * - disabled / prop='index' 叶子剔除（序号列单独静态渲染）
   * - 分组无生效子列时整组剔除
   */
  const filterTree = (cols: TableColumn<R>[], parent = '', parentVis = true): TableColumn<R>[] =>
    cols.flatMap(col => {
      if (col.disabled) return []
      const key = resolveColPath(col, parent)
      const own = visMap.value.get(key) ?? col.visible !== false
      const eff = parentVis && own
      if (col.children?.length) {
        const ch = filterTree(col.children, key, eff)
        return ch.length ? [{ ...col, children: ch }] : []
      }
      if (col.prop === 'index') return []
      return eff ? [col] : []
    })

  const dataColumns = computed(() => filterTree(getColumns()))
  const indexColumnConfig = computed(() => findLeaf(getColumns(), c => c.prop === 'index'))

  return { columnVisibility: items, dataColumns, indexColumnConfig }
}
