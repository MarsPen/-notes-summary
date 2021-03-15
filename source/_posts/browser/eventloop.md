---
title: 浏览器中的 Event Loop
date: 2021-01-25 21:20:12
top: false
cover: false
password:
toc: true
mathjax: false
summary:
tags:
  - 浏览器
categories:
  - 浏览器中的 Event Loop
---

### 前言 <hr>
网上很多文章都在讨论事件循环 (Event Loop)，但是看了很多文章之后还是不知道 Event Loop 到底是什么，解决的问题是什么，规范中是怎么定义的，实际应用中具体的执行过程等等。本文就一点点道来。

事件循环是一个很重要的概念，指的是计算机系统的一种运行机制。是为了解决 JavaScript 单线程的种种问题，而产生的一种调度。它会根据不同的任务源通过算法运行不同的优先级。

起初没有事件循环，只是简单的交互就要全部占用主线程去同步处理。比如只是一个提交表单页面就需要等待 10s 甚至更久。不知道什么时候出现了异步机制，而浏览器这种异步机制使用 Event Loop 实现的。

在提交表单的过程中，JavaScript 事件和触发本质上都通过浏览器中转，所以事件循环的标准也是定义在<a href="https://html.spec.whatwg.org/multipage/webappapis.html#event-loop"> HTML 的标准</a> 中，而不是 <a href="https://tc39.es/ecma262/#execution-context-stack%E3%80%82"> EcmaScript标准</a> 中。那么接下来我们先来看看事件循环的基本定义。

### 定义 <hr>
标准文档中这样写到 
 > To coordinate events, user interaction, scripts, rendering, networking, and so forth, user agents must use event loops as described in this section. Each agent has an associated event loop, which is unique to that agent.

通过上面定义的描述中我们发现实际上**事件循环是 user agent(浏览器)用于协调事件，用户交互(鼠标、键盘)，脚本（JS），渲染（如HTML、CSS样式），网络等行为的一种机制**。

与其说是 JavaScript 提供了事件循环，不如说是嵌入 JavaScript 的 user agent（浏览器） 需要通过事件循环来与多种事件源进行交互。

### 任务的组成 <hr>

一个任务就是由诸如从头执行一段程序、执行一个事件回调或一个 interval/timeout 被触发之类的标准机制而被调度的任意 JavaScript 代码。这些都在任务队列（task queue）上被调度。

而**一个事件循环有一个或多个任务队列（ task queues）**，任务队列是一系列排好序的任务组成，这些任务有：

1. Events（事件）
在一个特定的 EventTarget 对象上分派一个事件对象通常由一个专门的任务来完成
2. Parsing（解析）
HTML解析器对一个或多个字节进行标记，然后处理结果标记，这通常是一项任务
3. Callbacks（回调）
调用回调通常是由一个专门的任务来完成的
4. Using a resource（加载资源）
当算法获取资源时，如果获取是以非阻塞的方式进行的，那么一旦部分或全部资源可用，则执行任务对资源进行处理
5. Reacting to DOM manipulation（响应操作DOM）
DOM操作而触发的任务，例如当该元素被插入到文档中时。

任务也是一个结构体，它有
1. Steps：任务要完成工作的一系列步骤
2. Source：每个任务都有任务源，用于对相关任务进行分组和序列化
3. Document: 与任务相关联的文档，对于不在 window 事件循环中的任务，则为空。
4. 脚本对象集: <a href="https://html.spec.whatwg.org/multipage/webappapis.html#environment-settings-object">环境设置对象</a>，用于在任务期间跟踪脚本评估

标准中的话术隐晦难懂，但也不难看出在标准中**使用任务源来分离逻辑上不同类型的任务**，比如可以为鼠标、键盘事件提供一个 task 队列，其他事件又是一个单独的队列。这样可以为鼠标、键盘事件分配更多的时间，保证交互的流畅。

而用户代理（浏览器）也可能希望区分这些任务。使用任务队列来合并给定事件循环中的任务源。

### 任务的类型<hr>

任务分为 **task(macrotask) 和  microtask**，下面详细介绍一下这两种任务

> **Macrotask(宏任务)**

