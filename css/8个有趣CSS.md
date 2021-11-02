## 更改输入框的光标颜色

> MDN:**`caret-color`** 属性用来定义**插入光标**（caret）的颜色，这里说的插入光标，就是那个在网页的可编辑器区域内，用来指示用户的输入具体会插入到哪里的那个一闪一闪的形似竖杠 `|` 的东西。

例如我们将光标设置为蓝色

```text
input{

caret-color:blue;
}
```

## 一行代码禁止用户选择文本

```text
  user-select: none;
```

## 内容选中的效果

这里设置文本选中的颜色是绿色

```text
.div::selection {
  background-color: green;
  color: #fff;
}
```

## 平滑滚动

```text
scroll-behavior: smooth;
```

## 图片作为光标

```text
cursor: url(), auto;
```

作者：阳叔
链接：https://zhuanlan.zhihu.com/p/427973911
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。



**打字机效果**

```text
.container {
        height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .typing {
        width: 220px;
        animation: typing 2s steps(8), blink 0.5s step-end infinite alternate;
        white-space: nowrap;
        overflow: hidden;
        border-right: 3px solid;
        font-family: monospace;
        font-size: 2em;
      }

      @keyframes typing {
        from {
          width: 0;
        }
      }

      @keyframes blink {
        50% {
          border-color: transparent;
        }
      }
```

```text
  <div class="container">
      <div class="typing">我是用打字机效果</div>
    </div>
```

作者：阳叔
链接：https://zhuanlan.zhihu.com/p/427973911
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。