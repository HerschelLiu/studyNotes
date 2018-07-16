1. 将从apicloud官网下载的webstrom插件解压

2. 在你想要存放工程的位置新建`workspace`文件夹

3. 将解压好的文件中`webStorm-APICloud`文件夹整个放进创建好的`workspace`文件夹中

4. webstrom打开`workspace`文件夹,以后创建的项目都在这里面,注意,不能用webstrom直接打开新建的应用

5. 如果不想配置全局java,可以在每个Program选择webstrom或者`webStorm-APICloud`中的java文件

   文件地址为`jre64\bin\java.exe`\`jre\bin\java.exe`

6. 本地打包出错的原因可能是因为没配置全局变量

7. 可以将你新建的External Toos放在一个组里,修改新建时候的`Group`即可

8. `$ProjectFileDir$`指代项目文件路径,即根目录,不填写则默认为当前目录下

9. 官方 Loader 如何更新

   1、到文档的 [Download 页面](https://docs.apicloud.com/APICloud/download)下载最新的官方 AppLoader

   2、替换已安装的真机同步插件里的官方 AppLoader（`\插件安装目录\webStorm-APICloud\appLoader\apicloud-loader\`），需要重命名为 'load.apk'。

   3、iOS的官方loader替换已安装的真机同步插件里的官方 AppLoader（`\插件安装目录\webStorm-APICloud\appLoader\apicloud-loader-ios\`），需要重命名为 'load.ipa'。

10. 自定义 Loader 真机同步

  1、在 APICloud 云平台先创建一个应用，比如叫：moduleTest

  2、用 WebStorm 在本地也创建一个应用（方法同[创建新应用](https://docs.apicloud.com/Dev-Tools/webStorm-apicloud-plugin#create-app)），名字自定义，比如也叫：moduleTest

  3、打开本地创建的 moduleTest 应用的 `config.xml` 文件，把其中的 id 修改成云平台创建的应用 ID 

  4、进入 APICloud 云平台的[代码页面](https://www.apicloud.com/code) -> 点击'上传代码'按钮 -> 点击'选择zip'按钮 -> 选择moduleTest的压缩包 -> 等待上传成功 

  5、在 APICloud 控制台中，配置好应用的端设置、证书、包名等，再进入 -> [模块页面](https://www.apicloud.com/module) -> 添加自己需要的模块 

  6、到 APICloud 平台 -> [模块页面](https://www.apicloud.com/module) -> 选择'自定义Loader'标签 

  7、点击自定义 Loader 编译按钮 -> 等待编译完成 -> 下载成功 

  8、Android 应用的真机同步： 找到 webStorm-APICloud 安装目录 -> `\安装目录\webStorm-APICloud\appLoader\custom-loader`

  iOS 应用的真机同步： 找到 webStorm-APICloud 安装目录 -> `\安装目录\webStorm-APICloud\appLoader\custom-loader-ios`

  新建一个文件夹，以云端应用 ID 命名，把刚下载的自定义 Loader 放入此目录，重命名为 '`load.apk`'

  9、新建一个 '`load.conf`' 文件（**version - 自定义 Loader 版本号，packageName - 应用包名**），格式如下：

  ```
  {
      "version" : "00.00.96",
      "packageName" : "com.apicloud.A6981947014549"
  }
  ```

  **注意，iOS 如果使用官方默认的证书，没有上传自己的iOS证书，则自定义Loader的包名统一为：com.api.customloader 

  10、右键点击本地应用 moduleTest 文件夹 -> 弹出菜中选择 'External Tools' -> Android真机同步 或者 ios真机同步。

  11、等待 Android 手机自动打开刚同步的应用，代表同步成功，iOS不会自动打开应用，需要手动打开同步完的应用

  12、暂不支持iOS 10 以上版本的手机。

  ## WiFi日志输出插件安装，使用

  ### windows 版插件安装、使用

  把插件包中 wifilog.jar 放到目录C:\APICloud\workspace 下。(需要自己在C盘下创建APICloud文件夹,在文件夹中新建workspace文件夹)

  * 在 Settings-Tools-Terminal 面板配置如图所示内容：

  `cmd.exe /K "chcp 936 && java -jar C:/APICloud/workspace/wifilog.jar C:/APICloud/workspace/log_info"`

  * 按快捷键 Alt+F12启动WiFi日志输出。有些键盘可能需要同时按fn键。 

  ## 安装 APICloud 代码提示插件

  1、点击顶部菜单 '`file`' ，选择 '`Import Settings`'

  2、弹出的对话框输入插件路径，点击OK即可。 (`webStorm-APICloud`文件夹下的webstrom_assist.jar)

  3、弹出的对话框如图选择'`Live templates`'，点击OK即可，等待重启 '`webstorm`'，即可使用。 

 # 以下内容复制自官网文档



## 打开WebStorm 的 'External Tools'选项

1. Mac:点击 状态栏中WebStorm ,在下拉菜单中，点击 Preferences
2. window:File>settings

## 安装"创建新应用"插件

1.新建空白应用。在 'External Tools'选项中，点击 '+' 。在Create Tool中，填写如下内容：

name : 新建空白应用

* Program : java

* Parameters : -jar $ProjectFileDir$/webStorm-APICloud/webStorm_app.jar \$ProjectFileDir\$ \$Prompt\$ default

* Working directory: \$ProjectFileDir\$

2 .新建底部导航应用。在 'External Tools'选项中，点击 '+' 。在Create Tool中，填写如下内容：

* name : 新建底部导航应用
* Program : java
* Parameters : -jar \$ProjectFileDir\$/webStorm-APICloud/webStorm_app.jar \$ProjectFileDir\$ \$Prompt\$bottom
* Working directory: \$ProjectFileDir\$

3 .新建首页导航应用。在 'External Tools'选项中，点击 '+' 。在Create Tool中，填写如下内容：

* name : 新建首页导航应用
* Program : java
* Parameters : -jar \$ProjectFileDir\$/webStorm-APICloud/webStorm_app.jar \$ProjectFileDir\$ \$Prompt\$ home
* Working directory: \$ProjectFileDir\$

4 .新建侧边导航应用。在 'External Tools'选项中，点击 '+' 。在Create Tool中，填写如下内容：

* name : 新建侧边导航应用
* Program : java
* Parameters : -jar \$ProjectFileDir\$/webStorm-APICloud/webStorm_app.jar \$ProjectFileDir\$ \$Prompt\$ slide
* Working directory: \$ProjectFileDir\$

## 安装"创建APICloud文件"插件

在 'External Tools'选项中，点击 '+' 。在Create Tool中，填写如下内容：

* name : 创建APICloud文件
* Program : java
* Parameters : -jar \$ProjectFileDir\$/webStorm-APICloud/webStorm_app.jar \$ProjectFileDir\$ \$Prompt\$ new \$FileDir\$

## 安装"android真机同步"插件

在 'External Tools'选项中，点击 '+' 。在Create Tool中，填写如下内容：

* name : android真机同步
* Program : java
* Parameters : -jar \$ProjectFileDir\$/webStorm-APICloud/webStorm_loader.jar \$ProjectFileDir\$/webStorm-APICloud/ \$FileDir\$/
* Working directory: \$ProjectFileDir\$

## 安装"Android本地打包"插件

在 'External Tools'选项中，点击 '+' 。在Create Tool中，填写如下内容：

* name : android本地打包
* Program : java
* Parameters : -jar \$ProjectFileDir\$/webStorm-APICloud/webStorm_pkg.jar \$ProjectFileDir\$/webStorm-APICloud \$FileDir\$ \$ProjectFileDir\$ android
* Working directory: \$ProjectFileDir\$

## 安装"Android日志输出"插件

在 'External Tools'选项中，点击 '+' 。在Create Tool中，填写如下内容：

* name : Android 日志输出
* Program : java
* Parameters : -jar \$ProjectFileDir\$/webStorm-APICloud/webStorm_log.jar \$ProjectFileDir$/webStorm-APICloud

## 安装"ios真机同步"插件

在 'External Tools'选项中，点击 '+' 。在Create Tool中，填写如下内容：

* name : ios真机同步
* Program : java
* Parameters : -jar \$ProjectFileDir\$/webStorm-APICloud/webStorm_loader.jar \$ProjectFileDir\$/webStorm-APICloud/ \$FileDir\$ ios
* Working directory: \$ProjectFileDir\$

## 安装"ios本地打包"插件

在 'External Tools'选项中，点击 '+' 。在Create Tool中，填写如下内容：

* name : ios本地打包

* Program : java

* Parameters : -jar \$ProjectFileDir\$/webStorm-APICloud/webStorm_pkg.jar \$ProjectFileDir\$/webStorm-APICloud \$FileDir\$ \$ProjectFileDir\$ ios

* Working directory: \$ProjectFileDir\$

  