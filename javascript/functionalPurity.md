## 函数式编程-纯函数

说纯函数概念之前我们再来复习一下什么是函数<br/>
函数是一个方法，有一些输入，称为变量，并产生一些输出称为返回值<br/>

函数可以用于以下目的
1. 映射：根据给定的输入生成一些输出，函数将输入值映射到输出值上
2. 过程：调用函数按照一系列的步骤来执行。这就是我们说的过程编程
3. I/O：与系统其他部分通信的功能。如存储系统日志，网络等

纯函数都是关于映射的所以对于相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用，也不依赖外部环境的状态。

```
// 纯函数
const double = x => x * 2;
console.log（double（5））

// 不纯
let val = 2;
const double = x => x * val;
console.log（double（5））

// 不纯
Math.random()
Math.random()
```


### 函数式编程-纯函数

纯函数的优点<br/>
1. 独立于外部状态，所以不会受外部全局环境的影响而产生的错误或者副作用
2. 由于其独立，所以易于重构和重组和重用，使程序更加灵活


### 函数式编程-幂等性
执行多次所产生的影响均与一次执行的影响相同，也就是说执行一次和执行多次对系统内部的状态影响是一样的 <br/>
```
class Person {
  constructor () {
    this.name = name;
  },
  sayName () {
    console.log(my name is + this.name);
  } 
}
var person = new Person(zhangsan)
person.sayName();
person.sayName();
```

### 纯函数和幂等性的区别

1. 法调用多次对内部的状态影响是一样的，则这么方法就具有幂等性，在函数式编程中，纯函数也具有幂等性，但具有幂等性的函数却不一定是纯函数。
2. 纯函数主要强调相同的输入，多次调用，输出也相同且无副作用，而幂等主要强调多次调用，对内部的状态的影响是一样的，调用返回值可能不同。



## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/functionalPartial.md'>函数式编程-偏应用函数、函数的柯里化</a>

## JS 函数式编程系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/functional.md'>JS 函数式编程系列</a>

## JS 基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/index.md'>JS基础系列</a>
