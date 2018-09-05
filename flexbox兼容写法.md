```
/*父元素-横向排列（主轴）*/
     
  display:box;  （伸缩盒最老版本）
  display:-webkit-box;  /* iOS 6-, Safari 3.1-6 */
  display:-webkit-flex; /* Chrome */
  display:-moz-box;     /* Firefox 19 */
  display:-ms-flexbox;   
  display:flex;  /*flex容器*/
 
/*方向*/
  -webkit-flex-direction: row;
  -moz-flex-direction: row;
  -ms-flex-direction: row;
  -o-flex-direction: row; 
  flex-direction:row;    【新版本语法】




/*父元素-水平居中（主轴是横向才生效）*/【新版本语法】
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  -o-justify-content: center;
  justify-content: center;



/*子元素-垂直居中（在侧轴、纵轴上）*/【新版本语法】
 -webkit-align-items:center;
 -moz-align-items:center;
 -ms-align-items:center;
 -o-align-items:center;
 align-items:center;




/*父元素-横向换行 */
  -webkit-flex-wrap: wrap;
  -moz-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  -o-flex-wrap: wrap;
  flex-wrap:wrap;




/* 子元素—平分比例 */ 
 -prefix-box-flex: 1; /* old spec webkit, moz */
 -webkit-box-flex: 1;      /* OLD - iOS 6-, Safari 3.1-6 */
 -webkit-flex: 1;          /* Chrome */
 -moz-box-flex: 1;         /* Firefox 19- */
 -ms-flex: 1;              /* IE 10 */
 width:20%;
 flex: 1;                  /* NEW,  Opera 12.1, Firefox 20+ */
 flex: 2;
 


不写flex数值默认不可以伸缩。



/* 子元素-用于改变源文档顺序显示 */
 -prefix-box-ordinal-group: 1; /* old spec; must be positive */
 -webkit-box-ordinal-group: 2;    
 -moz-box-ordinal-group: 2;       
 -ms-flex-order: 2;               
 -webkit-order: 2;                
 order: 2;                        
 order: 3;

```

