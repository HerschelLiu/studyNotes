[TOC]

## Flutter环境配置

国内Flutter镜像目前常用的有两个，一个是Flutter官方社区中国镜像，另外一个是上海交通大学Linux用户组的镜像，下面使用Flutter官方中国镜像搭建Flutter开发环境。

**Flutter官方社区镜像**

```bash
FLUTTER_STORAGE_BASE_URL: https://storage.flutter-io.cn
PUB_HOSTED_URL: https://pub.flutter-io.cn
```

**上海交通大学Linux用户组的Flutter镜像**

```bash
FLUTTER_STORAGE_BASE_URL: https://mirrors.sjtug.sjtu.edu.cn
PUB_HOSTED_URL: https://dart-pub.mirrors.sjtug.sjtu.edu.cn
```

**配置环境变量**

*Windows*

(1). 打开 计算机 -> 属性 -> 高级系统设置 -> 环境变量，打开环境变量设置框；

(2). 在用户变量下，选择 新建环境变量， 添加下面两个环境变量:

变量名 -> 值

```
FLUTTER_STORAGE_BASE_URL  ->  https://storage.flutter-io.cn
PUB_HOSTED_URL  ->   https://pub.flutter-io.cn
```

*Linux*

(1). 打开bashrc文件：

```
vim ~/.bashrc
```

(2). 添加Flutter环境变量

```
export PUB_HOSTED_URL=https://pub.flutter-io.cnexport FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
```

(3). 保存并刷新配置文件

```
source ~/.bashrc
```

MacOS

(1). 打开bash_profile文件

```
vim ~/.bash_profile
```

(2). 添加Flutter环境变量

```
export PUB_HOSTED_URL=https://pub.flutter-io.cnexport FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
```

(3) 保存并刷新配置文件

```
source ~/.bash_profile
```

## 零散知识

### `?`在左边为null的情况下，会阻断右边的调用；`？？`主要作用时在左侧表达式为bull的时候，为其设置默认值

### 资源文件assets

Flutter中assets可以是任意类型的文件，不仅仅是图片，assets放置的路径也可以自定义（但需要在lib目录下）

### 组件状态修改

Flutter中组件状态的改变，一定要配合使用setState，通过调用setState方法，Flutter会在底层标记Widget的状态，随后触发重建。

## Widget

* StatefulWidget：带绑定状态；有一些Widget（比如Image，Checkbox），除了父Widget初始化时传入的静态值以外，还需要处理用户的交互或数据变化，在Widget呗创建完成之后，还需要关心以及相应数据改变带来的Widget的重新渲染
* StatelessWidget：不带绑定状态

**不同**：StatelessWidget时通过build直接构建的，StatefulWidget没有build方法，耳式通过createState创建一个state对象

## Flutter生命周期

创建（插入视图树）、更新（在视图中）、销毁（从视图树中移除）

## App生命周期

```dart
abstract class WidgetsBindingObserver{
    // 页面pop
    Future<bool> didPopRoute() => Future<bool>.value(false);
    // 页面push
    Future<bool> didPushRoute(String route) => Future<bool>.value(false);
    // 系统窗口相关改变回调，如选装
    void didChangeMetrics() {}
    // 文本缩放系数变化
    void didChangeTextScaleFactor() {}
    // 系统亮度变化
    void didChangePlatformBrightness() {}
    // 本地化语言变化
    void didChangeLocales(List<Locale> locale) {}
    // APp生命周期变化
    void didChangeAppLifecycleState(AppLifecycleState state) {}
    // 内存警告回调
    void didHaveMemoryPressure() {}
    // Accessibility 相关特性回调
    void didChangeAccessibilityFeatures() {} 
}
```

### App生命周期回调didChangeAppLifecycleState

didChangeLifecycleState有一个枚举类型的参数AppLifecycleState，它的值包括三个：resumed、inactive、pause。

- resumed：界面进入可见状态，并能够处理用户相应；
- inactive：界面进入不活动状态，无法处理用户的相应；
- paused：界面进入不可见状态，不能够处理用户相应，但在后台继续活动中。

## 编写页面

### StatelessWidget和StatefulWidget

#### 无状态（StatelessWidget)

