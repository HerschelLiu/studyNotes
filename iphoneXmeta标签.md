1. 如果想全屏覆盖，html里面请使用viewport-fit=cover

`<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">`

2.如果想对某个元素进行底部上移或者顶部下移可以做以下适配。

```
 body{
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
   }

   .iphonex-pt{
      padding-top: constant(safe-area-inset-top);
      padding-top: env(safe-area-inset-top);
   }
   .iphonex-pb{
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
   }
   .iphonex-mt{
      margin-top: constant(safe-area-inset-top);
      margin-top: env(safe-area-inset-top);
   }
   .iphonex-mb{
      margin-bottom: constant(safe-area-inset-bottom);
      margin-bottom: env(safe-area-inset-bottom);
   }
   .iphonex-pl{
      padding-left: constant(safe-area-inset-left);
      padding-left: env(safe-area-inset-left);
   }
   .iphonex-pr{
      padding-right: constant(safe-area-inset-right);
      padding-right: env(safe-area-inset-right);
   }
   .iphonex-ml{
      margin-left: constant(safe-area-inset-left);
      margin-left: env(safe-area-inset-left);
   }
   .iphonex-mr{
      margin-right: constant(safe-area-inset-right);
      margin-right: env(safe-area-inset-right);
   }
   .iphonex-bd-top-bg{
      border-top: 88px solid transparent;
   }
   .iphonex-bd-top{
      border-top: 44px solid transparent;
   }
   .iphonex-bd-bottom{
      border-bottom: 34px solid transparent;
   }
}
--------------------- 
作者：zhaoshuang1010 
来源：CSDN 
原文：https://blog.csdn.net/zhaoshuang1010/article/details/78919059 
版权声明：本文为博主原创文章，转载请附上博文链接！
```

