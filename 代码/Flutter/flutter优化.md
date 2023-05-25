## 使用const

```dart
child: const Text('加 const');
 
// VS
 
child: Text('不加 const');
```

1. 当我们调用 setState() 后，Flutter 会调用 build 方法，并且 rebuild 其中的每一个组件，避免全部重新构建的方法就是用 const。
2. 如果一个组件更新频繁（比如动画），用 const 后可以减少垃圾回收。