正常编写

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Flutter Demo',
        home: Scaffold(
            appBar: AppBar(title: Text('My First Flutter App')),
            body: Center(
                child: Column(children: <Widget>[
              ListView(
                      scrollDirection: Axis.horizontal,
                      children: <Widget>[
                        Container(width: 180.0, color: Colors.lightBlue),
                        Container(width: 180.0, color: Colors.yellow),
                        Container(width: 180.0, color: Colors.orange),
                        Container(width: 180.0, color: Colors.deepPurple),
                      ],
                    )
            ]))));
  }
}
```

自定义组件调用

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Flutter Demo',
        home: Scaffold(
            appBar: AppBar(title: Text('My First Flutter App')),
            body: Center(
                child: Column(children: <Widget>[
              MyList()
            ]))));
  }
}

class MyList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView(
      scrollDirection: Axis.horizontal,
      children: <Widget>[
        Container(width: 180.0, color: Colors.lightBlue),
        Container(width: 180.0, color: Colors.yellow),
        Container(width: 180.0, color: Colors.orange),
        Container(width: 180.0, color: Colors.deepPurple),
      ],
    );
  }
}
```

#### 有状态（StatefulWidget）

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Flutter Demo',
        home: Scaffold(
            appBar: AppBar(title: Text('My First Flutter App')),
            body: Center(
                child: Column(children: <Widget>[
              Text('checkbox和switch', style: TextStyle(fontSize: 32.0)),
              SwitchAndCheckboxTestRoute(title: 'this is text')
            ]))));
  }
}

class SwitchAndCheckboxTestRoute extends StatefulWidget {
  SwitchAndCheckboxTestRoute({Key key, this.title}) : super(key: key);
  final String title;
  @override
  _SwitchAndCheckboxTestRoute createState() =>
      new _SwitchAndCheckboxTestRoute();
}

class _SwitchAndCheckboxTestRoute extends State<SwitchAndCheckboxTestRoute> {
  bool _switchSelect = true;
  bool _checkboxSelected = true;

  @override
  Widget build(BuildContext context) {
    return Column(children: <Widget>[
      Text(widget.title),
      Switch(
          value: _switchSelect,
          onChanged: (value) {
            setState(() {
              this._switchSelect = value;
            });
          }),
      Checkbox(
          value: _checkboxSelected,
          activeColor: Colors.red,
          onChanged: (value) {
            setState(() {
              _checkboxSelected = value;
            });
          })
    ]);
  }
}
```

分为三个位置，第一个位置就是`MyApp`中调用`SwitchAndCheckboxTestRoute`，第二个部分为`class SwitchAndCheckboxTestRoute extends StatefulWidget`,不同于无状态，直接在里面写样式，有状态需要再调用以`_` + 同名类里面写样式

在`MyApp`中调用`SwitchAndCheckboxTestRoute`并传值，`SwitchAndCheckboxTestRoute`中接收，`_SwitchAndCheckboxTestRoute`中以`widget.`的方式调用

## Scaffold

一个完整的路由页可能会包含导航栏、抽屉菜单(Drawer)以及底部Tab导航菜单等。如果每个路由页面都需要开发者自己手动去实现这些，这会是一件非常麻烦且无聊的事。幸运的是，Flutter Material组件库提供了一些现成的组件来减少我们的开发任务。`Scaffold`是一个路由页的骨架，我们使用它可以很容易地拼装出一个完整的页面。

| 组件名称             | 解释           |
| -------------------- | -------------- |
| AppBar               | 一个导航栏骨架 |
| MyDrawer             | 抽屉菜单       |
| BottomNavigationBar  | 底部导航栏     |
| FloatingActionButton | 漂浮按钮       |

### AppBar

顶部标题栏

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(title: 'Flutter Demo', home: MyHome());
  }
}

class MyHome extends StatefulWidget {
  @override
  _MyHomeState createState() => _MyHomeState();
}

class _MyHomeState extends State<MyHome> {
  int _activeIndex = 0;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My App Home'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.share),
            onPressed: () {
              print('share');
            },
          )
        ],
      ),
    );
  }
}
```

#### TabBar

