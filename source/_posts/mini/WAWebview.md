
```js
// WAWebview.js 源码结构
var __wxLibrary = {
  fileName: "WAWebview.js",
  envType: "WebView",
  contextType: "others",
  execStart: Date.now(),
};
var __WAWebviewStartTime__ = Date.now();
var __libVersionInfo__ = {
  updateTime: "2020.12.17 16:43:54",
  version: "2.14.1",
  features: {
    pruneWxConfigByPage: true,
    injectGameContextPlugin: true,
    lazyCodeLoading2: true,
    injectAppSeparatedPlugin: true,
    nativeTrans: true,
  },
};

// core-js 核心模块
!function(n, o, Ye) {
  ...
  }, function(e, t, i) {
    var n = i(3),
      o = "__core-js_shared__",
      r = n[o] || (n[o] = {});
    e.exports = function(e) {
      return r[e] || (r[e] = {})
    }
  ...
}(1, 1);

var __wxTest__ = !1,
wxRunOnDebug = function (e) { e() },
__wxConfig,

/**
* 基础功能
* env 版本控制
* eventEmit 实现及调用处理
* 初始化库函数及当前基本环境
* 检查JSBridge
* utils
*/
Foundation = (function(i) {...}]).default,

nativeTrans = (function (e) {...})(this),

/**
 * 消息通信模块            
 * on: v, //js 监听 native 消息
 * publish: A,//发布消息到对应的逻辑层或者视图层
 * invoke: g,//js 调用原生方法
 * subscribe: m, //监听对应逻辑层或者视图层发送过来的消息
 */
WeixinJSBridge = (function(e) {...})(this);

Foundation.onBridgeReady(function () {...}),

// 监听 nativeTrans 相关事件
(function () {
  var o = nativeTrans.enabled;
  ...
})(),

// 解析配置
(function(r) {
  ...
  __wxConfig = _(__wxConfig), __wxConfig = v(__wxConfig), Foundation.onConfigReady(function() {
    m()
  }), n ? __wxConfig.__readyHandler = A : d ? Foundation.onBridgeReady(function() {
    WeixinJSBridge.on("onWxConfigReady", A)
  }) : Foundation.onLibraryReady(A)
})(this),

// 异常捕获（error、onunhandledrejection）
(function(e) {
  function t(e) {
    Foundation.emit("unhandledRejection", e) || console.error("Uncaught (in promise)", e.reason)
  }
  "object" == typeof e && "function" == typeof e.addEventListener ? (e.addEventListener("unhandledrejection", function(e) {
    t({
      reason: e.reason,
      promise: e.promise
    }), e.preventDefault()
  }), e.addEventListener("error", function(e) {
    var t;
    t = e.error, Foundation.emit("error", t) || console.error("Uncaught", t), e.preventDefault()
  })) : void 0 === e.onunhandledrejection && Object.defineProperty(e, "onunhandledrejection", {
    value: function(e) {
      t({
        reason: (e = e || {}).reason,
        promise: e.promise
      })
    }
  })
})(this),


// 原生缓冲区
var NativeBuffer = (function (e) {})(this),
WeixinNativeBuffer = NativeBuffer,
NativeBuffer = null,

// 日志模块：wxConsole、wxPerfConsole、wxNativeConsole、__webviewConsole__
wxConsole = ["log", "info", "warn", "error", "debug", "time", "timeEnd", "group", "groupEnd"].reduce(function(e, t) {
  return e[t] = function() {}, e
}, {}),

wxPerfConsole = ["log", "info", "warn", "error", "time", "timeEnd", "trace", "profile", "profileSync"].reduce(function(e, t) {
  return e[t] = function() {}, e
}, {}),

wxNativeConsole = (function(i) {
  ...
}([function(e, t, i) {
  ...
}]).default,

__webviewConsole__ = (function(i) {
  ...
}([function(e, t, i) {
  ...
}]),

// 上报模块
Reporter = (function(i) {
  ...
}([function(e, L, O) {
  ...
}]).default,

Perf = (function(i) {
  ...
}([function(e, t, i) {
  ...
}]).default,

// 视图层 API
__webViewSDK__ = (function(i) {
  ...
}([function(e, L, O) {
  ...
}]).default,
wx = __webViewSDK__.wx,

//组件系统
exparser = (function(i) {
  ...
}([function(e, t, i) {
  ...
}]),

/**
 * 框架粘合层
 * 
 * 使用 exparser.registerBehavior 和 exparser.registerElement 方法注册内置组件
 * 转发 window、wx 对象上到事件转发到 exparser
 */
!function(i) {
  ...
}([function(e, t) {
  ...
}, function(e, t) {}, , function(e, t) {}]);


// Virtual DOM 
var __virtualDOMDataThread__ = !1,
var __virtualDOM__ = (function(i) {
  ...
}([function(e, t, i) {
  ...
}]),

// __webviewEngine__
__webviewEngine__ = (function(i) {
  ...
}([function(e, t, i) {
  ...
}]);

/**
 * 注入默认样式到页面
 */
!function() {
  ...
  function e() {
     var e = i('...');
    __wxConfig.isReady ? void 0 !== __wxConfig.theme && i(t, e.nextElementSibling) : __wxConfig.onReady(function() {
      void 0 !== __wxConfig.theme && i(t, e.nextElementSibling)
    })
  }
  window.document && "complete" === window.document.readyState ? e() : window.onload = e
}();

var __WAWebviewEndTime__ = Date.now();
var __wxAppCode__ = __wxAppCode__ || {};
var __WXML_GLOBAL__ = __WXML_GLOBAL__ || {
  entrys: {},
  defines: {},
  modules: {},
  ops: [],
  wxs_nf_init: undefined,
  total_ops: 0
};
typeof __wxLibrary.onEnd === 'function' && __wxLibrary.onEnd();
__wxLibrary = undefined;
```
