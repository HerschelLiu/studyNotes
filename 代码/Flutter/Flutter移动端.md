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

(3).  “系统变量” 那部分点击 “新建”,给新建的环境变量命名为 “FLUTTER_HOME” ，将复制的flutter的安装路径粘贴进去（到bin文件夹下）;点击 “确定” 保存新建的环境变量，然后找到 “Path” 那一栏，点击 “编辑” ，增加`%FLUTTER_HOME%`，点击 “确定”.剩下的窗口全部点击 “确定” ，至此，就成功将flutter添加到系统环境变量中了

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

### `?`在左边为null的情况下，会阻断右边的调用；`？？`主要作用是在左侧表达式为null的时候，为其设置默认值

### 资源文件assets

Flutter中assets可以是任意类型的文件，不仅仅是图片，assets放置的路径也可以自定义（但需要在lib目录下）

### 组件状态修改

Flutter中组件状态的改变，一定要配合使用setState，通过调用setState方法，Flutter会在底层标记Widget的状态，随后触发重建。

## Widget

* StatefulWidget：带绑定状态；有一些Widget（比如Image，Checkbox），除了父Widget初始化时传入的静态值以外，还需要处理用户的交互或数据变化，在Widget被创建完成之后，还需要关心以及相应数据改变带来的Widget的重新渲染
* StatelessWidget：不带绑定状态

**不同**：StatelessWidget是通过build直接构建的，StatefulWidget没有build方法，而是通过createState创建一个state对象

### TextField(文本输入框)

```dart
TextEditingController xxxController = TextEditingController();
FocusNode xxxFocusNode = FocusNode();

const TextField({
    Key key,
    this.controller,    //编辑框的控制器，跟文本框的交互一般都通过该属性完成，如果不创建的话默认会自动创建,controller: xxxController
    this.focusNode,  //用于管理焦点,focusNode: xxxFocusNode
    this.decoration = const InputDecoration(),   //输入框的装饰器，用来修改外观
    TextInputType keyboardType,   //设置输入类型，不同的输入类型键盘不一样
    this.textInputAction,   //用于控制键盘动作（一般位于右下角，默认是完成）
    this.textCapitalization = TextCapitalization.none,
    this.style,    //输入的文本样式
    this.textAlign = TextAlign.start,   //输入的文本位置
    this.textDirection,    //输入的文字排列方向，一般不会修改这个属性
    this.autofocus = false,   //是否自动获取焦点
    this.obscureText = false,   //是否隐藏输入的文字，一般用在密码输入框中
    this.autocorrect = true,   //是否自动校验
    this.maxLines = 1,   //最大行
    this.maxLength,   //能输入的最大字符个数
    this.maxLengthEnforced = true,  //配合maxLength一起使用，在达到最大长度时是否阻止输入
    this.onChanged,  //输入文本发生变化时的回调
    this.onEditingComplete,   //点击键盘完成按钮时触发的回调，该回调没有参数，(){}
    this.onSubmitted,  //同样是点击键盘完成按钮时触发的回调，该回调有参数，参数即为当前输入框中的值。(String){}
    this.inputFormatters,   //对输入文本的校验
    this.enabled,    //输入框是否可用
    this.cursorWidth = 2.0,  //光标的宽度
    this.cursorRadius,  //光标的圆角
    this.cursorColor,  //光标的颜色
    this.keyboardAppearance,
    this.scrollPadding = const EdgeInsets.all(20.0),
    this.dragStartBehavior = DragStartBehavior.down,
    this.enableInteractiveSelection,
    this.onTap,    //点击输入框时的回调(){}
    this.buildCounter,
  })
```

**注：**

