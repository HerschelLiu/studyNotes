import type { MaybeRefOrGetter } from 'vue'

import { toValue } from 'vue'

/** 同步去重核心：按 key 保留第一条 */
export function uniqueByKey<T extends object, K extends keyof T, R = T>(rows: readonly T[], key: K, template?: (item: T) => R): R[] {
  const seen = new Set<unknown>()
  const result: R[] = []
  const toItem = template ?? ((item: T) => item as unknown as R)

  for (const row of rows) {
    const id = row[key]
    if (seen.has(id)) continue // 该字段值已出现过
    seen.add(id)
    result.push(toItem(row)) // 保留第一条
  }

  return result
}

/** 响应式封装：支持 ref / reactive / getter，解包后调用 uniqueByKey */
export function useUniqueByKey<T extends object, K extends keyof T, R = T>(
  rows: MaybeRefOrGetter<readonly T[]>,
  key: MaybeRefOrGetter<K>,
  template?: (item: T) => R
) {
  return uniqueByKey(toValue(rows), toValue(key), template)
}
