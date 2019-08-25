---
title: 声明文件
date:  2019-6-20 18:20:27
top: false
cover: false
password:
toc: true
mathjax: false
summary: 
tags:
- TypeScript
categories:
- TypeScript
---

## 声明文件

### 识别库的类型

全局库(全局命名空间下能访问)

- 顶级的var语句或function声明
- 一个或多个赋值语句到window上
- 假设DOM原始值像document或window是存在的

```
<script src="jquery.js"></script>

window.test = function(){
    console.log('1111')
}

```

模块化库（只能工作在模块加载器的环境下）

- 无条件的调用require或define
- 像import * as a from 'b'; or export c;这样的声明
- 赋值给exports或module.exports
 
UMD模块是指那些既可以作为模块使用（通过导入）又可以作为全局（在没有模块加载器的环境里）使用的模块

```
import moment = require("moment");
console.log(moment.format());

```
在浏览器环境内也可以这样使用

```
console.log(moment.format());
```

识别UMD库
```
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["libName"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("libName"));
    } else {
        root.returnExports = factory(root.libName);
    }
}(this, function (b) {}))
```

### 使用依赖

依赖全局库
```
/// <reference types="someLib" />

function getThing(): someLib.thing;
```

依赖模块
```
import * as moment from "moment";

function getThing(): moment;
```

依赖UMD库
```
// <reference types="moment" />

function getThing(): moment;
```

如果你的模块或UMD库依赖于一个UMD库

不要使用/// <reference指令去声明UMD库的依赖！
```
import * as someLib from 'someLib';

```

### 防止命名冲突

在书写全局声明文件时，使用库定义的全局变量名来声明命名空间类型
```
declare namespace cats {
    interface KittySettings { }
}
```


### 定义全局库模版

模版文件<a href="global.d.ts.md"> global.d.ts </a>定义了myLib库作为例子

### 定义模块化库模版

针对模块有三种可用的模块， module.d.ts, module-class.d.ts and module-fun

<a href="module.d.ts.md"> module.d.ts </a> 作为函数调用
```
var x = require("foo");
// Note: calling 'x' as a function
var y = x(42);

```

<a href="module-class.d.ts.md" >module-class.d.ts </a>使用new来构造调用
```
var x = require("bar");
// Note: using 'new' operator on the imported variable
var y = new x("hello");

```

如果模块不能被调用或构造，使用<a href="module.d.ts.md"> module.d.ts </a>文件

### 使用库

在TypeScript 2.0以上的版本，获取类型声明文件只需要使用npm。

```
npm install --save @types/lodash

import * as _ from "lodash";

_.padStart("Hello TypeScript!", 20, " ");
```

如果npm包没有包含它的声明文件，那就必须下载相应的@types包

大多数类型声明包的名字总是与它们在npm上的包的名字相同，但是有@types/前缀

查找更多typeScript 库请前往 <a href="https://aka.ms/types">https://aka.ms/types</a>



