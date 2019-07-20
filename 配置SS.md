## 配置
1. `wget --no-check-certificate -O shadowsocks-all.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks-all.sh`
2. `chmod +x shadowsocks-all.sh`
3. `./shadowsocks-all.sh 2>&1 | tee shadowsocks-all.log`
4. 选择go语言
5. 输入密码
6. 输入端口号，一半默认就行
7. 任意键继续
8. `$ vim /etc/sysconfig/iptables`
9. `-A INPUT -p tcp -m state --state NEW -m tcp --dport 你的端口号 -j ACCEPT`
10. `service iptables save`可能会报错，不用管
11. 端口号可以先打开，也可以配置完再打开。去阿里云，选择防火墙，打开端口号

**<font color="red">阿里云的服务器不需要8和9</font>**

## 购买服务器(阿里云为例)
1. 进入[阿里云官网](https://cn.aliyun.com/?utm_content=se_980103&gclid=Cj0KCQjw1MXpBRDjARIsAHtdN-28Pd5aXwXTsfcZZHEDpEiTJ21wlmbOxp5BoXUTSe8NCJDA3QAdc8IaAs5jEALw_wcB)
2. 产品与服务 -> 弹性计算 -> 轻量应用服务器 -> 立即购买
3. 选择香港 -> 系统镜像 -> CentOS -> 立即购买

## 开启TCP BBR拥塞控制算法

可以将带宽跑满,使用CentOS 7

[开启TCP BBR拥塞控制算法](https://www.liuboping.com/%e5%bc%80%e5%90%aftcp-bbr%e6%8b%a5%e5%a1%9e%e6%8e%a7%e5%88%b6%e7%ae%97%e6%b3%95/)

### CentOS 7

1. 下载更换内核
	```
	rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
	rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-3.el7.elrepo.noarch.rpm
	yum --enablerepo=elrepo-kernel install kernel-ml -y
	```

2. 查看内核是否安装成功

   ```
   rpm -qa | grep kernel
   ```

3. 删除旧内核(可选)

   ```
   rpm -ev 旧内核
   ```

4. 更新 grub 系统引导文件并重启

   ```
   egrep ^menuentry /etc/grub2.cfg | cut -f 2 -d \'
   grub2-set-default 0  # default 0 表示第一个内核设置为默认运行, 选择最新内核就对了
   reboot
   ```

   注意，某些服务商（如 [Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-update-a-digitalocean-server-s-kernel)）可能需要首先将 VPS 配置为可自定义内核，然后 grub2 的配置才会生效。重新启动后，如果会出现 “read-only file system” 的错误，root账户下执行 `mount -o remount rw /` 即可

5. 更新到最新版内核`yum --enablerepo=elrepo-kernel update -y reboot`

### 开启bbr

开机后 `uname -r` 看看是不是内核 >= 4.9执行 `lsmod | grep bbr`，如果结果中没有 `tcp_bbr` 的话就先执行

```
modprobe tcp_bbr
echo "tcp_bbr" >> /etc/modules-load.d/modules.conf
```

执行

```
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
```

保存生效
`sysctl -p`

执行

```
sysctl net.ipv4.tcp_available_congestion_control
sysctl net.ipv4.tcp_congestion_control
```

如果结果都有 `bbr`, 则证明你的内核已开启 bbr

执行 `lsmod | grep bbr`, 看到有 tcp_bbr 模块即说明 bbr 已启动