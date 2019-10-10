---
title: promise
date: 2019-6-11 12:32:09
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

本篇文章主要是实现 Promise 的原理, 具体 API 用法不在本文中做介绍。可以查看阮一峰老师的 <a href="http://es6.ruanyifeng.com/#docs/promise">ES6 Promise教程</a><br/>

实现 Promise 首先要知道它的执行特点<br/>

1. Promise 是一个构造函数，接受函数作为参数(resolve(),reject()) 
2. Promise 对象有三种状态 pending(进行中), fulfilled(成功), rejected(失败)
3. Promise 从 pending 变为 fulfilled 过程是成功的过程可以执行回调函数 resolve() 
4. Promise 从 pending 变为 rejected 过程是失败的过程可以执行回调函数 reject()
5. Promise 状态无法中途取消，一旦建立立即执行，会一直保持这个结果，这时也叫 resolved(已定型状态)
6. Promise 状态改变时 then 方法支持多次链式调用 
7. Promise 如果不设置回调函数内部会抛异常


### 定义构造函数 
 
构造函数 Promise 必须接受函数作为参数

1. 定义构造函数
2. 判断一个参数是否为函数

```js
/**
 * 封装判断参数是够是函数
 */
function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]';
}

/**
 * 定义构造函数
 * @param {*} fn 
 */
function Promise(fn) {
  if (!isFunction(fn)) {
    throw new Error('Promise must accept a function as a parameter')
  }
}
```

### 定义 resolve 

在内部定义 resolve 方法作为参数传到 fn 中，fn 调用成功后会调用 resolve 方法，之后在执行 then 中注册的回调函数

```js
/**
 * 定义构造函数
 * @param {*} fn 
 */
function Promise(fn) {
  // 判断是否是函数
  var _isFunction = Object.prototype.toString.call(fn) === '[object Function]';

  // 如果不是函数抛出异常
  if (!_isFunction) {
    throw new Error('Promise must accept a function as a parameter')
  }
  
  // 定义回调状态
  var __callback
  this.then = function (status) {
    __callback = status
  }
  // 定义 resolve 函数传入成功的数据
  function resolve (data) {
    __callback(data)
  }
  fn(resolve)
}
```

调用例子

```js
function request () {
  return new Promise(function(resolve){
    if (true) {
      setTimeout(function() {
        resolve("renbo");
      }, 0);
    }
  })
}

request().then(function(data){
  console.log(data)
  console.log('success')
})

// 输出
renbo
success
```

上面的例子我们已经简单的实现了 promise 的基础回调，接下来我们完成链式语法调用以及then队列管理

### 链式语法及队列管理

```js
function Promise (fn) {
  
  var _isFunction = Object.prototype.toString.call(fn) === '[object Function]';

  if (!_isFunction) {
    throw new Error('Promise must accept a function as a parameter')
  }
  
  var _this = this,
      _value = null;
      _this._resolves = [];

  this.then = function (status) {
    _this._resolves.push(status);
    return this;
  }

  // 将 resolve 中执行回调的逻辑放置到 JS 任务队列列末尾
  function resolve (val) {
     setTimeout(function() {
      _this._resolves.forEach(function (callback) {
        _value = val
        callback(_value)
      })
    },0);
  }

  fn (resolve)
}
```


###  加入状态并串行Promise

Promise 对象有三种状态 <br/>
1. pending(进行中) 立即执行
2. 从 pending 变为 fulfilled 过程是成功的过程可以执行回调函数 resolve('fulfilled') 
3. 从 pending 变为 rejected 过程是失败的过程可以执行回调函数 reject('rejected')

`promsie状态 只能由 pending => fulfilled/rejected, 一旦修改就不能再变`

我们加入上面的状态并串行Promise

```js
function Promise (fn) {
  
  function _isFunction (func) {
    return Object.prototype.toString.call(func) === '[object Function]';
  }
  if (!_isFunction(fn)) {
    throw new Error('Promise must accept a function as a parameter')
  }
  
  var _this = this,
      _val = null;
      _this._resolves = [];
      _this._status = 'PENDING';
      
  this.then = function (onFulfilled) {
    return new Promise(function (resolve) {
      // handle 函数对上一个 promise 的 then 中回调进行了处理，并且调用当前的 promise 中的 resolve 方法。
      function handle(_val) {
        var ret = _isFunction(onFulfilled) && onFulfilled(_val) || _val
        // 如果是⼀一个 promise 对象，就会调⽤ then 方法，形成一个嵌套
        if (ret && _isFunction(ret['then'])) {
          ret.then(function (value) {
            resolve(value);
          })
        } else {
          resolve(ret)
        }
      }
      if (_this._status === 'PENDING') {
       _this._resolves.push(handle);
      } else if(promise._status === 'FULFILLED'){
        handle(value);
      }       
    })
  }

  // 将 resolve 中执行回调的逻辑放置到 JS 任务队列列末尾
  function resolve (val) {
     setTimeout(function() {
       _this.status = "FULFILLED";
      _this._resolves.forEach(function (callback) {
        _val = val
        callback(_val)
      })
    },0);
  }

  fn (resolve)
}
```

