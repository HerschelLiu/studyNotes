[TOC]



* Appium 是一个开源的自动化测试框架，支持 iOS 和 Android 上 Web App、Native App 和 Hybrid App 的自动化测试。

* 支持多语言，只要使用该语言专用的客户端就行

* 服务端直接下载[Appium](http://appium.io/)

* js使用`WebDriverIO`

  ```bash
  npm init -y # package.json
  
  npm install @wdio/cli
  npx wdio config # 生成 wdio.conf.js
  # 选择mocha和chai
  
  npx wdio run ./wdio.conf.js # 您可以使用命令并指向您刚刚创建的 WebdriverIO 配置来启动测试套件
  # npx wdio ./wdio.conf.js
  npx wdio run ./wdio.conf.js --spec example.e2e.js # 如果您喜欢运行特定的测试文件，您可以添加一个参数：‎--spec
  # 监听 --watch
  
  tsc --init #如果使用typescript
  
  npx wdio install <type> <nsme> 安装 框架到 webdriverio项目
  ```

* 运行`appium-doctor`，如果vscode不能运行，用cmd，根据缺少的进行下载。主要的为node，sdk，jdk其他的不用就不安

```js
exports.config = {
    runner: 'local',
    port: 4723, // 与appium服务端的端口相同
    path: '/wd/hub', // 与appium服务端的path相同,可以点击放大镜-》自定义服务器中查看.
    // 必须相同，不然Appium服务端会提示[HTTP] No route found for /session [HTTP] <-- POST /session 404 1 ms - 211
    specs: [ // 测试脚本的路径
        './test/specs/**/*.ts'
    ],
    exclude: [ // 不需要测试的文件
        // 'path/to/excluded/files'
    ],
    maxInstances: 10,
    capabilities: [{ // 主要的配置用来验证各种信息的
        // chromedriverExecutable: '', // chromedriver的路径  
        // browserName: 'chrome', // 做自动化时使用的浏览器名字。如果是一个应用则只需填写个空的字符串`firefox`, `chrome`, `opera`, `safari`
        // browserVersion: '27.0', // 浏览器版本
        // autoWebview: true, // 直接转换到 Webview 上下文（context）。默认值为 false
        acceptInsecureCerts: true,
        platformName: 'Android', // 'Android' or 'iOS'
        platformVersion: '10', // 系统版本号 如安卓10
        automationName: 'Appium', // 自动化测试框架名称
        deviceName: 'DT1901A', // 测试的设备名，any表示任意设备 使用adb devices -l命令，model就是设备名，即安卓就是型号
        app: 'C:\my\test\appium_test\daigou2.1.2.2021030101-1026--3.0.7.apk', // 安装包的路径：必须是绝对路径或者远程路径，不能是相对路径
        appActivity: 'io.dcloud.PandoraEntry', // app 的activity名，一般是
        appPackage: 'com.daigou.purchaserapp', // app 的包名
        autoGrantPermissions: true, // 自动获取应用需要的权限
        // udid: '', // 使用adb devices -l命令 第一个位置就是
    }],
    logLevel: 'info', // 要打印的信息五个等级 trace | debug | info | warn | error | silent  输出信息依次递减
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000, // 每个测试用例最多等待结果的时间（毫秒）
    connectionRetryTimeout: 120000, // 最多等待连接的时长
    connectionRetryCount: 3, // 最多连接失败的次数
    // services: ['appium'],  // 服务端使用的，如果有此项，启动测试会调用相应的服务启动命令
    framework: 'mocha', // 采用什么测试框架
    reporters: ['spec'], // 打印信息的，测试报告
    mochaOpts: { // mocha配置
        ui: 'bdd',
        timeout: 60000, // 测试执行的超时时间
        require: [] // 测试需要引入的公共文件
    },
}
```

## java配置

* 系统环境变量新建`JAVA_HOME:C:\Program Fils\Java\jdk-15.0.2（jdk路径）`
* 系统环境变量新建`CLASSPATH:.;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar`
* 系统环境编辑Path，新增`%JAVA_HOME%\bin;`和`%JAVA_HOME%\jre\bin;`

## 安卓SDK配置

* 系统环境变量新建`ANDROID_HOME:C:\Users\PC-070\AppData\Local\Android\android-sdk(sdk路径)`
* 系统环境编辑Path，新增`;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools; `

## Appium 服务器初始化参数（Capability）

| 键                  | 描述                                                         | 值                                                           |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `automationName`    | 自动化测试的引擎                                             | `Appium` （默认）或者 `Selendroid`                           |
| `platformName`      | 使用的手机操作系统                                           | `iOS`, `Android`, 或者 `FirefoxOS`                           |
| `platformVersion`   | 手机操作系统的版本                                           | 例如  `7.1`, `4.4`                                           |
| `deviceName`        | 使用的手机或模拟器类型                                       | `iPhone Simulator`, `iPad Simulator`, `iPhone Retina 4-inch`, `Android Emulator`, `Galaxy S4`, 等等.... 在 iOS 上，使用 Instruments 的 `instruments -s devices` 命令可返回一个有效的设备的列表。在 Andorid 上虽然这个参数目前已被忽略，但仍然需要添加上该参数 |
| `app`               | 本地绝对路径_或_远程 http URL 所指向的一个安装包（`.ipa`,`.apk`,或 `.zip` 文件）。Appium 将其安装到合适的设备上。请注意，如果您指定了 `appPackage` 和 `appActivity` 参数（见下文），Android 则不需要此参数了。该参数也与 `browserName` 不兼容。 | `/abs/path/to/my.apk` 或 `http://myapp.com/app.ipa`          |
| `browserName`       | 做自动化时使用的浏览器名字。如果是一个应用则只需填写个空的字符串 | 'Safari' 对应 iOS，'Chrome', 'Chromium', 或 'Browser' 则对应 Android |
| `newCommandTimeout` | 用于客户端在退出或者结束 session 之前，Appium 等待客户端发送一条新命令所花费的时间（秒为单位） | 例如  `60`                                                   |
| `language`          | (Sim/Emu-only) 为模拟器设置语言                              | 例如  `fr`                                                   |
| `locale`            | (Sim/Emu-only) 为模拟器设置所在区域                          | 例如  `fr_CA`                                                |
| `udid`              | 连接真机的唯一设备号                                         | 例如  `1ae203187fc012g`                                      |
| `orientation`       | (Sim/Emu-only) 模拟器当前的方向                              | `竖屏` 或 `横屏`                                             |
| `autoWebview`       | 直接转换到 Webview 上下文（context）。默认值为 `false`       | `true`, `false`                                              |
| `noReset`           | 在当前 session 下不会重置应用的状态。默认值为 `false`        | `true`, `false`                                              |
| `fullReset`         | (iOS)删除所有的模拟器文件夹。(Android) 要清除 app 里的数据，请将应用卸载才能达到重置应用的效果。在 Android, 在 session 完成之后也会将应用卸载掉。默认值为 `false` | `true`, `false`                                              |



### Android 独有

| 键                             | 描述                                                         | 值                                                           |
| ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `appActivity`                  | Activity 的名字是指从你的包中所要启动的 Android acticity。他通常需要再前面添加`.` （例如  使用 `.MainActivity` 代替 `MainActivity`） | `MainActivity`, `.Settings`                                  |
| `appPackage`                   | 运行的 Android 应用的包名                                    | `com.example.android.myApp`, `com.android.settings`          |
| `appWaitActivity`              | 用于等待启动的 Android Activity 名称                         | `SplashActivity`                                             |
| `appWaitPackage`               | 用于等待启动的 Android 应用的包                              | `com.example.android.myApp`, `com.android.settings`          |
| `appWaitDuration`              | 用于等待 appWaitActivity 启动的超时时间（以毫秒为单位）（默认值为  `20000`) | `30000`                                                      |
| `deviceReadyTimeout`           | 用于等待模拟器或真机准备就绪的超时时间                       | `5`                                                          |
| `androidCoverage`              | 用于执行测试的 instrumentation 类。 传送 `-w` 参数到如下命令 `adb shell am instrument -e coverage true -w ` | `com.my.Pkg/com.my.Pkg.instrumentation.MyInstrumentation`    |
| `enablePerformanceLogging`     | （仅适用于 Chrome 与 webview）开启 Chromedriver 的性能日志。（默认值为 `false`） | `true`, `false`                                              |
| `androidDeviceReadyTimeout`    | 用于等待设备在启动应用后准备就绪的超时时间。以秒为单位。     | 例如  `30`                                                   |
| `androidInstallTimeout`        | 用于等待在设备中安装 apk 所花费的时间（以毫秒为单位）。默认值为 `90000` | 例如  `90000`                                                |
| `adbPort`                      | 用来连接 ADB 服务器的端口（默认值为 `5037`）                 | `5037`                                                       |
| `androidDeviceSocket`          | 开发工具的 socket 名称。只有在被测应用是一个使用 Chromium 内核的浏览器时才需要。socket 会被浏览器打开，然后 Chromedriver 把它作为开发者工具来进行连接。 | 例如  `chrome_devtools_remote`                               |
| `avd`                          | 被启动 avd 的名字                                            | 例如  `api19`                                                |
| `avdLaunchTimeout`             | 用于等待 avd 启动并连接 ADB 的超时时间（以毫秒为单位），默认值为 `120000`。 | `300000`                                                     |
| `avdReadyTimeout`              | 用于等待 avd 完成启动动画的超时时间（以毫秒为单位），默认值为 `120000`。 | `300000`                                                     |
| `avdArgs`                      | 启动 avd 时使用的额外参数                                    | 例如  `-netfast`                                             |
| `useKeystore`                  | 使用自定义的 keystore 给 apk 签名，默认值为 `false`          | `true`或`false`                                              |
| `keystorePath`                 | 自定义 keystore 的路径, 默认路径为 ~/.android/debug.keystore | 例如  `/path/to.keystore`                                    |
| `keystorePassword`             | 自定义 keystore 的密码                                       | 例如  `foo`                                                  |
| `keyAlias`                     | key 的别名                                                   | 例如  `androiddebugkey`                                      |
| `keyPassword`                  | key 的密码                                                   | 例如  `foo`                                                  |
| `chromedriverExecutable`       | webdriver 可执行文件的绝对路径（如果 Chromium 内嵌一个自己提供的 webdriver，则应使用他去替换掉 Appium 自带的 chromedriver） | `/abs/path/to/webdriver`                                     |
| `autoWebviewTimeout`           | 用于等待 Webview 上下文（context）激活的时间（以毫秒为单位）。默认值为 `2000` | 例如  `4`                                                    |
| `intentAction`                 | 用于启动 activity 的 intent action（默认值为  `android.intent.action.MAIN`) | 例如 `android.intent.action.MAIN`, `android.intent.action.VIEW` |
| `intentCategory`               | 用于启动 activity 的 intent category。（默认值为  `android.intent.category.LAUNCHER`)| 例如  `android.intent.category.LAUNCHER`, `android.intent.category.APP_CONTACTS` | 例如  `0x10200000`                                           |
| `optionalIntentArguments`      | 用于启动 activity 的额外 intent 参数。请查看 [Intent 参数](http://developer.android.com/reference/android/content/Intent.html) | 例如  `--esn <EXTRA_KEY>`, `--ez <EXTRA_KEY> <EXTRA_BOOLEAN_VALUE>`, 等等。 |
| `dontStopAppOnReset`           | 在使用 adb 启动应用之前，不要终止被测应用的进程。如果被测应用是被其他钩子(anchor)应用所创建的，设置该参数为 false 后，就允许钩子(anchor)应用的进程在使用 adb 启动被测应用期间仍然存在。换而言之，设置 `dontStopAppOnReset` 为 `true` 后，我们在 `adb shell am start` 的调用中不需要包含 `-S`标识（flag）。忽略该 capability 或 设置为 `false` 的话，就需要包含 `-S` 标识（flag）。默认值为 `false` | `true`或`false`                                              |
| `unicodeKeyboard`              | 使用 Unicode 输入法。 默认值为 `false`                       | `true`或`false`                                              |
| `resetKeyboard`                | 在设定了 `unicodeKeyboard` 关键字的 Unicode 测试结束后，重置输入法到原有状态。如果单独使用，将会被忽略。默认值为 `false` | `true`或`false`\|                                            |
| `noSign`                       | 跳过检查和对应用进行 debug 签名的步骤。仅适用于 UiAutomator，不适用于 selendroid。 默认值为 `false` | `true`或`false`                                              |
| `ignoreUnimportantViews`       | 调用 uiautomator 的函数 `setCompressedLayoutHierarchy()`。由于 Accessibility 命令在忽略部分元素的情况下执行速度会加快，这个关键字能加快测试执行的速度。被忽略的元素将不能够被找到，因此这个关键字同时也被实现成可以随时改变的 *设置 ( settings )*。 默认值为 `false` | `true` 或 `false`                                            |
| `disableAndroidWatchers`       | 禁用 android 监视器（watchers）。监视器用于见识应用程序的无响应状态（anr）和崩溃（crash），禁用会降低 Android 设备或模拟器的 CPU 使用率。该 capability 仅在使用 UiAutomator 时有效，不适用于 selendroid，默认设置为 `false`。 | `true` 或 `false`                                            |
| `chromeOptions`                | 允许对 ChromeDriver 传 chromeOptions 的参数。了解更多信息请查阅 [chromeOptions](https://sites.google.com/a/chromium.org/chromedriver/capabilities) | `chromeOptions: {args: ['--disable-popup-blocking']}`        |
| `recreateChromeDriverSessions` | 当移除非 ChromeDriver webview时，终止掉 ChromeDriver 的 session。默认设置为 `false` | `true`或`false`                                              |
| `nativeWebScreenshot`          | 在 web 的上下文（context），使用原生（native）的方法去截图，而不是用过代理的 ChromeDriver。默认值为 `false` | `true`或`false`                                              |
| `androidScreenshotPath`        | 在设备中截图被保存的目录名。默认值为 `/data/local/tmp`       | 例如  `/sdcard/screenshots/`                                 |
| `autoGrantPermissions`         | 让Appium自动确定您的应用需要哪些权限，并在安装时将其授予应用。默认设置为 `false` | `true`或`false`                                              |


### iOS 独有

| 键                            | 描述                                                         | 值                                                           |
| ----------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `calendarFormat`              | （仅支持模拟器） 为iOS的模拟器设置日历格式                   | 例如  `gregorian`                                            |
| `bundleId`                    | 被测应用的 bundle ID 。用于在真实设备中启动测试，也用于使用其他需要 bundle ID 的关键字启动测试。在使用 bundle ID 在真实设备上执行测试时，你可以不提供 `app` 关键字，但你必须提供 `udid` 。 | 例如  `io.appium.TestApp`                                    |
| `udid`                        | 连接的真实设备的唯一设备编号 (Unique device identifier)      | 例如  `1ae203187fc012g`                                      |
| `launchTimeout`               | 以毫秒为单位，在 Appium 运行失败之前设置一个等待 instruments 的时间 | 例如  `20000`                                                |
| `locationServicesEnabled`     | （仅支持模拟器）强制打开或关闭定位服务。默认值是保持当前模拟器的设定. | `true`或`false`                                              |
| `locationServicesAuthorized`  | （仅支持模拟器）通过修改 plist 文件设定是否允许应用使用定位服务，从而避免定位服务的警告出现。默认值是保持当前模拟器的设定。请注意在使用这个关键字时，你同时需要使用 `bundleId` 关键字来发送你的应用的 bundle ID。 | `true`或`false`                                              |
| `autoAcceptAlerts`            | 当警告弹出的时候，都会自动去点接受。包括隐私访问权限的警告（例如 定位，联系人，照片）。默认值为 false。不支持基于 `XCUITest` 的测试。 | `true`或`false`                                              |
| `autoDismissAlerts`           | 当警告弹出的时候，都会自动去点取消。包括隐私访问权限的警告（例如 定位，联系人，照片）。默认值为 false。不支持基于 `XCUITest` 的测试。 | `true`或`false`                                              |
| `nativeInstrumentsLib`        | 使用原生 intruments 库（即关闭 instruments-without-delay）。 | `true`或`false`                                              |
| `nativeWebTap`                | （仅支持模拟器）在Safari中允许“真实的"，非基于 javascript 的 web 点击 (tap) 。 默认值：`false`。注意：取决于 viewport 大小/比例， 点击操作不一定能精确地点中对应的元素。 | `true`或`false`                                              |
| `safariInitialUrl`            | （仅支持模拟器） (>= 8.1) 初始化 safari 的时使用的地址。默认是一个本地的欢迎页面 | 例如  `https://www.github.com`                               |
| `safariAllowPopups`           | （仅支持模拟器）允许 javascript 在 Safari 中创建新窗口。默认保持模拟器当前设置。 | `true`或`false`                                              |
| `safariIgnoreFraudWarning`    | （仅支持模拟器）阻止 Safari 显示此网站可能存在风险的警告。默认保持浏览器当前设置。 | `true`或`false`                                              |
| `safariOpenLinksInBackground` | （仅支持模拟器）Safari 是否允许链接在新窗口打开。默认保持浏览器当前设置。 | `true`或`false`                                              |
| `keepKeyChains`               | （仅支持模拟器）当 Appium 会话开始/结束时是否保留存放密码存放记录 (keychains) 库(Library)/钥匙串(Keychains)) | `true`或`false`                                              |
| `localizableStringsDir`       | 从哪里查找本地化字符串。默认值为 `en.lproj`                  | `en.lproj`                                                   |
| `processArguments`            | 通过 instruments 传递到 AUT 的参数                           | 例如  `-myflag`                                              |
| `interKeyDelay`               | 以毫秒为单位，按下每一个按键之间的延迟时间                   | 例如  `100`                                                  |
| `showIOSLog`                  | 是否在 Appium 的日志中显示设备的日志。默认值为 `false`       | `true`或`false`                                              |
| `sendKeyStrategy`             | 输入文字到文字框的策略。模拟器默认值：`oneByOne`(一个接着一个)。真实设备默认值：`grouped` (分组输入) | `oneByOne`, `grouped`或`setValue`                            |
| `screenshotWaitTimeout`       | 以秒为单位，生成屏幕截图的最长等待时间。默认值为：10         | 例如  `5`                                                    |
| `waitForAppScript`            | 用于判断 "应用是否被启动” 的 iOS 自动化脚本代码。默认情况下系统等待直到页面内容非空。结果必须是布尔类型。 | 例如  `true;`, `target.elements().length > 0;`, `$.delay(5000); true;` |
| `webviewConnectRetries`       | 用于获取 webview 失败时，发送连接信息到远程调试器的次数。默认次数为: `8` | 例如  `12`                                                   |
| `appName`                     | 被测应用的名字。 用于支持 iOS 9 以上系统的应用的自动化。     | 例如  `UICatalog`                                            |
| `customSSLCert`               | (Sim/Emu-only) 给模拟器添加一个 SSL 证书。                   | 例如  <br/>`-----BEGIN CERTIFICATE-----MIIFWjCCBEKg...`<br/>`-----END CERTIFICATE-----` |


### 使用 XCUITest(iOS 独有)

| 键                         | 描述                                                         | 值                                                           |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `processArguments`         | 将会传送到 WebDriverAgent 的进程参数与环境                   | `{ args: ["a", "b", "c"] , env: { "a": "b", "c": "d" } }` 或 `'{"args": ["a", "b", "c"], "env": { "a": "b", "c": "d" }}'` |
| `wdaLocalPort`             | 如果这个值被指定了，Mac 主机就会使用这个端口，通过 USB 发送数据到 iOS 设备中。默认的端口与 iOS 设备中 WDA 的端口号是一致的。 | 例如  `8100`                                                 |
| `showXcodeLog`             | 是否显示运行测试时 Xcode 的输出日志，如果值设置为 `true` ，则会在启动的时候产生**大量**的额外日志。默认设置为 `false`。 | 例如  `true`                                                 |
| `iosInstallPause`          | 安装应用程序与启动 WebDriverAgent 之间停止的间隔时间（以毫秒为单位），特别适用于体积较大的包。默认是设置为 `0`。 | 例如  `8000`                                                 |
| `xcodeConfigFile`          | 一个可选的 Xcode 可配置文件的完整路径，用于指定在真机上运行 WebDriverAgent 的个人身份或者团队身份的代码签名。 | 例如  `/path/to/myconfig.xcconfig`                           |
| `keychainPath`             | 从系统的 keychain 中导出私有开发秘钥的完整路径。在真机测试时与 `keychainPassword` 配合使用。 | 例如  `/path/to/MyPrivateKey.p12`                            |
| `keychainPassword`         | 在 `keychainPath` 中指定 keychain 的解锁密码。               | 例如  `super awesome password`                               |
| `scaleFactor`              | 模拟器缩放因子。这对于默认分辨率是大于实际分辨的模拟器来说非常有用。因此，你不用上下滑动模拟器的屏幕就能看到所有模拟器显示的内容了。 | 可接受的值为: `'1.0', '0.75', '0.5', '0.33' 和 '0.25'`。 这些值都应该是一个字符串 |
| `preventWDAAttachments`    | 设置 WebDriverAgent 项目中的 DerivedData 文件夹的权限为`仅可读`。为了防止 XCTest 框架产生大量无用的截屏与日志，该设置是非常必要的，因为这是不可能通过 Apple 提供的接口去关闭的。 | 设置 capabilitity 为 `true` 将会设置 Posix 的文件夹的权限为 `555`，设置为 `false` 则会将权限重置回 `755` |
| `webDriverAgentUrl`        | 若提供了 URL，Appium 将在这 URL 上连接现有的 WebDriverAgent 实例，而不是重新启动一个。 | 例如  `http://localhost:8100`                                |
| `useNewWDA`                | 若设置为 `true`，则直接卸载设备上现存的所有 WebDriverAgent 客户端。在某些情况，该做法可以提高稳定性。默认设置为 `false`。 | 例如  `true`                                                 |
| `wdaLaunchTimeout`         | 等待 WebDriverAgent 可 ping 同的时间（以毫秒为单位）。默认设置为 60000ms。 | 例如  `30000`                                                |
| `calendarAccessAuthorized` | 若设置为 `true`，则允许在 iOS 模拟器上访问日历。若设置为 `false`，则不被允许。否则，日历的 authorizationStatus 会保持不变。 | -                                                            |

### MacDriver 独有

[Appium Mac Driver repo](https://github.com/appium/appium-mac-driver#desired-capabilities)

### You.i 引擎独有

[You.i Engine driver](https://github.com/YOU-i-Labs/appium-youiengine-driver#desired-capabilities) itself.)

### WinAppDriver 独有

[Appium Windows Driver repo](https://github.com/appium/appium-windows-driver#windowsdriver-specific-capabilities)

## mocha相关语法

### mocha定义测试用例

```js
//describle方法用来定义一组测试
//it方法用来定义一个测试
//it.only,表示只跑定义了only的测试
//it.skip，表示跳过定义了skip的测试

descripble(''test group1",function(){
	it('test 1',function(){
		//...测试行为
	})
	it('test 2',function(){
		//...测试行为
	})
})
```

### 用法

#### mocha钩子函数

```js
describe('hooks', function () {
  before(function () {
    // 在这个作用域的所有测试用例运行之前运行
  })

  after(function () {
    // 在这个作用域的所有测试用例运行完之后运行
  })

  beforeEach(function () {
    // 在这个作用域的每一个测试用例运行之前运行
  })

  afterEach(function () {
    // 在这个作用域的每一个测试用例运行之后运行
  })

  // 测试用例
})
```

> 测试用例和测试的钩子可以混合排列。（相同的）钩子函数会按照它们的书写顺序运行；（整体的运行顺序是）所有的`before()`钩子运行一次，然后是`beforeEach()`钩子，测试用例，`afterEach()`钩子（循环运行），最后是`after()`钩子（运行一次）

#### 钩子函数的描述参数

所有的钩子在调用时都可以提供一个可选的“描述信息”的参数，以便在你的测试中更精确地定位错误。如果给一个钩子函数传入一个命名函数，当未提供“描述信息”参数的时候，这个命名函数的名称将被作为描述信息。

```javascript
beforeEach(function () {
  // beforeEach hook
})

beforeEach(function namedFun () {
  // beforeEach: namedFun
})

beforeEach('一些描述信息' ，function () {
  // beforEach: 一些描述信息
})
```

**更多mocha语法请看官方文档或参考链接**
[mocha官方文档](https://mochajs.org/)
[Mocha.js官方文档翻译 —— 简单、灵活、有趣](https://www.jianshu.com/p/9c78548caffa)

#### 异步代码

用Mocha测试异步代码简单的不要不要的！测试运行完了调用一下回调函数就行。只需要在`it()`中添加一个回调[[2\]](https://www.jianshu.com/p/9c78548caffa#fn2)，Mocha就知道应该等到这个回调被调用时才结束这个测试用例的运行。

```javascript
describe('User', function () {
  describe(#'save()', function () {
    it('应当正常保存', function () {
      var user = new User('Luna')
      user.save(function (err) {
        if (err) done(err)
        else done()
      })
    })
  })
})

// 简便起见，done()函数接受一个error参数，所以上面的代码可以这么写：
describe('User', function () {
  describe(#'save()', function () {
    it('应当正常保存', function () {
      var user = new User('Luna')
      user.save(done)
  })
})
```

#### 延迟的根测试套件

如果你需要在所有测试套件运行之前进行一些异步操作，你可以延迟根测试套件。以`--delay`参数运行`mocha`[[6\]](#fn6)，这会在全局注入一个特殊的回调函数`run()`：

```javascript
setTimeout(function () {
  // 一些设置
  
  describe('我的测试套件', function () {
    // ...
  })

  run()
}, 5000)
```

#### 挂起测试（Pending Tests）

“Pending”——“有人最终会编写这些测试用例”——没有传入回调函数的测试用例[[7\]](#fn7)：

```javascript
describe('Array', function () {
  describe('#indexOf()', function () {
    // 挂起的测试用例
    it('未找到时应当返回-1')
  })
})
```

挂起的测试用例会在报告中出现“pending”状态。

#### 独占测试

通过向测试套件或测试用例函数添加`.only`后缀，独占特性允许你只运行指定的测试套件或测试用例。下面是一个独占测试套件的例子：

```javascript
describe('Array', function (){
  describe.only('#indexOf()', function () {
    // ...
  })
})
```

<small>*注意：所有嵌套（在`.only`套件中的）测试套件仍旧会运行*</small>
 下面是一个运行单个测试用例的例子：

```javascript
describe('Array', function (){
  describe('#indexOf()', function () {
    it.only('除非找到否则返回-1', function () {
      // ...
    })

    it('找到后应当返回下标', function () {
      // ...
    })
  })
})
```

#### 跳过测试

这个功能是`only()`的反面。通过后缀`skip()`就可以让Mocha忽略这个测试套件或测试用例。所有被跳过的测试都会被标记为`pending`状态并体现在报告中。下面是一个跳过一整个测试套件的例子：



```javascript
describe('Array', function() {
  describe.skip('#indexOf()', function() {
    // ...
  })
})
```

下面是一个跳过测试用例的例子：



```javascript
describe('Array', function() {
  describe('#indexOf()', function() {
    it.skip('should return -1 unless present', function() {
      // 这个测试用例不会运行
    })

    it('should return the index when present', function() {
      // 这个测试用例会运行
    })
  })
})
```

> 最佳实践：使用`skip()`而不是直接将测试注释掉

你也可以使用`this.skip()`在运行时跳过测试。如果测试需要的环境或配置没办法提前检测，可以考虑使用运行时跳过。例如：



```javascript
it('应该仅在正确的环境配置中测试', function () {
  if(/*测试环境正确*/) {
    // 编写断言
  } else {
    this.skip()
  }
})
```

#### 测试耗时

许多测试报告都会显示测试耗时，并且标记出那些耗时较长的测试

你可以使用`slow()`方法来定义到底多久才算“耗时较长”：



```javascript
describe('something slow', function() {
  this.slow(10000)

  it('它的耗时应该足够我去做个三明治了', function() {
    // ...
  })
})
```

#### 测试超时

##### 套件级别

套件级别的超时应用于整个测试套件，你也可以通过`this.timeout(0)`来取消超时限制。如果没有覆盖这个值的话[[12\]](#fn12)，所有嵌套的测试套件和测试用例都会继承这个超时限制。



```javascript
describe('a suite of tests', function() {
  this.timeout(500)

  it('应当不超过500毫秒', function(done){
    setTimeout(done, 300)
  })

  it('也应当不超过500毫秒', function(done){
    setTimeout(done, 250)
  })
})
```

##### 用例级别

也可以对单一用例设置超时时间，或者通过`this.timeout(0)`来取消超时限制：



```javascript
it('应该不超过500毫秒', function(done){
  this.timeout(500)
  setTimeout(done, 300)
})
```

##### 钩子级别

当然也可以设置钩子级别的超时：



```javascript
describe('一个测试套件', function() {
  beforeEach(function(done) {
    this.timeout(3000); // 一个用时很长的环境设置操作.
    setTimeout(done, 2500)
  })
})
```

同样，使用`this.timeout(0)`来取消超时限制

> 在v3.0.0或更新的版本中，给`this.timeout()`传递一个大于[最大延迟值](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setTimeout#Maximum_delay_value)的参数会让超时限制失效

### 接口

Mocha的“接口”系统允许开发者选择习惯的风格或DSL。Mocha有**BDD**，**TDD**，**Exports**，**QUnit**和**Require**风格的接口。

#### 8.1 BDD

**BDD**接口提供`describe()`，`context()`，`it()`，`specify()`，`before()`，`after()`，`beforeEach()`和`afterEach()`。

`context()`只是`describe()`的别名，二者表现也是一致的；它只是为了让测试可读性更高。同样`specify()`也是`it()`的别名。

> 前文所有的示例都是使用**BDD**接口编写的

```javascript
describe('Array', function() {
  before(function() {
    // ...
  })

  describe('#indexOf()', function() {
    context('when not present', function() {
      it('should not throw an error', function() {
        (function() {
          [1,2,3].indexOf(4)
        }).should.not.throw()
      })
      it('should return -1', function() {
        [1,2,3].indexOf(4).should.equal(-1);
      })
    })
    context('when present', function() {
      it('should return the index where the element first appears in the array', function() {
        [1,2,3].indexOf(3).should.equal(2)
      })
    })
  })
})
```

### 测试报告

doc测试报告输出一个层级化的HTML来表示你的测试结果。使用header，footer和一些样式来包裹测试结果，然后你就有了一份惊艳的测试报告文档！

例如，假定你有下面的JavaScript：



```javascript
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});
```

在命令行输入`mocha --reporter doc array`会输出：



```html
<section class="suite">
  <h1>Array</h1>
  <dl>
    <section class="suite">
      <h1>#indexOf()</h1>
      <dl>
      <dt>should return -1 when the value is not present</dt>
      <dd><pre><code>[1,2,3].indexOf(5).should.equal(-1);
[1,2,3].indexOf(0).should.equal(-1);</code></pre></dd>
      </dl>
    </section>
  </dl>
</section>
```

## chai相关语法

chai有expect和should两种api,项目使用expect

```js
断言相等：expect(1).equal(1);
断言不相等：expect(1).not.equal(2);
断言包含某个文本：expect(’124545‘).to.include(’2‘);
```

**更多chai语法请看官方文档或参考链接**
[chai官方文档](https://www.chaijs.com/api/)
[Chai.js断言库API中文文档](https://www.jianshu.com/p/f200a75a15d2)

### 语言链

下面的接口是单纯作为语言链提供以期提高断言的可读性。除非被插件改写否则它们一般不提供测试功能。

- to

- be

- been

- is

- that

- which

- and

- has

- have

- with

- at

- of

- same

- not：对之后的断言取反`expect(foo).to.not.equal('bar')`

- deep：设置`deep`标记，然后使用`equal`和`property`断言。该标记可以让其后的断言不是比较对象本身，而是递归比较对象的键值对`expect(foo).to.deep.equal({ bar: 'baz'})`；`deep.property`中的特殊符号可以使用双反斜杠进行转义（第一个反斜杠是在字符串参数中对第二个反斜杠进行转义，第二个反斜杠用于在`property`中进行转义）

  ```js
  var deepCss = { '.link': { '[target]': 42 } }
  expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42)
  ```

  

- any：在`keys`断言之前使用`any`标记（与`all`相反）`expect(foo).to.have.any.keys('bar', 'baz')`

- all：在`keys`断言之前使用`all`标记（与`any`相反）

- .a(type)/.an(type)：`a`和`an`断言即可作为语言链又可作为断言使用

  - type：String，被测试的值的类型

  ```js
  // 类型断言
  expect('test').to.be.a('string');
  expect({ foo: 'bar' }).to.be.an('object');
  expect(null).to.be.a('null');
  expect(undefined).to.be.an('undefined');
  expect(new Error).to.be.an('error');
  expect(new Promise).to.be.a('promise');
  expect(new Float32Array()).to.be.a('float32array');
  expect(Symbol()).to.be.a('symbol');
  
  // es6 overrides
  expect({[Symbol.toStringTag]:()=>'foo'}).to.be.a('foo');
  
  // language chain
  expect(foo).to.be.an.instanceof(Foo);
  ```

- .include(value)/contains(value)：`include()`和`contains()`即可作为属性类断言前缀语言链又可作为作为判断数组、字符串是否包含某值的断言使用。当作为语言链使用时，常用于`key()`断言之前

  - value：Object | String | Number

  ```js
  expect([1, 2, 3]).to.include(2)
  expect('foobar').to.include('bar')
  expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo')
  ```

- .ok：断言目标为真值。

  ```js
  expect('everything').to.be.ok
  expect(1).to.be.ok
  expect(false).to.not.be.ok
  expect(null).to.not.be.ok
  ```

- .true/false：断言目标为`true`，注意，这里与`ok`的区别是不进行类型转换，**只能为`true`才能通过断言**`expect(true).to.be.true`/false;`expect(1)to.not.be.true/false`

- .null/.undefined：断言目标为`null/undefined``expect(null).to.be.null/undefined`;`expect(undefined).to.not.be.null/undefined`

- .NaN：断言目标为非数字`NaN`

  ```js
  expect('foo').to.be.null
  expect(4)to.not.be.null
  ```

- .exist：断言目标存在，即非`null`也非`undefined`

  ```js
  var foo = 'hi',
    bar = null,
    baz
  
  expect(foo).to.exist
  expect(bar).to.not.exist
  expect(baz).to.not.exist
  ```

- .empty：断言目标的长度为`0`。对于数组和字符串，它检查`length`属性，对于对象，它检查可枚举属性的数量

  ```js
  expect([]).to.be.empty
  expect('').to.be.empty
  expect({}).to.be.empty
  ```

- .arguments：断言目标是一个参数对象`arguments`

  ```js
  function test () {
    expect(arguments).to.be.arguments
  }
  ```

- .equal(value)：value：Mixed；断言目标严格等于(`===`)`value`。另外，如果设置了`deep`标记，则断言目标深度等于`value`;.eql(value)：断言目标深度等于`value`，相当于`deep.equal(value)`的简写

  ```js
  expect('hello').to.equal('hello')
  expect(42).to.equal(42)
  expect(1).to.not.equal(true)
  expect({ foo: 'bar'}).to.not.equal({ foo: 'bar'})
  expect({ foo: 'bar'}).to.deep.equal({foo: 'bar'})
  ```

- .above/least/below/most(value)：断言目标大于（超过）/不小于（大于或等于）小于/不大于（小于或等于）value.

  ```js
  expect(10).to.be.above(5)
  // 也可接在length后来断言一个最小的长度。相比直接提供长度的好处是提供了更详细的错误消息
  expect('foo').to.have.length.above(2)
  expect([1, 2, 3]).to.have.length.above(2)
  
  expect(10).to.be.at.least(10)
  // 也可接在length后来断言一个最小的长度。相比直接提供长度的好处是提供了更详细的错误消息
  expect('foo').to.have.length.of.at.least(3)
  expect([1, 2, 3]).to.have.length.of.at.least(3)
  
  expect(5).to.be.below(10)
  // 也可接在length后来断言一个最大的长度。相比直接提供长度的好处是提供了更详细的错误消息
  expect('foo').to.have.length.below(4)
  expect([1, 2, 3]).to.have.length.below(4)
  
  expect(5).to.be.at.most(5)
  // 也可接在length后来断言一个最大的长度。相比直接提供长度的好处是提供了更详细的错误消息
  expect('foo').to.have.length.of.at.most(4)
  expect([1, 2, 3]).to.have.length.of.at.most(3)
  ```

- .within(start, finish)：断言目标在某个区间内

  - start：Number，下限
  - finish：Number，上限

  ```js
  expect(7).to.be.within(5, 10)
  // 也可接在length后来断言一个长度区间。相比直接提供长度的好处是提供了更详细的错误消息
  expect('foo').to.have.length.within(2, 4)
  expect([1, 2, 3]).to.have.length.within(2, 4)
  ```

- .instanceof(constructor)：断言目标是构造函数`constructor`的一个实例

  ```js
  var Tea = function (name) { this.name = name },
    Chai = new Tea('chai')
  
  expect(Chai).to.be.an.instanceof(Tea)
  expect([1, 2, 3]).to.be.an.instanceof(Array)
  ```

- .property(name[String, 属性名], value[Mixed, 可选，属性值])：断言目标是否拥有某个名为`name`的属性，可选地如果提供了`value`则该属性值还需要严格等于（`===`）`value`。如果设置了`deep`标记，则可以使用点`.`和中括号`[]`来指向对象和数组中的深层属性

  ```js
  // 简单引用
  var obj = { foo: 'bar' }
  expect(obj).to.have.property('foo')
  expect(pbj).to.have.property('foo', 'bar')
  
  // 深层引用
  var deepObj = {
    green: { tea: 'matcha' },
    teas: [ 'Chai', 'matcha', { tea: 'konacha' } ]
  }
  
  expect(deepObj).to.have.deep.property('green.tea', 'matcha')
  expect(deepObj).to.have.deep.property('teas[1]', 'matcha')
  expect(deepObj).to.have.deep.property('teas[2].tea', 'konacha')
  // 如果目标是一个数组，还可以直接使用一个或多个数组下标作为name来在嵌套数组中断言deep.property
  var arr = [
    [ 'chai', 'matcha', 'konacha' ],
    [ { tea: 'chai' },
      { tea: 'matcha' },
      { tea: 'konacha' }
    ]
  ]
  
  expect(arr).to.have.deep.property('[0][1]', 'matcha')
  expect(arr).to.have.deep.property('[1][2].tea', 'konacha')
  // 此外，property把断言的主语（subject）从原来的对象变为当前属性的值，使得可以在其后进一步衔接其它链式断言（来针对这个属性值进行测试）
  expect(obj).to.have.property('foo')
    .that.is.a('string')
  expect(deepObj).to.have.property('green')
    .that.is.an('object')
    .that.deep.equals({ tea: 'matcha' })
  expect(deepObj).to.have.property('teas')
    .that.is.an('array')
    .with.deep.property('[2]')
      .that.deep.equals({ tea: 'konacha' })
  // 注意，只有当设置了deep标记的时候，在property() name中的点（.）和中括号（[]）才必须使用双反斜杠\进行转义（为什么是双反斜杠，在前文有提及），当没有设置deep标记的时候，是不能进行转义的
  // 简单指向
  var css = { '.link[target]': 42 }
  expect(css).to.have.property('.link[target]', 42)
  
  //深度指向
  var deepCss = { 'link': { '[target]': 42 } }
  expect(deepCss).to.have.deep.property('\\.link\\.[target]', 42)
  ```

- .ownPropertyDescription(name[String, 属性名], descriptor[Object,  描述对象, 可选])：断言目标的某个自有属性存在描述符对象，如果给定了`descroptor`描述符对象，则该属性的描述符对象必须与其相匹配

  ```js
  expect('test').to.have.ownPropertyDescriptor('length')
  expect('test').to.have.ownPropertyDescriptor('length', {
    enumerable: false,
    configrable: false,
    writeable: false,
    value: 4
  })
  expect('test').not.to.have.ownPropertyDescriptor('length', {
    enumerable: false,
    configurable: false,
    writeable: false,
    value: 3  
  })
  // 将断言的主语改为了属性描述符对象
  expect('test').to.have.ownPropertyDescriptor('length')
    .to.have.property('enumerable', false)
  expect('test').to.have.ownPropertyDescriptor('length')
    .to.have.keys('value')
  ```

- .length：设置`.have.length`标记作为比较`length`属性值的前缀。`expect('foo').to.have.length.above(2)`,`expect([1, 2, 3]).to.have.length.within(2, 4)`

- .lengthOf(value[Number])：断言目标的`length`属性为期望的值。

  ```js
  expect([1, 2, 3]).to.have.lengthOf(3)
  expect('foobar').to.have.lengthOf(6)
  ```

- .match(RegExp[正则表达式])：断言目标匹配到一个正则表达式。`expect('foobar').to.match(/^foo/)`

- .string(string)：断言目标字符串包含另一个字符串。`expect('foobar').to.have.string('bar')`

- .keys(key1[String | Array | Object 属性名], [key2], [...])：断言目标包含传入的属性名。与`any`，`all`，`contains`或者`have`前缀结合使用会影响测试结果：

  当与`any`结合使用时，无论是使用`have`还是使用`contains`前缀，目标必须至少存在一个传入的属性名才能通过测试。注意，`any`或者`all`应当至少使用一个，否则默认为`all`

  当结合`all`和`contains`使用时，目标对象必须至少拥有全部传入的属性名，但是它也可以拥有其它属性名

  ```js
  // 当结合all和have使用时，目标对象必须且仅能拥有全部传入的属性名
  // 结合any使用
  expect({ foo: 1, bar: 2, baz: 3 }).to.have.any.keys('foo', 'bar')
  expect({ foo: 1, bar: 2, baz: 3 }).to.contains.any.keys('foo', 'bar')
  
  // 结合all使用
  expect({ foo: 1, bar: 2, baz: 3 }).to.have.all.keys('foo', 'bar', 'baz')
  expect({ foo: 1, bar: 2, baz: 3 }).to.contains.all.keys('foo', 'bar')
  
  // 传入string
  expect({ foo: 1, bar: 2, baz: 3 }).to.have.any.keys('foo')
  // 传入Array
  expect({ foo: 1, bar: 2, baz: 3 }).to.have.all.keys(['foo', 'bar', 'baz'])
  // 传入Object
  expect({ foo: 1, bar: 2, baz: 3 }).to.have.any.keys({ bar: 2, foo: 1 })
  ```

- .throw(constructor[ErrorConstroctor | String | RegExp])：断言目标函数会抛出一个指定错误或错误类型（使用`instanceOf`计算），也可使用正则表达式或者字符串来检测错误消息

  ```js
  var err = new RefernceError('this is a bad function')
  var fn = function () { throw err }
  
  expect(fn).to.throw(ReferenceError)
  expect(fn).to.throw(Error)
  expect(fn).to.throw(/bad function/)
  expect(fn).to.not.throw('good function')
  expect(fn).to.throw(ReferrenceError, /bad function/)
  expect(fn).to.throw(err)
  // 注意，当一个抛错断言被否定了（前面有.not），那么它会从Error构造函数开始依次检查各个可能传入的参数。检查一个只是消息类型不匹配但是已知的错误，合理的方式是先断言该错误存在，然后使用.and后断言错误消息不匹配
  expect(fn).to.throw(ReferenceError)
    .and.not.throw(/good function/)
  ```

- .respondTo(method[String])：断言目标类或对象会响应一个方法（存在这个方法）

  ```js
  Klass.prototype.bar = function () {}
  expect(Klass).to.respondTo('bar')
  expect(obj).to.respondTo('bar')
  // 如果需要检查一个构造函数是否会响应一个静态方法（挂载在构造函数本身的方法），请查看itself标记
  Klass.baz = function () {}
  expect(Klass).itself.to.respondTo('baz')
  ```

- itself：设置`itself`标记，然后使用`respondTo`断言

  ```js
  function Foo () {}
  Foo.bar = function () {}
  Foo.prototype.baz = function () {}
  
  expect(Foo).itself.to.respondTo('bar')
  expect(Foo).itself.not.to.respond('baz')
  ```

- satisfy(method[Function, 测试器，接受一个参数表示目标值，返回一个布尔值])：断言目标值能够让给定的测试器返回真值。`expect(1).to.satisfy(function (num) { return num > 0 })`

- .closeTo(expected[Number, 期望值], delta[Number, 范围半径])：断言目标数字等于`expected`，或在期望值的+/-`delta`范围内。`expect(1.5).to.be.closeTo(1, 0.5)`

- members(set[Array])：断言目标是`set`的超集，或前者有后者所有严格相等（`===`）的成员。另外，如果设置了`deep`标记，则成员进行深度比较（include/contains只能接受单个值，但它们的主语除了是数组，还可以判断字符串；members则将它们的能力扩展为能够接受一个数组，但主语只能是数组）

  ```js
  expect([1, 2, 3]).to.include.members([3, 2])
  expect([1, 2, 3]).to.not.include.members([3, 2, 8])
  
  expect([4, 2]).to.have.members([2, 4])
  expect([5, 2]).to.not.have.members([5, 2, 1])
  
  expect([{ id: 1 }]).to.deep.include.members([{ id: 1 }])
  ```

- .oneOf(list[Array])：断言目标值出现在`list`数组的某个顶层位置（直接子元素，严格相等）

  ```js
  expect('a').to.be.oneOf(['a', 'b', 'c'])
  expect(9).to.not.be.oneOf(['z'])
  
  // 严格相等，所以对象类的值必须为同一个引用才能被判定为相等
  var three = [3]
  expect([3]).to.not.be.oneOf([1, 2, [3]])
  expect(three).to.not.be.oneOf([1, 2, [3]])
  expect(three).to.be.oneOf([1, 2, three])
  ```

- .change(object, property[String, 属性名])：断言目标方法会改变指定对象的指定属性

  ```js
  var obj = { val: 10 }
  var fn = function () { obj.val += 3 }
  var noChangeFn = function () { return 'bar' + 'baz' }
  
  expect(fn).to.change(obj, 'val')
  ```

- .increase(object, property[String, 属性名])：断言目标方法会增加指定对象的属性

  ```js
  var obj = { val: 10 }
  var fn = function () { obj.val = 15 }
  expect(fn).to.increase(obj, val)
  ```

- decrease(object, property[String, 属性名])：断言目标方法会减少指定对象的属性

  ```js
  var obj = { val: 10 }
  var fn = function () { obj.val = 5 }
  expect(fn).to.decrease(obj, val)
  ```

- .extensible：断言目标对象是可扩展的（可以添加新的属性）

  ```js
  var nonExtensibleObject = Object.preventExtensions({})
  var sealedObject = Object.seal({})
  var frozenObject = Object.freeze({})
  
  expect({}).to.be.extensible
  expect(nonExtensibleObject).to.not.be.extensible
  expect(sealObject).to.not.be.extensible
  expect(frozenObject).to.not.be.extensible
  ```

- .sealed：断言目标对象是封闭的（无法添加新的属性并且存在的属性不能被删除但可以被修改）

  ```js
  var sealedObject= Object.seal({})
  var frozenObject = Object.freeze({})
  
  expect(sealedObject).to.be.sealed
  expect(frozenObject).to.be.sealed
  expect({}).to.not.be.sealed
  ```

- .frozen：断言目标对象是冻结的（无法添加新的属性并且存在的属性不能被删除和修改）

  ```js
  var frozenObject = Object.freeze({})
  
  expect(frozenObject).to.be.frozen
  expect({}).to.not.be.frozen
  ```

**TDD**

除了一些语法糖以外，Chai提供的`assert`风格的断言和node.js包含的assert模块非常相似。`assert`风格是三种断言风格中唯一不支持链式调用的。

## webdriverIO相关语法

```js
//webdriverIO的dom选择器基本与jquery相同，支持xpath/属性/类/伪类/id等等，例如:
$("selector")
$('#selector')
$('.selector')
$('input[name=username]')等等，

//在webdriverIO中，调用api可以有两种写法，并且效果是一样的
//例如：
获取文本1：browser.getText('h1');//获取h1的值
获取文本2：$('h1').getText();//获取h1的值
设置表单的值1：$('input').setValue('111');
设置表单的值2：browser.setValue("input", "111")

//测试常用的api:
点击按钮：.click(`#button1`);
获取文本的值：.getText('h1');
获取表单的值：.getValue('input');
设置表单的值：.setValue("input", "111");
等待元素展现：.waitForVisible(`h1`);
等待元素在5s内消失：.waitForVisible(`h1`,5000,true); // 最好使用await
查看dom是否存在：.isExisting('h1');

//执行js代码，例如当元素不在视口，不方便点击的时候，就可以采用执行js代码去点击:
//例如执行点击遮罩层：
browser.execute(function() {
	$('div.modal-overlay').click();
});


//等待某些东西：
//例如等待overlay消失，等待时间最长为3分钟：
browser.waitUntil(
	function() {
		return browser.isExisting('div.overlay') === 'false';
		},
		180000,
		'等待3分钟内关掉overlay'
);
		
暂停5s：browser.pause('5000');
获取浏览器窗口id：browser.getTabIds();
关闭窗口：browser.close();
切换窗口（切换到第一个窗口）：browser.switchTab(browser.getTabIds()[0]);
刷新页面：browser.refresh();
```

### 自定义命令

webdriverIO可以封装一些经常使用的测试行为，就像js中封装函数，定义步骤如下：

```js
1.定义js文件，使用addCommand自定义命令
addCommand.js:
browser.addCommand('login',function(user,pwd){
	browser.url('/login');
	browser.waitForExist('input[name=username]');
	$('#username').setValue(user);
	$('#password').setValue(pwd);
	browser.click('.js-submit-btn');
});//添加登录命令

2.相关测试文件引入文件：
require("../helper/addCommand.js");

如果嫌总是要写引入太麻烦的话，可以在wdio.conf.js里面的mochaOpts-->require里面引入
	mochaOpts: {
		ui: 'bdd',
		timeout: 200 * 1000, // 测试执行的超时时间
		require: ['./helper/addCommand.js'] // 测试需要引入的公共文件
	}

3.直接在测试文件里使用：
//注意，mochaOpts没有配置的话记得写require引入文件
descripble(''test group1",function(){
	it('test 1',function(){
		browser.login('aaa','bbb');//使用新增的文件
	})
})

```

**更多webdriverIO API请看官方文档**
[webdriverIO官方文档](http://v4.webdriver.io/api.html)

## 代码编写

### 获取元素

* `id： android:id/content`,`$('#content')`
* `xpath:/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout/android.widget.LinearLayout/android.webkit.WebView/android.webkit.WebView/android.view.View[3]/android.view.View[4]`, `$('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout/android.widget.LinearLayout/android.webkit.WebView/android.webkit.WebView/android.view.View[3]/android.view.View[4]`')`

**注意**：

  1. `npx wdio config # 生成 wdio.conf.js`选择异步（async）

  2. 每一步操作前都要加上`await`，尤其获取元素时，若果不加，就会取不到元素

     ```js
     it('测试', async () => {
             let el1 = await $('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout/android.widget.LinearLayout/android.webkit.WebView/android.webkit.WebView/android.view.View[3]/android.view.View[4]');
             await el1.click();
             let move = await $('#content');
             await move.touchAction([
                 { action: 'press', x: 802, y: 2077 },
                 { action: 'moveTo', x: 252, y: 2093 },
                 'release',
             ]);
             
             await move.touchAction([
                 { action: 'press', x: 802, y: 2077 },
                 { action: 'moveTo', x: 252, y: 2093 },
                 'release',
             ]);
             
             await move.touchAction([
                 { action: 'press', x: 802, y: 2077 },
                 { action: 'moveTo', x: 252, y: 2093 },
                 'release',
             ]);
     
             await move.touchAction([
                 { action: 'tap', x: 532, y: 2279 }
             ]);
         });
     ```

     