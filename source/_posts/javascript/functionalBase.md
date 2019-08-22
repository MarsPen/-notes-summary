---
title: 函数式编程-基本理论
date: 2019-5-13 12:32:09
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

### 什么是函数式编程

函数式编程主要是范畴论数学中的一个分支，它认为所有的概念体系都可以抽象成一个个范畴，属于结构化编程的一种。运算过程尽量写成一系列嵌套的函数调用 <br/>
```
//  函数式编程
var result = subtract(multiply(add(1,2), 3), 4);

// 过程编程
var a = add(1,2);
var b = multiply(a, 3);
var c = subtract(b, 4);
```

### 为什么学习函数式编程

其实个人觉的学习函数式编程就是为了更好的模块化，使其看起来更简洁。这也是<a href="http://en.wikipedia.org/wiki/Programming_paradigm">范式编程</a>和<a href="http://en.wikipedia.org/wiki/Structured_programming">结构化编程</a>的主要思想

### 函数式编程特点

1. 函数是"第一等公民"
2. 只用表达式，不用语句
3. 没有副作用（函数要保持独立，所有功能就是返回一个新的值，没有其他行为，更不能修改外部状态的值）
4. 不修改状态（可以使用参数来保存状态，不可以使用变量来保存状态）
5. 引用透明（函数运行只靠参数）

### 函数式编程的优点

1. 代码更简洁，易于理解，维护更方便
2. 易于并发编程（由于不修改变量所以不存在锁线程的问题）
3. 代码的热升级

