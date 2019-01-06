## CSS预处理器

CSS 预处理器赋予我们很多css强大的功能，并且是提高开发效率

### 模块化
利用 css预处理器能够很清晰地实现代码的分层、复用和依赖管理

### 基本语法
 - Less 的基本语法跟原生的css的风格几乎差不多
 - Sass、Stylus 利用缩进、空格和换行来减少需要输入的字符
 - Less & SCSS：
  ```
  .header {
    background-color:red;
  }
  ```
- Sass：
  ```
  .header
    background-color:red
  ```
- Stylus：
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
- Less：
@red: #c00;

strong {
  color: @red;
}

Sass：
$red: #c00;

strong {
  color: $red;
}

Stylus：
red = #c00

strong
  color: red

### @import
Less 中可以在字符串中进行插值：
@device: mobile;
@import "styles.@{device}.css";

Sass 中只能在使用 url() 表达式引入时进行变量插值：
$device: mobile;
@import url(styles.#{$device}.css);

Stylus 中在这里插值不管用，但是可以利用其字符串拼接的功能实现：
device = "mobile"
@import "styles." + device + ".css"


### 混入
混入（mixin）应该说是预处理器最精髓的功能之一了。
它提供了 CSS 缺失的最关键的东西：样式层面的抽象。
Less 的混入有两种方式：
1.直接在目标位置混入另一个类样式（输出已经确定，无法使用参数）；
2.定义一个不输出的样式片段（可以输入参数），在目标位置输出。
.alert {
  font-weight: 700;
}

.highlight(@color: red) {
  font-size: 1.2em;
  color: @color;
}

.heads-up {
  .alert;
  .highlight(red);
}

编译后
.alert {
  font-weight: 700;
}
.heads-up {
  font-weight: 700;
  font-size: 1.2em;
  color: red;
}

Sass
@mixin large-text {
  font: {
    family: Arial;
    size: 20px;
    weight: bold;
  }
  color: #ff0000;
}

.page-title {
  @include large-text;
  padding: 4px;
  margin-top: 10px;
}

### 继承
Stylus,Scss
.message
  padding: 10px
  border: 1px solid #eee

.warning
  @extend .message
  color: #e2e21e

less
.message {
  padding: 10px;
  border: 1px solid #eee;
}

.warning {
  &:extend(.message);
  color: #e2e21e;
}

Sass
.active {
   color: red;
}
button.active {
   @extend .active;
}

### 函数
三种预处理器都自带了诸如色彩处理、类型判断、数值计算等内置函数
stylus
@function golden-ratio($n) {
  @return $n * 0.618;
}

.golden-box {
  width: 200px;
  height: golden-ratio(200px);
}

### 三种预处理器手册
- Sass：http://sass.bootcss.com/
- Less： https://less.bootcss.com/
- stylus：https://stylus.bootcss.com/
