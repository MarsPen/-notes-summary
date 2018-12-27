## 基础知识概念

### 1．什么是css
 &nbsp;层叠样式表(英文全称：Cascading Style Sheets),是一种用来表现html或者xml等文件样式的计算机语言。
### 2. 标准盒子模型-怪异盒模型
  1. 在html文档中，每一个渲染在页面中的标签都是一个个盒子模型；
  2. 盒子模型分为w3c标准盒子模型和IE标准盒子模型；当不对Doctype进行定义时，会触发怪异模式。
  3. 盒子模型公式
  - 盒子占位width = width + 2margin + 2padding + 2*border;
  - 在怪异模式下盒子占位width = width+2margin（既width已经包含了padding和border值）= 内容区宽度/高度 + padding + border + margin;

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
    <img src="https://github.com/MarsPen/-notes-summary/blob/master/images/css盒子模型.png" height="700" width="700" >
  </div>
 


 
