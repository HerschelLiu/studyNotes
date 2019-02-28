## symbol

第七个数据类型，代表独一无二，用来作为属性名，不能用new创建

```javascript
            let s2 = Symbol('a');

            let s3 = Symbol('a')
            console.log(s2,s3,s2 == s3); // symbol('a') symbol('a') false

```



## set

set数据结构，类似数组，所有的数据都是唯一的，没有重复的值。它本身是一个构造函数

* size 数据的长度

* add() 添加一个数据

* delate() 删除一个数据

* has() 查找某条数据，返回一个布尔值

* clear() 删除所有数据

 ```javascript
  let set = new Set([1, 1, 2, 3, 4])
              // set数据
              console.log(set); // set[1,2,3,4],重复数据会被删掉
              // set长度
              console.log(set.size); // 4
              // set添加
              console.log(set.add('a')); //set[1,2,3,4,'a']
              // set删除
              console.log(set.delete(1)); // true
              console.log(set); //set[2,3,4,'a']
              // set查找
              console.log(set.has('a')); // true
              console.log(set.has('b')); // false
              // set清空
              console.log(set.clear()); // undefined 因为这个函数没有返回值
              console.log(set); // set[]
 ```

## map

map数据结构，类似于对象，键值对的集合，所有的数据都是唯一的，不会重复，每条数据都需要放在一个数组中。它本身是一个构造函数

* size数据的长度
* set()添加一条数据
* delete()删除一条数据
* get()获取一条数据
* has（）查找某条数据，返回一个布尔值
* clear() 删除所有数据

```javascript
let map = new Map([
                ['name', '张三'],
                ['age', '24']
            ])
            // 数据
            console.log(map); // Map(2) {"name" => "张三", "age" => "24"}
            // 长度
            console.log(map.size); // 2
            // 添加
            console.log(map.set('sex', '男')); //Map(3) {"name" => "张三", "age" => "24", "sex" => "男"}
            // 删除
            console.log(map.delete('name')); // true
            console.log(map); //Map(2) {"age" => "24", "sex" => "男"}
            // 获取
            console.log(map.get('age')); // 24
            // 查找
            console.log(map.has('name')); // false
            // 清空
            console.log(map.clear()); //
            console.log(map); // map(0)[]
```

