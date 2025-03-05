```ts
import { useStorage } from '@/hooks/useStorage'
import { isDate } from '@/hooks/useValidate'


/** 获取日期格式 */
export function useDateFormat(date: string | undefined | Date | number | null, format = 'Y-M-D h:m:s'): string {
  if (typeof date === 'string') date = date.substring(0, 19)
  if ((!isDate(date) && typeof date !== 'object' && typeof date !== 'number') || date === null || date === undefined) {
    return typeof date === 'string' && date.length ? date : '--'
  }
  if ((typeof date === 'string' && date.indexOf('T') > -1) || typeof date === 'number') date = new Date(date)
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

/** 获取真实的当前时间 */
export function useDate() {
  // realTime需要有单独接口获取服务器时间
  const realTime = useStorage<TimeStamp>('timeStamp', '{"local":0,"server":0}')
  const timeStamp = +new Date()
  if (!realTime.value.local || !realTime.value.server) return new Date(timeStamp)
  const diff = timeStamp - realTime.value.local
  return new Date(realTime.value.server + diff)
}

/** 获取指定月份的总天数 */
export function useMonthDays(year: number, month: number) {
  if (month === 12) year++, (month = 1)
  else month++
  const nextMonthFirstDay = new Date(`${year}/${month}/1 0:0:0`).getTime() // 下个月1号的时间戳
  const thisMonthLastDay = new Date(nextMonthFirstDay - 1000 * 60 * 60 * 24) // 下个月1号前一天的时间戳
  return thisMonthLastDay.getDate()
}

/** 获取指定日期的星期几 */
export const useChineseDay = ['日', '一', '二', '三', '四', '五', '六']
export function useDay(date: Key | undefined | Date, format = '星期D'): string {
  if (typeof date === 'string' && date.indexOf('T') > -1) date = new Date(date)
  if (typeof date === 'number') date = new Date(date)
  if (!isDate(date) && typeof date !== 'object') return ''
  let obj: any = {}
  if (typeof date === 'object' && date.toString() !== '[object Object]') {
    const [D] = [useChineseDay[date.getDay()]]
    obj = { D }
  } else {
    const [t1, t2] = (date as string).split(' ')
    const [Y, M, D] = t1.split('-')
    const [h, m, s] = t2 ? t2.split(':') : '0:0:0'
    const newDate = new Date(`${Y}/${M}/${D} ${h}:${m}:${s}`)
    const ND = useChineseDay[newDate.getDay()]
    obj = { D: ND }
  }
  const reg = /D/g
  return format.replace(reg, rs => obj[rs].toString())
}

/** 获取指定月份的二维日期数组 */
export function useTheMonth(year: number, month: number) {
  interface Day {
    Date: Date
    date: string
    chineseWeekDay: string
    weekDay: number
    day: number
    isToday: boolean
    isFuture: boolean
    isSign: boolean
  }
  const dateList: (Day | null)[][] = []
  const totalDays = useMonthDays(year, month)
  let thisWeek = 0
  const today = new Date()
  for (let i = 1; i <= totalDays; i++) {
    if (dateList.length - 1 < thisWeek) dateList.push([])
    const thisDate = new Date(`${year}/${month}/${i} 0:0:0`)
    const weekDay = thisDate.getDay()
    if (i === 1 && weekDay !== 0) {
      for (let j = 0, len = weekDay; j < len; j++) {
        dateList[thisWeek].push(null)
      }
    }
    const isToday =
      thisDate.getFullYear() === today.getFullYear() && thisDate.getMonth() === today.getMonth() && thisDate.getDate() === today.getDate()
    dateList[thisWeek].push({
      Date: thisDate,
      chineseWeekDay: useChineseDay[weekDay],
      weekDay: thisDate.getDay(),
      day: thisDate.getDate(),
      date: useDateFormat(thisDate, 'Y-M-D'),
      isToday,
      isFuture: isToday ? false : +thisDate > +today,
      isSign: thisDate.getDay() === 0
    })
    if (i === totalDays && weekDay !== 6) {
      for (let j = 0, len = 6 - weekDay; j < len; j++) {
        dateList[thisWeek].push(null)
      }
    }
    if (weekDay === 6) thisWeek++
  }
  return dateList
}

/** 获取当前周 */
export function useTheWeek() {
  interface Day {
    Date: Date
    date: string
    chineseWeekDay: string
    weekDay: number
    day: number
    isToday: boolean
    isSign: boolean
  }
  const weekList: (Day | null)[] = []
  const today = new Date()
  const toWeek = today.getDay()
  for (let i = 0; i < toWeek; i++) {
    const thisDate = new Date(+today - 1000 * 60 * 60 * 24 * (toWeek - i))
    weekList.push({
      Date: thisDate,
      chineseWeekDay: useChineseDay[i],
      weekDay: thisDate.getDay(),
      day: thisDate.getDate(),
      date: useDateFormat(thisDate, 'M/D'),
      isToday: false,
      isSign: false
    })
  }
  weekList.push({
    Date: today,
    chineseWeekDay: useChineseDay[toWeek],
    weekDay: today.getDay(),
    day: today.getDate(),
    date: useDateFormat(today, 'M/D'),
    isToday: true,
    isSign: false
  })
  for (let i = toWeek + 1; i <= 6; i++) {
    const thisDate = new Date(+today + 1000 * 60 * 60 * 24 * (i - toWeek))
    weekList.push({
      Date: thisDate,
      chineseWeekDay: useChineseDay[i],
      weekDay: thisDate.getDay(),
      day: thisDate.getDate(),
      date: useDateFormat(thisDate, 'M/D'),
      isToday: false,
      isSign: false
    })
  }
  return weekList
}

/** 获取倒计时 */
export function useDistanceTime(millisecond: number, format = 'h:m:s'): string {
  if (typeof millisecond !== 'number' || isNaN(millisecond)) return ''
  millisecond < 0 && (millisecond = 0)
  let time: Key = Math.floor(millisecond / 1000)
  const day: Key = Math.floor(time / 60 / 60 / 24)
  time = time - day * 60 * 60 * 24
  let hour: Key = Math.floor(time / 60 / 60)
  time = time - hour * 60 * 60
  let min: Key = Math.floor(time / 60)
  time = time - min * 60
  const showDay = format.indexOf('d') > -1 || format.indexOf('dd') > -1
  const showHour = format.indexOf('h') > -1 || format.indexOf('hh') > -1
  const showMin = format.indexOf('m') > -1 || format.indexOf('mm') > -1
  if (!showDay) hour = day * 24 + hour
  if (!showHour) min = hour * 60 + min
  if (!showMin) time = min * 60 + time
  const [d, h, m, s] = [day, hour, min, time]
  const obj: any = { d, h, m, s, dd: d, hh: h, mm: m, ss: s }
  const reg = /dd|hh|mm|ss|d|h|m|s/g
  return format.replace(reg, rs => (obj[rs].toString().length < 2 && rs.length !== 1 ? '0' + obj[rs] : obj[rs]))
}

/** 距离现在的时间差 */
export function useDiffTime(date: string): string {
  if (!date) return ''
  const nowTime = +useDate().getTime()
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
  if (year >= 1) str = Math.floor(year) + '年前'
  else if (month >= 1) str = Math.floor(month) + '个月前'
  else if (day >= 1) str = Math.floor(day) + '天前'
  else if (hour >= 1) str = Math.floor(hour) + '小时前'
  else if (min >= 1) str = Math.floor(min) + '分钟前'
  else str = '刚刚'
  return str
}

/** 获取指定日期时间戳 */
export function useTimeStamp(date?: string) {
  if (typeof date !== 'string') return +useDate()
  const [front, end] = date.split(' ')
  const [year, month, day] = front.split('-')
  const [hours, minutes, seconds] = end.split(':')
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds), 0).getTime()
}

```



