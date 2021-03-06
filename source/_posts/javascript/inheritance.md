---
title: 面向对象之继承
date: 2019-3-15 12:32:09
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

原型链虽然很强大，也可以用它来实现继承，但是总会有这样那样的问题。其中最主要的问题是原型链的引用问题。下面借鉴JS高程中的几种方式来学习JS继承,JS继承也是面向对象（oo）编程，但不使用类或者接口，而是使用创建对象的形式。虽然在ES6中实现了Class但其实只是语法糖，原理依然是__proto__。在JS超集中（TypeScript）用类与接口实现继承，会在后续文章中学习记录。

### 原型链继承

```js
function Parent () {
  this.name = 'zhansan';
}

Parent.prototype.sayName = function () {
    console.log(this.name);
}

function Child () {
}

Child.prototype = new Parent();

var child = new Child();
child.sayName() // zhangsan
```

  问题

  - 引用类型的值的原型属性会被所有实例共享
  - 在创建子类型的实例时不能向超类型的构造函数传参（没法办在不影响所有对象实例的情况下传参）

### 借用构造函数继承（经典继承）

在子类构造函数内部调用超类型构造函数

```js
function Parent () {
  this.name = ['zhangsan', 'lisi'];
}

function Child () {
  Parent.call(this);
}

var child = new Child();
child.name.push('wangyu');
child.name() // ['zhangsan', 'lisi' ,'wangyu']

var child1 = new Child();
child1.name() //  ['zhangsan', 'lisi']
```

优点：解决了原型链继承的问题

缺点：方法都在构造函数中定义，函数无法复用，创建实例时方法都会被创建一遍


### 组合继承（伪经典继承）

```js
function Parent (name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child (name, age) {

  Parent.call(this, name);
  this.age = age;
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

var child = new Child('zhangsan', '20');
child.colors.push('black');

console.log(child.name); // zhangsan
console.log(child.age); // 20
console.log(child.colors); // ["red", "blue", "green", "black"]

var child1 = new Child('lisi', '28');
console.log(child1.name); // lisi
console.log(child1.age); // 28
console.log(child1.colors); // ["red", "blue", "green"]
```

优点：融合原型链继承和构造函数的优

缺点：调用多次超类构造函数


### 原型式继承（道格拉斯）

```js
function createObj(o) {
  function F(){}
  F.prototype = o;
  return new F();
}

var person = {
  name: 'zhansan',
  hobbies: ['swimming', 'reading']
}

var person1 = createObj(person);
var person2 = createObj(person);

person1.name = 'person';
console.log(person2.name); // zhangsan

person2.hobbies.push('running');
console.log(person2.hobbies); // ["swimming", "reading", "running"]

```

缺点：引用类型的值的原型属性会被所有实例共享

### 寄生式继承（道格拉斯升级版）

```js
function createObj (o) {
  var clone = Object.create(o);
  clone.sayName = function () {
      console.log('zhangsan');
  }
  return clone;
}
```

缺点：跟借用构造函数模式一样，创建实例时方法都会被创建一遍

### 寄生组合式继承

```js
function inheritPrototype(Child, Parent){
  var prototype = Object.create(Parent.prototype);
  prototype.constructor = Child;
  Child.prototype = prototype;
}
function Parent(name){
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
Parent.prototype.sayName = function(){
  console.log(this.name);
};
function Child(name, age){
  Parent.call(this, name);
  this.age = age;
}
inheritPrototype(Child, Parent);//实现继承
Child.prototype.sayAge = function(){
  console.log(this.age);
}; 

```

优点：保证了原型链链路的正确性,没有多余的属性等优点，所以最为理想的ES5继承

### ES6继承

```js
//class 相当于es5中构造函数
//class中定义方法时，前后不能加function，全部定义在class的protopyte属性中
//class中定义的所有方法是不可枚举的
//class中只能定义方法，不能定义对象，变量等
//class和方法内默认都是严格模式
//es5中constructor为隐式属性
class Parent{
  constructor(name='wang',age='27'){
    this.name = name;
    this.age = age;
  }
  eat(){
    console.log(`${this.name} ${this.age} eat food`)
  }
}
//继承父类
class Child extends Parent{ 
  constructor(name = 'ren',age = '27'){ 
    //继承父类属性
    super(name, age); 
  } 
    eat(){ 
    //继承父类方法
      super.eat() 
    } 
} 
let child =new Child('xiaoxiami'); 
child.eat();
```

优点

- 在语法糖下代码量明显减少，和ES6区别ES5继承首先是在子类中创建自己的this指向，最后将方法添加到this中

```js
Child.prototype=new Parent() || Parent.apply(this) || Parent.call(this)
```

- es6继承是使用关键字先创建父类的实例对象this，最后在子类class中修改this







