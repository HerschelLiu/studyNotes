在开发过程中，jQuery.html() 是获取当前节点下的html代码，并不包含当前节点本身的代码，然后我们有时候确需要，找遍jQuery api文档也没有任何方法可以拿到。后来实验发现有一个jQuery的一个方法可以解决，而且非常简便，如下：

```
<div class="test"><p>hello，你好！</p></div>
<script>
$(".test").prop("outerHTML");
</script>
```



输出结果为：`<div class="test"><P>hello,你好！</p></div>`



因为原生JS DOM里有一个内置属性 outerHTML （看清大小写哦，JS是区分大小写的）用来获取当前节点的html代码(包含当前节点)，所以用jQuery的prop()能拿到，经过实验attr()方法是拿不到的