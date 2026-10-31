## JS

```ts
/** 字符串下载源类型：file=文本内容（转 Blob 下载），link=直链地址 */
export type DownloadSourceType = 'file' | 'link'

/** object URL 延迟释放时间：给浏览器留出开始读取的时间，避免大文件被过早释放 */
const OBJECT_URL_RELEASE_DELAY = 40_000

/**
 * 触发浏览器下载：挂载到 body 再点击。
 * @param href 下载地址
 * @param name 文件名（不传则不覆盖服务端文件名）
 * @param openInNewTab 是否新标签打开
 */
const clickAnchor = (href: string, name?: string, openInNewTab = false) => {
  const tag = document.createElement('a')
  tag.href = href
  if (name) tag.download = name
  if (openInNewTab) {
    tag.target = '_blank'
    tag.rel = 'noopener'
  }
  document.body.appendChild(tag)
  tag.click()
  document.body.removeChild(tag)
}

/** 延迟释放 object URL，避免整份文件一直被 URL 强引用（大文件会持续占用内存） */
const releaseObjectURL = (url: string) => {
  window.setTimeout(() => window.URL.revokeObjectURL(url), OBJECT_URL_RELEASE_DELAY)
}

/**
 * 下载图片
 * @param src 图片src
 * @param crossOrigin 是否需要跨域
 * @returns 图片对象
 */
export const useDownloadImage = (src: string, crossOrigin = false): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    if (crossOrigin) image.crossOrigin = 'Anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(Error('图片下载失败'))
    image.src = src
  })
}

/**
 * 下载文件
 * @param src 文件内容（Blob）或字符串（type='file' 文本内容 / type='link' 直链地址）
 * @param name 下载文件名称
 * @param type 字符串源类型：file=文本内容，link=直链地址，默认 file
 */
export const useDownloadFile = (src: string | Blob, name: string, type: DownloadSourceType = 'file'): void => {
  if (typeof src === 'string') {
    if (type === 'link') {
      clickAnchor(src, name, true)
      return
    }
    const url = window.URL.createObjectURL(new Blob([src]))
    clickAnchor(url, name)
    releaseObjectURL(url)
    return
  }
  const url = window.URL.createObjectURL(src)
  clickAnchor(url, name)
  releaseObjectURL(url)
}

/** 直接打开 / 下载直链（不指定文件名，由服务端 Content-Disposition 决定） */
export function downloadFile(src: string): void {
  clickAnchor(src)
}

/** blob转base64 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = function () {
      resolve(reader.result as string)
    }
    reader.onerror = function (error) {
      reject(error)
    }
  })
}

/** 字符串转jsonBlob */
export const stringToJsonBlob = (str: string): Blob => {
  return new Blob([str], { type: 'application/json' })
}

/** 字符串转text */
export const stringToTextBlob = (str: string): Blob => {
  return new Blob([str], { type: 'text/plain;charset=utf-8' })
}

/** 图片base64转blob（沿用 data URL 里的 MIME，缺省 jpeg；也兼容裸 base64） */
export const imageBase64ToBlob = (base64: string): Blob => {
  const commaIndex = base64.indexOf(',')
  const meta = commaIndex > -1 ? base64.slice(0, commaIndex) : ''
  const data = commaIndex > -1 ? base64.slice(commaIndex + 1) : base64
  const mime = /^data:([^;]+)/.exec(meta)?.[1] ?? 'image/jpeg'
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new Blob([bytes], { type: mime })
}

```

## 微信小程序

```ts
/** 封装小程序下载图片 */
export function useDownloadImage(imgUrl: string, canvas?: WechatMiniprogram.Canvas): Promise<CanvasImageSource | string> {
  return new Promise(async (resolve, reject) => {
    if (!canvas) {
      wx.downloadFile({
        url: imgUrl,
        success(res) {
          if (res.statusCode === 200) resolve(res.tempFilePath)
          reject()
        },
        fail() {
          reject()
        }
      })
    } else {
      try {
        const { path } = await useImageInfo(imgUrl)
        const img = (canvas as any).createImage()
        img.src = path
        if (img.complete) {
          resolve(img)
        } else {
          img.onload = () => {
            resolve(img)
          }
          img.onerror = () => {
            reject(Error('创建canvas图片对象失败'))
          }
        }
      } catch (error) {
        reject(Error('创建canvas图片对象失败'))
      }
    }
  })
}

/** 封装小程序获取图片信息-例如图片高度信息，用于canvas绘制比例计算 */
export function useImageInfo(src: string): Promise<WechatMiniprogram.GetImageInfoSuccessCallbackResult> {
  return new Promise(async (resolve, reject) => {
    wx.getImageInfo({
      src,
      success(res) {
        resolve(res)
      },
      fail() {
        reject()
      }
    })
  })
}

```

## 搭配useDownloadFile

axios文件增加以下内容,header传入`download: true`，会多返回一个filename

```ts
// useRequest.ts

import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { ref } from 'vue'

import { useLog } from '@/hooks/useLog'
import { useConfirm, useError } from '@/hooks/useTip'
import settings from '@/settings'
import { useUserStore } from '@/store/user'

const useRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API?.toString(),
  timeout: 30 * 1000,
  headers: {
    'content-type': 'application/json'
  }
})

export enum ApiModule {
  'SaaS系统' = 'saas',
  'cxp系统' = 'cxp',
  '开放平台系统' = 'oauth2'
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
    const userStore = useUserStore()
    if (userStore.accessToken) config.headers['access-token'] = userStore.accessToken
    // 根据api所属系统切换baseUrl
    switch (config.module) {
      case ApiModule['SaaS系统']:
      default:
        config.baseURL = import.meta.env.VITE_APP_BASE_API?.toString()
        break
      case ApiModule['cxp系统']:
        config.baseURL = import.meta.env.VITE_APP_CXP_API?.toString()
        break
      case ApiModule['开放平台系统']:
        config.baseURL = import.meta.env.VITE_APP_OAUTH2_API?.toString()
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
      if (res.error.code === 85058 || res.error.code === 407) return Promise.reject(res)
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

> 下载文件，增加responseType: 'blob'，如果为 get，则再加上 download: true
