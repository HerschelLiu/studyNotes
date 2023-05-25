# 获取设备信息

## 获取屏幕宽度、高度

```dart
MediaQuery.of(context).size // (w, h)
MediaQuery.of(context).size.width
MediaQuery.of(context).size.height
```



## 获取状态栏、底部安全区域高度、安全区域

```dart
MediaQuery.of(context).padding.top
MediaQuery.of(context).padding.bottom
```

```dart
SafeArea(
  top: false,
  bottom: true,
  left: true,
  right: false,
  child:
)
```



## 完全被系统UI(通常是设备的键盘)遮挡的显示部分

`MediaQuery.of(context).viewInsets`

## 移除元素的pandding

需要注意要指定移除哪个方向的padding，例如移除上面的padding

```dart
MediaQuery.removePadding(
    removeTop: true,
    context: context,
    child: ,
)
```

# 布局

## Expanded

Expanded这个控件会填充满整个父控件剩余空间。

## GridView 宫格布局

默认所有的子项宽高相同，如需不相同，Pub上有一个包“flutter_staggered_grid_view” ，它实现了一个交错GridView的布局模型，可以很轻松的实现这种布局

![](img\2.png)