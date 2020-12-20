---
title: 装饰器
date: 2019-07-18 18:20:27
top: false
cover: false
password:
toc: true
mathjax: false
summary: 
tags:
- TypeScript
categories:
- TypeScript
---

装饰器是一种为类声明和成员添加注释和元编程语法的方法，用于在编译时对类、类的方法、类的属性、类的方法的参数进行处理，通俗的讲就是在原有代码外层包装了一层处理逻辑，这样就可以在不改变原方法、函数等逻辑功能的基础上增加额外的处理行为

### **使用装饰器**

要启用装饰器功能需要开始experimentalDecorators选项，两种方式

命令行
```ts
tsc --target ES5 --experimentalDecorators
```

tsconfig.json配置
```ts
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

### **装饰器的简单应用**

定义一个装饰器

```ts
function people (target) {
  console.log(target)
}

```

在类中使用装饰器（@Decorator的语法是通过 @ 符号后边跟一个装饰器函数的引用）

```ts
@people
class People {
  constructor(){}
} 
```

### 装饰器工厂

解决在类中调用装饰器传参数的场景

```ts
// 装饰器工厂
function people(name : string) {   
  // 装饰器
  return function(target){       
    console.log(target);
  }
}

// 调用装饰器工厂
@people('zhangsan')
class People{
  constructor(){}
} 
```

### 多个装饰器应用

当在一个类上由多个装饰器调用的时候，类似于<a href="functionalCombination.md">函数组合</a>

定义多个装饰器

```ts
function decorator1() {
  console.log("decorator1(): start");
  return function (target) {
    console.log("decorator1(): end");
  }
}

function decorator2() {
    console.log("decorator2(): start");
    return function (target) {
      console.log("decorator2(): end");
    }
}
```

调用装饰器
```ts
class C {
  @decorator1()
  @decorator2()
  method() {}
}
```

输出结果为(可以看作组合函数调用 decorator1(decorator2()))

```ts
decorator1(): start
decorator2(): start
decorator2(): end
decorator1(): end
```

### 类装饰器（Class）

- 类装饰器应用于类的构造函数，用于观察，修改或替换类定义 
- 类会在class定义前调用，如果函数有返回值，它将使用提供的构造函数替换之前的构造函数
- 函数接收一个参数 `constructor` 之前的构造函数
- 如果返回新的构造函数，则必须维护原始原型

我们定义一个类，继承原有的类并对这个类增加一些属性

```ts
// 定义类装饰器
function personName<T extends {new(...args:any[]):{}}>(constructor:T){
  return class extends constructor {
    name = "zhangsan";
  }
}

// 使用类装饰器
@personName
class Person {
 public name: string;
  constructor (name: string) {
    this.name = name
    console.log(`Hi, my name is ${this.name}`) // Hi, my name is wangwu
  }
}

console.log(new Person('wangwu')) // class_1 {name: "zhangsan",__proto__:Person}
```

### 方法装饰器


方法，属性，get、set访问器，都可以认为是类成员。所以被分为了Method Decorator、Accessor Decorator和Property Decorator 这三个参数 


方法装饰只是一个方法声明之前声明，方法装饰器不能用于声明文件，重载或任何其他环境上下文（例如declare类中）

方法装饰器的表达式将在运行时作为函数调用，具有以下三个参数：
- 如果装饰器挂载于静态成员上，则会返回构造函数，如果挂载于实例成员上则会返回类的原型
- 装饰器挂载的成员名称
- 方法成员的属性描述对象（Object.getOwnPropertyDescriptor 的返回值）



所谓的访问器也就是有 get set 前缀的函数，方法是控制属性的赋值及取值，访问器装饰器和方法装饰器一样因为和下面要说到的属性装饰器一样都是类的成员具有三个参数

Method Decorator、Accessor Decorator和Property Decorator
使用方法装饰器

```ts
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```
```ts
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor{
    descriptor.enumerable = value;
  };
}
```

明确一下静态成员与实例成员在返回值上的区别

```ts
class Func {

  // 静态成员
  static method1 () {}
  static method2 = () => {}
  
  // 实例成员
  method3 () {}
  method4 = () => {}
}

```

静态成员 method1 和 method2 都是定义在 Func 构造函数上，method3 和 method4 区别在于 method3 定义在原型链之上 method4 只有在 Func 类实例化对象之后才有，转化ES5代码之后的样子

```ts
var Func = /** @class */ (function () {
    function Func() {
      this.method4 = function () { };
    }
    // 静态成员
    Func.method1 = function () { };
    // 实例成员
    Func.prototype.method3 = function () { };
    Func.method2 = function () { };
    return Func;
}());
```
通过函数可以证明上述论点装饰器挂载于静态成员上，则会返回构造函数，如果挂载于实例成员上则会返回类的原型 而且 method4 在实例化之前是一个不存在的属性所以没有 descriptor，就是为什么TS在针对Property Decorator不传递第三个参数的原因


### 访问器装饰器（get set）
访问器装饰器就是有get、set前缀的函数，用于控制属性的赋值及取值操作。上面说到和方法装饰器一样有三个参数

定义装饰器三个参数

```ts
function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}

```

定义带有get，set的类

```ts
class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
      this._x = x;
      this._y = y;
  }

  @configurable(false)
  get x() { return this._x; }

  @configurable(false)
  get y() { return this._y; }
}
```

### 属性装饰器

属性装饰器由于没有返回 descriptor 所以只有两个参数，没有方法成员的属性描述对象，如果想要修改某一个静态属性，可以通过 Object.getOwnPropertyDescriptor 获取 descriptor


*注意在TypeScript中如何初始化属性修饰符，因此不提供属性描述符作为属性修饰符的参数。这是因为当定义原型的成员时，当前没有机制来描述实例属性，也无法观察或修改属性的初始化器。返回值也被忽略。因此，属性装饰器只能用于观察已为类声明特定名称的属性。*

定义类
```ts
class Point {
  @configurable
  static x = 1;
}
```

定义属性装饰器获取类属性上的值进行更改
```ts
function configurable(target,x) {
  let descriptor = Object.getOwnPropertyDescriptor(target, x)
  Object.defineProperty(target, x, {
    ...descriptor,
    value: 2
  })
}
console.log(Point.x) // 2 
```

也可以使用 reflect-metadata 这个库它主要用来在声明的时候添加和读取元数据
使用的时候需要安装

```js
npm i reflect-metadata --save
```
之后在tsconfig.json 中配置emitDecoratorMetadata选项

```ts
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```


定义类
```ts
class Greeter {
    @format("Hello, %s")
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        let formatString = getFormat(this, "greeting");
        return formatString.replace("%s", this.greeting);
    }
}
```

// 利用 reflect-metadata 定义装饰器

Reflect.metadata 当作 Decorator 使用，当修饰类时，在类上添加元数据，当修饰类属性时，在类原型的属性上添加元数据


Reflect.getMetadata 能获取属性

```ts
import "reflect-metadata";

const formatMetadataKey = Symbol("format");
function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}
```

### 参数装饰器

参数装饰器和属性装饰器一样都是在函数运行时调用的，它接收3个参数

- 如果装饰器挂载于静态成员上，则会返回构造函数，如果挂载于实例成员上则会返回类的原型
- 参数所处的函数名称
- 参数在函数中形参中的位置


```ts
const obj = []

function require (value : string) {
  return function (target : any , propertyKey : string ,parameterIndex : number) {
    obj[parameterIndex] = value
  }
}

class Hello{
  method(@require('lisi') name : string){
    console.log(name)
  }
}

console.log(obj) // ['lisi']
```

