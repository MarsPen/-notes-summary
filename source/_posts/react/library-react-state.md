---
title: React 原理之 setState 执行机制
date: 2019-10-09 21:10:35
top: false
cover: false
password:
toc: true
mathjax: false
summary:
tags:
  - react
categories:
  - react
---

提到 react 的 setState 大家应该都很熟悉，那么下面我们以实际开发中遇到的几个问题，来引入 setState 的机制

## 问题集合

> setState 是同步的还是异步的？

**1. 生命周期和合成事件中**

```js
componentDidMount() {
  console.log("开始调用", this.state.count); // 开始调用 0
  this.setState({
    count: this.state.count + 1
  });
  console.log("count1", this.state.count); // count1 0
  this.setState({
    count: this.state.count + 1
  });
  console.log("count2", this.state.count); // count2 0
  console.log("结束调用", this.state.count); // 结束调用 0
}
```

**2. 异步代码和原生事件中**

```js

componentDidMount() {
  setTimeout(() => {
    console.log("开始调用", this.state.count); // 开始调用 0
    this.setState({
      count: this.state.count + 1
    });
    console.log("count1", this.state.count); // count1 1
    this.setState({
      count: this.state.count + 1
    });
    console.log("count2", this.state.count); // count2 2
    console.log("结束调用", this.state.count); // 结束调用 2
  }, 0);
}

```

**3. 连续多次 setState**

如果想要在 componentDidMount 阶段立即拿到数据可以采用如下模式

```js
componentDidMount() {
  console.log("开始调用", this.state.count);
  this.setState({ count: this.state.count + 1},() => {
    console.log("count1", this.state.count);
  });

  this.setState({count: this.state.count + 1},() => {
    console.log("count2", this.state.count);
  });
  console.log("结束调用", this.state.count);
}
```

执行结果

```md
开始调用 0
结束调用 0
count1 1
count2 1
```

通过上面的示例代码，我们已经看出了问题

- 为什么连续 setState 之后值结果相同。
- 为什么在生命周期和合成事件中不能及时的拿到结果。
- 为什么异步代码和原生事件中就能拿到结果了，到底是同步的还是异步的。

带着这些问题我们接着看第二部分执行过程

## setState 的执行过程

我们通过源码来看一下 setState 的执行过程。由于源码很多很长，如果不想了解源码可以查看文章后面的总结

### setState<hr>

定义在文件 `packages/react/src/ReactBaseClasses.js`

```js
Component.prototype.setState = function(partialState, callback) {
  invariant(
    typeof partialState === "object" ||
      typeof partialState === "function" ||
      partialState == null,
    "setState(...): takes an object of state variables to update or a " +
      "function which returns an object of state variables."
  );
  this.updater.enqueueSetState(this, partialState, callback, "setState");
};
```

我们看到 setState 传入了两个参数

- partialState 通过 invariant 函数验证我们知道 需要对象或者函数
- callback 回调函数

最后执行了 this.updater.enqueueSetState 将 setState 获得的参数传入

... 未完待续