1. `xxxController.value.text`输入框内的值
2. `xxxController.clear()`清空输入框内容
3. `xxxFocusNode.unfocus()`失去焦点

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
    // App生命周期变化
    void didChangeAppLifecycleState(AppLifecycleState state) {}
    // 内存警告回调
    void didHaveMemoryPressure() {}
    // Accessibility 相关特性回调
    void didChangeAccessibilityFeatures() {} 
}
```

### App生命周期回调didChangeAppLifecycleState

didChangeLifecycleState有一个枚举类型的参数AppLifecycleState，它的值包括三个：resumed、inactive、pause。

- resumed：界面进入可见状态，并能够处理用户响应；
- inactive：界面进入不活动状态，无法处理用户的响应；
- paused：界面进入不可见状态，不能够处理用户响应，但在后台继续活动中。

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

class _MyHomeState extends State<MyHome> with SingleTickerProviderStateMixin {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        drawer: MyDrawer(),
        )
     }
  }

class MyDrawer extends StatelessWidget {
  const MyDrawer({Key key}) : super(key: key);

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

import 'views/home/home.dart';
import 'views/my/my.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Test', 
      theme: ThemeData(
        primarySwatch: Colors.green,
        // 点击水波纹效果
        splashColor: Colors.transparent
      ),
      home: const MyStackPage()
    );
  }
}

class MyStackPage extends StatefulWidget {
  const MyStackPage({super.key});

  @override
  State<MyStackPage> createState() => _MyStackPageState();
}

class _MyStackPageState extends State<MyStackPage> {
  int _currentIndex = 0;
  
  // 接口位置
  @override
  void initState() async {
    super.initState();
    final data = await ServiceNetApi()
        .getList(RequestGetListModel(start: 0, count: 20).toJson());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        bottomNavigationBar: BottomNavigationBar(
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.person), label: 'My')
          ],
          currentIndex: _currentIndex,
          onTap: (int value) => setState(() {
            _currentIndex = value;
          }),
        ),
        body: IndexedStack(
          index: _currentIndex,
          children: const [
            Home(),
            My()
          ],
        )
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

class _MyHomeState extends State<MyHome> with SingleTickerProviderStateMixin {
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

## 路由

示例

```dart
// main.dart
import 'dart:html';

import 'package:flutter/material.dart';
import 'package:flutter_application_1/newRoute.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headline4,
            ),
            FlatButton(
              onPressed: () {
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => NewRoute()));
              },
              child: Text('open new route'),
              textColor: Colors.red,
            )
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ),
    );
  }
}
```

```dart
// newRoute.dart
import 'package:flutter/material.dart';

class NewRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('New Route'),
      ),
      body: Center(
        child: Text('This is new route'),
      ),
    );
  }
}

```

### MaterialPageRoute

`MaterialPageRoute`继承自`PageRoute`类，`PageRoute`类是一个抽象类，表示占有整个屏幕空间的一个模态路由页面，它还定义了路由构建及切换时过渡动画的相关接口及属性。`MaterialPageRoute` 是Material组件库提供的组件，它可以针对不同平台，实现与平台页面切换动画风格一致的路由切换动画：

```dart
  MaterialPageRoute({
    WidgetBuilder builder,
    RouteSettings settings, // 包含路由的配置信息，如路由名称、是否初始路由（首页）。
    bool maintainState = true, // 默认情况下，当入栈一个新路由时，原来的路由仍然会被保存在内存中，如果想在路由没用的时候释放其所占用的所有资源，可以设置maintainState为false。
    bool fullscreenDialog = false, // 表示新的路由页面是否是一个全屏的模态对话框，在iOS中，如果fullscreenDialog为true，新页面将会从屏幕底部滑入（而不是水平方向）。
  })
