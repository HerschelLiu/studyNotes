## 函数

```typescript
function func(num: number): number {
    return num;
}
```

表示*func*函数的参数*num*应为*Number*类型，且函数返回值为*Number*类型，此种写法，参数必须传，否则会报错

```typescript
function func(num?: number): number {
    return num;
}
```

参数*num*后带有`?`,表示参数可选，即可以不传参数。**可选参数必须位于必选参数后面**

```typescript‘
function func(num: number = 1): number {
    return num;
}
```

可以为参数设置默认值，**此种情况下，不可以再参数后加``?`**

### void 0(数字0)

```typescript
function func (foo, bar, footer) {
    if(footer === void 0) {
        footer = 0;
    }
    return foo + bar + footer;
}
```



`void 0`是typescript编译器检测一个变量是否为`undefined`的用法。**默认参数也必须位于必选参数后面**

### 剩余参数

```typescript
function add(...foo: number[]): number {
	var result = 0;
	for(var i = 0; i < foo.length; i++) {
		result += foo[i];
	}
	return result;
}

add(); // 0
add(2); // 2
add(2, 2); // 4
add(2, 2, 2); // 6
```

如果希望添加任意多个参数，可以使用剩余参数语法。剩余参数语法允许把不限量的参数表示为一个数组。

上面的例子，用一个*foo*代替了`foo, bar, footer`。**一个剩余参数必须包含一个数组类型**

### 函数重载

是指使用相通名称和不同参数数量或类型创建多个方法的一种能力。

```typescript
function test(name: string): string; // 重载签名
function test(age: number): string; // 重载签名
function test(single: boolean): string; // 重载签名
function test(value: (string | number | boolean)): string {} // 实现签名
```

重载了test函数三次。所有重载签名必须兼容，即所有重载签名的不同类型的参数名不能相同，否则将会编译报错。

实现签名必须兼容所有重载签名，总是在所有参数的最后，接受一个any类型（ji类型为`any`，代表任意类型）或者联合类型（指用`|`分割的多个类型）的参数作为他的参数

### 特定重载签名（没理解）

我们可以使用一个特定的签名来创建具有同样名称、参数数量但是有不同返回类型的多个函数。为了创建一i个特定签名，必须将函数的参数类型指定为一个字符串

```typescript
interface Document {
    createElement(tagName: 'div'): HTMLDivElement;          // 特定重载签名
    createElement(tagName: 'span'): HTMLSpanElement;        // 特定重载签名
    createElement(tagName: 'canvas'): HTMLCanvasElement;    // 特定重载签名
    createElement(tagName: string): HTMLElement;            // 非特定重载签名
}
```

## 面向对象编程

## 类

```typescript
class Email {
	public email: string;
	constructor(email: string) {
		if(this.validateEmail(email))
			this.email = email;
		else 
			throw new Error('Invalid email!');
	}
	validateEmail(email: string) {
		let re = /\S+@\S+\.\S+/;
        return re.test(email);
	}
}

class Person {
	public name: string;
	public age: number;
	public email: Email;
	constructor(name: string, age: number, email: Email) {
		this.name = name;
		this.age = age;
		this.email = email;
	}
	greet() {
		console.log(`Hi! My name is ${this.name}.I'm ${this.age}岁.${this.email}`);
	}
}

let me: Person = new Person('chichi', 24, new Email('email.email@email.com'));
me.greet();
```

##  接口

typescript中：

* 接口可以扩展其他接口或类
* 接口可以定义数据和行为而不只是行为

### 接口之间的关系

#### 关联

有联系但他们的对象有独立的生命周期，并且没有从属关系。例如学生和老师，当老师离开学校时，不必删除学生，反之亦然。

#### 聚合

有独立生命周期，但是有从属关系，并且子对象不能从属于其他对象的关系。例如亲生父子，假如父亲去世了，但是儿子还在，并且儿子不可能有其他的亲生父亲。

#### 组合

没有独立生命周期，父对象被删除后，子对象也被删除。例如问题和答案，一个问题可以有多个答案，并且一个问题不可以属于多个问题，如果删除了问题，答案将会自动删除。**生命周期依赖其他对象的对象也被称作*弱实体***

### 继承（关键字extends）

就是扩展已有的类

```typescript
class Person { // 父类
	public name: string;
	public age: number;
	constructor(name: string, age: number) {
		this.name = name;
		this.age = age;
	}
    greet() {
		console.log(`Hi! My name is ${this.name}.I'm ${this.age}岁.`);
	}
}

