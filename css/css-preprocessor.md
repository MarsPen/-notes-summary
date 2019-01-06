## CSS预处理器

CSS 预处理器赋予我们很多css强大的功能，能够很清晰地实现代码的分层、复用和依赖管理，提高开发效率

### 基本语法

- Less 的基本语法跟原生的css的风格几乎差不多
- Sass、Stylus 利用缩进、空格和换行来减少需要输入的字符
- Sass
  ```
  .header
    background-color:red
  ```
- Less & SCSS
  ```
  .header {
    background-color:red;
  }
  ```
- Stylus
  ```
  .header
    background-color:red
  ```

### 嵌套语法

- 嵌套语法都是一致的,区别是 Sass 和 Stylus 可以不用书写大括号
- less
  ```
  .header {
    &.title {
      color: red;
    }
  }
  ```

### 变量

- 为 CSS 增加了一种有效的复用方式，减少CSS书写重复
- Sass
  ```
  $bg: #ccc;

  .header 
    background-color:$bg;
  ```
- Less
  ```
  @bg: #ccc;

  header {
    background-color: @bg;
  }
  ```
- Stylus
  ```
  bg = #ccc

  header
    background-color: bg
  ```

### @import

- Sass 只能使用 url() 表达式引入时进行变量插值
  ```
  $public: public;

  @import url(styles.#{$public}.css);
  ```
- Less可以在字符串中进行插值：
  ```
  @public: public;

  @import "styles.@{public}.css";
  ```
- Stylus 可以利用其字符串拼接的功能实现
  ```
  public = "public"

  @import "styles." + public + ".css"
  ```


### 混入(Mixins)

- 作用: 样式层面的抽象
- Sass
  ```
  @mixin product-public-text {
    font: {
      size: 20px;
      weight: 600;
      family: PingFangSC;
    }
    color: rgba(72,72,72,1);
  }
  .product-header-title {
    @include product-public-text;
    padding: 10px;
  }
  ```

- Less
  ```
  .product-public-font-weight {
    font-weight: 600;
  }

  .product-public-font(@color: red) {
    font-size: 20px;
    color: @color;
  }

  .product-header-title{
    .product-public-font-weight;
    .product-public-font(red);
  }
  ```

### 继承

- Sass
  ```
  .header {
    background-color: red;
  }
  .main.active {
    @extend .header;
  }
  ```

- less
  ```
  .header {
    background-color: red;
  }
  .main {
    &:extend(.header);
  }
  ```

- Stylus,Scss
  ```
  .header
    background-color: red;

  .main
    @extend .header
  ```

### 高级用法（函数）
三种预处理器都自带了诸如色彩处理（darken等）、类型判断（if each for while 等）、数值计算等内置函数

### 三种预处理器手册
- Sass：http://sass.bootcss.com/
- Less： https://less.bootcss.com/
- stylus：https://stylus.bootcss.com/
