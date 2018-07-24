# [关于textarea限制字数的总结](https://www.cnblogs.com/duzjextjs/p/5915405.html)

在input标签中，只需要设置maxlength=”200”即可，但是在textarea标签中，IE9及IE9以下浏览器是不支持的，IE10、IE11则支持，估计后续的版本应该都会支持。

现在来说下怎么让大部分IE版本都支持textarea 标签限制字数，同时允许以chorme为内核的浏览器也支持。

```
<textarea rows="5"  maxlength="200" onchange="this.value=this.value.substring(0, 200)" onkeydown="this.value=this.value.substring(0, 200)" onkeyup="this.value=this.value.substring(0, 200)" ></textarea>
```



这样子即可。

备注：onchange、onkeydown、onkeyu三者缺一不可。

如省略onchange，当你用复制功能，此时一直按着ctrl不松开，鼠标去点击其他地方（焦点移出textarea）时，不会自动取消超出部分；

如省略onkeydown，快速录入的时候会有很多个字符突然不见；

如省略onkeyup，原想预计200的情况下，会变成201，并且最后一个字符是最后敲进去的。

Maxlength 也不可省略，加上maxlength 当碰到IE10及以上版本时，可以完美的实现限制输入框字数的功能。不像其他低版本的IE浏览器还可能出现一个字母后消失。