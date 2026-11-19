/**
 * 行选择 / 跨页选择的纯计算工具。
 * 不依赖 Vue、Element Plus 或若依 hooks，CompTable 核心与 useCheckAll 共用。
 */

/** 跨页选择行需要的最小字段 */
export type SelectableRow = { checked?: boolean; disabled?: boolean }

/** 拆分复合主键：'id' / 'id-type' → ['id', 'type'] */
export const splitKeys = (keys: string) => keys.split('-').filter(Boolean)

/**
 * 行主键：按主键字段顺序序列化，保留类型（1 与 '1' 不相等）。
 * 用 JSON 而不是字符串拼接，字段值里含分隔符时也不会产生歧义。
 */
export const rowKeyOf = (row: object, fields: string[]) => JSON.stringify(fields.map(field => Reflect.get(row, field)))

/** 跨页选择-初始数据是否选中 */
export function isChecked<T extends object>(arr: T[], keys: string, item: T) {
  const fields = splitKeys(keys)
  const itemKey = rowKeyOf(item, fields)
  return arr.some(row => rowKeyOf(row, fields) === itemKey)
}

/** 跨页选择-获取指定字段值的数据 */
export function getArrayBySelectedList<T extends object>(arr: T[], keys: string, value: (ID | boolean)[], getKey: string): string[] {
  const fields = splitKeys(keys)
  const array: string[] = []
  arr.forEach(item => {
    if (fields.every(field => value.includes(Reflect.get(item, field) as ID | boolean))) array.push(Reflect.get(item, getKey) as string)
  })
  return array
}

/** 跨页选择-插入数据（按主键去重，返回新数组，不修改入参） */
export function putSelectedList<T extends object>(arr: T[], putArr: T[], keys: string): T[] {
  const fields = splitKeys(keys)
  const merged = arr.slice()
  const existing = new Set(merged.map(row => rowKeyOf(row, fields)))
  putArr.forEach(row => {
    const key = rowKeyOf(row, fields)
    if (existing.has(key)) return
    existing.add(key)
    merged.push(row)
  })
  return merged
}

/** 跨页选择-删除数据（按主键过滤，返回新数组，不修改入参） */
export function deleteSelectedList<T extends object>(arr: T[], delArr: T[], keys: string): T[] {
  const fields = splitKeys(keys)
  const removed = new Set(delArr.map(row => rowKeyOf(row, fields)))
  return arr.filter(row => !removed.has(rowKeyOf(row, fields)))
}
