## 变量提升与函数提升
  1. **js代码虽然是逐行向下执行的，但执行的时候分为两个步骤**
     - 编译阶段（词法解释/预解释）
     - 执行
  2. **函数声明和变量声明总是会被解释器(编译阶段)悄悄地被“提升”到最顶部，最后执行**
  3. **在js中变量解析的顺序**
    - this和arguments（语言内置）
    - 函数的形式参数
    - 函数声明
    - 变量声明
  4. **函数的声明比变量的声明的优先级要高**
  5. **es6中let关键字及块及作用域**
  6. **变量提升**
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
  7. **函数提升**
  
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

## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/closure.md'>JS基础系列之-闭包</a>

## JS基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/index.md'>JS基础系列</a>