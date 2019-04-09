## H5利用pattern属性和oninvalid属性验证表单

```html
<!DOCTYPE html>
<html>
<head> 
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
</head>
<body>

<form action="demo-form.php">
 手机号:   
    <input type="text" name="phone" maxlength="11" pattern="^(0|86|17951)?1[0-9]{10}" 
    oninvalid="setCustomValidity('请输入11位手机号');"/>
    <br>
  <input type="submit">
</form>

</body>
</html>
```

**TIP**：这里只写了手机号码的验证，用作示例，若需要验证其它东西，只需在pattern属性里写对应的正则表达式即可。也可以使用input类型里除了text的其它类型来做验证，比如

```html
<input type="email">
<input type="number">
```

**属性解释 **

* pattern：属性规定用于验证输入字段的正则表达式。

* oninvalid：提交的input元素的值为无效值时（这里是正则验证失败），触发oninvalid事件。oninvalid属于Form 事件。

* setCustomValidity()：这个是HTML5内置的JS方法，用来自定义提示信息

* maxlength：限定input最大输入长度

  

**其它属性**
*  required：增加一个非空验证。
*  oninput：该事件在 input 或 textarea 元素的值发生改变时触发。
**总结**
*  优点：简单方便。
*  缺点：提示的UI不是太漂亮，无法做多个验证，必须表单提交才能验证（即ajax无效）。

建议：在要求比较简单的时候可以考虑使用H5验证表单，也可以使用内置JS函数加各种事件自定义一个验证函数，不过这样不仅兼容是个问题，而且还麻烦，倒不如直接使用JQ插件验证
