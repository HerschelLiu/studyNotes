```ts
import defaultHeadimg from '@/assets/headimg.png'
import { useDateFormat } from '@/hooks/useDate'
import { isDate } from '@/hooks/useValidate'

/** 科学计数法 */
export function ToThousandFilter(num?: Key): string {
  if (num === '--' || typeof num === 'undefined') return '--'
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/** 转换成人民币 */
export function ToRmbFilter(num: Key, showSign = true, showfixed = true): string {
  if (isNaN(Number(num))) return ''
  let string: Key = +num / 100
  if (showfixed) string = string.toFixed(2)
  if (showSign) string = '￥' + string
  return '' + string
}

/** 折扣 */
export function ToDiscountFilter(num: Key): string {
  return Number(num) / 10 + '折'
}

/** 时间戳转换 */
export function ToDateFilter(timeStamp: number | null | undefined | string, format = 'Y-M-D h:m:s') {
  if (typeof timeStamp === 'string' && isDate(timeStamp)) timeStamp = +new Date(timeStamp)
  if (typeof timeStamp !== 'number') return '--'
  return useDateFormat(timeStamp, format)
}

/** 头像 */
export function HeadimgFilter(src: string | undefined) {
  return src || defaultHeadimg
}

/** 无图时 */
export function NoneFilter(src: string | undefined) {
  return src || 'https://yshop-cos.yili.com/assets/template/none.png'
}

/** 无图时 */
export function defaultImageFilter(src: string | undefined) {
  return src || 'https://yshop-cos.yili.com/assets/template/none.gif'
}

/** 日期格式按需截取 */
export function DateFormatFilter(date: string | undefined | number, format = 'Y-M-D h:m:s'): string {
  return useDateFormat(date, format)
}

/** 是否 */
export function IsTrueFilter<T>(value: T): string {
  return value ? '是' : '否'
}

/** 是否 */
export function EnabledFilter<T>(value: T): string {
  return value ? '启用' : '停用'
}

/** 数字转中文 */
export function NumberToChineseFilter(number: number) {
  if (typeof number === 'object' || typeof number === 'undefined') return ''
  const [int, decimal] = (+number || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{4})+$)/g, ','))
    .split('.')
  const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const groupUnit = ['', '万', '亿']
  const unit = ['', '十', '百', '千']
  let list: string[] = []
  int.split(',').forEach(item => {
    list.push(
      item
        .split('')
        .reverse()
        .map((i, index) => changeNum[Number(i)] + unit[index])
        .reverse()
        .join('')
    )
  })
  list = list.reverse().map((item, index) => {
    return item.replace(/零千/, '零').replace(/零百/, '零').replace(/零十/, '零').replace(/零+/, '零') + groupUnit[index]
  })
  let front = list.reverse().join('')
  if (front[front.length - 1] === '零') front = front.substring(0, front.length - 1)
  if (front === '') front = '零'
  if (front.startsWith('一十')) front = front.substring(1, front.length)
  const arr = [front]
  if (decimal) {
    arr.push('点')
    arr.push(
      decimal
        .split('')
        .map(i => changeNum[Number(i)])
        .join('')
    )
  }
  return arr.join('')
}

/** 手机号码格式化 */
export function PhoneStyleFilter(phone: Key, split = ' '): string {
  return typeof phone !== 'undefined' ? phone.toString().replace(/(?=(\B)(\d{4})+$)/g, split) : ''
}

/** 文件大小 */
export function FileSizeFilter(size: number): string {
  if (typeof size !== 'number') return '未知大小'
  const GB = size / 1024 / 1024 / 1024
  if (Math.floor(GB) > 0) return `${GB.toFixed(1)} GB`
  const MB = size / 1024 / 1024
  if (Math.floor(MB) > 0) return `${MB.toFixed(1)} MB`
  const KB = size / 1024
  if (Math.floor(KB) > 0) return `${KB.toFixed(1)} KB`
  return `${size.toFixed(1)} B`
}

```

