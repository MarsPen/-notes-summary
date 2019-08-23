---
title: 函数节流与抖动
date: 2019-5-15 12:32:09
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

### 浏览器内核

说起函数的节流与抖动这个老生长谈的话题，我们就需要了解一下关于浏览器的知识

浏览器有各种进程，来保证浏览器正常的、流畅的呈现在用户的眼前。例如渲染进程（也就是浏览器的内核）是非常重要的一个进程，其中包含了很多的线程

```
GUI渲染线程(负责渲染浏览器界面，解析HTML,CSS,构建DOM树和RenderObject树，布局和绘制等)

JS引擎线程(JS内核，负责处理JavaScript脚本程序)

事件触发线程(归属于浏览器而不是JS引擎，用来控制事件循环)

定时触发器线程(传说中的setTimeout和setInterval所在的线程)

异步http请求线程(在XMLHttpRequest在连接后是通过浏览器新型一个线程请求)
```

这里我们大概了解一下着几个概念，关于更过的相关知识会在后续的文章中介绍


### 请求过程

我们先来看下面一张来至 W3C 的图

<img src="/images/timestamp-diagram.svg"></img>


从图中我们看到处理模型大概分为如下几个阶段
- DNS 查询
- TCP 连接
- HTTP 请求即响应
- 服务器响应
- 客户端渲染

这篇文章我们不讨论 Resource Timing 阶段，会在后续文章前端性能的时候重新提起

### 渲染过程

通过第五个阶段客户端渲染简单的回忆一下网页的生成过程，大致分为几个步骤

- HTML解析器解析成DOM 树
- CSS解析器解析成CSSOM 树
- 结合DOM树和CSSOM树，生成一棵渲染树(Render Tree)
- 生成布局（Layout），根据渲染树来布局，以计算每个节点的几何信息
- 最后一步是绘制（Paint），使用最终渲染树将像素渲染到在屏幕上


<img src="/images/render-process.jpg">

通过上面的总结我们解析每一个步骤能更加深入的了解浏览器渲染过程

### HTML 解析器解析过程

HTML 解析器构建 DOM 树，实际上是经过下面几个步骤

```
字节 -> 字符 -> 令牌 -> 节点对象 -> 对象模型

编码阶段将 HTML 的原始字节数据转换为文件指定编码

令牌阶段根据HTML规范来将字符串转换成各种令牌也就是标签节点

生成节点对象阶段是根据每个令牌转换定义其属性和规则的对象（节点对象）

最后阶段 DOM 树构建完成，整个对象集合就像是一棵树形结构（对象模型）
```

下面通过代码和图片来解释上面的步骤

```
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link href="style.css" rel="stylesheet">
    <title></title>
  </head>
  <body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src=""></div>
  </body>
</html>
```

<img src="/images/dom-render.jpg" />

### CSS 解析过程

浏览器获得 CSS 文件的数据后 CSS 解析器根据具体的样式将渲染 CSSDOM 树

<img src="/images/css-dom-render.jpg" />

### 渲染树渲染

构建 两个树之后渲染树出场，浏览器会先从DOM树的根节点开始遍历，对每个可见节点，找到对应的 CSS 样式规则，进行匹配形成构建完成的渲染树

<img src="/images/render-tree.jpg">


渲染树构建后浏览器根据节点对象的规则进行flow（布局）阶段，布局阶段会从渲染树的根节点开始遍历，然后确定每个节点对象在页面上的确切大小与位置最后生成我们大家知道的浏览器盒模型


最后当Layout布局事件完成后，浏览器会立即发出Paint Setup与Paint事件，开始将渲染树绘制成像素，最后渲染到在屏幕上


通过上面大致的流程我们知道了浏览器的渲染过程，我们知道网页在生成的时候，至少会渲染一次执行css之后 load 对应 JS 也会进行重新渲染

重新渲染就可能会 reflow + repaint

### 重绘与回流

回流(reflow)： 当render tree中的一部分(或全部)因为元素的规模尺寸、布局、隐藏等改变而需要重新构建

重绘(repaint): 当一个元素的外观发生改变，但没有改变布局,重新把元素外观绘制出来的过程，叫做重绘

回流必定会发生重绘，重绘不一定会引发回流

浏览器的reflow + repaint 在我们设置节点样式时频繁出现，对性能是个巨大的消耗，因为回流所需的成本比重绘高的多，改变父节点里的子节点很可能会导致父节点的一系列回流，所以我们经常说尽可能的减少重排次数、重排范围，这样就能呈现给用户更改的感官（关于优化手段会在后续的性能优化文章中介绍）


根据上面说了这么多，我们来进入文章的主题**防抖和节流**当我们窗口发生改变，浏览器的滚动条执行scroll，输入框校验，搜索请求接口等这些都会使页面频繁重新渲染，加重浏览器的负担，这是我们通过**防抖和节流**的方式减少触发频率，这样就会大大的提高用户体验

