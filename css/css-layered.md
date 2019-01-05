## css分层理论
css分层理论和命令规则将有助于它的可扩展性，性能的提高和代码的组织管理。

### OOSS
1. 定义：面向对象css
2. 设计原则：表现与结构分离，容器与内容分离
3. 用途：创建可复用的CSS模块以提高性能
4. 提高团队开发效率，减少耦合
### SMACSS
1. 定义：可扩展的模块化架构的CSS
2. 设计原则： 使用一套五个层次来划分CSS
3. 用途：创建更结构化的模块以提高性能，增加效率
```
Base - 设定HTML elements 的默认值
Layout -Page structure 整个网站的「大架构」的外观   
Module - Re-usable code bloks 不同页面公共模块 
State - Active/Inactive etc 定义元素不同的状态 
Theme - Typography and colour schemes 页面上所有「主视觉」的定义 
```
```
.header {}
.header-top {}
.header-top__title {}
.header-top__title--ico {}

<div class="header">
  <div class="header-top">
    <div class="header-top__title">
      <div class="header-top__title--ico"></div>
    </div>
  </div>
</div>
```
### BEM
1. 定义：block：块，Element：元素，Modifier：修饰符 
2. 设计原则：通过给每个元素添加它的父级block模块作为前缀
3. 用途：有助于消除页面和body类对嵌套或者附加样式依赖
```
.product-details {}
.product-details__header {}
.product-details__header--ico {}

<div class="product-details">
  <div class="product-details__header">
    <div class="product-details__header--ico"><div> 
  </div>
</div>
```
### SUIT
1. 定义：SUIT起源于BEM，对组件名使用驼峰式和连字号把组件从他们的修饰和子孙后代中区分出来
2. 用途：通过抽离组件级别的的样式表，消除潜在的混乱连字符号连接元素名来使得选择器的可读性更强。
3. 代码示例同BEM 只不过是抽离的组件

### ACSS
1. 定义： 考虑如何设计一个系统的接口。原子(Atoms)是创建一个区块的最基本的特质，比如说表单按钮。分子(Molecules)是很多个原子(Atoms)的组合，比如说一个表单中包括了一个标签，输入框和按钮。生物(Organisms)是众多分子(Molecules)的组合物，比如一个网站的顶部区域，它包括了网站的标题、导航等。而模板(Templates)又是众多生物(Organisms)的结合体。比如一个网站页面的布局。而最后的页面就是特殊的模板。
![ACSS](https://github.com/MarsPen/-notes-summary/blob/master/images/Acss.jpg "ACSS")

### ITCSS
1. 定义：创造了一系列的层次来管理依赖关系和促进可扩展性。基础的层次包括通用和广泛的选择器。顶部的层次包含了局部模块具体化的选择器。
```
.Settings — 全局可用配置，设置开关。$color-ui: #BADA55; $spacing-unit:10px
.Tools —通用工具函数。@mixin font-color() {font-color: $color-ui;}
.Generic — 通用基础样式。Normalize, resets, box-sizing: border-box;
.Base — 未归类的HTML元素。ul {list-style: square outside;}
.Objects —设计部分开始使用专用类。.ui-list__item {padding: $spacing-unit;}
.Components — 设计符合你们的组件。products-list {@include font-brand();border-top: 1px solid $color-ui;}
.Trumps —重写，只影响一块的DOM。(通常带上我们的!important)

```
