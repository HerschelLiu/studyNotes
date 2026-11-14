# flutter插件

> Flutter 包速查。按功能分类，包名后带 `: ^x.y.z` 的是 pubspec 版本要求；地图/推送类包注意 iOS/Android 原生配置。

## 代码包

### 地图

| 插件 | 说明 |
| --- | --- |
| `flutter_bmflocation: ^2.0.0-nullsafety.1` | 百度地图定位 |
| `flutter_baidu_mapapi_map: ^3.0.0+2` | 百度地图-基础地图 |
| `flutter_baidu_mapapi_search: ^3.0.0` | 百度地图-检索 |
| `flutter_baidu_mapapi_utils: ^3.0.0` | 百度地图-计算工具 |

### 网络请求

| 插件 | 说明 |
| --- | --- |
| `dio` | 常用 HTTP 客户端 |

### 本地存储

| 插件 | 说明 |
| --- | --- |
| `get_storage` | 轻量 key-value 存储 |
| `flutter_cache_manager` | 文件缓存管理 |

### 图片相关

| 插件 | 说明 |
| --- | --- |
| `flutter_swiper_plus` | 轮播图 |
| `image_gallery_saver`、`image_save` | 保存图片 |
| `wechat_assets_picker`、`wechat_camera_picker` | 多张图片上传（仿微信选图/拍照） |
| `qr_flutter` | 生成二维码 |
| `image_cropper` | 裁剪图片 |
| `flutter_luban`、`flutter_image_compress` | 图片压缩 |
| `flutter_qr_reader` | 二维码识别 |
| `nine_grid_view` | 图片九宫格 |
| `photo_view` | 图片预览 |

### 媒体

| 插件 | 说明 |
| --- | --- |
| `better_player` | 视频播放器 |
| `flame_audio` | 音频播放（Flame 生态） |

### UI

#### 选择器

| 插件 | 说明 |
| --- | --- |
| `flutter_picker` | 选择器库：日期/时间/单项/城市地址/多项（类似小程序 picker） |
| `azlistview: ^2.0.0`、`city_pickers`（本地 `path: plugin/city_pickers-1.0.1`） | 城市选择器 |

#### 倒计时

| 插件 | 说明 |
| --- | --- |
| `circular_countdown_timer` | 圆形倒计时 |
| `stop_watch_timer` | 秒表 |

#### 加载

| 插件 | 说明 |
| --- | --- |
| `flutter_spinkit` | 加载中动画 |
| `flutter_easyrefresh` | 刷新 + 加载更多 |
| `easy_refresh` | 下拉刷新 |

#### svg

| 插件 | 说明 |
| --- | --- |
| `flutter_svg` | SVG 渲染 |

#### 表情

| 插件 | 说明 |
| --- | --- |
| `emoji_picker_flutter` | 表情选择器 |
| `emoji_keyboard_flutter` | 表情键盘 |

#### toast

| 插件 | 说明 |
| --- | --- |
| `toast` | 轻提示 |

#### 其他

| 插件 | 说明 |
| --- | --- |
| `permission_handler` | 权限申请 |
| `pin_input_text_field` | 验证码输入框（每个数字一个框） |
| `badges` | 徽标 |
| `custom_pop_up_menu` | 右上角弹出式菜单 |
| `flutter_slidable` | 列表项滑动操作（删除、分享、归档等） |
| `ai_progress` | 进度指示：圆环/扇形/线性/步进/仪表盘 |
| `new_gradient_app_bar` | 导航栏渐变背景色 |

### 数据可视化

| 插件 | 说明 |
| --- | --- |
| `graphview` | 图结构展示，支持树形/层次/有向图布局（家谱、层级视图、社交关系） |
| `vector_math` | 2D/3D 数学运算：向量、矩阵、四元数、碰撞检测 |

### 数据加密

| 插件 | 说明 |
| --- | --- |
| `steel_crypt` | 加解密 |
| `encrypt` | 加解密 |

### 系统功能

#### 唤醒系统应用

| 插件 | 说明 |
| --- | --- |
| `url_launcher` | 启动浏览器、地图、拨号器、邮件等（[pub.dev](https://pub.dev/packages/url_launcher)） |
| `flutter_sms` | 短信发送与接收管理 |

#### 分享

| 插件 | 说明 |
| --- | --- |
| `tencent_kit` | QQ 分享 |

#### 键盘

| 插件 | 说明 |
| --- | --- |
| `flutter_keyboard_size` | 获取键盘高度 |
| `keyboard_actions` | 键盘自定义：完成按钮、键盘栏、自定义页脚 |

#### 其他

| 插件 | 说明 |
| --- | --- |
| `r_upgrade` | 应用更新 |
| `screenshot` | 屏幕截图 |
| `device_info` | 获取手机信息 |
| `connectivity_plus` | 网络连接状态（WiFi/蜂窝） |
| `app_settings` | 打开 iOS/Android 系统设置 |
| `flutter_native_splash` | APP 启动图 |

### SDK

#### 微信

| 插件 | 说明 |
| --- | --- |
| `fluwx` | 微信 SDK |

#### 支付宝

| 插件 | 说明 |
| --- | --- |
| `Tobias` | 支付宝 SDK |

### 推送

| 插件 | 说明 |
| --- | --- |
| `getuiflut` | 个推 |
| `jpush_flutter` | 极光推送 |

### 代码工具

| 插件 | 说明 |
| --- | --- |
| `dart_json_mapper` | JSON 转 Dart 对象 |

### 其他

| 插件 | 说明 |
| --- | --- |
| `flutter_screenutil` | 屏幕自动适应 |
| `lpinyin` | 汉字转拼音 |
| `path_provider` | 常用目录路径 |
| `webview_flutter` | WebView |
| `flutter_html` | HTML 展示 |
| `package_info`、`device_apps` | 包信息 |
| `sentry_flutter` | 日志上报 |
| `back_button_interceptor` | 返回拦截 |

## 开发工具插件

### UI图

| 插件 | 说明 |
| --- | --- |
| [XD to Flutter](https://docs.flutter.cn/posts/announcing-xd-to-flutter-v2-0/) | 将 Adobe XD 设计导出到 Flutter |
