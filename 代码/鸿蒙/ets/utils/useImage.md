```ts
import picker from '@ohos.file.picker'
import { copyToCache } from '../utils/file'
import accessAuth from '../utils/accessAuth'

const photoPicker = new picker.PhotoViewPicker()

/** 选择图片 **/
export const chooseImage = async () => {
  const PhotoSelectOptions = new picker.PhotoSelectOptions()
  PhotoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE
  PhotoSelectOptions.maxSelectNumber = 1
  await accessAuth('ohos.permission.READ_MEDIA','请打开相册访问权限')
  const uri = await photoPicker.select(PhotoSelectOptions).then((res) => res.photoUris[0])
  return await copyToCache(uri)
}
```

