[TOC]



# arguments

  函数的参数被认为是一种数组，下标与数组相同即arguments[0]指代的是第一个,<br />
  所以即使不写参数也可以使用arguments来操作
  ```
  function doAdd(){
    if(arguments.length == 1){
      alert(arguments[0] + 10);
    } else if(arguments.length == 2){
      alert(arguments[0] + arguments[1]);
    }
  }
  doAdd(10); // 20
  doAdd(20, 30); //50
  ```

# 复制变量值
```
var num1 = 1;
var num2 = num1;
```
num1,num2的值都是1，但是相互独立
```
var obj1 = new Object()
var obj2 = obj1
```
obj1和obj2都是Object类型，不过这两者都指向同一个对象
```
obj1.name = "tom"
alert(obj2.name) // tom
```
# 用length为数组末尾添加
 因为数组的下标永远是数组长度减一，所以可以利用这个特性为数组末尾加东西
 ```
 var colors = ["red","green"]; // 创建一个包含两个字符串的数组
 colors[colors.length] = "yellow" // 在colors[2]的位置添加一个字符串
 ```

# 重排序方法（reverse(), sort()）
  reverse()会反转数组项的顺序<br />
  sort()默认情况下会升序排列数组项-即最小的值排在最前面<br />
  sort()方法可以接收一个比较函数作为参数，以便我们指定哪个值位于哪个值前面<br />
  简单的比较函数

  ```
  function compare(val1, val2) {
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0
    }
  }
  ```
 这个比较函数适合大多数数据类型，只要将其作为参数传递给sort()方法就行`sort(compare)`

# 数组方法slice()
 基于当前数组中的一个或多个项创建新数组
 ```
 var colors = ["red", "green", "blue", "yellow", "purple"];
  var color2 = colors.slice(1);
  var color3 = colors.slice(1, 4);
  alert(color2); // "green", "blue", "yellow", "purple"
  alert(color3); //"green", "blue", "yellow"
 ```

# 数组splice()
  * 删除：`splice(删除的位置，删除的项数)`，eg：`splice(0, 2)`删除数组前两项
  * 插入：`splice(位置，要删除的项数，要插入的项)`不删就是写0， eg：`splice(2, 0, "red", "green")`从2的位置开始插入
  ```
  var colors = ["red", "green", "blue", "yellow", "purple"];
  colors.splice(2, 0, "yellowgreen");
  alert(colors) // "red", "green", "yellowgreen", "blue", "yellow", "purple"
  ```
  * 替换：可以向指定位置插入任意数量的项，且同时删除任意数量的项。同上，就是要删除的项的位置是任意非零整数

# 数组indexOf与lastIndexOf
  只是一个从开头找一个从末尾找，但是返回的数值还是按照正常的数组项的位置返回，而不是说从后面查找就是从后面开始数位置
  参数为要查找的项，查找起点位置的索引（可选）

# querySelector与getElementById
  区别：getXXXByXXX 获取的是动态集合，querySelector获取的是静态集合。

简单的说就是，动态就是选出的元素会随文档改变，静态的不会，取出来之后就和文档的改变无关了。<br />
如果只要一次查找就可得到元素时，首选getXXXByXXX ；

如果需要经过多级查找，才能得到元素时，首选querySelector；

# 自定义数据属性
  设置带有data-前缀的，为元素提供与渲染无关的信息。<br />
  用`dataset`来获取
  ```
   var box = document.getElementById("box");
  // 获取自定义属性的值
  var boxId = box.dataset.boxId;
  ```
  如果浏览器不支持dataset，例如FireFox 4,输出结果为undfined<br />
  需要注意的是带连字符连接的名称在使用的时候需要命名驼峰化,例如`data-meal-time`就是`box.dataset.mealTime`<br />

  传统方法获取data-：
  `var boxId = document.getElementById('box').getAttribute('data-boxId');`

# 事件冒泡
  IE的事件流称为事件冒泡，比如单击了<div>这个元素，click事件会从这个点击的<div>开始，然后沿着dom树向上传播,<br />
直到document对象

# 事件对象
  在触发DOM上的某个事件，会产生一个事件对象event