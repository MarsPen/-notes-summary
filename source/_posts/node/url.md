---
title: url 
date: 2019-03-28 23:28:35
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

url模块提供用于URL解析和解析的实用程序<br/>

```
const url = require('url');
```

获取并设置URL的片段部分**url.hash**<br/>
```
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash); //#bar

myURL.hash = 'baz';
console.log(myURL.href); //https://example.org/foo#baz
```

获取并设置URL的主机部分**url.host**<br/>
```
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host);  //example.org:81
console.log(myURL.hostname) //example.org
```

获取并设置序列化url**url.href**<br/>
```
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.href);  //https://example.org:81/foo
```

获取并设置URL的路径部分**url.pathname**<br/>
```
const myURL = new URL('https://example.org:81/foo/abc?name=123');
console.log(myURL.pathname);  // /foo/abc
```

获取并设置URL的端口部分**url.port  0到65535**<br/>
```
const myURL = new URL('https://example.org:81/foo/abc?name=123');
console.log(myURL.port);  // 81
```

获取并设置URL的序列化查询部分**url.search**<br/>
```
const myURL = new URL('https://example.org:81/foo/abc?name=123');
console.log(myURL.search);  // name=123
```

获取URLSearchParams表示URL的查询参数的对象**url.serchParams**<br/>
```
const myURL = new URL('https://example.org:81/foo/abc?name=123');
console.log(myURL.searchParams);  // 123
```

<a href="https://nodejs.org/api/url.html">更多方法请参考 Node Api </a><br/>



