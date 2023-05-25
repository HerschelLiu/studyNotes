目的: 解决浏览器兼容问题,跨平台应用

### IE条件注释法(只支持IE9及ie9以下的ie浏览器)

| 项目 |           范例           |                        说明                         |
| :--: | :----------------------: | :-------------------------------------------------: |
|  !   |         [if !IE]         |                      not运算符                      |
|  lt  |      [if lt IE 5.5]      |                     小于运算符                      |
| lte  |      [if lte IE 6]       |                   小于或等于运算                    |
|  gt  |       [if gt IE 5]       |                     大于运算符                      |
| gte  |      [if gte IE 7]       |                   大于或等于运算                    |
|  ()  |       [if !(IE 7)]       | 子表达式运营商.在与布尔运算符用于创建更复杂的表达式 |
|  &   | [if (gt IE 5)&(lt IE 7)] |                      and运算符                      |
|  \|  |    [if (IE 6)&(IE 7)]    |                      or运算符                       |

```
<!--[if IE]>
   这段文字只在IE浏览器显示
<![endif]-->

<!--[if IE 6]>
   这段文字只在IE6显示
<![endif]-->

<!--[if gte IE]>
   这段文字只在IE6及IE6以上浏览器显示
<![endif]-->

<!--[if !IE 8]>
   这段文字只在非ie8浏览器显示
<![endif]-->

<!--[if !IE 8]>
   这段文字只在非ie浏览器显示
<![endif]-->
```

### css属性前缀法

```css
.test{
            color: #090; /* for IE8+ */
            *color: #f00; /* for IE7 and earlier */
            _color: #ff0; /* for IE6 and earlier */
        }
```

### 选择器前缀

```css
* .test {} /* for ie6 and earlier */
```

