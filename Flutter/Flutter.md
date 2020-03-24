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

### 无状态（StatelessWidget)

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

### 有状态（StatefulWidget）

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

### TabBarView

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