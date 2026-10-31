```tsx
/**
 * 金额 / 数量计算工具。
 *
 * 精度
 * - 加减：保留操作数中最大的小数位
 * - 相乘：保留各因数小数位之和（乘积的小数位不会超过该值）
 * - 相除：保留完整精度，由调用方按业务需要取整
 */

/** toFixed 支持的最大小数位（规范上限，宁可截断也不抛 RangeError） */
const MAX_PRECISION = 100

/**
 * 数字的小数位数（兼容科学计数法）
 * - 1.23 → 2；1e-7 → 7；1.23e-7 → 9；1e21 → 0；非有限数 → 0
 */
const getDecimalPlaces = (num: number): number => {
  if (!Number.isFinite(num)) return 0
  // 整数
  if (Number.isInteger(num)) return 0
  const [mantissa, exponent = '0'] = String(num).split('e')
  const fraction = mantissa.split('.')[1]?.length ?? 0
  // 负指数补充小数位，正指数消耗小数位
  const places = fraction - Number(exponent)
  return Math.min(Math.max(places, 0), MAX_PRECISION)
}

/** 按小数位四舍五入 */
const round = (value: number, precision: number) => Number(value.toFixed(Math.min(precision, MAX_PRECISION)))

/** 统一入参：两参数调用 → [a, b]；单参数调用 → 数组；并统一转成 number */
const toNumberArray = (a: number | number[], b?: number): number[] => {
  const nums = Array.isArray(a) ? a : b === undefined ? [a] : [a, b]
  return nums.map(Number)
}

/** 加减法精度：操作数中最大的小数位 */
const maxPrecision = (nums: number[]) => Math.max(0, ...nums.map(getDecimalPlaces))

/** 乘法精度：各因数小数位之和 */
const sumPrecision = (nums: number[]) =>
  Math.min(
    nums.reduce((sum, num) => sum + getDecimalPlaces(num), 0),
    MAX_PRECISION
  )

/** 过滤 NaN（无效项不参与合计 / 乘积） */
const withoutNaN = (nums: number[]) => nums.filter(num => !Number.isNaN(num))

/** N 数相加（数组或两参数） */
export function useAdd(a: number, b: number): number
export function useAdd(a: number[]): number
export function useAdd(a: number[] | number, b?: number) {
  const nums = withoutNaN(toNumberArray(a, b))
  return round(
    nums.reduce((sum, num) => sum + num, 0),
    maxPrecision(nums)
  )
}

/** 两数相减 */
export function useSub(a: number, b: number): number
export function useSub(a: [number, number]): number
export function useSub(a: [number, number] | number, b?: number) {
  const [minuend, subtrahend] = toNumberArray(a, b)
  return round(minuend - subtrahend, maxPrecision([minuend, subtrahend]))
}

/** N 数相乘（数组或两参数） */
export function useMulti(a: number, b: number): number
export function useMulti(a: number[]): number
export function useMulti(a: number[] | number, b?: number) {
  const nums = withoutNaN(toNumberArray(a, b))
  return round(
    nums.reduce((product, num) => product * num, 1),
    sumPrecision(nums)
  )
}

/** 两数相除（保留完整精度，不额外取整） */
export function useDivide(a: number, b: number): number
export function useDivide(a: [number, number]): number
export function useDivide(a: [number, number] | number, b?: number) {
  const [dividend, divisor] = toNumberArray(a, b)
  return dividend / divisor
}

```

> - **金额计算场景**：金额值范围通常是 `0.01` ~ `1e15`，走的是正常分支，新老逻辑结果完全一致，**零精度损失**。
> - **大数场景**（≥1e21）：新逻辑反而更准 —— 老逻辑被科学计数法尾段 `"234e+21"` 误导算出错误的 precision，新逻辑直接返回 0（这些大数本来就没小数）。
> - **极小值场景**（<1e-6）：两者都不准（金额不会出现这种值，可以忽略）。
> - **异常值**：新逻辑保证不抛错，是降级而非破坏。
