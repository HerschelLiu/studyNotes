/** 每层字段名配置 */
export interface TreeLevelConfig {
  /** 原节点中充当 id 的字段名 */
  idField: string
  /** 原节点中充当 name 的字段名 */
  nameField: string
  /** 原节点中子节点数组的字段名，默认 'children' */
  childrenField?: string
}

/** treeId 生成策略 */
export type TreeIdStrategy =
  /** 全局顺序编号 '1', '2', ... */
  | 'sequential'
  /** 层级+原id 组合：`${depth}-${node[idField]}` */
  | 'levelId'
  /** 自定义生成器 */
  | ((ctx: { node: any; depth: number; index: number; parent?: any; originalId: ID | undefined }) => string)

/**
 * 归一化后的节点
 */
export interface NormalizedTreeNode<T> {
  [key: string]: any
  /** 原始节点引用，keepRaw=false 时不存在 */
  raw?: T
}

/** useTreeNormalize 选项 */
export interface UseTreeNormalizeOptions {
  /**
   * 每层配置数组 或 动态函数
   *
   * 数组模式下的匹配规则由 matchMode 决定：
   * - 'depth' ：levels中下标对应层级
   * - 'auto'  ：levels不对应层级，存在就有用
   *
   * 函数形式：(node, depth) => LevelConfig | null（返回 null 视为叶子，不再下探）
   */
  levels: TreeLevelConfig[] | ((node: any, depth: number) => TreeLevelConfig | null | undefined)
  matchMode?: 'depth' | 'auto'
  /** treeId 生成策略，默认 'levelId' */
  treeIdStrategy?: TreeIdStrategy
  /** 是否保留 raw 原始节点引用，默认 true */
  keepRaw?: boolean
  /** 输出中 id 字段名，默认 'treeId' */
  outputIdField?: string
  /** 输出中 name 字段名，默认 'treeName' */
  outputNameField?: string
  /** 输出中子节点数组的字段名，默认 'children' */
  outputChildrenField?: string
}

export const useTreeNormalize = <T extends Record<string, any>>(
  input: T[] | undefined | null,
  options: UseTreeNormalizeOptions
): NormalizedTreeNode<T>[] => {
  if (!Array.isArray(input) || !input.length) return []

  const {
    levels,
    matchMode = 'auto',
    treeIdStrategy = 'levelId',
    keepRaw = true,
    outputIdField = 'treeId',
    outputNameField = 'treeName',
    outputChildrenField = 'children'
  } = options

  let sequentialCounter = 0

  const resolveLevel = (node: any, depth: number): TreeLevelConfig | null | undefined => {
    if (typeof levels === 'function') return levels(node, depth)
    if (matchMode === 'auto') {
      return levels.find(cfg => [cfg.idField, cfg.nameField, cfg.childrenField].some(field => !!field && Reflect.has(node, field)))
    }
    return levels[depth] ?? levels[levels.length - 1]
  }

  const genTreeId = (node: any, depth: number, index: number, parent: any | undefined, originalId: ID | undefined): string => {
    if (treeIdStrategy === 'sequential') return String(++sequentialCounter)
    if (treeIdStrategy === 'levelId') return `${depth}-${String(originalId ?? index)}`
    return treeIdStrategy({ node, depth, index, parent, originalId })
  }

  const walk = (nodes: T[], depth: number, parent: any | undefined): NormalizedTreeNode<T>[] =>
    nodes.map((node, index) => {
      const level = resolveLevel(node, depth)
      const childrenField = level?.childrenField ?? 'children'

      const originalId = level?.idField ? (Reflect.get(node, level.idField) as ID | undefined) : undefined
      const treeId = genTreeId(node, depth, index, parent, originalId)

      const treeName = level?.nameField ? String(Reflect.get(node, level.nameField) ?? '') : ''

      // 是否下探：节点上存在 childrenField 字段 且 值为非空数组 → 否则视为叶子
      let children: NormalizedTreeNode<T>[] | undefined
      if (Reflect.has(node, childrenField)) {
        const rawChildren = Reflect.get(node, childrenField)
        if (Array.isArray(rawChildren) && rawChildren.length) {
          children = walk(rawChildren as T[], depth + 1, node)
        }
      }

      const out = {
        [outputIdField]: treeId,
        [outputNameField]: treeName,
        ...(keepRaw ? { raw: node as T } : null),
        ...(children?.length ? { [outputChildrenField]: children } : null)
      } as NormalizedTreeNode<T>
      return out
    })

  return walk(input, 0, undefined)
}
