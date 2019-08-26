---
title: Generator 与 Async
date: 2019-8-26 16:22:09
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


### 概述
在前端中异步编程一直是前端开发的一个痛点，因为 JavaScript 语法的灵活性和特殊性导致前端开发的困难（因为 JavaScript 是单线程，如果没有异步的世界可以想象一下，将无法执行卡死操作）

### 什么是异步编程
所谓"异步"，一个任务不是连续完成的，先执行第一段，然后执行其他任务，等做好了准备，回过头执行第二段

所谓"同步"，就是不间断的连续执行一个任务

### 异步编程示例
我们熟悉的异步编程有很多种例如 `代码的执行任务队列`,`setTimeout`, `setInterval`, `callback`, `promise` 等

回调函数

```
function Fun(name, callback) {
  console.log(name)
  callback && callback()
}
fun('renbo',function () {})

再例如数组的操作方法

[1,2,3,4,5].map(function(v,i){
  return i+':'+v
})

```

Promise

```
var readFile = require('fs-readfile-promise');
readFile(fileA)
.then(function (data) {
  console.log(data.toString());
})
.then(function () {
  return readFile(fileB);
})
.then(function (data) {
  console.log(data.toString());
})
.catch(function (err) {
  console.log(err);
});

```

### Generator概念

ES6 提供的一种异步编程解决方案，执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

### Generator特征
- function关键字与函数名之间有一个星号
- 函数体内部使用yield表达式，定义不同的内部状态
- 执行函数不会立即执行，只有调用了next方法才会执行
- 如果函数内部不写 yield 表达式，则此函数就是单纯的暂缓执行函数
- 每次调用遍历器对象的next方法，返回value和done两个属性的对象
- value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值
- done属性是一个布尔值，表示是否遍历结束

```
function* funGenerator() {
  yield 'hello';
  yield 'my name is renbo';
  return 'ending';
}

var fun = funGenerator();

fun.next() // { value: 'hello', done: false }
fun.next() // { value: 'my name is renbo', done: false }
fun.next()  // { value: 'ending', done: true }
fun.next()  // { value: undefined, done: true }
```

### 控制流管理

回调

```
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // Do something with value4
      });
    });
  });
});

```

promise

```
Promise.resolve(step1)
  .then(step2)
  .then(step3)
  .then(step4)
  .then(function (value4) {
    // Do something with value4
  }, function (error) {
    // Handle any error from step1 through step4
  })
  .done();
```

Generator

```
function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1);
    var value3 = yield step2(value2);
    var value4 = yield step3(value3);
    var value5 = yield step4(value4);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}

```

### 单个异步任务

Generator + Promise

```
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result);
}

// 调用
var g = gen();
var result = g.next();

result.value.then(function(data){
    return data.json();
}).then(function(data){
    g.next(data);
});
```

上述的执行过程调用 gen 会返回遍历器，然后通过遍历器的 next 方法返回 fetch 的 promise 实例`{ value: Promise { <pending> }, done: false }`，通过调用 then 方法执行结果


###  多个异步任务

```
var fetch = require('node-fetch');

function* gen() {
  var r1 = yield fetch('https://api.github.com/users/github');
  var r2 = yield fetch('https://api.github.com/users/github/followers');
  var r3 = yield fetch('https://api.github.com/users/github/repos');

  console.log([r1.bio, r2[0].login, r3[0].full_name].join('\n'));
}

```

获得执行结果

```
var g = gen();
var result1 = g.next();

result1.value.then(function(data){
    return data.json();
})
.then(function(data){
    return g.next(data).value;
})
.then(function(data){
    return data.json();
})
.then(function(data){
    return g.next(data).value
})
.then(function(data){
    return data.json();
})
.then(function(data){
    g.next(data)
});

```

利用递归封装上述执行结果

```
function run(gen) {
  var g = gen();

  function next(data) {
    var result = g.next(data);

    if (result.done) return;

    result.value.then(function(data) {
        return data.json();
    }).then(function(data) {
        next(data);
    });

  }

  next();
}

run(gen);
```

### 启动器函数 （Generator + Promise）

