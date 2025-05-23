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
export function isHaveValue(value: unknown): boolean {
  // 1.快速处理原始类型
  switch (typeof value) {
    case 'undefined':
      return false
    case 'boolean':
      return value
    case 'number':
      return !Number.isNaN(value)
    case 'string': {
      const trimmed = value.trim()
      return !(trimmed === '' || trimmed === 'undefined' || trimmed === 'null')
    }
    case 'symbol':
      return true // Symbol默认视为有效值
  }

  // 2.处理null
  if (value === null) return false

  // 3.处理容器型对象
  const typeString = Object.prototype.toString.call(value)
  switch (typeString) {
    case '[object Array]':
      return (value as unknown[]).length > 0
    case '[object Set]':
      return (value as Set<unknown>).size > 0
    case '[object Map]':
      return (value as Map<unknown, unknown>).size > 0
    case '[object Object]':
      return Object.keys(value as object).length > 0
    case '[object Date]':
      return !Number.isNaN((value as Date).getTime())
    case '[object ArrayBuffer]':
      return (value as ArrayBuffer).byteLength > 0
    case '[object Blob]':
      return (value as Blob).size > 0
    case '[object File]':
      return (value as File).size > 0
  }

  // 4.处理DOM元素
  if (typeof window !== 'undefined' && value instanceof Node) {
    if (value.nodeType === Node.ELEMENT_NODE) {
      const elem = value as Element
      // 检查可见性属性
      if (elem.hasAttribute('hidden')) return false
      // 检查内容是否为空
      return elem.childNodes.length > 0 || elem.textContent?.trim() !== ''
    }
    return true // 非元素节点默认有效
  }

  // 5.其他对象类型
  return true
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
```

