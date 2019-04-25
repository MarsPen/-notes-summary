## JS专题系列之-call和apply

谈起 call 和 apply 这两个 Function.prototype 上的方法可能很熟悉了，它在继承，改变this指针上有很多的应用场景。接下来我们简单的来重新回忆一下 call 和 apply 这两个函数的功能 <br/>

**例子一**

```
let obj = {
  value : 20
}

function fun () {
  console.log(this.value)
}

fun.call(obj) //20

```

**例子二**

```
document.getElementById( 'element' ).onclick = function(){
  let func = function(){ 
      console.log ( this ); // 指向element元素
  } 
  func.call(this);
}; 
```


**例子三**

```
function FunA (val) {
  this.value = val;
}

function FunB () {
  FunA.apply(this, arguments);
}

FunB.prototype.getValue = function () {
  return this.value
}

let funb = new FunB(20);
console.log(funb.getValue()) //20
```
经过上面的例子我们可以直观的知道call apply 的作用大部分都是用作改变this的指针。那么接下来我们来模拟 call apply 实现简单的一下这两个函数<br/>

**模拟实现第一步**<br/>

实现思路<br/>
1、将函数设为对象的属性用来改变 this 指向<br/>
2、调用对应函数<br/>
3、删除对象的函数<br/>

接下来我们改造一下例子一的函数<br/>
```
let obj = {
  value: 20,
  fun: function () {
    this.value
  }
}

obj.fun() // 20
delete obj.fun

console.log(obj) // {value: 20}
```

接下来简单的把上面的函数封装一下<br/>
```
Function.prototype.newCall = function (context) {
  context.fn = this;
  context.fn();
  delete context.fn;
}

// 通过例子一测试
let obj = {
  value : 20
}

function fun () {
  console.log(this.value)
}

fun.newCall(obj) // 20
```

**模拟实现第二步**<br/>
第一步的我们只实现了基础。没有考虑参数的情况。call，apply 的基本区别就是在参数上 call 参数数量不确定，apply 只接受两个参数。接下来我们继续优化上面的例子

1、将函数设为对象的属性用来改变 this 指向<br/>
2、调用对应函数<br/>
3、删除对象的函数<br/>
4、取出不定长的参数放到执行的函数里面<br/>

```
Function.prototype.newCall = function (context, ...args) {

  // 如果传入参数 this 为 null，则默认为当前宿主环境
  let ec = typeof window === 'object' ? window : global;

  // 防止方法冲突覆盖
  let fn = Symbol();
  context = context || ec;

  // 改变 this
  context[fn] = this;

  // 将参数放入函数内
  let result = context[fn](...args);

  // 删除对象中的函数
  delete context[fn];

  return result;
}

// 测试一下
let obj = {
  value: 1
};
function bar(name, age) {
  console.log(name);
  console.log(age);
  console.log(this.value);
}

bar.newCall(obj, 'renbo', 27); 
```

通过以上 call 的实现我们对apply的实现应该说也清楚了， 上述说过call 和 apply 的区别就在与参数上面，通过ES6实现的方法实际上 call, apply 一样<br/>

**模拟实现 apply**<br/>
```
Function.prototype.newApply = function (context, args) {
  // 如果传入参数 this 为 null，则默认为当前宿主环境
  let ec = typeof window === 'object' ? window : global;

  // 防止方法冲突覆盖
  let fn = Symbol();
  context = context || ec;

  // 改变 this
  context[fn] = this;

  // 将参数放入函数内
  let result = context[fn](...args);

  // 删除对象中的函数
  delete context[fn];

  return result;
}

// 测试一下
let obj = {
  value: 1
};
function bar(name, age) {
  console.log(name);
  console.log(age);
  console.log(this.value);
}

bar.newApply(obj, ['renbo', 27]); 
```


## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/bind.md'>JS基础系列之-bind</a>

## JS基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/index.md'>JS基础系列</a>























