---
title: "brew（Homebrew 包管理器）"
---

> macOS / Linux 上的包管理器。官网下载走外网很慢，国内一般用 gitee 上的自动安装脚本。

## 安装

- 官网：<https://brew.sh/index_zh-cn>（外网，慢）
- 国内脚本：<https://gitee.com/cunkai/HomebrewCN>

**常规安装（完全体，几分钟）：**

```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

**极速安装（精简版，几秒钟）：**

```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)" speed
```

**卸载：**

```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/HomebrewUninstall.sh)"
```

> M1 芯片上 Homebrew 的安装路径是 `/opt/homebrew/`。
>
> 打不开终端？`command + 空格` → 输入 `terminal` → 回车（[官方说明](https://support.apple.com/zh-cn/guide/terminal/apd5265185d-f365-44cb-8b09-71a064a42125/mac)）。

**常见错误**：<https://gitee.com/cunkai/HomebrewCN/blob/master/error.md>

## Linux 安装 / 卸载

```bash
# 安装
rm Homebrew.sh ; wget https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh ; bash Homebrew.sh

# 卸载
rm HomebrewUninstall.sh ; wget https://gitee.com/cunkai/HomebrewCN/raw/master/HomebrewUninstall.sh ; bash HomebrewUninstall.sh
```

> 参考：Homebrew 国内如何自动安装（Mac & Linux）<https://zhuanlan.zhihu.com/p/111014448>

## brew 有用工具

### fcrackzip（暴力破解 zip）

```bash
brew install fcrackzip
```

`fcrackzip -h` 查看参数，常用：

```bash
fcrackzip -b -c 'aA1!' -l 1-16 -u <文件本地地址>
```

### John The Ripper

```bash
brew install john-jumbo
```

安装后先确认工具目录（注意路径随版本变化）：

```bash
ls -1 /opt/homebrew/Cellar/john-jumbo/1.9.0_1/share/john/ | head -n 10
```

`share/john/` 之前的路径取决于 brew 把包装在哪。这里只列了前 10 个，John 提供的工具集很丰富。

以 rar 举例，先用 `rar2john` 导出哈希：

```bash
/opt/homebrew/Cellar/john-jumbo/1.9.0_1/share/john/rar2john /path/to/file.rar > a.txt
```

再破解。macOS 上要显式指定 `-opencl` 后缀才会调用 GPU（比 CPU 快很多），对象是 dmg 就用 `dmg-opencl`：

```bash
john --format=RAR5-opencl a.txt
```
