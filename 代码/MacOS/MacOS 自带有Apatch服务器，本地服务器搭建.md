## 一、启动服务

```bash
# 启动服务
sudo apachectl start

# 重启服务
sudo apachectl restart

# 关闭服务
sudo apachectl stop
```

通过在浏览器中输入[http://127.0.0.1/](https://link.zhihu.com/?target=https%3A//links.jianshu.com/go%3Fto%3Dhttp%3A%2F%2F127.0.0.1%2F)来测试，如果页面出现 it works，则代表访问成功,本地服务已启动。

## 二、添加文件到服务器

1. 前往[访达](https://zhida.zhihu.com/search?content_id=238409745&content_type=Article&match_order=1&q=访达&zhida_source=entity)地址：`/Library/WebServer/Documents`
2. 将项目放到这里