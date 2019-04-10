## node 网络编程

### 构建TCP服务
**什么是TCP**
 tcp全名为传输控制协议，在OSI模型中属于传输层协议如下图<br/>
 <image src='https://github.com/MarsPen/-notes-summary/blob/master/images/tcp.png'></image><br/>

 tcp是面向连接的协议，特点是在传输之前需要3次握手形成会话如下图<br/>
 <image src='https://github.com/MarsPen/-notes-summary/blob/master/images/ack.png'></image><br/>

**创建TCP服务端**
1、创建TCP服务端接受网络请求<br/>
1.1服务器事件<br/>

```
var net = require('net');
var server = net.createServer(function(socket) {
  // 开始新连接
  socket.on('data', function(data) {
    socket.write('hello');
  })

  // 断开连接
  socket.on('end', function() {
    console.log('断开连接');
  }) 
})

server.listen(8124, function() {
  console.log('server start listen port 8124 !');
});
```
通过上面代码创建为服务器事件，它是一个**EventEmitter**实例，自定义事件有一下几种<br/>
- listening 绑定的端口
- connection 连接到服务器时出发此事件
- close 服务器关闭时触发
- error 服务器发生异常时触发<br/>

1.2连接事件<br/>

```
var net = require('net');
var client = net.connect({ port: 8124 }, function () {
  console.log('client connected !');
  client.write('hello');
})

client.on('data', function (data) {
  conosle.log(data);
  client.end();
})

client.on('end', function () {
  console.log('此连接结束');
})
```
通过上面代码创建连接事件，服务器可以同时与多个客户端保持连接，对于每个连接其实都是**Stream**对象，它用于服务起端和客户端之间的通讯，自定义事件如下<br/>
- data 当一端调用write()发送数据时，另一端会触发data，事件传递的数据是write()发送的数据
- end 当连接中的任意一端发送**FIN** 数据时，触发此事件
- drain 当一端调用write()发送数据时，触发此事件
- close 当所有连接完全关闭时触发
- error 服务器发生异常时触发
- timeout 连接超时时触发

**node中 TCP默认开启Nagle算法（优化网络数据包）此算法由于要求缓冲数据达到一定数量或一定时间后才发送，所以可能会造成延迟发送**

### 构建UDP服务
**什么是UDP**
UDP用户数据包协议，和TCP一样属于网络传输层

**创建UDP服务端**
```
var dgram = require('dgram');
// 创建server对象
var server  = dgram.createSocket('udp4');
// 接到消息时，触发该事件，携带的数据为消息buffer和远程地址信息对象
server.on('message' function (msg, rinfo) {
  console.log(msg)
  console.log(rinfo)
});
// 绑定端口之后启动监听时间
server.on('listening', function () {
  var address = server.address();
  console.log(address);
});
// 绑定端口
server.bind(41234);

```
**创建UDP客户端**
```
var dgram = require('dgram');

var message = new Buffer('hello');
var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, 41234, 'localhost', function (err, bytes) {
  client.close();
})
```

### 构建HTTP服务

**什么是HTTP**

**HTTP报文**
**HTTP模块**
**HTTP请求**
**HTTP响应**
**HTTP代理**
**HTTP服务事件**


### 构建WebSocket服务

**什么是WebSocket**

**WebSocket握手**
**WebSocket数据传输**