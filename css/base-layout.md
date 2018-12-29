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
1. 解决什么问题：两边定宽，中间自适应的三栏布局，中间栏放在文档流前面以优先渲染
2. 相同点：三栏全float浮动，左右两栏加上负margin让中间栏div并排，形成三栏
3. 不同点： 
- 圣飞布局为了中间内容不被遮挡，将中间div设置左右padding-left和padding-right,将左右两个div用相对布局position: relative并分别配合right和left属性，以便左右两栏div移动后不遮挡中间div。
- 双飞翼布局，直接在中间div内部创建子div用于放置内容，在该子div里用margin-left和margin-right为左右两栏div留出位置。
4. 圣杯布局代码
```
```
5. 双飞翼布局代码

6. 效果图


### 3.弹性盒子模型

### 4.响应式布局

### 5.移动端rem布局