主要是浏览器协调各类事件的队列，**虽然叫队列（Queue）本质上是集合(Set)。标准文件中称之为 Task Queue**

因为传统的队列都是先进先出（FIFO）的，而事件循环处理模型的步骤之一是**从选择的队列中抓取第一个可运行的任务，而不是先进先出**。排到最前面但是没有满足条件也不会执行（比如外部队列里只有一个 setTimeout 的定时任务，但是时间还没有到，没有满足条件也不会把他出列来执行）

不同的 Task 事件源的队列可以有不同的优先级（例如在网络事件和用户交互之间，浏览器可以优先处理鼠标行为，从而让用户感觉更加流程）。

> **Macrotask 任务源**

理解定义之后，我们再来看一下 macrotask 的任务源都有什么，规范 
<a href="https://html.spec.whatwg.org/multipage/webappapis.html#generic-task-sources">Generic task sources</a> 中定义的 macrotask 任务源有如下

1. DOM操作任务源
此任务源被用来响应 DOM 操作(页面渲染)，例如一个元素以非阻塞的方式<a href="https://html.spec.whatwg.org/multipage/infrastructure.html#insert-an-element-into-a-document">插入文档</a>
2. 用户交互任务源
此任务源用于对用户交互作出反应，例如键盘或鼠标输入
3. 网络任务源
此任务源被用来响应网络活动，例如Ajax请求。
4. history traversal 任务源
此任务源用于当调用 history.back()等类似api时，将任务插入 task 队列
5. 定时器任务源
可以使用 setTimeout() 或者 setInterval() 来添加任务

> **Microtask (微任务)**

一个微任务（microtask）就是一个简短的函数，**当函数执行并且只有当 Javascript 调用栈为空，而控制权还没有交还给user agent 之前，该任务才会执行。**

**每个事件循环都有一个 microtask 队列，microtask 最初在 microtask 队列中排列而不是在 task 队列。**

有两种 microtask: 
- 单独回调微任务(solitary callback microtask)
- 复合微任务(compound microtask)

当算法要求 microtask 排列时，它必须被添加到相关事件循环的 microtask 队列;这个 microtask 的任务源是微任务任务源(microtask task source)。

如果 microtask 的初始执行过程中，microtask 也可能被移动到常规的任务队列，将转动事件循环。这种情况下，微任务任务源将是使用的任务源。通常，microtask 的任务源是不相关的

> **Microtask 任务源**

在 HTML 标准中，并没有明确规定这个队列的事件源，通常认为有以下几种：
1. <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise</a>
2. <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/observe">Object.observe(已弃用)</a>
3. <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver">MutationObserve</a>
4. <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask">queueMicrotask</a>

> **Macrotask 与 Microtask 的区别**

首先，每当一个任务存在，事件循环都会检查该任务是否正把控制权交给其他 JavaScript 代码。如若不然，事件循环就会运行微任务队列中的所有微任务。接下来微任务循环会在事件循环的每次迭代中被处理多次，包括处理完事件和其他回调之后。

其次，如果一个微任务通过调用  <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask">queueMicrotask()</a>, 向队列中加入了更多的微任务，则那些新加入的微任务 会早于下一个任务运行 。这是因为事件循环会持续调用微任务直至队列中没有留存的，即使是在有更多微任务持续被加入的情况下。

上文中提到一个事件循环有一个或多个任务队列（task queues）
- 事件循环中的任务都是指定的任务源去提供
- 事件循环中只有一个 microtask 队列

### 处理模型 <hr>

> **event loop 的处理过程**