```

如果想自定义路由切换动画，可以自己继承PageRoute来实现

### Navigator

**注：类比小程序跳转方式：**

* push/pushNamed-navigateTo

* pop-navigateBack

* replace/popAndPushNamed-redirectTo

* pushAndRemoveUntil/pushNamedAndRemoveUntil: 

  * reLaunch：在App里，有一个普遍存在的场景，即打开一个App之后，会出现App的启动页，然后进入欢迎页面，最后才是首页。在这种情况下，用户选择返回，是应该从首页退出App的，而不是再次倒退到欢迎页和启动页。这个时候，pushNamedAndRemoveUntil方法就派上用场了。我们可以通过以下的方式调用，让整个路由栈里只存在一个界面，调用代码如下：

    `Navigator.of(context).pushNamedAndRemoveUntil('/homepage',((Route route) => false route)=>false);`(Route route) => false，这样能保证把之前所有的路由都进行删除，然后才push新的路由。（判断Until所结束的时机，如果为false的话，就会一直继续执行Remove的操作，直到为true的时候，停止Remove操作，然后才执行push操作）

  * 如果想在弹出新路由之前，删除路由栈中的部分路由。利用ModalRoute.withName(name)，来执行判断，可以看下面的源码，当所传的name跟堆栈中的路由所定义的时候，会返回true值，不匹配的话，则返回false。例：[screen1, sceen2,screen3] => [screen1, screen4]

    ```dart
    Navigator.of(context).pushNamedAndRemoveUntil('/screen4',ModalRoute.withName('/screen1'));
     
     //ModalRoute.withName的源码
       static RoutePredicate withName(String name) {
        return (Route<dynamic> route) {
          return !route.willHandlePopInternally
              && route is ModalRoute
              && route.settings.name == name;
        };
      }
    
    ————————————————
    版权声明：本文为CSDN博主「入魔的冬瓜」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
    原文链接：https://blog.csdn.net/weixin_34999505/article/details/86760606
    ```

    

***

* `Future push(BuildContext context, Route route)`: 入栈（打开新的页面）

* `bool pop(BuildContext context, [ result ])`: 出栈（关闭页面），`result`为页面关闭时返回给上一个页面的数据。又打开此页面的push方法的返回值为result（**非命名路由传值方式**），此方式点击自带返回不能传值给上一页，只能在使用pop()方法才能。

  ```dart
  // A页面 
  var result = await Navigator.push(context, MaterialPageRoute(builder: (context) => NewRoute(text: '我是传入的参数')))
  
  // B页面
  class NewRoute extends StatelessWidget {
     // 接收一个text参数 @required为必传
    NewRoute({ Key key, @required this.text }) : super(key: key);
    final String text;
  
    @override
    Widget build(BuildContext context) {
      return Scaffold(
        appBar: AppBar(
          title: Text("提示"),
        ),
        body: Padding(
          padding: EdgeInsets.all(18),
          child: Center(
            child: Column(
              children: <Widget>[
                Text(text),
                RaisedButton(
                  onPressed: () => Navigator.pop(context, "我是返回值"),
                  child: Text("返回"),
                )
              ],
            ),
          ),
        ),
      );
    }
  }
  ```

  

* `Navigator.replace`,`Navigator.popUntil`等

#### MaterialPageRoute

```dart
MaterialPageRoute({
  WidgetBuilder builder,
  RouteSettings settings,
  bool maintainState = true,
  bool fullscreenDialog = false,
})
```

- `builder` 是一个WidgetBuilder类型的回调函数，它的作用是构建路由页面的具体内容，返回值是一个widget。我们通常要实现此回调，返回新路由的实例。
- `settings` 包含路由的配置信息，如路由名称、是否初始路由（首页）。
- `maintainState`：默认情况下，当入栈一个新路由时，原来的路由仍然会被保存在内存中，如果想在路由没用的时候释放其所占用的所有资源，可以设置`maintainState`为false。
- `fullscreenDialog`表示新的路由页面是否是一个全屏的模态对话框，在iOS中，如果`fullscreenDialog`为`true`，新页面将会从屏幕底部滑入（而不是水平方向）。

### 命名路由

```dart
MaterialApp(
  title: 'Flutter Demo',
  initialRoute:"/", //名为"/"的路由作为应用的首页.该属性决定应用的初始路由页是哪一个命名路由
  theme: ThemeData(
    primarySwatch: Colors.blue,
  ),
  //注册路由表
  routes:{
   "new_page":(context) => NewRoute(),
   "/":(context) => MyHomePage(title: 'Flutter Demo Home Page'), //注册首页路由
  },
  // 当没有路由可以匹配
  onUnknownRoute: (RouteSettings setting) {
    String name = setting.name;
    print("onUnknownRoute:$name");
    return new MaterialPageRoute(builder: (context) {
      return new NotFoundPage();
    });
  },
);
```

通常路径名使用路径结构`/A/B/C`

```dart
routes: {
    '/': (context) => FirstPage(),
    '/second': (context) => SecondPage()
}
```



#### 通过路由名打开新路由页

要通过路由名称来打开新路由，可以使用`Navigator` 的`pushNamed`方法：

```dart
Future pushNamed(BuildContext context, String routeName,{Object arguments})
```

`Navigator` 除了`pushNamed`方法，还有`pushReplacementNamed`等其他管理命名路由的方法

```dart
// main.dart
import 'package:flutter/material.dart';
import 'package:flutter_application_1/newRoute.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        // home: MyHomePage(title: 'Flutter Demo Home Page'),
        // # 注册路由表
        routes: {
          'new_page': (context) => NewRoute(),
          '/': (context) => MyHomePage(title: 'Flutter Demo Home Page')
        });
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headline4,
            ),
            // ignore: deprecated_member_use
            FlatButton(
              onPressed: () {
                // # 路由名跳页及传参， arguments这个是固定的key，不是自定义的名
                // 接值需要用ModalRoute.of(context).settings.arguments获取
                Navigator.pushNamed(context, 'new_page', arguments: "hi");
                // 另一种写法 Navigator.of(context).pushNamed('new_page', arguments: 'hello');
              },
              child: Text('open new route'),
              textColor: Colors.red,
            )
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ),
    );
  }
}

