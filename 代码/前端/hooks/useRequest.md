## Axios

```ts
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { ref } from 'vue'

import { useLog } from '@/hooks/useLog'
import { useConfirm, useError } from '@/hooks/useTip'

const useRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API?.toString(),
  timeout: 30 * 1000,
  headers: {
    'content-type': 'application/json'
  }
})

export enum ApiModule {
  '系统1' = 'system1',
  '系统2' = 'system2',
  '系统3' = 'system3'
}

const showToast = ref(true)

useRequest.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    if (!config.headers) {
      config.headers = {
        'content-type': 'application/json'
      }
    }
    // 导出文件
    if (config.download) {
      config.responseType = 'blob'
      config.headers['content-type'] = 'application/x-download'
    }
    const userStore = useUserStore() // 用户信息，没写笔记
    if (userStore.accessToken) config.headers['access-token'] = userStore.accessToken
    // 根据api所属系统切换baseUrl
    switch (config.module) {
      case ApiModule['系统1']:
      default:
        config.baseURL = import.meta.env.VITE_APP_BASE_API?.toString()
        break
      case ApiModule['系统2']:
        config.baseURL = import.meta.env.VITE_APP_XXX_API?.toString()
        break
      case ApiModule['系统3']:
        config.baseURL = import.meta.env.VITE_APP_XXX_API?.toString()
        break
    }
    config.data = config.data || {}
    if (config.url?.endsWith('.json')) {
      config.baseURL = '/json'
      config.method = 'get'
    }
    if (config.method === 'get') config.params = config.data
    if (settings.showLog) {
      useLog('接口地址', config.url)
      useLog('请求方式', config.method)
      useLog('请求参数', JSON.stringify(config.data))
    }
    if (typeof config.showToast === 'undefined') config.showToast = true
    showToast.value = Boolean(config.showToast)
    return config
  },
  error => {
    Promise.reject(error)
  }
)

useRequest.interceptors.response.use(
  async response => {
    // 导出文件
    if (response.config.responseType === 'blob' && response.status === 200) {
      if (response.data.type === 'application/json') {
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
          const result = fileReader.result as string
          const jsonData = JSON.parse(result)
          const message = jsonData.error.msg || '文件导出失败！请重试'
          useError(message)
        }
        fileReader.readAsText(response.data)
      } else {
        let filename = ''
        try {
          const disposition = response.headers['content-disposition']
          filename = disposition.substring(disposition.indexOf('filename=') + 'filename='.length, disposition.length)
          if (filename.startsWith('"')) filename = filename.substring(1, filename.length)
          if (filename.endsWith('"')) filename = filename.substring(0, filename.length - 1)
          if (filename === '') throw Error
        } catch (error) {
          filename = '未命名文件'
        }
        if (!response.data.data) {
          return { data: response.data, filename: decodeURIComponent(filename) }
        }
        useError('文件导出失败！请重试')
      }
      return Promise.reject()
    }
    const userStore = useUserStore()
    if (response.data.error && response.data.error.code === 401) {
      // 重置accessToken有效期
      userStore.updateTimeStamp(0)
      await loginOut()
      return
    }
    const res = response.data
    if (res.status || res.code === 200 || res.success === true) {
      // accessToken续期
      userStore.updateTimeStamp()
      return res
    }
    let message = '网络错误，请重试'
    try {
      if (res.error.code === 85058) return Promise.reject(res)
      res.error.msg && (message = res.error.msg)
    } catch (error) {
      // nothing
    }
    if (showToast.value) useError(message)
    return Promise.reject(res)
  },
  error => {
    if (showToast.value) {
      useError('网络错误，请重试')
    }
    return Promise.reject(error)
  }
)

/** 是否已经显示了重登录提示，防止并发请求时的重叠 */
const isConfirm = ref(false)

async function loginOut() {
  if (!isConfirm.value) {
    useUserStore().setToken()
    isConfirm.value = true
    try {
      await useConfirm('登录已过期，请重新登录！', '确定登出', {
        confirmButtonText: '重新登录',
        showCancelButton: false,
        type: 'warning'
      })
    } catch (error) {
      // nothing
    }
    await useUserStore().toLoginOut()
    window.location.reload()
  }
}

export { useRequest }

```

```ts
/** 更新accessToken的有效时间 */
  function updateTimeStamp(timeStamp = +useDate()) {
    if (timeStamp === 0) {
      state.accessToken = ''
    }
    state.timeStamp = timeStamp
    setToken(state)
  }
```

