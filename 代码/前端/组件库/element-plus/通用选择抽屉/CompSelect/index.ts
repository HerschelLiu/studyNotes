export const compSelectProps = <T extends Record<string, any>>(omit: string[] = []) => {
  const obj = {
    title: '选择',
    tip: undefined,
    zIndex: 1,
    selected: () => [],
    minLength: 1,
    maxLength: 500,
    disabledRow: () => false,
    query: () => ({} as T),
    keys: 'id',
    showPagination: true,
    showResetBtn: true,
    showDrawerSaveBtn: true
  }

  if (!omit.length) return obj

  return Object.fromEntries(Object.entries(obj).filter(([key]) => !omit.includes(key))) as typeof obj
}
