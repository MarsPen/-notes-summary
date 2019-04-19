## node API 之 module 模块机制

模块是Node.js 应用程序的基本组成部分，文件和模块是一一对应的。前端模块化组件化也是在这几年逐渐的流行，在 web2.0 发展过程如下<br/>


<image src="https://github.com/MarsPen/-notes-summary/blob/master/images/module.png" width="300"></image><br/>

### CommonJS 规范<br/>

CommonJS（<a href="http://www.commonjs.org">http://www.commonjs.org</a>）规范的出现解决了JavaScript 没有模块系统，标准库等等问题，而 Node.js 自身实现了 require 作为其引入模块的方法，同时 NPM 也基于 CommonJS 定义的包规范，实现了依赖管理和模块自动安装等功能。下图展现Node与浏览器以及W3C组织、CommonJS组织、ECMAScript之间的关系<br/>

<image src="https://github.com/MarsPen/-notes-summary/blob/master/images/commonjs.png" width="550"></image><br/>

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

<image src="https://github.com/MarsPen/-notes-summary/blob/master/images/module-p.png" width="350"></image><br/>


**核心模块调用流程**<br/>

1、 JavaScript 核心模块编译过程<br/>
  - 转存为转存为C/C++代码（Node采用了V8附带的js2c.py工具，将所有内置的JavaScript代码（src/node.js和lib/*.js）转换成C++里的数组，生成node_natives.h头文件，以字符串的形式存储在 node 的命令空间中）<br/>
  - 启动 node 进程 JavaScript 代码直接加载进内存中<br/>
  - 编译 JavaScript 核心模块（lib目录下的所有模块文件也没有定义require、module、exports这些变量。上面说过在引入 JavaScript 核心模块过程进行头尾包装，才可以执行exports对象）<br/>

  ```
  // node_natives.h 头文件代码
  namespace node {
    const char node_native[] = { 47, 47, ..};
    const char dgram_native[] = { 47, 47, ..};
    const char console_native[] = { 47, 47, ..};
    const char buffer_native[] = { 47, 47, ..};
    const char querystring_native[] = { 47, 47, ..};
    const char punycode_native[] = { 47, 42, ..};
    ...
    struct _native {
      const char* name;
      const char* source;
      size_t source_len;
    };
    static const struct _native natives[] = {
      { "node", node_native, sizeof(node_native)-1 },
      { "dgram", dgram_native, sizeof(dgram_native)-1 },
      ...
    };
  }

  // JavaScript 核心模块通过process.binding('natives')取出，编译成功的模块缓存到 NativeModule._cache 对象上，文件模块则缓存到 Module._cache 对象上
  function NativeModule(id) {
    this.filename = id + '.js';
    this.id = id;
    this.exports = {};
    this.loaded = false;
  }
  NativeModule._source = process.binding('natives');
  NativeModule._cache = {}; 
  ```

2、 C/C++核心模块的编译过程<br/>
   - 定义内建模块内部结构
   - 通过NODE_MODULE宏将模块定义到node命名空间中，模块的具体初始化方法挂载为结构的register_func成员<br/>
   - node_extensions.h文件将这些散列的内建模块统一放进了一个叫node_module_list的数组中<br/>
   - Node 通过 get_builtin_module() 方法从 node_module_list 数组中取出这些模块<br/>
  ```
  // 内建模块的内部结构定义
  struct node_module_struct {
    int version;
    void *dso_handle;
    const char *filename;
    void (*register_func) (v8::Handle<v8::Object> target);
    const char *modname;
  };

  // 挂载为结构的register_func成员
  #define NODE_MODULE(modname, regfunc) 
    extern "C" { 
      NODE_MODULE_EXPORT node::node_module_struct modname ## _module = 
      { 
        NODE_STANDARD_MODULE_STUFF, 
        regfunc, 
        NODE_STRINGIFY(modname) 
      }; 
    } 
  ```

3、核心模块的引入流程<br/>
如 os 原生模块的引入流程<br/>
<image src="https://github.com/MarsPen/-notes-summary/blob/master/images/module-os.png" width="350"></image><br/>

通过以上我们大致了解了 Node 中模块的编译、加载、引入流程。当然还有核心模块的编写，在这里就不过多的阐述了。更多请参考朴灵老师编著的《深入浅出 node》，相信会有更多的收获。<br/>

## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/node/crypto.md'>node基础API-crypto加密模块</a>

## node系列
<a href='https://github.com/MarsPen/-notes-summary/blob/master/node/index.md'>node系列</a>
