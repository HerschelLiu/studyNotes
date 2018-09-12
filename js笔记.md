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

