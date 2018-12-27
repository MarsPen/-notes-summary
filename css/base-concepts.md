## 基础知识概念

### 1．什么是css
 &nbsp;层叠样式表(英文全称：Cascading Style Sheets),是一种用来表现html或者xml等文件样式的计算机语言。
### 2. 标准盒子模型-怪异盒模型
  1. 在html文档中，每一个渲染在页面中的标签都是一个个盒子模型；
  2. 盒子模型分为w3c标准盒子模型和IE标准盒子模型；当不对Doctype进行定义时，会触发怪异模式。
  3. 盒子模型公式
  - 在标准模式下盒子的总宽度 = width+margin（左右）+ padding（左右）+border（左右）
  - 在怪异模式下盒子的总宽度 = width+margin（左右）（既width已经包含了padding和border值）

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
  <div align="left">
    <img src="https://github.com/MarsPen/-notes-summary/blob/master/images/css盒子模型.jpg" height="150" width="150" >
    <img src="https://github.com/MarsPen/-notes-summary/blob/master/images/css盒子模型1.jpg" height="160" width="160" >
  </div>
 


 
