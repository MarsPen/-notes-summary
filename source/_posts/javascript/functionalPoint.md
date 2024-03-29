---
title: 函数式编程-Point Free
date: 2019-7-25 12:32:09
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
### 概念

Point-free 是一种编程风格，其中函数定义不引用函数的参数。不用关心将要操作的数据是什样的。我们来看看 JavaScript 中的函数定义

```js
// 表达式
function foo (/* parameters are declared here*/) {}

// 声明式
const foo = (/* parameters are declared here */) => // ...
const foo = function (/* parameters are declared here */) {}
```


如何在不引用所需参数的情况下在 JavaScript 中定义函数？我们不能使用 functionkeyword，也不能使用箭头函数（=>），因为它们需要声明形参（这将引用它的参数）。所以我们需要做的是调用一个返回函数的函数<br/>

### demo1


```js
// 非 Point-free. 因为函数引用了参数name
var greet = function(name) {
  return ('hello ' + name).toUpperCase();
}

// Point-free 先定义基本的函数，不用关心中间变量str是什么，抽象基本结构
var toUpperCase = str => str.toUpperCase();
var hello = str => `hello ${str}`; 

var greet = compose(hello, toUpperCase);
greet('renbo');
```
### demo2

这个例子来自于<a href="https://fr.umio.us/favoring-curry/">Favoring Curry</a><br/>
假设我们从服务器获取这样的数据：

```js
var data = {
  result: "SUCCESS",
  tasks: [
    {id: 104, complete: false,            priority: "high",
              dueDate: "2013-11-29",      username: "Scott",
              title: "Do something",      created: "9/22/2013"},
    {id: 105, complete: false,            priority: "medium",
              dueDate: "2013-11-22",      username: "Lena",
              title: "Do something else", created: "9/22/2013"},
    {id: 107, complete: true,             priority: "high",
              dueDate: "2013-11-22",      username: "Mike",
              title: "Fix the foo",       created: "9/22/2013"},
    {id: 108, complete: false,            priority: "low",
              dueDate: "2013-11-15",      username: "Punam",
              title: "Adjust the bar",    created: "9/25/2013"},
    {id: 110, complete: false,            priority: "medium",
              dueDate: "2013-11-15",      username: "Scott",
              title: "Rename everything", created: "10/2/2013"},
    {id: 112, complete: true,             priority: "high",
              dueDate: "2013-11-27",      username: "Lena",
              title: "Alter all quuxes",  created: "10/5/2013"}
  ]
};
```


### getIncompleteTaskSummaries 函数

我们需要一个名为 getIncompleteTaskSummaries 的函数，接收一个 username 作为参数，从服务器获取数据之后筛选出这个用户未完成的任务的 ids、priorities、titles、和 dueDate 数据，并且按照日期升序排序。<br/>

以 Scott 为例，最终筛选出的数据为<br/>
```js
[
    {id: 110, title: "Rename everything", 
        dueDate: "2013-11-15", priority: "medium"},
    {id: 104, title: "Do something", 
        dueDate: "2013-11-29", priority: "high"}
]
```

```js
var getIncompleteTaskSummaries = function(membername) {
     return fetchData()
         .then(function(data) {
             return data.tasks;
         })
         .then(function(tasks) {
             return tasks.filter(function(task) {
                 return task.username == membername
             })
         })
         .then(function(tasks) {
             return tasks.filter(function(task) {
                 return !task.complete
             })
         })
         .then(function(tasks) {
             return tasks.map(function(task) {
                 return {
                     id: task.id,
                     dueDate: task.dueDate,
                     title: task.title,
                     priority: task.priority
                 }
             })
         })
         .then(function(tasks) {
             return tasks.sort(function(first, second) {
                 var a = first.dueDate,
                     b = second.dueDate;
                 return a < b ? -1 : a > b ? 1 : 0;
             });
         })
         .then(function(task) {
             console.log(task)
         })
};

getIncompleteTaskSummaries('Scott')
```

### Point-free 模式<br/>

```js
// 拆分基础函数
curry 为封装的通用 curry 韩式
var prop = curry(function(name, obj) {
    return obj[name];
});

var propEq = curry(function(name, val, obj) {
    return obj[name] === val;
});

var filter = curry(function(fn, arr) {
    return arr.filter(fn)
});

var map = curry(function(fn, arr) {
    return arr.map(fn)
});

var pick = curry(function(args, obj){
    var result = {};
    for (var i = 0; i < args.length; i++) {
        result[args[i]] = obj[args[i]]
    }
    return result;
});

var sortBy = curry(function(fn, arr) {
    return arr.sort(function(a, b){
        var a = fn(a),
            b = fn(b);
        return a < b ? -1 : a > b ? 1 : 0;
    })
});
// 拼装
var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(prop('tasks'))
        .then(filter(propEq('username', membername)))
        .then(filter(propEq('complete', false)))
        .then(map(pick(['id', 'dueDate', 'title', 'priority'])))
        .then(sortBy(prop('dueDate')))
};

getIncompleteTaskSummaries('Scott')
```

### 利用 ramda.js 实现 getIncompleteTaskSummarie

如果直接使用 ramda.js，你可以省去编写基本函数<br/>
```js
var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(R.prop('tasks'))
        .then(R.filter(R.propEq('username', membername)))
        .then(R.filter(R.propEq('complete', false)))
        .then(R.map(R.pick(['id', 'dueDate', 'title', 'priority'])))
        .then(R.sortBy(R.prop('dueDate')))
};

getIncompleteTaskSummaries('Scott')
```

### 利用 compose 实现 getIncompleteTaskSummaries

可以从左到右

```js
var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(R.compose(
            R.sortBy(R.prop('dueDate')),
            R.map(R.pick(['id', 'dueDate', 'title', 'priority'])),
            R.filter(R.propEq('complete', false)),
            R.filter(R.propEq('username', membername)),
            R.prop('tasks')
        ))
};

getIncompleteTaskSummaries('Scott')
```

### 利用 ramda.js 提供的 R.pipe 函数

可以从左到右

```js
var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
      .then(R.pipe(
          R.prop('tasks'),
          R.filter(R.propEq('username', membername)),
          R.filter(R.propEq('complete', false)),
          R.map(R.pick(['id', 'dueDate', 'title', 'priority']),
          R.sortBy(R.prop('dueDate'))
      ))
};
```