一个 event loop 在其存在期间必须持续运行以下步骤：
1. 在 tasks 队列中选择最老的一个 task，如果没有可选的任务，则跳到下边的 microtasks 步骤
2. 将事件循环当前执行任务设置为 oldestTask
3. 设置 taskStartTime 为当前的<a href="https://w3c.github.io/hr-time/#dfn-current-high-resolution-time">current high resolution time</a>
4. 执行 oldestTask
6. 将事件循环当前执行任务设置为 null
7. Microtasks: 执行 Microtasks 检查点
8. hasARenderingOpportunity 标志置为 false
9. 设置当前的<a href="https://w3c.github.io/hr-time/#dfn-current-high-resolution-time">current-high-resolution-time</a>
10. 设置最新的 top-level browsing contexts并 <a href="https://w3c.github.io/longtasks/#report-long-tasks">Report long tasks</a>
11. 更新渲染(如果是一个浏览上下文的事件循环)
12. 如果是一个 worker 的事件循环，但是事件循环的任务队列中没有任务并且 <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/WorkerGlobalScope">WorkerGlobalScope</a> 对象的关闭标识(closing flag)是 true 的话，销毁这个事件循环，中断以上步骤，恢复运行在 Web worker 中描述的 worker 步骤
13. 返回第一步


**概括说来就是 event loop 会不断循环的去取 tasks 队列的中最老的一个任务推入栈中执行，并在当次循环里依次执行并清空     microtask 队列里的任务。执行完 microtask 队列里的任务，有可能会渲染更新。**

> **microtask checkpoint**

当执行 microtask 的检查点时，如果检查点标识为 false， 必须运行以下步骤:

1. 将检查点 flag 设置为 true
2. 当事件循环的 microtask 队列不为空时:
  2.1 将 oldestMicrotask 设置为事件循环的 microtask 队列中最老的 microtask
  2.2 将事件循环当前执行任务设置为 oldestMicrotask
  2.3 执行 oldestMicrotask
  2.4 将事件循环当前执行任务设置为 null
  2.5 将 oldestMicrotask 从 microtask 队列中移除
3. 每一个<a href="https://html.spec.whatwg.org/multipage/webappapis.html#environment-settings-object">environment settings object</a> 它们的 <a href="https://html.spec.whatwg.org/multipage/webappapis.html#responsible-event-loop">responsible event loop</a>就是当前的event loop，会给 environment settings object发一个 <a href="https://html.spec.whatwg.org/multipage/webappapis.html#notify-about-rejected-promises">rejected promises </a>的通知
4. <a href="https://w3c.github.io/IndexedDB/#cleanup-indexed-database-transactions">清除索引数据库事务</a>
5. 将检查点标识设置为 false

当一个组合微任务运行时，UA 必须运行一系列步骤来执行组合微任务的子任务，步骤如下：
1. 让父任务是事件循环当前执行任务
2. 让子任务变为由执行一系列给定步骤的新任务。这个 microtask 的任务源是 microtask task source。这是一个组合微任务的子任务
3. 将事件循环当前执行任务设置为子任务
4. 执行子任务
5. 将事件循环当前执行任务设置为父任务

当并行运行的算法要等待稳定状态时，UA 必须运行以下步骤对 microtask 排列，然后停止执行(如下列步骤所述，当 microtask 执行时算法将恢复运行):

1. 运行算法的同步部分
2. 如果可以，按照算法步骤中的描述，恢复并行算法的运行。

当一个算法要推动事件循环知道符合条件目标时，UA 必须执行以下步骤:
1. 将事件循环当前任务设置为该任务
2. 将任务的任务源设置为该任务任务源
3. 将 JS 执行上下文栈拷贝给旧栈(old stack)
4. 清空 JS 执行上下文栈
5. 运行 microtask 检查点
6. 停止任务，允许任何调用它的算法恢复，但是并行继续这些步骤
7. 等待符合的条件目标出现
8. 排列一个任务继续这些步骤，使用任务源的任务源。在新任务运行后继续执行这些步骤。
9. 用旧栈替换 JS 执行上下文栈
10. 返回调用者

**概括的来说就是要执行微任务就先执行微任务检查点，什么时候执行检查点则是上下文执行栈为空的时候，也就是在 task 执行之后渲染之前。执行的时候也是持续运行直到微任务任务队列中为空停止**


### 三种事件循环<hr>

在浏览器中不是只有一种类型的 eventloop，而每种类型的 eventloop 的处理模型也不相同，大致分为下面三种类型

> **浏览器上下文**

每一个用户代理必须至少有一个<a href="https://html.spec.whatwg.org/multipage/browsers.html#browsing-context">浏览器上下文</a> 的event loop，但是每个<a href="https://html.spec.whatwg.org/multipage/browsers.html#unit-of-related-similar-origin-browsing-contexts">单元的相似源浏览器上下文</a>至多有一个event loop

