/*
 * @Description: promise 
 * @Author: renbo
 * @Date: 2019-08-12 15:13:40
 * @LastEditTime: 2019-08-15 17:48:24
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


var debounce = /** @class */ (function () {
  /**
   * @desc 函数防抖
   * @param {*} func 回调函数
   * @param {*} wait 延迟执行毫秒数
   * @param {*} immediate  true 表立即执行，false 表非立即执行
   */
  function debounce(func, wait, immediate) {

    // 创建一个标记用来存放定时器的返回值
    var timeout = null,result= null;
    
    return function () {

      // 指定this 作用域
      var context = this;
      // event 对象
      var args = arguments;

      // 当用户点击/输入的时候，清除上一个定时器
      if (timeout) clearTimeout(timeout);
      
      if (immediate) {
        // 如果已经执行过，将不再执行
        var callNow = !timeout;
        timeout = setTimeout(function(){
          timeout = null;
        }, wait)
        
        if (callNow) func.apply(context, args)
      }
      else {
        
        timeout = setTimeout(function(){
          func.apply(context, args)
        }, wait);
      }

      return result;
    }
  }

  return debounce;
  
}())

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