```

```dart
// newRoute.dart
import 'package:flutter/material.dart';

class NewRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 接值
    var args = ModalRoute.of(context).settings.arguments;
    print(args);

    return Scaffold(
      appBar: AppBar(
        title: Text('New Route'),
      ),
      body: Center(
        child: Text('This is new route'),
      ),
    );
  }
}

```

### 路由生成钩子

假设我们要开发一个电商APP，当用户没有登录时可以看店铺、商品等信息，但交易记录、购物车、用户个人信息等页面需要登录后才能看。为了实现上述功能，我们需要在打开每一个路由页前判断用户登录状态

`MaterialApp`有一个`onGenerateRoute`属性，它在打开命名路由时可能会被调用，之所以说可能，是因为当调用`Navigator.pushNamed(...)`打开命名路由时，如果指定的路由名在路由表中已注册，则会调用路由表中的`builder`函数来生成路由组件；如果路由表中没有注册，才会调用`onGenerateRoute`来生成路由。

要实现上面控制页面权限的功能就非常容易：我们放弃使用路由表，取而代之的是提供一个`onGenerateRoute`回调，然后在该回调中进行统一的权限控制

```dart
MaterialApp(
  ... //省略无关代码
  onGenerateRoute: (RouteSettings settings) {
      String routeName = settings.name;
      print('routeName: $routeName');
      if (routeName == '/new_page') {
          return MaterialPageRoute(builder: (context) {
              print('this: ${settings.arguments}');
              return NewRoute(text: settings.arguments);
          });
      } else {
          return MaterialPageRoute(
              builder: (context) =>
              MyHomePage(title: 'Flutter Demo Home Page'));
      }
  },
);
```
```dart
// new_page
import 'package:flutter/material.dart';

class NewRoute extends StatelessWidget {
  NewRoute({Key key, this.text}) : super(key: key);

  final String text;
  @override
  Widget build(BuildContext context) {
    print('args: $text');

    return Scaffold(
      appBar: AppBar(
        title: Text('New Route'),
      ),
      body: Center(
        child: Text('This is new route'),
      ),
    );
  }
}

```

> 注意，`onGenerateRoute`只会对命名路由生效。
>
> 不需要设置routes
>
> 跳页直接使用命名路由的方法，即可，settings.name获取跳页时传入的路由名

### 自定义路由

如果想自定义页面的进场和出场动画，那么需要使用PageRouteBuilder来创建路由。
PageRouteBuilder是主要的部分，一个是“pageBuilder”，用来创建所要跳转到的页面，另一个是“transitionsBuilder”，也就是我们可以自定义的转场效果。

```dart
PageRouteBuilder({
    RouteSettings settings,
    @required this.pageBuilder,//构造页面
    this.transitionsBuilder = _defaultTransitionsBuilder,//创建转场动画
    this.transitionDuration = const Duration(milliseconds: 300),//转场动画的持续时间
    this.opaque = true,//是否是透明的
    this.barrierDismissible = false,//举个例子，比如AlertDialog也是利用PageRouteBuilder进行创建的，barrierDismissible若为false，点击对话框周围，对话框不会关闭；若为true，点击对话框周围，对话框自动关闭。
    this.barrierColor,
    this.barrierLabel,
    this.maintainState = true,
})
```

```dart
// 自定义跳转动画
Navigator.push(
  context,
  PageRouteBuilder(
    opaque: false,
    pageBuilder: (BuildContext context, _, __) {
      return new HomePage();
    },
    transitionsBuilder:
    (___, Animation<double> animation, ____, Widget child) {
      return FadeTransition(
        opacity: animation,
        child: RotationTransition(
          turns: Tween<double>(begin: 0.5, end: 1.0).animate(animation),
          child: child,
        ),
      );
    }));
```

## 包管理及资源管理

Flutter使用`yaml`进行包管理。默认配置文件为`pubspec.yaml`

资源管理：Flutter APP安装包中会包含代码和 assets（资源）两部分。Assets是会打包到程序安装包中的，可在运行时访问。常见类型的assets包括静态数据（例如JSON文件）、配置文件、图标和图片（JPEG，WebP，GIF，动画WebP / GIF，PNG，BMP和WBMP）等。

```yaml
name: flutter_in_action # 应用或包名称
description: First Flutter application. # 应用或包的描述、简介。

