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

```

