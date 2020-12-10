---
title: 数据类型
date: 2019-2-12 12:32:09
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

## 基本数据类型<hr>

  ### 概念 
  基本数据类型是按值进行进行访问，变量是放在栈（stack）内存里

  ### 种类
  Undefined、Null、Boolean、String、Number、Symbol（es6）

  基本数据类型的值是不可变的

  ```js
  var str = "renbo";
  str.toUpperCase(); // RENBO
  console.log(str); // renbo
  ```

  按值进行比较

  ```js
  var a = 1;
  var b = true;
  console.log(a == b); // true
  console.log(a === b); // false
  ```
  虽然数据类型不相同（true为bool,1为Number)但在比较之前js自动进行了数据类型的隐式转换

  == 是进行值比较所以为true

  === 不仅比较值还要比较数据类型所以为false

  栈内存中保存了变量的标识符和变量的值

  ```js
  var a,b;
  a = 1;
  b = a;
  console.log(a); // 1
  console.log(b); // 1
  a = 2;
  console.log(a); // 2
  console.log(b); // 1
  ```
  
  <image src='/images/javascript-stack.png'></image>

## 引用数据类型<hr>

  ### 概念 
  引用类型的值是保存在堆内存（Heap）中的对象（Object）

  ### 种类
  统称为Object，细分有：Object，Array，Function，Data，RegExp等

  引用类型的值式可变化的

  ```js
  var obj = {name:'renbo'};
  obj.name = 'zhangsan';
  obj.age = 28;
  obj.say = function () {
    return 'My name is' + this.name + 'I‘m' + this.age+ 'years old';
  }
  obj.say(); //My name is zhangsan I‘m 28 years old
  ```

  按引用地址比较

  ```js
  var obj = {};
  var obj1 = {};
  console.log(obj == obj1); // false
  console.log(obj === obj1) // false
  ```
  栈内存中保存了变量标识符和指向堆内存中该对象的指针

  堆内存中保存了对象的内容

  ```js
  var a = {name: 'renbo'};
  var b = a;
  a.name = 'zhangsan';
  console.log(b.name); // zhangsan
  b.age = 28;
  console.log(b.age) // 28
  b.say = function () {
    return 'My name is' + this.name + 'I‘m' + this.age+ 'years old';
  }
  console.log(a.say()); //My name is zhangsan I‘m 28 years old
  var c = {
    name:'zhangsan',
    age:28
  }
  ```
  
<image src='/images/javascript-stack1.png'></image>

### 类型检测
  **typeof**
  
  经常检查变量是不是基本数据类型

  ```js
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

  **instanceof**
  
  经常用来判断引用类型的变量具体是某种类型

  ```js
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

  ## 数据类型转换<hr>

  上面所有 typeOf 返回值为 “object” 的对象都包含一个内部属性[[Class]], 我们也可以通过[[Class]]来判断数据的类型，相比 typeof 较为准确。这个属性一般通过 Object.prototype.toString.call(...) 来查看，例如
  
```js
  Object.prototype.toString.call(['1,2,3']) // [object Array]
  Object.prototype.toString.call({ name:'mm',age:24 }) // [object Object]
  Object.prototype.toString.call(function demo() {}) // [object Function]
  Object.prototype.toString.call(/regex/i) // [object RegExp]
  Object.prototype.toString.call(new Date) // [object Date]
  Object.prototype.toString.call('123') // [object String]
  Object.prototype.toString.call(123)  // [object Number] 
  Object.prototype.toString.call(true) // [object Boolean]
  Object.prototype.toString.call(null) // [object Null]
  Object.prototype.toString.call(undefined) // [object Undefined]
  Object.prototype.toString.call(Symbol(1)) // [object Symbol]
```

从上面的例子中得出：

 - 对象的内部[[Class]]属性和创建该对象的内建原生构造相对应
 - 基本类型值由于没有length、toString()这样的方法需要`封装对象`才能访问，这时候引擎为基本类型包装一个封装对象俗称`装箱`

*装箱：是指将基本数据类型转换为对应的引用类型的操作。装箱分为隐式装箱和显示装箱*
 
所以当我们写如下代码时, TMM 被包装成 `String('TMM')`。
  
```js
let a = 'TMM';
a.toLowerCase() //tmm
```
引擎为什么要这么做呢？
- 开发使用更方便
- 使用基本数据类型操作内存更方便

