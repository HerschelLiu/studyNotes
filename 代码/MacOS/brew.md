## [官网](https://brew.sh/index_zh-cn)

其命令是外网，很慢

## [国内](https://gitee.com/cunkai/HomebrewCN)

基于gitee上某大神的自动安装脚本

```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

卸载

```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/HomebrewUninstall.sh)"
```

> 在M1芯片上，homebrew的安装路径为："/opt/Homebrew/”

## brew有用工具

### 暴力破解zip

```bash
brew install fcrackzip
```

在终端输入 `fcrackzip -h` 命令可以查看关于压缩时的详细参数



```bash
fcrackzip -b -c 'aA1!' -l 1-16 -u <文件本地地址>
```

### John The Ripper

```bash
brew install john-jumbo
```

安装完成后，输入以下内容，找到 John Ripper 的工具信息：

```bash
ls -1 /opt/homebrew/Cellar/john-jumbo/1.9.0_1/share/john/ | head -n 10
```

`share/john/`之前的路径看brew安装在哪了。

这个命令其实只列出了头部 10 个文件，John The Ripper 其实提供了非常丰富的工具集：

rar为例子: `rar2john``/opt/homebrew/Cellar/john-jumbo/1.9.0_1/share/john/rar2john <文件地址> > xxx.hash`:将加密的 文件传递给rar2john命令并将它的哈希值输出到 .hash 文件:

```bash
 /opt/homebrew/Cellar/john-jumbo/1.9.0_1/share/john/rar2john /Users/herschel/Documents/Book/日语/01.大家的日语（第二版）初级/大家的日语（第二版）初级.rar > a.txt # 文件名随意.文件会输出到当前打开终端的地址
```

破解：

这里可以直接使用 John 工具进行。为确保 macOS 调用 GPU 进行破解（因为这种计算 GPU 效率是 CPU 的好多倍），务必在命令中指定 `-opencl` 后缀，例如，破解对象是 dmg 的话，加就入 `dmg-opencl`，能明显提升破解效率。

```bash
 john --format=RAR5-opencl a.txt
```

