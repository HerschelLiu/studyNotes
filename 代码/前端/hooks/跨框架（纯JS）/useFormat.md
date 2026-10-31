```ts
/** 格式化金额 */
export const useInputMoneyFormat = (value: string) =>
  value
    .replace(/[^\d.]/g, '')
    .replace(/(\..*)\./g, '$1')
    .replace(/^0+(\d)/, '$1')
    .replace(/^\./, '')
    .replace(/(\.\d{2})\d+/, '$1')

/** 格式化纯整数字 */
export const useInputNumberFormat = (value: string) => value.replace(/[^\d]/g, '')

/** 格式化小数 */
export const useInputDigitFormat = (value: string, decimalPlaces = 2) =>
  value
    .replace(/[^\d.]/g, '')
    .replace(/(\..*)\./g, '$1')
    .replace(/^0+(\d)/, '$1')
    .replace(/^\./, '')
    .replace(new RegExp(`(\\.\\d{${decimalPlaces}})\\d+`), '$1')

/**
 * 将数值/字符串格式化为金额形式（截断非四舍五入）
 * @param value 输入值（数字或字符串）
 * @param decimal 保留小数位数（默认2位）
 * @param options 配置项（默认：{thousand: false, padZero: true}）
 * @returns 格式化后的金额字符串 （无效输入返回空字符串）
 */
export function useFormatMoney(
  value: string | number,
  decimal: number = 2,
  options: { thousand?: boolean; padZero?: boolean } = { thousand: false, padZero: true }
): string {
  // 参数规范化
  const { thousand, padZero } = options

  // 输入过滤处理
  const numStr = String(value)
    .replace(/,/g, '')
    .replace(/(?!^-)[^\d.-]/g, '') // 保留负号
  const num = parseFloat(numStr)
  if (isNaN(num)) return ''

  // 小数截断处理核心逻辑
  const factor = Math.pow(10, decimal)
  const truncated = decimal > 0 ? (Math.floor(num * factor) / factor).toString() : Math.floor(num).toString()

  // 分割整数小数部分
  let [integerPart, decimalPart = ''] = truncated.split('.')

  // 小数补零处理
  if (decimal > 0) {
    decimalPart = decimalPart.padEnd(decimal, '0').substring(0, decimal)
    if (!padZero) {
      decimalPart = decimalPart.replace(/0+$/, '')
      if (decimalPart === '') decimalPart = '0'.repeat(padZero ? decimal : 0)
    }
  }

  // 千分位格式化
  if (thousand) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // 组合最终结果
  const decimalStr = decimal > 0 ? `.${padZero ? decimalPart.padEnd(decimal, '0') : decimalPart}` : ''

  return `${integerPart}${decimalStr}`
}

```

