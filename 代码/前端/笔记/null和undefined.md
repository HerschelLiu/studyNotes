## 定义与类型差异

1. `undefined` 
   * **定义：**表示变量已声明但未初始化，或对象属性不存在，函数未返回值时的默认值 。
   * **类型：** typeof undefined 返回 "undefined" ，是独立的原始数据类型 2 。 
   * 转为数值 ：结果为 NaN ，例如 undefined + 3 为 NaN
2. `null` 
   * **定义：** 表示一个“空对象指针”，通常由开发者主动赋值以表明变量应持有对象但当前为空 。 
   * **类型：** typeof null 返回 "object" （历史遗留问题），但本质是原始数据类型。
   * 转为数值 ：等价于 0 ，例如 null + 3 为 3

## 使用场景对比

1. `undefined` 的典型场景

   * 变量未初始化 ：声明变量但未赋值时自动为 `undefined`

     ```js
     let x;
     console.log(x); // undefined
     ```

   * 对象属性不存在 ：访问未定义的属性返回 `undefined`

     ```js
     const obj = { } ; console ( obj . name ) ; // undefined
     ```

   * 函数默认返回值 ：函数无 return 语句时返回 `undefined`

   * 未传递的函数参数 ：未传入参数的形参值为 `undefined`

     ```js
     function sum ( a , b ) { return a + b ; } sum ( 1 ) ; // b 为 undefined，结果为 NaN
     ```

2. `null` 的典型场景

   * 主动清空对象引用 ：显式表示变量应持有对象但当前无值

     ```js
     let user = null; // 表示用户未登录
     ```

   * API 设计中的“空”返回值 ：如 DOM 查询未找到元素时返回 `null`

     ```js
     document.getElementById("nonexistent"); // null
     ```

   * 作为可选参数的占位符 ：明确表示某个参数或属性被有意置空

## 最佳实践建议

1. 优先使用  `null` ：当需要显式表示“无值”时，主动赋 null 以提高代码可读性
2. 避免隐式 `undefined` ：始终初始化变量，减少意外 undefined 的出现



> 在即判断null和undefined的时候，xx == null，因为null == undefined
>
> 一般来说，参数中普遍使用 undefined，而对象中普遍使用 null