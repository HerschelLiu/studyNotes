```js
/** 多级对象数组展平 */
export const useFlat = (list, name = 'children') => {
  let arr = []
  list.forEach(item => {
    arr = [...arr, item]
    if (item[name] && Array.isArray(item[name])) arr = [...arr, ...useFlat(item[name])]
  })

  return arr
}

/**
 * 获取多级数组每个元素最深层级数据及其父级数据
 * @param {Array<Object>} arr 数组
 * @param {Object} parent 最深层级数据的直属父级数据
 * @param {Number} depth 层级
 * @returns Array<{ item: Object;parent: Object | null;depth: Number; }>
 */
export const useDeepestDataAndParent = (arr, parent = null, depth = 1) => {
  let deepestItems = []
  for (let item of arr) {
    if (item.children) {
      const results = useDeepestDataAndParent(item.children, item, depth + 1)
      if (results.length > 0) {
        deepestItems.push(...results)
      }
    } else {
      deepestItems.push({
        item,
        parent,
        depth
      })
    }
  }
  return deepestItems
}

/** 判断两个数组中的值是否相等（不校验顺序）equality = true 校验顺序 */
export const useArraysEqual = (arr1, arr2, equality = false) => {
  if (equality) return JSON.stringify(arr1) === JSON.stringify(arr2)
  if (arr1.length !== arr2.length) return false
  const arr = []
  arr2.forEach(item => {
    const obj = arr1.find(it => JSON.stringify(it) === JSON.stringify(item))
    arr.push(!!obj)
  })

  return arr.every(item => item)
}

```

