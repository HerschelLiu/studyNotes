

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

// 有值更新，无值增加
/**
 * 数组组 Set,约等于 Map.set
 * @param target 目标数组
 * @param key   唯一 key
 * @param value 设置值
 * @returns array
 */
export const useArraySet = <T extends Object>(target: T[], key: keyof T, value: T) => {
  let array = [...target]
  const index = array.findIndex(item => item[key] === value[key])
  if (index === -1) {
    array = [...array, value]
  } else {
    array.splice(index, 1, value)
  }
  return array
}

/**
 * 数组分组
 * @param array 目标数组
 * @param size 分组大小
 * @returns
 */
export const useChunk = <T extends []>(array: T[], size: number) =>
  Array.from({ length: Math.ceil(array.length / size) }, (_v: number, i: number) => array.slice(i * size, i * size + size))
```



自己新增

```ts
 // 以下代码为js，还未ts化
 /** 多级对象数组展平 */
export const useFlat = (list, name = 'children') => {
  let arr = []
  list.forEach((item) => {
    arr = [...arr, item]
    if (item[name] && Array.isArray(item[name]))
      arr = [...arr, ...useFlat(item[name])]
  })

  return arr
}

type DeepestDataAndParent<T> = {
  item: T
  parent: T | null
  depth: number
}

/**
 * 获取多级数组每个元素最深层级数据及其父级数据
 * @param {Array<Object>} arr 数组
 * @param {Object} parent 最深层级数据的直属父级数据
 * @param {Number} depth 层级
 * @returns Array<{ item: Object;parent: Object | null;depth: Number; }>
 */
export const useDeepestDataAndParent = <T extends object>(
  arr: T[],
  parent: T | null = null,
  depth = 1,
  key = 'children'
): DeepestDataAndParent<T>[] => {
  let deepestItems: DeepestDataAndParent<T>[] = []
  for (let item of arr) {
    if (Reflect.has(item, key)) {
      const results = useDeepestDataAndParent(Reflect.get(item, key) as T[], item, depth + 1, key)
      if (results.length > 0) {
        deepestItems.push(...results)
      }
    } else {
      deepestItems.push({
        item,
        parent,
        depth
      })
    }
  }
  return deepestItems
}

/** 获取对应id的数据项 */
export function useFindNode<T extends object>(data: T[], id: string, idKey = 'id', key = 'children'): T | null {
  for (let i = 0; i < data.length; i++) {
    if (Reflect.get(data[i], idKey) === id) {
      return data[i]
    } else if (Reflect.has(data[i], key)) {
      const result = useFindNode(Reflect.get(data[i], key) as T[], id, idKey, key)
      if (result) {
        return result
      }
    }
  }
  return null
}

/** 获取对应id的数据项以及其父级数据 */
export function useFindNode<T extends object>(data: T[], id: string, idKey = 'id', key = 'children', parent: T): T[] | null {
  for (let i = 0; i < data.length; i++) {
    if (Reflect.get(data[i], idKey) === id) {
      return [data[i], parent]
    } else if (Reflect.has(data[i], key)) {
      const result = useFindNode(Reflect.get(data[i], key) as T[], id, idKey, key, parent)
      if (result) {
        return result
      }
    }
  }
  return null
}

/**
 * 获取对象的最深层级数
 * @param obj 要计算深度的对象
 * @param key 子对象的键名，默认为 'children'
 * @returns 对象的最深层级
 */
export const useGetObjMaxDepth = <T extends object>(obj: T, key = 'children'): number => {
  if (!Reflect.has(obj, key)) {
    return 1
  }

  const children = Reflect.get(obj, key) as T[]
  if (!Array.isArray(children) || children.length === 0) {
    return 1
  }

  return 1 + Math.max(...children.map(child => useGetObjMaxDepth(child, key)))
}

/**
 * 获取对象数组中最深层级数
 * @param arr 对象数组
 * @param key 子对象的键名，默认为 'children'
 * @returns 数组中最深层级
 */
export const useGetArrayMaxDepth = <T extends object>(arr: T[], key = 'children'): number => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return 0
  }

  return Math.max(...arr.map(item => useGetObjMaxDepth(item, key)))
}

/**
 * 返回目标节点的所有祖先节点数组
 * @returns { node: T | null; ancestors: T[] } node - 目标节点，ancestors - 所有祖先节点数组
 */
export function useFindNodeWithAncestors<T extends object>(
  data: T[],
  id: string,
  idKey = 'id',
  key = 'children',
  ancestors: T[] = []
): { node: T | null; ancestors: T[] } {
  for (let i = 0; i < data.length; i++) {
    const currentAncestors = [...ancestors, data[i]]
    if (Reflect.get(data[i], idKey) === id) {
      return { node: data[i], ancestors }
    } else if (Reflect.has(data[i], key)) {
      const result = useFindNodeWithAncestors(Reflect.get(data[i], key) as T[], id, idKey, key, currentAncestors)
      if (result.node) {
        return result
      }
    }
  }
  return { node: null, ancestors: [] }
}

/** 判断两个数组中的值是否相等（不校验顺序）equality = true 校验顺序 */
export const useArraysEqual = (arr1, arr2, equality = false) => {
  if (equality) return JSON.stringify(arr1) === JSON.stringify(arr2)
  if (arr1.length !== arr2.length) return false
  const arr = []
  arr2.forEach(item => {
    const obj = arr1.find(it => JSON.stringify(it) === JSON.stringify(item))
    arr.push(!!obj)
  })

  return arr.every(item => item)
}

/** 数组排序 */
export function useSort<T extends Record<K, Key>, K extends keyof T>(originalArray: T[], fieldKey: K, sortOrder?: T[K][]): T[] {
  // 创建数组副本避免修改原数组
  const sortedArray = [...originalArray]

  // 当有自定义排序顺序时
  if (sortOrder && sortOrder.length) {
    const orderMap = new Map(sortOrder.map((value, index) => [value, index]))
    return sortedArray.sort((a, b) => {
      const aIndex = orderMap.get(a[fieldKey]) ?? Infinity
      const bIndex = orderMap.get(b[fieldKey]) ?? Infinity
      return aIndex - bIndex
    })
  }

  // 自然排序逻辑（数字优先 -> 字符串）
  return sortedArray.sort((a, b) => {
    const aVal = a[fieldKey]
    const bVal = b[fieldKey]

    // 处理数字类型比较
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return aVal - bVal
    }

    // 处理混合类型和字符串类型比较
    return String(aVal).localeCompare(String(bVal), undefined, {
      numeric: true,
      sensitivity: 'variant'
    })
  })
}
```