由于 fetch 方法返回 promise 有 json 方法，所以上述例子成立，如果 yield 直接结合 promise 函数那么就会变成启动器函数。由于 Generator 不能像普通函数一样自动执行和自己暂缓执行的特性，所以增加自执行启动函数，这也是 co 模块的初衷（）

```
var fetch = require('node-fetch');

function* gen() {
  var r1 = yield fetch('https://api.github.com/users/github');
  var json1 = yield r1.json();
  var r2 = yield fetch('https://api.github.com/users/github/followers');
  var json2 = yield r2.json();
  var r3 = yield fetch('https://api.github.com/users/github/repos');
  var json3 = yield r3.json();

  console.log([json1.bio, json2[0].login, json3[0].full_name].join('\n'));
}

function run(gen) {
    var g = gen();

    function next(data) {
        var result = g.next(data);

        if (result.done) return;

        result.value.then(function(data) {
            next(data);
        });

    }

    next();
}

run(gen);

```

### 启动器函数 （Generator + 回调）

回调函数

```
function fetchData(url) {
    return function(cb){
        setTimeout(function(){
            cb({status: 200, data: url})
        }, 1000)
    }
}
```

Generator函数

```
function* gen() {
    var r1 = yield fetchData('https://api.github.com/users/github');
    var r2 = yield fetchData('https://api.github.com/users/github/followers');

    console.log([r1.data, r2.data].join('\n'));
}
```

获得结果

```
var g = gen();

var r1 = g.next();

r1.value(function(data) {
  var r2 = g.next(data);
  r2.value(function(data) {
      g.next(data);
  });
});
```

通过上面的示例代码我们观察到回调函数依然解决不了多个 yield 时代码会循环嵌套。还的借助递归

```
function run(gen) {
    var g = gen();

    function next(data) {
        var result = g.next(data);

        if (result.done) return;

        result.value(next);
    }

    next();
}

run(gen);
```

### run 

通过上面代码可以看出 Generator 函数的自动执行需要一种机制，当异步操作有了结果，才能自动交回执行权

- 回调函数。 将异步操作进行包装，暴露出回调函数，在回调函数里面交回执行权
- Promise对象。将异步操作包装成 Promise 对象，用 then 方法交回执行权

上面两种方法写了一个 run 的启动器函数，那么我们将两种封装在一起，返回了一个 Promise，获得 Generator 函数的返回值，并且捕获错误

```
function run(gen) {

    return new Promise(function(resolve, reject) {
        if (typeof gen == 'function') gen = gen();

        // 如果 gen 不是一个迭代器
        if (!gen || typeof gen.next !== 'function') return resolve(gen)

        onFulfilled();

        function onFulfilled(res) {
            var ret;
            try {
                ret = gen.next(res);
            } catch (e) {
                return reject(e);
            }
            next(ret);
        }

        function onRejected(err) {
            var ret;
            try {
                ret = gen.throw(err);
            } catch (e) {
                return reject(e);
            }
            next(ret);
        }

        function next(ret) {
            if (ret.done) return resolve(ret.value);
            var value = toPromise(ret.value);
            if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
            return onRejected(new TypeError('You may only yield a function, promise ' +
                'but the following object was passed: "' + String(ret.value) + '"'));
        }
    })
}

function isPromise(obj) {
    return 'function' == typeof obj.then;
}

function toPromise(obj) {
    if (isPromise(obj)) return obj;
    if ('function' == typeof obj) return thunkToPromise(obj);
    return obj;
}

function thunkToPromise(fn) {
    return new Promise(function(resolve, reject) {
        fn(function(err, res) {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

module.exports = run;
```

### co
 
co 是大神 TJ Holowaychuk 于 2013 年 6 月发布的一个小模块，用于 Generator 函数的自动执行。

如果直接使用 co 模块，这两种不同的例子可以简写为

yield 后是一个 Promise

```
var fetch = require('node-fetch');
var co = require('co');

function* gen() {
    var r1 = yield fetch('https://api.github.com/users/github');
    var json1 = yield r1.json();
    var r2 = yield fetch('https://api.github.com/users/github/followers');
    var json2 = yield r2.json();
    var r3 = yield fetch('https://api.github.com/users/github/repos');
    var json3 = yield r3.json();

    console.log([json1.bio, json2[0].login, json3[0].full_name].join('\n'));
}

co(gen);
```

