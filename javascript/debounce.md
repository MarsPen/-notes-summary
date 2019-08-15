<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 11:41:05
 * @LastEditTime: 2019-08-15 15:44:27
 * @LastEditors: Please set LastEditors
 -->
## 函数节流与抖动

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


### 浏览器渲染过程

我们先来看下面一张来至 W3C 的图

<img src="https://github.com/MarsPen/-notes-summary/blob/master/images/timestamp-diagram.svg"></img>


从图中我们看到处理模型大概分为如下几个阶段
- DNS 查询
- TCP 连接
- HTTP 请求即响应
- 服务器响应
- 客户端渲染

这篇文章我们不讨论 Resource Timing 阶段，会在后续文章前端性能的时候重新提起

通过第五个阶段客户端渲染简单的回忆一下网页的生成过程，大致分为几个步骤

- HTML解析器解析成DOM 树
- CSS解析器解析成CSSOM 树
- 结合DOM树和CSSOM树，生成一棵渲染树(Render Tree)
- 生成布局（Layout），根据渲染树来布局，以计算每个节点的几何信息
- 最后一步是绘制（Paint），使用最终渲染树将像素渲染到在屏幕上


<img src="https://github.com/MarsPen/-notes-summary/blob/master/images/render-process.jpg">

通过上面的总结我们解析每一个步骤能更加深入的了解浏览器渲染过程


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

<img src="https://github.com/MarsPen/-notes-summary/blob/master/images/dom-render.jpg" />

浏览器获得 CSS 文件的数据后 CSS 解析器根据具体的样式将渲染 CSSDOM 树

<img src="https://github.com/MarsPen/-notes-summary/blob/master/images/css-dom-render.jpg" />


构建 两个树之后渲染树出场，浏览器会先从DOM树的根节点开始遍历，对每个可见节点，找到对应的 CSS 样式规则，进行匹配形成构建完成的渲染树

<img src="https://github.com/MarsPen/-notes-summary/blob/master/images/render-tree.jpg">


渲染树构建后浏览器根据节点对象的规则进行flow（布局）阶段，布局阶段会从渲染树的根节点开始遍历，然后确定每个节点对象在页面上的确切大小与位置最后生成我们大家知道的浏览器盒模型


最后当Layout布局事件完成后，浏览器会立即发出Paint Setup与Paint事件，开始将渲染树绘制成像素，最后渲染到在屏幕上


通过上面大致的流程我们知道了浏览器的渲染过程，我们知道网页在生成的时候，至少会渲染一次执行css之后 load 对应 JS 也会进行重新渲染

重新渲染就可能会 reflow + repaint

重排(reflow)： 任何会改变元素几何信息(元素的位置和尺寸大小)的操作，都会触发重排

重绘(repaint): 当一个元素的外观发生改变，但没有改变布局,重新把元素外观绘制出来的过程，叫做重绘


浏览器的reflow + repaint 对性能是个巨大的消耗，所以我们经常说尽可能的减少重排次数、重排范围，这样就能呈现给用户更改的感官（关于优化手段会在后续的性能优化文章中介绍）


### debounce（防抖）和throttle（节流）

根据上面说了这么多，我们来进入文章的主题**防抖和节流**当我们窗口发生改变，浏览器的滚动条执行scroll，输入框校验，搜索请求接口等这些都会使页面频繁重新渲染，加重浏览器的负担，这是我们通过**防抖和节流**的方式减少触发频率，这样就会大大的提高用户体验

**debounce（防抖）：**

频繁的触发一个任务下（如获取联想词的搜索输入框），只有任务触发的间隔超过指定间隔的时候（合并任务），任务才会执行



























































