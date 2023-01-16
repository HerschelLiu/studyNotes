```ts
import { isHaveValue } from './useValidate' // 验证方法的封装

/** 字符串转数组，需要特定的,切割 */
export function useStringToArray(string: string | null | undefined): string[] {
  if (typeof string !== 'string') return []
  return string.split(',').filter(item => isHaveValue(item))
}

/** 随机打乱数组顺序  */
export function useRadomArray<T>(array: T[]): T[] {
  return array.sort(() => 0.5 - Math.random())
}

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

