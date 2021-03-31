[TOC]



## Pub get failed (server unavailable)

```bash
// 命令行运行

setx PUB_HOSTED_URL "https://pub.flutter-io.cn"
setx FLUTTER_STORAGE_BASE_URL "https://storage.flutter-io.cn"
```

## 运行太慢

因为要下载gradle，复制`android\gradle\wrapper\gradle-wrapper.propertoes`文件中的`distributionUrl`值去下载器下载，将下载好的zip放在`C:\Users\PC-070\.gradle\wrapper\dists`并把`distributionUrl`的值改为`file:///C:/Users/用户名/.gradle/wrapper/dists/gradle-5.6.2-all.zip`

## 运行`flutter doctor --android-licenses`报错`Exception in thread "main" java.lang.NoClassDefFoundError: javax/xml/bind/annotation/XmlSchema`

原因是因为jdk1.8之后去掉了很多jar包，导致无法运行

解决：

1. 安装并使用jdk1.8，但是因为协议问题，.exe文件无法下一步，需要用解压版
2. Android Studio -> Settings -> Appearance & Behavior/System Settings/Android SDK -> 右面选择SDK Tools选项 -> 将底部‘Hide Obsolete Packages’选项取消 -> 选择‘Android SDK Command-line Tools(latest)’ -> 点击Apply按钮 -> 等待安装完成 -> 点击OK。再运行`flutter doctor --android-licenses`，一路y就行