```ts
import { isHaveValue } from '@/hooks/useValidate'

type Callback = () => void

/** 删除对应索引 */
export function useRemoveArrayItem(array: any[], index: number, callback?: Callback) {
  array.splice(index, 1)
  if (typeof callback === 'function') callback()
}

/** 上移 */
export function usePrevArrayItem(array: any[], index: number, callback?: Callback) {
  const ele = array.splice(index, 1)
  array.splice(index - 1, 0, ele[0])
  if (typeof callback === 'function') callback()
}

/** 下移 */
export function useNextArrayItem(array: any[], index: number, callback?: Callback) {
  const ele = array.splice(index, 1)
  array.splice(index + 1, 0, ele[0])
  if (typeof callback === 'function') callback()
}

/** 新增 */
export function useCreateArrayItem(array: any[], index: number, item: any, callback?: Callback) {
  array.splice(index + 1, 0, typeof item === 'object' ? { ...item } : item)
  if (typeof callback === 'function') callback()
}

/** 字符串转数组，需要特定的,切割 */
export function useStringToArray(string: any): string[] {
  if (typeof string !== 'string') return []
  return string.split(',').filter(item => isHaveValue(item))
}

/** 递归删除数组中指定的属性值 */
export function useDeleteArrayKey(arr: any[], key: string) {
  arr.forEach(item => {
    if (item[key] && item[key].length) useDeleteArrayKey(item[key], key)
    else Reflect.deleteProperty(item, key)
  })
}

```

