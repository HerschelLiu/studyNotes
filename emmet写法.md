**一、快速编写HTML代码** 

**1.  初始化** 

HTML文档需要包含一些固定的标签，比如<html>、<head>、<body>等，现在你只需要1秒钟就可以输入这些标签。比如输入“!”或“html:5”，然后按Tab键： 



 

![img](http://dl.iteye.com/upload/attachment/0083/2329/0070e820-1cbf-3f42-8c5b-838e5774d02b.gif)

- html:5 或!：用于HTML5文档类型
- html:xt：用于XHTML过渡文档类型
- html:4s：用于HTML4严格文档类型

**2.  轻松添加类、id、文本和属性** 

连续输入元素名称和ID，Emmet会自动为你补全，比如输入p#foo： 



![img](http://dl.iteye.com/upload/attachment/0083/2331/cb250aef-3b60-3297-86ba-8c3ed36cacad.gif)



连续输入类和id，比如p.bar#foo，会自动生成： 



Html代码 

 1 <p class="bar" id="foo"></p>  


下面来看看如何定义HTML元素的内容和属性。你可以通过输入h1{foo}和a[href=#]，就可以自动生成如下代码：



Html代码 

 

```
1 <h1>foo</h1>  
2 <a href="#"></a> 
```

 

 

![img](http://dl.iteye.com/upload/attachment/0083/2333/167e1956-4ac6-3b6d-9025-8bf90fee1250.gif)



**3.  嵌套** 

现在你只需要1行代码就可以实现标签的嵌套。 



- \>：子元素符号，表示嵌套的元素
- +：同级标签符号
- ^：可以使该符号前的标签提升一行

效果如下图所示： 



![img](http://dl.iteye.com/upload/attachment/0083/2335/47ae82f5-4fd8-36a1-9b4e-d148237537ee.gif)



**4.  分组** 

你可以通过嵌套和括号来快速生成一些代码块，比如输入(.foo>h1)+(.bar>h2)，会自动生成如下代码： 



Html代码 

1. ```
   1 <div class="foo">  
   2   <h1></h1>  
   3 </div>  
   4 <div class="bar">  
   5   <h2></h2>  
   6 </div>  
   ```

    

![img](http://dl.iteye.com/upload/attachment/0083/2337/ae3a8b58-244a-3680-9f0c-d0cab459fc41.gif)



**5.  隐式标签** 

声明一个带类的标签，只需输入div.item，就会生成<div class="item"></div>。 

在过去版本中，可以省略掉div，即输入.item即可生成<div class="item"></div>。现在如果只输入.item，则Emmet会根据父标签进行判定。比如在<ul>中输入.item，就会生成<li class="item"></li>。 



![img](http://dl.iteye.com/upload/attachment/0083/2339/363af658-650f-38d1-ad0e-9608df9d2873.gif)



下面是所有的隐式标签名称： 



- li：用于ul和ol中
- tr：用于table、tbody、thead和tfoot中
- td：用于tr中
- option：用于select和optgroup中

**6.  定义多个元素** 

要定义多个元素，可以使用*符号。比如，ul>li*3可以生成如下代码： 



Html代码 

```
1 <ul>  
2   <li></li>  
3   <li></li>  
4   <li></li>  
5 </ul>  
```

 





![img](http://dl.iteye.com/upload/attachment/0083/2341/cf5613ac-4198-326e-a651-a08ad206800a.gif)



**7.  定义多个带属性的元素** 

如果输入 ul>li.item$*3，将会生成如下代码： 



Html代码 

```
1 <ul>  
2   <li class="item1"></li>  
3   <li class="item2"></li>  
4   <li class="item3"></li>  
5 </ul>  
```





![img](http://dl.iteye.com/upload/attachment/0083/2343/a1c5f9d8-d187-3bde-895b-2e14fb428184.gif)



**二、CSS缩写** 

**1.  值** 

比如要定义元素的宽度，只需输入w100，即可生成 



Css代码 

1. width: 100px;  

 

![img](http://dl.iteye.com/upload/attachment/0083/2345/21a47a7c-2d38-3231-8b4b-7d15f38be57a.gif)



除了px，也可以生成其他单位，比如输入h10p+m5e，结果如下： 



Css代码 

1. height: 10%;  
2. margin: 5em;  



单位别名列表： 



- p 表示%
- e 表示 em
- x 表示 ex

**2.  附加属性** 

可能你之前已经了解了一些缩写，比如 @f，可以生成： 



Css代码 

```
1 @font-face {  
2   font-family:;  
3   src:url();  
4 }  
```

 

一些其他的属性，比如background-image、border-radius、font、@font-face,text-outline、text-shadow等额外的选项，可以通过“+”符号来生成，比如输入@f+，将生成： 



Css代码 

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
 1 @font-face {  
 2   font-family: 'FontName';  
 3   src: url('FileName.eot');  
 4   src: url('FileName.eot?#iefix') format('embedded-opentype'),  
 5      url('FileName.woff') format('woff'),  
 6      url('FileName.ttf') format('truetype'),  
 7      url('FileName.svg#FontName') format('svg');  
 8   font-style: normal;  
 9   font-weight: normal;  
10 }  
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

 

![img](http://dl.iteye.com/upload/attachment/0083/2347/2c8cccf4-be54-3190-b1e7-3713717e2a78.gif)



**3.  模糊匹配** 

如果有些缩写你拿不准，Emmet会根据你的输入内容匹配最接近的语法，比如输入ov:h、ov-h、ovh和oh，生成的代码是相同的： 



Css代码 

1. overflow: hidden;  

 

![img](http://dl.iteye.com/upload/attachment/0083/2349/4c2c81e2-ebba-367e-a4fd-4f667d08ca84.gif)



**4.  供应商前缀** 

如果输入非W3C标准的CSS属性，Emmet会自动加上供应商前缀，比如输入trs，则会生成： 



Css代码 

```
1 -webkit-transform: ;  
2 -moz-transform: ;  
3 -ms-transform: ;  
4 -o-transform: ;  
5 transform: ;  
```

 

 

![img](http://dl.iteye.com/upload/attachment/0083/2351/a68eda57-f573-343c-81b8-19e0a48c08fe.gif)



你也可以在任意属性前加上“-”符号，也可以为该属性加上前缀。比如输入-super-foo： 



Css代码 

```
1 -webkit-super-foo: ;  
2 -moz-super-foo: ;  
3 -ms-super-foo: ;  
4 -o-super-foo: ;  
5 super-foo: ;  
```

 

如果不希望加上所有前缀，可以使用缩写来指定，比如-wm-trf表示只加上-webkit和-moz前缀： 



Css代码 

```
-webkit-transform: ;  
-moz-transform: ;  
transform: ;  
```

 


前缀缩写如下： 



- w 表示 -webkit-
- m 表示 -moz-
- s 表示 -ms-
- o 表示 -o-

**5.  渐变** 

输入lg(left, #fff 50%, #000)，会生成如下代码： 



Css代码 

1. ```
   1 background-image: -webkit-gradient(linear, 0 0, 100% 0, color-stop(0.5, #fff), to(#000));  
   2 background-image: -webkit-linear-gradient(left, #fff 50%, #000);  
   3 background-image: -moz-linear-gradient(left, #fff 50%, #000);  
   4 background-image: -o-linear-gradient(left, #fff 50%, #000);  
   5 background-image: linear-gradient(left, #fff 50%, #000);  
   ```

    

 

![img](http://dl.iteye.com/upload/attachment/0083/2353/f39213f9-5d68-3728-8cf3-7964aaa02bae.gif)



**三、附加功能** 

**生成Lorem ipsum文本** 

Lorem ipsum指一篇常用于排版设计领域的拉丁文文章，主要目的是测试文章或文字在不同字型、版型下看起来的效果。通过Emmet，你只需输入lorem 或 lipsum即可生成这些文字。还可以指定文字的个数，比如lorem10，将生成： 



引用

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero delectus.

 

![img](http://dl.iteye.com/upload/attachment/0083/2355/87a3d500-1798-3050-b7e0-df51c94bd203.gif)