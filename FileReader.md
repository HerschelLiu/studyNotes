```javascript
<input name="file" id="ifile" onchange="imgPreview(this)" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">


function imgPreview(fileDom) {
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
                //获取文件
                var file = fileDom.files[0];
                var imageType = /^image\//;
                //是否是图片
                if (!imageType.test(file.type)) {
                    alert("请选择图片！");
                    return;
                }
                //读取完成
                reader.onload = function (e) {
                    e = e || window.event;
                    //读取完成后，数据保存在对象的result属性中
                    //获取图片dom
                    var imgItem = '<div class="ngoods-imgs">' +
                        '<div class="ngoods-delImg hide" onclick="delImg(this)">点击删除</div>' +
                        '<img src="' + e.target.result + '" alt=""></div>';
                    var $imgItem = $('.ngoods-imgs');
                    if ($imgItem.length >= 5) {
                        alert('最多添加5张图片');
                        return false;
                    } else {
                        $('.ngoods-showImg').append(imgItem);
                        imgHover();
                    }
                };
                reader.readAsDataURL(file);
            } else {
                alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }

        }
```

方法

FileReader提供了如下方法：

| readAsArrayBuffer(file)   | 按字节读取文件内容，结果用ArrayBuffer对象表示 |
| ------------------------- | --------------------------------------------- |
| readAsBinaryString(file)  | 按字节读取文件内容，结果为文件的二进制串      |
| readAsDataURL(file)       | 读取文件内容，结果用data:url的字符串形式表示  |
| readAsText(file,encoding) | 按字符读取文件内容，结果用字符串形式表示      |
| abort()                   | 终止文件读取操作                              |

readAsDataURL和readAsText较为常用，这里只对这两者进行说明。

readAsDataURL会将文件内容进行base64编码后输出

事件

| onabort     | 当读取操作被中止时调用               |
| ----------- | ------------------------------------ |
| onerror     | 当读取操作发生错误时调用             |
| onload      | 当读取操作成功完成时调用             |
| onloadend   | 当读取操作完成时调用，无论成功或失败 |
| onloadstart | 当读取操作开始时调用                 |
| onprogress  | 在读取数据过程中周期性调用           |