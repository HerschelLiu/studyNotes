```ts
import type { WatchOptions } from 'vue'

import { ref, readonly, watch, isReactive, toRaw } from 'vue'

import { isObject } from '@/hooks/useValidate'

// 类型增强：明确 options 结构
type UseStateOptions<T> = {
  watchFn?: (newVal: T, oldVal: T) => void
  watchOptions?: WatchOptions
}

export function useState<T>(initialState: T | (() => T), options?: UseStateOptions<T>) {
  const state = ref<T>(typeof initialState === 'function' ? (initialState as () => T)() : initialState)

  // 缓存 watchFn 避免闭包过期问题
  const cachedWatchFn = options?.watchFn

  const setState = (value: T | ((prev: T) => T)) => {
    const newValue = typeof value === 'function' ? (value as (prev: T) => T)(state.value) : value
    state.value = isReactive(newValue) ? toRaw(newValue) : newValue
  }

  if (cachedWatchFn) {
    watch(
      state,
      (newVal, oldVal) => {
        cachedWatchFn(newVal as T, oldVal as T)
      },
      {
        deep: isObject(state.value),
        ...options?.watchOptions
      }
    )
  }

  return [readonly(state), setState] as const
}

```

**例子**

```ts
import type { WatchOptions } from 'vue'

import { ref, readonly, watch, isReactive, toRaw } from 'vue'

import { isObject } from '@/hooks/useValidate'

type UseStateOptions<T> = {
  watchFn?: (newVal: T, oldVal: T) => void
  watchOptions?: WatchOptions
}

export function useState<T>(initialState: T | (() => T), options?: UseStateOptions<T>) {
  const state = ref<T>(typeof initialState === 'function' ? (initialState as () => T)() : initialState)
  let isInWatchCallback = false // 新增标志位，防止在监听回调中调用 setState

  const setState = (value: T | ((prev: T) => T)) => {
    if (isInWatchCallback) {
      console.warn('Warning: 不要在watch callback中调用setState!')
      return
    }

    const newValue = typeof value === 'function' ? (value as (prev: T) => T)(state.value) : value
    state.value = isReactive(newValue) ? toRaw(newValue) : newValue
  }

  if (options?.watchFn) {
    watch(
      state,
      (newVal, oldVal) => {
        isInWatchCallback = true // 标记进入监听回调
        try {
          options.watchFn!(newVal as T, oldVal as T)
        } finally {
          isInWatchCallback = false // 确保标志位重置
        }
      },
      {
        deep: isObject(state.value),
        ...options.watchOptions
      }
    )
  }

  return [readonly(state), setState] as const
}

```

