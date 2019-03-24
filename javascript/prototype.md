## 原型及原型链
  1. **普通对象和函数对象**
      ```
        // 普通对象
        var obj1 = {}; 
        var obj2 = new Object();
        var obj3 = new person();
        // 函数对象
        function person(){}; 
        var person1 = function(){};
        var person2 = new Function('aaa','console.warn(aaaa)');
      
        console.log(typeof Object); //function 
        console.log(typeof Function); //function 
        
        console.log(typeof person); //function 
        console.log(typeof person1); //function 
        console.log(typeof person2); //function  
        console.log(person instanceof Function) // true 

        console.log(typeof obj1); //object 
        console.log(typeof obj2); //object 
        console.log(typeof obj3); //object
        console.log(obj3 instanceof Object)  // true
      ```
      通过以上实例我们知道 new Function 构建的都是函数对象(关于普通函数与new Function的区别请参考 <a href= "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">mozilla开发者</a>), 其余都是普通对象,关于Object与Function的区别会在这章节最后总结


  2. **通过构造函数模式创建对象<br/>**
      在js高程中我们知道创建对象有很多种模式如下：<br/>
      - 工厂模式
      - 构造函数模式
      - 原型模式
      - 组合使用构造函数和原型模式
      - 动态原型模式
      - 寄生构造函数模式
      - 稳妥构造函数模式<br/>
      当然这几种模式在这里暂时不展开说明，后续继承的时候在分别用讨论，我们这里简单的回忆一下用构造函数创建对象<br/>
      ```
        function Person(name, age) {
          this.name = name;
          this.age = age;
        }
        Person.prototype.sayName = function () {
          console.log(this.name)
        }
        var person1 = new Person('zhansan', 29);
        var person2 = new Person('lisi', 29);
      ```

  3. **这里我们清楚三个概念__proto__,prototype,constructor**
      - `__proto__`:在JavaScript权威指南中指出每个js对象一定对应一个原型对象，并从原型对象继承属性和方法。
      - `prototype`: 当创建函数对象时，js会自动为这个函数添加prototype属性（**这里明确一下只有函数对象才会有此属性**）
      - 每个原型都有一个 constructor 属性指向关联的构造函数。<br/>

      通过上述三点我们针对2中的代码解释为<br/>

      当创建`Person`函数时，js会自动为该函数创建`prototype`属性，这个属性指向函数的原型对象，函数的原型对象（`Person.prototype`）会自动获取一个`constructor`属性指向关联的Person。当我们通过new关键字调用时，js就会创建该构造函数的实例`person1`或`person2`，此时我们就可以通过`prototype`来存储要共享的属性和方法<br/>

      下面我们通过图例来说明我们上面的文字</br>
      <image src='https://github.com/MarsPen/-notes-summary/blob/master/images/Person.png'></image><br/>
      这里我们注意虽然person1和person2这两个个实例都不包含属性和方法，但是我们可以通过查找对象属性来实现调用person1.sayName()<br/>
      此时我们来确定两个实例对象返回的原型指针是否一样(**Object.getPrototypeOf 此方法可以获取对象的原型**)
      ```
      Object.getPrototypeOf(person1) === Person.prototype (true)
      Object.getPrototypeOf(person1) === Person.prototype (true)
      ```
      通过如上输出结果得知他们内部都有一个指向Person.prototype的指针也就是</br>
      ```
      person1.__proto__ === Person.prototype
      person2.__proto__ === Person.prototype
      ```

       经过上面解释这么多我们得出的结果就是如下 <br/>
      ```
      person1.__proto__ === Person.prototype
      Person.prototype.constructor == Person
      ```
  4. **我们清楚了简单的构造函数的__proto__,prototype,constructor三者之间的关系，那么接下来我们了解一下Object，清楚以下概念**
     - js几乎所有对象都是Object; 典型对象继承属性（包括方法）
     - 所有引用类型的原型链上必然存在Object的原型
     - new Object 出来的实例是普通对象我们前面说过只有函数对象才有prototype，
     - Object 实际是function Object跟function Function 类似
     - Object.prototype是Object构造函数的属性。它也是原型链的终结。<br/>
     ```
     function Object (name,age) {
       this.name = name;
       this.age = age;
     }
     Object.prototype.sayName = function () {
       console.log(this.name)
     }
     object = new Object('zhangsan',20)
     object.sayName()
     ```
     我们通样以图例的形式来说明Object的__proto__,prototype,constructor<br/>
     <image src='https://github.com/MarsPen/-notes-summary/blob/master/images/Object.png'></image><br/>
     通过以上图例我们得出结论`Object.prototype.__proto__ === null`

     这里面扩展一下null和undefined区别<br/>
     - null === undefined为false，null == undefined为true 说明只是值相等
     - null是一个表示"无"的对象，转为数值时为0；undefined是一个表示"无"的原始值，转为数值时为NaN。
     - null表示变量未指向任何对象，undefined表示变量被声明但是没有被赋值

  5. **前面我们了解到Object和构造函数的`__proto__,prototype,constructor`，那么接下来我们继续深入Function**<br/>
     - 在js中每个函数实际上都是一个Function对象。
     - 使用Function构造器生成的Function对象是在函数创建时解析的,而其他函数方式是跟其他代码一起解析，所以较为低效
     - 全局的Function对象没有自己的属性和方法，通过Function.prototype上继承部分属性和方法。
     - 我们说js中万物皆对象，Function也也是对象，只不过是函数对象所以`Function.prototype.__proto__`指针指向`Object.prototype`
     - `Object.__proto__` 指针指向`Function.prototype`

     **Function创建的函数一般在全局作用域中被创建，但并不会像其他函数一样产生闭包，所以只能自己内部和全局的变量**<br/>
       
     ```
     function Function (name,age){
       this.name  = name
       this.age = age
     }
     Function.prototype.sayName = function () {
       console.log(this.name)
     }
     f = new Function('zhangsan', 20)
     f.sayName ()
    
     ```
     我们同样以图例的形式来说明Function的__proto__,prototype,constructor<br/>
     <image src='https://github.com/MarsPen/-notes-summary/blob/master/images/Function.png'></image><br/>
     通过以上图例我们得出结论`Object.prototype === Function.prototype.__proto__`

  6. **接下来我们进行最后一步将上面Function，Object，Person链接起来**<br/>
     此时我们同样通过图例的形式将上面整合起来。来看看整个链路是什么样子。<br/>
     <image src='https://github.com/MarsPen/-notes-summary/blob/master/images/prototype.png'></image><br/>
     通过以上图例我们可以观察到其实js原型链就是由相互关联的链条组成，查找属性或者方法的过程就是图中红色链条的过程，如果找到则终止否则直到返回null<br/>
     `person1` > `person1.__proto__` > `Person.prototype` > `Person.prototype.__proto__` > `Object.prototype` > `Object.prototype.__proto__` > `null`<br/>

      最后我们来看一下Object和Function的关系，上面已经提到`Object.prototype === Function.prototype.__proto__`
      - `Function.__proto__` > `Function.prototype` > `Function.prototype.__proto__` > `Object.prototype` --> `Object.prototype.__proto__` --> 'null';简写为`Function.__proto__.__proto__.__proto__` > `null`
      - `Object.__proto__` > `Funtion.prototype` > `Function.prototype.__proto__` > `Object.prototype` >`Object.prototype.__proto__` > `null`;简写为`Object.__proto__.__proto__.__proto__` > `null` <br/>

      通过上面我们可以得出结论<br/>
      - 只有函数对象才有prototype，但是每个对象（普通对象和函数对象）都拥有__proto__属性
      - 原型对象都有一个constructor属性指向它们的构造函数（也就是自己）
      - 原生对象既是对象，也是构造函数
      - 实例对象的隐式原型始终指向构造函数的显式原型（`person1.__proto__` > `Person.prototype`）
      - 原型链的查找过程链接依赖__proto__指针逐级向上，并且原型链的尽头始终为null
      
## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/inheritance.md'>JS基础系列之-继承</a>

## JS基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/index.md'>JS基础系列</a>
