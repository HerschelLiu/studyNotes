### 逻辑运算符

```javascript
// 逻辑运算符
		// && 与
			// 1) 返回第一个为假的值 ==> 找假
			// 2) 都为真时返回最后一个为真的值
			console.log( "false" && 0 && null );// 0
			console.log( "hello" && "undefined" && null );//null
			console.log( undefined && 0 && "hello" );// undefined
			console.log( "hello" && 4 && true );// true
		// || 或
			// 1) 返回第一个为真的值 ==> 找真
			// 2) 都为假时返回最后一个为假的值
			console.log( "false" || undefined || "6" );//"false"
			console.log( null || 5 - 5 || 1 );// 1
			console.log( undefined || 0 || null );// null

		// ! 非
			// 非真即假非假即真
			console.log( !null );//true
			console.log( !"false" );//false

			// !! 变量 ==> Boolean( 变量 )
			console.log( !!null );//false
			console.log( !!1 );//true

		// 优先级  ! > && > ||
			console.log( !!null || 5 - "5" && 5 * "hello"  );//0
```

### for...in

```
for (const i in o) {
            
            
        }
```



在循环对象时，i指的是对象名，循环数组i指的是下标



### 面向对象

```javascript
// 写法1
function User(name,pass){
			this.name = name;
			this.pass = pass;
		}
		User.prototype.showName = function(){
			alert( this.name );
		}

		User.prototype.showPass = function(){
			alert( this.pass );
		}

		var o = new User( "张三","123456" );
		o.showName();
		o.showPass();

// 写法2
		class User{
			constructor(name,pass){
				this.name = name;
				this.pass = pass;
			}
			showName(){
				alert( this.name );
			}
			showPass(){
				alert( this.pass );
			}
		}

		var o = new User( "zhangsan","123456" );
		o.showName();
		o.showPass();

```

### slice和substring区别

* substring是以两个参数中较小一个作为起始位置，较大的参数作为结束位置。如：alert(test.substring(7,4)); 而slice是第一个参数是起始位置
* substring结束点不支持负数；当接收的参数是负数时，slice会将它字符串的长度与对应的负数相加，结果作为参数（相当于从后往前，注意的是，从末尾数不是从0开始，而是从1开始）；substr则仅仅是将第一个参数与字符串长度相加后的结果作为第一个参数；substring则干脆将负参数都直接转换为0

### every()和some()区别

- every()是对数组中每一项运行给定函数，如果该函数对每一项返回true,则返回true

- some()是对数组中每一项运行给定函数，如果该函数对任一项返回true，则返回true

- ```
  var arr = [ 1, 2, 3, 4, 5, 6 ]; 
  
  console.log( arr.some( function( item, index, array ){ 
      console.log( 'item=' + item + ',index='+index+',array='+array ); 
      return item > 3; 
  })); 
  
  console.log( arr.every( function( item, index, array ){ 
      console.log( 'item=' + item + ',index='+index+',array='+array ); 
      return item > 3; 
  }));1234567891011
  ```

  some一直在找符合条件的值，一旦找到，则不会继续迭代下去。 every从迭代开始，一旦有一个不符合条件，则不会继续迭代下去。

### fliter 与 forEach

* fliter 是创建新的数组来存储符合条件的元素;forEach 方法用于调用数组的每个元素，并将元素传递给回调函数。

#### sort

想要按照数值大小对数字排序

```javascript
arr.sort( (a,b)=>a-b ); // es6
arr.sort( functioin(a,b){a-b });
```

### 事件

```javascript
var e = e || window.event;// 事件对象兼容
var target = e.target || e.srcElement;// 事件目标兼容
```

### 阻止冒泡

* 标准浏览器下 DOM中 : event.stopPropagation()   停止传播

* IE浏览器下：         event.cancelBubble=true   取消冒泡

​            

       ```
 //阻止冒泡的兼容写法，写成函数

          function stopPropagation(eve){

                    if(eve.stopPropagation){ //标准

                            eve.stopPropagation();//函数方法

                    }else{

                        eve.cancelBubble=true; //IE

                    }

              }

       ```

