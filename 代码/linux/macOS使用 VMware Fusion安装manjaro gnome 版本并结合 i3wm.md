## 前期准备（以macOS为例）

### 1. 下载 VMware Fusion（MacOS）或Workstation(Win)

* [VMware Fusion Pro 下载界面](https://link.zhihu.com/?target=https%3A//support.broadcom.com/group/ecx/productdownloads%3Fsubfamily%3DVMware%20Fusion%26freeDownloads%3Dtrue)
* [VMware Workstation Pro 下载界面](https://link.zhihu.com/?target=https%3A//support.broadcom.com/group/ecx/productdownloads%3Fsubfamily%3DVMware%20Workstation%20Pro%26freeDownloads%3Dtrue)

### 2. 下载[manjaro gnome（Generic）](https://manjaro.org/products/download/arm)

ARM架构下载下来后缀为`.img.xz`，而虚拟机需要镜像

#### 方法 1：直接解压为IMG并挂载（推荐）

1. 解压`.img.xz`文件或使用图形工具（如macOS的The Unarchiver）

   ```bash
   xz -d manjaro-gnome-xxx.img.xz  # 输出解压后的 .img 文件
   ```

2. 虚拟机直接使用IMG文件

   * UTM：在创建虚拟机时，选择**Boot from Linux Kernel Image**，并加载解压后的`.img`文件作为根文件系统，无需转换为ISO
   * VMware Fusion：直接拖动解压好的`.img`文件进去，选择其他64位ARM

#### 方法 2：转换为ISO格式

1. 转换工具选择

   * Linux/macOS终端：使用`dd`或`hdiutil`（macOS）将`.img`转换为`.iso`。生成的带有`.cdr`删除即可

     ```bash
     hdiutil convert manjaro-gnome-xxx.img -format UDTO -o manjaro-gnome-xxx.iso
     ```

   * **图形工具**：使用 [BalenaEtcher](https://www.balena.io/etcher/) 或 [PowerISO](https://www.poweriso.com/) 完成转换。

2. **注意事项**

   * 转换后的 ISO 可能缺少引导信息，需手动配置虚拟机引导参数（参考 UTM 的 `extlinux.conf` 设置）。
   * 优先尝试直接使用 `.img` 文件，转换 ISO 可能导致兼容性问题（如无法启动）。

#### UTM使用`.img`创建

**VMware Fusion**无法安装，因为Manjarode ARM的img文件有问题，无法引导

需要使用qemu

```bash
brew install qemu
```

1. 解压下载好的.img.xz
2. 双击img文件，它将被挂载，您可以在桌面上看到带有该名称的初始启动分区。此引导分区包含目录中的 *Linux 内核映像*、*Init RAM 磁盘*以及引导参数：`...img.xz``BOOT_MNJRO``extlinux`
3. 将文件从启动分区复制到 Mac 上的本地文件夹，包括目录的内容，之后，您可以通过 Finder 从 Mac 弹出/卸载启动分区。
4. 接下来，在 Mac 上打开 UTM 应用程序并点击新建-> 第一个虚拟化(*Virtualize*) -> 选择Linux -> 勾选从*内核映像启动*：
   1. Linux内核：image
   2. Linux初始ramdisk：xxx.img
   3. *Linux Root FS 映像*：下载的Manjaro的img文件
   4. 打开extlinux/extlinux.conf，复制root部分，从root=复制到splash：`root=PARTUUID=d17455d7-ee76-4831-83c8-5bbe6e8eb5bc rw rootwait audit=0 splash`,并填在启动参数中，用双引号包裹
5. 继续，按照实际填写；继续.最后起名
6. 右键生成的虚拟机-> 编辑->显示->勾选Retina模式
7. 查看左下角列出的 *VirtIO 驱动器*条目，并找到一个多个英文字母的，应该一般是最后一个。这个必须删除，因为 VM 创建中似乎存在一个错误，这会导致引用不存在的磁盘映像
8. 保存设置
9. 右键在访达中显示,打开终端，`cd xxx.utm`
10. 运行以下命令：，这将使镜像的大小增加 32G（注意：不是文件本身增加了那么多，而是磁盘大小的元信息。文件通常会随着系统的使用而增长到该大小。`qemu-img resize Images/<Name of your Root FS image>.qcow2 +32G`,即你的img镜像的文件名，不知道的在编辑例的VirtlO驱动器的名称.(会提示没有这个文件，不用管关闭即可)
11. 运行虚拟机
12. 全默认，最后选择‘Use the same password for the administrator account’
13. 完成，重新启动需要一些时间

> 禁用了对 Linux 内核的升级。这是因为 Linux 内核升级也会导致更新初始 RAM 磁盘。这两个文件最初都是从下载的磁盘映像中获取的。对 VM 中的 Linux 内核进行更新将使这些内核无效，并且可能会阻止 VM 正常启动。因此，忽略 VM 中的 Linux 内核升级目前听起来是一个更稳定的选择。

## 初始化

1. 限制当前Linux内核的更新并安装缺少的软件包
   1. Add/Remove Software -> 右上角三个点 -> Preferences -> Advanced的tab部分，将以下项目添加到*Ignored upgrades*列表：linux、linux-headers(只找到linux-api-headers)
   2. 接下来搜索应用程序并安装它：`spice-vdagent`
   3. 再次重新启动系统。重新启动后，桌面的大小应自动适应 UTM 窗口的大小（通过 ）。因此，请尝试切换到全屏，您应该会看到 Linux 桌面大小也在增加

### 基本软件

```bash
sudo pacman -S gcc perl make base-devel yay vim
```

* **gcc** 原名为 GNU C语言编译器，因为它原本只能处理 C 语言，但如今的 GCC ，不仅可以编译 C、C++ 和 Objective-C，还可以通过不同的前端模块支持各种语言，包括 Java、Fortran、Ada、Pascal、Go 和 D 语言等等。
* **Perl** 是一种强大的编程语言，广泛用于文本处理、系统管理、网络编程等领域。在Linux系统中，*perl*命令是Perl语言的解释器，用于执行Perl脚本或命令。
* **Make**是Linux中的一个自动化编译工具，它可以通过读取一个名为**Makefile**的文件来自动化地编译和链接程序。**Makefile**定义了项目的编译和链接规则，包括目标文件与源文件之间的依赖关系和如何生成目标文件的方法。
* **base-devel**里的是一些常用的开发工具，如果你不是程序员，大部分base-devel里的包你是用不到的，当然如果你需要编译安装某些软件，就会用到其中的一些编译工具，比如automake，cmake之类的。

### 软件管理

#### pacman

pacman 是manjaro的软件包管理器。

| 命令              | 说明                              |
| ----------------- | --------------------------------- |
| pacman -Syu       | 对整个系统进行更新                |
| pacman -S 包名    | 安装软件                          |
| pacman -R 包名    | 该命令将只删除包,不包含该包的依赖 |
| pacman -Rs 包名   | 在删除包的同时,也将删除其依赖     |
| pacman -Ss 关键字 | 这将搜索含关键字的包              |
| pacman -Scc       | 清理所有的缓存文件                |

#### yay

AUR 是指 Archlinux User-community Repository，也就是 Archlinux 用户社区的软件库。

使用yay命令来管理AUR的软件包，参数基本与pacman相同。

| 命令         | 说明     |
| ------------ | -------- |
| yay -Ss 包名 | 搜索软件 |
| yay -S 包名  | 安装软件 |

#### 输入法（fcitx）

```bash
sudo pacman -S fcitx fcitx-im fcitx-configtool fcitx-qt5
```

在`.xprofile` 配置文件中添加以下内容

```bash
#fcitx
export GTK_IM_MODULE=fcitx 
export QT_IM_MODULE=fcitx 
export XMODIFIERS="@im=fcitx"
fcitx-autostart
```

在 `.pam_environment` 配置文件添加内容

```bash
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS="@im=fcitx"
```

重起系统后执行 `fcitx-configtool` 命令就可以管理输入法了

#### **screenfetch**

[**ScreenFetch**](https://github.com/KittyKatt/screenFetch)是一个系统信息工具

#### 其他软件

如chrome、vacode等可以使用yay下载

```bash
yay -S community/code # 或 google-chrome
```



## 其他

### 键盘映射

通过修改配置文件 `~/.xmodmap`可以定义键盘映射

下面是将 CapLock设置为Ctrl，并将右侧Shift设置为Esc

```bash
remove Lock = Caps_Lock
remove Control = Control_L
keysym Caps_Lock = Control_L
add Lock = Caps_Lock
add Control = Control_L

keysym Shift_R = Escape
```

下面是将左侧alt键与ctl键互换

```bash
clear control
clear mod1
keycode 37 = Alt_L Meta_L
keycode 64 = Control_L
add control = Control_L Control_R
add mod1 = Alt_L Meta_L
```

每次启动系统时执行 `xmodmap ~/.xmodmap` 命令加载配置

> 不要将指令添加到`.zshrc` 文件中，这会造成新的终端映射失效



## **验证与故障排查**

### **启动失败处理**

* 若虚拟机卡在引导界面，检查镜像是否为 **ARM64** 架构，并确保宿主系统支持虚拟化（如 macOS 需开启 Rosetta）。
* 手动指定内核参数：在 UTM 中添加 `root=PARTUUID=xxx`（从 `extlinux.conf` 获取）。

### **网络与驱动问题**

安装 `spice-vdagent` 改善显示与剪贴板同步：

```bash
sudo pacman -S spice-vdagent
```

### 虚拟机中安装，出现不能全屏的问题解决方法

1. 选择装增强功能

2. 根据提示的内核版本执行以下命令安装内核

   ```bash
   sudo pacman -S linux-headers
   ```

3. 更新环境

   ```bash
   sudo /sbin/rcvboxadd quicksetup all
   ```

   

## 说明

* 部分复制[后盾人manjaro](https://www.houdunren.com/doc/article/13/166)