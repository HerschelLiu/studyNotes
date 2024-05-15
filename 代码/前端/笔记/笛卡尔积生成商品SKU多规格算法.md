方式1

```js
let arr = [
    ['红色', '黑色', '白色'],
    ['16G', '32G'],
    ['移动版', '联通版'],
]
let result = arr.reduce((a, b, c) => {
    var res = []
    a.map(x => {
        b.map(y => {
            res.push([...x, y])
        })
    })
    return res
}, [[]])
console.log(result)
```



```js
[
    ["红色", "16G", "移动版"],
    ["红色", "16G", "联通版"],
    ["红色", "32G", "移动版"],
    ["红色", "32G", "联通版"],
    ["黑色", "16G", "移动版"],
    ["黑色", "16G", "联通版"],
    ["黑色", "32G", "移动版"],
    ["黑色", "32G", "联通版"],
    ["白色", "16G", "移动版"],
    ["白色", "16G", "联通版"],
    ["白色", "32G", "移动版"],
    ["白色", "32G", "联通版"]
]
```





方式2

生成对象形式的笛卡尔积（这种形式常用与elementui）方便简单

```js
let newArr = [{
        name: 'color',
        data: ['红色', '黑色', '白色'],
    },
    {
        name: 'size',
        data: ['16G', '32G'],
    },
    {
        name: 'banben',
        data: ['移动版', '联通版'],
    }
]
 
let newResult = newArr.reduce((a, b, c) => {
    let res=[]
    a.map(x=>{
        b.data.map(y=>{
            res.push({...x,[b.name]:y})
        })
    })
    return res
},[{}])
console.log(newResult)
```



```js
[
    {
        "color": "红色",
        "size": "16G",
        "banben": "移动版"
    },
    {
        "color": "红色",
        "size": "16G",
        "banben": "联通版"
    },
    {
        "color": "红色",
        "size": "32G",
        "banben": "移动版"
    },
    {
        "color": "红色",
        "size": "32G",
        "banben": "联通版"
    },
    {
        "color": "黑色",
        "size": "16G",
        "banben": "移动版"
    },
    {
        "color": "黑色",
        "size": "16G",
        "banben": "联通版"
    },
    {
        "color": "黑色",
        "size": "32G",
        "banben": "移动版"
    },
    {
        "color": "黑色",
        "size": "32G",
        "banben": "联通版"
    },
    {
        "color": "白色",
        "size": "16G",
        "banben": "移动版"
    },
    {
        "color": "白色",
        "size": "16G",
        "banben": "联通版"
    },
    {
        "color": "白色",
        "size": "32G",
        "banben": "移动版"
    },
    {
        "color": "白色",
        "size": "32G",
        "banben": "联通版"
    }
]
```

