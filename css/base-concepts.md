## 基础知识概念

### 1．什么是css
 &nbsp;层叠样式表(英文全称：Cascading Style Sheets),是一种用来表现html或者xml等文件样式的计算机语言。
### 2. 标准盒子模型-怪异盒模型
  1. 在html文档中，每一个渲染在页面中的标签都是一个个盒子模型；
  2. 盒子模型分为w3c标准盒子模型和IE标准盒子模型；当不对Doctype进行定义时，会触发怪异模式。
  3. 盒子模型
  - 代码示例
  ```
  /****css****/
  .box{
    width:100px;
    height:100px;
    border:10px;
    background-color:red;
    padding:20px;
    margin:20px;
  }

  <!--html-->
  <div class="box"></div>
  ```
  ![css盒子模型](https://github.com/MarsPen/-notes-summary/blob/master/images/css盒子模型.png "css盒子模型")
### 3. BFC IFC GFC FFC
1. BFC
  - 定义（Block fomatting context）：块级格式化上下文(每一个元素盒子从上向下排列)
  - block-level box:display 属性为 block, list-item, table 的元素，会生成 block-level box。并且参与 block fomatting context；
  - 是一个独立的渲染区域，只有Block-level box参与
  - 布局规则
    1. 内部的Box会在垂直方向链接放置
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
  - BFC作用
    1. 自适应两栏布局
    2. 清除内部浮动
    3. 防止margin重叠

  - 例子说明
  - 根据以上BFC布局规则第3条、第4条来触发main生成BFC，来实现自适应两栏布局
      ```
      /****css****/
      .main{
        overflow: hidden;
        height: 500px;
        background: yellow;
      }
      .aside{
        float: left;
        width: 200px;
        height: 500px;
        background-color: red;
      }
      
      <!--html-->
      <div class="box">
        <div class="aside">侧边栏区域</div>
        <div class="main">内容区域</div>
      </div>
      ```
  - 根据BFC布局规则第6条，解决float元素使其父元素高度塌陷问题
    ```
      /****css****/
      .parent{
        border: 1px solid red;
        width: 400px;
        overflow: hidden;
        padding: 10px;
      }
      .child{
        float: left;
        height: 300px;
        width: 198px;
        border: 1px solid green;
      }
      
      <!--html-->
      <div class="parent">
        <div class="child"></div>
        <div class="child"></div>
      </div>
    ```
  - 防止margin重叠,根据生成BFC第4条规则
    ```
      /****css****/
      .box{
        width: 300px;
        height: auto;
      }
      .content{
        width: 300px;
        height: 200px;
        margin: 100px;
        background: red;
      }
      .warp{
        display: inline-block;
      }

      <!--html-->
      <div class="box">
        <div class="content"></div>
        <div class="content warp"></div>
      </div>
    ```
2. IFC
  - 布局规则
    1. 定义(Inline Formatting Contexts)：内联格式化上下文（每一个元素盒子从左到右排列）
    2. IFC的line box高度 由其行内元素中 最高的实际高度计算而来（不受到竖直方向的padding/margin影响)
    3. inline-level box:display 属性为 inline, inline-box，inline-table，table-cell，table-column-group等，会生成 inline-level box。并且参与 inline fomatting context；
    4. 当inline-level box的宽度大于containing block，且达到内容换行条件时，会将inline-level拆散为多个inline-level box并分布到多行中
    5. inline-level box一般左右都贴紧整个IFC，但是会因为float元素而扰乱。float元素会位于IFC与与line box之间，使得line box宽度缩短
    6. IFC中不可能有块级元素，当插入块级元素时（如p中插入div）会产生两个匿名块与div分隔开，即产生两个IFC，每个IFC对外表现为块级元素，与div垂直排列。
  - 作用
    1. 水平居中：当一个块要在环境中水平居中时，设置其为inline-block则会在外层产生IFC，通过text-align则可以使其水平居中。
    2. 垂直居中：创建一个IFC，用其中一个元素撑开父元素的高度，然后设置其vertical-align:middle，其他行内元素则可以在此父元素下垂直居中。

  - 示例
   - 根据布局规则第4条
    ```
      /****css****/
      .break{
        border: 1px solid red;
        background: yellow;
      }
      
      <!--html-->
      <span class="break">这是一个行内盒子这是一个行内盒子这是一个行内盒子</span>
    ```
    ![css-IFC](https://github.com/MarsPen/-notes-summary/blob/master/images/css-IFC.jpg "css-IFC")
  - 根据作用第1条,设置span为inline-block,则会在box上产生ifc,在box上设置text-align使span元素水平居中。
    ```
      /****css****/
      .box{text-align: center;}
      .content{
        display: inline-block;
        border: 1px solid red;
      }
      
      <!--html-->
      <div class="box">
        <span class="content">内容区域</span>
      </div>
    ```
  - 根据作用第2条，设置盒子2为inline-block，则会在box上产生ifc，设置其vertical-align:middle，盒子1垂直居中。
    ```
      /****css****/
      .box{
        text-align: center;
        border: 1px solid red;
      }
      .label{
        display: inline-block;
        height: 100px;
        width: 100px;
        vertical-align: middle;
      }
      
      <!--html-->
      <div class="box">
        <span class="content">盒子1</span>
        <span class="label">盒子2</span>
      </div>
    ```
3. FFC
  - 定义(Flex Formatting Contexts)：自适应格式化上下文
  - display值为flex或者inline-flex的元素将会生成自适应容器（flex container）
  - FFC和BFC区别
    1. Flexbox 不支持 ::first-line 和 ::first-letter 这两种伪元素
    2. vertical-align 对 Flexbox 中的子元素失效
    3. float 和 clear 属性对 Flexbox 中的子元素是没有效果的，也不会使子元素脱离文档流
    4. 多栏布局（column-*） 在 Flexbox 中失效
    5. Flexbox 下的子元素不会继承父级容器的宽
4. GFC
  - 定义(GridLayout Formatting Contexts)：网格布局格式化上下文
  - display值为grid的元素，获得一个独立的渲染区域，可在网格内定义项目（item）、行（row）、列（columns）



