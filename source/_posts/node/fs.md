---
title: fs 文件操作
date: 2019-04-1 20:16:15
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


在 node 中文件交互是非常重要的，例如文件的打开、读取、写入文件、以及与其交互等等，这其中围绕着异步模式和同步模式读取的话题。下面就 node 的 fs 文件操作模举例说明<br/>

### fs使用特点
1、同步的版本将阻塞整个进程，直到它们完成（停止所有连接）<br/>
2、异步文件系统不会阻塞程序的执行，而是在操作完成时，通过回调函数将结果返回，但是无法保证操作的的正确性和有效的顺序<br/>

### 文件写入<br/>

1. 异步文件写入<br/>

```js
// 引入 fs 模块
const fs = require('fs');

/**
 * @description
 * 异步打开文件操作 fs.open
 * 异步写入文件操作 fs.writeFile
 * 异步关闭文件操作 fs.close
 */
fs.open('file.txt', 'a', (err, fd)=>{
  if (err) throw err;
  fs.writeFile(fd, "node是很有意思的语言！", (err)=>{
    if (err) throw err;
    console.log('写入文件成功')
    fs.close(fd, (err)=>{
      if (err) throw err;
      console.log('文件以保存并关闭')
    })
  })
})
```
2. 同步写入方式<br/>
```js
// 引入模块 
const fs = require('fs');

// 打开文件 同步
var fd=fs.openSync('file.txt', 'w');

// 写入内容
fs.writeFileSync(fd,"node是很有意思的语言!"); 

// 保存并关闭
fs.closeSync(fd);
```


### 读写操作<br/>

1. 文件读写操作<br/>

```js
// 引入模块
const fs = require('fs');

/**
 * @description
 * 异步读取文件 fs.readFile
 */
fs.readFile('source/file.txt','utf8',(err,data)=>{
  if (err) throw err;
  console.log(data); //data 默认读取的是二进制 使用toString() 方法转换成
})
```

2. 图片读写操作<br/>

```js
// 引入模块
const fs = require('fs');

/**
 * @description
 * 异步读取文件 fs.readFile
 * 异步写入文件 fs.writeFile
 */
fs.readFile("source/a.jpg",(err,data) => {
  if (err) throw err;
  // 文件写入
  fs.writeFile('b.jpg', data, (err) => {
    if (err) throw err;
    console.log('写入成功！')
  })
});
```

3. 视频读写操作<br/>

```js
// 引入模块
let fs= require('fs');

/**
 * @description
 * 异步读取文件 fs.readFile
 * 异步写入文件 fs.writeFile
 * 创建文件读取流 fs.createReadStream
 * 创建文件写入流 fs.createWriteStream
 * 创建管道 fileStream.pipe
 * fs.readFile() 函数会缓冲整个文件。 
 * 为了最小化内存成本，尽可能通过 fs.createReadStream() 进行流式传输。
 */

// 方式一
fs.readFile('source/a.mp4', (err, data) => {
  if (err) throw err;
  // 文件写入
  fs.writeFile('b.mp4', data, (err) => {
    if (err) throw err;
    console.log('写入成功！');
  });
});

// 方式二
let rs = fs.createReadStream('source/a.mp4');
let ws = fs.createWriteStream('new.mp4');
re.pipe(ws);
```

4. 使用同步文件流写入操作<br/>
```js
// 引入模块
let fs= require('fs');

// 建立通道
let ws = fs.createWriteStream('file.txt')

// 打开通道
ws.once('open', () => {
    console.log('通道打开');
})

ws.once('close', () => {
    console.log('通道关闭');
})

// 写入内容
ws.write('node开始');
ws.write('node1');
ws.write('node2');
ws.write('node结束');
```

<a href="https://nodejs.org/docs/latest-v9.x/api/fs.html">其他方法请参考 Node Api </a><br/>