yield 后是一个回调函数

```

var co = require('co');

function fetchData(url) {
    return function(cb) {
        setTimeout(function() {
            cb(null, { status: 200, data: url })
        }, 1000)
    }
}

function* gen() {
    var r1 = yield fetchData('https://api.github.com/users/github');
    var r2 = yield fetchData('https://api.github.com/users/github/followers');

    console.log([r1.data, r2.data].join('\n'));
}

co(gen);
```


### async 有点

 async 函数，使得异步操作变得更加方便,它也是 Generator 函数的语法糖。

当使用 Generator 函数的时候

```
var fetch = require('node-fetch');
var co = require('co');

function* gen() {
    var r1 = yield fetch('https://api.github.com/users/github');
    var json1 = yield r1.json();
    console.log(json1.bio);
}

co(gen);
```

当使用 async 时候

```
var fetch = require('node-fetch');

var fetchData = async function () {
    var r1 = await fetch('https://api.github.com/users/github');
    var json1 = await r1.json();
    console.log(json1.bio);
};

fetchData();
```

通过上面观察到代码基本一样，所以 async 的原理就是将 Generator 函数和自动执行器，包装在一个函数里面

```
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```

async 函数返回一个 Promise 对象所以也可以理解为 async 函数是基于 Promise 和 Generator 的一层封装
随意处理初步流程 async 会比使用 Promise 更优雅

```
function fetch() {
  return (
    fetchData().then(() => {
      return "done"
    });
  )
}

async function fetch() {
  await fetchData()
  return "done"
};
```

```
function fetch() {
  return fetchData().then(data => {
    if (data.moreData) {
      return fetchAnotherData(data).then(moreData => {
        return moreData
      })
    } else {
      return data
    }
  });
}

async function fetch() {
  const data = await fetchData()
  if (data.moreData) {
    const moreData = await fetchAnotherData(data);
    return moreData
  } else {
    return data
  }
}
```

```
function fetch() {
  return (
    fetchData()
    .then(value1 => {
      return fetchMoreData(value1)
    })
    .then(value2 => {
      return fetchMoreData2(value2)
    })
  )
}

async function fetch() {
  const value1 = await fetchData()
  const value2 = await fetchMoreData(value1)
  return fetchMoreData2(value2)
};
```

### async 缺点

- 用try...catch 处理上是原本的优雅代码变得不再优雅
- 语法的简洁让原本可以并行执行的内容变成了顺序执行，从而影响了性能

await由于返回 promise 对象，所以结果可能是rejected，所以最好把await命令放在try...catch代码块中
但是如果想捕获 JSON.parse 中的错误那么就需要再添加一层 try...catch

```
async function fetch() {
  try {
    const data = JSON.parse(await fetchData())
  } catch (err) {
    console.log(err)
  }
};
```

原本没有依赖关系的两个函数，却只能等待 getList 返回才能执行 getAnotherList，导致请求时间多了一倍

```
(async () => {
  const getList = await getList();
  const getAnotherList = await getAnotherList();
})();
```

将上面的函数改为如下函数可以解决上述问题
```
(async () => {
  const listPromise = getList();
  const anotherListPromise = getAnotherList();
  await listPromise;
  await anotherListPromise;
})();
```

也可以使用 Promse.all

```
(async () => {
  Promise.all([getList(), getAnotherList()]).then(...);
})();
```

并发执行 async 函数


```
async function handleList() {
  const listPromise = await getList();
  // ...
  await submit(listData);
}

async function handleAnotherList() {
  const anotherListPromise = await getAnotherList()
  // ...
  await submit(anotherListData)
}

// 方法一
(async () => {
  const handleListPromise = handleList()
  const handleAnotherListPromise = handleAnotherList()
  await handleListPromise
  await handleAnotherListPromise
})()

// 方法二
(async () => {
  Promise.all([handleList(), handleAnotherList()]).then()
})()
```
