### debounce（防抖）

动作发生一定时间后触发事件，在这段时间内，如果该动作又发生，则重新等待一定时间再触发事件。

html 

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>防抖</title>
  <style>
    #container{
      width: 100%; 
      height: 500px; 
      background: #000; 
      font-size: 50px;
      color: #fff;
      line-height: 500px; 
      text-align: center; 
    }
  </style>
</head>
<body>
  <div id="content"><div>
  <script src="debounce.js"></script>
  <script>
    var count = 1;
    var container = document.getElementById('container');
    function getContent(e) {
      container.innerHTML = count++;
    };
    // container.onmousemove = getContent
    container.onmousemove = debounce(getContent, 500, true);
  </script>
</body>
</html>
```

debounce.js 

```
@underscore.js

var debounce = /** @class */ (function () {
  
  /**
   * @desc 函数防抖
   * @param {*} func 回调函数
   * @param {*} wait 延迟执行毫秒数
   * @param {*} immediate  true 表立即执行，false 表非立即执行
   */
  function debounce(func, wait, immediate) {

    // 创建一个标记用来存放定时器的返回值
    var timeout,result;
    
    return function () {

      // 指定this 作用域
      var context = this;
      // event 对象
      var args = arguments;

      // 再次执行事件的时候，清除上一个定时器
      if (timeout) clearTimeout(timeout);
      
      if (immediate) {
        // 如果已经执行过，将不再执行
        var callNow = !timeout;
        timeout = setTimeout(function(){
          timeout = null;
        }, wait)
        
        if (callNow) result = func.apply(context, args)
      }
      else {
        
        timeout = setTimeout(function(){
          func.apply(context, args)
        }, wait);
      }
      // func 这个函数，可能有返回值
      return result;
    }
  }

  return debounce;
  
}())

```


### throttle

动作执行一段时间后触发事件，在这段时间内，如果动作又发生，则无视该动作，直到事件执行完后，才能重新执行

关于节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器

使用时间戳

当触发事件的时候，取出当前的时间戳，之后减去之前的时间戳(最一开始值设为 0 )，如果大于设置的时间周期，执行函数并更新当前时间戳，反之就不执行。

```
var throttle = /** @class */ (function () {
  
  function throttle(func, wait) {
    var args;
    var previous = 0;
  
    return function() {
      var now = +new Date();
      args = arguments;
      if (now - previous > wait) {
        func.apply(this, args);
        previous = now;
      }
    }
  }

  return throttle
}())
```

使用定时器

事件触发的时候，设置一个定时器，如果定时器存在，就不执行，等定时器到指定的时间，清空定时器，执行事件

```
function throttle(func, wait) {
  var timeout;
  var previous = 0;

  return function() {
    context = this;
    args = arguments;
    if (!timeout) {
      timeout = setTimeout(function(){
        timeout = null;
        func.apply(context, args)
      }, wait)
    }
  }
}
```

对比两种实现方式

- 第一种会立刻执行，第二种会在设定的时间后第一次执行
- 第一种停止触发后不会再执行，第二种停止触发后依然会再执行一次

现在我们要结合上面两种方式实现一个开始触发立刻执行，停止触发的时候还能再执行一次

```
@underscore.js

var throttle = /** @class */ (function () {

  /**
   * throttle 节流
   * @param {*} func  回调函数
   * @param {*} wait  执行时间间隔
   * @param {*} options  如果想忽略开始函数的的调用，传入{leading: false}
   *                     如果想忽略结尾函数的调用，传入{trailing: false}
   *                     两者不能共存，否则函数不能执行
   */
  function throttle(func, wait, options) {

    var timeout, context, args;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      // 如果设置了 leading，就将 previous 设为 0
      previous = options.leading === false ? 0 : new Date().getTime();
      // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
      timeout = null;
      func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = new Date().getTime();
      
      if (!previous && options.leading === false) previous = now;
      // 计算剩余时间
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        // 如果存在定时器就清理掉否则会调用二次回调
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        // 判断是否设置了定时器和 trailing，没有就开启一个定时器
        timeout = setTimeout(later, remaining);
      }
    };
    return throttled;
}

  return throttle
}())
```

调用例子
```
ontainer.onmousemove = throttle(getContent, 1000);
container.onmousemove = throttle(getContent, 1000, {
  leading: false
});
container.onmousemove = throttle(getContent, 1000, {
  trailing: false
});
```

### 总结

上面的就是函数的节流与抖动的全部，我们在面试和工作中会经常的遇到。这也是性能优化的一种方案。当然还有很多版本比如多 promise 版本的就不再这里叙述了，有兴趣的可以找找技术论坛


























































































