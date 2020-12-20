```js
var __wxLibrary = {
  fileName: "WAService.js",
  envType: "Service",
  contextType: "App:Uncertain",
  execStart: Date.now(),
};
var __WAServiceStartTime__ = Date.now();
(function (global) {
  var __exportGlobal__ = {};
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
  var __Function__ = global.Function;
  var Function = __Function__;
  var __sclEngine__ = null;

  // core-js 模块
  !function(r, o, Ke) {
  }(1, 1);

  var __wxTest__ = !1,
  wxRunOnDebug = function(A) {
    A()
  },
  __wxConfig,
  // 基础模块 
  Foundation = (function(n) {
    ...
  }([function(e, t, n) {
    ...
  }]).default,

  nativeTrans = (function(e) {
    ...
  })(this),

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
  (function(i) {...}(this),

  // 异常捕获（error、onunhandledrejection）
  (function(A) {...}(this);

  // 原生缓冲区
  var NativeBuffer = (function(e) {...})(this),
  WeixinNativeBuffer = NativeBuffer,
  NativeBuffer = null,

  wxConsole = ["log", "info", "warn", "error", "debug", "time", "timeEnd", "group", "groupEnd"].reduce(function(e, t) {
      return e[t] = function() {}, e
    }, {}),

  wxPerfConsole = ["log", "info", "warn", "error", "time", "timeEnd", "trace", "profile", "profileSync"].reduce(function(e, t) {
    return e[t] = function() {}, e
  }, {}),

  wxNativeConsole = (function(n) {
    ...
  }([function(e, t, n) {
    ...
  }]).default,

  // Worker 模块
  var WeixinWorker = (function(A) {
    ...
  })(this),

  // JSContext
  JSContext = (function(n) {
    ...
  }([
    ...
  }]).default,

  __appServiceConsole__ = (function(n) {
    ...
  }([function(e, N, R) {
    ...
  }]).default,


  Protect = (function(n) {
    ...
  }([function(e, t, n) {
    ...
  }]),

  __errorTracer__ = (function(t) {
    ...
  }([function(A, e, t) {
    ...
  }]),

  Reporter = (function(n) {
    ...
  }([function(e, N, R) {
    ...
  }]).default,

  __subContextEngine__ = (function(n) {
    ...
  }([function(e, t, n) {
    ...
  }]),

  Safeway = (function(t) {
    ...
  }([function(A, e, t) {
    ...
  }]),

  __safeway__ = new Safeway(),

  __exparserSclEngine__ = (function(t) {
    ...
  }([function(A, p, y) {
    ...
  }]),

   __sclEngine__ = (function(t) {
    ...
  }([function(A, e, t) {
    ...
  }]),

  __waServiceInit__ = (function() {
    ...
  };

  function __doWAServiceInit__() {
    var A;
    "undefined" != typeof wx && wx.version && (A = wx.version),
      __waServiceInit__(),
      A &&
        "undefined" != typeof __exportGlobal__ &&
        __exportGlobal__.wx &&
        (__exportGlobal__.wx.version = A);
  }
  __subContextEngine__.isIsolateContext(),
  __subContextEngine__.isIsolateContext() || __doWAServiceInit__();
  __subContextEngine__.initAppRelatedContexts(__exportGlobal__);
})(this);
var __WAServiceEndTime__ = Date.now();
typeof __wxLibrary.onEnd === "function" && __wxLibrary.onEnd();
__wxLibrary = undefined;
```
