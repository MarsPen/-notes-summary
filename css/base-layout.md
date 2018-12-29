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

### 3.弹性盒子模型

### 4.响应式布局

### 5.移动端rem布局

