[TOC]



### 过滤用

#### filter()

返回符合条件的元素所组成的新数组，不会改变原数组

```js
var words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];

const result = words.filter(word => word.length > 6);

console.log(result);
// expected output: Array ["exuberant", "destruction", "present"]
```



#### find()


  方法返回数组中满足函数要求的第一个元素的值。否则返回 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。

```js
var array1 = [5, 12, 8, 130, 44];

var found = array1.find(function(element) {
  return element > 10;
});

console.log(found);
// expected output: 12
```

[`findIndex()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) 方法，它返回数组中找到的元素的索引，而不是其值



#### indexOf(值)

返回符合条件的下标

```js
//查找符合条件的元素：

var array = [2, 5, 9];
var index = array.indexOf(2);
// index is 0
index = array.indexOf(7);
// index is -1
//结果：
//[2, 5, 9].indexOf(2) ： 0 
//[2, 5, 9].indexOf(7) ： -1
```

没有的元素会返回-1,所以常用于判断是否有此元素





```js
if(arr.indexOf(value) > -1) {}
```

#### lastIndexOf()

与`indexOf`不同的是,这是反向进行的,返回的下标也是以末尾元素为下标0开始的

### 其他

#### map()

对数组中的元素进行一些简单的操作

```js
//将所有的数组元素转换为大写：

var strings = ["hello", "Array", "WORLD"];
function makeUpperCase(v)
{
    return v.toUpperCase();
}
var uppers = strings.map(makeUpperCase);
// uppers is now ["HELLO", "ARRAY", "WORLD"]
// strings is unchanged
//结果：["hello", "Array", "WORLD"].map(makeUpperCase) ： HELLO, ARRAY, WORLD
```

### 判断

#### some()

判断数组元素中如果有符合函数要求的，就返回true，一旦有一个true，就停止，类似**或（||）**

```js
//检查是否有数组元素大于等于10：

function isBigEnough(element, index, array) {
    return (element >= 10);
}
var passed = [2, 5, 8, 1, 4].some(isBigEnough);
// passed is false
passed = [12, 5, 8, 1, 4].some(isBigEnough);
// passed is true
//结果：
//[2, 5, 8, 1, 4].some(isBigEnough) ： false 
//[12, 5, 8, 1, 4].some(isBigEnough) ： true
```



#### **every()**

判断数组元素中如果有不符合函数要求的，就返回false，一旦有一个false，就停止，类似**与（&&）**

```js
//测试是否所有数组元素都大于等于10：

function isBigEnough(element, index, array) {
    return (element >= 10);
}
var passed = [12, 5, 8, 130, 44].every(isBigEnough);
// passed is false
passed = [12, 54, 18, 130, 44].every(isBigEnough);
// passed is true
//结果：
//[12, 5, 8, 130, 44].every(isBigEnough) 返回 ： false 
//[12, 54, 18, 130, 44].every(isBigEnough) 返回 ： true
```

