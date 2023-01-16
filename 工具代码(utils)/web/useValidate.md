```tsx
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
    ext === 'xlsx'
  )
}

/** 是否数组 */
export function isArray(arg: any): arg is any[] {
  return Array.isArray(arg)
}

/** 是否有效的优惠券兑换码 */
export function isExchangeCode(str: string): boolean {
  return /^[a-zA-Z\d]{12}$/.test(str)
}

/** 是否有效版本号 */
export function isVersion(str: string): boolean {
  return /^\d{1,3}.\d{1,3}.\d{1,3}$/.test(str)
}

```

