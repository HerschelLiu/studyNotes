```ts
import fs from '@ohos.file.fs'

const mimeType = new Map([
  ['image/jpeg', (uint8Array: Uint8Array) => uint8Array[0] === 0xff && uint8Array[1] === 0xd8],
  ['image/png', (uint8Array: Uint8Array) => uint8Array[0] === 0x89 && uint8Array[1] === 0x50],
  ['image/gif', (uint8Array: Uint8Array) => uint8Array[0] === 0x47 && uint8Array[1] === 0x49],
  ['image/webp', (uint8Array: Uint8Array) => uint8Array[0] === 0x52 && uint8Array[1] === 0x49]
])

/** 获取 internal 文件路径 **/
export const getInternalPath = (path: string) => `internal://cache/${path.split('cache/')[1]}`

/**  读取文件 buffer **/
export const readBuffer = async (path: string) => {
  const file = await fs.open(path, 0o2)
  const stat = await fs.lstat(path)
  const buffer = new ArrayBuffer(stat.size)
  await fs.read(file.fd, buffer)
  await fs.fsync(file.fd)
  await fs.close(file.fd)
  return buffer
}

/** 将文件复制到缓存路径 **/
export const copyToCache = async (path: string) => {
  const cacheDir = globalThis.getContext().cacheDir
  const cachePath = `${cacheDir}/${Date.now()}`
  const file = await fs.open(path)
  await fs.copyFile(file.fd, cachePath)
  await fs.close(file)
  return cachePath
}

/** 获取文件类型 **/
export const getMimeType = async (file: string | ArrayBuffer) => {
  const buffer = typeof file === 'string' ? await readBuffer(file) : file
  const uint8Array = new Uint8Array(buffer)
  return [...mimeType.entries()].find(([type, check]) => check(uint8Array))?.[0] ?? 'application/octet-stream'
}

/** 获取文件大小 */
export const getFileSize = async (file: string | ArrayBuffer) => {
  const buffer = typeof file === 'string' ? await readBuffer(file) : file
  return buffer.byteLength
}

```

