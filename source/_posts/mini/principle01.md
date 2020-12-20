---
title: 微信小程序架构原理
date: 2020-12-12 12:32:09
top: false
cover: false
password:
toc: true
mathjax: false
summary: 
tags:
- 小程序
categories:
- 小程序
---

### 前言<hr>

​小程序的主要开发语言是 JavaScript ，虽然有与网页开发有相似性但是还有一定的区别

- ​网页开发渲染线程和脚本线程是互斥的，也是为什么长时间的脚本运行可能会导致页面失去响应
- 小程序中，逻辑层和渲染层是分开的，双线程同时运行。渲染层的界面使用 WebView 进行渲染；逻辑层采用 JSCore 运行 JavaScript 代码
- 网页开发面对的主要是浏览器及移动端浏览器 WebView
- 小程序开发面对的是两大操作系统 iOS 和 Android 的 微信客户端，所以开发时候需要注意的是微信客户端的版本号和小程序API 支持的基础库版本号

渲染非原生组件以及脚本执行环境的区别如下

|运行环境	 |逻辑层	  |渲染层|
|  ----  | ----  | ---- |
|Android	|V8 |Chromium定制内核|
|iOS	|JSCore	 |WKWebView|
|小程序开发者工具	|NWJS	|Chrome WebView|

### 小程序宿主环境<hr>
在前言中提到小程序的宿主环境为微信客户端，所以借助宿主环境提供的能力，可以完成许多普通网页无法完成的功能

### 渲染层和逻辑层<hr>

首先，我们来简单了解下小程序的运行环境。小程序的运行环境分成渲染层和逻辑层，其中 WXML 模板和 WXSS 样式工作在渲染层，JS 脚本工作在逻辑层。

小程序的渲染层和逻辑层分别由2个线程管理：渲染层的界面使用了 WebView 进行渲染；逻辑层采用 JsCore 线程运行 JS 脚本。一个小程序存在多个界面，所以渲染层存在多个 WebView 线程，这两个线程的通信会经由微信客户端做中转，逻辑层发送网络请求也经由 Native 转发，小程序的通信模型下图所示。

<img src="/images/mini01.png">

### 视图和逻辑通信
多 WebView 模式下，每一个 WebView 都有一个独立的 JSContext，那视图和逻辑是如何进行通讯？如下图双线程生命周期所示。

<img src="/images/mini02.png">

相对于浏览器双线程模型
- 更加安全，因为微信小程序阻止开发者使用一些浏览器提供的一些功能，如操作DOM、动态执行脚本等
- 不用等待浏览器主线程去下载并解析 html，遇到 JS 脚本还会阻塞，影响视图渲染，造成白屏
- 缺点是双线程如果频繁的通信，操作 setDate 更新视图，对性能消耗特别严重，例如拖拽、滚动等

### 整体架构<hr>
当我们对 View 层进行事件操作后，会通过 WeixinJSBridge 将数据传递到 Native 系统层。Native 系统层决定是否要用 native 处理，然后丢给逻辑层进行用户的逻辑代码处理。逻辑层处理后将数据通过 WeixinJSBridge 返给 View 层。View 渲染更新视图，如下图所示。
<img src="/images/mini03.jpg">

### 编译原理<hr>
微信开者工具模拟器运行的代码是经过本地预处理、本地编译，才能看见的页面。而微信客户端运行的代码是额外经过服务器编译的。只有经过编译才能识别并运行小程序的代码。我们先来看一下小程序文件的基本结构

- `.wxml` 页面结构
- `.wxss` 页面样式
- `.js`  页面逻辑
- `.json` 页面相关配置按照【约定优于配置】的原则

接下来我们打开小程序开发者工具，点击左上角微信开发者工具 >> 调试 >> 调试微信开发者工具，看到如下界面（官网组件demo）
<img src="/images/mini04.jpg">
可以看到渲染层和逻辑层是两个 webview，第一个对应的 webview 是渲染层，每个页面都有一个webview，而逻辑层的 appservice 是只有一个。

然后我们接着往下看 webview 中到底是什么？打开 webview 发现 iframe 标签是空的，但我们想要查看怎么办，打开调试面板（console）下面输入
```js
// 第一步先找到所有的webview
document.getElementsByTagName('webview')
// 第二步找到第一个渲染层页面用开发工具命令打开
document.getElementsByTagName('webview')[0].showDevTools(true,null)
```
这个时候我们会看到如下窗口，这个页面就是我们渲染层的页面结构了。
<img src="/images/mini05.jpg">

既然能看到每一个渲染层，肯定也能看到逻辑层代码，在开发者工具控制台中输入 `document`，出现如下页面
<img src="/images/mini06.jpg">

