---
title: new 运算符
date: 2019-4-27 12:32:09
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

实现 new 运算符也算是 JS 中经典的面试题了。在实际应用中其实 new 运算符的应用场景是定义对象类型的实例

### demo

```js
/**
 * 定义构造函数
 * @param {*} name 
 * @param {*} age 
 */
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayName = function () {
  console.log(`my name is ${this.name}, I'm ${this.age} years old`);
}

Person.prototype.study = function () {
  console.log(`my name is ${this.name}, I'm learning to swim`);
}

let person = new Person('renbo', 28);
console.log(person.name)
console.log(person.sayName())


// 调用内置函数
let array = new Array();
let obj = new Object();

```


### 模拟实现

用构造函数实际上会经历以下4个步骤（实现思路）

- 创建一个新对象
- 将构造函数的作用域赋给新对象（因此this就指向了这个对象）
- 执行构造函数中的代码（为这个新对象添加属性）
- 返回新对象

```js
function newFun (constructor) {
  var o = {};

  // 将 o 的原型指向构造函数，这样 o 就可以访问到构造函数原型中的属性
  o.__proto__ = constructor.prototype;

  // 改变构造函数 this 的指向到新建的对象，这样 o 就可以访问到构造函数中的属性
  var ret = constructor.apply(o, Array.prototype.slice.call(arguments, 1));

  // 需要判断返回的值是否是对象，如果不是对象返回正常数据类型
  return typeof ret === 'object' ? ret : o;
}


// 再次使用上面的例子
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayName = function () {
  return `my name is ${this.name}, I'm ${this.age} years old`;
}

Person.prototype.study = function () {
  return `my name is ${this.name}, I'm learning to swim`;
}

let person =  newFun(Person, 'renbo', 28);
console.log(person.name); // renbo
console.log(person.sayName()); // my name is renbo, I'm 28 years old
console.log(person.study()); // my name is renbo, I'm learning to swim
```