宏任务与微任务，实际上都是被推入栈中执行的，而 JavaScript 是单线程有一个主线程，在主线程中有一个栈，**每一个函数执行的时候都会生成新的 execution context（执行上下文）**，执行上下文会包含一些当前函数的参数、局部变量之类的信息，它会被推入栈中，正在执行的上下文始终处于栈的顶部。当函数执行完后，它的执行上下文会从栈弹出（*更多执行上下文相关请移步 <a href="https://www.studyfe.cn/2019/02/25/javascript/closure/#toc-heading-3">上下文执行环境</a>*）。如下图
<img src="/images/ec.jpg"></img>

**event loop 总是具有至少一个浏览器上下文，当一个 event loop 的浏览器上下文全都销毁的时候，event loop 也会销毁。一个浏览器上下文总有一个event loop去协调它的活动。**

> **Worker 事件循环**

worker 事件循环顾名思义就是驱动 worker 的事件循环。分为以下几种 worker
 
 1. <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API">web worker</a>
 2. <a href="https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker">shared worker</a>
 3. <a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API">service worker</a>
worker 被放在一个或多个独立于 “主代码” 的代理中。浏览器可能会用单个或多个事件循环来处理给定类型的所有 workder
**一个 worker 对应一个event loop，<a href="https://html.spec.whatwg.org/multipage/workers.html#run-a-worker">worker进程模型</a>管理event loop的生命周期**

> **Worklet 事件循环**

<a href="https://developer.mozilla.org/en-US/docs/Web/API/Worklet">worklet</a> 事件循环用于驱动运行 worklet 的代理。这包含了 Worklet、AudioWorklet 以及 PaintWorklet


通过上面三种事件循环我们总结
- 浏览器可以有多个 event loop，同一个窗口下的 browsing contexts 可以进行通讯共用 event loop
- browsing contexts 和 workers 是相互独立的，互不影响
- 每个线程都有自己的 event loop

### 更新渲染<hr>

> **渲染机制**

event loop 在执行到第 11 步骤的时候会进行 Update the rendering（更新渲染），规范中允许浏览器自己选择是否更新浏览器。而上文中也提到过不是每轮事件循环都要更新视图，只有在必须要的时候去更新。

<img src="/images/render-process.jpg"></a>

渲染页面大致的过程如上图
1. HTML解析器解析成DOM 树
2. CSS解析器解析成CSSOM 树
3. 结合DOM树和CSSOM树，生成一棵渲染树(Render Tree)
4. 生成布局（Layout），根据渲染树来布局，以计算每个节点的几何信息
5. 最后一步是绘制（Paint），使用最终渲染树将像素渲染到在屏幕上

下面这两篇文章对上面每一个步骤进行了详细的解释
- <a href="https://www.studyfe.cn/2019/05/15/javascript/debounce/#toc-heading-3">渲染机制</a>
- <a href="https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork">浏览器的工作原理</a>

> **验证渲染更新时机**

上文中提到在渲染更新之前要执行微任务检查点，并将 hasARenderingOpportunity 标志置为 false。 那么下面我们来做一些测试

```js
// html
 <div id='box'>0</div>
// js
<script>
var btn = document.getElementById('box');
btn.onclick = function () {
  setTimeout(function(){
    btn.innerHTML = 2;
  },0)
}
</script>
```
<img src="/images/eventloop01.jpg">

当我们点击这个按钮的时候，一共产生了2个 task 分别是 onclick、setTimeout，用 chrome 开发工具的中的 Performance 查看各部分运行的时间点。**黄色部分是脚本运行，紫色部分是更新 render 树、计算布局，绿色部分是绘制**。其中**绿色和紫色部分就可以认为是 Update the rendering 阶段**。

```js
// html
 <div id='box'>0</div>
// js
<script>
var btn = document.getElementById('box');
btn.onclick = function () {
  setTimeout(function(){
    btn.innerHTML = 1;
  },0)
  setTimeout(function(){
    btn.innerHTML = 2;
  },0)
}
</script>
```
<img src="/images/eventloop03.jpg">