再来看下面的例子

```js
var a = new String('abc')
var b = new String(42)
var c = new Boolean(true)

a.valueOf() // 'abc'
b.valueOf() // 42
c.valueOf() // true
```
上面例子是将封装对象转换为基本数据类型这种俗称拆箱，通常通过引用类型的 `valueOf()` 和 `toString()` 方法来实现


**强制类型转换**
- 类型转换发生在静态类型语言的编译阶段
- 强制类型转换发生在动态类型语言的运行时(runtime)
- 强制类型转换分为隐式转换和显示转换

```js
var a = 42
var b = a + "" // 隐式强制类型转换
var c = String(a) // 显示强制类型转换
```
在介绍显示和隐式强制类型转换之前，我们先来了解一下 ToString、ToNumber、ToBoolean、ToPrimitive 的转换规则
**ToString 运算符根据下表将其参数转换为字符串类型的值**
<image src="/images/type-to-string.jpg">

**ToNumber 抽象操作根据下表将其参数转换为数值类型的值**
<image src="/images/type-to-number.jpg">

**ToBoolean 抽象操作根据下表将其参数转换为布尔值类型的值**
<image src="/images/type-to-boolean.jpg">

**ToPrimitive 抽象操作根据下面转换规则**
- ToPrimitive 运算符把其值参数转换为非对象类型。
- 如果对象有能力被转换为不止一种原语类型，可以使用可选的期望类型来暗示那个类型
- 如果输入类型为 `undefined`,`null`、`Boolean`、`Number`、`String` 则结果等于输入的参数不进行转换
- 如果输入类型为对象，则返回改对象的默认值。调用改对象的内部方法<a href="https://www.w3.org/html/ig/zh/wiki/ES5/%E7%B1%BB%E5%9E%8B#DefaultValue-impl">[[DefaultValue]]</a> 来恢复这个默认值，调用时传递暗示的期望类型

下面我们看一下 ToPrimitive 相关源码

```js
// ECMA-262, section 9.1, page 30. Use null/undefined for no hint,
// (1) for number hint, and (2) for string hint.
function ToPrimitive(x, hint) {  
  // Fast case check.
  if (IS_STRING(x)) return x;
  // Normal behavior.
  if (!IS_SPEC_OBJECT(x)) return x;
  if (IS_SYMBOL_WRAPPER(x)) throw MakeTypeError(kSymbolToPrimitive);
  if (hint == NO_HINT) hint = (IS_DATE(x)) ? STRING_HINT : NUMBER_HINT;
  return (hint == NUMBER_HINT) ? DefaultNumber(x) : DefaultString(x);
}

// ECMA-262, section 8.6.2.6, page 28.
function DefaultNumber(x) {  
  if (!IS_SYMBOL_WRAPPER(x)) {
    var valueOf = x.valueOf;
    if (IS_SPEC_FUNCTION(valueOf)) {
      var v = %_CallFunction(x, valueOf);
      if (IsPrimitive(v)) return v;
    }

    var toString = x.toString;
    if (IS_SPEC_FUNCTION(toString)) {
      var s = %_CallFunction(x, toString);
      if (IsPrimitive(s)) return s;
    }
  }
  throw MakeTypeError(kCannotConvertToPrimitive);
}

// ECMA-262, section 8.6.2.6, page 28.
function DefaultString(x) {  
  if (!IS_SYMBOL_WRAPPER(x)) {
    var toString = x.toString;
    if (IS_SPEC_FUNCTION(toString)) {
      var s = %_CallFunction(x, toString);
      if (IsPrimitive(s)) return s;
    }

    var valueOf = x.valueOf;
    if (IS_SPEC_FUNCTION(valueOf)) {
      var v = %_CallFunction(x, valueOf);
      if (IsPrimitive(v)) return v;
    }
  }
  throw MakeTypeError(kCannotConvertToPrimitive);
}
```
我们梳理一下上面代码的逻辑
- 如果变量为字符串，直接返回
- 如果!IS_SPEC_OBJECT(x)，直接返回
- 如果IS_SYMBOL_WRAPPER(x)，则抛出异常
- 否则会根据传入的hint来调用 DefaultNumber 和 DefaultString，如果为 Date 对象，会调用 DefaultString
  - DefaultNumber：首先x.valueOf，如果为primitive，则返回valueOf后的值，否则继续调用x.toString，如果为primitive，则返回toString后的值，否则抛出异常
  - DefaultString：和DefaultNumber正好相反，先调用toString，如果不是primitive再调用valueOf

