---
title: querystring 路径操作 
date: 2019-04-4 22:17:12
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

querystring 模块提供用于解析和格式化 URL 查询字符串<br/>

### 解析 URL 字符串 querystring.parse(str[, sep[, eq[, options]]]) <br/>
```js
// 引入模块
const querystring = require('querystring');

querystring.parse('foo=bar&abc=xyz&abc=123')

输出为：
{
  foo: 'bar',
  abc: ['xyz', '123']
}
```

默认情况下，将假定查询字符串中的百分比编码字符使用 UTF-8 编码。 如果使用其他字符编码，则需要指定其他 decodeURIComponent 选项：<br/>

```js
// 假设 gbkEncodeURIComponent 函数已存在。

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null,{ decodeURIComponent: gbkDecodeURIComponent });
```


### 序列化 URL 字符串 querystring.stringify(obj[, sep[, eq[, options]]]) <br/>

```js
// 引入模块
const querystring = require('querystring');

// 输出为 'foo=bar&baz=qux&baz=quux&corge='
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });

// 输出为 'foo:bar;baz:qux'
querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
```

默认情况下，查询字符串中需要百分比编码的字符将编码为 UTF-8。 如果需要其他编码，则需要指定其他 encodeURIComponent 选项：

```js
// 假设 gbkEncodeURIComponent 函数已存在。

querystring.stringify({ w: '中文', foo: 'bar' }, null, null,{ encodeURIComponent: gbkEncodeURIComponent })
```



<a href="https://nodejs.org/docs/latest-v9.x/api/querystring.html">其他方法请参考 Node Api </a><br/>

