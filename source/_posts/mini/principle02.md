---
title: 微信小程序之启动流程
date: 2020-12-20 12:32:09
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

在说小程序启动流程分析之前我们先来了解下其他相关相关知识，也是官方文档提到的

### 运行机制

> 小程序启动会有两种情况，一种是「冷启动」，一种是「热启动」。假如用户已经打开过某小程序，然后在一定时间内再次打开该小程序，此时无需重新启动，只需将后台状态的小程序切换到前台，这个过程就是热启动；冷启动指的是用户首次打开或小程序被微信主动销毁后再次打开的情况，此时小程序需要重新加载启

- 小程序没有重启的概念
- 当小程序进入后台，客户端会维持一段时间的运行状态，超过一定时间后（目前是5分钟）会被微信主动销毁
- 当短时间内（5s）连续收到两次以上收到系统内存告警，会进行小程序的销毁

<img src="/images/mini13.png" >

### 更新机制

小程序冷启动时如果发现有新版本，将会异步下载新版本的代码包，并同时用客户端本地的包进行启动，即新版本的小程序需要等下一次冷启动才会应用上。 如果需要马上应用最新版本，可以使用 <a href="https://developers.weixin.qq.com/miniprogram/dev/api/base/update/wx.getUpdateManager.html">wx.getUpdateManager API</a> 进行处理

### 生命周期
小程序的生命周期分为冷启动和热启动，执行顺序如下图（无卸载销毁阶段）
<img src="/images/mini14.jpg">

### 启动流程
在微信开发者工具命令行中输入 `document` 打开逻辑层的的代码可以看到大致流程如下：
<img src="/images/mini15.png">

**第一步：初始化全局变量**
```js
// 指向当前正在加载的页面路径
var __wxRoute,
// 标志 Page 的正确注册
  __wxRouteBegin,
// 指向当前正在加载的 JS 文件
  __wxAppCurrentFile__,
// 小程序每个页面的 data 域对象
  __wxAppData = {},
// 分为两类.json 和 .wxml 结尾，
// .wxml 结尾的，其 key 值为通过调用 $gwx('./pages/index/index.wxml')() 得到一个节点树
  __wxAppCode__ = {},
  __vd_version_info__ = {},
// 自定义组件构造器
  Component = function() {},
// 自定义组件 behavior 构造器
  Behavior = function() {},
// 自定义插件的构造器
  definePlugin = function() {},
  requirePlugin = function() {};
// global
global = {};
var $gwx,
  __workerVendorCode__ = {},
  __workersCode__ = {},
  // 多线程构造器
  __WeixinWorker = (WeixinWorker = {});
// 根据全局配置和页面配置生成的配置对象
var __wxConfig = {
  // ...
};
```

**第二步：加载框架（WAService.js）**

我们调用的 API 主要是 `__waServiceInit__`部分定义的，如以下方法

- `__appServiceEngine__`： 提供了框架最基本的对外接口，如 `App`、`Page`、`Component`、`Behavior`、`getApp`、`getCurrentPages` 等方法
- `exparser`：提供了框架底层的能力，如实例化组件，数据变化监听，`View` 层与逻辑层的交互等
- `__virtualDOM__`：着连接 `__appServiceEngine__`和 `exparser` 的作用

**第三步：业务代码的加载**

require 和 define

- 小程序中，开发者的 JavaScript 代码会被打包为 AMD 规范的 JS 模块
- require 和 define 两个方法是在 WAService 中定义的
- define 限制了模块可使用的其他模块，如 window，document在小程序中是不可使用的

代码的加载顺序是
- 加载项目中其他 js 文件（非注册程序和注册页面的 js 文件）
- 注册程序的 app.js
- 注册自定义组件 js 文件
- 注册页面的 js 代码

对于在 app.js 以及注册页面的 js 代码都会加载完成后立即使用 require 方法执行模块中的程序。其他的代码则需要在程序中使用 require 方法才会被执行

**第四步：加载 app.js 与注册程序**

在 app.js 加载完成后，小程序会使用 require('app.js') 注册程序，即对 App 方法进行调用。App 方法是对`__appServiceEngine__.App`方法的引用， App() 函数用来注册一个小程序，接收一个 object 对象参数，其指定小程序的生命周期函数等，getApp() 函数可以用来获取到小程序实例

