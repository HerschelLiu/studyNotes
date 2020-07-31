从众多Linux发行版中选择他作为主力，deepin问题有点多

自己选择gnome桌面（3.36以后的Gnome功能加了好多，但还是老问题：各种各样的扩展导致桌面不稳定，不建议入手Gnome版本，就算你是Gnome老用户，我还是强烈建议你使用KDE）（只针对Manjaro定制的Gnome，并不是所有发行版的Gnome都这样，但是推荐使用kde，对新手也友好

* xface：内存占用最低，给人的感觉是：快！相当的快，没有多余的动画，但是有些插件还不完善，界面不丑。适合够用党
*  kde：应该是第5个版本了，定制化很高，高到你每个功能都想去点点，每个样式都想去换换，好评第一的图形界面，像 win7的风格，虽然占用内存适中，但是很流畅不会有卡顿。网上的kde主题、图标界面很多，这个系统非常适合折腾党。发现的问题：因为很像win7，常用程序可以固定到菜单栏，但是浏览所有程序的功能没有，还要一个一个的分类去点开查找新装的程序分到了哪个目录找起来麻烦，且由于定制化太高，无法安心下来去使用。
* gnome：很像之前的Ubuntu风格，侧边栏默认左侧停靠，同时可以固定常用程序，整体风格很静谧，有种时时刻刻为你server的感觉，且左下角有显示所有程序的图标，查找程序一目了然，自带Tweaks增强功能，记得之前折腾还要去安装，后来把Linux的界面整成了Mac的模样（80%的模样，没有Mac的小伙儿可能都这样干过），有点小缺点笔记本调节亮度有一些延迟。理想中的系统可能是xface般的deepin。

