// /**
//  * @description
//  * 异步打开文件操作 fs.open
//  * 异步写入文件操作 fs.writeFile
//  * 异步关闭文件操作 fs.close
//  */
// fs.open('file.txt', 'a', (err, fd)=>{
//   if (err) throw err;
//   fs.writeFile(fd, "node是很有意思的语言！", (err)=>{
//     if (err) throw err;
//     console.log('写入文件成功')
//     fs.close(fd, (err)=>{
//       if (err) throw err;
//       console.log('文件以保存并关闭')
//     })
//   })
// })


// /**
//  * @description
//  * 异步读取文件 fs.readFile
//  */
// fs.readFile('source/file.txt','utf8',(err,data) => {
//   if (err) throw err;
//   console.log(data); //data 默认读取的是二进制 使用toString() 方法转换成

// })

// /**
//  * @description
//  * 异步读取文件 fs.readFile
//  * 异步写入文件 fs.writeFile
//  */
// fs.readFile("source/a.jpg",(err,data) => {
//   if (err) throw err;
//   // 文件写入
//   fs.writeFile('b.jpg', data, (err) => {
//     if (err) throw err;
//     console.log('写入成功！')
//   })
// })


// /**
//  * @description
//  * 异步读取文件 fs.readFile
//  * 异步写入文件 fs.writeFile
//  * 创建文件读取流 fs.createReadStream
//  * 创建文件写入流 fs.createWriteStream
//  * 创建管道 fileStream.pipe
//  * fs.readFile() 函数会缓冲整个文件。 
//  * 为了最小化内存成本，尽可能通过 fs.createReadStream() 进行流式传输。
//  */

// fs.readFile('source/a.mp4', (err, data) => {
//   if (err) throw err;
//   // 文件写入
//   fs.writeFile('b.mp4', data, (err) => {
//     if (err) throw err;
//     console.log('写入成功！');
//   });
// });

// let rs = fs.createReadStream('source/a.mp4');
// let ws = fs.createWriteStream('new.mp4');
// re.pipe(ws);


// 引入 path 模块
// const path = require('path');

// console.log(path.reslove(''));


/**
 * 创建主进程
 * master
 */

// 引入核心模块http
let http = require('http');

// 创建服务
let server = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World !')
})

// 指定域名
let domain = '127.0.0.1';

// 随机创建端口
let port = Math.round((1 + Math.random()) * 1000);

// 监听启动服务
server.listen(port, domain)

let childProcess = require('child_process');
let os = require('os');
for (let i = 0; i < os.cpus().length; i++) {
  childProcess.fork('./worker.js')
}



let obj = {
  value: 20,
  fun: function () {
    this.value
  }
}

obj.fun() // 20


/**
 * 缓存封装
 * @msg 
 */
class GetCache {
  constructor() {
    let getItemKey = window.localStorage.getItem(key)
    this.plat = window.navigator.platform
    this.getKey = getItemKey == 'Win32' || getItemKey == 'MacIntel'
  }
  /**
   * 初始化方法
   */
  init() {
    return new Promise((reslove, reject) => {
      this.getKey ? reslove(this.getKey) : this.getUapReady(reject)
    })
  }
  /**
   * 配置状态码map
   * @param  {...any} args 
   */
  getStatusCode(...args) {
    xxxxx
  }
  /**
   * 处理缓存状态
   * @param {*} reject 
   */
  getUapReady(reject) {
    uap.ready(() => {
      try {
        uexCore.getH5Value(key, res => {
          getStatusCode(reject, res)
        })
      } catch (err) {
        console.err(xxxxx)
      }
    })
  }
}

/**
 * 定义构造函数
 * @param {*} name 
 * @param {*} age 
 */
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayName = function () {
  console.log(`my name is ${this.name}, I'm ${this.age} years old`);
}

Person.prototype.study = function () {
  console.log(`my name is ${this.name}, I'm learning to swim`);
}

let person = new Person(renbo, '28');
console.log(person.name)
console.log(person.sayName())

/**
 * 封装判断参数是否是函数
 * @param {*} fn 
 */
function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]';
}

/**
 * 定义构造函数
 * @param {*} fn 
 */
class NewPromise {

  constructor(fn) {

    // 判断传入参数保证参数是函数
    if (!isFunction(fn)) {
      throw new Error('NewPromise must accept a function as a parameter');
    }

    // 定义三种状态
    this._pending = 0
    this._fulfilled = 1
    this._rejected = 2

    // 初始化状态为_pending
    this._status = 0
    // 初始化传入 promise 值
    this._value = undefined

    // 执行回调函数
    try {
      fn(this.__resolve.bind(this), this.__reject.bind(this))
    } catch (err) {
      this.__reject(err)
    }
  }
  /**
   * 状态变为 resolve 时候执行的函数
   * @param {*} val 
   */
  __resolve(val) {
    if (this._status !== this._pending) return
    this._status = this._fulfilled
    this._value = val
  }

  /**
   * 状态变为 reject 时执行的函数
   * @param {*} err 
   */
  __reject(err) {
    if (this._status !== this._pending) return
    this._status = this.__reject
    this._value = err
  }
  /**
   * 添加 then 方法 
   * @param {*} onFulfilled 
   * @param {*} onRejected 
   */
  then(onFulfilled, onRejected) {

  }
  /**
   * 添加 catch 方法
   * @param {*} onRejected 
   */
  catch(onRejected) {

  }
}



'use strict';

var asap = require('asap/raw');  //micro-task 
setImmediate  // macro-task

function noop() { }

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('Promise constructor\'s argument is not a function');
  }
  this._deferredState = 0;
  this._state = 0;
  this._value = null;
  this._deferreds = null;
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._onHandle = null;
Promise._onReject = null;
Promise._noop = noop;

Promise.prototype.then = function (onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
}
function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (Promise._onHandle) {
    Promise._onHandle(self);
  }
  if (self._state === 0) {
    if (self._deferredState === 0) {
      self._deferredState = 1;
      self._deferreds = deferred;
      return;
    }
    if (self._deferredState === 1) {
      self._deferredState = 2;
      self._deferreds = [self._deferreds, deferred];
      return;
    }
    self._deferreds.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  asap(function () {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._state === 1) {
        resolve(deferred.promise, self._value);
      } else {
        reject(deferred.promise, self._value);
      }
      return;
    }
    var ret = tryCallOne(cb, self._value);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._state = 3;
      self._value = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._state = 1;
  self._value = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  if (Promise._onReject) {
    Promise._onReject(self, newValue);
  }
  finale(self);
}
function finale(self) {
  if (self._deferredState === 1) {
    handle(self, self._deferreds);
    self._deferreds = null;
  }
  if (self._deferredState === 2) {
    for (var i = 0; i < self._deferreds.length; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  });
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}