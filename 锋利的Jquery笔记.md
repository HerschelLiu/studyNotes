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