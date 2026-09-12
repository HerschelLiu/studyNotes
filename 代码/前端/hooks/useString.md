```ts
// 驼峰转中横线的方法
export const useLineString = (str: string) => {
  return str.replace(/[A-Z]/g, function ($1, index) {
    return `${index === 0 ? '' : '-'}${$1.toLowerCase()}`
  })
}

/** 获取一个唯一的随机字符串 */
export function useRandomString(): string {
  return Math.random().toString(32).slice(2)
}

// 获取字节长度，中文算2个字节
export function useByteLength(str: string) {
  return str.split('').reduce(function (value, item) {
    return value + 1 + Number(item.charCodeAt(0) > 255)
  }, 0)
}


/** 生成随机密码，密码规则:字母的大小写、数字、特殊字符任意三种组合，8到20位 */
const lowerCase = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const number = '0123456789'
const special = '~!@#$%^&*()_+`-=[]{}|;:,./<>?'
export const passwordStrings = [lowerCase, number, special]
export function useRandomPassword(): string {
  const len = passwordStrings.length
  const random = () => Math.floor(Math.random() * len)
  const randomStr = () => passwordStrings[random()]
  const randomChar = (str: string) => str[Math.floor(Math.random() * str.length)]
  let isOk = false
  let str: string[] = []
  while (!isOk) {
    const length = Math.floor(Math.random() * 13) + 8
    str = Array.from({ length }, () => randomStr())
    const set = new Set(str)
    if (set.size >= len) {
      isOk = true
    }
  }
  return str.map(item => randomChar(item)).join('')
}

/** 转义特殊字符 */
export const useEscapeRegExp = (keyword: string) => {
  return keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
/**
 * 数字转中文读法（支持负数、小数、超大整数）
 * @example useNum2Chinese(1024)  // 一千零二十四
 * @example useNum2Chinese(-1.05) // 负一点零五
 */
export function useNum2Chinese(num: number | string | bigint): string {
  const digits = '零一二三四五六七八九'
  const units = ['', '十', '百', '千']

  /** 4 位以内一组：逐位映射 → 去前导零 → 最高组省略“一十”的“一” → 合并零、去级末尾零 */
  const section = (s: string, top: boolean): string => {
    let out = [...s].map((d, i) => (d === '0' ? '零' : digits[+d] + units[s.length - 1 - i])).join('')
    out = out.replace(/^零+/, '')
    if (top) out = out.replace(/^一十/, '十')
    return out.replace(/零+/g, '零').replace(/零$/, '')
  }

  /** 整数串转中文：4 位一组拼“万”；8 位以上按“亿”拆，高位里的“亿”读作“万万” */
  const int = (s: string): string => {
    if (s === '0') return '零'
    if (s.length > 8) {
      const low = s.slice(-8)
      const high = int(s.slice(0, -8)).replace(/亿/g, '万万') + '亿'
      return low === '00000000' ? high : high + (+low < 1e7 ? '零' : '') + int(low)
    }
    const highDigits = s.slice(0, -4)
    const low = s.slice(-4)
    const high = +highDigits ? section(highDigits, true) + '万' : ''
    return low === '0000' ? high : high + (high && +low < 1000 ? '零' : '') + section(low, !highDigits)
  }

  // number / 数字串 / bigint → 十进制字符串（整数走 BigInt，1e21 这类不会变成科学计数法）
  const text = typeof num === 'bigint' ? num.toString() : typeof num === 'string' ? num.trim() : Number.isInteger(num) ? BigInt(num).toString() : String(num)
  if (!/^-?\d+(\.\d+)?$/.test(text)) return text

  const [intStr, decStr] = text.replace('-', '').split('.')
  const sign = text.startsWith('-') && /[1-9]/.test(text) ? '负' : ''
  const intPart = int(intStr.replace(/^0+/, '') || '0')
  return sign + intPart + (decStr ? '点' + [...decStr].map(d => digits[+d]).join('') : '')
}
```