看了 ToPrimitive 的源码和解释，那么它到底有什么作用呢？实际上很多操作会调用 ToPrimitive，比如加，相等、或者比较等，让我们来看一个例子

```js
({}) + 1 // "[object Object]1"
```
上面代码会经历如下步骤
- {} 和 1 首先都会调用 ToPrimitive
- {} 会走到 DefaultNumber，然后先调用valueOf 返回 Object{},不是primitive类型，然后然后继续走到 toString 返回 [object Object]，是 String 类型
- 最后加操作结果为[object Object]1

**显式强制类型转换**

1、字符串和数字之间的显示转换

- 通过String(..)和Number(..)这两个内建函数
- 相关运算符 `+`、`~`、`~~`等

```js
var a = 42;
var b = String(42) // "42" 根据上面ECMA 转换规则 ToString 得出

var c = '3.14';
var d = Number(c);  // 3.14 根据上面ECMA 转换规则 ToNumber 得出
```
```js
// 涉及隐式转换，因为 42 这样的基本类型值没有 toString()
// 需要 JS 引擎装箱操作，然后调用 toString()
var a = 42;
var b = a.toString() // "42" 
                     
var c = "3.14"
var d = +c;  // 3.14 +运算符显式地将c转换为数字
var f = 5+ +c  // 5+ 3.14 ==> 8.14  
var g = '5'+ +c // '5'+ 3.14 ==> "53.14"
```
一元运算符+会将操作数`显式强制类型`转换为数字，而非数字加法运算（也不是字符串拼接）

```js
~42 // -(42+1) ==> -43  // 返回2的补码

var a = "Hello World"
if (a.indexOf('lo') !== -1) {
  // 找到匹配值
  console.log('1')
}
// ~ 只有反转 -1 的时候是假值，其余为真值，可用于代替判断
if(~a.indexOf('lo')) {
  // 找到匹配
  console.log('2')
}


Math.floor(-49.6) // -50
// 第一个~执行ToInt32并反转字位
// 第二个~再进行一次字位反转，即将所有字位反转回原值，最后得到的仍然是ToInt32的结果。
// 作用是能将值截除一个 32 位整数
~~-49.6 // -49   
```
字位运算符“非”(~) 只适用于32位整数，运算符会强制操作数使用32位格式。是通过抽象操作 <a href="https://www.w3.org/html/ig/zh/wiki/ES5/%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E4%B8%8E%E6%B5%8B%E8%AF%95#ToInt32.EF.BC.9A.EF.BC.8832_.E4.BD.8D.E6.9C.89.E7.AC.A6.E5.8F.B7.E6.95.B4.E6.95.B0.EF.BC.89"> ToInt32 </a>实现的

2、显式解析数字字符串

解析字符串中的数字和将字符串强制类型转换为数字的返回结果都是数字。但解析和转换两者之间还是有明显的差别

```js
var a = 42;
var b = "42px";

Number(a) // 42
parseInt(a) // 42

Number(b) // NaN
parseInt(b) // 42
```

- 解析允许字符串中含有非数字字符，解析按从左到右的顺序，如果遇到非数字字符就停止。而转换不允许出现非数字字符，否则会失败并返回NaN。
- parseInt 针对的是字符串，向parseInt(..)传递数字和其他类型的参数是没有用的，比如true、function(){...}和[1,2,3]。
- 关于更多 parseInt 请参考 <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt">MDN</a>

3、显式转换为布尔值

```js
var a = '0';
var b = [];
var c = {};

var d = '';
var e = 0;
var f = null;
var g;

// 利用 Boolean 显示转换 
Boolean(a) //true
Boolean(b) //true
Boolean(c) //true

Boolean(d) //false
Boolean(e) //false
Boolean(f) //false
Boolean(g) //false


// 一元运算符！显式地将值强制类型转换为布尔值,同时还将真值反转为假值（或者将假值反转为真值)
// 第二个！会将结果反转回原值
!! a //true
!! b //true
!! c //true
!! d //false
!! e //false
!! f //false
!! g //false
```

**隐式强制类型转换**

