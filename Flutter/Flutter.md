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