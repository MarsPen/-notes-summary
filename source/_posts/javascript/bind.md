---
title: bind 函数的实现
date: 2018-10-23 12:32:09
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

bind 方法其实和 call apply 功能上差不多，只不过 bind() 方法会绑定一个新的函数，通过这个新的函数我们可以当作构造函数、偏函数等等去使用


### 作为绑定函数使用

例子一 <br/>

```
this.value = 20;

let obj = {
  value: 29,
  getValue:function () {
    return this.value;
  }
}

// 直接调用 this 指向 obj
obj.getValue()  // 29

// obj.getValue 是一个函数体，在全局作用域中调用，所以 this 指向 window
let valFun = obj.getValue;
valFun(); // 20

// 使用 bind 将当前的 this 指针指向 obj 对象上
let boundGetValue = valFun.bind(obj);
boundGetValue(); // 29
```

例子二 <br/>

```
/**
 * obj.getValue() 返回的是一个匿名函数
 * obj.getValue()() 立即执行函数
 * 匿名函数上下文执行环境具有全局性，所以 this 通常指向 window
 */
this.value = 20;

let obj = {
  value: 29,
  getValue:function () {
    return function () {
      return this.value
    }.bind(this);
  }
}

obj.getValue()() // 20



// 利用bind我们可以使匿名函数的 this 指针指向当前对象（当然还有很多方法比如在匿名函数内增加变量 _this = this）
this.value = 20;

let obj = {
  value: 29,
  getValue:function () {
    return function () {
      return this.value
    }.bind(this);
  }
}

obj.getValue()() // 29


// 当然要是改变上述 this 指针不只用 bind 可以如下方法(还有很多方法 比如 apply call)
this.value = 20;

let obj = {
  value: 29,
  getValue:function () {
    let _this = this;
    return function () {
      return _this.value
    }
  }
}

obj.getValue()() // 29

```

### 作为偏函数使用

使一个函数拥有预设的初始参数，这就是偏函数。比如函数A已经拥有参数或者变量，此时我们通过调用函数A，产生函数B，我们就说B为偏函数<br/>
在这里我们不展开说明偏函数，柯里化一些函数式编程的概念，在 **JS 高级系列** 函数式编程中会有详细介绍<br/>

例子<br/>

```
/**
 * 插入到目标函数的参数列表的开始位置
 * 传递给绑定函数的参数会跟在它们后面
 */
function list() {
  return Array.prototype.slice.call(arguments);
}

// 偏函数
let listArr = list.bind(null, 28);

console.log(listArr()); // [28]

console.log(listArr(1, 2, 3)); // [28, 1, 2, 3]


/**
 * 多次 bind 无效 只能执行一次
 * bind 内部 使用call apply 实现
 */

function bar () {
  console.log(this.value);
}

let foo = {
  value: 1
}

let foo1 = {
  value: 2
}

let func = bar.bind(foo).bind(foo1);
console.log(func()); // 1

```

### 模拟第一步

通过上面的应用我们实现 bind 有几个条件<br/>
1、bind 会返回一个新的函数<br/>
2、可以传递任意参数<br/>
3、绑定 bind 的函数可以有返回值<br/>

```
Function.prototype.newBind = function (context) {
  var _this = this;
  // 获取 bind 的参数，如上面偏函数的例子
  var _args = Array.prototype.slice.call(arguments, 1);
  // 返回新函数
  return function () {
    // bind 返回函数传入的参数
    var _bindArgs = Array.prototype.slice.call(arguments);
    // 合并参数返回
    return self.apply(context, _args.concat(_bindArgs));
  }
}

```

### 模拟第二步

通过第一步其实我们已经模拟了 bind 的大部分功能，但是在 JS 中也可以把函数当成构造函数来用 可以使用 new 关键字， 这个时候 bind 绑定的函数的 this 就会失效，因为在构造函数中 this 永远指向的是它的实例，关于 new 会在下篇文章中作出解释<br/>

1、通过修改返回的函数的原型，来改变 this 指向问题<br/>
2、调用 bind 一定是函数，否则提示错误<br/>

```
Function.prototype.newBind  = function (context) {

  // 提示错误信息
  if (typeof this != 'function') {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }

  var _this = this;
  
  // 获取参数
  var _args = Array.prototype.slice.call(arguments, 1);

  // 利用空函数来防止修改绑定函数的原型，关于 prototype 请查看 prototype 章节
  var _fNOP = function () {};

  // bind 返回的新函数
  var _fBound = function () {
    var _bindArgs = Array.prototype.slice.call(arguments);
    // 如果返回的 _fBound 被当做 new 的构造函数调用
    return _this.apply(this instanceof _fBound ? this : context, args.concat(_bindArgs));
  }

  // 让 _fBound 构造的实例继承绑定函数原型中的值，否则会修改绑定函数的原型的值
  _fNOP.prototype = this.prototype;
  _fBound.prototype = new _fNOP();

  return _fBound;
}

```















