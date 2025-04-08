```ts
/** 是否链接 */
export function isExternal(path: any): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/** 是否日期 */
export function isDate(str: any): boolean {
  return /^\d{4}(-\d{1,2}){2}( \d{1,2}(:\d{1,2}){2})?$/.test(str)
}

/** 是否有效值 */
export function isHaveValue(value: any): boolean {
  return !(
    typeof value === 'undefined' ||
    value === null ||
    (typeof value === 'number' && isNaN(value)) ||
    (typeof value === 'string' && (value.trim() === '' || value.trim() === 'undefined'))
  )
}

/** 电话号码 */
export function isPhone(str: string): boolean {
  return /^\d{10,12}$/.test(str)
}

/** 验证是否是图片类型文档 */
export function isImage(file: any): boolean {
  return (
    file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif'
  )
}

/** 验证是否是视频类型文档 */
export function isVideo(file: any): boolean {
  return file.type === 'video/mp4'
}

/** 验证是否是Android安装包文档 */
export function isApk(file: any): boolean {
  return file.type === 'application/vnd.android.package-archive'
}

/** 验证是否是纯文本 */
export function isFile(file: any): boolean {
  return file.type === 'text/plain'
}

/** 验证是否是excel */
export function isExcel(file: any): boolean {
  const ext = file.name.split('.').pop()
  return (
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    ext === 'xls' ||
    ext === 'xlsx' ||
    ext === 'csv'
  )
}

/** 是否数组 */
export function isArray(arg: any): arg is any[] {
  return Array.isArray(arg)
}

/** 是否有效版本号 */
export function isVersion(str: string): boolean {
  return /^\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(str) && str.split('.').every(num => Number(num).toString().length === num.length)
}

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
export const useInputDigitFormat = (value: string, decimalPlaces: number = 2) =>
  value
    .replace(/[^\d.]/g, '')
    .replace(/(\..*)\./g, '$1')
    .replace(/^0+(\d)/, '$1')
    .replace(/^\./, '')
    .replace(new RegExp(`(\\.\\d{${decimalPlaces}})\\d+`), '$1')

/**
 * 将数值/字符串格式化为金额形式
 * @param value 输入值（数字或字符串）
 * @param decimal 保留小数位数（默认2位）
 * @param thousand 是否启用千分位（默认false）
 * @returns 格式化后的金额字符串（无效输入返回空字符串）
 */
export function useFormatMoney(value: string | number, decimal: number = 2, thousand: boolean = false): string {
  // 输入处理（兼容字符串中的逗号和非数字字符）
  let numStr = String(value)
    .replace(/,/g, '') // 移除现有逗号
    .replace(/[^\d.-]/g, '') // 移除非数字字符

  const num = parseFloat(numStr)
  if (isNaN(num)) return '' // 无效输入处理

  // 处理小数部分（四舍五入）
  const fixedNum = num.toFixed(decimal)
  const [integerPart, decimalPart] = fixedNum.split('.')

  // 千分位格式化正则处理
  const formattedInteger = thousand ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : integerPart

  // 组合最终结果
  return decimal > 0 ? `${formattedInteger}.${decimalPart}` : formattedInteger
}
```

