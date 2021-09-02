```typescript
/**
 * 是否日期
 */
// 小程序
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

// vue+ts
/**
 * 是否链接
 */
export function isExternal(path: any): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 是否日期
 */
export function isDate(str: any): boolean {
  return /^\d{4}(-\d{1,2}){2}( \d{1,2}(:\d{1,2}){2})?$/.test(str)
}

/**
 * 验证首尾是否有空格
 */
export function isHaveSpace(str: string): boolean {
  return /(^ | $)/.test(str)
}

/**
 * 是否有效值
 */
export function isHaveValue(value: any): boolean {
  if (typeof value === 'undefined' || value === null || (typeof value === 'string' && value.trim() === '')) {
    return false
  }
  return true
}

/**
 * 验证手机号码
 */
export function isTel(str: string): boolean {
  return /^1[3-9]\d{9}$/.test(str)
}

/**
 * 电话号码
 */
export function isPhone(str: string) :boolean {
  return /^\d{10,12}$/.test(str)
}

/**
 * 验证大于0的正整数
 */
export function isIntNumber(str: string): boolean {
  return /^[1-9]\d*$/.test(str)
}

/**
 * 验证两位小数数字
 */
export function isDecimal(str: string): boolean {
  return /^\d+(\.\d{1,2})?$/.test(str)
}
/**
 * 验证一位小数数字
 */
export function isOneDecimal(str: string): boolean {
  return /^\d+(\.\d{1})?$/.test(str)
}

/**
 * 验证0-100之间的正整数
 */
export function isZeroToHundred(str: string): boolean {
  return /^[1-9][0-9]?$/.test(str)
}

/**
 * 验证邮箱
 */
export function isEmail(email: string): boolean {
  const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * 验证是否是图片类型文档
 */
export function isImage(file: any): boolean {
  return file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif'
}

/**
 * 验证是否是视频类型文档
 */
export function isVideo(file: any): boolean {
  return file.type === 'video/mp4'
}

/**
 * 验证是否是Android安装包文档
 */
export function isApk(file: any): boolean {
  return file.type === 'application/vnd.android.package-archive'
}

/**
 * 密码验证
 */
export function isPassword(str: string): boolean {
  return /^[0-9A-z]{6,12}$/.test(str)
}

/**
 * 验证用户名
 */
export function isUserName(str: string): boolean {
  return /^[a-zA-Z0-9_-]{4,20}$/.test(str)
}

/**
 * 验证无特殊字符
 */
export function isNoSpecialChart(str: string): boolean {
  return /^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(str)
}
/**
 * 验证固定电话
 */
export function isNophoto(str: string): boolean {
  return /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{6,10}$/.test(str)
}
/**
 * 验证金额
 */
export function isMoney(str: string): boolean {
  return /^\d+(\.\d{1,2})*$/.test(str)
}

/**
 * 验证是数字或英文
 */
export function isNumberEnglish(str: string): boolean {
  return /^[A-Za-z0-9]+$/.test(str)
}

/**
 * 验证身份证号
 */
export function isIdentityID(str: string) {
  return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(str)
}

/** 是否数组 */
export function isArray(arg: any): arg is any[] {
  return Array.isArray(arg)
}

```