使用bottom属性搭建顶部tab切换栏

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(title: 'Flutter Demo', home: MyHome());
  }
}

class MyHome extends StatefulWidget {
  @override
  _MyHomeState createState() => _MyHomeState();
}

class _MyHomeState extends State<MyHome> with SingleTickerProviderStateMixin {
  int _activeIndex = 0;
  TabController _tabController;
  List tabs = ['历史', '新闻', '图片'];
  @override
  void initState() {
    _tabController = TabController(length: tabs.length, vsync: this);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    void _changeBottomNav(int index) {
      setState(() {
        _activeIndex = index;
      });
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('My App Home'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.share),
            onPressed: () {
              print('share');
            },
          )
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: tabs.map((e) => Tab(text: e)).toList()
        ),
      ),
    );
  }
}

```

* 页面必须继承StatefulWidget

* 页面必须实现SingleTickerProviderStateMixin(`class _MyHomeState extends State<MyHome> with SingleTickerProviderStateMixin`)

* 页面初始化时实例化TabController，并指定tab长度

  ```dart
  TabController _tabController;
  @override
  void initState() {
      _tabController = TabController(length: tabs.length, vsync: this);
      super.initState();
  }
  ```

* 在TabBar组件中指定controller为我们实例化的TabController

  ```dart
  // 1.可以如例子一样
  // 2.如下
  bottom: TabBar(
      controller: _tabController,
      tabs: <Widget>[
          Tab(text: '推荐',),
          Tab(text: '丽人',),
          Tab(text: '旅行',),
          Tab(text: '电影',),
          Tab(text: '结婚',),
          Tab(text: '购物',),
          Tab(text: '教培',),
          Tab(text: '家装',),
          Tab(text: '亲子',),
      ],
  ),
  ```

  Tab组件有三个可选参数

  ```dart
  Tab({
    Key key,
    this.text, // 菜单文本
    this.icon, // 菜单图标
    this.child, // 自定义组件样式
  })
  ```

  **注：**刚创建完，运行可能会报`no TabController for TabBar`,重新`flutter run`即可

#### TabBarView

通过`TabBar`我们只能生成一个静态的菜单，真正的Tab页还没有实现。由于`Tab`菜单和Tab页的切换需要同步，我们需要通过`TabController`去监听Tab菜单的切换去切换Tab页，代码如：

```dart
// 在Widget build() {}中 _tabController.index从0开始
_tabController.addListener((){  
  switch(_tabController.index){
    case 1: ...;
    case 2: ... ;   
  }
});
```

如果我们Tab页可以滑动切换的话，还需要在滑动过程中更新TabBar指示器的偏移！显然，要手动处理这些是很麻烦的，为此，Material库提供了一个`TabBarView`组件，通过它不仅可以轻松的实现Tab页，而且可以非常容易的配合TabBar来实现同步切换和滑动状态同步，示例如下：

```dart
Scaffold(
  appBar: AppBar(
    ... //省略无关代码
    bottom: TabBar(
      controller: _tabController,
      tabs: tabs.map((e) => Tab(text: e)).toList()),
  ),
  body: TabBarView(
    controller: _tabController,
    children: tabs.map((e) { //创建3个Tab页
      return Container(
        alignment: Alignment.center,
        child: Text(e, textScaleFactor: 5),
      );
    }).toList(),
  ),
  ... // 省略无关代码  
)
```

`TabBar`和`TabBarView`正是通过同一个`controller`来实现菜单切换和滑动状态同步的

### 抽屉菜单Drawer

`Scaffold`的`drawer`和`endDrawer`属性可以分别接受一个Widget来作为页面的左、右抽屉菜单。如果开发者提供了抽屉菜单，那么当用户手指从屏幕左（或右）侧向里滑动时便可打开抽屉菜单

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(title: 'Flutter Demo', home: MyHome());
  }
}

class MyHome extends StatefulWidget {
  @override
  _MyHomeState createState() => _MyHomeState();
}

class _MyHomeState extends State<MyHome> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        drawer: MyDrawer(),
        )
     }
  }

class MyDrawer extends StatelessWidget {
  const MyDrawer({Key key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: SafeArea(
        top: false,
        child: Container(
          color: Colors.yellowAccent,
          child: Column(
            children: <Widget>[
              Container(
                height: 50.0 + MediaQuery.of(context).padding.top,
                color: Colors.blue
              )
            ]
          ),
        )
      )
    );
  }
}

```

