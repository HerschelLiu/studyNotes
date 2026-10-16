## 1. 一句话本质

`reduce`（归纳 / 折叠 / fold）做的事：**把数组里的 N 个元素，用一个「累加器」一路滚过去，最终收敛成 1 个值**。

那个"1 个值"不一定是数字，可以是对象、数组、字符串、Map、Promise —— 只要是"下一个状态"就行。所以它的心智模型是：

代码块



```
初始状态  --元素0-->  状态1  --元素1-->  状态2  ...  -->  最终结果
```

每个元素的回调返回什么，就是下一轮的累加器。

## 2. 签名

```ts
arr.reduce(callbackFn)                        // 不给初始值
arr.reduce(callbackFn, initialValue)          // 给初始值
arr.reduce<U>(callbackFn, initialValue)       // 显式指定累加器类型
```

回调的四个参数，**顺序是固定的**：

```ts
arr.reduce((accumulator, currentValue, currentIndex, array) => {
  // ...
  return nextAccumulator   // ← 必须 return，返回值就是下一轮的 accumulator
}, initialValue)
```

| 参数           | 含义                                       |
| -------------- | ------------------------------------------ |
| `accumulator`  | 累加器，上一轮回调的返回值（第一轮见下文） |
| `currentValue` | 当前元素                                   |
| `currentIndex` | 当前元素在**原数组**中的下标               |
| `array`        | 原数组本身（少用）                         |

**最容易被记错的一点**：`accumulator` 在前、`currentValue` 在后。所以项目里到处写成 `(s, r) => s + Number(r.amount || 0)`（`s` = sum，`r` = row）。

## 3. 逐步执行过程（核心）

### 3.1 不给初始值

```ts
[1, 2, 3, 4].reduce((acc, cur) => acc + cur)
```

累加器直接拿 **`arr[0]` 当种子**，回调**从下标 1 开始**：

| 轮次 | `acc` | `cur` | `currentIndex` | 返回 |
| ---- | ----- | ----- | -------------- | ---- |
| 1    | 1     | 2     | 1              | 3    |
| 2    | 3     | 3     | 2              | 6    |
| 3    | 6     | 4     | 3              | 10   |

结果 `10`，回调只被调用 **3 次**（不是 4 次）。

### 3.2 给初始值

```ts
[1, 2, 3, 4].reduce((acc, cur) => acc + cur, 0)
```

种子换成 `0`，回调**从下标 0 开始**，调用 **4 次**：`0+1=1 → 1+2=3 → 3+3=6 → 6+4=10`。

### 3.3 前两轮对比图

```
无初始值：acc=arr[0]  cur=arr[1]  idx=1   （少一轮，且种子类型 = 元素类型）
有初始值：acc=init    cur=arr[0]  idx=0   （多一轮，种子类型可任意）
```

两种写法的差异不只是"少一次计算"，而是**语义和类型都可能变**，这是后面很多坑的根源。

## 4. 泛型 `<U>` 是什么意思

TS 里 `reduce` 有三个重载，关键那个是：

```ts
reduce<U>(
  callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
  initialValue: U,
): U
```

- `T` 是**元素类型**（由数组决定，你改不了）
- `U` 是**累加器类型**（可以≠ T，由初始值/泛型参数决定）
- `reduce<any>` 就是强行把 `U` 定成 `any`

为什么需要显式写？因为不写时 TS 要从初始值推 `U`，而初始值 `[]`、`{}` 这类空字面量推不出元素类型，会退化成 `never` 或 `{}` 然后报错。项目里的两种解法：

```ts
// 解法 A：显式泛型
form.totalAmount = items.reduce<number>((s, r) => s + Number(r.amount || 0), 0)

// 解法 B：断言初始值
Object.entries(target).reduce((acc, [key, value]) => { /* ... */ }, {} as T)   // useObject.ts:155
```

另一种解法是给**回调参数**标类型而不动泛型，见 ButtonsPanel.vue#L146：

```ts
bpmnElementProperties.reduce((pre: any[], current: any) => pre.concat(current.values), [])
```

> ⚠️ 经典 TS 坑：`[...].reduce((acc, x) => acc.concat(x), [])` 里 `[]` 通常被推成 `never[]`，报 "not assignable to parameter of type 'never[]'"，必须写 `reduce<any[]>(...)` 或 `[] as Foo[]`。

## 5. 四种典型模式

### 模式 1：累加成标量（求和、求积、计数、取极值）

```ts
// 求和（项目里最常见的用法）
const debit = form.detailList.reduce((s, r) => s + Number(r.localdebitamount || 0), 0)
```



```ts
// 求积：初始值必须是 1，给 0 结果永远是 0
_nums.reduce((val, current) => val * Math.pow(10, precision) * current, 1)
```



```ts
// 用二元函数迭代成 N 元 —— 泛化能力最强的形式
form.execAmt = list.reduce((acc, cur) => useAdd(acc, cur.execAmt), 0) 
```



### 模式 2：数组 → 对象（分组 / 字典 / 过滤键）



```ts
// login.vue:161 —— 累加器是对象，剔除 redirect 键
Object.keys(query).reduce((acc: Record<string, any>, cur) => {
  if (cur !== 'redirect') acc[cur] = query[cur]   // 原地改，不复制
  return acc
}, {})
```

分组写法：

```ts
const groupByDept = rows.reduce<Record<string, Row[]>>((acc, row) => {
  ;(acc[row.deptId] ??= []).push(row)
  return acc
}, {})
```

> 性能提醒：累加器是对象/数组时，**`return { ...acc, [key]: value }` 每轮都全量复制，复杂度 O(n²)**；`acc[key] = value` 原地改是 O(n)。useObject.ts#L137-L155 用的是复制式（追求不可变），login.vue#L161-L168 用的是原地式（追求效率），看场景选。
>
> ```ts
> a ?? (a = b) // a ??= b
> // 展开就是
> if (a === null || a === undefined) a = b
> ```
>
> **只有在 `a` 是 `null` 或 `undefined` 时才赋值，否则原样不动**。
>
> **行首要加分号（ASI 陷阱）**

### 模式 3：数组 → 数组（去重 / 扁平化 / 一遍过滤+映射）



```ts
// 扁平化
bpmnElementProperties.reduce((pre: any[], current: any) => pre.concat(current.values), [])

// 去重
arr.reduce<T[]>((acc, cur) => (acc.includes(cur) ? acc : [...acc, cur]), [])
```

**但这两种通常不该用 reduce**：扁平化用 `arr.flatMap(x => x.values)`，去重用 `[...new Set(arr)]`，一遍过滤+映射用 `flatMap` 或 `for...of` + `push` —— 更短也更易读。reduce 的优势场景是"**状态需要跨元素累积**"（求和、分组、树构建、路径查找），而不是"数组到数组的转换"。

### 模式 4：串行流程 / 逐层取值（高阶用法）



```ts
// 路径逐层取值 —— resolveId 就是这个
path.split('.').reduce((acc, k) => acc?.[k], node)

// 函数组合（pipe）
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

// 串行 Promise（每轮返回 Promise，reduce 天然是链式）
urls.reduce((p, url) => p.then(() => fetch(url)), Promise.resolve())
```



## 速记卡

```
reduce(回调, 初始值?)
回调 = (累加器, 当前元素, 当前下标, 原数组) => 新的累加器
无初始值：累加器 = arr[0]，从 arr[1] 开始
有初始值：累加器 = 初始值，从 arr[0] 开始
返回：最后一次回调的返回值
```