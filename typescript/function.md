## TS基础系列之-函数

> 1.函数的创建
在 ts 中函数创建也氛围两种匿名函数和有命名的函数
```
// 有名字的函数
function people () {}

// 匿名函数
const people = function () {}
```

> 2.函数的参数类型和返回值类型
1. ⚠️只要参数类型是匹配的，那么就认为它是有效的函数类型，而不在乎参数名是否正
2. ⚠️设定了类型之后必须要返回相对应的类型，否则会报错
3. ⚠️如果函数没有返回任何值，也必须指定返回值类型为 void而不能留空
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

>3.函数的可选参数和默认参数
1. ⚠️传递给一个函数的参数个数必须与函数期望的参数个数一致，否则会报错
2. ⚠️可选参数用`?argname`表示，必须跟在必须参数后面
3. ⚠️没有传递参数或传递的值是undefined，这种叫做默认初始化值的参数
4. ⚠️所有必须参数**后面**的带默认初始化的参数都是可选的，调用时可省略
5. ⚠️带默认值的参数如果出现在必须参数**前面**，用户必须明确的传入 undefined 值来获得默认值

```
// 上述⚠️1
const add: (x: number, y: number) => number = (x: number, y: number):number => x + y 
add(1, 2) // 3
add(1) // 报错
add(1,2,3) // 报错

// 上述⚠️2
const yourName = (firstName: string, lastName?: string): string => `${firstName}+${lastName} `;
console.log(yourName('ren', 'bo')) //ren+bo
console.log(yourName('ren')) // ren+undefined


// 上述⚠️3
const yourName = (firstName: string, lastName?: string): string => `${firstName}+${lastName} `;
console.log(yourName('ren', 'bo')) //ren+bo
console.log(yourName('ren', undefined)) // ren+undefined

//上述⚠️4
const yourName = (firstName: string, lastName='bo'): string => `${firstName}+${lastName} `;
console.log(yourName('ren', 'bo')) //ren+bo
console.log(yourName('ren')) // ren+bo

// 上述⚠️5
const yourName = ( lastName='bo', firstName: string): string => `${firstName}+${lastName} `;
console.log(yourName('ren', 'bo')) //bo+ren
console.log(yourName(undefined, 'ren')) // ren+bo
```





