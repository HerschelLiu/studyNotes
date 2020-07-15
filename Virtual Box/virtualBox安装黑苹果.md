## 安装环境

* Virtual Box 6.0.14
* MacOS 10.13.6 High Sierra

### 新建max虚拟机

1. 按照提示选择
2. 创建虚拟硬盘的时候,选择固定大小,如果动态分配会找不到磁盘

###  配置虚拟机

#### 系统

* 主板:启动顺序把光驱排到最前面
* 硬件加速:半虚拟化设置选择最少
* 处理器:
  * 处理器数量根据电脑配置选
* 芯片组：改为PIIX3

#### 显示

* 屏幕:显存大小调到力所能及的最大

#### 存储

选择系统镜像

加载macOS Catalina ISO.iso和VirtualBox Boot.vmdk.这两个文件是找来的，应该是做了相应修改，所以使用这个

### cmd

* 关闭虚拟机


* 管理员运行cmd

* 将下列代码复制,并替换`mac`为你的虚拟机名字,然后粘贴到cmd（10.15版本也需要这样做）

  ```
  cd "C:\Program Files\Oracle\VirtualBox\"

  VBoxManage setextradata "mac" "VBoxInternal/Devices/efi/0/Config/DmiSystemProduct" "iMac11,3"

  VBoxManage setextradata "mac" "VBoxInternal/Devices/efi/0/Config/DmiSystemVersion" "1.0"

  VBoxManage setextradata "mac" "VBoxInternal/Devices/efi/0/Config/DmiBoardProduct" "Iloveapple"

  VBoxManage setextradata "mac" "VBoxInternal/Devices/smc/0/Config/DeviceKey" "ourhardworkbythesewordsguardedpleasedontsteal(c)AppleComputerInc"

  VBoxManage setextradata "mac" "VBoxInternal/Devices/smc/0/Config/GetKeyFromRealSMC" 1
  ```

### 安装MacOS

如果遇见报错"不能为虚拟电脑mac打开一个新任务"的话,就重启几次

* 运行,会黑屏,一堆代码,等待就好


* 界面到安装macOS的时候,不能直接安装,先格式化:实用工具->磁盘工具->点击继续,选择磁盘(VBOX HARDDISK...) -> 抹掉->重命名,我起名叫mac,格式选择APFS，点击抹掉,之后会重心打开到实用工具，选择安装macOS，选择刚抹除的磁盘
* 安装完成会黑屏一堆代码,等待就好

### 优化

#### 修改分辨率

VM增强工具是安不上的，[b站视频](https://www.bilibili.com/video/BV1v7411v7cD)说当时virturalBox才支持10.13

用VMware Player（非商业使用免费，这就是我用VBox的原因）安装可以参考https://www.52pojie.cn/thread-804000-1-1.html （从旧版本升级到新版本没问题，VM Tools安装后会自动适应分辨率，可以双向复制（允许后））
VMware Player 15.5新版的unlock可以在这下载：https://www.mediafire.com/file/w4khcmcu7hqo1a7/MK-unlocker.zip/file