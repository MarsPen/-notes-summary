## JS专题系列之-promise

本篇文章主要是实现 Promise 的原理, 具体 API 用法不在本文中做介绍。可以查看阮一峰老师的 <a href="http://es6.ruanyifeng.com/#docs/promise">ES6 Promise教程</a><br/>

实现 Promise 首先要知道它的执行特点<br/>

1. Promise 是一个构造函数，接受函数作为参数(resolve(),reject()) 
2. Promise 对象有三种状态 pending(进行中), fulfilled(成功), rejected(失败)
3. Promise 从 pending 变为 fulfilled 过程是成功的过程可以执行回调函数 resolve() 
4. Promise 从 pending 变为 rejected 过程是失败的过程可以执行回调函数 reject()
5. Promise 状态无法中途取消，一旦建立立即执行，会一直保持这个结果，这时也叫 resolved(已定型状态)
6. Promise 状态改变时 then 方法支持多次链式调用 
7. Promise 如果不设置回调函数内部会抛异常


**模拟实现第一步** <br/>
 
构造函数 Promise 必须接受函数作为参数 <br/>
1. 定义构造函数
2. 判断一个参数是否为函数

```
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
function NewPromise(fn) {
  if (!isFunction(fn)) {
    throw new Error('NewPromise must accept a function as a parameter')
  }
}
```

**模拟实现第二步** <br/>

Promise 对象有三种状态 <br/>
1. pending(进行中) 立即执行
2. 从 pending 变为 fulfilled 过程是成功的过程可以执行回调函数 resolve() 
3. 从 pending 变为 rejected 过程是失败的过程可以执行回调函数 reject()

```
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
    this._pending = '0'
    this._fulfilled = '1'
    this._rejected = '2'

    // 初始化状态
    this._status = this._pending
    // 初始化传入 promise 值
    this._value = undefined

    // 执行回调函数
    try {
      handle(this.__resolve.bind(this), this.__reject.bind(this))
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
}
```










## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/async.md'>JS基础系列之-Async</a>

## JS基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/index.md'>JS基础系列</a>























