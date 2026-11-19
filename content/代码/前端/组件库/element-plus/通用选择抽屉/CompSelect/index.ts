export const compSelectProps = <T extends Record<string, any>>(omit: string[] = []) => {
  const obj = {
    title: '选择',
    tip: undefined,
    zIndex: 1,
    selected: () => [],
    minLength: 1,
    maxLength: 500,
    disabledRow: () => false,
    /** 树形选择模式：all / leaf / cascade */
    treeSelection: 'all' as const,
    /** 父子联动结果是否包含全部子级 */
    includeChildren: false,
    query: () => ({} as T),
    keys: 'id',
    /** 是否选择模式：false 时仅查看，隐藏选择按钮、已选/批量操作与保存按钮 */
    selectable: true,
    showPagination: true,
    showResetBtn: true,
    showDrawerSaveBtn: true
  }

  if (!omit.length) return obj

  return Object.fromEntries(Object.entries(obj).filter(([key]) => !omit.includes(key))) as typeof obj
}
