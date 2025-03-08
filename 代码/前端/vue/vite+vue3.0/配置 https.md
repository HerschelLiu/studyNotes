## 第一种：使用插件@vitejs/plugin-basic-ssl

安装依赖

```js
// vite.config

import basicSsl from '@vitejs/plugin-basic-ssl'

plugins: [vue(), basicSsl()],
server: {
  https: true,
}

```

**注意：**这种方式会让浏览器提示不安全

> 还有一个插件`vite-plugin-mkcert`，但是配置 `https: true`报错，就不考虑了

## 使用[mkcert](https://github.com/FiloSottile/mkcert/releases)（强烈推荐）

用于简化本地HTTPS环境设置，自动生成并信任本地CA证书

```bash
# 初次安装后都要运行以下命令安装根证书
[命令] -install

# github下载
# 查看根证书位置
mkcert-v1.4.4-windows-amd64.exe -CAROOT

# 生成自签证书。直接跟多个要签发的域名或 ip 就行了，比如签发一个仅本机访问的证书(可以通过127.0.0.1和localhost，以及 ipv6 地址::1访问)：
mkcert-v1.4.4-windows-amd64.exe localhost 127.0.0.1 ::1 192.168.2.25

# 苹果
brew install mkcert
brew install nss # 兼容 firefox 或者其他基于 nss 的应用

# win 使用choco
# 安装choco
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

choco install mkcert
```

如果你是前端项目，可以在项目根目录下创建certs文件夹，将刚创建的证书添加进去，然后配置webpack或者vite的配置文件，然后重新启动项目就可以了：

```js
import fs from 'fs'

https: {
  key: fs.readFileSync('./certs/localhost-key.pem'),
  cert: fs.readFileSync('./certs/localhost.pem')
}
```

