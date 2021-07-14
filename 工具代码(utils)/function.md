```typescript
import { isDate, isHaveValue } from './validate'
import { globalData } from '../app'

/**
 * 获取日期格式
 */
export function getDate(date: number | string | undefined | Date, format = 'Y-M-D h:m:s'): string {
  if (typeof date === 'string' && date.indexOf('T') > -1) {
    date = new Date(date)
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  if (!isDate(date) && typeof date !== 'object') {
    return ''
  }
  let obj: any = {}
  if (typeof date === 'object' && date.toString() !== '[object Object]') {
    const [Y, M, D, h, m, s] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
    obj = { Y, M, D, h, m, s }
  } else {
    const [t1, t2] = (date as string).split(' ')
    const [Y, M, D] = t1.split('-')
    const [h, m, s] = t2 ? t2.split(':') : '0:0:0'
    obj = { Y, M, D, h, m, s }
  }
  const reg = /Y|M|D|h|m|s/g
  return format.replace(reg, rs => obj[rs].toString().padStart(2, '0'))
}

/**
 * 获取指定日期的星期几
 */
export function getDay(date: number | string | undefined | Date, format = '星期D'): string {
  if (typeof date === 'string' && date.indexOf('T') > -1) {
    date = new Date(date)
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  if (!isDate(date) && typeof date !== 'object') {
    return ''
  }
  let obj: any = {}
  if (typeof date === 'object' && date.toString() !== '[object Object]') {
    const [D] = [getChineseDay(date.getDay())]
    obj = { D }
  } else {
    const [t1, t2] = (date as string).split(' ')
    const [Y, M, D] = t1.split('-')
    const [h, m, s] = t2 ? t2.split(':') : '0:0:0'
    const newDate = new Date(`${ Y }-${ M }-${ D } ${ h }:${ m }:${ s }`)
    const ND = getChineseDay(newDate.getDay())
    obj = { D: ND }
  }
  const reg = /D/g
  return format.replace(reg, rs => obj[rs].toString())
}

function getChineseDay(d: string | number) {
  switch (Number(d)) {
    case 0:
    default:
      return '日'
    case 1:
      return '一'
    case 2:
      return '二'
    case 3:
      return '三'
    case 4:
      return '四'
    case 5:
      return '五'
    case 6:
      return '六'
  }
}

/**
 * 获取指定日期时间戳
 */
export function getTimeStamp(date ? : string) {
  if (typeof date !== 'string') {
    return +new Date()
  }
  const [front, end] = date.split(' ')
  const [year, month, day] = front.split('-')
  const [hours, minutes, seconds] = end.split(':')
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds), 0).getTime()
}

/**
 * 获取枚举的不重复数组
 */
export interface EnumArray < T > {
  key: number | (T extends object ? T : never)[Extract < keyof(T extends object ? T : never), string > ];
  value: string;
}
export function getEnumArray < T >(object: T extends object ? T : never): EnumArray < T > [] {
  const arr: EnumArray < T > [] = []
  for (const key in object) {
    const isNAN = isNaN(Number(key))
    if (isNAN) {
      arr.push({
        key: isNAN ? object[key] : Number(object[key]),
        value: key
      })
    }
  }
  return arr.sort((p, n) => Number(p.key) - Number(n.key))
}

/**
 * 直接从枚举改造对象中取值
 */
export function getValueByEnum < T >(key: string | number, obj: EnumArray < T > []): string {
  for (const forkey in obj) {
    if (key === obj[forkey].key) {
      return obj[forkey].value
    }
  }
  return ''
}

/**
 * 商品描述转化为图片数组
 */
export function getImgsByDescribe(str: string): string[] {
  if (!str) {
    return []
  }
  try {
    // 获取所有img标签
    const patt1 = /(<img|< img)[^>]*src[=\"\'\s]+[^\.]*\/([^\.]+)\.[^\"\']+[\"\']?[^>]*>/g
    // 获取所有src属性
    const patt2 = /\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/g
    // 获取所有src属性中的url
    const patt3 = /(https|http|\/uploadfile)(.*)(jpg|png|jpeg|gif)/g
    const newarr0 = str.match(patt1)
    if (newarr0 === null) {
      return []
    }
    const newarr: string[] = []
    newarr0.forEach(item => {
      const arr = item.match(patt2)
      if (arr) {
        newarr.push(arr[0])
      }
    })
    const newarr2: string[] = []
    newarr.forEach(item => {
      const arr = item.match(patt3)
      if (arr) {
        newarr2.push(arr[0])
      }
    })
    const newarr3 = new Set(newarr2)
    return Array.from(newarr3)
  } catch (error) {
    return []
  }
}

/**
 * 设置富文本图片宽度
 */
export function replaceImg(content: string) {
  content = content.replace(/< ?img.*?\/>/gi, function(match) {
    // 判断没有 style 样式
    if (match.indexOf('style') === -1) {
      var index = match.indexOf('src')
      const reg = new RegExp(`(.{${ index }})`)
      return match.replace(reg, '$1 style="max-width: 100%; height: auto; display: block; margin: 0;" ')
    }
    return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/gi, 'style="max-width: 100%; height: auto; display: block; margin: 0"')
  })
  return content
}

/**
 * 深拷贝
 */
export function deepClone < T >(val: T): T {
  if (Object.prototype.toString.call(val) === '[object Object]') {
    const obj: any = {}
    for (const key in val) {
      obj[key] = deepClone(val[key])
    }
    return obj
  } else if (Array.isArray(val)) {
    return val.map(item => deepClone(item)) as unknown as T
  } else {
    return val
  }
}

/**
 * 移除对象的无效值
 */
export function getValueObject < T >(object: T): T {
  if (Object.prototype.toString.call(object) === '[object Object]') {
    const obj: any = {}
    for (const key in object) {
      const value = getValueObject(object[key])
      if (isHaveValue(value)) {
        obj[key] = value
      }
    }
    return obj
  } else if (Array.isArray(object)) {
    return object.map(item => getValueObject(item)) as unknown as T
  } else {
    return object
  }
}

/**
 * 获取wxml节点
 */
export interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
}
export function getElement(id: string): Promise < Rect > {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery()
    query.select(`#${ id }`).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      if (res && Array.isArray(res) && res.length) {
        resolve(res[0])
      } else {
        reject()
      }
    })
  })
}
export function getElementByComponent(this: any, id: string): Promise < Rect > {
  return new Promise((resolve, reject) => {
    const query = this.createSelectorQuery()
    query.select(`#${ id }`).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res: any) {
      if (res && Array.isArray(res) && res.length) {
        resolve(res[0])
      } else {
        reject()
      }
    })
  })
}

