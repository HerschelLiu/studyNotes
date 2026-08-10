```ts
import type { PropType, Ref, WritableComputedRef } from 'vue'
import { computed, ref } from 'vue'

import { useClone } from '@/hooks/useObject'

/** 跨页选择-初始数据是否选中 */
export function isChecked<T extends object>(arr: T[], keys: string, item: T) {
  return Boolean(arr.find(thItem => keys.split('-').every(key => Reflect.get(thItem, key) === Reflect.get(item, key))))
}

/** 跨页选择-获取指定字段值的数据 */
export function getArrayBySelectedList<T extends object>(arr: T[], keys: string, value: (Key | boolean)[], getKey: string): string[] {
  const array: string[] = []
  arr.forEach(item => {
    if (keys.split('-').every(key => value.includes(Reflect.get(item, key) as any))) array.push(Reflect.get(item, getKey) as any)
  })
  return array
}

/** 跨页选择-插入数据-整个列表数据 */
export function putSelectedList<T extends object>(arr: T[], putArr: T[], keys: string): T[] {
  putArr.forEach(newId => {
    const item = arr.find(haveId => {
      return keys.split('-').every(key => Reflect.get(haveId, key) === Reflect.get(newId, key))
    })
    if (!item) arr.push(newId)
  })
  return arr
}

/** 跨页选择-删除数据-整个列表数据 */
export function deleteSelectedList<T extends object>(arr: T[], delArr: T[], keys: string) {
  delArr.forEach(newId => {
    const index = arr.findIndex(haveId => {
      return keys.split('-').every(key => Reflect.get(haveId, key) === Reflect.get(newId, key))
    })
    if (index > -1) arr.splice(index, 1)
  })
  return arr
}

/** 定义跨页选择参数 */
export function defineCheckAllProps<R = object>() {
  return {
    /** 跨页选择数据 */
    selected: {
      type: Array as PropType<R[]>,
      default: () => []
    },
    /** 跨页选择主key */
    keys: {
      type: String,
      default: ''
    }
  }
}

/** 定义跨页选择emit */
export function defineCheckAllEmits() {
  return ['update:selected', 'getPageList']
}

/**
 * 跨页选择
 * @param id 数据列表的唯一主健
 * @param list 数据列表，非必填，有全选功能是必填，Ref数据
 * @param props 组件props，非必填
 * @param context 组件context，非必填
 * @param update 是否需要将数组更新至父组件，默认是
 */
export function useCheckAll<Q, R extends object & { checked?: boolean }>(
  id: string,
  list?: WritableComputedRef<List<Q, R>>,
  props?: any,
  context?: { emit: (event: any, ...args: any[]) => void },
  update = true
) {
  /** 跨页选择主Key */
  const keys = ref(id)

  /** 跨页选择数据 */
  const selected: Ref<R[]> = props
    ? computed(() => {
        return props.selected
      })
    : ref([])

  /** 初始化是否选中 */
  const isCheckedItem = (items: R[]): R[] => {
    return items.map((item: R) => Object.assign(item, { checked: isChecked(selected.value, keys.value, item) }))
  }

  /** 是否全选 */
  const isCheckAll = computed({
    get() {
      return (list && list.value.items && list.value.items.length > 0 && list.value.items.every(item => item.disabled || item.checked)) || false
    },
    set(value: boolean) {
      handleCheckAll(value)
    }
  })

  /** 全选或取消全选 */
  const handleCheckAll = (value: boolean) => {
    if (!list) return
    list.value.items.forEach(item => !item.disabled && (item.checked = value))
    const putArr = useClone(list.value.items.filter(item => !item.disabled))
    if (context && update) {
      if (value) context.emit('update:selected', putSelectedList(props.selected, putArr, keys.value))
      else context.emit('update:selected', deleteSelectedList(props.selected, putArr, keys.value))
    } else {
      if (value) selected.value = putSelectedList(selected.value, putArr, keys.value)
      else selected.value = deleteSelectedList(selected.value, putArr, keys.value)
    }
  }

  /** 选择 */
  const handleChecked = (row: R) => {
    if (context && update) {
      if (row.checked) context.emit('update:selected', putSelectedList(props.selected, [row], keys.value))
      else context.emit('update:selected', deleteSelectedList(props.selected, [row], keys.value))
    } else {
      if (row.checked) selected.value = putSelectedList(selected.value, [row], keys.value)
      else selected.value = deleteSelectedList(selected.value, [row], keys.value)
    }
  }

  /** 取消所有 */
  const cannelSelected = () => {
    isCheckAll.value && (isCheckAll.value = false)
    if (context && update) context.emit('update:selected', [])
    else selected.value = []
  }

  /** 获取列表 */
  const getPageList = () => {
    if (!context) return
    if (update) context.emit('getPageList')
  }

  return {
    /** 跨页选择主Key */
    keys,
    /** 跨页选择数据 */
    selected,
    /** 是否全选 */
    isCheckAll,
    /** 初始化是否选中 */
    isCheckedItem,
    /** 全选或取消全选 */
    handleCheckAll,
    /** 选择 */
    handleChecked,
    /** 取消所有 */
    cannelSelected,
    /** 获取列表 */
    getPageList
  }
}

```

