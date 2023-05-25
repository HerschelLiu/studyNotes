## 方法一（很麻烦）、如果页面为单页面，且要放入php其中的一个子文件夹路径，则使用如下方法

### 发行h5

1. 进入`manifest.json`，点击`h5配置`，其中路由模式选择hash（可以不选，默认为hash，选了页没看出有什么用）;`运行路径`为空就好，如果填上后，点击运行按钮则会以此路径取运行，例如填`、test`，域名（源码视图，h5下的domain）为`server.cn`,则运行后为`http://server.cn/test/...`，猜测如果不是在子文件夹，而是 在根目录的话，是需要填写的；`源码视图`的h5下增加字段"publicPath",设置这个后，发行后的`index.html`中引入文件的地址就是他，否则按照`运行路径`中填写的值。在php中，所有资源会放在`public/static/`下，所以`publicPath`值填为`__STATIC__/文件夹名`
2. 点击发行，出来的弹窗的网站域名项不填写

### 配置php

1. 将发行的h5文件中，index.html放入php子文件夹中，并将index.html改名为php配置的相应的名字
2. 将整个static文件夹放入到`public/static/你的新建文件夹`(例如goodsDetail)中
3. 打开static/js/中index.xxxx.js文件，搜索"publicPath"设置的值，即搜索`l.p=....`,将值改为"publicPath"设置的值`../../static/移入文件的最外层路径`（`../../static/goodsDetail/`）。<font color=red>如果不加上`../../`而是原来的路径"\_\_STATIC\_\_/goodsDetail/"会造成结果为`http://server.cn/merchant/Goods/__STATIC__/goodsDetail/`,首先不会转义“__STATIC__”，其次路径也不对，应该是根目录的public/static下，找不到路径，所以报错</font>

**注：1. 页面中不能出现php模板写法，例如接口的"{:url('merchant/Goods/getGoodsInfoApi')}";**

​       **2. 获取参数，不能在"onLoad(e)"中使用"e,xxx"来获取，要写一个函数来获取**

```js
getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
},
```

## 方法二（选它！）

### 

在uni-app项目的manifest.json中，选择h5配置。

* 路由模式选择history(hash的话，网址会多出一个#号，例如`www.server.cn/h5/#/`)
* 运行的基础路径必须填写，例如`/h5/`
* 在thinkPHP的public文件夹下创建同名文件夹（例如：新建名为h5的文件夹）
* 将发行后生成的文件复制进新建好的文件夹下
* 部署完成