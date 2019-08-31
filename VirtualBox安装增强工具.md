1. virtu Box中安装好deepin系统，在虚拟机中帮助->Virtual Box网站->右侧Downloads->VirtualBox older builds->选择你的虚拟机版本（帮助->关于Virturl Box查看），下载后双击安装
2. 增强工具的iso文件在`C:\Program Files\Oracle\VirtualBox\VBoxGuestAdditions.iso`,将他加载进去，虚拟器：设备->安装增强功能，之后会出现错误（未能加载虚拟光盘），出现上图错误的主要原因是重复加载了虚拟光盘，可以点击“设备”——“分配光驱”——“移除光盘”，将自动加载的光盘去掉，之后就没有这个错误了。虽然没有了错误提示，但事实并没有安装增强功能，要安装virtualbox的增强功能，需要手动安装，我这里使用的deepin的虚拟机，其它操作类似，首先点击任务栏上的“文件”。之后就可以看到virutalbox的增强功能的光盘已经加载了（在左侧出现了VBox_GAs_版本号）因为虚拟机是linux系统 ，因此先运行终端，通过mount命令将光盘挂载：

```
#需要管理员权限
$ sudo -s
$ ls -l /dev | grep cdrom
$ mount /dev/cdrom /mnt/
$ cd /mnt
$bash VBoxLinuxAdditi.run
```

完成之后就可以了，如果没重启就手动重启