```html
<textarea name="textarea" id="textarea" style='overflow-y: hidden;height:20px' onpropertychange="this.style.height = this.scrollHeight + 'px';" oninput="this.style.height = this.scrollHeight + 'px';"></textarea>
```

采用expression的做法如下： 

```
<style type="text/css">a {star : expression(onfocus=this.blur)}</style><a href="link1.htm">link1</a><a href="link2.htm">link2</a><a href="link3.htm">link3</a>   
```

- 注意

不是非常需要，一般不建议使用expression，因为expression对浏览器资源要求比较高。