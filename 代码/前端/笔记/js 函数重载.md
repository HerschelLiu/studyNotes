在 TS 中有函数重载，即有多个重名函数，传入不同的参数调用相应参数数量的同名函数，但是在 js 中没有，如果想实现 js 的参数重载，有两个方法：

### jquery源码中使用的方式

```js
// addMethod.js
function addMethod(object, name, fn) {
  const old = object[name]
  object[name] = function (...args) {
    if (args.length === fn.length) {
      return fn.apply(this, args)
    } else if (typeof old === 'function') {
      return old.apply(this, args)
    }
  }
}

export default addMethod
```



```js
import addMethod from './addMethod.js'

const searcher = {}

addMethod(searcher, 'getUsers', () => {
  console.log('查询所有用户')
})

addMethod(searcher, 'getUsers', (name) => {
  console.log('按照姓名查询用户')
})

addMethod(searcher, 'getUsers', (name, sex) => {
  console.log(' 按照姓名和性别查询用户')
})

searcher.getUsers()
searcher.getUsers(1)
searcher.getUsers(1, 2)
```



这种方法有几个问题：

1. 必须要建立一个对象
2. 根据形参的数量进行判断，形参的数量收到 es6默认参数的影响，实惠出现一些变化。设置name = 0时，在 addMethod 中获取形参数量是0，会匹配不上
3. 不支持参数类型，只能支持参数数量



### 优化版本

```js
// overload.js

function createOverload() {
  const fnMap = new Map()
  function overload(...args) {
    const key = args.map(it => typeof it).join(',')
    const fn = fnMap.get(key)
    if (!fn) throw new TypeError('没有找到对应的实现')
    
    return fn.apply(this, args)
  }
  
  overload.addImpl = function (...args) {
    const fn = args.pop()
    if (typeof fn !== 'function') {
      throw new TypeError('最后一个参数必须是函数')
    }
    const key = args.join(',')
    fnMap.set(key, fn)
  }
  
  return overload
}

export default createOverload
```



```js
import createOverload from './overload.js'

const getUsers = createOverload()

getUsers.addImpl(() => {
  console.log('查询所有用户')
})

const searchPage = (page, size = 10) => {
  console.log('按照页码和数量查询用户')
}
getUsers.addImpl('number', searchPage)
getUsers.addImpl('number', 'number', searchPage)

getUsers.addImpl('string', (name) => {
  console.log('按照姓名查询用户')
})
getUsers.addImpl('string', 'string', (name, sex) => {
  console.log('按照姓名、性别查询用户')
})

getUsers()
getUsers(1)
getUsers(1， 2)
getUsers('张')
getUsers('张', '男')
```

