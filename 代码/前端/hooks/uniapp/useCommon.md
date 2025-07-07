## 上传图片

```ts
import type { OcrType } from '@/enums/common'
import type { Response } from '@/utils/request'

import { storeToRefs } from 'pinia'
import { useServerAddr } from "@/utils/common"
import pinia from '@/store'
import useUserStore from '@/store/useUser'
import { useValue } from '@/hooks/useObject'
import { requestSuccess } from '@/utils/request'

interface UploadResponse<T> {
  cookies: any[]
  data: T
  errMsg: string
  header: AnyObject
  statusCode: number
}

async function uploadFile<T>(options: { path: string; name?: string }, type?: OcrType): Promise<Response<T>> {
  const { serverAddr } = await useServerAddr()
  const { token } = storeToRefs(useUserStore(pinia))

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${serverAddr}/brand/brand/fileUpload`,
      filePath: options.path,
      name: options.name ?? 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        Authorization: token.value
      },
      formData: useValue({
        fileType: type
      }),
      success: res => {
        res.data = JSON.parse(res.data)
        requestSuccess(res, resolve, reject)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

/** 上传 */
export const useUpload = async <T>(options: { paths: string[];name?: string }, type?: OcrType) => {
  try {
    let errNum = 0
    const res = await Promise.all(options.paths.map(item => uploadFile<T>({ path: item, name: options.name }, type)))

    const datas = res.filter(item => item.code === 200 || item.success)
    const errDatas = res.filter(item => !(item.code === 200 || item.success))
    errNum = errDatas.length

    return Promise.resolve({
      res: datas,
      errNum
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

```



