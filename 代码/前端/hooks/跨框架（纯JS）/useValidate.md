```ts
/** 空字符串值（字符串类型下视为“无值”） */
const EMPTY_STRINGS = new Set(['', 'undefined', 'null'])

/** 图片 MIME */
const IMAGE_TYPES = new Set(['image/jpeg', 'image/bmp', 'image/png', 'image/jpg', 'image/gif'])

/** Excel MIME */
const EXCEL_TYPES = new Set(['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])

/** Excel 扩展名 */
const EXCEL_EXTENSIONS = new Set(['xls', 'xlsx', 'csv'])

/** 文件校验所需的最小结构（File / UploadFile / 普通对象均可传入） */
interface FileLike {
  /** MIME 类型 */
  type?: string
  /** 文件名 */
  name?: string
}

/** 月份天数（非闰年），闰年 2 月单独修正 */
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/** 是否闰年 */
const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

/** 文件 MIME（小写；非字符串按空串处理） */
const getMime = (file?: FileLike | null) => (typeof file?.type === 'string' ? file.type.toLowerCase() : '')

/** 是否链接 */
export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/** 是否日期（同时校验真实日期与时间，支持 YYYY-MM-DD[ HH:mm:ss]） */
export function isDate(value: unknown): value is string {
  if (typeof value !== 'string') return false

  const matched = /^(\d{4})-(\d{1,2})-(\d{1,2})(?: (\d{1,2}):(\d{1,2}):(\d{1,2}))?$/.exec(value)
  if (!matched) return false

  const [, year, month, day, hour, minute, second] = matched
  const y = Number(year)
  const m = Number(month)
  const d = Number(day)
  if (m < 1 || m > 12 || d < 1) return false

  const maxDay = m === 2 && isLeapYear(y) ? 29 : DAYS_IN_MONTH[m - 1]
  if (d > maxDay) return false

  // 无时间部分时仅校验日期
  if (hour === undefined) return true
  return Number(hour) < 24 && Number(minute) < 60 && Number(second) < 60
}

/** 是否有效值 */
export function isHaveValue(value: unknown): boolean {
  switch (typeof value) {
    case 'undefined':
      return false
    case 'boolean':
      return true
    case 'number':
      return !Number.isNaN(value)
    case 'string':
      return !EMPTY_STRINGS.has(value.trim())
    case 'symbol':
      return true // Symbol 默认视为有效值
    case 'bigint':
      return true
  }

  if (value === null) return false
  if (Array.isArray(value)) return value.length > 0

  // 处理容器型对象
  const typeString = Object.prototype.toString.call(value)
  switch (typeString) {
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

  // 4.处理DOM元素（仅浏览器环境，SSR 下 Node 不存在）
  if (typeof Node !== 'undefined' && value instanceof Node) {
    // 非元素节点默认有效
    if (value.nodeType !== Node.ELEMENT_NODE) return true
    const element = value as Element
    if (element.hasAttribute('hidden')) return false
    // 有子节点或存在非空文本内容才算有效
    return element.childNodes.length > 0 || (element.textContent?.trim() ?? '') !== ''
  }

  // 5.其他对象类型
  return true
}

/** 电话号码（10-12 位数字，兼容数字类型入参） */
export function isPhone(value: unknown): boolean {
  if (typeof value !== 'string' && typeof value !== 'number') return false
  return /^\d{10,12}$/.test(String(value))
}

/** 验证是否是图片类型文档 */
export function isImage(file?: FileLike | null): boolean {
  return IMAGE_TYPES.has(getMime(file))
}

/** 验证是否是视频类型文档 */
export function isVideo(file?: FileLike | null): boolean {
  return getMime(file) === 'video/mp4'
}

/** 验证是否是Android安装包文档 */
export function isApk(file?: FileLike | null): boolean {
  return getMime(file) === 'application/vnd.android.package-archive'
}

/** 验证是否是纯文本 */
export function isFile(file?: FileLike | null): boolean {
  return getMime(file) === 'text/plain'
}

/** 验证是否是excel（MIME 或扩展名，大小写不敏感） */
export function isExcel(file?: FileLike | null): boolean {
  if (EXCEL_TYPES.has(getMime(file))) return true

  const name = typeof file?.name === 'string' ? file.name : ''
  const dotIndex = name.lastIndexOf('.')
  return dotIndex !== -1 && EXCEL_EXTENSIONS.has(name.slice(dotIndex + 1).toLowerCase())
}

/** 是否数组 */
export function isArray(arg: unknown): arg is unknown[] {
  return Array.isArray(arg)
}

/** 是否有效版本号（x.y.z，每段 1-3 位且不允许前导零） */
export function isVersion(value: unknown): value is string {
  if (typeof value !== 'string') return false
  if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) return false
  // '01' 这类前导零不是有效版本号
  return value.split('.').every(num => String(Number(num)) === num)
}

```

