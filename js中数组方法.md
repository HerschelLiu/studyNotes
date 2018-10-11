1. forEach:让数组中的每个item做一件事

```javascript
var arr = [1, 2, 3, 4, 5];
            arr.forEach((item, index) => {
                console.log(item + '--' + index);

            });// 1--0,2--1,3--2,4--3,5--4
```

2. mao:让数组中每个item进行某种运算,返回新数组

```javascript
var arr = [1, 2, 3, 4, 5];
var newArr = arr.map((item) => {
     return item * 2;
});
console.log(newArr);//[2,4,6,8,10]
```

3. filter:选出符合条件的item,组合成新数组

```javascript
var arr = [1, 2, 3, 4, 5];
            var newArrFilter = arr.filter((item) => {
                return item > 4;
            });
            console.log(newArrFilter);//[5]
```

4. reduce: 数组中前后两项进行相应操作,返回最终结果

```javascript
var arr = [1, 2, 3, 4, 5];
            var result = arr.reduce((prev, next) => {
                return prev * next;
            });
            console.log(result); //1*2*3*4*5=120
```

5. every:数组中所有item都满足条件才会返回true

```javascript
var arr = [1, 2, 3, 4, 5];
            var isAllTrue = arr.every((item, index) => {
                return item > 4;
            });
            console.log(isAllTrue); //false
```

6. some:数组中只要有一个满足条件,就返回true

```javascript
var arr = [1, 2, 3, 4, 5];
            var isTrue = arr.some((item, index) => {
                return item > 4;
            });
            console.log(isTrue); //true
```

