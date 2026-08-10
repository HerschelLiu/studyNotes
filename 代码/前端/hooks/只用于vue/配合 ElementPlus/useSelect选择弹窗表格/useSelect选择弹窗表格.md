```ts
import type { Ref } from 'vue'
import { computed, nextTick } from 'vue'

import { deleteSelectedList, putSelectedList } from '@/hooks/useCheckAll'
import { useError } from '@/hooks/useTip'

/** 选择弹窗，用于抽屉中的选择组件 */
export function useSelect<Q, R extends Object>(
  props: any,
  context: { emit: (event: any, ...args: any[]) => void },
  checkAll: { selected: Ref<R[]> },
  list: { query: Q; items: R[] },
  keys: string,
  callback?: Function
) {
  /** 选择 */
  const handleChecked = (row: R, type: number) => {
    const arr: R[] = checkAll.selected.value.slice(0)
    if (type === 2) {
      const index = checkAll.selected.value.findIndex(item => keys.split('-').every(key => Reflect.get(item, key) === Reflect.get(row, key)))
      if (index !== -1) arr.splice(index, 1)
    } else {
      // 如果数据已经满了，就覆盖掉数组最后一条，并将新的播入到前面
      if (arr.length >= props.maxLength && props.maxLength !== 0) arr.splice(arr.length - 1, 1)
      arr.push(row)
    }
    checkAll.selected.value = arr
    nextTick(() => {
      if (checkAll.selected.value.length >= props.maxLength && props.maxLength !== 0) handleSave()
    })
  }

  /** 保存 */
  const handleSave = () => {
    if (checkAll.selected.value.length < (props.minLength ?? 1)) {
      useError(`至少需要选择${props.minLength}条数据`)
      return
    }
    if (checkAll.selected.value.length > props.maxLength) {
      useError('选择数量已超过限制')
      return
    }
    context.emit('update:modelValue', false)
    context.emit(
      'change',
      checkAll.selected.value.map(item => {
        const _item = list.items.find(__item => keys.split('-').every(key => Reflect.get(__item, key) === Reflect.get(item, key)))
        if (!_item) return item
        return _item
      })
    )
    callback && callback()
  }

  /** 清除所有 */
  const handleRemove = () => {
    checkAll.selected.value = []
  }

  /** 全选本页 */
  const handleSelectedPage = () => {
    checkAll.selected.value = putSelectedList(checkAll.selected.value, list.items, keys)
  }

  /** 清除本页 */
  const handleRemovePage = () => {
    checkAll.selected.value = deleteSelectedList(checkAll.selected.value, list.items, keys)
  }

  /** 是否已选择 */
  const includesRow = (row: R) => {
    return checkAll.selected.value.findIndex(item => keys.split('-').every(key => Reflect.get(item, key) === Reflect.get(row, key))) > -1
  }

  /** 是否已有选择 */
  const isChecked = computed(() => {
    return list.items.some(item => includesRow(item))
  })

  return {
    /** 选择 */
    handleChecked,
    /** 保存 */
    handleSave,
    /** 清除所有 */
    handleRemove,
    /** 全选本页 */
    handleSelectedPage,
    /** 清除本页 */
    handleRemovePage,
    /** 是否已选择 */
    includesRow,
    /** 是否已有选择 */
    isChecked
  }
}

```

