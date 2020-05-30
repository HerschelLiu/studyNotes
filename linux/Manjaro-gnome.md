从众多Linux发行版中选择他作为主力，deepin问题有点多

自己选择gnome桌面（3.36以后的Gnome功能加了好多，但还是老问题：各种各样的扩展导致桌面不稳定，不建议入手Gnome版本，就算你是Gnome老用户，我还是强烈建议你使用KDE）（只针对Manjaro定制的Gnome，并不是所有发行版的Gnome都这样，但是推荐使用kde，对新手也友好

* xface：内存占用最低，给人的感觉是：快！相当的快，没有多余的动画，但是有些插件还不完善，界面不丑。适合够用党
*  kde：应该是第5个版本了，定制化很高，高到你每个功能都想去点点，每个样式都想去换换，好评第一的图形界面，像 win7的风格，虽然占用内存适中，但是很流畅不会有卡顿。网上的kde主题、图标界面很多，这个系统非常适合折腾党。发现的问题：因为很像win7，常用程序可以固定到菜单栏，但是浏览所有程序的功能没有，还要一个一个的分类去点开查找新装的程序分到了哪个目录找起来麻烦，且由于定制化太高，无法安心下来去使用。
* gnome：很像之前的Ubuntu风格，侧边栏默认左侧停靠，同时可以固定常用程序，整体风格很静谧，有种时时刻刻为你server的感觉，且左下角有显示所有程序的图标，查找程序一目了然，自带Tweaks增强功能，记得之前折腾还要去安装，后来把Linux的界面整成了Mac的模样（80%的模样，没有Mac的小伙儿可能都这样干过），有点小缺点笔记本调节亮度有一些延迟。理想中的系统可能是xface般的deepin。

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
   
   