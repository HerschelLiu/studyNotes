```
background-clip:padding-box,border-box;  
background-origin:padding-box,border-box;  
background-image:linear-gradient(135deg,#000,#000),linear-gradient(135deg,#E70303,#FFFF44);  
border:2px transparent solid;  
```

使得border边框渐变。需要注意的是，方法实现原理其实是使得整个background渐变，background-image中第一段的linear-gradient使得div里的渐变色覆盖成黑色，从而保留border上的渐变色。 