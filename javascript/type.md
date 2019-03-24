## 基本数据类型与引用数据类型
1. **基本数据类型**
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
  - 栈内存中保存了变量的标识符和变量的值
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
    <image src='https://github.com/MarsPen/-notes-summary/blob/master/images/javascript-stack.png'></image>
2. **引用数据类型**
  - 概念：引用类型的值是保存在堆内存（Heap）中的对象（Object）
  - 种类：统称为Object，细分有：Object，Array，Function，Data，RegExp等
  - 引用类型的值式可变化的
    ```
    var obj = {name:'renbo'};
    obj.name = 'wanghaixia';
    obj.age = 28;
    obj.say = function () {
      return 'My name is' + this.name + 'I‘m' + this.age+ 'years old';
    }
    obj.say(); //My name is wanghaixia I‘m 28 years old
    ```
  - 按引用地址比较
    ```
    var obj = {};
    var obj1 = {};
    console.log(obj == obj1); // false
    console.log(obj === obj1) // false
    ```
  - 栈内存中保存了变量标识符和指向堆内存中该对象的指针
  - 堆内存中保存了对象的内容
  ```
  var a = {name: 'renbo'};
  var b = a;
  a.name = 'wanghaixia';
  console.log(b.name); // wanghaixia
  b.age = 28;
  console.log(b.age) // 28
  b.say = function () {
    return 'My name is' + this.name + 'I‘m' + this.age+ 'years old';
  }
  console.log(a.say()); //My name is wanghaixia I‘m 28 years old
  var c = {
    name:'zhangsan',
    age:28
  }
  ```
  <image src='https://github.com/MarsPen/-notes-summary/blob/master/images/javascript-stack1.png'></image>
3. **类型检测**
  - typeof：经常检查变量是不是基本数据类型
    ```
    var a;

    a = "hello";
    typeof a; // string

    a = true;
    typeof a; // boolean

    a = 1;
    typeof a; // number 

    a = null;
    typeof a; // object

    typeof a; // undefined
    
    a = Symbol();
    typeof a; // symbol

    a = function(){}
    typeof a; // function

    a = [];
    typeof a; // object

    a = {};
    typeof a; // object

    a = /renbo/g;
    typeof a; // object   
    ```
  - instanceof：经常用来判断引用类型的变量具体是某种类型
    ```
    var a;
    a = function(){}
    a instanceof Function; // true

    a = [];
    a instanceof Array; // true

    a = {};
    a instanceof Object; // true

    a = /renbo/g;
    a instanceof RegExp ; // true    
    ```

## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/voao.md'>JS基础系列之-变量提升与函数提升</a>

## JS基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/index.md'>JS基础系列</a>