### 错误处理reject

在异步操作中，操作可能失败，执行失败的回调函数，上面已经说到从 pending 变为 rejected 过程是失败的过程可以执行回调函数 reject()

```js
function Promise(fn) {

  /**
   * 工具函数判断是否是 function
   * @param {*} func 
   */
  function _isFunction(func) {
    return Object.prototype.toString.call(func) === '[object Function]';
  }
  if (!_isFunction(fn)) {
    throw new Error('Promise must accept a function as a parameter')
  }


  var _this = this;
  _this._value;
  _this._reason;
  _this._resolves = [];
  _this._rejects = [];
  _this._status = "PENDING";

  /**
   * promise then回调
   * @onFulfilled 执行成功状态的处理函数
   * @onRejected 执行失败状态处理函数
   */
  this.then = function (onFulfilled, onRejected) {
    return new Promise(function (resolve, reject) {

      /**
       * 对上一个 promise 的 then 中回调进行了处理
       * 并且调用当前的 promise 中的 resolve 方法
       */
      function handle(value) {
        var ret = _isFunction(onFulfilled) && onFulfilled(value) || value
        if (ret && _isFunction(ret['then'])) {
          ret.then(
            function (value) {
              resolve(value);
            },
            function (reason) {
              reject(reason);
            }
          )
        } else {
          resolve(ret)
        }
      }

      /**
       * 错误处理回调函数
       */
      function errback(reason) {
        reason = _isFunction(onRejected) && onRejected(reason) || reason;
        reject(reason);
      }

      /**
       * 根据当前异步状态执行操作
       */
      var config = {
        'PENDING': function () {
          _this._resolves.push(handle);
          _this._rejects.push(errback);
        },
        'FULFILLED': function () {
          handle(value);
        },
        'REJECTED': function () {
          errback(_this._reason);
        }
      }
      
      config[_this._status]()
    })
  }

  /**
   * 成功的回调函数
   * setTimeout作用是将resolve 
   * 执行回调的逻辑放置到 JS 任务队列列末尾
   * 防止then执行在resolve之前
   * @FULFILLED 状态
   * @param {*} value 
   */
  function resolve(value) {
    setTimeout(function () {
      _this.status = "FULFILLED"
      _this._resolves.forEach(function (callback) {
       _this._value = callback(value)
      })
    }, 0)
  }

  /**
   * 错误处理回调函数
   * @REJECTED 状态
   * @param {*} value 
   */
  function reject(value) {
    setTimeout(function () {
      _this._status = "REJECTED"
      _this._rejects.forEach(function (callback) {
        _this._reason = callback(value);
      })
    }, 0)
  }

  fn(resolve, reject)
}
```

### 实现Promise.all

实现Promise.all函数

```js
/**
 * Promise.all
 * 接收一个元素为 Promise 对象的数组作为参数
 * 返回一个Promise实例
 * 当这个数组里的所有promise对象都变为resolve状态的时候，才会返回
 */
Promise.all = function(promiseArr) {

  if (!Array.isArray(promiseArr)) {
    throw new TypeError('You must pass an array to all.');
  }
  // 返回 promise 实例
  return new Promise(function (resolve, reject) {
    let done = gen(promiseArr.length, resolve);
    promiseArr.forEach(function (promise, index) {
      promise.then(function (value) {
        done(index, value)
      },reject)
    })
  })
}

function gen(length, resolve) {
  let count = 0;
  let result = [];
  return function(i, value) {
    result[i] = value;
    if (++count === length) {
      resolve(result);
    }
  }
}
```


### 实现Promise.race

实现Promise.race函数

```js
/**
 * Promise.race
 * 接收一个元素为 Promise 对象的数组作为参数
 * 返回一个Promise实例
 * 只要该数组中的任意一个 Promise 对象的状态发⽣变化(无论是 resolve 还是 reject)该⽅法都会返回
 */

Promise.race = function(promiseArr) {

  if (!Array.isArray(promiseArr)) {
    throw new TypeError('You must pass an array to all.');
  }
  // 返回 promise 实例
  return new Promise(function(resolve, reject){
    promiseArr.forEach(function (promise, index) {
      promise.then(resolve,reject)
    })
  })
}

```

### 实现 catch <br/>


实现 catch 
```js
/**
 * 链式写法中可以捕获前面then中发送的异常
 */

function Promise () {
  var _this = this
  ...
  
  this.catch = function (onRejected) {
    return _this.then(null, onRejected);
  }
}
 
```


