[TOC]



## 解构赋值

```js
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"
```

没有的变量（baz），要在有的变量（foo）后面（foo: baz）



```javascript
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]
```

为什么move里要有`{x = 0, y = 0} = {}`？前三个例子不管有没有`={}`都成功，原因就出在最后一个例子，不传任何值进去，没有`={}`就会报错，因为解构不了，这相当于给了个默认值

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

# 注意

## apply、call、bind

### apply、call

```js
// 获取数组中的最大值和最小值
var  numbers = [5, 458 , 120 , -215 ]; 
var maxInNumbers = Math.max.apply(Math, numbers),   //458
    maxInNumbers = Math.max.call(Math,5, 458 , 120 , -215); //458
```

numbers没有max方法，但是Math，有，就可以用这俩方法让numbers使用上Math.max方法。就相当于我（numbers）借用了邻居家（Math）的秤（max方法）去称重。

比较常用的就是类（伪）数组使用数组方法

```js
var domNodes = Array.prototype.slice.call(document.getElementsByTagName("*"));
```

Javascript中存在一种名为伪数组的对象结构。比较特别的是 arguments 对象，还有像调用 getElementsByTagName , document.childNodes 之类的，它们返回NodeList对象都属于伪数组。不能应用 Array下的 push , pop 等方法。

但是我们能通过 **Array.prototype.slice.call **转换为真正的数组的带有 length 属性的对象，这样 domNodes 就可以应用 Array 下的所有方法了。

#### apply、call 的区别

对于 apply、call 二者而言，作用完全一样，只是接受参数的方式不太一样。例如，有一个函数定义如下：

```js
var func = function(arg1, arg2) {
    
};
```

就可以通过如下方式来调用：

```js
func.call(this, arg1, arg2);
func.apply(this, [arg1, arg2])

// 验证是否是数组（前提是toString()方法没有被重写过）
functionisArray(obj){ 
    return Object.prototype.toString.call(obj) === '[object Array]' ;
}
```

其中 this 是你想指定的上下文，他可以是任何一个 JavaScript 对象(JavaScript 中一切皆对象)，**call 需要把参数按顺序传递进去，而 apply 则是把参数放在数组里**。　　

JavaScript 中，某个函数的参数数量是不固定的，因此要说适用条件的话，当你的参数是明确知道数量时用 call 。

而不确定的时候用 apply，然后把参数 push 进数组传递进去。当参数数量不确定时，函数内部也可以通过 arguments 这个伪数组来遍历所有的参数。

### bind

MDN的解释是：bind()方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入 bind()方法的第一个参数作为 this，传入 bind() 方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。

直接来看看具体如何使用，在常见的单体模式中，通常我们会使用 _this , that , self 等保存 this ，这样我们可以在改变了上下文之后继续引用到它。 像这样：

```js
`var` `foo = {``    ``bar : 1,``    ``eventBind: ``function``(){``        ``var` `_this = ``this``;``        ``$(``'.someClass'``).on(``'click'``,``function``(event) {``            ``/* Act on the event */``            ``console.log(_this.bar);     ``//1``        ``});``    ``}``}`
```

保存this的方法可以用bind方法优雅的解决：

```js
var foo = {
    bar : 1,
    eventBind: function(){
        $('.someClass').on('click',function(event) {
            /* Act on the event */
            console.log(this.bar);      //1
        }.bind(this));
    }
}
```

在上述代码里，bind() 创建了一个函数，当这个click事件绑定在被调用的时候，它的 this 关键词会被设置成被传入的值（这里指调用bind()时传入的参数）。因此，这里我们传入想要的上下文 this(其实就是 foo )，到 bind() 函数中。然后，当回调函数被执行的时候， this 便指向 foo 对象。再来一个简单的栗子：

```js
`var` `bar = ``function``(){``console.log(``this``.x);``}``var` `foo = {``x:3``}``bar(); ``// undefined``var` `func = bar.bind(foo);``func(); ``// 3`
```

这里我们创建了一个新的函数 func，当使用 bind() 创建一个绑定函数之后，它被执行的时候，它的 this 会被设置成 foo ， 而不是像我们调用 bar() 时的全局作用域。

如果连续 bind() 两次，亦或者是连续 bind() 三次那么输出的值是什么呢？

```js
var bar = function(){
    console.log(this.x);
}
var foo = {
    x:3
}
var sed = {
    x:4
}
var func = bar.bind(foo).bind(sed);
func(); //?
 
var fiv = {
    x:5
}
var func = bar.bind(foo).bind(sed).bind(fiv);
func(); //?
```

答案是：两次都仍将输出 3 。原因是，在Javascript中，多次 bind() 是无效的

#### apply、call、bind比较

那么 apply、call、bind 三者相比较，之间又有什么异同呢？何时使用 apply、call，何时使用 bind 呢。简单的一个栗子

```js
var obj = {
    x: 81,
};
 
var foo = {
    getX: function() {
        return this.x;
    }
}
 
console.log(foo.getX.bind(obj)());  //81
console.log(foo.getX.call(obj));    //81
console.log(foo.getX.apply(obj));   //81
```

三个输出的都是81，但是注意看使用 bind() 方法的，他后面多了对括号。

也就是说，区别是，当你希望改变上下文环境之后并非立即执行，而是回调执行的时候，使用 bind() 方法。而 apply/call 则会立即执行函数。

**总结：**apply和call，第一个参数是让哪个对象去借用其他对象的方法，`Array.prototype.push(arr， value)`意思是让arr这个东西，去借用数组的push方法，第二个参数是要被push进arr中的值

### Array.from与扩展运算符
这两个方法都可以将某些数据结构转为数组。

`Array.from`方法还支持类似数组的对象。所谓类似数组的对象，本质特征只有一点，即必须有`length`属性。因此，任何有`length`属性的对象，都可以通过`Array.from`方法转为数组，而此时扩展运算符就无法转换。