当我们点击这个按钮的时候，执行了三个 task 两个 setTimeout、一个click，但是只在 1.8ms 处渲染了一帧为 2，难道是连续的 setTimeout 进行绘制的时候合并了？在看下面的例子

```js
// html
 <div id='box'>0</div>
// js
<script>
var btn = document.getElementById('box');
btn.onclick = function () {
  setTimeout(function(){
    btn.innerHTML = 1;
  },0)
  setTimeout(function(){
    btn.innerHTML = 2;
  },0)
  setTimeout(function(){
    btn.innerHTML = 3;
  },0)
  setTimeout(function(){
    btn.innerHTML = 4;
  },0)
  setTimeout(function(){
    btn.innerHTML = 5;
  },0)
  setTimeout(function(){
    btn.innerHTML = 6;
  },0)
}
</script>
```
<img src="/images/eventloop04.jpg">
<img src="/images/eventloop05.jpg">

当我们点击这个按钮的时候，一共绘制了两帧，第一帧1.8ms 处为 2，第二帧9.0ms处为 6。这样是不是就可以认为 event loop 间隔很短会进行绘制。但不是每次任务都进行绘制。

我们知道浏览器会尽量保持每秒60帧的刷新频率（大约16.7ms每帧），是不是只有两次event loop 间隔大于 16.7ms 才会进行绘制呢？看下面的例子

```js
// html
 <div id='box'>0</div>
// js
<script>
var btn = document.getElementById('box');
btn.onclick = function () {
  setTimeout(function(){
    btn.innerHTML = 1;
  },0)
  setTimeout(function(){
    btn.innerHTML = 2;
  },16.8)
  setTimeout(function(){
    btn.innerHTML = 3;
  },18)
  setTimeout(function(){
    btn.innerHTML = 4;
  },35)
}
</script>
```
<img src="/images/eventloop07.jpg">

当我们点击这个按钮的时候， 分别渲染了四帧也就是全部执行，那就证明 task 每一次渲染只要连续的高于每秒 60HZ（16.7ms）的频率，都会被渲染。那么接下来我们观察一下 microtasks

```js
// html
<div id='box'>0</div>
// js
<script>
  var btn = document.getElementById('box');
  btn.onclick = function () {
    Promise.resolve().then(function() {
      btn.innerHTML = 1;
    })
  }
</script>
```
<img src="/images/eventloop02.jpg">

当我们点击这个按钮的时候，产生一个 click task，一个 Promise microtask ，同样绘制实在 microtask 之后，如果连续 microtask 会怎么样呢？

```js
// html
<div id='box'>0</div>
// js
<script>
  var btn = document.getElementById('box');
  btn.onclick = function () {
    Promise.resolve().then(function() {
      btn.innerHTML = 1;
    })
    Promise.resolve().then(function() {
      btn.innerHTML = 2;
    })
    Promise.resolve().then(function() {
      btn.innerHTML = 3;
    })
  }
</script>
```

<img src="/images/eventloop08.jpg">


当我们点击这个按钮的时候，产生 3 个 microtask， 但也只是渲染一次。那么我们交叉运行 setTimeout 和 Promise 呢？

```js
// html
<div id='box'>0</div>
// js
<script>
  var btn = document.getElementById('box');
  btn.onclick = function () {
    setTimeout(function setTimeout1() {
       btn.innerHTML = 1;
       Promise.resolve().then(function Promise1 () {
          btn.innerHTML = 1.1;
      })
    }, 0)
    setTimeout(function setTimeout2() {
       btn.innerHTML = 2;
       Promise.resolve().then(function Promise2 () {
          btn.innerHTML = 2.1;
       })
    }, 16.8 )
  }
</script>
```
<img src="/images/eventloop09.jpg">

当我们点击这个按钮的时候，共产生两个 setTimeout task，每个 task 中包含一个 Promise microtask，其中一共绘制了两帧分别为1.1 和 2.1，那如果将 setTimeout1 中写入大量的 Promise 会是什么结果呢？

