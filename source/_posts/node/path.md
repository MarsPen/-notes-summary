---
title: path 路径操作
date: 2019-04-2 20:16:15
top: false
cover: false
password:
toc: true
mathjax: false
summary: 
tags:
- Node
categories:
- Node
---

path 模块提供用于处理文件路径和目录路径的实用工具<br/>

### path使用特点

path 模块的默认操作因 Node.js 应用程序运行所在的操作系统而异。 具体来说，当在 Windows 操作系统上运行时， path 模块将假定正在使用 Windows 风格的路径。<br/>

### 获取路径	path.dirname(p) <br/>
```js
// 引入 path 模块
const path = require('path');

// 输出 /demo/js/test.js
console.log(path.dirname('/demo/js/test.js'));

```

### 获取文件名 path.basename(p) <br/>
```js
// 引入 path 模块
const path = require('path');

/ 输出：test.js
console.log( path.basename('/demo/js/test.js') );

// 输出：test
console.log( path.basename('/demo/js/test/') );

// 输出：test
console.log( path.basename('/demo/js/test') );
```

### 获取文件扩展名 path.extname(p) <br/>
```js
// 引入 path 模块
const path = require('path');

// 输出 .js
console.log(path.extname('/demo/js/test.js'));
```

### 拼接文件路径 path.join([...paths])<br/>
```js
// 引入 path 模块
const path = require('path');

// /demo/js/test.js
console.log(path.join('/demo', 'js', 'test.js'));
```

### 获取的绝对路径/文件名 path.reslove([from ...], to)<br/>
```js
// 引入 path 模块
const path = require('path');

// 输出当前项目的绝对路径
console.log(path.reslove(''));

// 输出当前项目的绝对路径
console.log(path.reslove('.'));

// 输出 /foo/bar/baz
console.log( path.resolve('/foo/bar', './baz') );

// 输出 /baz/file
console.log(path.resolve('/foo/bar', '/baz/file/');)
```

### 获取路径字符串的对象 path.parse(p)<br/>
```js
// 引入 path 模块
const path = require('path');

path.parse('/home/user/dir/file.txt');

// 返回:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }

```

### 获取规范化路径 path.normalize(p)<br/>
```js
// 引入 path 模块
const path = require('path');

// 输出 '/foo/bar/baz/asdf'
path.normalize('/foo/bar//baz/asdf/quux/..');
```



<a href="https://nodejs.org/docs/latest-v9.x/api/path.html">其他方法请参考 Node Api </a><br/>


