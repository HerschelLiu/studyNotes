clipboard.js 是一个不需要flash，将文本复制到剪贴板的插件。简单介绍下基本运用。

# 1 引入插件

```
<pre>

 <script src="js/clipboard.min.js"></script>

 </pre>

```



# 2基本使用

首先需要您需要通过传递DOM选择器，HTML元素或HTML元素列表来实例化它。

```
 <pre>

 new Clipboard('.btn');

 </pre>

```

1用一个元素当触发器来复制另一个元素的文本,data-clipboard-target属性后需要跟属性选择器

```
 <pre>

 <input id="foo" value="https://github.com/zenorocha/clipboard.js.git">

 <button class="btn" data-clipboard-target="#foo">

 </button>

 </pre>

```



另外还有另外一个属性data-clipboard-action属性，以指定是要要么copy还是要cut操作。默认情况下是copy。cut操作只适用于<input>或<textarea>元素。

```
 <pre>

 <textarea id="bar">Mussum ipsum cacilds...</textarea>

 <button class="btn" data-clipboard-action="cut" data-clipboard-target="#bar">

 Cut to clipboard

 </button>

 </pre>

```



2从属性中复制文本，不需要另一个元素当触发器，可以使用data-clipboard-text属性，在后面放上需要复制的文本.

 ```
<pre>

 <button class="btn" data-clipboard-text="Just because you can doesn't mean you should — clipboard.js">

 Copy to clipboard

 </button>

 </pre>

 ```



# 3其他说明

1通过运行检查clipboard.js是否支持Clipboard.isSupported()，返回true则可以使用。
 2显示一些用户反馈或捕获在复制/剪切操作后选择的内容。操作，文本，触发元素
 <pre>
 var clipboard = new Clipboard('.btn');

```
clipboard.on('success', function(e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    e.clearSelection();
});

clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});
```

</pre>

3该插件使用的是事件委托的方式来触发，所以大大减少了对dom的操作。

# 4高级使用

如果你不想修改你的HTML，那么你可以使用一个非常方便的命令API。所有你需要做的是声明一个函数，写下你想要的操作，并返回一个值。下面是一个对不同id的触发器返回不同的值的例子。具体的使用方法请看[https://clipboardjs.com](https://link.jianshu.com?t=https://clipboardjs.com/)

 ```
<pre>

 <body>
 	<input id="foo" value="https://github.com/zenorocha/clipboard.js.git">
	<button id='foo_1' class="btn" data-clipboard-target="#foo"></button>

 </body>

 <script>  
new Clipboard('.btn', {
        text: function(trigger) {
            if (trigger.getAttribute('id') == 'foo_1') {
                return 1;
            } else {
                return 2;
            }
        }
    });
 </script>
 </pre>

 ```



# 5支持的浏览器

谷歌42+，火狐41+，其他自己查看[https://clipboardjs.com](https://link.jianshu.com?t=https://clipboardjs.com)

 

 

 

 

 