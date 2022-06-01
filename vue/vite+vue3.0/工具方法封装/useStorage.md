```tsx
import { decode, encode } from 'js-base64'
import { Ref, ref, watch } from 'vue'

import { useSettings } from '@/hooks/useSettings'

const { storagePrefix } = useSettings()

/**
 * 本地缓存hooks
 * @param key 存储的key
 * @param target 期望的默认值的字符串化
 */
export function useStorage<T = any>(key: string, target = 'null'): Ref<T> {
  let val = window.localStorage.getItem(`${storagePrefix}${key}`) || ''
  if (import.meta.env.VITE_USER_NODE_ENV !== 'dev') val = decode(val)
  const data = ref<any>()
  try {
    data.value = JSON.parse(val || target)
  } catch (error) {
    data.value = JSON.parse(target)
  }
  watch(
    () => data.value,
    (value: any) => {
      value = JSON.stringify(value)
      if (import.meta.env.VITE_USER_NODE_ENV !== 'dev') value = encode(value)
      window.localStorage.setItem(`${storagePrefix}${key}`, value)
    },
    { deep: true }
  )
  return data
}

```