**[Mangaro官网](https://manjaro.org/download/)**

1. 安装界面，如果有独显(有NVIDIA和Intel双显卡)就driver-free  --改成--> no free,系统会自动帮忙安装适配的NVIDIA驱动，如果没有改，进去之后不要自己随便安装，可以参考[](https://link.zhihu.com/?target=https%3A//wiki.manjaro.org/index.php%3Ftitle%3DConfigure_NVIDIA_%28non-free%29_settings_and_load_them_on_Startup)

2. 如果你的ssd是NVMe协议M.2的，需要在进入安装界面之前先进去BIOS里面修改从硬盘的启动形式，把RAID改成AHCI，保存退出，否则进入安装界面你不会看到你的NVMe硬盘，做好这件事其他就都和普通ssd一样了。还需要注意的一点是，修改成AHCI模式之后，重新进入Windows时会有问题，这个时候不要慌，等电脑自动重启第三次的时候，进入安全模式启动Windows，进去之后重启系统，再次进入Windows就不需要安全模式了

## 配置

### 更换国内源

* 打开终端，输入命令`sudo pacman-mirrors -i -c China -m rank`

* 这时系统会对中国镜像进行测速，并在弹出窗口中列出

* 选择中科大的镜像（`https://mirrors.ustc.edu.cn/manjaro/`）（国内可用软件源，不要用ustc中科大，或者tuna清华的，这两个太拥挤，速度不稳定，慢，还会中断连接有时候，很糟心。建议换成其他的比如sjtu等用的人不多的，速度都可以达到满速值几乎。选择清华源tuna）

* 点击ok，刷新缓存`sudo pacman -Syy`

* 还需要添加一下ArchLinuxCN的源。终端输入：`sudo gedit /etc/pacman.conf`。<font color="red">注：由于使用的是GNOME桌面，所以编辑器是gedit，如果是manjaro的其他桌面版本，那肯能是nano，或者vim也行</font>

* 在打开的文件的末尾添加如下内容：(也是中科大的源)

  ```
  [archlinuxcn]
  [archlinuxcn]
  
  # The Chinese Arch Linux communities packages.
  
  # SigLevel = Optional TrustedOnly
  
  SigLevel = Optional TrustAll
  
  # 清华大学
  
  Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
  
  ## 163
  
  Server = http://mirrors.163.com/archlinux/$repo/os/$arch
  
  ## aliyun
  
  Server = http://mirrors.aliyun.com/archlinux/$repo/os/$arch
  
  
  
  
  
  注意：使用顺序，从上往下优先级越来越低，越靠上，优先级越高
  ```

* 修改好上述两个部分后，终端执行下面的指令：`sudo pacman -Syy && sudo pacman -S archlinuxcn-keyring`.<font color="red">**注意**，你在执行更新命令时可能会报错，这时你只需再执行一遍即可。我也不知道这是什么神仙bug。</font>这一条命令`sudo pacman -Syy`是用来刷新更新缓存的，有事没事的时候都可以刷两下！建议每次打开终端的时候都可以刷下！

* **最后，你需要更新一下系统**。`sudo pacman -Syyu`

* 最后重启系统。至此Manjaro的配置和更新算是完成了。

* 如果你要安装某个软件，终端输入`sudo pacman -S [name]`



## Manjaro安装必备软件

### 中文输入法

据我所知，在Linux下可用的有搜狗输入法等。但是考虑到国内互联网公司时不时的流氓行径，这里不推荐使用搜狗。可以试试Google中文输入法和RIME输入法。这里我使用的是RIME输入法。

安装过程很简单，在终端依次执行下述命令

```bash
sudo pacman -S fcitx-rime
#　fcitx-googlepinyinｇ 谷歌拼音
sudo pacman -S fcitx-im
sudo pacman -S fcitx-configtool
```

然后你需要编辑一个文件：

```bash
sudo gedit ~/.xprofile
```

**注意**：我使用的编辑器是gedit。

在文件末尾添加如下文本：

```text
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
```

改好后建议重启一下系统。

点击桌面右上角出现的小键盘，然后点击“配置当前输入法”。

通过下方的+、-和箭头，将“中州韵”汉语输入法添加进列表并置于最上端。其他的输入法可以使用减号移走。

不过安装RIME的小伙伴可能会惊奇地发现，RIME输入法输出的字体是繁体字！切换为简体字非常简单，只需按下F4，然后选择简体字方案就好了。

### 代码编辑器：VSCode

当然啦，既然你已经开始使用Linux系统，那我真的不得不默认你和我一样都是不得不将996当作福报的程序员。那么一个好用的代码编辑器绝对是必需品。

这里我使用的是巨硬出品的开源编辑器Visual Studio Code。这一款编辑器的优点真的不需要我多说些啥了。反正用过的人都说好。终端输入：

```bash
sudo pacman -S visual-studio-code-bin
```

话说回来，如果是喜欢用IDE的同学，那么在Linux下你肯定是逃不过Jet brains的全家桶的。安装也非常简单，输入IDE的名字就行了。以安装CLion为例（CLion较特殊，其他的都是直接输入名字，CLion是还需安装特定的cmake和一个库）：

```bash
sudo pacman -S clion clion-cmake make clion-lldb
```

### Google Chrome

```bash
sudo pacman -S google-chrome
```

### Lantern

```bash
sudo pacman -S lantern
```

### Markdown编辑器：Typora

虽然vscode可以满足markdown文档的编辑。但是我觉得不太好用。还是Typora给力。

```bash
sudo pacman -S typora
```

再一次提醒，如果安装中出现错误，如果确定命令没有打错，再执行一遍命令就可以解决问题。这个神仙bug在我写这个笔记的时候出现了无数次。。。

### QQ & Tim

安装QQ：

```bash
sudo pacman -S deepin.com.qq.im
```

安装Tim：

```bash
sudo pacman -S deepin.com.qq.office
```

### WPS

虽然Manjaro自带Microsoft Office Online，但是这个软件只有联网的时候才能用，而且office online在国内的服务貌似有点问题，长期报错。我还是比较推荐大家使用金山出品的WPS，而且现在已经更新到WPS2019了，UI和以往完全不同，看起来非常舒服。执行下面2步即可安装WPS：

```bash
sudo pacman -S wps-office
sudo pacman -S ttf-wps-fonts
```



## 错误解决

### 无法升级

```
:: 正在同步软件包数据库...
错误：无法升级 core (无法锁定数据库)
错误：无法升级 extra (无法锁定数据库)
错误：无法升级 community (无法锁定数据库)
......
错误：无法同步任何数据库
```

 出现错误的原因是，之前同步的时候，我手动中断了进程，导致之前进程锁文件未被释放。

  解决办法，删掉之前的文件： /var/lib/pacman/db.lck

  删除之后，恢复了。

### 错误：无法提交处理 (无效或已损坏的软件包)

1.首先更新一下密钥，如果没有安装archlinux-keyring,请及时安装

```
sudo pacman-key --refresh-keys
```

2.重新加载相应的签名密钥

```
sudo pacman-key --init
sudo pacman-key --populate
```

3。清除pacman 的缓冲文件

```
sudo pacman -Scc
```

4.更新或者安装系统即可

```
sudo pacman -Syu
```