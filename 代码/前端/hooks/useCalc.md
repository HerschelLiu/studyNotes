```tsx
/** 获取精度（对科学计数法、非有限数、异常精度做兜底，避免 toFixed 越界） */
function getPrecision(nums: number[], type: 'add' | 'multi' = 'add'): number {
  const safePrecision = (num: number): number => {
    if (!Number.isFinite(num)) return 0
    // 大数会被 toString 转成科学计数法（如 "1.23e+21"），split('.') 拿到的不是真实小数位
    if (Math.abs(num) >= 1e21) return 0
    const str = num.toString()
    if (!str.includes('.')) return 0
    const decimal = str.split('.')[1]
    // 过滤 "234e+21" 这种科学计数法尾段，只取纯数字部分
    const match = decimal.match(/^\d+/)
    return match ? Math.min(match[0].length, 100) : 0
  }
  if (type === 'add') {
    return Math.max(0, ...nums.map(safePrecision))
  } else {
    return nums
      .map(safePrecision)
      .filter(val => val !== 0)
      .reduce((val, current) => val + current, 0)
  }
}

/** 类型判断 */
function typeJudge(a: number[] | number, b?: number): number[] | [number, number] {
  if (typeof a === 'number' && typeof b !== 'undefined') return [a, b]
  return a as number[]
}

/** N数相加 */
export function useAdd(a: number, b: number): number
export function useAdd(a: number[]): number
export function useAdd(a: number[] | number, b?: number): number | void {
  a = typeJudge(a, b) as number[]
  const _nums = a.map(num => Number(num)).filter(num => !isNaN(num))
  const precision = getPrecision(_nums)
  const result = _nums.reduce((val, current) => {
    return val + Math.pow(10, precision) * current
  }, 0)
  return Number((result / Math.pow(10, precision)).toFixed(Math.min(precision, 100)))
}

/** 两数相减 */
export function useSub(a: number, b: number): number
export function useSub(a: [number, number]): number
export function useSub(a: [number, number] | number, b?: number) {
  a = typeJudge(a, b) as [number, number]
  const precision = getPrecision(a)
  const _nums = a.map(val => Math.pow(10, precision) * val)
  return Number(((_nums[0] - _nums[1]) / Math.pow(10, precision)).toFixed(Math.min(precision, 100)))
}

/** N数相乘 */
export function useMulti(a: number, b: number): number
export function useMulti(a: number[]): number
export function useMulti(a: number[] | number, b?: number) {
  a = typeJudge(a, b) as number[]
  const _nums = a.map(num => Number(num)).filter(num => !isNaN(num))
  const precision = getPrecision(_nums, 'multi')
  const result = _nums.reduce((val, current) => {
    return val * Math.pow(10, precision) * current
  }, 1)
  return Number((result / Math.pow(10, precision * _nums.length)).toFixed(Math.min(precision, 100)))
}

/** 两数相除 */
export function useDivide(a: number, b: number): number
export function useDivide(a: [number, number]): number
export function useDivide(a: [number, number] | number, b?: number) {
  a = typeJudge(a, b) as [number, number]
  const precision = getPrecision(a)
  const _nums = a.map(val => useMulti(Math.pow(10, precision), val))
  return Number(_nums[0] / _nums[1])
}

```

> - **金额计算场景**：金额值范围通常是 `0.01` ~ `1e15`，走的是正常分支，新老逻辑结果完全一致，**零精度损失**。
> - **大数场景**（≥1e21）：新逻辑反而更准 —— 老逻辑被科学计数法尾段 `"234e+21"` 误导算出错误的 precision，新逻辑直接返回 0（这些大数本来就没小数）。
> - **极小值场景**（<1e-6）：两者都不准（金额不会出现这种值，可以忽略）。
> - **异常值**：新逻辑保证不抛错，是降级而非破坏。
