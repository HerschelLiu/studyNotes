```typescript
/**
 * 是否日期
 */
export function isDate(str: any): boolean {
  return /^\d{4}(-\d{1,2}){2}( \d{1,2}(:\d{1,2}){2})?$/.test(str)
}

/**
 * 是否有效值
 */
export function isHaveValue(value: any): boolean {
  return !(typeof value === 'undefined' || value === null || (typeof value === 'string' && (value.trim() === '' || value.trim() === 'undefined')))
}

/**
 * 验证手机号码
 */
export function isTel(str: string): boolean {
  return /^1[3-9]\d{9}$/.test(str)
}

/**
 * 验证参数是否存在
 */
export function validateArgs(this: any, args: string, required = true): Promise < string | undefined > {
  return new Promise((resolve, reject) => {
    const arg = this.options[args]
    if (arg && typeof arg === 'string') {
      return resolve(arg)
    }
    if (required) {
      this.setData({
        loading: false,
        fail: true,
        failContent: '页面缺少必要参数',
        failButtonContent: '返回',
        failRouterBack: true
      })
      return reject()
    } else {
      return resolve(undefined)
    }
  })
}

```

