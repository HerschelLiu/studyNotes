### VUE

```ts
import { computed, reactive } from 'vue'

/**
 * 弹窗管理
 * @param list 弹窗初始状态
 */
export function useModal<T extends Record<string, boolean>>(list: T) {
  const modalList = reactive(list) as { [K in keyof T]: boolean }

  const showModal = computed(() => Object.values(modalList).some(Boolean))

  const handleShowModal = (target: keyof T) => {
    modalList[target] = true
  }

  const handleCloseModal = (target?: keyof T) => {
    if (target === undefined) {
      for (const key in modalList) {
        modalList[key as keyof T] = false
      }
      return
    }
    modalList[target] = false
  }

  return {
    showModal,
    modalList,
    handleShowModal,
    handleCloseModal
  }
}

```

使用

```ts

/** 定义弹窗 */
const { handleShowModal, handleCloseModal, modalList } = useModal({
  showCms: false
})
```