接下来我们看一下微信小程序使用的基础库文件。在开发者工具控制台中输入 `openVendor()` 就会打开本地小程序的 `WeappVendor` 目录，有几个重要的文件

- `wcc` 编译器负责将 `wxml` 编译成 `js` 文件
- `wcsc` 编译器负责将 `wxss` 文件编译成 `js` 文件
- `xxx.wxvpkg` 是不同版本的小程序基础库，主要包含小程序基础库 `WAService` 和 `WAWebview`，这块后续分析。

**wcc的作用**

1、新建一个名为 `compiler.js` 的文件，并写入以下代码
  ```js
  const fs = require("fs");
  const miniprogramCompiler = require("miniprogram-compiler");

  const path = require("path");
  let JsCompiler = miniprogramCompiler.wxmlToJs(path.join(__dirname));
  let cssCompiler = miniprogramCompiler.wxssToJs(path.join(__dirname));
  fs.writeFileSync("wxml.js", JsCompiler);
  fs.writeFileSync("wxcss.js", cssCompiler);
  ```
2、执行 `npm install miniprogram-compiler`
3、执行 `node compiler.js`,会在同目录生成 <a href="https://github.com/MarsPen/-notes-summary/blob/master/source/_posts/mini/wcss.md"> wxml</a> 和 <a href="https://github.com/MarsPen/-notes-summary/blob/master/source/_posts/mini/wcsc.md">wxcss</a> 两个 JS 文件
4、新建 index.wxml 并写入如下代码
  ```js
  <view class="box">
    <text class="box-text">{{ text }}</text>
  </view>
  ```
5、新建 index.html 引入文件 wxml.js，如下代码
  ```js
  <script src="./wxml.js"></script>
  <script>
    const res = $gwx("index.wxml");
    const virtualTree = res({
      text: 'data数据'
    });
    console.log(virtualTree);
  </script>
  ```

用浏览器打开 index.html 控制台会输出类似 Virtual DOM 的对象

```js
{
  "tag":"wx-page",
  "children":[{
    "tag":"wx-view",
    "attr":{ "class":"box"},
    "children":[{
        "tag":"wx-text",
        "attr":{ "class":"box-text" },
        "children":[ "data数据" ],
        "raw":{},
        "generics":{}
    }],
    "raw":{},
    "generics":{}
  }]
}
```

wcc的作用就是：

- 执行 wcc 编译 wxml 生成相关页面注册代码，并记录标签的属性及其值（生成 JS 文件）
- 这个文件主体是一个 $gwx() 函数，接收两个参数 `path` （页面 wxml 路径）和 `global`（顶层对象)

**wcsc的作用**
- wcsc 编译 wxss 得到一个 js 文件
- 添加尺寸单位rpx转换，可根据屏幕宽度自适应
- 提供 setCssToHead 方法将转换后的 css 内容添加到 header

**xxx.wxvpkg**

上面提到过开发者工具中输入`openVendor` 之后会看到很多 `.wxvpkg` 文件，这是小程序的基础库，主要有两部分组成 `WAService` 和 `WAWebview`

- WAWebview：小程序视图层基础库，提供视图层基础能力
- WAService：小程序逻辑层基础库，提供逻辑层基础能力

微信小程序基础库版本是不断更新的，当前我本地的最高版本为 2.14.1.wxvpkg ，我们可以利用<a href="https://github.com/thedreamwork/unwxapkg">unwxapkg</a> 解压 2.14.1.wxvpkg。解压后的目录为 

```js
├── WAAutoService.js
├── WAAutoWebview.js
├── WAGame.js
├── WAGameSubContext.js
├── WAGameVConsole.html
├── WAGfxEmsc.js
├── WAGfxEmsc.wasm
├── WAPageFrame.html
├── WAPerf.js
├── WARemoteDebug.js
├── WAService.js
├── WAServiceMainContext.js
├── WASourceMap.js
├── WASubContext.js
├── WAVConsole.js
├── WAVersion.json
├── WAWKWorker.html
├── WAWebview.js
├── WAWidget.js
└── WAWorker.js
```

其他文件先忽略，我们先看一下 webview 引用的两个基础文件源码概览 
<a href="https://github.com/MarsPen/-notes-summary/blob/master/source/_posts/mini/WAWebview.md">WAWebview</a> 和 <a href="https://github.com/MarsPen/-notes-summary/blob/master/source/_posts/mini/WAService.md">WAService</a>

其中，WAWebview 最主要的几个部分：

