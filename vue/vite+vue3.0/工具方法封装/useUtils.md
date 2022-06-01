```tsx
/** 商品描述转化为图片数组 */
export function getImgsByDescribe(str: string): string[] {
  if (!str) return []
  try {
    // 获取所有img标签
    const patt1 = /(<img|< img)[^>]*src[=\\"\\'\s]+[^\\.]*\/([^\\.]+)\.[^\\"\\']+[\\"\\']?[^>]*>/g
    // 获取所有src属性
    const patt2 = /\bsrc\b\s*=\s*[\\'\\"]?([^\\'\\"]*)[\\'\\"]?/g
    // 获取所有src属性中的url
    const patt3 = /(https|http|\/uploadfile)(.*)(jpg|png|jpeg|gif)/g
    const newarr0 = str.match(patt1)
    if (newarr0 === null) return []
    const newarr: string[] = []
    newarr0.forEach(item => {
      const arr = item.match(patt2)
      if (arr) newarr.push(arr[0])
    })
    const newarr2: string[] = []
    newarr.forEach(item => {
      const arr = item.match(patt3)
      if (arr) newarr2.push(arr[0])
    })
    const newarr3 = new Set(newarr2)
    return Array.from(newarr3)
  } catch (error) {
    return []
  }
}

/** 设置富文本图片宽度 */
export function replaceImg(content: string) {
  content = content.replace(/< ?img.*?\/>/gi, function (match) {
    // 判断没有 style 样式
    if (match.indexOf('style') === -1) {
      const index = match.indexOf('src')
      const reg = new RegExp(`(.{${index}})`)
      return match.replace(reg, '$1 style="max-width: 100%; height: auto; display: block; margin: 0;" ')
    }
    return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/gi, 'style="max-width: 100%; height: auto; display: block; margin: 0"')
  })
  return content
}

/** base64转二进制 */
export function dataURLtoBlob(dataurl: string, filename: string): File {
  const arr = dataurl.split(',')
  const mime = (arr[0].match(/:(.*?);/) as string[])[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

```

