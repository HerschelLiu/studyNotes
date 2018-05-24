openFrame、openWin中的pageParam方式，只能将值传给要打开的页面<br />

以下方法可以自由在两个页面间传值

```
// 传值界面
api.sendEvent({
          name: 'myEvent',
          extra: {
              key1: 'value1',
              key2: 'value2',
          }
      });
      
// 接收值页面
api.addEventListener({
            name: 'myEvent'
        }, function(ret) {
            console.log(ret.value.key1);// extra中每项的值可以用ret.value.extra中项的名称
        });
```