隐式强制类型转换指的是那些隐蔽的强制类型转换

1、字符串和数字之间的隐式强制类型转换

```js
var a = "42"
var b = "0"

var c = 42
var d = 0

a + b //420
c + d //42


var e = [1,2]
var f = [3,4]
e + f // "1,23,4"

// 坑
{} + [] // 0 , {}被当作代码块
[] + {} // "[object Object]"
```

根据<a href="https://www.w3.org/html/ig/zh/wiki/ES5/%E8%A1%A8%E8%BE%BE%E5%BC%8F#.E4.BA.8C.E5.85.83.E9.80.BB.E8.BE.91.E8.BF.90.E7.AE.97.E7.AC.A6">ES5规范</a>，如果某个操作数是字符串或者能够通过以下步骤转换为字符串的话，+将进行拼接操作。如果其中一个操作数是对象（包括数组），则首先对其调用ToPrimitive抽象操作，该抽象操作再调用[[DefaultValue]]。

```js
var a = {
  valueOf: function () {return 42},
  toString: function () {return 2}
}
a + '' //'42'
String(a)  // '2'
```
上面重写了对象的 valueOf 和 toString 导致和正常的返回结果不同，所以应尽量避免重写这些方法

2、隐式强制类型转换为布尔值

下面的情况会发生布尔值隐式强制类型转换

- `if (..)`语句中的条件判断表达式。
- `for ( .. ; .. ; .. )`语句中的条件判断表达式（第二个）
- `while (..)`和`do..while(..)`循环中的条件判断表达式
- `? ：`中的条件判断表达式
- 逻辑运算符 `||`（逻辑或）和 `&&`（逻辑与）左边的操作数（作为条件判断表达式）

以上情况中，非布尔值会被隐式强制类型转换为布尔值，遵循前面介绍过的ToBoolean抽象操作规则。

3、逻辑运算符||（或）和 &&（与）

&& 和 || 运算符的返回值并不一定是布尔类型，而是两个操作数其中一个的值

```js
var a = 42;
var b = "abc";
var c = null;

a || b //42
a && b // "abc"

c || b //"abc"
c && b //null
```

- || 和 && 首先会对第一个操作数执行条件判断，如果其不是布尔值就先进行ToBoolean强制类型转换，然后再执行条件判断。
- || 如果条件判断结果为true就返回第一个操作数的值，如果为false就返回第二个操作数的值。
- && 则相反，如果条件判断结果为true就返回第二个操作数的值，如果为false就返回第一个操作数的值。

虽然 `&&` `||` 返回的不是 `true` 和 `false`，那么为什么 `a && (b || c)` 这样的表达式在 `if` 和 `for` 中没出过问题?

```js
var a = 42;
var b = null;
var c = "foo";

if (a && (b || c)) {
  console.log('执行成功')
}
```
上面的代码 `a && (b || c)` 的结果实际上是“foo”而非true，最后经过if 将 foo 强制类型转换为布尔值，所以最后结果为true,实际上相当于执行了下面的代码

```js
if (!!a && (!!b || !!c)) {
  console.log('执行成功')
}

```
4、符号的强制类型转换
符号不能够被强制类型转换为数字（显式和隐式都会产生错误），但可以被强制类型转换为布尔值（显式和隐式结果都是true）

```js
var s1 = Symbol("cool");
String(s1); //"Symbol(cool)"

var s2 = Symbol ("newcool");
s2 + ""  // TypeError(Cannot convert a Symbol value to a string)
```

**宽松相等和严格相等**

宽松相等（loose equals）==和严格相等（strict equals）===都用来判断两个值是否“相等”，经常在面试中会被问到 == 和 === 区别是什么？
大多数人回答的是 “==检查值是否相等，===检查值和类型是否相等”，这样解释没有错，但是不够准确，正确的应该是 “==允许在相等比较中进行强制类型转换，而===不允许。”

1、数字和字符串之间的比较

```js
var a = 42;
var b = "42";

a === b; // false
a == b; //true
```
a === b 因为没有强制类型转换所有为false，而a == b 需要进行类型转换的，具体的转换步骤是：
- 如果Type(x)是数字，Type(y)是字符串，则返回x == ToNumber(y)的结果
- 如果Type(x)是字符串，Type(y)是数字，则返回ToNumber(x) == y的结果。