SafeArea安全区域，`MediaQuery.of(context).padding.top`获取状态栏高度

### BottomNavigationBar

底部tab切换栏

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(title: 'Flutter Demo', home: MyHome());
  }
}

class MyHome extends StatefulWidget {
  @override
  _MyHomeState createState() => _MyHomeState();
}

class _MyHomeState extends State<MyHome> {
  int _activeIndex = 0;
  @override
  Widget build(BuildContext context) {
    void _changeBottomNav(int index) {
      setState(() {
        _activeIndex = index;
      });
    }
    return Scaffold(
      bottomNavigationBar: BottomNavigationBar(
        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home), title: Text('Home')),
          BottomNavigationBarItem(
              icon: Icon(Icons.business), title: Text('Business')),
          BottomNavigationBarItem(
              icon: Icon(Icons.school), title: Text('School')),
        ],
        currentIndex: _activeIndex, // 当前选中
        fixedColor: Colors.green, // 选中颜色
        onTap: _changeBottomNav, // 点击事件
      ),
    );
  }
}
```

点击事件可以使用一个void的函数，写在Widget build中

#### 使用BottomAppBar和FloatingActionButton实现中间凹陷的导航栏

![](img\1.png)

Material组件库中提供了一个`BottomAppBar` 组件，它可以和`FloatingActionButton`配合实现这种“打洞”效果

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(title: 'Flutter Demo', home: MyHome());
  }
}

class MyHome extends StatefulWidget {
  @override
  _MyHomeState createState() => _MyHomeState();
}

class _MyHomeState extends State<MyHome>{
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        floatingActionButton: FloatingActionButton(
          onPressed: null
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
        bottomNavigationBar: BottomAppBar(
          color: Colors.white,
          shape: CircularNotchedRectangle(), // 底部导航栏打一个圆形的洞
          child: Row(
            children: <Widget>[
              IconButton(icon: Icon(Icons.home)),
              SizedBox(), //中间位置空出
              IconButton(icon: Icon(Icons.business))
            ],
            mainAxisAlignment: MainAxisAlignment.spaceAround,
          ),
        ),
  }
}
```

可以看到，上面代码中没有控制打洞位置的属性，实际上，打洞的位置取决于`FloatingActionButton`的位置，上面`FloatingActionButton`的位置在正中间，所以打洞位置就在正中间。`BottomAppBar`的`shape`属性决定洞的外形，`CircularNotchedRectangle`实现了一个圆形的外形

### 裁剪（Clip）

| 剪裁Widget | 作用                                                     |
| ---------- | -------------------------------------------------------- |
| ClipOval   | 子组件为正方形时剪裁为内贴圆形，为矩形时，剪裁为内贴椭圆 |
| ClipRRect  | 将子组件剪裁为圆角矩形                                   |
| ClipRect   | 剪裁子组件到实际占用的矩形大小（溢出部分剪裁）           |

```dart
ClipRect(
	child: 
)
```



#### 自定义裁剪(CustomClipper)

```dart
class MyClipper extends CustomClipper<Rect> {
  @override
  Rect getClip(Size size) => Rect.fromLTWH(10.0, 15.0, 40.0, 30.0);

  @override
  bool shouldReclip(CustomClipper<Rect> oldClipper) => false;
}
```

- `getClip()`是用于获取剪裁区域的接口，由于图片大小是60×60，我们返回剪裁区域为`Rect.fromLTWH(10.0, 15.0, 40.0, 30.0)`，及图片中部40×30像素的范围。
- `shouldReclip()` 接口决定是否重新剪裁。如果在应用中，剪裁区域始终不会发生变化时应该返回`false`，这样就不会触发重新剪裁，避免不必要的性能开销。如果剪裁区域会发生变化（比如在对剪裁区域执行一个动画），那么变化后应该返回`true`来重新执行剪裁。

然后再需要的地方使用`MyClipper()`

