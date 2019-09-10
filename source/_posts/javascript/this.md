---
title: this
date: 2019-3-5 12:32:09
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

### 概念
js的关键字，在执行上下文环境时被绑定

### 绑定规则
默认绑定、隐式绑定、apply,call、new绑定。优先级从低到高

### 默认绑定

```js
console.log(this); //window
function fun() {
console.log(this.a) // 非严格模式下1 ，严格模式下undefined
}
var a = 1;
fun(); 
```

### 隐式调用
作为对象方法调用，this 指代上下文对象

```js
function fun() { 
  console.log( this.a );
}
var a = 1;
var obj = { 
  a: 2,
  fun: fun 
};
obj.fun(); // 2
var c = obj.fun;
console.log(c()); // 1
```

### apply,call
改变对象的prototype关联对象来改变this,对于null，undefined绑定会失效

```js
function fun() { 
  console.log( this.a );
}
var a = 1;
var obj1 = { 
  a: 2,
};
var obj2 = { 
  a: 3,
};
fun.call( obj1 ); // 2
fun.call( obj2 ); // 3
fun.call( null ); // 1
fun.call( undefined ); // 1
```

### 作为构造函数调用

this 指代new 出的对象
使用new来调用函数，会自动执行如下操作：
- 创建一个全新的对象。
- 这个新对象会被执行[[原型]]连接。
- 这个新对象会绑定到函数调用的this。
- 如果函数没有返回其他对象,那么new表达式中的函数调用会自动返回这个新对象。
  ```js
  function fun(a) { 
    this.a = a;
  }
  var a = 1;
  var obj = new fun(3);
  console.log(obj.a); // 3
  var obj1 = new fun(4);
  console.log(obj1.a); // 4
  ```

### es6中箭头函数this指向
  取决于外层（函数或全局）作用域。