version: 1.0.0+1 # 应用或包的版本号。

dependencies: # 应用或包依赖的其它包或插件。
  flutter:
    sdk: flutter
  cupertino_icons: ^0.1.2
  pkg1:
  	path: ../../code/pkg1 # 依赖本地包
  pkg2:
  	path: packages/package1 # 假定包位于Git存储库的根目录中。如果不是这种情况，可以使用path参数指定相对位置
  	git:
  		url: git://github.com/xxx/pkg1.git # 依赖存储在Git仓库中的包

dev_dependencies: # 开发环境依赖的工具包（而不是flutter应用本身依赖的包）。
  flutter_test:
    sdk: flutter
    
flutter: # flutter相关的配置选项。
  uses-material-design: true
  assets: # 不同版本的asset可能会显示在不同的上下文中。比如一倍图（logo/logo.png)2倍图（logo/2x/logo.png)，3倍图（logo/3x/logo.png),logo/logo.png被认为是主资源，另两种被认为是一种变体。这些文件随后会与指定的asset一起被包含在asset bundle中。
  	- assets/my_icon.png # 指定应包含在应用程序中的文件(相对于pubspec.yaml文件所在的文件系统路径来标识自身的路径);asset的声明顺序是无关紧要的，asset的实际目录可以是任意文件夹;
```

### assets

#### 根据分辨率加载图片

```
/image.png
/Mx/image.png
/Nx/image.png
...etc.
```

其中M和N是数字标识符，对应于其中包含的图像的分辨率，也就是说，它们指定不同设备像素比例的图片。

```
…/my_icon.png
…/2.0x/my_icon.png
…/3.0x/my_icon.png
```

在设备像素比率为1.8的设备上，`.../2.0x/my_icon.png` 将被选择。对于2.7的设备像素比率，`.../3.0x/my_icon.png`将被选择。

如果未在`Image` widget上指定渲染图像的宽度和高度，那么`Image` widget将占用与主资源相同的屏幕空间大小。 也就是说，如果`.../my_icon.png`是72px乘72px，那么`.../3.0x/my_icon.png`应该是216px乘216px; 但如果未指定宽度和高度，它们都将渲染为72像素×72像素（以逻辑像素为单位）。

`pubspec.yaml`中asset部分中的每一项都应与实际文件相对应，但主资源项除外。当主资源缺少某个资源时，会按分辨率从低到高的顺序去选择 ，也就是说1x中没有的话会在2x中找，2x中还没有的话就在3x中找。

```dart
Widget build(BuildContext context) {
  return new DecoratedBox(
    decoration: new BoxDecoration(
      image: new DecorationImage(
        image: new AssetImage('graphics/background.png'),
      ),
    ),
  );
}

