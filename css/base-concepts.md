## 基础知识概念

### 1．什么是css
 &nbsp;层叠样式表(英文全称：Cascading Style Sheets),是一种用来表现html或者xml等文件样式的计算机语言。
### 2. 标准盒子模型-怪异盒模型
  1. 在html文档中，每一个渲染在页面中的标签都是一个个盒子模型；
  2. 盒子模型分为w3c标准盒子模型和IE标准盒子模型；
  3. 标准盒子模型例子：
  ```
   <!--html-->
   <div class="box">
      <div class="box-content"></div>
   </div>

   <!--css-->
   .box{
     width:100px;
     height:100px;
     background-color:red;
     padding:20px;
   }
   .box-content{
     width:100px;
     height:100px;
     background-color:yellow;
   }
  ```
  <div align="center">
    <img src="https://github.com/MarsPen/-notes-summary/blob/master/images/css盒子模型.jpg" height="150" width="150" >
    <img src="https://github.com/MarsPen/-notes-summary/blob/master/images/css盒子模型1.jpg" height="160" width="160" >
  </div>
 
