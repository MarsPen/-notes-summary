## 基础知识

### 基本数据类型与引用数据类型
1. 基本数据类型
  - 概念：基本数据类型是按值进行进行访问，变量是放在栈（stack）内存里
  - 种类：Undefined、Null、Boolean、String、Number、Symbol（es6） 
  - 基本数据类型的值是不可变的
    ```
    var str = "renbo";
    str.toUpperCase(); // RENBO
    console.log(str); // renbo
    ```
  - 按值进行比较
    ```
    var a = 1;
    var b = true;
    console.log(a == b); // true
    console.log(a === b); // false
    ```
    - 虽然数据类型不相同（true为bool,1为Number)但在比较之前js自动进行了数据类型的隐式转换
    - == 是进行值比较所以为true
    - === 不仅比较值还要比较数据类型所以为false
  - 栈内存中包含了变量的标识符和变量的值
    ```
    var a,b;
    a = 1;
    b = a;
    console.log(a); // 1
    console.log(b); // 1
    a = 2;
    console.log(a); // 2
    console.log(b); // 1
    ```
    - <image src='https://github.com/MarsPen/-notes-summary/blob/master/images/javascript-stack.png'></image>
### 变量提升
### 函数提升
### 闭包
### 关键字this
### 原型及原型链
### ES6新增api方法
### 操作常规数据ES5与ES6对比

