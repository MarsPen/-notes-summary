## node 网络编程

### 构建TCP服务<br/>
 tcp全名为传输控制协议，在OSI模型中属于传输层协议如下图<br/>
 <image src='https://github.com/MarsPen/-notes-summary/blob/master/images/tcp.png' width="500px"></image><br/>

 tcp是面向连接的协议，特点是在传输之前需要3次握手形成会话如下图<br/>
 <image src='https://github.com/MarsPen/-notes-summary/blob/master/images/ack.png' width="500px"></image><br/>

**创建TCP服务端**<br/>
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

### 构建UDP服务<br/>
UDP用户数据包协议，和TCP一样属于网络传输层<br/>

**创建UDP服务端**<br/>
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
**创建UDP客户端**<br/>
```
var dgram = require('dgram');

var message = new Buffer('hello');
var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, 41234, 'localhost', function (err, bytes) {
  client.close();
})
```

### 构建HTTP服务<br/>

HTTP是超文本传输协议，是构建在TCP之上的，属于应用层协议，在HTTP的两端是服务端和浏览器也就是B/S模式<br/>

**HTTP报文**<br/>
我们可以在命令行利用curl -v http://localhost:8080/ 来模拟请求，产生如下报文信息<br/>

第一部分其实就是标准的TCP3次握手过程<br/>
```
* About to connect() to localhost (127.0.0.1) port 8080 (#0)
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8080 (#0)
```

第二部分在握手完成之后，客户端向服务端发送的请求报文<br/>
```
> GET / HTTP/1.1
> Host: 127.0.0.1:8080
> User-Agent: curl/7.54.0
> Accept: */*
>
```

第三部分是服务端处理结束后，向客户端发送的响应内容包括响应头和响应体<br/>
```
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Accept-Ranges: bytes
< Content-Type: text/html; charset=UTF-8
< Content-Length: 820
< ETag: W/"334-dKswJvgc24O5QPXd939SLJD+BhM"
< Date: Thu, 11 Apr 2019 10:33:03 GMT
< Connection: keep-alive
<
hello
```

第四部分是结束此会话<br/>
```
* Connection #0 to host 127.0.0.1 left intact
* Closing connection #0
```

通过上面的信息中我们可以看出虽然是基于 TCP，但是本身确实基于请求响应式的，一问一答模式并不是会话模式。<br/>

**HTTP模块**<br/>

node http 模块承继 tcp 服务器（ net 模块）它能够与多个客户端保持连接，采用事件驱动，不会为每个连接创建额外的线程或进程。占用内存低，所以能实现高并发，tcp 服务以connection进行服务，http以request进行服务。node http 模块将connection和request进行封装<br/>
<image src='https://github.com/MarsPen/-notes-summary/blob/master/images/request.png' width="500px"></image><br/>

http模块将所有读写抽象为ServerRequest和ServerResponse对象<br/>
<image src='https://github.com/MarsPen/-notes-summary/blob/master/images/http.png' width="500px"></image><br/>

**HTTP代理**<br/>

http 提供的 ClientRequest 是基于 tcp 层实现的，在keepalive情况下，一个底层会话能够连接多个请求。<br/>
http 模块包含一个默认的客户端代理对象http.globalAgent<br/>
通过 ClientRequest 对象对用一个服务器发起的 http 最多可以创建5个连接，实际上是一个连接池。如果 http 客户端同时对一个服务器发起超过5个请求，其实也只有5个处于并发状态。<br/>
<image src='https://github.com/MarsPen/-notes-summary/blob/master/images/http代理.png' width="500px"></image><br/>
```
// 可以通过http.Agent修改连接数量，但连接数量过大会影响服务器性能
var agent = new http.Agent({
  maxSockets: 10
})
var option = {
  hostname: '127.0.0.1',
  port: 1334,
  path: '/',
  method: 'GET',
  agent: agent
}
```

### 构建WebSocket服务

**WebSocket握手**<br/>
**WebSocket数据传输**<br/>