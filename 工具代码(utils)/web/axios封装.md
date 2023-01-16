```ts
import axios, { AxiosRequestConfig } from 'axios'
import { ref } from 'vue'

import { useLog } from '@/hooks/useLog'
import { useSettings } from '@/hooks/useSettings'
import { useConfirm, useError } from '@/hooks/useTip'
import { useUserStore } from '@/store/user'

const useRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API?.toString(),
  timeout: 30 * 1000,
  headers: {
    'content-type': 'application/json'
  }
})

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
    const userStore = useUserStore()
    if (userStore.accessToken) config.headers['access-token'] = userStore.accessToken
    // cxp登录，重置baseURL
    if (config.url?.endsWith('/mimod/cxp/auth/cxpMallLogin')) {
      if (import.meta.env.DEV) config.baseURL = ''
      else config.baseURL = config.baseURL?.replace('/appmarket/adm', '')
    }
    // 组件模块，重置baseURL
    if (config.base === 'component') config.baseURL = import.meta.env.VITE_APP_COMPONENT_API?.toString()
    config.data = config.data || {}
    if (config.url?.endsWith('.json')) {
      config.baseURL = '/json'
      config.method = 'get'
    }
    if (config.method === 'get') config.params = config.data
    if (useSettings().showLog) {
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
      if (!response.data.data) {
        return { data: response.data }
      }
      useError('文件导出失败！请重试')
      return Promise.reject()
    }
    const res = response.data
    const userStore = useUserStore()
    if (res.status || res.code === 200) {
      // accessToken续期
      userStore.updateTimeStamp()
      return res
    }
    let message = '网络错误，请重试'
    try {
      if (res.error.code === 401) {
        // 重置accessToken有效期
        userStore.updateTimeStamp(0)
        await loginOut()
        return
      } else if (res.error.code === 405 || res.error.code === 85058) return Promise.reject(res)
      res.error.msg && (message = res.error.msg)
    } catch (error) {
      // nothing
    }
    if (showToast.value) useError(message)
    return Promise.reject(res)
  },
  error => {
    useError('网络错误，请重试')
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