### `useDateFormat优化`

解决单独传入时间导致 format 不正确问题

```ts
import { isDate } from "./useValidate";

/** 获取日期格式 */
export function useDateFormat(
  date: string | undefined | Date | number | null,
  format = 'Y-M-D h:m:s'
): string {
  if (typeof date === 'string') {
    date = date.trim(); // 清理前后空格
  }

  // 非字符串且非有效日期/对象/数字时返回默认值
  if (
    (typeof date !== 'string' && !isDate(date) && typeof date !== 'object' && typeof date !== 'number') ||
    date === null ||
    date === undefined
  ) {
    return typeof date === 'string' && (date as any).length ? date : '--';
  }

  // 处理 Date 对象或可转换的字符串/数字
  if (typeof date === 'number' || (typeof date === 'string' && date.includes('T'))) {
    date = new Date(date);
  }

  let obj: Record<string, string | number> = {};

  if (date instanceof Date) {
    // 处理 Date 对象
    obj = {
      Y: date.getFullYear(),
      M: date.getMonth() + 1,
      D: date.getDate(),
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds(),
    };
  } else {
    // 处理字符串
    const str = date as string;
    let dateSegment = '';
    let timeSegment = '';

    if (str.includes(' ')) {
      // 拆分日期和时间部分（如 "2023-01-01 12:00:00"）
      [dateSegment, timeSegment] = str.split(' ');
    } else if (str.includes('-')) {
      // 仅日期部分（如 "2023-01-01"）
      dateSegment = str;
    } else if (str.includes(':')) {
      // 仅时间部分（如 "12:00:00"）
      timeSegment = str;
    } else {
      // 无法识别格式，返回原字符串
      return str;
    }

    // 解析日期部分
    const [Y = 0, M = 0, D = 0] = dateSegment.split('-').map(Number);
    // 解析时间部分
    const [h = 0, m = 0, s = 0] = timeSegment.split(':').map(Number);

    obj = { Y, M, D, h, m, s };
  }

  // 格式化替换
  const reg = /Y|M|D|h|m|s/g;
  return format.replace(reg, (key) => {
    const value = obj[key] ?? 0; // 默认值处理
    return value.toString().padStart(2, '0'); // 补零
  });
}

```

