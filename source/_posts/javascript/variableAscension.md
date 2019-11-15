---
title: 变量提升
date: 2019-2-20 12:32:09
top: false
cover: false
password:
toc: true
mathjax: false
summary: 
tags:
- JavaScript
categories:
- JavaScript
---

## 变量提升

### 执行步骤<hr>
js代码虽然是逐行向下执行的，但执行的时候分为两个步骤**
- 编译阶段（词法解释/预解释）
- 执行

### 编译阶段<hr>
函数声明和变量声明总是会被解释器(编译阶段)悄悄地被“提升”到最顶部，最后执行

### 解析顺序
- this和arguments（语言内置）
- 函数的形式参数
- 函数声明
- 变量声明

### 优先级<hr>
函数的声明比变量的声明的优先级要高

### es6中let关键字及块及作用域<hr>

  ```js
  a = 'renbo';
  var a;
  console.log( a ); // renbo

  // 编译后的代码
  var a;
  a = 'renbo';
  console.log(a); 
  ```


  ```js
  function demo() {
    a = 'renbo';
    console.log(a);
    console.log(window.a);
    var a = 'zhangsan';
    console.log(a);
  }
  demo(); 

  // 编译后的代码
  function demo() {
    var a;
    a = 'renbo';
    console.log(a);
    console.log(window.a);
    a = 'zhangsan';
    console.log(a);
  }
  demo(); // renbo undefined zhangsan
  ``` 
 ## 函数提升
  
  ```js
  // 两种函数的书写方式
  var fn = function fn(){} //函数表达式
  function fn(){} //函数声明方式 
  ```

  只有声明方式的函数才会有函数提升
  
  ```js
  test();
  function test(){
    console.log( a );
    var a = 'renbo';
  }

  // 编译后
  function test () {
    var a; // 在函数作用域内，被提升最前面
    console.log(a); // undefined
    a = renbo; 
  }
  test();
  ```