```dart
DecoratedBox(
  decoration: BoxDecoration(
    color: Colors.red
  ),
  child: ClipRect(
      clipper: MyClipper(), //使用自定义的clipper
      child: avatar
  ),
)
```

## 文件操作

Dart的IO库包含了文件读写的相关类

Android和iOS的应用存储目录不同，[`PathProvider`](https://pub.dartlang.org/packages/path_provider) 插件提供了一种平台透明的方式来访问设备文件系统上的常用位置。

```dart
import 'dart:io';
import 'dart:async'; // 异步相关
import 'package:path_provider/path_provider.dart';
```

## 网络请求

依赖Dart的IO库和需要同时引用`dart:convert`，用于解码（JSON String -> Object;UTF-8;stream）和编码(Object -> JSON String;UTF-8)

### HttpClient

https://book.flutterchina.club/chapter11/http.html

### Http请求-Dio http库

直接使用HttpClient发起网络请求是比较麻烦的，很多事情得我们手动处理，如果再涉及到文件上传/下载、Cookie管理等就会非常繁琐。幸运的是，Dart社区有一些第三方http请求库，用它们来发起http请求将会简单的多

https://book.flutterchina.club/chapter11/dio.html

## 实操

在项目根目录下分别创建“imgs”和“fonts”文件夹，前者用于保存图片，后者用于保存Icon文件。由于在网络数据传输和持久化时，我们需要通过Json来传输、保存数据；但是在应用开发时我们又需要将Json转成Dart Model类，所以，我们需要在根目录下再创建一个用于保存Json文件的“jsons”文件夹。

```shell
# 初始
项目名
├── android
├── ios
├── lib
└── test

#根目录
项目名
├── android
├── fonts
├── i10n-arb
├── imgs
├── ios
├── jsons
├── lib
└── test

#由于我们的Dart代码都在“lib”文件夹下，笔者根据技术选型和经验在lib文件下创建了如下目录：
lib
├── common
├── i10n
├── models
├── states
├── routes
└── widgets
```

| 文件夹  | 作用                                                         |
| ------- | ------------------------------------------------------------ |
| common  | 一些工具类，如通用方法类、网络接口类、保存全局变量的静态类等 |
| i10n    | 国际化相关的类都在此目录下                                   |
| models  | Json文件对应的Dart Model类会在此目录下                       |
| states  | 保存APP中需要跨组件共享的状态类                              |
| routes  | 存放所有路由页面类                                           |
| widgets | APP内封装的一些Widget组件都在该目录下                        |

看简书，发现了另外的文件结构，感觉不错

```
项目名
├── android
├── assets // 资源文件
|	├── 页面
|	|	└── 文件
|	└── ...
├── ios
├── lib
|	├── 页面名
|	|	├── 页面名_widget.dart
|	|	└──	controllers
|	|		├─ 控制器名字_controller.dart
|	|		└── ...
|	├── ...
|	└── main.dart
└── test
```

## 全局共享数据

在任意目录（一般是lib或根目录）创建common文件夹，并创建global.dart

### 共享数据

```dart
class Global {
    String title
    ...
}
```

### 跨组件状态共享(Provider)

使用provider包

https://pub.dev/packages/provider

1. 有状态组件中的data值可以被多次修改，但是直接修改data值并不会重新被build渲染一遍，而必须调用setState()函数才能重新渲染。`setState((){...})`
2. 每渲染一次，都会调用一次build函数，也都会调用一次这个生命周期函数didUpdateWidget()。
3. 每次didUpdateWidget()的调用，都意味着MyStatefulWidget整个有状态组件将被重新渲染一遍。
4. 正如第3条所理解，这意味着，如果Column容器中有无数个Text(data)的兄弟组件，每次didUpdateWidget()的调用，都会将其所有组件重新渲染一遍，这对性能有一定的影响。
5. 然而，我们只是修改了Text(data)中的data数据，没必要带上其他的组件一起渲染吧，那么如何解决这问题呢？**这回Provider包就起作用了**。

这里的 Model 实际上就是我们的状态，它不仅储存了我们的数据模型，而且还包含了更改数据的方法，并暴露出它想要暴露出的数据。

```dart
import 'package:flutter/material.dart';

class CounterModel with ChangeNotifier { // 这里使用了 mixin 混入了 ChangeNotifier，这个类能够帮驻我们自动管理所有听众。
  int _count = 0;
  int get value => _count; // 下划线代表私有。通过 get value 把 _count 值暴露出来

  void increment() {
    _count++;
    notifyListeners(); // 当调用 notifyListeners() 时，它会通知所有听众进行刷新。
  }
}
```

**1.创建顶层共享数据**

我们在 main 方法中初始化全局数据。

```dart
void main() {
  final counter = CounterModel();
  final textSize = 48;

  runApp(
    Provider<int>.value(
      value: textSize,
      child: ChangeNotifierProvider.value(
        value: counter,
        child: MyApp(),
      ),
    ),
  );
}
```

通过 `Provider<T>.value` (<T>代表数据类型，可省略)能够管理一个恒定的数据，并提供给子孙节点使用。我们只需要将数据在其 value 属性中声明即可。

而 `ChangeNotifierProvider.value` 不仅能够提供数据供子孙节点使用，还可以在数据改变的时候通知所有听众刷新。(通过之前我们说过的 `notifyListeners`)

除了上述几个属性之外 `Provider.value` 还提供了 `UpdateShouldNotify` Function，用于控制刷新时机。

**2.在子页面中获取状态**

第一种方式`Provider.of(context);`

```dart
class FirstScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final _counter = Provider.of<CounterModel>(context);
    final textSize = Provider.of<int>(context).toDouble();

    return Scaffold(
      appBar: AppBar(
        title: Text('FirstPage'),
      ),
      body: Center(
        child: Text(
          'Value: ${_counter.value}',
          style: TextStyle(fontSize: textSize),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.of(context)
            .push(MaterialPageRoute(builder: (context) => SecondPage())),
        child: Icon(Icons.navigate_next),
      ),
    );
  }
}

///作者：Vadaski
///链接：https://juejin.im/post/5d00a84fe51d455a2f22023f
///来源：掘金
///著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

获取顶层数据最简单的方法就是 `Provider.of(context);`<T> 指定了获取 **FirstScreen** 向上寻找最近的储存了 T 的祖先节点的数据。我们通过这个方法获取了顶层的 CounterModel 及 textSize。并在 Text 组件中进行使用。

第二种方式Consumer

```dart
class SecondPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Second Page'),
      ),
      body: Consumer2<CounterModel,int>(
        builder: (context, CounterModel counter, int textSize, _) => Center(
              child: Text(
                'Value: ${counter.value}',
                style: TextStyle(
                  fontSize: textSize.toDouble(),
                ),
              ),
            ),
      ),
      floatingActionButton: Consumer<CounterModel>(
        builder: (context, CounterModel counter, child) => FloatingActionButton(
              onPressed: counter.increment,
              child: child,
            ),
        child: Icon(Icons.add),
      ),
    );
  }
}

