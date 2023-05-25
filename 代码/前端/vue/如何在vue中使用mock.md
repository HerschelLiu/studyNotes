1. 在根目录下创建mock文件夹，里面新建js（我的叫mymock.js）文件用以存放mockjs相关数据
2. 在mymock.js中

```javascript
const Mock = require('mockjs')

Mock.mock('/api/test', {
    "status": 10000,
    "data": {
        "store_name": '@cname',
        "head_user_id|1-9999999": 1,
        "address": "@province @city",
        "newspaper": "@sentence(3, 5)",
        "ad|2": [{
            "ad_img_url": "@image(299x142.5)"
        }]
    }
})
```

**注意：**Mock.mock部分出现红波浪线也没事

3. 在main.js中加上`require('../mock/mymock.js')`