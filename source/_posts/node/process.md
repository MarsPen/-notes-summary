---
title: process进程 
date: 2019-04-12 20:35:12
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

process 对象是一个全局变量，它提供有关当前 Node.js 进程的信息并对其进行控制。 作为一个全局变量，它始终可供 Node.js 应用程序使用，无需使用 require()<br/>

上文中提到过事件队列调度可以通过process的.nextTick()来实现<br/>

上述文章中说到过 Node 是单进程单线程架构，对多核使用不足，所以启动多进程。每个进程一个 CPU 以此实现多核 CPU 的利用<br/>

**Master-Worker模式（主从模式）**

主从模式主要用于在分布式架构中并行处理业务的模式，具备良好的可伸缩性和稳定性，主进程（master）负责和管理工作进程（worker），工作进程（worker）负责具体的业务逻辑<br/>

<img src="/images/master-worker.png"><br/>

```
/**
 * 创建工作进程
 * worker.js
 */

// 引入核心模块http
let http = require('http');

// 创建服务
let server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type' : 'text/plain'});
  res.end('Hello World !')
})

// 指定域名
let domain = '127.0.0.1';

// 随机创建端口
let port = Math.round((1 + Math.random()) * 1000);

// 监听启动服务
server.listen(port, domain)
```

```
/**
 * 创建主进程
 * master.js
 */

// 引入核心模块child_process 创建子进程
let childProcess = require('child_process');

引入核心模块os，得到cpu数量
let cpus = require('os').cpus();

// 根据cpu数量取复制对应的 node 的进程数量
for (let i = 0; i < cpus.length; i++) {
  childProcess.fork('./worker.js')
}

```


**进程间通信**<br/>

说起进程通信，其实我们都熟悉浏览器的 Javascript 主线程与 UI 渲染，共用一个线程。两个是互斥关系，当 UI 渲染时Js引擎线程暂时挂起。所以为了解决这个问题 HTML5 提出WebWork API 主线程与工作线程之间通过onmessage()和postMessage()进行通讯，使 JS 阻塞较为严重的计算不影响主线程上的UI渲染<br/>

在 node 中为了实现父子进程通讯，父子之间将会创建IPC通道，通过IPC通道，父子进程才能通过message和send()传递函数<br/>

IPC原理创建实现示意图<br/>

<img src="/images/ipc.png"><br/>


IPC通道创建、连接<br/>

1、父进程在实际创建子进程之前，首先创建IPC通道并监听，然后在创建子进程<br/>
2、通过环境变量（NODE_CHAMMEL_FD）通知子进程 IPC 通道的文件描述符<br/>
3、子进程启动过程中通过文件描述符连接已经存在的 IPC 通道<br/>
4、建立连接后就可以在内核中完成双向通信，不经过网络层<br/>
5、在 Node 中，IPC 被抽象成为 Stream 对象，调用 send（）发送数据，通过 message 事件接收数据<br/>

<img src="/images/ipc-create.png"><br/>

```
/**
 * 创建父线程
 * master.js
 */

// 引入核心模块child_process 创建子进程
let childProcess = require('child_process');

// 复制进程
let n = childProcess.fork(__dirname + '/worker.js');

// 监听message
n.on('messge', function (m) {
  console.log(m)
})

// 发送数据
n.send({hello: ''world});
```

```
/**
 * 创建子线程
 * worker.js
 */

// 监听message
process.on('message', function (m) {
  console.log(m)
});
// 发送数据
process.send({foo: 'bar'});
```

**句柄传递**<br/>

通过上述我们简单的了解到进程之间通信原理，但是我们想要通过监听一个端口，主进程将所有的请求交由子进程处理，上述通信远远不够的，所以可以通过 **Node句柄传递** 来实现<br/>

主进程将请求发送给工作进程<br/>

<img src="/images/process-send.png"><br/>

主进程发送完句柄并关闭监听<br/>

<img src="/images/process-on.png"><br/>

```
/**
 * 创建主进程
 * master.js
 */

// 引入核心模块child_process 创建子进程
let cp = require('child_process');

// 复制进程
let child1 = cp.fork(__dirname + '/worker.js');
let child2 = cp.fork(__dirname + '/worker.js');

// 打开服务使用得服务对象发送数据
let server = require('net').createServer();
server.listen(1337 ,function () {
  child1.send('server', server);
  child2.send('server', server);
  
  // 主进程发送完成句柄关闭监听
  server.close();
});
```

```
/**
 * 创建子进程
 * worker.js
 */
 
// 引入核心模块http
let http = require('http');

// 创建服务
let server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type' : 'text/plain'});
  res.end('pid is' + process.pid)
});

// 子进程监听端口
process.on('message', function (m, tcp) {
  if (m === 'server') {
    tcp.on('connection', function (socket) {
      server.emit('connection', socket);
    });
  }
}};

```

通过上述几个例子我们基本基本了解 Node 的进程。当然还有很多需要在事件中摸索例如集群的稳定，包括自动重启，负载均衡，状态共享等等。当然创建 Node 集群也可以用cluster模块，实现起来更轻松方便<br/>


## 更多方法参考<br/>
<a href='http://nodejs.cn/api/process.html'>Node Api process</a><br/>
<a href='http://nodejs.cn/api/child_process.html'>Node Api child_process</a><br/>
<a href='http://nodejs.cn/api/cluster.html'>Node Api cluster</a><br/>
















