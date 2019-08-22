---
title: 偏应用函数、函数的柯里化
date: 2019-5-14 12:32:09
top: false
cover: false
password:
toc: true
mathjax: false
summary: 
tags:
- 函数式编程
categories:
- 函数式编程
---

偏应用函数简称偏函数，在模拟 bind 的时候已经说明其概念和作为主要 bind 的实现<br/>

函数柯里化主要是通过偏应用函数的实现，把接受多个参数的函数变换成接受一个单一参数的函数，并且返回接受余下的参数而且返回结果的新函数<br/>

```
// 柯里化之前
function add (a, b) {
  return a + b;
}

// 柯里化之后
function add (a) {
  return function (b) {
    return a+b
  }
}

// 等同于
const add = a => b => a + b;
const result = add(2)(3); // => 5
```
1. 首先函数接受 a 参数 然后返回一个新的匿名函数体确定了新的词法作用域,在该词法作用域中也拥有 a 参数
2. 该匿名函数调用传入参数 3 返回 a+b 的和
3. 通过上面程序了解到柯里化函数的特点是总是返回一个一元的函数：一个带有一个参数的新函数，不同的是普通函数可以根据需要一次获取尽可能多的参数


### 为什么要柯里化

1. 柯里化在函数组合的上下文中起到关键的作用,能够让你重新组合你的应用，将复杂的功能拆分成一个个简单的部分，这样容易更改，理解
2. 柯里化也是一种函数预加载的方法，通过传递较少的参数得到一个在相同词法作用域当中缓存了这些参数的新函数，其实这也是一种对参数的缓存


### 如何柯里化

```
// 普通
const sayName = name => age => `my name is ${name}, Im years old ${age}` ;
let name = sayName('zhangsan');
let age = name(27);

// 利用bind

function person (name, age, height) {
  console.log(`my name is ${name}, I,m years old ${age}, my height is ${height} meters`)
}
let info = person.bind(null, 'zhangsan');
console.log(info(27, 175));
```

### 柯里化函数的应用场景

1. 延迟计算
2. 参数复用
3. 动态创建函数

延迟计算<br/>
```

// 普通实现
var sum = function(args){
  return args.reduce(function(a,b){
      return a+b
  });
};
var result = sum([1,2,3,4,5]); // 15

// 柯里化实现
function add() {
  var _args = [].slice.call(arguments);
  var adder = function () {

      // 利用闭包特性保存_args的值
      var _adder = function() {
          [].push.apply(_args, [].slice.call(arguments));
          return _adder;
      };

      // 利用隐式转换的特性，计算最终的值返回
      _adder.toString = function () {
          return _args.reduce(function (a, b) {
              return a + b;
          });
      }

      return _adder;
  }
  return adder.apply(null, [].slice.call(arguments));
}

var sum = add();
sum(1,2,3)(4);
sum(5);
sum() // 15

优点：调用灵活，参数定义随意

充分利用了柯里化提延迟执行的特点
延迟执行 – 返回新函数可以进行任意调用
```

DOM操作中的事件绑定(动态创建函数)<br/>
当在多次调用同一个函数，并且传递的参数绝大多数是相同的。
``` 
// 普通版本
var addEvent = function(el, type, fn, capture) {
    if (window.addEventListener) {
      el.addEventListener(type, function(e) {
        fn.call(el, e);
      }, capture);
    } else if (window.attachEvent) {
      el.attachEvent("on" + type, function(e) {
        fn.call(el, e);
      });
    } 
 };

 // 柯里化版本
 var addEvent = (function(){
    if (window.addEventListener) {
      return function(el, type, fn, capture) {
        el.addEventListener(type, function(e) {
          fn.call(el, e);
        }, (capture));
      };
    } else if (window.attachEvent) {
      return function(el, type, fn, capture) {
        el.attachEvent("on" + type, function(e) {
            fn.call(el, e);
        });
      };
    }
})();

优点：不用每次调用进行 if () {}else {} 判断兼容性问题

充分利用了柯里化提前返回和延迟执行的特点
提前返回 – 使用函数立即调用进行了一次兼容判断（部分求值），返回兼容的事件绑定方法
延迟执行 – 返回新函数，在新函数调用兼容的事件方法。等待addEvent新函数调用，延迟执行
```

当然应用场景还有很多，比如我们经常提到的防抖和节流问题，充分的利用了函数式编程的延迟执行特性，将多个间隔接近的函数执行合并成一次函数执行来提高性能问题。<br/>
关于事件节流和防抖动将会在后续的专题中单独指出<br/>

















