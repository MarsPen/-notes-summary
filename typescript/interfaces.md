## 接口

在面向对象语言中接口 (Interfaces) 是对类的行为的抽象，在TypeScript中也常用于定义结构子类型，方便进行类型检查

> 定义一个简单的接口
```
interface IPeople {
  name: string;
  age: number
}

let zhangsan: IPeople = {
  name: 'zhangsan',
  age: 25
};

```

上面的例子我定义了一个接口 IPeople，并且定义了一个变量 zhangsan，它的类型是 IPerson，zhangsan的数据结构类型必须与 IPeople 一致否则会报错例如下面

```
interface IPeople {
  name: string;
  age: number
}

let zhangsan: IPeople = {
  name: 'zhangsan',
};

Property 'age' is missing in type '{ name: string; }' but required in type 'IPeople'
```

> 可选属性

当我们定义接口属性的时候不是必须的那么可选属性就起到了作用

```
interface IPeople {
  name: string;
  age?: number
}

let zhangsan: IPeople = {
  name: 'zhangsan',
};
```
> 任意属性

当我们需要定义或增加一些未知的属性，那么任意属性就起到了作用

```
interface IPeople {
  name: string;
  age?: number
  [propName: string]: any;
}

let zhangsan: IPeople = {
  name: 'zhangsan',
  age: 28,
  gender: 'm'
};
```
上述例子中需要注意的是一旦定义了任意属性，那么可选属性和确定属性的类型必须是它的的类型的子集，否则会报错，例如

```
interface IPeople {
  name: string;
  age?: number
  [propName: string]: string;
}

let zhangsan: IPeople = {
  name: 'zhangsan',
  age: 28,
  gender: 'm'
};

Type '{ name: string; age: number; gender: string; }' is not assignable to type 'IPeople'.
Property 'age' is incompatible with index signature.
Type 'number' is not assignable to type 'string'.
```

> 只读属性

当我们需要对象中字段只能在创建的时候被赋值，那么只读属性就起到了作用

```
interface IPerson {
  readonly id: number;
  name: string;
  age?: number;
  [propName: string]: any;
}

let zhangsan: IPerson = {
  id: 1,
  name: 'zhangsan',
  gender: 'm'
};

zhangsan.id = 2;

Cannot assign to 'id' because it is a read-only property.
```
> 可以为接口定义函数类型

```
interface IPeople {
  (name: string, age: number): string;
}

let hello: IPeople;
hello = function(name: string, age: number): string {
  return `my name is ${name} I,m years old ${age}`
}

hello('zhangsan', 28) //my name is zhangsan I,m years old 28
```


上面简单的介绍了接口的基本用法，也就是对对象的结构进行性约定，接下来我们来用 Interface 对类的行为进行抽象

> 用类实现接口

用类实现接口主要应用的场景就是类与类之间有一些公有的功能及特性，要实现高度抽象这也是面向对象的基本。在 TypeScript 中用关键字 implements 去实现。


```
// 定义接口，接口中有一个公共的方法eat
interface People{
  eat(food: string)
}
// 实现接口的方法
class Boy implements People {
  constructor () {}
  eat (food: string): string {
   return food 
  }
}
// 实现接口方法
class Girl implements People {
  constructor () {}
  eat (food: string):string {
    return food
  }
}

let boy = new Boy()
console.log(boy.eat('apple'))

let girl = new Girl()
console.log(girl.eat('banana'))

```

一个类也可以实现多个接口
```
interface Eat{
  food (food: string)
}
interface Drink{
  drink()
}
// 实现接口的方法
class People implements Eat, Drink {
  constructor () {}
  food (food: string): string {
   return food 
  }
  drink ():string {
    return `小明跑步中吃${this.food('apple')}是不健康的`
  }
}

let people = new People()
console.log(people.drink())
```

> 接口的继承

在 JS ECMA6 中类的继承用 extends 关键字， 那么在 TS 中我们依然同样用这个关键字

```
interface Eat {
  eat ()
}

interface People extends Eat {
  eat()
  run ()
}

```

> 混合类型

混合类型实际上就是在接口中存在多种规则，利用这种规则去实现自己的属性和方法

```
// 定义规则
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}
// 实现规则
function getCounter(): Counter {
  
  let counter = <Counter>function (start: number) { 
    console.log(start)
  };

  counter.interval = 0;

  counter.reset = function () {
    console.log('reset')
  };

  return counter;
}

let counter = getCounter()
counter(20); // 20
counter.reset(); // reset 
counter.interval = 5; // 5

```


## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/typescript/generics.md'>泛型</a>

## TypeScript基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/typescript/index.md'>TypeScript基础</a>
