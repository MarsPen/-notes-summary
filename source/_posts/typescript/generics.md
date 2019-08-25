---
title: 泛型
date: 2019-05-22 18:20:27
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

泛型（Generics）就是不提前指定接口、变量、函数等的类型，在使用的时候再指定类型

### 定义泛型 <br/>

```
// 定义类型
function identity(arg: number): number {
  return arg;
}
// 定义 any 类型
function identity(arg: any): any {
  return arg;
}
```

如果所有的接口、变量、函数等都用 any 类型，那么写 TS 和写 JS 一样将失去意义，因为你可能像 JS 一样造成许多未知的错误，那么解决这样的问题我们使用一种特殊的变量T，来表示返回的内容。

```
function identity<T>(arg: T): T {
  return arg;
}
```

### 调用泛型<br/>

```
let output = identity<string>("myString");
```

### 泛型约束<br/>

在函数内部使用泛型变量的时候，因为不知道它是哪种类型，所以不能随意的操作它的属性或方法

```
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);  // Error: T doesn't have .length
  return arg;
}
```
由于上面的泛型 T 中不一定包含属性.length, 所以会抛出异常。

这时我们可以创建一个具有单个.length属性的接口，然后我们将使用此接口和extends关键字来表示我们的约束：
```
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); 
  return arg;
}

```

上面的例子如果在调用的时候传入的参数不符合定义的约束，那么就会抛出异常
```
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); 
  return arg;
}

loggingIdentity(5) 
// Argument of type '5' is not assignable to parameter of type 'Lengthwise'

```

相反如果定义了正确的类型
```
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); 
  return arg;
}

loggingIdentity([1,2]) // 2
loggingIdentity({length: 5, value: 1}) // 5
```

### 泛型接口<br/>

```
// 定义泛型结构
interface CreatePeopleFunc {
  <T>(name: string, age: T): Array<T>;
}

// 创建泛型
let createPeople:CreatePeopleFunc;
createPeople = function<T>(name: string, age: T): Array<T> {
  let people: T[] = []
  let temp:any = {
    name : name,
    age: age
  }
  people.push(temp)
  return people
}
// 调用函数
createPeople('zhangsan', 28)
```
上面例子我们定义了一个泛型，创建了函数，在函数内创建数组并添加了一个元素 name, age

### 泛型类<br/>

泛型类具有与通用接口类似的形状。泛型类<>在类名称后面的尖括号（）中有一个泛型类型参数列表

```
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```



