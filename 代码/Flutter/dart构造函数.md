Dart构造函数有4种格式：

* `ClassName()` //普通构造函数
* `ClassName.identifier()` // 命名构造函数
* `const ClassName()` // 常量构造函数
* `factroy ClassName()` // 工厂构造函数



## 普通构造函数

```dart
class Point {
    num x, y;
    Point(num x, num y) {
        this.x = x;
        this.y = y;
    }
}

// 语法糖
class Point {
    num x, y;
    Point(this.x, this.y);
}
```

## 工厂构造函数

> 当执行构造函数并不总是创建这个类的一个新实例时，则使用 `factory` 关键字。 例如，一个工厂构造函数可能会返回一个 cache 中的实例， 或者可能返回一个子类的实例。

意思就是，工厂函数可以根据判断`return`不同的值。正常的，不管什么语言，构造函数都是不能`return`的

