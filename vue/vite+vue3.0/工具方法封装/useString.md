```tsx
// 驼峰转中横线的方法
export const useLineString = (str: string) => {
  return str.replace(/[A-Z]/g, function ($1, index) {
    return `${index === 0 ? '' : '-'}${$1.toLowerCase()}`
  })
}

/** 获取一个唯一的随机字符串 */
export function useRandomString(): string {
  return Math.random().toString(32).slice(2)
}

// 获取字节长度，中文算2个字节
export function useByteLength(str: string) {
  return str.split('').reduce(function (value, item) {
    return value + 1 + Number(item.charCodeAt(0) > 255)
  }, 0)
}

```

