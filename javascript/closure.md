## 闭包
  说起闭包那么首先先来了解一下js执行环境（execution context）、作用域以及作用域链（scope chain）
   1. **执行环境定义了变量或者函数有权访问的其他数据，决定了各自的行为**
      - 组成部分
          - 变量对象（varible object）：存放当前执行环境中定义的变量和函数，**如果当前环境是函数则将活动对象（activation object）作为变量对象，但不包括函数表达式**
          - 作用域链：当代码在执行环境中运行时，会创建**变量对象**的一个**作用域链（词法作用域）**，能够保证对执行环境中所有变量和函数有序访问
          - this指向：根据调用的规则不同this指向不同产生的执行环境上下文不同
      - 类型
          - 全局执行环境
          - 局部执行环境
      - 执行过程          
          - 在全局代码执行前, js引擎就会创建一个栈来存储管理所有的执行上下文对象
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
   2. **作用域**
      - 概念： 执行上下文中声明的变量和声明的作用范围。
      - 分类：
        - 全局作用域
        - 函数作用域
        - es6块级作用域
      - 作用： 隔离变量，不同作用域下同名变量不会有冲突
      - 区别：
        - 创建时机不同，全局执行上下文是在全局作用域确定后js代码执行前创建而函数执行上下文是在调用函数时, 函数体代码执行之前创建
        - 作用域是静态的，执行上下文是动态的
  3. **作用域链**
      - 从内到外多个作用域形成的链
      - 包含父级(**[[scope]]**)变量对象与作用域链和自身的变量对象(**如果是函数则为活动对象AO**)
        ```
        var x = 10;
        function fn () {
          console.log(x);
        }
        function show (fn) {
          var x = 20;
          fn();
        }
        show(fn) // 10;
        ```
  4. **闭包**
     - 概念： 能够访问其他函数内变量的函数，是一个比较特殊的作用域函数
     - 作用
       * 匿名自执行函数,减少内存消耗
          ```
          (function ($) {})(jQuery);
          ```
       * 缓存计算结果
          ```
            var fun1 = function(){
              var a=1;
              return function fun2(){
                a++;
                alert(a)
              }
            }
            var b = fun1();
            b(); // 2       
            b(); // 3           
          ```
       * 封装,管理私有方法和变量，避免全局变量冲突污染
          ```
          var person = function(){    
            var name = "renbo";       
            return {    
              getName : function(){    
                return name;    
              },    
              setName : function(newName){    
                name = newName;    
              }    
            }    
          }() 
          ```
       * 实现类和继承等等
     - 缺点：
       * 由于变量对象一直在内存中引用不被释放，导致内存过高。
       * 由于多个函数共享一个父级，当父级有变量更改时，所有子函数受影响

## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/this.md'>JS基础系列之-this</a>

## JS基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/index.md'>JS基础系列</a>
