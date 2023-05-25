#### 提升api等级为26

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest>
    <application name="targetSdkVersion" value="26"/>
</manifet>
```

文件名为`manifest.xml`保存在res目录下



#### 判断权限,请求权限函数

```js
function reqPermission(arrArg) {
    if (Array.isArray(arrArg)) {
        var resultList = api.hasPermission({
            list: arrArg
        });

        console.log('resultList: ' + JSON.stringify(resultList));

        var reqPerArr = [];

        resultList.forEach(function(item, index) {
            if (!item.granted) {
                reqPerArr.push(item.name);
            }
        });

        if (reqPerArr.length > 0) {

            api.requestPermission({
                list: reqPerArr,
                code: 1
            }, function(ret, err) {
                console.log(JSON.stringify(ret));
            });
        } else {
            return true;
        }
    } else {
        api.toast({
            msg: '传数组',
            duration: 1500,
            location: 'middle'
        });

    }
}
```

传数组进去

**权限列表**

> camera               //相机/拍照/录像
> contacts             //写入/读取通讯录
> microphone           //麦克风/录制音频
> photos               //相册/本地存储。Android上等同storage权限
> location             //定位
> locationAlways       //后台定位，只支持iOS
> notification         //状态栏通知
> calendar             //日历读写，只支持Android
> phone                //直接拨打电话/获取手机号码、IMEI（设备标识），只支持Android
> sensor               //传感器，只支持Android
> sms                  //后台发送短信，只支持Android
> storage              //存储空间，读取相册，多媒体，本地存储相关，只支持Android