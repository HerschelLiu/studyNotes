# 移动WEBAPP开发常规CSS样式总结

复制从[csdn的[adobe1992](https://blog.csdn.net/liaozhongping)](https://blog.csdn.net/liaozhongping/article/details/52024942)

我所使用到的HTML页面标签：

Section,div,artical,p,ol,ul,li,header,footer,span,form,input,label,h1,h2,h3 ；详细说明我就不说了，只给新手说下，为什么W3C那么多标签，只使用16个就可以把整个项目解决了？

原因是不要以为标签多，我们就一定要使用到它的，我们要的是使用广泛的，易记的。

稍微解释下，块级元素和行内元素是什么意思？

块级元素就是他占满一行的；行内元素就是他的多个同类可以同时在同一行。

下面讲解下，head标签里面我们在移动端一般都放什么？

Title,meta,link,3个标签会比较多，解释请看：

Title:该网页的标题，这个标题一般会显示在浏览器打开该网页时，最地址栏上面可以简单文字段。

Meta:

<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;" name="viewport"/>

<meta content="yes"name="apple-mobile-web-app-capable"/>

<meta content="black"name="apple-mobile-web-app-status-bar-style"/>

<meta content="telephone=no"name="format-detection"/>

<meta content="email=no"name="format-detection"/>

<meta content="initial-scale=1.0,user-scalable=no,maximum-scale=1" media="(device-height: 568px)" name="viewport" />

第一个meta标签表示：强制让文档的宽度与设备的宽度保持1:1，并且文档最大的宽度比例是1.0，且不允许用户点击屏幕放大浏览；user-scalable: 用户是否可以手动缩放

第二个meta标签是iphone设备中的safari私有meta标签，它表示：允许全屏模式浏览；

第三个meta标签也是iphone的私有标签，它指定的iphone中safari顶端的状态条的样式；

第四个meta标签表示：告诉设备忽略将页面中的数字识别为电话号码

第五个meta标签:用于忽略将页面中邮件地址

第六个就是最大的高度限定在568Px以内，这个可以忽略，因为我们都会用滑动来代替；当然了，可以用在页面布局不多的地方！

 

Link:一般只是引入css文件用的，对于import大部分前辈都说不好，而且他一般也只写在css文件内。我们假如打开一个刚刚下载到本地的网页或框架，浏览页面时很慢，估计也就是在css里面引入了谷歌文件，因为我们国内，谷歌是被封杀的！

Javascript呢？(一般情况下，把引入文件放到</body>前面的)

下面解释放到head和</body>2个不同地方的区别：

放在head就是普遍需要用户进行点击或各种操作才触发的事件。

放在</body>里面就是用户来看之前就执行了。

 

现在我们来看看CSS的问题了：

1，我相信99%做过1个项目的人都会了解：reset.css(重置文件或common.css,base.css，名称不一样而已，用途都一样。)

我会共享我自己今年所总结积累好的文件写到common.css里面。

```
@charset "utf-8";



html,body{background:#f0f0f0;color:#505050;font-size:62.5%;-webkit-user-select:none;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color:transparent;-webkit-user-select:none;-webkit-touch-callout:none;-webkit-touch-callout:none;}



body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section {margin:0;padding:0;}



body,button,input,select,textarea {font:14px \5b8b\4f53,'Helvetica Neue',Arial,'Liberation Sans',FreeSans,'Hiragino Sans GB',sans-serif\"Microsoft YaHei"\"微软雅黑";line-height:20px;}



h1{font-size:24px;}



h2{font-size:22px;}



h3{font-size:18px;}



@media only screen and (min-width:360px) {



    h1{font-size:28px;}



    h2{font-size:26px;}



    h3{font-size:22px;}



    body,button,input,select,textarea {font-size:18px;line-height:26px;}



}



h1,h2,h3,h4,h5,h6 {font-weight:normal;}



html, body, form, fieldset, p, div, h1, h2, h3, h4, h5, h6 {-webkit-text-size-adjust:none;}/*阻止旋转屏幕时自动调整字体大小*/



textarea{resize:none;}



/*取消按钮在inphone上的默认样式*/



input[type=button]{-webkit-appearance:none;outline:none} 



input::-webkit-input-placeholder{color:#F0F0F0;}



textarea::-webkit-input-placeholder{color:#F0F0F0;}



input::-webkit-input-speech-button {display:none}



table {border-collapse:collapse;border-spacing:0;}



th {text-align:inherit;}



fieldset,img {border:none;}



abbr,acronym {border:none;font-variant:normal;}



del {text-decoration:line-through;}



ol,ul {list-style:none;}



caption,th {text-align:left;}



sub,sup {font-size:75%;line-height:0;position:relative;vertical-align:baseline;}



sup {top:-0.5em;}



sub {bottom:-0.25em;}



ins,a,a:hover {text-decoration:none;}



a:focus,*:focus {outline:none;}



.clearfix:before,.clearfix:after {content:"";display:table;}



.clearfix:after {clear:both;overflow:hidden;}



.clearfix {zoom:1;}



.clear {clear:both;display:block;font-size:0;height:0;line-height:0;overflow:hidden;}



.hide {display:none;}



.block {display:block;}



.outL{white-space:normal;word-break:break-all;width:100px;}



.outH{overflow:hidden;text-overflow:ellipsis;white-space:nowrap; width:100px;}



/*布局*/



.fl{float:left;display:inline;}



.fr{float:right;display:inline;}



.cb{clear:both;}



.cl{clear:left;}



.cr{clear:rigth;}



.rel{position:relative;}



.abs{position:absolute;}



.tac{text-align:center;}



.tal{text-align:left;}



.tar{text-align:right;}



.dib{display:inline-block;}



.vab{vertical-align:bottom;}



.vam{vertical-align:middle;}



.vat{vertical-align:top;}



/*网格*/



.box{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;height:100%;text-align:center;padding:5px 0;}



.grid,.wrap,.grid:after,.wrap:after,.grid:before,.wrap:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}



.grid{*zoom:1}



.grid:before,.grid:after{display:table;content:"";line-height:0}



.grid:after{clear:both}



.grid{list-style-type:none;padding:0;margin:0}



.grid>.grid{clear:none;float:left;margin:0 !important}



.wrap{float:left;width:100%}



/*网格*/



/*flex*/



.col{height:100%;display:-webkit-box;-webkit-box-orient:vertical;display:flex;display:-webkit-flex;flex-direction:column;}



.row{display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;flex-direction:wrap;display:-webkit-box;-webkit-box-orient:horizontal;-webkit-box-lines:multiple;width:100%;height:auto;margin:auto;}



.flex1{-webkit-box-flex:1;-webkit-flex:1;flex:1;}



.flex2{-webkit-box-flex:2;-webkit-flex:2;flex:2;}



.flex3{-webkit-box-flex:3;-webkit-flex:3;flex:3;}



/*flex*/



/*容器*/



.wrapper{position:absolute;top:0;right:0;bottom:0;left:0;padding:5px 5px 60px 5px;overflow:auto;margin-top:44px;-webkit-overflow-scrolling:touch;}



/*头尾*/



header,footer{position:fixed;right:0;left:0;z-index:1;text-align:center;background:#CCCCCC;}



header{top:0;height:44px;}



footer{bottom:0;}



 



/*宽度*/



.w100p{width:100%}



.w20p{width:20%;}



 



/*边距*/



.m5{margin:5px;}



.p5{padding:5px;}



.pt5{padding-top:5px;}
```

　　

注意事项：

1、你使用display:inline-block浏览器是会有默认边距产生的，所以假如想几个div变成行内的而且无边距，那么最好的方法是使用同一方向的浮动(float)，来解决无边距的一列。

2、引入我的css文件后，你会发现为什么我在字体上要进行个断点设置(@media)，我认真的分析过，webapp页面的由于在320px,360px,480px，3个不同viewport宽度大小的情况下制作，那么字体大小肯定要进行相应的设置，不然你在320px的情况下看到的效果跟在480px下看到的是一样。注意：字体是不会自适应的，只有自己进行设置才可以达到预期效果。

3、图标是同样不会自适应的，只有图片可以设置100%，所以图标假如设置100%就会影响整体布局，宽度可以在Img里面写width=”30”这样(30是图片的宽度30px)。

4、除了有时header，footer是要求固定fixed定位外，那么中间要做一个容器/外套给他，我们需要在header下面使用wrapper/container放内容。这个怎么设置，你可以看我的css文件已经做好设置而且包括了案例方便查看。并且可以进行内容过多可以滑动。(关于fixed定位的问题，我多次测试的结果发现，在2.3系统以下的低端手机是不支持fixed定位的，是会出现设备兼容问题:向下滑动时，固定后也会随着页面移动，4.0以上的系统是可以支持，相对较好的解决方法是：使用iscoll.js；会有卡顿，但是对于低端机来讲是不错的解决方案。)我个人是选择放弃2.3系统以下的用户群，因为现在的手机1000元左右就可以买到4.0系统以上的手机，所以，我有理由相信连手机都不愿意更换的普遍有2种情况：1，没钱，2，根本不可能成为你的用户；我不会像PC端那样来兼容IE6-8，我现在唯一兴幸的是公司现在没特定标准要求，所以我可以自由选择，我只需要知道这个解决方法就行；我既然放弃低端机市场，那么我就会以最新的技术来进行布局，所以我不使用iscoll.js，直接用我上面的那个wrapper来作为外套就行。

5、我们如果需要将内容实现2边留有边距，使用的是padding而不是margin。因为设置为margin的话，会出现左边有空白边距，右边反而是贴边的情况。

6、我们做前端写页面最烦的就是class命名，我不喜欢使用下划线，所以我们可以这样来定义class命名方式：asideContent等情况。还有一种叫意义命名；比如说颜色：红色，我们可以定义为：.red:color:red；模块呢？我们可以这样来做：比如我最近做的一个WP手机风格的webapp页面项目。大家都应该了解他是色块组成，颜色，大小等都不一样。

我的解决方案是：(在销售模块，定义为sell)

sellHead:内容的头部；sellFoot:内容的尾部；

如此类推就有：sellMain；sellContent；sellTitle；sellList；sellTab；sellMenu；sellBtn；sellMsg；sellBanner；sellCol； 

我相信你们看到英文都容易的理解这个是什么意思，位置对应情况。

7、从有了前端这个职称后，就逐渐开始流行：OOCSS的写法来布局CSS页面了。是什么意思？就是用面向对象编程的思想来写CSS，因为现在有了Less,Sass这些了，CSS都可以实现编程了，我们前端的压力就越来越大了。最主要的一点就是实行模块化，代码可以重复使用。对于没编程基础的童鞋来说，真心不懂这些专业的术语是个什么东东？大家可以看看下面我的解释：

(1)、.sellContent{width:200px;height:200px;margin:10px;padding:10px}

注意：背景颜色，边框，圆角这些就不要写在里面了

(2)、.bg{background:#00CC66}；在HTML页面的class=”sellContent bg”。

(一)、实现的是class组合，同时这2个class类是哪里需要往哪里放，需要什么呢？当然是他里面的属性，只要是他需要该属性的都可以放到一起组合。(组合一般情况下不要超过4个)

(二)、以前我们写css可能是遇到到哪个div需要就给他定义那些属性值，而且整个页面下来重复的特别多；现在我这样方式不需要了，我们可以用并列式选择器：.sellMain,.sellContent,.sellTitle{border:1px solid #cccccc}，减少代码重复的情况，同时继承选择器的作用我们就要注意了：一个项目下来，我们写的页面会达到100个以上，假如我写 ul li{display:inline-block}这样的话，那么你每个页面只要有li的，他都会是变成行内元素。

所以，我们写页面前必须要先把整个项目的所有页面看一次，脑袋进行一次布局，这样就不会出现这类的问题了。要全面的去理解这个OOCSS的写法，建议你去下载Bootstrap框架文件来看他的源码，和页面案例的布局。

8、区分min-width和max-width的区别，英文我们都看懂，但用的话就不一定了；min-width：最小的宽度为多少的时候开始执行下面的断点布局；max-width：最大的宽度为多少的时候停止执行下面的断点布局。

如：min-width:360px and max-width:480px,就是下面的类只在360px-480px之间执行。

注意：有时候我们在谷歌或火狐浏览器做测试的，然后放到真机测试时会发现，真机有时候会比浏览器显示的viewport宽度还要小3px—5px。

9、做头部的时候我往往最讨厌的就是图片和文字对齐；现在我找到新的解决放案了：

(1)、可以把这个img给他一个下边距:负值；

(2)、有3个属性值可以选择来用vertical-align:top/middle/bottom  。

10、我们做移动端的时候，凡是有a标签点击转链接的地方都会系统自带一个透明层的点击效果，取消点击高亮：-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color: transparent;

11、响应式布局与自适应布局：(以下仅为个人理解)

(1)、响应式布局，我的理解是在电脑，平板，手机，分别有不同的页面布局。

(2)、自适应布局，我的理解是在电脑，平板，手机页面布局一样，只是文字大小，图片大小会发生变化而已。

在电脑上，使用flex-wrap:wrap（伸缩进行换行）这个来进行布局是可以达到响应的，但是在平板和手机就目前来说还不支持这个属性。

我推荐的最佳方案是使用flex布局。(只是不用伸缩换行属性)

下面是我做的一个简单案例：

注意：style.css引用的是上面提供的common.css文件：

```
<!DOCTYPE html>



<html>



<head>



    <title>首页</title>



    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />



    <!--开发后删除-->



    <meta http-equiv="Cache-Control" name="no-store" />



    <meta http-equiv="refresh" content="3" />



    <!--开发后删除-->



    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">



    <meta name="HandheldFriendly" content="true" />



    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />



    <meta name="apple-mobile-web-app-capable" content="yes" />



    <meta content="black" name="apple-mobile-web-app-status-bar-style" />



    <meta content="telephone=no" name="format-detection" />



    <link rel="stylesheet" href="css/style.css" />



    <style>



        .flexcontent{margin:5px 1px;-webkit-flex:1;flex:1;-webkit-box-flex:1;background:hotpink;}



    </style>



</head>



 



    <body>



        <header>



            <ol class="row">



                <li class="m5">



                    <img src="img/back.png" width="30" /> </li>



                <li class="flex3 m5">



                    <h1>header</h1>



                </li>



                <li class="m5">



                    <img src="img/down.png" width="30" />



                </li>



            </ol>



        </header>



        <section class="wrapper">



            <ul class="row">



                <li class="flexcontent p5">1</li>



                <li class="flexcontent p5">2</li>



                <li class="flexcontent p5">3</li>



                <li class="flexcontent p5">4</li>



                <li class="flexcontent p5">5</li>



            </ul>



            <ul class="row">



                <li class="flex1 flexcontent p5">1</li>



                <li class="flex3 flexcontent p5">2</li>



                <li class="flex2 flexcontent p5">3</li>



            </ul>



        </section>



        <footer class="row tac">



            <ul class="col w20p">



                <li class="flex1 pt5"><img src="img/back.png" width="20" /></li>



                <li class="flex1"><span>底部</span></li>



            </ul>



            <ul class="col w20p">



                <li class="flex1 pt5"><img src="img/back.png" width="20" /></li>



                <li class="flex1"><span>底部</span></li>



            </ul>



            <ul class="col w20p">



                <li class="flex1 pt5"><img src="img/back.png" width="20" /></li>



                <li class="flex1"><span>底部</span></li>



            </ul>



            <ul class="col w20p">



                <li class="flex1 pt5"><img src="img/back.png" width="20" /></li>



                <li class="flex1"><span>底部</span></li>



            </ul>



            <ul class="col w20p">



                <li class="flex1 pt5"><img src="img/back.png" width="20" /></li>



                <li class="flex1"><span>底部</span></li>



            </ul>



        </footer>



        



    </body>



</html>
```

　　CSS3的animate.css动态的使用介绍：

```
<!DOCTYPE html>



<html>



<head>



<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />



<title>animate.css 使用方法</title>



<link rel="stylesheet" type="text/css" href="css/animate.min.css" media="screen" />



<style>



 



#bridge{



    border-radius: 15px;



    background: url('images/bridge.png') no-repeat 50% 50%;



    margin: 0 auto;



    width: 400px;



    height: 250px;



    z-index: 20;



    position: static;



}



 



</style>



 



</head>



 



<body>



 



<div id="bridge" class="animated flash">



<!--只需要在相关的块级标签内添加class；



例如：



class="animated bounceOutLeft"



class="animated flash"







-->



</div>



 



</body>



</html>
```

　　

分析开发的断点：

(1)、国内市场普遍的viewport宽度是320px和360px，像Note2才400px；分辨率，像素这些词语一般是告诉给设计师，我们前端要明白的是viewport；

(2)、字体大小：我相信有部分童鞋会认为浏览器会自适应让你页面的字体随着不同的屏幕大小而自动适应，我告诉你，你错了！

这些字体自适应都是人为设置出来的，我推荐的方案是：

body{font:14px line-height:20px}//网页整体字体以14px为主。

h1,h2,h3,h4,h5,h6 {font-size:100%;font-weight:500;}

h1{font-size:24px}

h2{font-size:22px}

h3{font-size:18px}

@media only screen and (min-width:360px) {

body,button,input,select,textarea {font-size:18px;line-height:26px;}

h1{font-size:28px}

h2{font-size:26px}

h3{font-size:22px}

}

 

(3)、class类控制分析：

看到上面大概也了解怎么使用@media了吧；

另外，定义类名的第一个重要性就在这里了：因为你要控制一个class类在320px或360px不同的屏幕上有适应屏幕大小的样式结构！

 

(4)、我们开发时，一般要做到兼容的浏览器普遍是国内的浏览器(苹果的浏览器都是webkit内核)：UC，QQ，360，百度，这些浏览器是国内使用用户量最大的浏览器厂商，虽然不是内核都一样，但是普遍的兼容问题还不是很多，所以我们优先选择兼容的是webkit内核的。

(5)、前端开发性能优化(个人总结建议)：

一、单个文件大小不要超过14KB；插件不要超过25KB。

二、优先选择使用字体图标，非要用上图片的话，就使用CSS Sprite方法。同时，将整合到一张图片的图标集合和在网站或webapp不常用的图片进行压缩。

三、seo优化问题：我们常写代码时会经常忽略这个标签会带上title,alt等这些可以填上关键词的地方，这个是必须要说明下，不过在手机端的话，这个好像还真用不上吧。

四、CSS，JS以模块化形式来做项目，CSS:我们可以用@import url('form.css')这样的形式来操作，把多个不同的css来分开写，然后逐个引入；问题是：@import是页面先加载完html再加载css，所以这个你得考量，这个文件是在什么情况下才使用好;JavaScript：我们可以使用sea.js或require.js来操作，网上有相关的指导教程，你可以百度或谷歌一下。

五、利用CDN技术，减轻空间资源；对企业来讲，这个风险有点大；因为手机用户的网络差时会出现文件不一定能及时加载等问题。

六、图片多使用PNG8来达到优化效果。

七、少对图片进行硬性设置宽高。

八、减少页面请求：CSS，JS，图片数量的多少会对请求有影响；同时要注意class类组合一般情况下不要超过4个，超过的尽量以取个新的class类名来定义会好点。

九、减少DOM访问次数，加载数量多了就影响访问速度。

十、不要出现404页面，避免重定向。

十一、减少cookies体积，设置合理的过期时间。

十二、缓存ajax，用get方式提交；form以post方式提交。