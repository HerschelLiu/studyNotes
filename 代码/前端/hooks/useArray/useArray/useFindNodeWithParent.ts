export interface FindNodeWithParentResult<T> {
  /** 命中的节点 */
  node: T
  /** 命中节点的父级，根级命中时为 undefined */
  parent: T | undefined
  /** 命中节点在其所在层级数组中的索引 */
  index: number
  /** 从根到命中节点的索引链 */
  path: number[]
}

/**
 * 获取对应 id 的数据项及其父级信息
 *
 * @param data
 * @param matcher 匹配依据: 可以是 id 值，也可以是函数（返回 boolean）
 * @param idKey   id 字段名，支持点号路径（如 'raw.accountingPeriodId'），matcher 为函数时忽略
 * @param childrenKey     子节点数组字段名，默认 'children'
 * @returns { node, parent, index, path } | null
 */
export function useFindNodeWithParent<T extends object>(
  data: T[],
  matcher: ID | ((node: T) => boolean),
  idKey = 'id',
  childrenKey = 'children'
): FindNodeWithParentResult<T> | null {
  /** 按点号路径逐层取值 */
  const resolveId = (node: any): any => idKey.split('.').reduce<any>((acc, k) => (acc == null ? acc : Reflect.get(acc, k)), node)

  const match = typeof matcher === 'function' ? matcher : (node: T) => resolveId(node) === matcher

  const find = (nodes: T[], parent: T | undefined, parentPath: number[]): FindNodeWithParentResult<T> | null => {
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index]
      if (match(node)) return { node, parent, index, path: [...parentPath, index] }

      const children = Reflect.get(node, childrenKey)
      if (Array.isArray(children)) {
        const result = find(children as T[], node, [...parentPath, index])
        if (result) return result
      }
    }
    return null
  }

  return find(data, undefined, [])
}
