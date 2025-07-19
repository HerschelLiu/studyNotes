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

/** 数字转中文 */
export function useNum2Chinese(num) {
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿'];
  let result = '';
  let strNum = String(num);
  
  // 处理10~19的特殊情况（如“十”而非“一十”）
  if (strNum.length === 2 && strNum[0] === '1') {
    result = '十' + (strNum[1] === '0' ? '' : digits[strNum[1]]);
    return result;
  }

  for (let i = 0; i < strNum.length; i++) {
    const digit = strNum[i];
    const unit = units[strNum.length - 1 - i];
    if (digit !== '0') {
      result += digits[digit] + unit;
    } else {
      // 避免重复零（如“一千零一”）
      if (result[result.length - 1] !== '零') {
        result += '零';
      }
    }
  }
  return result.replace(/零+/g, '零').replace(/零$/, '');
}
```