// 有些时候可能期望直接得到一个显示图片的widget，那么可以使用
Widget build(BuildContext context) {
  return Image.asset('graphics/background.png');
}
```

> new可省略
>
> `AssetImage` 并非是一个widget

#### 依赖包中的资源图片

要加载依赖包中的图像，必须给`AssetImage`提供`package`参数。

例如，假设您的应用程序依赖于一个名为“my_icons”的包，它具有如下目录结构：

- …/pubspec.yaml
- …/icons/heart.png
- …/icons/1.5x/heart.png
- …/icons/2.0x/heart.png
- …etc.

```dart
new AssetImage('icons/heart.png', package: 'my_icons')
// 或
new Image.asset('icons/heart.png', package: 'my_icons')
```

#### 特定平台 assets

上面的资源都是flutter应用中的，这些资源只有在Flutter框架运行之后才能使用，如果要给我们的应用设置APP图标或者添加启动图，那我们必须使用特定平台的assets。

#####  设置APP图标

* Android：在Flutter项目的根目录中，导航到`.../android/app/src/main/res`目录，里面包含了各种资源文件夹,只需按照[Android开发人员指南 (opens new window)](https://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher.html#size)中的说明， 将其替换为所需的资源，并遵守每种屏幕密度（dpi）的建议图标大小标准。**如果重命名.png文件，则还必须在android/app/src/main/`AndroidManifest.xml`的`<application>`标签的`android:icon`属性中更新名称。**
* IOS：在Flutter项目的根目录中，导航到`.../ios/Runner`。该目录中`Assets.xcassets/AppIcon.appiconset`已经包含占位符图片， 只需将它们替换为适当大小的图片，保留原始文件名称。

##### app启动页

* android：`.../android/app/src/main/res/drawable/launch_background.xml`,通过自定义drawable来实现自定义启动界面（你也可以直接换一张图片）。
* IOS：`.../ios/Runner/Assets.xcassets/LaunchImage.imageset`,拖入图片，并命名为`LaunchImage.png`、`LaunchImage@2x.png`、`LaunchImage@3x.png`。 如果你使用不同的文件名，那您还必须更新同一目录中的`Contents.json`文件，图片的具体尺寸可以查看苹果官方的标准。

## 状态管理

第三方pkg：provider，scoped_model, flutter_redux

## 调试

### debugger()

```dart
void someFunction(double offset) {
  debugger(when: offset > 30.0); // 可选when参数，可以指定该参数仅在特定条件为真时中断
  // ...
}
```

### `print`、`debugPrint`、`flutter logs`

Dart `print()`功能将输出到系统控制台，您可以使用`flutter logs`来查看它（基本上是一个包装`adb logcat`）。

如果你一次输出太多，那么Android有时会丢弃一些日志行。为了避免这种情况，您可以使用Flutter的`foundation`库中的[`debugPrint()` (opens new window)](https://docs.flutter.io/flutter/foundation/debugPrint.html)。 这是一个封装print，它将输出限制在一个级别，避免被Android内核丢弃。

### 调试模式断言`assert()`

```dart
String txt = 'this is string';
assert(txt == 'this is string');
```

仅在调试时输出

## 文件操作

使用PathProvider插件`path_provider: ^0.4.1`。添加后，执行`flutter packages get` 获取一下, 版本号可能随着时间推移会发生变化

## Http请求

使用Dio

```dart
dependencies:
  dio: ^x.x.x #请使用pub上的最新版本
```

使用

```dart
import 'package:dio/dio.dart';
Dio dio =  Dio();

// get
Response response;
response=await dio.get("/test?id=12&name=wendu")
print(response.data.toString());
// 等价于
response=await dio.get("/test",queryParameters:{"id":12,"name":"wendu"})
print(response);

// post
response=await dio.post("/test",data:{"id":12,"name":"wendu"})
    
// 多个请求
response= await Future.wait([dio.post("/info"),dio.get("/token")]);

// 下载
response=await dio.download("https://www.google.com/",_savePath);

// 发送FormData 如果发送的数据是FormData，则dio会将请求header的contentType设为“multipart/form-data”。
FormData formData = new FormData.from({
   "name": "wendux",
   "age": 25,
});
response = await dio.post("/info", data: formData)
// 通过FormData上传多个文件:
FormData formData = new FormData.from({
   "name": "wendux",
   "age": 25,
   "file1": new UploadFileInfo(new File("./upload.txt"), "upload1.txt"),
   "file2": new UploadFileInfo(new File("./upload.txt"), "upload2.txt"),
     // 支持文件数组上传
   "files": [
      new UploadFileInfo(new File("./example/upload.txt"), "upload.txt"),
      new UploadFileInfo(new File("./example/upload.txt"), "upload.txt")
    ]
});
response = await dio.post("/info", data: formData)
```

## 文件结构

```diff
项目
|- ...
|- assets
   |- imgs
   |- fonts // icons
|- jsons // 存json文件，以供代码中转为dart的
|- lib
   |- common // 一些工具类，如通用方法类、网络接口类、保存全局变量的静态类等
   |- models // Json文件对应的Dart Model类会在此目录下
   |- states // 保存APP中需要跨组件共享的状态类
   |- routes // 存放所有路由页面类
   |- widgets // APP内封装的一些Widget组件都在该目录下
