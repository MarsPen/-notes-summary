---
title: 函数
date: 2017-01-23 12:32:09
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

### 函数的创建 <br/>

在 ts 中函数创建也氛围两种匿名函数和有命名的函数
```
// 有名字的函数
function people () {}

// 匿名函数
const people = function () {}
```

### 函数的参数类型和返回值类型 <br/>
- 只要参数类型是匹配的，那么就认为它是有效的函数类型，而不在乎参数名是否正
- 设定了类型之后必须要返回相对应的类型，否则会报错
- 如果函数没有返回任何值，也必须指定返回值类型为 void而不能留空
```
/**
 * 
 * @param {*} x number
 * @param {*} y number
 *  return add number 
 */

const add = (x: number, y: number): number => x + y;
// 书写完整的函数类型
const add: (x: number, y: number) => number = (x: number, y: number):number => x + y 
```

### 函数的可选参数和默认参数<br/>
- 传递给一个函数的参数个数必须与函数期望的参数个数一致，否则会报错
- 可选参数用`?argname`表示，必须跟在必须参数后面
- 没有传递参数或传递的值是undefined，这种叫做默认初始化值的参数
- 所有必须参数**后面**的带默认初始化的参数都是可选的，调用时可省略
- 带默认值的参数如果出现在必须参数**前面**，用户必须明确的传入 undefined 值来获得默认值
- 当传入的参数个数不固定时，将所有参数收集到一个变量里和 js 中的 arguments 类似，剩余参数会被当做个数不限的可选参数。 可以一个都没有，同样也可以有任意个表达方式为（...）

```
// 上述1
const add: (x: number, y: number) => number = (x: number, y: number):number => x + y 
add(1, 2) // 3
add(1) // 报错
add(1,2,3) // 报错

// 上述2
const yourName = (firstName: string, lastName?: string): string => `${firstName}+${lastName} `;
console.log(yourName('ren', 'bo')) //ren+bo
console.log(yourName('ren')) // ren+undefined


// 上述3
const yourName = (firstName: string, lastName?: string): string => `${firstName}+${lastName} `;
console.log(yourName('ren', 'bo')) //ren+bo
console.log(yourName('ren', undefined)) // ren+undefined

//上述4
const yourName = (firstName: string, lastName='bo'): string => `${firstName}+${lastName} `;
console.log(yourName('ren', 'bo')) //ren+bo
console.log(yourName('ren')) // ren+bo

// 上述5
const yourName = ( lastName='bo', firstName: string): string => `${firstName}+${lastName} `;
console.log(yourName('ren', 'bo')) //bo+ren
console.log(yourName(undefined, 'ren')) // ren+bo


// 上述6
const people = ( name: string, ...otherProperty: string[]): string => {
  return name + " " + otherProperty.join(" ");
}
console.log(people('renbo', '28','170'))  // renbo 28 170 
```

### 函数的重载 <br/>

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理

```
// 我们来实现一下通过传入不同的 type 来实现函数的加操作和乘法操作并返回相应的类型
const compute = (type: number, ...resetData: number[]):number | string => {
  if (type === 1 ) {
    return resetData.reduce((a:number, b:number):number => a + b);
  } else if (type === 2) {
    return String(resetData.reduce((a:number, b:number):number => a * b));
  }
} 
console.log(compute(1, 3, 4, 5, 6)) // 18
console.log(compute(2, 3, 4, 5, 6)) // '360'

// 通过上面的实现唯一的缺点就是不能明确通过type返回的相对应的计算的值和类型

const compute = (type: number, ...resetData: number[]):number;
const compute = (type: number, ...resetData: number[]):string;
const compute = (type: number, ...resetData: number[]):number | string => {
  if (type === 1 ) {
    return resetData.reduce((a:number, b:number):number => a + b);
  } else if (type === 2) {
    return String(resetData.reduce((a:number, b:number):number => a * b));
  }
} 
console.log(compute(1, 3, 4, 5, 6)) // 18
console.log(compute(2, 3, 4, 5, 6)) // '360'

// 上例中，我们重复定义了多次函数 compute，前几次都是函数定义，最后一次是函数实现。
```


## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/typescript/class.md'>类</a>

## TypeScript基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/typescript/index.md'>TypeScript基础</a>


