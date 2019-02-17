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
2. 引用数据类型
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
3. 类型检测
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
### 变量提升与函数提升
  1. js代码虽然是逐行向下执行的，但执行的时候分为两个步骤
     - 编译阶段（词法解释/预解释）
     - 执行
  2. 函数声明和变量声明总是会被解释器(编译阶段)悄悄地被“提升”到最顶部，最后执行
  3. 在js中变量解析的顺序
    - this和arguments（语言内置）
    - 函数的形式参数
    - 函数声明
    - 变量声明
  4. 函数的声明比变量的声明的优先级要高
  5. es6中let关键字及块及作用域
  6. 变量提升
  - demo1
     ```
     a = 'renbo';
     var a;
     console.log( a ); // renbo

     // 编译后的代码
     var a;
     a = 'renbo';
     console.log(a); 
     ```
  - demo2
      ```
      function demo() {
        a = 'renbo';
        console.log(a);
        console.log(window.a);
        var a = 'wanghaixia';
        console.log(a);
      }
      demo(); 

      // 编译后的代码
      function demo() {
        var a;
        a = 'renbo';
        console.log(a);
        console.log(window.a);
        a = 'wanghaixia';
        console.log(a);
      }
      demo(); // renbo undefined wanghaixia
      ``` 
  7. 函数提升
  
   ```
   // 两种函数的书写方式
   var fn = function fn(){} //函数表达式
   function fn(){} //函数声明方式 
   ```
   - 只有声明方式的函数才会有函数提升
   ```
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

### 闭包
  说起闭包那么首先先来了解一下js执行环境（execution context）、作用域以及作用域链（scope chain）
   1. **执行环境**定义了变量或者函数有权访问的其他数据，决定了各自的行为
      - 组成部分
          - 变量对象（varible object）：存放当前执行环境中定义的变量和函数，**如果当前环境是函数则将活动对象（activation object）作为变量对象，但不包括函数表达式**
          - 作用域链：当代码在执行环境中运行时，会创建**变量对象**的一个**作用域链（词法作用域）**，能够保证对执行环境中所有变量和函数有序访问
          - this指向：根据调用的规则不同this指向不同产生的执行环境上下文不同
      - 类型
          - 全局执行环境
          - 局部执行环境
      - 执行过程          
          - 在全局代码执行前, JS引擎就会创建一个栈来存储管理所有的执行上下文对象
          - 在全局执行环境(window)确定后, 将其push到栈中
          - 在函数执行环境创建后, 将其push到栈中
          - 在当前函数执行完后,将栈顶的对象pop
          - 当所有的代码执行完后, 栈中只剩下window
          ```
            /*
            *demo1:  先执行变量提升, 再执行函数提升
            */
            
            function a() {}
            var a
            console.log(typeof a) // 'function'

            /*
            *demo2:
            */
            if (!(b in window)) {
              var b = 1
            }
            console.log(b) // undefined

            /*
            *demo3:
            */
            console.log(a);    // f a() {console.log(10)}
            console.log(a());    //  undefined
            var a = 1;
            function a() {
              console.log('nihao') //nihao
            }
            console.log(a)   //1
            a = 3;
            console.log(a());  //a is not a function;

            /*
            *demo4:
            */
            function fun(){ var a=b=3;}
            console.log(b)//B是全局变量 var a是局部变量  b=3;a=undefine
          ```
   2. 作用域
      - 概念： 执行上下文中声明的变量和声明的作用范围。
      - 分类：
        * 全局作用域
        * 函数作用域
        * es6块级作用域
      - 作用： 隔离变量，不同作用域下同名变量不会有冲突
      - 区别：
        * 创建时机不同，全局执行上下文是在全局作用域确定后js代码执行前创建而函数执行上下文是在调用函数时, 函数体代码执行之前创建
        * 作用域是静态的，执行上下文是动态的。
    3. 作用域链
  
### 关键字this
### 原型及原型链
### ES6新增api方法
### 操作常规数据ES5与ES6对比

