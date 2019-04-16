## node API 之 module 模块机制

模块是Node.js 应用程序的基本组成部分，文件和模块是一一对应的。前端模块化组件化也是在这几年逐渐的流行，在 web2.0 发展过程如下<br/>


<image src="https://github.com/MarsPen/-notes-summary/blob/master/images/module.png" width="550"></image><br/>

### CommonJS 规范<br/>

CommonJS（<a href="http://www.commonjs.org">http://www.commonjs.org</a>）规范的出现解决了JavaScript 没有模块系统，标准库等等问题，而 Node.js 自身实现了 require 作为其引入模块的方法，同时 NPM 也基于 CommonJS 定义的包规范，实现了依赖管理和模块自动安装等功能。下图展现Node与浏览器以及W3C组织、CommonJS组织、ECMAScript之间的关系<br/>

<image src="https://github.com/MarsPen/-notes-summary/blob/master/images/commmonjs.png" width="550"></image><br/>

### CommonJS 模块
1、模块引用 require 关键字 <br/>
```
const math = require('math'); 
```
2、模块定义导出 exports 关键字<br/>
```
exports.area = function (r) {
    return Math.PI * r * r;
};

```
3、模块标识<br/>
模块标识其实就是传递给require()方法的参数，它必须是符合小驼峰命名的字符串，或者以.、..开头的相对路径，或者绝对路径，每个模块都有独立的空间。防止虑变量污染。<br/>

### Node 模块实现<br/>

1、引入模块三个步骤(分为核心模块和文件模块)<br/>
```
(1) 路径分析
(2) 文件定位
(3) 编译执行
```
核心模块和文件模块的区别在于加载的时机，核心模块在 Node 进程启动时被直接加载到内存中比文件模块省略了文件定位和编译执行过程<br/>


### Node 模块载入策略<br/>

1、不论是核心模块还是文件模块，require()方法对相同模块的二次加载都一律采用缓存优先，以减少二次引入时的开销<br/>
2、模块引用的过程由于标识符不同在路径分析和文件定位中有一定的差异<br/>
```
// 路径分析
核心模块，如http、fs、path等(加载最快)

.或..开始的相对路径文件模块(慢于核心模块)

以/开始的绝对路径文件模块(慢于核心模块)

自定义模块（最慢-由于沿路径向上逐级递归，直到根目录下的node_modules目录，层级越多越耗时

// 文件定位
由于其扩展名不同 Node 会按 .js、.json、.node 的次序补、足扩展名，依次尝试

调用fs模块同步阻塞式地判断文件是否存在

如果文件不是 .js 可以在加载的时候写上文件的扩展名，可以加快文件定位速度，

配合缓存，可以大幅度缓解 Node 单线程中阻塞式调用的缺陷
```
3、模块编译
```
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  if (parent && parent.children) {
    parent.children.push(this);
  }
  this.filename = null;
  this.loaded = false;
  this.children = [];
} 

对于不同的文件扩展名，其载入方法也有所不同

.js 文件
  通过fs模块同步读取文件后编译执行。在编译过程中进行了头尾包装。在头部添加了
  (function (exports, require, module, __filename, __dirname) {
    \n，在尾部添加了\n
  });。
  通过vm原生模块的runInThisContext()方法执行（类似eval，只是具有明确上下文，不污染全局），返回一个具体的
  function对象。最后，将当前模块对象的exports属性、require()方法、module（模块对象自身），
  以及在文件定位中得到的完整文件路径和文件目录作为参数传递给这个function()执行。

.node 文件。用C/C++编写的扩展文件，通过dlopen()方法加载最后编译生成的文件。
  Node调用process.dlopen()方法进行加载和执行。在Node的架构下，dlopen()方法在Windows
  和*nix平台下分别有不同的实现，通过libuv兼容层进行了封装

.json 文件。通过fs模块同步读取文件后，用JSON.parse()解析返回结果。


其余扩展名文件。它们都被当做.js文件载入。
每一个编译成功的模块都会将其文件路径作为索引缓存在Module._cache对象上，以提高二次引入的性能。
```


### Node 核心模块的编译、引入、加载过程<br/>

**模块调用栈**<br/>

1、C/C++内建模块属于最底层的模块，它属于核心模块，主要提供API给JavaScript核心模块和第三方JavaScript文件模块调用。<br/>
2、JavaScript核心模块主要扮演的职责有两类：一类是作为C/C++内建模块的封装层和桥接层，供文件模块调用；一类是纯粹的功能模块，它不需要跟底层打交道，但是又十分重要<br/>

























<a href="https://nodejs.org/docs/latest-v9.x/api/querystring.html">其他方法请参考 Node Api </a><br/>



## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/node/module.md'>node基础API-module模块</a>

## node系列
<a href='https://github.com/MarsPen/-notes-summary/blob/master/node/index.md'>node系列</a>