class Teacher extends Person {
    teach() {
        alert('welcome to class');
    }
}
```

*Teacher*包含所有*Person*中的方法和属性，并有自己的方法或属性

*Teacher*想要引用父类构造函数，或者扩展父类方法，可以用***super***关键字

```typescript
class Person { // 父类
	public name: string;
	public age: number;
	constructor(name: string, age: number) {
		this.name = name;
		this.age = age;
	}
    greet() {
		console.log(`Hi! My name is ${this.name}.I'm ${this.age}岁.`);
	}
}

class Teacher extends Person {
    plublic subject: string[];
    constructor(name: string, age: number, subject: string[]) {
        super(name, age);
        this.subject = subject;
	}
	greet() {
        super.greet();
        alert(`I teach ${this.subject}`);
    }
    teach() {
        alert('welcome to class');
    }
}

let teacher = new Teacher('chichi', 24, ['数学', '语文', '英语']);
```

可以一直继承下去

```typescript
class Teacher extends Person ...
class School extends Teacher ...
```

**不推荐有过多层级的继承，因为复杂**

### 混合

一个类同时被2个以上的累继承，即多重继承。多重继承会出现复杂的问题，所以引入了***混合(mixin)***，但是此功能有局限性

```typescript
class Animal {
    eat() {...}
}
    
class Mammal extends Animal { // 哺乳动物
    breathe() {...}
}
    
class WingedAnimal extends Animal { // 飞行动物
    fly() {...}
}
```

我们尝试构建一个*Bat(蝙蝠)*的类，它既是哺乳动物又是飞行动物，然而如此继承会报错

```typescript
class Bat extends Mammal, WingedAnimal {...} // 报错：子类只能继承一个父类
```

这是因为typescript不支持这样的多重继承

混合的实现如下

```typescript
class Mammal {
    breathe(): string {}
}

class WingedAnimal {
    fly(): string {}
}

class Bat implements Mammal, WingedAnimal {
    breacthe: () => string;
    fly: () => string;
}
```

使用了关键字***implements(与extends相反)***，表明Bat会实现`Mammal`,和`WingedAnimal`中声明的功能

以下为非常有名的范式，可以在很多图书和线上资料中找到，包括typescript手册

```typescript
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if(name != 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
    });
}
```

`applyMixins`函数会迭代所有父类的属性（存储到baseCtors数组中），然后将他们的实现复制到子类中。

`applyMixins(Bat, [Mammal, WingedAnimal])`

随后子类（Bat）会包含他的两个父类（Mammal, WingedAnimal）的所偶有属性和实现

```typescript
let bat = new Bat();
bat.breathe();
bat.fly();
```



## 使用注意

## 在ts中使用JQuery

通过类型定义文件(*.d.ts)实现在TS中使用JQuery

1. 通过GitHub项目，手动下载，不过推荐使用第二种方式

     项目地址： https://github.com/DefinitelyTyped/DefinitelyTyped

     页面两种引用方式: 

     * ` <reference path="jquery/jquery.d.ts" />`
     * `import "jquery/jquery.d.ts"`

2. 通过typings的方式

     项目地址：https://github.com/typings/typings

     ```
     npm install -g typings
     typings search jquery
     typings install dt~jquery --global
     ```

然后就能够在TS中正常使用JQ了。

```
$.isArray(null);
```




