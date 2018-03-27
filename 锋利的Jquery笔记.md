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