```js
// html
<div id='box'>0</div>
// js
<script>
  var btn = document.getElementById('box');
  btn.onclick = function () {
      setTimeout(function setTimeout1() {
        btn.innerHTML = "task1";
          for(var i = 0; i < 250000; i++){
              Promise.resolve().then(function(){
                btn.innerHTML = i;
              });
          }
      }, 0)
      setTimeout(function setTimeout2() {
          btn.innerHTML = "task2";
      }, 16.8 )
  }
</script>
```
<img src="/images/eventloop10.jpg">
当我们点击这个按钮的时候，共产生了两个 setTimeout task,一个 click task。在 setTimeout1 中执行了 250000 个 Promise microtask。从图中可以看出大面积由于脚本运行产生的阻塞，而 setTimeout2 也要等待 setTimeout1 和 promise 执行完成之后在执行。而绘制页面的时候明显看到先绘制 task1 然后是 250000，最后是 task2。

> **小结**

还有很多 API 包括 queueMicrotask-微任务、MutationObserve-微任务、requestAnimationFrame-宏任务、postMessage-宏任务，在这里就不一一演示了，下面我们来总结一下

1. 每一轮的 event loop 中多次修改同一个 DOM ，只有最后一次进行绘制
2. 浏览器在 Update the rendering（更新渲染）阶段会进行优化，并不是每轮 event loop 都会更新渲染。一般情况下大于一帧（16.7ms） 都会更新
3. 如果想每一轮的 event loop 都进行更新可使用 requestAnimationFrame
4. 由于 setTimeout 有最小时间 4ms 所以大多数宏任务的优先级都比它高包括 postMessage，而用户交互相关优先级是最高的


### 总结


<img src="/images/eventloop11.jpg">

在主线程中首先会执行同步代码，也就是说会向执行栈中加入所要执行的方法的执行环境（ec），在这个执行环境中还可以调用其他方法，或者自己。这样就会在执行栈中再加入一个执行环境，可一直调用下去，除非超出了内存的最大值发生栈溢出。

当 JS 引擎遇到一个异步事件后并不会一直等待其返回结果，而是会将这个事件挂起，继续执行执行栈中的其他任务。

当一个异步事件返回结果后，JS 会将这个事件加入与当前执行栈不同的另一个队列，称之为事件队列。

被放入事件队列不会立刻执行其回调，而是等待当前执行栈中的所有任务都执行完毕， 主线程处于闲置状态时，主线程会去查找事件队列是否有任务。

如果有，那么主线程会从中取出最老并且符合条件的事件，在取任务的时候会先处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。也就是说同一次事件循环中，微任务永远在宏任务之前执行。

最后把这个事件对应的回调放入执行栈中，然后执行其中的同步代码。这就是 eventloop 模型的过程


### 案例分析<hr>

```js
console.log('start')

setTimeout( function () {
  console.log('setTimeout')
}, 0 )

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('end')

// 执行结果是 start end promise1 promise2 setTimeout
```
执行过程如下：

1. 执行同步代码 console.log('start') (输出 start)
2. 遇到 setTimeout 加入宏任务队列
3. 遇到两个 Promise 的 then 加入微任务队列
4. 执行同步代码 console.log('end') (输出 end)
5. 主线程执行栈为空检查异步任务队列
6. 优先取所有微任务队列的任务回调并放入栈中全部执行完 (输出 promise1 promise2)
7. 宏任务队列的任务执行 （输出 setTimeout）


### 参考文档 <hr>
- <a href="https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly">Jake 的博客</a>
- <a href="https://html.spec.whatwg.org/multipage/webappapis.html#event-loops">whatwg HTML 标准</a>
- <a href="https://w3c.github.io/longtasks/#report-long-tasks">report-long-tasks</a>
- <a href="https://tc39.es/ecma262/#sec-execution-contexts">ecma可执行上线文</a>
- <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth">深入微任务与Javascript运行时环境</a>
- <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide">在 JavaScript 中通过 queueMicrotask() 使用微任务</a>
- <a href="https://w3c.github.io/requestidlecallback/#start-an-idle-period-algorithm">后台任务协同调度 requestidlecallback
</a>
- <a href="https://mp.weixin.qq.com/s/pmduRv-1JKU7tq9vkBTMXg">从起源到浏览器再到 Node.js</a>





