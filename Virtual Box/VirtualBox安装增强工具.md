1. virtu Box中安装好deepin系统，在虚拟机中帮助->Virtual Box网站->右侧Downloads->VirtualBox older builds->选择你的虚拟机版本（帮助->关于Virturl Box查看），下载后双击安装
2. 增强工具的iso文件在`C:\Program Files\Oracle\VirtualBox\VBoxGuestAdditions.iso`,将他加载进去，虚拟器：设备->安装增强功能，之后会出现错误（未能加载虚拟光盘），出现上图错误的主要原因是重复加载了虚拟光盘，可以点击“设备”——“分配光驱”——“移除光盘”，将自动加载的光盘去掉，之后就没有这个错误了。虽然没有了错误提示，但事实并没有安装增强功能，要安装virtualbox的增强功能，需要手动安装，我这里使用的deepin的虚拟机，其它操作类似，(因为虚拟机是linux系统 ，因此先运行终端，通过mount命令将光盘挂载：

```
#需要管理员权限
$ sudo -s
$ ls -l /dev | grep cdrom
$ mount /dev/cdrom /mnt/
$ cd /mnt
$ bash VBoxLinuxAdditions.run
```

完成之后就可以了，如果没重启就手动重启，

## 增强工具

其实加载安装增强工具的ios(设备->安装增强供能),双击打开光盘,会法相有很多名字相似的文件,linux系统就双击VBoxLinuxAdditions.run,ios就双击VBoxDarwinAdditions.pkg,window的话,我猜测是点击VBoxWindowsAdditions.exe,剩下那两个应该不用点,,,,注意的是,mac安装增强工具压根没用,因为没有

## 挂载主机与虚拟机共享文件夹

1. 在virtualbox的设置中找到共享文件夹进行配置，不用选择自动挂载和只读

1. 在主机里新建文件夹（我的叫deepinShare），在deepin系统->系统盘->home->主目录->新建文件夹（winShare）

3. 在此目录下运行终端，输入

   ```
   sudo mount -t vboxsf deepinShare ./winShare
   // deepinShare是win里创建的共享文件夹，后是deepin共享文件夹的路径，名字要不同
   不知道deepin的共享文件夹路径，就直接拖动文件到终端就好
   ```

4. 设置自动挂载，如果不想每次都执行挂载命令，就在/etc/fstab下编辑设置自动挂载


   ```cpp
   share /mnt/shared vboxsf rw,gid=100,uid=1000,auto 0 0
   ```

5. 输入密码，就完成了

6. 卸载`sudo umount -f 文件夹路径`

## 安装exe文件（deepin）

### 方法一

打开终端，输入`deepin-wine `空格不能少，然后把exe文件移入终端，回车

### 方法二

1、管理员权限打开 /usr/share/applications/(我是直接在桌面创建的)
2、新建文本文件 wine.desktop ，并输入以下内容：

```
[Desktop Entry]
Name=Deepin-wine
Exec=deepin-wine %F
Type=Application
MimeType=text/plain;
```

保存退出；
3、找到任意.exe文件，右键单击 --> 打开方式 --> 选择默认程序 --> (找到 Deepin-wine) --> 选择

以后需要运行exe文件，可直接双击exe文件运行，可以下载windows程序的安装文件，双击直接安装，但装完后要自己找到安装后的主程序，一般在 ～/.wine/下，找到后可直接双击运行，也可右键 --> 发送到桌面 形成桌面图标，双击图标运行l'sh