- `Foundation`：基础模块(发布订阅、通信桥梁 ready 事件)
- `WeixinJSBridge`：消息通信模块（js 和 native 通讯） Webview 和 Service都有相同的一套
- `exparser`：组件系统模块，实现了一套自定义的组件模型，比如实现了 wx-view
- `__virtualDOM__`：虚拟 Dom 模块
- `__webViewSDK__`：WebView SDK 模块
- `Reporter`：日志上报模块(异常和性能统计数据)

其中，WAService 最主要的几个部分：

- `Foundation`：基础模块
- `WeixinJSBridge`：消息通信模块(js 和 native 通讯) Webview 和 Service都有相同的一套
- `WeixinNativeBuffer`：原生缓冲区
- `WeixinWorker`：Worker 线程
- `JSContext`：JS Engine Context
- `Protect`：JS 保护的对象
- `__subContextEngine__`：提供 App、Page、Component、Behavior、getApp、getCurrentPages 等方法

 
**Foundation 模块**
基础模块提供环境变量 env、发布订阅 EventEmitter、配置/基础库/通信桥 Ready 事件。
<img src="/images/mini07.jpg"></img>

**Exparser 模块**
微信小程序的组件组织框架，内置在小程序基础库中，为小程序的各种组件提供基础的支持。小程序内的所有组件，包括内置组件和自定义组件，都由 Exparser 组织管理。Exparser 的组件模型与 WebComponents 标准中的 ShadowDOM 高度相似。Exparser 会维护整个页面的节点树相关信息，包括节点的属性、事件绑定等，相当于一个简化版的 Shadow DOM 实现。
<img src="/images/mini08.jpg"></img>


**Virtual DOM 模块**
生成 `wx-element` 对象，和 <a href="https://github.com/Matt-Esch/virtual-dom">virtual-dom</a> 类似
<img src="/images/mini09.jpg"></img>

**WeixinJSBridge 模块**
提供了视图层 JS 与 Native、视图层与逻辑层之间消息通信的机制，如下图几个方法:
<img src="/images/mini10.jpg"></img>

**首次渲染流程**
通过上面这些主体结构和函数，对小程序应该有大致的了解，那么我们把上面串起来看一下首次渲染的流程

- 打开微信开发者工具
- 点击左上角调试微信开发者工具
- 调试面板输入 `document.getElementsByTagName('webview')[0].showDevTools(true)`

<img src="/images/mini11.jpg">

上图中最后标注的代码
```js
var decodeName = decodeURI("./pages/index/index.wxml");
var generateFunc = $gwx(decodeName);
if (generateFunc) {
    var CE = (typeof __global === 'object') ? (window.CustomEvent || __global.CustomEvent) : window.CustomEvent;
    document.dispatchEvent(new CE("generateFuncReady", {
        detail: {
            generateFunc: generateFunc
        }
    })) __global.timing.addPoint('PAGEFRAME_GENERATE_FUNC_READY', Date.now())
} else {
    document.body.innerText = decodeName + " not found"console.error(decodeName + " not found")
};
```
所以初次渲染流程如下
- 利用 $gwx 创建类似虚拟 DOM 的节点树
- 创建自定义事件 window.CustomEvent（CE）
- 分发自定义事件 document.dispatchEvent
- 在 WAWebview 监听这个事件，然后通过 WeixinJSBridge 通知 JS 逻辑层视图已经准备好

  ```js
  c = function() {
    setTimeout(function() {
          ! function() {
            var e = arguments;
            r(function() {
              WeixinJSBridge.publish.apply(WeixinJSBridge, o(e))
            })
        }("GenerateFuncReady", {})
    }, 20)
  }
  document.addEventListener("generateFuncReady", c)
  ```
- 最后 JS 逻辑层将数据给 Webview 视图层，进行首次渲染

<img src="/images/mini12.jpeg">

### 通信原理<hr>
小程序逻辑层和渲染层的通信会由 Native （微信客户端）做中转，逻辑层发送网络请求也经由 Native 转发。

**视图层组件:**
内置组件中有部分组件（map、video等）是利用到客户端原生提供的能力，那是怎么通信的呢？iOS 是利用了 WKWebView 的提供 messageHandlers 特性，而在安卓则是往 WebView 的 window 对象注入一个原生方法，最终会封装成 WeiXinJSBridge 这样一个兼容层，主要提供了调用（invoke）和监听（on）这两种方法。

**逻辑层接口:**
iOS 平台往 JavaScripCore 框架注入一个全局的原生方法，而安卓方面则是跟渲染层一致。

不论视图层（部分组件）还是逻辑层，开发者都是间接地调用客户端原生底层的能力。


### 总结<hr>
这篇文章主要是理解小程序 wcc 和 wcsc 编译的文件，以及整个小程序架构的的意义。由于逻辑层源码微信官方加密看到只能靠打印和猜测每个模块大致的作用。











































