/*
 * @Description: promise 
 * @Author: renbo
 * @Date: 2019-08-12 15:13:40
 * @LastEditTime: 2019-08-14 18:40:10
 */

var Promise = /** @class */ (function (window, undefined) {

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
      _this.final.apply(promise,['FULFILLED'].concat([value]));
    }

    function reject(reason){
      _this.final.apply(promise,['REJECTED'].concat([reason]));
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
})(window)
