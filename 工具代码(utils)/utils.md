## 防抖

```js
function debounce(fn, delay) {
  let timer
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
```

## 节流

```js
function throttle(fn, delay) {
  let last = 0
  return function(...args) {
    const now = Date.now()
    if (now - last > delay) {
      last = now
      fn.apply(this, args)
    }
  }
}
```

## 深拷贝

```js
function deepClone(obj, cache = new WeakMap()) {
  if (typeof obj !== 'object') return obj
  if (obj === null) return obj
  if (cache.get(obj)) return cache.get(obj)
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  
  let cloneObj = new obj.constructor()
  cache.set(obj, cloneObj)
  for (let key in obj) {
    if (Reflect.has(obj, key)) {
      cloneObj[key] = deepClone(obj[key], cache)
    }
  }
}
```

## 异步控制并发数

```js
作者：Ting Yu
链接：https://zhuanlan.zhihu.com/p/434776450
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

function limitRequest(urls = [], limit = 5) {
  return new Promise((resolve, reject) => {
    const len = urls.length
    let count = 0 // 当前进行到第几个任务

    const start = async () => {
      const url = urls.shift() // 从数组中拿取第一个任务
      if (url) {
        try {
          await axios.post(url)
          if (count == len - 1) {
            // 最后一个任务
            resolve()
          } else {
            count++
            // 成功，启动下一个任务
            start()
          }
        } catch (e) {
          count++
          // 失败，也启动下一个任务
          start()
        }
      }
    }

    // 启动limit个任务
    while (limit > 0) {
      start()
      limit -= 1
    }
  })
}
```

## 冒泡排序

```js
function bubbleSort(arr) {
  let len = arr.length
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let num = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = num
      }
    }
  }
  return arr
}
```

## 获取url参数

```js
function getParams(url) {
  const res = {}
  if (url.includes('?')) {
    const str = url.split('=')[0]
    const key = url.split('=')[1]
    res[key] = decodeURIComponent(val)
  }
  
  return res
}
```

