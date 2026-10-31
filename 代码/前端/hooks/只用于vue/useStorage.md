## JS

`npm i js-base64`

[https://github.com/dankogai/js-base64#readme](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)

```ts
import { decode, encode } from 'js-base64'
import type { Ref } from 'vue'
import { ref, watch } from 'vue'

import settings from '@/settings' // 统一全局设置项

const { storagePrefix } = settings // 本地缓存变量名前缀

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

##  微信小程序

```ts
import { decode, encode } from '../module/base64.js'
import { globalData } from '../settings'
import type { TimeStamp } from './useDate'
import { useTimeStamp } from './useDate' // 获取服务器时间戳

/** 存储缓存-中间件 */
function useSetStorageSync(key: string, data: any) {
  data = JSON.stringify(data)
  if (globalData.env !== 'dev') data = encode(data)
  zd.setStorageSync(`${globalData[globalData.env].storagePrefix}${key}`, data)
}

/** 取值缓存-中间件 */
function useGetStorageSync(key: string): any {
  let data = zd.getStorageSync(`${globalData[globalData.env].storagePrefix}${key}`) || ''
  if (globalData.env !== 'dev') data = decode(data)
  return JSON.parse(data || 'null')
}

/** 本地缓存-中间处理 */
const storage = {}
export const useStorage = new Proxy(storage, {
  get(target: any, key: string) {
    if (!Reflect.has(storage, key)) Reflect.set(target, key, useGetStorageSync(key))
    return Reflect.get(target, key)
  },
  set(target: any, key: string, value: any) {
    Reflect.set(target, key, value)
    useSetStorageSync(key, value)
    return true
  }
})

```