/**
 * 格式化手机号码
 */
export function getPhoneNumberStyle(mobilePhone: string, split = ' ') {
  const reg = /(?=(\B)(\d{4})+$)/g
  return mobilePhone.replace(reg, split)
}

/**
 * 获取倒计时
 */
export function getDistanceTime(millisecond: number, format = 'h:mm:ss'): string {
  if (typeof millisecond !== 'number' || isNaN(millisecond)) {
    return ''
  }
  millisecond < 0 && (millisecond = 0)
  let time: number | string = Math.floor(millisecond / 1000)
  let day: number | string = Math.floor(time / 60 / 60 / 24)
  time = time - day * 60 * 60 * 24
  let hour: number | string = Math.floor(time / 60 / 60)
  time = time - hour * 60 * 60
  let min: number | string = Math.floor(time / 60)
  time = time - min * 60
  const showDay = format.indexOf('d') > -1 || format.indexOf('dd') > -1
  const showHour = format.indexOf('h') > -1 || format.indexOf('hh') > -1
  const showMin = format.indexOf('m') > -1 || format.indexOf('mm') > -1
  if (!showDay) {
    hour = day * 24 + hour
    day = 0
  }
  if (!showHour) {
    min = hour * 60 + min
    hour = 0
  }
  if (!showMin) {
    time = min * 60 + time
    min = 0
  }
  const [d, h, m, s] = [day, hour, min, time]
  const obj: any = { d, h, m, s }
  const reg = /d|h|m|s|dd|hh|mm|ss/g
  return format.replace(reg, rs => obj[rs].toString().length < 2 && rs.length !== 1 ? '0' + obj[rs] : obj[rs])
}

/**
 * 封装小程序下载图片
 */
