import type { MaybeRefOrGetter } from 'vue'

import { toValue } from 'vue'

/**
 * 按 key 去重合并数组（编辑/生成场景）
 * - 原数组中仍存在于新增数组的项保留（kept，已编辑的内容不丢失）
 * - 新增数组中新出现的项追加（added）
 * - 原数组中不存在于新增数组的项移除
 *
 * @param original  原数组（数组 / ref / reactive / getter）
 * @param incoming  新增数组（数组 / ref / reactive / getter）
 * @param keys      去重依据，支持三种形式：
 *                  - 单字段：'id'
 *                  - 多字段组合：['salaryYear', 'salaryPeriod']
 *                  - 对比函数：(item) => `${item.salaryYear}-${item.salaryPeriod}`
 * @param delimiter 多字段组合 key 的分隔符，默认 SOH 控制字符（避免值拼接碰撞）
 * @returns 组合后的数组 [...kept, ...added]
 */
export const useMergeArrayByKey = <T extends Record<string, any>>(
  original: MaybeRefOrGetter<T[]>,
  incoming: MaybeRefOrGetter<T[]>,
  keys: keyof T | (keyof T)[] | ((item: T) => ID),
  delimiter: string = String.fromCharCode(1)
): T[] => {
  const keyOf = typeof keys === 'function' ? keys : (item: T) => (Array.isArray(keys) ? keys : [keys]).map(k => String(item[k] ?? '')).join(delimiter)

  const originalArr = toValue(original)
  const incomingArr = toValue(incoming)

  const incomingKeys = new Set(incomingArr.map(keyOf))
  const existingKeys = new Set(originalArr.map(keyOf))

  return [...originalArr.filter(item => incomingKeys.has(keyOf(item))), ...incomingArr.filter(item => !existingKeys.has(keyOf(item)))]
}