2、其他类型和布尔类型之间的相等比较

==最容易出错的一个地方是true和false与其他类型之间的相等比较

```js
var a = 42; 
var b = true 

a == b  // false 
```
上面的例子为什么  a == b 是 false  呢？其实遵循了如下规则
- 如果Type(x)是布尔类型，则返回ToNumber(x) == y的结果
- 如果Type(y)是布尔类型，则返回x == ToNumber(y)的结果

所以转换过后也就是 42 == 1；所以为 false。

```js
var a = 42;
// 不能这样用，条件不成立
if (a == true) {// 执行}
// 可以这样
if (a) {// 执行} 
// 也可以这样显示的用法
if(!!a) {// 执行}
// 也可以这样
if(Boolean(a)) {// 执行}
```

3、null 和 undefined 之间的相等比较

null和undefined之间的==也涉及隐式强制类型转换，但是唯独这两个比较特殊，ES5规范中规定了下面的规则
- 如果x为null, y为undefined，则结果为true
- 如果x为undefined, y为null，则结果为true
也就是说 null 和 undefined在 == 中相等，也可以说是一回事，除此之外其他值都不存在这种情况

4、对象和非对象之间的相等比较

对象（对象/函数/数组）和标量基本类型（字符串/数字/布尔值）之间的相等比较，ES5规范中规定了下面的规则

- 如果Type(x)是字符串或数字，Type(y)是对象，则返回x == ToPrimitive(y)的结果
- 如果Type(x)是对象，Type(y)是字符串或数字，则返回ToPrimitive(x) == y的结果

```js
var a = [42]
var b = 42 

a == b // true 
```

但是有一些值是例外的，原因是==算法中其他优先级更高的规则

```js
var a = null
var b = Object(a)
a == b // false 

var c 
var d = Object(c)
c == d // fasle 

var e = NaN
var f = Object(e)
e == f // false 
```

因为没有对应的封装对象，所以null和undefined不能够被封装（boxed）,Object(null)和Object()均返回一个常规对象

NaN能够被封装为封装对象，但拆封之后NaN == NaN返回false，因为NaN不等于NaN


**比较少见的情况**

1、 返回其他数字

```js
Number.prototype.valueOf = function () {
  retrun 3
}
new Number(2) == 3  // true
```
原因还是因为Number(2)涉及ToPrimitive强制类型转换，因此会调用valueOf()，然而我们修改了返回值。
所以这块有一个经典的面试题，如何让以下情况同时满足

```js
if (a == 2 && a == 3) {
  // ...
}
```
解法就是： 
```js
var i = 2;
Number.prototype.valueOf = function () {
  return i++
}
var a = new Number (10) // 参数传入多少都不会影响其返回值
if (a == 2 && a == 3) {
  // ...
}
```

2、假值的相等比较

下面列出了常规和非常规的情况
```js
'0' == null // false
'0' == undefined // false 
'0' == false // true  --注意
'0' == NaN // false 
'0' == 0 // true
'0' == '' // false


false == null // false
false == undefined  // false
false == NaN  // false 
false == 0    // true --注意
false == ''  // true--注意
false == [] // true--注意
false == {} // false 

"" == null //false
"" == undefined // false
"" == NaN //false
"" == 0 // true-- 注意
"" == [] // true--注意
"" == {} // false


0 == null //false 
0 == undefined // false
0 == NaN // false
0 == [] // true //--注意
0 == {} // false 
```
以上24种情况，有17种情况比较好理解。因为我们知道 NaN和任何其他值都不想等包括自己。undefined 和 null 相等，除外都不相等。其他7种标识注意的地方没有什么好的方法，最好背下来


3、极端的情况
```js
[] == ![]  //true 
```
上面是根据ToBoolean规则，进行布尔值强制类型转换。所以变成了[] == false，根据上面的假值相等的情况，就为true

4、安全的运用隐式强制类型转换
我们要对 == 两边的值认真推敲，以下两个原则可以避免出错

- 如果两边的值中有true或者false，千万不要使用==
- 如果两边的值中有[]、""或者0，尽量不要使用==

这个时候 === 就是我们最好的选择，相对来说更安全。

### 参考<hr>
<a href="http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf">ECMA-262</a>
<a href="https://www.w3.org/html/ig/zh/wiki/ES5">ES5规范</a>





 










