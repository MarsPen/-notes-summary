---
title: 函数式编程-函数组合
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


函数组合是将两个或多个函数组合以产生新函数的过程。将功能组合在一起就像将一系列管道拼凑在一起，以便我们的数据流过<br/>

简而言之，函数` f`和` g`的组合可以定义为`f（g（x））`，它从内到外 - 从右到左进行求值<br/>

举例子，想象一个场景，想要将用户的全名转换为URL slugs，以便为每个用户提供个人资料页面。为此，需要完成一系列步骤：
1. 将名称拆分为空格中的数组
2. 将名称映射到小写
3. 加入破折号
4. 编码URI组件

```
// toslug.js hosted with ❤ by GitHub

const toSlug = input => encodeURIComponent(
  input.split(' ')
    .map(str => str.toLowerCase())
    .join('-')
);

```

不错......但如果我告诉你它可能更具可读性呢？想象一下，这些操作中的每一个都具有相应的可组合功能。可以写成<br/>
```
// nesting-composition.js hosted with ❤ by GitHub

const toSlug = input => encodeURIComponent(
  join('-')(
    map(toLowerCase)(
      split(' ')(
        input
      )
    )
  )
);

console.log(toSlug('JS Cheerleader')); // 'js-cheerleader'

```


这看起来比我们的第一次尝试更难阅读，但先放在这，我们继续以可组合形式的常用实用程序，如`split（）`，`join（）`和`map（）`。来实现<br/>
```
// composables.js hosted with ❤ by GitHub

const curry = fn => (...args) => fn.bind(null, ...args);

const map = curry((fn, arr) => arr.map(fn));

const join = curry((str, arr) => arr.join(str));

const toLowerCase = str => str.toLowerCase();

const split = curry((splitOn, str) => str.split(splitOn));
```

上面的例子在技术上并不是真的柯里化，它总能产生一元函数，但是它是一个简单的偏应用函数。请参考<a href="https://medium.com/javascript-scene/curry-or-partial-application-8150044c78b8">有关偏应用函数和柯里化的区别</a> <br/>


回到我们的`toSlug（）`实现
```
// nesting-composition.js hosted with ❤ by GitHub

const toSlug = input => encodeURIComponent(
  join('-')(
    map(toLowerCase)(
      split(' ')(
        input
      )
    )
  )
);

console.log(toSlug('JS Cheerleader')); // 'js-cheerleader'
```

我们可以使用一个自动组合这些函数的函数来展平嵌套，这意味着它将从一个函数获取输出并自动将其到下一个函数的输入，直到它输出最终值<br/>
想象一下我们实现函数 `reduce（）` 的功能，但为了匹配上面的compose行为，我们需要它从右到左，而不是从左到右<br/>

```
// compose.js hosted with ❤ by GitHub

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
```

上面的 `.reduceRight()` 与`.reduce（）`一样，数组`.reduceRight（）`方法采用reducer函数和初始值（`x`）。我们迭代数组函数（从右到左），依次将每个函数应用于累加值（`v`）<br/>

使用compose，我们可以在没有嵌套的情况下重写 toSlug 的组合<br/>

```
// using-compose.js hosted with ❤ by GitHub
const toSlug = compose(
  encodeURIComponent,
  join('-'),
  map(toLowerCase),
  split(' ')
);

console.log(toSlug('JS Cheerleader')); // 'js-cheerleader'
```


还有另一种通常称为“pipe（）”的形式。 Lodash称之为`flow（）`<br/>

```
// pipe.js hosted with ❤ by GitHub

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const fn1 = s => s.toLowerCase();
const fn2 = s => s.split('').reverse().join('');
const fn3 = s => s + '!'

const newFunc = pipe(fn1, fn2, fn3);
const result = newFunc('Time'); // emit!
```

我们看看用`pipe（）`实现的`toSlug（）`函数<br/>
```
// using-pipe.js hosted with ❤ by GitHub

const toSlug = pipe(
  split(' '),
  map(toLowerCase),
  join('-'),
  encodeURIComponent
);

console.log(toSlug('JS Cheerleader')); // 'js-cheerleader'
```

在命令式编程中，当您对某个变量执行转换时，您将在转换的每个步骤中找到对该变量的引用。上面的`pipe（）`实现是以无点的方式编写的，这意味着它根本不识别它运行的参数。<br/>

我经常在单元测试和Redux状态之类的东西中使用管道来消除对中间变量的需要，这些中间变量只存在于一个操作和下一个操作之间的瞬态值。<br/>

```
// using-trace.js hosted with ❤ by GitHub

const trace = curry((label, x) => {
  console.log(`== ${ label }:  ${ x }`);
  return x;
});

const toSlug = pipe(
  trace('input'),
  split(' '),
  map(toLowerCase),
  trace('after map'),
  join('-'),
  encodeURIComponent
);

console.log(toSlug('JS Cheerleader'));
// '== input:  JS Cheerleader'
// '== after map:  js,cheerleader'
// 'js-cheerleader'
```


`trace（）`只是更通用的`tap（）`的一种特殊形式，它允许你为流经管道的每个值执行一些操作<br/>
```
// tap.js hosted with ❤ by GitHub

const tap = curry((fn, x) => {
  fn(x);
  return x;
});
```

现在可以看到`trace（）`是一个特殊的`tap（）`

```
const trace = label => {
  return tap(x => console.log(`== ${ label }:  ${ x }`));
};
```



