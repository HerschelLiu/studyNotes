```ts
// useDatePicker.ts
import { computed, Ref } from 'vue'

import { useDate, useDateFormat, useTimeStamp } from '@/hooks/useDate'
import { isArray } from '@/hooks/useValidate'

/** 按需组装日期选择器 */
interface pickerConfig {
  text: string
  time: number
  value?: () => void
}
function getPickerOptions(config: pickerConfig[]): any[] {
  return config.map(item => {
    return {
      text: item.text,
      value: (() => {
        const start = new Date()
        const end = new Date()
        if (item.time > 0) return [start, end.setTime(end.getTime() + item.time)]
        else return [start.setTime(start.getTime() + item.time), end]
      })()
    }
  })
}

/**
 * 快捷选项
 * @param isFuture false表示将要选择过往的时间，true表示将要选择未来的时间
 */
export const defineDatePickerShortcuts = (isFuture: boolean = false) => {
  const now = +useDate()
  const [Y, M, D] = useDateFormat(now, 'Y-M-D').split('-')
  const [h, m, s] = useDateFormat(now, 'h:m:s').split(':')
  let array: pickerConfig[] = []
  if (!isFuture) {
    array = [
      ...[
        {
          text: '最近一周',
          time: -1000 * 60 * 60 * 24 * 6
        },
        {
          text: '最近一月',
          time:
            Number(M) > 1
              ? useTimeStamp(`${Y}-${Number(M) - 1}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) - 1}-${12 - 1 + Number(M)}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '最近三月',
          time:
            Number(M) > 3
              ? useTimeStamp(`${Y}-${Number(M) - 3}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) - 1}-${12 - 3 + Number(M)}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '最近半年',
          time:
            Number(M) > 6
              ? useTimeStamp(`${Y}-${Number(M) - 6}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) - 1}-${12 - 6 + Number(M)}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '最近一年',
          time: useTimeStamp(`${Number(Y) - 1}-${M}-${D} ${h}:${m}:${s}`) - now
        }
      ]
    ]
  } else {
    array = [
      ...[
        {
          text: '未来一周',
          time: 3600 * 1000 * 24 * 7
        },
        {
          text: '未来一月',
          time:
            Number(M) <= 11
              ? useTimeStamp(`${Y}-${Number(M) + 1}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) + 1}-${1 - (12 - Number(M))}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '未来三月',
          time:
            Number(M) <= 9
              ? useTimeStamp(`${Y}-${Number(M) + 3}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) + 1}-${3 - (12 - Number(M))}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '未来半年',
          time:
            Number(M) <= 6
              ? useTimeStamp(`${Y}-${Number(M) + 6}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) + 1}-${6 - (12 - Number(M))}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '未来一年',
          time: useTimeStamp(`${Number(Y) + 1}-${M}-${D} ${h}:${m}:${s}`) - now
        }
      ]
    ]
  }
  return getPickerOptions(array)
}

function getPickerOption(config: pickerConfig[]): any {
  return config.map(item => {
    return {
      text: item.text,
      value: (() => {
        const start = useDate()
        const end = useDate()
        if (item.time > 0) return end.setTime(end.getTime() + item.time)
        else return start.setTime(start.getTime() + item.time)
      })()
    }
  })
}

/**
 * 快捷选项
 * @param isFuture false表示将要选择过往的时间，true表示将要选择未来的时间
 */
export const defineDatePickerShortcut = (isFuture: boolean = false) => {
  const now = +useDate()
  const [Y, M, D] = useDateFormat(now, 'Y-M-D').split('-')
  const [h, m, s] = useDateFormat(now, 'h:m:s').split(':')
  let array: pickerConfig[] = []
  if (!isFuture) {
    array = [
      ...[
        {
          text: '一周前',
          time: -1000 * 60 * 60 * 24 * 7
        },
        {
          text: '一月前',
          time:
            Number(M) > 1
              ? useTimeStamp(`${Y}-${Number(M) - 1}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) - 1}-${12 - 1 + Number(M)}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '三月前',
          time:
            Number(M) > 3
              ? useTimeStamp(`${Y}-${Number(M) - 3}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) - 1}-${12 - 3 + Number(M)}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '半年前',
          time:
            Number(M) > 6
              ? useTimeStamp(`${Y}-${Number(M) - 6}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) - 1}-${12 - 6 + Number(M)}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '一年前',
          time: useTimeStamp(`${Number(Y) - 1}-${M}-${D} ${h}:${m}:${s}`) - now
        }
      ]
    ]
  } else {
    array = [
      ...[
        {
          text: '一周后',
          time: 3600 * 1000 * 24 * 7
        },
        {
          text: '一月后',
          time:
            Number(M) <= 11
              ? useTimeStamp(`${Y}-${Number(M) + 1}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) + 1}-${1 - (12 - Number(M))}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '三月后',
          time:
            Number(M) <= 9
              ? useTimeStamp(`${Y}-${Number(M) + 3}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) + 1}-${3 - (12 - Number(M))}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '半年后',
          time:
            Number(M) <= 6
              ? useTimeStamp(`${Y}-${Number(M) + 6}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) + 1}-${6 - (12 - Number(M))}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '一年后',
          time: useTimeStamp(`${Number(Y) + 1}-${M}-${D} ${h}:${m}:${s}`) - now
        }
      ]
    ]
  }
  return getPickerOption(array)
}

/** 日期区间 */
export default (startTime: Ref<string | number>, endTime: Ref<string | number>) => {
  const rangeDate = computed({
    get() {
      return [startTime.value, endTime.value]
    },
    set(value: (string | number)[]) {
      if (!isArray(value) || value.length !== 2) {
        startTime.value = ''
        endTime.value = ''
      } else {
        startTime.value = value[0]
        endTime.value = value[1]
      }
    }
  })

  return {
    rangeDate
  }
}

```

```vue
<!-- components/date-picker/index -->
import { computed, Ref } from 'vue'

import { useDate, useDateFormat, useTimeStamp } from '@/hooks/useDate'
import { isArray } from '@/hooks/useValidate'

/** 按需组装日期选择器 */
interface pickerConfig {
  text: string
  time: number
  value?: () => void
}
function getPickerOptions(config: pickerConfig[]): any[] {
  return config.map(item => {
    return {
      text: item.text,
      value: (() => {
        const start = new Date()
        const end = new Date()
        if (item.time > 0) return [start, end.setTime(end.getTime() + item.time)]
        else return [start.setTime(start.getTime() + item.time), end]
      })()
    }
  })
}

/**
 * 快捷选项
 * @param isFuture false表示将要选择过往的时间，true表示将要选择未来的时间
 */
export const defineDatePickerShortcuts = (isFuture: boolean = false) => {
  const now = +useDate()
  const [Y, M, D] = useDateFormat(now, 'Y-M-D').split('-')
  const [h, m, s] = useDateFormat(now, 'h:m:s').split(':')
  let array: pickerConfig[] = []
  if (!isFuture) {
    array = [
      ...[
        {
          text: '最近一周',
          time: -1000 * 60 * 60 * 24 * 6
        },
        {
          text: '最近一月',
          time:
            Number(M) > 1
              ? useTimeStamp(`${Y}-${Number(M) - 1}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) - 1}-${12 - 1 + Number(M)}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '最近三月',
          time:
            Number(M) > 3
              ? useTimeStamp(`${Y}-${Number(M) - 3}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) - 1}-${12 - 3 + Number(M)}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '最近半年',
          time:
            Number(M) > 6
              ? useTimeStamp(`${Y}-${Number(M) - 6}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) - 1}-${12 - 6 + Number(M)}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '最近一年',
          time: useTimeStamp(`${Number(Y) - 1}-${M}-${D} ${h}:${m}:${s}`) - now
        }
      ]
    ]
  } else {
    array = [
      ...[
        {
          text: '未来一周',
          time: 3600 * 1000 * 24 * 7
        },
        {
          text: '未来一月',
          time:
            Number(M) <= 11
              ? useTimeStamp(`${Y}-${Number(M) + 1}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) + 1}-${1 - (12 - Number(M))}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '未来三月',
          time:
            Number(M) <= 9
              ? useTimeStamp(`${Y}-${Number(M) + 3}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) + 1}-${3 - (12 - Number(M))}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '未来半年',
          time:
            Number(M) <= 6
              ? useTimeStamp(`${Y}-${Number(M) + 6}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) + 1}-${6 - (12 - Number(M))}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '未来一年',
          time: useTimeStamp(`${Number(Y) + 1}-${M}-${D} ${h}:${m}:${s}`) - now
        }
      ]
    ]
  }
  return getPickerOptions(array)
}

function getPickerOption(config: pickerConfig[]): any {
  return config.map(item => {
    return {
      text: item.text,
      value: (() => {
        const start = useDate()
        const end = useDate()
        if (item.time > 0) return end.setTime(end.getTime() + item.time)
        else return start.setTime(start.getTime() + item.time)
      })()
    }
  })
}

/**
 * 快捷选项
 * @param isFuture false表示将要选择过往的时间，true表示将要选择未来的时间
 */
export const defineDatePickerShortcut = (isFuture: boolean = false) => {
  const now = +useDate()
  const [Y, M, D] = useDateFormat(now, 'Y-M-D').split('-')
  const [h, m, s] = useDateFormat(now, 'h:m:s').split(':')
  let array: pickerConfig[] = []
  if (!isFuture) {
    array = [
      ...[
        {
          text: '一周前',
          time: -1000 * 60 * 60 * 24 * 7
        },
        {
          text: '一月前',
          time:
            Number(M) > 1
              ? useTimeStamp(`${Y}-${Number(M) - 1}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) - 1}-${12 - 1 + Number(M)}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '三月前',
          time:
            Number(M) > 3
              ? useTimeStamp(`${Y}-${Number(M) - 3}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) - 1}-${12 - 3 + Number(M)}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '半年前',
          time:
            Number(M) > 6
              ? useTimeStamp(`${Y}-${Number(M) - 6}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) - 1}-${12 - 6 + Number(M)}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '一年前',
          time: useTimeStamp(`${Number(Y) - 1}-${M}-${D} ${h}:${m}:${s}`) - now
        }
      ]
    ]
  } else {
    array = [
      ...[
        {
          text: '一周后',
          time: 3600 * 1000 * 24 * 7
        },
        {
          text: '一月后',
          time:
            Number(M) <= 11
              ? useTimeStamp(`${Y}-${Number(M) + 1}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) + 1}-${1 - (12 - Number(M))}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '三月后',
          time:
            Number(M) <= 9
              ? useTimeStamp(`${Y}-${Number(M) + 3}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) + 1}-${3 - (12 - Number(M))}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '半年后',
          time:
            Number(M) <= 6
              ? useTimeStamp(`${Y}-${Number(M) + 6}-${D} ${h}:${m}:${s}`) - now
              : useTimeStamp(`${Number(Y) + 1}-${6 - (12 - Number(M))}-${D} ${h}:${m}:${s}`) - now
        },
        {
          text: '一年后',
          time: useTimeStamp(`${Number(Y) + 1}-${M}-${D} ${h}:${m}:${s}`) - now
        }
      ]
    ]
  }
  return getPickerOption(array)
}

/** 日期区间 */
export default (startTime: Ref<string | number>, endTime: Ref<string | number>) => {
  const rangeDate = computed({
    get() {
      return [startTime.value, endTime.value]
    },
    set(value: (string | number)[]) {
      if (!isArray(value) || value.length !== 2) {
        startTime.value = ''
        endTime.value = ''
      } else {
        startTime.value = value[0]
        endTime.value = value[1]
      }
    }
  })

  return {
    rangeDate
  }
}

```

