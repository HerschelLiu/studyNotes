## JS

```ts
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
    image.src = src
    if (image.complete) resolve(image)
    else {
      image.onload = function () {
        resolve(image)
      }
      image.onerror = function () {
        reject(Error('图片下载失败'))
      }
    }
  })
}

/**
 * 下载文件
 * @param src 文件src
 * @param name 下载文件名称
 */
export const useDownloadFile = (src: string | Blob, name: string, type = 'file'): void => {
  if (typeof src === 'string') {
    if (type === 'file') {
      const blob = new Blob([src])
      src = window.URL.createObjectURL(blob)
    }
  } else {
    src = window.URL.createObjectURL(src)
  }
  const tag = document.createElement('a')
  tag.target = '_blank'
  const event = new MouseEvent('click')
  tag.download = name || '下载文件名称'
  tag.href = src
  tag.dispatchEvent(event)
}

/** 下载文件 */
export function downloadFile(src: string): void {
  const tag = document.createElement('a')
  const event = new MouseEvent('click')
  tag.href = src
  tag.dispatchEvent(event)
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
  return new Blob([str], { type: 'text/plain' })
}

/** 图片base64转blob */
export const imageBase64ToBlob = (base64: string): Blob => {
  const arr = base64.split(',')
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: 'image/jpeg' })
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

