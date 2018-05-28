## 解决H5页面在iOS网页中的数字被识别为电话号码

造成该问题的原因在于Safari浏览器的问题：  解决该问题只需在head标签中添加如下代码即可解决。 

```
<meta name = "format-detection" content = "telephone=no">
```

