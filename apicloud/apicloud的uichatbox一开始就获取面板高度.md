```

可以换其他思路解决这个问题。

找到一个解决方案。 加载的时候插入一个换行，然后又去掉
                UIChatBox.insertValue({
                    index: 0,
                    msg: "\n"
                });
                UIChatBox.value({
                    msg: ''
                });
                UIChatBox.addEventListener({
            target: 'inputBar',
            name: 'change'
        }, function(ret, err) {
            if (ret) {
                alert(1);
            } else {
                alert(JSON.stringify(err));
            }
        });
```

