```ts
/** 判断元素是否可见 */
const useElementVisible = (element: Element) => {
  if (!element) {
    return false
  }

  const bounding = element.getBoundingClientRect()

  // 获取视口的宽高
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight

  // 判断元素是否在视口范围内
  const visible = bounding.top < viewportHeight && bounding.bottom > 0 && bounding.left < viewportWidth && bounding.right > 0

  // 判断元素是否可见
  const style = window.getComputedStyle(element)
  const display = style.display
  const visibility = style.visibility

  return visible && display !== 'none' && visibility !== 'hidden'
}

export default useElementVisible

```

