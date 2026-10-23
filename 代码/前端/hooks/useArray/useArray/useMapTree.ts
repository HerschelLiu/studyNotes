/**
 *  为树增加若干属性
 *
 * @param tree   原始树数组
 * @param mapper 转换函数，接收当前节点，返回要合并到节点上的额外字段
 * @param children  子节点名
 * @returns 转换后的新树
 */
export const useMapTree = <T extends Record<string, any>>(tree: T[], mapper: (node: T) => Record<string, any>, children = 'children'): T[] => {
  return tree.map(node => {
    const childrenArr = Array.isArray(node[children]) ? { [children]: useMapTree(node[children], mapper, children) } : {}
    return { ...node, ...mapper(node), ...childrenArr }
  })
}
