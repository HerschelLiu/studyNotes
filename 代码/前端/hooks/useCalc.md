```tsx
/** 获取精度 */
function getPrecision(nums: number[], type: 'add' | 'multi' = 'add'): number {
  if (type === 'add') {
    return Math.max(...nums.map(num => (num.toString().includes('.') ? num.toString().split('.')[1].length : 0)))
  } else {
    return nums
      .map(num => (num.toString().includes('.') ? num.toString().split('.')[1].length : 0))
      .filter(val => val !== 0)
      .reduce((val, current) => {
        return val + current
      }, 0)
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
  return Number((result / Math.pow(10, precision)).toFixed(precision))
}

/** 两数相减 */
export function useSub(a: number, b: number): number
export function useSub(a: [number, number]): number
export function useSub(a: [number, number] | number, b?: number) {
  a = typeJudge(a, b) as [number, number]
  const precision = getPrecision(a)
  const _nums = a.map(val => Math.pow(10, precision) * val)
  return Number(((_nums[0] - _nums[1]) / Math.pow(10, precision)).toFixed(precision))
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
  return Number((result / Math.pow(10, precision * _nums.length)).toFixed(precision))
}

/** 两数相除 */
export function useDivide(a: number, b: number): number
export function useDivide(a: [number, number]): number
export function useDivide(a: [number, number] | number, b?: number) {
  a = typeJudge(a, b) as [number, number]
  const precision = getPrecision(a)
  const _nums = a.map(val => Math.ceil(Math.pow(10, precision) * val))
  return Number(_nums[0] / _nums[1])
}

```