```js

try {
  require("app.js")
} catch (error) {
  !error.from && console.error('app.js错误:\\n',error)
  throw error
};
var decodePathName = decodeURI("component/hello")
__wxAppCode__[decodePathName + ".json"] = {
  "component":true,
  "usingComponents":{}
}
__wxAppCode__[decodePathName + ".wxml"]=\$gwx("./" + decodePathName + ".wxml")

var decodePathName = decodeURI("pages/index/index")
__wxAppCode__[decodePathName + ".json"]= {
  "usingComponents": {
    "hello":"/component/hello"
  }
}
__wxAppCode__[decodePathName + ".wxml"]=\$gwx("./" + decodePathName + ".wxml")

var decodePathName = decodeURI("pages/logs/logs")
__wxAppCode__[decodePathName + ".json"]= {
  "navigationBarTitleText":"查看启动日志",
  "usingComponents":{}
}
__wxAppCode__[decodePathName + ".wxml"]=\$gwx("./" + decodePathName + ".wxml");

var decodePathName = decodeURI("component/hello")
__wxRoute = decodePathName
__wxRouteBegin = true
__wxAppCurrentFile__ = decodePathName + ".js"
try {
  require(__wxAppCurrentFile__)
} catch (error) {
  // 插件项目不能hack define和require，走这里，异常只能精准到页面，内部的多层依赖的报错无法精准
  !error.from && console.error('页面【' + decodePathName + ']错误:\\n',error)
  throw error
}
```

APP 方法调用时的处理流程

- deprecated：getCurrentPage
- 绑定生命周期函数如 "onLaunch"、"onShow"等
- 绑定其他属性并判断是不是 getCurrentPage，然后绑定当前的 APP 实例
- 根据是否有 onError 属性判断是不是注册错误
- 检查启动参数
  - 调用 onLaunch 参数使用 __wxConfig.appLaunchInfo，然后 JSBridge 调用 getAppConfig
  - 调用 onShow 参数可能和 onLaunch 不同
- 注册前后台切换回调
- 注册找不到页面的回调
- 返回实例给 APP 缓存

**第五步：加载自定义组件代码以及注册自定义组件**
在 app.js 加载完之后，会加载自定义组件，每个自定义组件都是加载完自动注册。直到所有组件注册完毕。执行的步骤如下

- 设置 `__wxRouteBegin` 为 false
- 执行 `__virtualDOM__.Component(com)`：
  - 获取当前加载路径
  - 标准化 com 配置（生命周期、插槽、通讯参数等）
  - 缓存 com 配置，缓存到 exparser.component.__list 中
- 缓存组件：以 path 为 key 值为 exparser.component.__list[comPath]


**第六步：加载页面代码和注册页面**

和加载自定义组件处理流程一样，都是每一个加载完后先注册在加载下一个

处理 Page 的流程如下
- 检查 `__wxRouteBegin` 是否为 false，
- 设置 `__wxRouteBegin` 为 false
- 检查是否在 app.json 中定义，如果未定义则抛出错误
- 获取.json 中的定义信息
- 检查 page 是否为对象，如果不是则抛出错误
- 检查是否使用自定义组件
  - 使用：执行 `__virtualDOM__.Page(page)`，缓存 page 的配置信息以 path 为 key 值为 exparser.Component.__list[pagePath]`
  - 未使用： 缓存 page 的配置信息以 path 为 key 值为 page 对象

**第七步：等待页面 Ready 和 Page 实例化**

在小程序中切换页面或打开页面时会触发 onAppRoute 事件，通过 wx.onAppRoute 注册页面切换的处理程序，在所有程序就绪后，以 entryPagePath 作为入口使用 appLaunch 的方式进入页面。而 Ready 生命周期才页面真正的渲染完成


### 总结<hr>

上述就是小程序的启动流程，小程序不论是组件还是页面加载过后都会缓存一方面主要是为了提高性能，另一方面小程序还主要是 web 程序要等到 web 都执行完毕之后才 Ready。由于小程序插件在实际开发中应用很少所以就不再这里介绍了。我们记住这个流程（加载APP --> 加载组件 --> 加载页面）就可以了。








