### 新建文件

在application下新建文件夹，再新建controller文件夹。controller中新建php文件，首字母大写。

```php
<?php

namespace app(固定)\新建的文件夹名\controller;
use think/Controller;
use think/Db; // 引用数据库

class Goods extends Controller
{
    public function goodsList(){
        $list = Db::table('test_goods') -> select();
        return json_encode($list);
    }
}
```