```



## 注意

1. 最好安装Android Studio，仅安装Android SDK会有很多问题

5. padding和margin使用`EdgeInsets.`

6. 颜色使用`Color.fromRGBO()`即rgba

4. 自定义appbar

   ```dart
    Widget build(BuildContext context) {
       return Scaffold(
           appBar: AppBar(
             title: SearchBar(), // 自定义搜索组件
             backgroundColor: Colors.white,
           ),
           body: Center(child: Text('123')));
     }
   ```

5. Dart依赖包官网：

* [国外网址](https://links.jianshu.com/go?to=https%3A%2F%2Fpub.dev)
* [国内网址](https://links.jianshu.com/go?to=https%3A%2F%2Fpub.flutter-io.cn)

6. 依赖包：

* json_model：将json转为dart能使用的`flutter packages pub run json_model`
* shared_preferences：数据持久化
* device_info：设备信息
* fluro：路由框架
* provider，scoped_model, flutter_redux, fish_redux：状态管理
* fluttertoast：toast控件
* charts_flutter：图表库
* connectivity：网络监听
* table_calendar：日历组件
* webview_flutter：官方webview
* flutter_webview_plugin：第三方webvie
* flutter_screenutil：UI适配
* Flutter_keyboard_size: 可帮助获取有关 - 键盘高度、是否打开、设置 bool 值是否屏幕小等信息。

## 依赖包用法

### flutter_screenutil

[flutter_screenutil](https://github.com/OpenFlutter/flutter_screenutil/blob/master/README_CN.md)

### 属性

| 属性        | 类型              | 默认值         | 描述                                                         |
| ----------- | ----------------- | -------------- | ------------------------------------------------------------ |
| designSize  | Size              | Size(360, 690) | 设计稿中设备的尺寸(单位随意,建议dp,但在使用过程中必须保持一致) |
| builder     | Widget Function() | Container()    | 一般返回一个MaterialApp类型的Function()                      |
| orientation | Orientation       | portrait       | 屏幕方向                                                     |

**第一种**

```dart
void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    //填入设计稿中设备的屏幕尺寸,单位dp
    return ScreenUtilInit(
      designSize: Size(360, 690),
      builder: () => MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Flutter_ScreenUtil',
        theme: ThemeData(
                  primarySwatch: Colors.blue,
                  //要支持下面这个需要使用第一种初始化方式
                  textTheme: TextTheme(
                    button: TextStyle(fontSize: 45.sp)
                  ),
                ),
        home: HomePage(title: 'FlutterScreenUtil Demo'),
      ),
    );
  }
}
```

**第二种**：不支持在MaterialApp的theme的textTheme中使用字体适配

**ScreenUtil.init只需在home或者根路由（即第一个flutter页面）中调用一次即可。**

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter_ScreenUtil',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: HomePage(title: 'FlutterScreenUtil Demo'),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    //设置尺寸（填写设计中设备的屏幕尺寸）如果设计基于360dp * 690dp的屏幕
    ScreenUtil.init(
        BoxConstraints(
            maxWidth: MediaQuery.of(context).size.width,
            maxHeight: MediaQuery.of(context).size.height),
        designSize: Size(360, 690),
        orientation: Orientation.portrait);
    return Scaffold();
  }
}
```

* 宽：xxx.w(dart sdk>=2.6)/ScreenUtil().setWidth(xxx)
* 高：xxx.h(dart sdk>=2.6)/ScreenUtil().setHeight(xxx)
* 字号：xxx.sp(dart sdk>=2.6)/ScreenUtil().setSp(xxx)

```dart
// API
    ScreenUtil().setWidth(540)  (sdk>=2.6 : 540.w)   //根据屏幕宽度适配尺寸
    ScreenUtil().setHeight(200) (sdk>=2.6 : 200.h)   //根据屏幕高度适配尺寸(一般根据宽度适配即可)
    ScreenUtil().radius(200)    (sdk>=2.6 : 200.r)   //根据宽度或高度中的较小者进行调整
    ScreenUtil().setSp(24)      (sdk>=2.6 : 24.sp)   //适配字体

    ScreenUtil.pixelRatio       //设备的像素密度
    ScreenUtil.screenWidth   (sdk>=2.6 : 1.sw)   //设备宽度
    ScreenUtil.screenHeight  (sdk>=2.6 : 1.sh)   //设备高度
    ScreenUtil.bottomBarHeight  //底部安全区距离，适用于全面屏下面有按键的
    ScreenUtil.statusBarHeight  //状态栏高度 刘海屏会更高
    ScreenUtil.textScaleFactor //系统字体缩放比例

    ScreenUtil().scaleWidth  // 实际宽度设计稿宽度的比例
    ScreenUtil().scaleHeight // 实际高度与设计稿高度度的比例

    ScreenUtil().orientation  //屏幕方向

    0.2.sw  //屏幕宽度的0.2倍
    0.5.sh  //屏幕高度的50%
```

### 第三方路由管理框架fluro

