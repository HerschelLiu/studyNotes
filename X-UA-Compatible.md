**X-UA-Compatible是神马？** 

X-UA-Compatible是IE8的一个专有<meta>属性，它告诉IE8采用何种IE版本去渲染网页，在html的<head>标签中使用。可以在微软官方文档获取更多介绍。

 

**为什么要用X-UA-Compatible？** 

在IE8刚推出的时候，很多网页由于重构的问题，无法适应较高级的浏览器，所以使用X-UA-Compatible标签强制IE8采用低版本方式渲染。 
使用下面这段代码后，开发者无需考虑网页是否兼容IE8浏览器，只要确保网页在IE6、IE7下的表现就可以了。 

```
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
```


使用下面这段代码使用的是Edge 。模式Edge 模式告诉 IE 以最高级模式渲染文档，也就是任何 IE 版本都以当前版本所支持的最高级标准模式渲染，避免版本升级造成的影响。简单的说，就是什么版本 IE 就用什么版本的标准模式渲染。

```
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```

 

使用以下代码强制 IE 使用 Chrome Frame 渲染

```
<meta http-equiv="X-UA-Compatible" content="chrome=1">
```

 

**最佳的兼容模式方案：**

```
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
```

 **ps：**

为防止失效，X-UA-Compatible最好紧跟在head之后，之前不要有任何不标准的标签。