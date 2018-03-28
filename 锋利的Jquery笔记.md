# is()
  is() 方法用于查看选择的元素是否匹配选择器。<br />
  可以这样用：如果checkbox被选中则弹出对话框
  ```
  <div>
    <input type="checkbox" id="cr">
    <label for="cr">我已经阅读并同意</label>
  </div>
  <script>
  // JQuery
    "use strict"
    $(function(){
      var $cr = $("#cr");
      $cr.click(function(){
        if($cr.is(":checked")){
          alert("感谢支持")
        }
      })
    })
  </script>
  ```
  ```
  // JavaScript
  var cr = document.getElementById("cr");
  cr.onclick = function(){
    if(cr.checked){
      alert("感谢支持")
    }
  }
  ```
  以上代码中对于获取选中状态`checked`的方式不同，在jquery中只支持jquery的方法，不能与js的方法混用

  # 移交$控制权
  jquery.noConflict(),也可以用这个命令自定义快捷方式`var $j = jquery.conflict()`,这样之后，$()就变成了$j()

  # jquery判断一个元素是否存在
  可以用length来判断
  ```
  if($("#box").length > 0){
    // do something
  }
  ```

  # remove(),detach(),empty()
  `<li>text</li>`
  * 这三者前两个是直接删除<li>节点，而empty()只是删除了<li>的内容text
  * remove的节点，事件也会被删除，而detach不会，重新添加回去，被删除的事件也会回去，并不会消失

# offset
  获取元素在当前视窗的相对偏移，返回的为top和left
# scrollTop，scrollLeft
获取元素的滚动条距顶端、左端的距离 

# event.pageX,event.pageY
  获取光标相对于页面的x，y坐标

# event.which
  在鼠标单击事件中获取鼠标左（1）中（2）右（3）键。在键盘事件中获取键盘的按键
# event.metaKey
  为键盘事件中获取ctrl键
# animate
  ```
  <style>
    #panel{
      position: relative;
      width: 100px;
      height: 100px;
      border: 1px solid #0050d0;
      background: #96e555;
      cursor: pointer;
    }
  </style>
  <body>
    <div id="panel"></div>
    <script>
      "use strict"
      $("#panel").click(function(){
        $(this).animate({left: "+=500px"}, 1000); // +=是在当前位置累加
      });
    </script>
  </body>
  ```
# attr()与prop()使用时机
 * 只添加属性名称就会生效的用prop，比如disable、checked
 * 只存在true/false属性的用prop
# ajax
  jquery对ajax进行了封装，$.ajax()是最底层方法，第二层是load()、$.get()、$.post()<br />
  第三层是$.getScript()和$.getJSON()。第二层方法使用频率最高

# load()
  如果想加载另一个页面特定内容`$("#resText").load("text.html .para")`,.para为text.html页面的一个类名<br />
  参数传递默认为GET方式，反之，则会自动转换为POST格式

#   $.get()、$.post()
  如果需要传递一些参数给服务器中的页面可以着用这两个，当然也可以使用$.ajax()<br />
  以下是做的中糖代码
  ```
  var account = {
	http:'http://192.168.1.117:81',
	toast:function(str){
        if($("body").find('.toast').length>0){
            $("body").find('.toast').hide()
            $div=$("<div>"+str+"</div>");
            $div.addClass("toast").css("color","#fff");
            $("body").append($div);
            $div.fadeOut(4000,function(){
                $(this).hide()
            });
        }else{
            $div=$("<div>"+str+"</div>");
            $div.addClass("toast").css("color","#fff");
            $("body").append($div);
            $div.fadeOut(4000,function(){
                $(this).hide()
            });
        }
        
    },
	//用户登录功能
	login:function(){
        var username=$('#username').val();
        var password=$('#password').val();

        if(username&&password){
            $('.login').prop('disabled',true)
            $.ajax({
                url:account.http+'/base/login',
                type:'post',
                async:true,
                dataType:'json',
                timeout:10000,
                data:{
                    CellPhone:username,
                    Password:password
                },
                success:function (res) {
                    $('.login').prop('disabled',false)
                    if(res.code==200){
                        window.location.href='./enquiry.html'; 
                    }else{
                        account.toast(res.error)
                    }
                },
                error:function(res){
                    $('.login').prop('disabled',false)
                    account.toast('请稍后再试')
                }
            })
        }else{
            if(username==""){
                account.toast("请输入用户名")
            }else if(password==""){
                account.toast("请输入密码")
            }
        } 
  }
  ```
# ajaxStart()与ajaxStop()

  在请求的数据期间可以用这两个来显示loading

```
<div id="loading">加载中...</div>
<script>
  $("#loading").ajaxStart(function(){
    $(this).show();
  }).ajaxStop(function(){
    $(this).hide();
  });
</script>
```

这样一来在ajax请求过程中，只要信息没有加载完，就会一直显示“加载中...”