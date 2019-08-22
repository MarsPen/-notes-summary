---
title: Error 异常模块
date: 2017-01-23 12:32:09
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

错误处理是所有应用程序的重要组成部分。要抛出异常，请使用 JavaScript 的 throw  关键字。在 JavaScript 中，通常使用 Error 对象和消息来表示错误<br/>

**捕获异常try/catch**<br/>
```
  function fun () {
    throw new Error("error!");
  }
  try {
    fun();
  } catch (e) {
    console.log(e.message);
  }
```

**finally关键字**<br/>

catch部分只有在抛出错误时才执行。finally部分仍然执行，尽管在try部分中抛出了任何错误<br/>

```
try { 
  throw new Error("throw error"); 
} catch (e) { 
  console.log(e.message); 
} finally { 
  console.log("不论抛出什么错误，我依然会执行"); 
} 
```

## 更多处理 Error 方法请参考
<a href='http://nodejs.cn/api/errors.html'>Node Api Error 异常模块 </a>


## node系列
<a href='https://github.com/MarsPen/-notes-summary/blob/master/node/index.md'>node 系列</a>



