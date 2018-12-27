## 基础知识概念

### 1．什么是css
 &nbsp;层叠样式表(英文全称：Cascading Style Sheets),是一种用来表现html或者xml等文件样式的计算机语言。
### 2. 标准盒子模型-怪异盒模型
  1. 在html文档中，每一个渲染在页面中的标签都是一个个盒子模型；
  2. 盒子模型分为w3c标准盒子模型和IE标准盒子模型；当不对Doctype进行定义时，会触发怪异模式。
  3. 盒子模型
  ```
   <!--html-->
   <div class="box"></div>

   <!--css-->
   .box{
     width:100px;
     height:100px;
     border:10px;
     background-color:red;
     padding:20px;
     margin:20px;
   }
  ```
  <div align="left">
    <img src="https://github.com/MarsPen/-notes-summary/blob/master/images/css盒子模型.png" height="100%" width="70%" >
  </div>
### 3.BFC IFC GFC FFC
1. BFC
  - 定义（Block fomatting context）：块级格式化上下文
  - block-level box:display 属性为 block, list-item, table 的元素，会生成 block-level box。并且参与 block fomatting context；
  - 是一个独立的渲染区域，只有Block-level box参与
  - 布局规则
    1. 内部的Box会在垂直方向，一个接一个地放置
    2. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
    3. 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
    4. BFC的区域不会与float box重叠
    5. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
    6. 计算BFC的高度时，浮动元素也参与计算
  - 那些元素会生成BFC
    1. 根元素
    2. float元素不为none
    3. position为 absolute或者fixed
    4. display为inline-block, table-cell, table-caption, flex, inline-flex
    5. overflow不为visible

 


 