### 代码封装
经过上面的几个步骤我们基本实现了 promise 的几个重要特性，下面我们将代码整理一下


```js
/*
 * @Description: promise 
 * @Author: renbo
 * @Date: 2019-08-12 15:13:40
 * @LastEditTime: 2019-08-15 10:34:44
 */

var Promise = /** @class */ (function () {

  function Promise (fn) {

    var _this = this;
    _this._status = 'PENDING';
    _this._value = undefined;
    _this._reason = undefined;
    //存储状态
    _this._resolves = [];
    _this._rejects = [];

    // 异常处理
    if (!(typeof fn === 'function' )) {
      throw new TypeError('Promise must accept a function as a parameter');
    }
    if(!(this instanceof Promise)) return new Promise(fn);

    
   function resolve(value) {
      //由於apply參數是數組
      _this.final.apply(_this,['FULFILLED'].concat([value]));
    }

    function reject(reason){
      _this.final.apply(_this,['REJECTED'].concat([reason]));
    }
    
    fn(resolve,reject);
  }

  /**
   * 用于resolve 和 reject 
   * 异步调用，保证then是先执行的
   * @param {*} status 
   * @param {*} value 
   */
  Promise.prototype.final = function (status,value) {
    var _this = this, fn, st;
    if(_this._status !== 'PENDING') return;

    setTimeout(function(){
      _this._status = status;
      st = _this._status === 'FULFILLED'
      queue = _this[st ? '_resolves' : '_rejects'];

      while(fn = queue.shift()) {
        value = fn.call(_this, value) || value;
      }

      _this[st ? '_value' : '_reason'] = value;
      _this['_resolves'] = _this['_rejects'] = undefined;
    });
  }

  /**
   * then 
   * @params onFulfilled
   * @params onRejected
   */
  Promise.prototype.then = function (onFulfilled,onRejected) {
    var _this = this;
    // 每次返回一个promise，保证是可thenable的
    return new Promise(function(resolve,reject){
        
      function handle(value) {
        // 這一步很關鍵，只有這樣才可以將值傳遞給下一個resolve
        var ret = typeof onFulfilled === 'function' && onFulfilled(value) || value;

        //判断是不是promise 对象
        if (ret && typeof ret ['then'] == 'function') {
            ret.then(function(value) {
                resolve(value);
            }, function(reason) {
                reject(reason);
            });
        } else {
          resolve(ret);
        }
      }

      function errback(reason){
        reason = typeof onRejected === 'function' && onRejected(reason) || reason;
        reject(reason);
      }

      // 根据当前异步状态执行操作
      var config = {
        'PENDING': function () {
          _this._resolves.push(handle);
          _this._rejects.push(errback);
        },
        'FULFILLED': function () {
          handle(value);
        },
        'REJECTED': function () {
          errback(_this._reason);
        }
      }
      
      config[_this._status]()
    });
  }


  /**
   * 链式写法中可以捕获前面then中发送的异常
   */
  Promise.prototype.catch = function(onRejected){
    return this.then(undefined, onRejected)
  }


  /**
   * Promise.race
   * 接收一个元素为 Promise 对象的数组作为参数
   * 返回一个Promise实例
   * 只要该数组中的任意一个 Promise 对象的状态发⽣变化(无论是 resolve 还是 reject)该⽅法都会返回
   */

  Promise.race = function(promiseArr) {

    if (!Array.isArray(promiseArr)) {
      throw new TypeError('You must pass an array to all.');
    }
    // 返回 promise 实例
    return new Promise(function(resolve, reject){
      promiseArr.forEach(function (promise, index) {
        promise.then(resolve,reject)
      })
    })
  }


  /**
   * Promise.all
   * 接收一个元素为 Promise 对象的数组作为参数
   * 返回一个Promise实例
   * 当这个数组里的所有promise对象都变为resolve状态的时候，才会返回
   */
  Promise.all = function(promiseArr) {

    if (!Array.isArray(promiseArr)) {
      throw new TypeError('You must pass an array to all.');
    }
    // 返回 promise 实例
    return new Promise(function (resolve, reject) {
      let done = gen(promiseArr.length, resolve);
      promiseArr.forEach(function (promise, index) {
        promise.then(function (value) {
          done(index, value)
        },reject)
      })
    })

    // 判断 promise 状态是否全部 resolve
    function gen(length, resolve) {
      let count = 0;
      let result = [];
      return function(i, value) {
        result[i] = value;
        if (++count === length) {
          resolve(result);
        }
      }
    }
  }

  Promise.resolve = function(arg){
    return new Promise(function(resolve,reject){
        resolve(arg)
    })
  }

  Promise.reject = function(arg){
    return Promise(function(resolve,reject){
      reject(arg)
    })
  }

  return Promise;
}())
```
























