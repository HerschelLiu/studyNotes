* grid-templete-rows和grid-templete-columns分别设置行高和列宽

* grid-row-gap和grid-column-gap分别设置行间距与列间距

* `grid-gap: <grid-row-gap> <grid-column-gap>;`简写，只写一个值则代表行间距和列间距都是这个值

* **父子CP：**（设置区域）即设置区域。要容器盒子和格子配合才有效果。但是，简单得有点尴尬。CP（组合使用）`grid-template-areas`（父）、`grid-area`（子）打个比方：诸侯分封，土地各自属于哪个诸侯。

  ```html
  <div class="container">
          <h1>Grid Layout</h1>
          <div class="grid-container">
              <div class="item1">item1</div>
              <div class="item2">item2</div>
              <div class="item3">item3</div>
              <div class="item4">item4</div>
          </div>
      </div>
  .grid-container {
      display: grid;
      grid-template-rows: 25% 25% 25%;
      grid-template-columns: 25% 25% 25%; 
      grid-template-areas: 
        "item1 item1 item2"
        "item3 item3 item2"
        "item4 item4 item4";
  }
  
  <!--作者：果酱淋-->
  <!--链接：https://juejin.im/post/5d6d3417e51d4561c541a701-->
  <!--来源：掘金-->
  <!--著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。-->
  ```

  

  ```css
  .item1 {
      grid-area: item1
  }
  .item2 {
      grid-area: item2
  }
  .item3 {
      grid-area: item3
  }
  .item4 {
      grid-area: item4
  }
  
  /*作者：果酱淋
  链接：https://juejin.im/post/5d6d3417e51d4561c541a701
  来源：掘金
  著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。*/
  ```

**注：**在所有浏览器中，`grid-template-areas`的写法都被划掉，没百度出来为什么和怎么写