[fluro](https://link.zhihu.com/?target=https%3A//pub.flutter-io.cn/packages/fluro)是flutter生态中比较优秀的一个路由管理框架，包含以下特点

- 简单的路由导航
- 函数处理程序（映射到函数而不是路由）
- 通配符参数匹配
- 内置常见转换
- 简单的自定义过渡创建

#### 开始安装

打开项目根路径中的`pubspec.yaml`文件，并在`dependencies`下面增加`fluro`的依赖：`fluro: ^1.6.0`，后面的版本号根据fluro最新版本填入。然后运行`flutter pub get`。至此，安装就完成了，可以直接在代码中引入并使用。

#### 使用

在lib目录建立routers文件夹，同时在里面新建三个文件：application.dart、router_handler.dart、routers.dart。(second_page.dart为跳转页面)

**router_handler.dart处理路由传参：**

```dart
import 'package:fluro/fluro.dart';
import 'package:flutter/material.dart';

//页面
import '../pages/second_page.dart';

// 一个页面一个Handler
Handler xxxPageHandler = Handler(
  handlerFunc: (BuildContext context, Map<String,List<String>> params){
    String goodsId = params['goodsId'].first;
    return SecondPage(goodsId);
  }
);

```

**routers.dart是所有路由集合：**

```dart
import 'package:fluro/fluro.dart';
import 'package:flutter/material.dart';
import 'router_handler.dart';

class Routes {
  //根路径
  static String root = '/';
  static String xxxPage = '/secondPage';
  
  //配置路由对象，所有的路由都在这里面
  static void configureRoutes(FluroRouter router){
    router.define(xxxPage, handler: secondPageHandler);
  }
  
  // 对参数进行encode，解决参数中有特殊字符，影响fluro路由匹配
  static Future navigateTo(BuildContext context, String path, {Map<String, dynamic> params, TransitionType transition = TransitionType.native}) {
    String query =  "";
    if (params != null) {
      int index = 0;
      for (var key in params.keys) {
        var value = Uri.encodeComponent(params[key]);
        if (index == 0) {
          query = "?";
        } else {
          query = query + "\&";
        }
        query += "$key=$value";
        index++;
      }
    }
    print('我是navigateTo传递的参数：$query');

    path = path + query;
    return router.navigateTo(context, path, transition:transition);
  }
}
```

**在进行路由的总体配置时，还需要处理不存在的路径情况**，即使用空页面或者默认页面进行代替。同时，需要注意的是应用的首页一定要用“/”进行配置。 为了方便使用，还需要把Router进行静态化，这样在任何一个页面都可以直接调用它。如下所示，是application.dart文件的示例代码。

```dart
import 'package:fluro/fluro.dart';

class Application{
  static FluroRouter router;
}
```

```dart
import 'package:fluro/fluro.dart';
import 'package:flutter_demo/routes.dart';
import 'application.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final router = FluroRouter();
    //给routers.dart里面的传递FluroRouter传递router实例对象
    Routes.configureRoutes(router);
    //给Application的router赋值router实例对象
    Application.router = router;
    
    return MaterialApp(
      title: 'Demo App',
      onGenerateRoute: Application.router.generator,
    );
  }
}
```

**跳转页面**

不传参

```dart
Routes.navigateTo(
  context,
  Routes.setting, //routers.dart中配置的路由名
);
```

传参

```dart
String title = '我是标题哈哈哈';
String url = 'https://www.baidu.com/';
Routes.navigateTo(
  context,
  Routes.webView, //routers.dart中配置的路由名
  params: {
    'title': title,
    'url': url,
  },
).then((result) {
  // 通过pop回传的值，边缘侧滑返回则不通过此处传值
});
```

**注意：**如果字符串中包含中文就需要使用Uri.encodeComponent进行转义

### shared_preferences

```dart
SharedPreferences prefs = await SharedPreferences.getInstance();
// 获取就是getXxx
// 增/改
prefs.setString(key, value)
prefs.setBool(key, value)
prefs.setDouble(key, value)
prefs.setInt(key, value)
prefs.setStringList(key, value)
  
// 删
prefs.remove(key); //删除指定键
prefs.clear();//清空键值对
```

### Flutter_keyboard_size

`MediaQuery.of(context).viewInsets.bottom` 获取它的高度,但是，对于复杂的小部件树，它不起作用。因此，每次我们必须将键盘大小调整为小部件树。

**用法**

```dart
KeyboardSizeProvider(
      smallSize: 500.0, // smallSize属性是可选的，默认值为400.0
      child: Scaffold(

```

