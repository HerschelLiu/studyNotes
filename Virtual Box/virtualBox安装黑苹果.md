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

#### 显示

* 屏幕:显存大小调到力所能及的最大

#### 存储

选择系统镜像

### cmd

* 关闭Virtual Box


* 管理员运行cmd

* 将下列代码复制,并替换`mac`为你的虚拟机名字,然后粘贴到cmd

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


* 界面到安装macOS的时候,不能直接安装,先格式化:实用工具->磁盘工具,选择第二个磁盘(VBOX HARDDISK...) -> 抹掉->重命名,我起名叫mac,关掉,选择刚抹除的磁盘
* 安装完成会黑屏一堆代码,等待就好

### 优化

#### 修改分辨率

只能使用列表里面的分辨率,如果使用其他值,下次打开还是默认1024*768

cmd:`VBoxManage setextradata "VM name" "VBoxInternal2/EfiGraphicsResolution" "1280x720"`

或者直接该vbox文件`<ExtraDataItem name="VBoxInternal2/EfiGraphicsResolution" value="1280x720"/>`