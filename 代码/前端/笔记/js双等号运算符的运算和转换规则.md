从上到下按照规则比较，直到能得到确切结果为止

1. 两端存在 NaN，返回false
2. undefined 和 null 只有与自身比较，或者互相比较时，才会返回 true，和其他原始类型比较返回 false。
3. 两端类型相同，比较值
4. 两端都是原始类型，转换成数字重新比较
5. 一端是原始类型，一端是对象类型，把对象转换成原始类型后重新比较

> 对象如何转换成原始类型？
>
> 1. 如果对象拥有`[Symbol.toPrimitive]`方法，调用该方法。若该方法能得到原始值，使用该原始值；若得不到原始值，则抛出异常。
> 2. 调用对象的`valueOf`方法。若该方法能得到原始值，使用该原始值；若得不到原始值，进入下一步。
> 3. 调用对象的`toString`方法。若该方法能得到原始值，使用该原始值；若得不到原始值，则抛出异常。