作者：Vadaski
链接：https://juejin.im/post/5d00a84fe51d455a2f22023f
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

在这个页面中，我们有两处使用到了公共 Model。

- 应用中心的文字：使用 CounterModel 在 Text 中展示文字，以及通过 textSize 定义自身的大小。一共使用到了两个 Model。
- 浮动按钮：使用 CounterModel 的 `increment` 方法触发计数器的值增加。使用到了一个 Model。

Consumer 的 builder 实际上就是一个 Function，它接收三个参数 `(BuildContext context, T model, Widget child)`。

`Consumer` 就是通过 `Provider.of(context)` 来实现的。但是从实现来讲 `Provider.of(context)` 比 `Consumer` 简单好用太多，为啥我要搞得那么复杂捏。

实际上 `Consumer` 非常有用，它的经典之处在于能够在复杂项目中，**极大地缩小你的控件刷新范围**。`Provider.of(context)` 将会把调用了该方法的 context 作为听众，并在 `notifyListeners` 的时候通知其刷新。

**优雅地处理多个 Provider**

```dart
void main() {
  final counter = CounterModel();
  final textSize = 48;

  runApp(
    MultiProvider(
      providers: [
        Provider.value(value: textSize),
        ChangeNotifierProvider.value(value: counter)
      ],
      child: MyApp(),
    ),
  );
}
```

