## 基本布局

### 1.自适应两栏布局
利用BFC实现自适应两栏布局
```
/****css****/
.aside{
  float: left;
  width: 180px;
  height: 500px;
  background-color: red;
  opacity: 0.5;
}
.main{
  overflow: hidden;
  height: 500px;
  background-color: green;
}

<!--html-->
<div class="box">
  <div class="aside">左侧</div>
  <div class="main">右侧</div>
</div>
```
![自适应两栏布局](https://github.com/MarsPen/-notes-summary/blob/master/images/自适应两栏布局.gif "自适应两栏布局")
### 2.圣杯布局和双飞翼布局
1. 解决什么问题：两边定宽，中间自适应的三栏布局，中间栏放在文档流前面以优先渲染
2. 相同点：三栏全float浮动，左右两栏加上负margin让中间栏div并排，形成三栏
3. 不同点： 
- 圣杯布局为了中间内容不被遮挡，将中间div设置左右padding-left和padding-right,将左右两个div用相对布局position: relative并分别配合right和left属性，以便左右两栏div移动后不遮挡中间div。
- 双飞翼布局，直接在中间div内部创建子div用于放置内容，在该子div里用margin-left和margin-right为左右两栏div留出位置。
4. 圣杯布局代码
```
/****css****/
.main{
  width: 100%;
  background: green;
}
.left{
  left: -200px;
  width: 200px;
  margin-left: -100%;
  background: yellowgreen;
}
.right{
  right: -200px;
  width: 200px;
  margin-left: -200px;
  background-color: red;
}
.main,.left,.right{
  position: relative;
  float: left;
  min-height: 500px;
}
.container{
  padding: 0 200px;
  overflow: hidden;
  border: 5px solid #ccc;
}

<!--html-->
<div class="container">
  <div class="main">中间栏目</div>
  <div class="left">左侧栏目</div>
  <div class="right">右侧栏目</div>
</div>
```
5. 双飞翼布局代码
```
/****css****/
.main,.left,.right{
  float: left;
  min-height: 500px;
}
.main{
  width:100%;
  background-color: red;
}
.left{
  width: 200px;
  margin-left: -100%;
  background-color: yellow;
}
.right{
  width: 200px;
  background-color: green;
  margin-left: -200px;
}
.content{
  margin: 0 200px;
}

<!--html-->
<div class="container"> 
　　<div class="main">
    　　<div class="content">中间栏目</div> 
    </div>
　　<div class="left">左侧栏目</div> 
　　<div class="right">右侧栏目</div> 
</div>
```

6. 效果图
![三栏布局](https://github.com/MarsPen/-notes-summary/blob/master/images/圣杯布局.gif "三栏布局")

### 3.flex弹性盒子布局
1. 定义：Flex 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。
2. 优点：相对于传统布局更具有灵活性。
3. 缺点：虽然现代浏览器都支持，但是还有少部分浏览器需要单独处理其兼容性
4. 问题：
  - 绝对定位与固定定位的盒子不参与flex布局
  - 使用Flex布局以后，子元素的float、clear和vertical-align等属性将失效
  - 具体语法参考阮大大flex布局语法篇和实例篇
  - http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html
  - http://www.ruanyifeng.com/blog/2015/07/flex-examples.html
5. 三栏布局示例 
```
/****css****/
.container{
  display: flex;
  min-height: 500px;
}
.main{
  flex-grow:1;
  background-color: red;
}
.left{
  order: -1;
  flex-basis: 200px;
  background-color: yellow;
}
.right{
  flex-basis: 200px;
  background-color: green;
}

<!--html-->
<div class="container">
  <div class="main">中间内容区域</div>
  <div class="left">左边栏区域</div>
  <div class="right">右边栏区域</div>
</div>
```

### 4.绝对定位布局
1. position:absolute绝对定位使元素脱离文档流，因此不占据当前层级的空间
2. 三栏布局代码示例
```
/****css****/
.container{
  position: relative;
}
.main,.left,.right{
  min-height: 500px;
  top: 0;
}
.main{
  background-color: red;
  margin: 0 200px;
}
.left{
  position: absolute;
  left: 0px;
  width: 200px;
  background-color: green;
}
.right{
  position:absolute;
  right: 0px;
  width: 200px;
  background: yellow;
}

<!--html-->
<div class="container">
  <div class="main">中间内容区域</div>
  <div class="left">左边区域</div>
  <div class="right">右边区域</div>
</div>
```
### 5.media响应式布局
1. 定义（Responsive Web Design）：一个网站能够兼容多个终端，而不是为每个终端做一个特定的版本
2. 优点
- 跨平台，面对不同分辨率设备灵活性强
- 能够快捷解决多设备显示适应问题
- 节约成本
3. 缺点
- 兼容性 不兼容低版本浏览器，各种设备工作量大，效率低下
- 代码冗余量大，加载时间长
- 折中方案，达不到理想的布局效果 
### 6.移动端rem布局
1. 定义（font size of the root element）：相对于根元素的字体大小的单位
2. 作用：通过js动态计算html font-size 能够使html页面比响应式布局，流式布局，设置最大宽度布局等效果更完善
3. 需要考虑当前手机的dpr