export function downloadImg(imgUrl: string, canvas ? : WechatMiniprogram.Canvas): Promise < CanvasImageSource | string > {
  return new Promise(async(resolve, reject) => {
    if (!canvas) {
      wx.downloadFile({
        url: imgUrl,
        success(res) {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath)
          }
          reject()
        },
        fail() {
          reject()
        }
      })
    } else {
      const img = (canvas as any).createImage()
      img.src = imgUrl
      if (img.complete) {
        resolve(img)
      } else {
        img.onload = () => {
          resolve(img)
        }
        img.onerror = () => {
          reject(Error('创建canvas图片对象失败'))
        }
      }
    }
  })
}

/**
 * 封装小程序获取图片信息-例如图片高度信息，用于canvas绘制比例计算
 */
export function getImageInfo(src: string): Promise < WechatMiniprogram.GetImageInfoSuccessCallbackResult > {
  return new Promise(async(resolve, reject) => {
    wx.getImageInfo({
      src,
      success(res) {
        resolve(res)
      },
      fail() {
        reject()
      }
    })
  })
}

/**
 * 分割符字符串转数组
 */
export function stringToArray(string: any): string[] {
  if (typeof string !== 'string') {
    return []
  }
  if (Array.isArray(string)) {
    return string
  }
  return string.split(',').filter(str => isHaveValue(str))
}

/**
 * 距离现在的时间差
 */
export function getDiffTime(date: string): string {
  if (!date) {
    return ''
  }
  const nowTime = new Date().getTime()
  const [Y, M, D] = date.split(' ')[0].split('-')
  const [h, m, s] = date.split(' ')[1].split(':')
  const pubTime = new Date(Number(Y), Number(M) - 1, Number(D), Number(h), Number(m), Number(s)).getTime()
  const diff = nowTime - pubTime
  let str = ''
  const year = diff / (1000 * 60 * 60 * 24 * 365)
  const month = diff / (1000 * 60 * 60 * 24 * 30)
  const day = diff / (1000 * 60 * 60 * 24)
  const hour = diff / (1000 * 60 * 60)
  const min = diff / (1000 * 60)
  if (year >= 1) {
    str = Math.floor(year) + '年前'
  } else if (month >= 1) {
    str = Math.floor(month) + '个月前'
  } else if (day >= 1) {
    str = Math.floor(day) + '天前'
  } else if (hour >= 1) {
    str = Math.floor(hour) + '小时前'
  } else if (min >= 1) {
    str = Math.floor(min) + '分钟前'
  } else {
    str = '刚刚'
  }
  return str
}

/**
 * 计算尺寸
 */
export function rpxToPx(rpx: number): number {
  return Math.floor(globalData.systemInfo.screenWidth * rpx / 750)
}

/**
 * 大数字处理
 */
export function getStringByBigNumber(number: number): string {
  if (number > 10000) {
    return (number / 10000).toFixed(1) + 'w'
  }
  return number.toString()
}

/**
 * 获取链接中的参数对象
 */
export function getObjByUrl(url: string): AnyObject {
  const [, search] = url.split('?')
  if (!search) {
    return {}
  }
  const obj: AnyObject = {}
  const query = search.split('&')
  query.forEach(item => {
    const [key, value] = item.split('=')
    obj[key] = decodeURIComponent(value)
  })
  return obj
}

/**
 * 获取参数
 */
export function getUrlByObj(obj: AnyObject): string {
  let url = ''
  for (const key in obj) {
    url += (url ? '&' : '') + `${ key }=${ obj[key] }`
  }
  return url
}

/**
 * 距离现在的时间差-指定类型
 */
export function getDiffDays(date: string, type: 'Y' | 'M' | 'D' | 'h' | 'm' | 's'): number {
  const nowTime = new Date().getTime()
  const [Y, M, D] = date.split(' ')[0].split('-')
  const [h, m, s] = [0, 0, 0]
  const pubTime = new Date(Number(Y), Number(M) - 1, Number(D), Number(h), Number(m), Number(s)).getTime()
  const diff = nowTime - pubTime
  switch (type) {
    case 'Y':
    default:
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
    case 'M':
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 30))
    case 'D':
      return Math.floor(diff / (1000 * 60 * 60 * 24))
    case 'h':
      return Math.floor(diff / (1000 * 60 * 60))
    case 'm':
      return Math.floor(diff / (1000 * 60))
    case 's':
      return Math.floor(diff / 1000)
  }
}

/**
 * 随机打乱数组顺序
 */
export function radomArray < T >(array: T[]): T[] {
  return array.sort(() => 0.5 - Math.random())
}

```

