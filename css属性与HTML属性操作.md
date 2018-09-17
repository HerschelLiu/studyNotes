​                第11单元 css属性与HTML属性操作

11.1 行内样式

​    11.1.1 style属性

​        // 设置节点样式 ==> 行内样式

​            dom.style.styleName = styleValue;

​            // 一个一个设置

​            styleName ==> 样式名 ==> 驼峰写法

​            box.style.fontSize = "20px";

​            box.style.backgroundColor = "20px";

​    11.1.2 style.cssText

​        // 设置节点样式 ==> 行内样式

​            dom.style.cssText = "stylename:stylevalue;...";

​            // 一次性设置

​            box.style.cssText = "width:200px;height:200px;background:red;font-size:30px;position:absolute;left:300px;top:200px";

11.2 class类样式

    <div id="box" class="box1 box2 box3"></div>

​    11.2.1 className属性

​        1) 获取 ==> 读

​            console.log( box.className );// "box1 box2 box3"

​        2) 设置 ==> 写

​            // 覆盖

​            box.className = "active";//==><div id="box" class="active"></div>

​            // 添加

​            box.className += " active";//==><div id="box" class="box1 box2 box3 active"></div>

​    11.2.2 classList对象

​        classList ==> 节点class属性值的列表

​        console.log( box.classList );//["box1","box2","box3"]

​        // 为某个节点添加一个类

​        dom.classList.add("active");

​        // 为某个节点删除一个类

​        dom.classList.remove("active");

​        

​        add(value) ：将给定的字符串值添加到列表中。如果值已经存在，就不添加了。

​     contains(value) ：表示列表中是否存在给定的值，如果存在则返回 true ，否则返回 false 。

​     remove(value) ：从列表中删除给定的字符串。

​     toggle(value) ：如果列表中已经存在给定的值，删除它；如果列表中没有给定的值，添加它。

11.3 元素属性

    <div id="box" class="box1 box2 box3" title="这是一个盒子"></div>

​    11.3.1 getAttribute() ==> 获取指定节点某个属性值

​        语法结构:dom.getAttribute( "attrName" )

​        console.log( box.getAttribute("id") );//"box"

​        console.log( box.getAttribute("class") );//"box1 box2 box3"

​        console.log( box.getAttribute("title") );//"这是一个盒子"

​    11.3.2 setAttribute() ==> 设置指定节点某个属性值

​        语法结构:dom.setAttribute( "attrName" , "attrValue" )

​        box.setAttribute( "title" , "这是一个big盒子" );

​    11.3.3 removeAttribute() ==> 删除指定节点某个属性值

​        box.removeAttribute( "title" );

​    

​    // 删除类的区别:

​    box.className = ""; // <div id="box" class></div>

​    box.removeAttribute( "class" );//  <div id="box"></div>

11.4 DOM0级事件处理程

​    btn.onclick = function(){

​    }

​    btn.onclick = fn;

​    function fn(){

​    }

11.5 文档写入

​    11.5.1 document.write()

​    不仅可以识别文本还识别标签

11.6 插入标记innerHTML ==> 不仅可以识别文本还识别标签

​    功能:获取或设置开始和结束标签里的内容(文本或标签)

    <div id="box">hello world</div>

​    1) 获取 ==> 读

​        console.log( box.innerHTML );// "hello world" <h1>hello world</h1>

​    2) 设置 ==> 写

​        box.innerHTML = "<h1>hello world</h1>";

11.7 获取或设置标签自带的属性值

​    <input type="text" id="ipt">

​    1) 获取 

​        语法结构:dom.attrName

​        console.log( ipt.value );

​        console.log( ipt.title );

​        console.log( ipt.className );

​    2) 设置

​        语法结构:dom.attrName = "attrValue";

​        ipt.value = "1234";