## Pub get failed (server unavailable)

```bash
// 命令行运行

setx PUB_HOSTED_URL "https://pub.flutter-io.cn"
setx FLUTTER_STORAGE_BASE_URL "https://storage.flutter-io.cn"
```

## 运行太慢

因为要下载gradle，复制`android\gradle\wrapper\gradle-wrapper.propertoes`文件中的`distributionUrl`值去下载器下载，将下载好的zip放在`C:\Users\PC-070\.gradle\wrapper\dists`并把`distributionUrl`的值改为`file:///file:///C:/Users/用户名/.gradle/wrapper/dists/gradle-5.6.2-all.zip`