从众多Linux发行版中选择他作为主力，deepin问题有点多

自己选择gnome桌面（3.36以后的Gnome功能加了好多，但还是老问题：各种各样的扩展导致桌面不稳定，不建议入手Gnome版本，就算你是Gnome老用户，我还是强烈建议你使用KDE）（只针对Manjaro定制的Gnome，并不是所有发行版的Gnome都这样，但是推荐使用kde，对新手也友好

**[Mangaro官网](https://manjaro.org/download/)**

1. 安装界面，如果有独显(有NVIDIA和Intel双显卡)就driver-free  --改成--> no free,系统会自动帮忙安装适配的NVIDIA驱动，如果没有改，进去之后不要自己随便安装，可以参考[](https://link.zhihu.com/?target=https%3A//wiki.manjaro.org/index.php%3Ftitle%3DConfigure_NVIDIA_%28non-free%29_settings_and_load_them_on_Startup)

2. 如果你的ssd是NVMe协议M.2的，需要在进入安装界面之前先进去BIOS里面修改从硬盘的启动形式，把RAID改成AHCI，保存退出，否则进入安装界面你不会看到你的NVMe硬盘，做好这件事其他就都和普通ssd一样了。还需要注意的一点是，修改成AHCI模式之后，重新进入Windows时会有问题，这个时候不要慌，等电脑自动重启第三次的时候，进入安全模式启动Windows，进去之后重启系统，再次进入Windows就不需要安全模式了

3. 安装好后，

   1. 换源`sudo pacman-mirrors -i -c China -m rank`,在弹出的框中选一个最快的源，一个就好，选多了会降低速度.官方说不建议Manjaro用户使用archlinuxcn仓库，但是archlinuxcn仓库的软件大多支持manjaro（知乎上说没遇到过问题）。
   
2. 接着手动添加archlinuxcn的源`sudo nano /etc/pacman.conf`,在文件末尾输入：
   
       ```
       [archlinuxcn]
       SigLevel = Optional TrustedOnly
       Server = http://mirrors.163.com/archlinux-cn/$arch
    ```
   
       按ctrl+x退出，输入y保存.Server推荐163，清华源速度没这个快.
    
    3. 接着更新系统`sudo pacman -Syyu`
   
    4. 更新完之后，安装archlinuxcn-keyring`sudo pacman -S archlinuxcn-keyring`
   
    5. 再来一次`sudo pacman -Syyu`
   
   