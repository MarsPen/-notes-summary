// /**
//  * @description
//  * 异步打开文件操作 fs.open
//  * 异步写入文件操作 fs.writeFile
//  * 异步关闭文件操作 fs.close
//  */
// fs.open('file.txt', 'a', (err, fd)=>{
//   if (err) throw err;
//   fs.writeFile(fd, "node是很有意思的语言！", (err)=>{
//     if (err) throw err;
//     console.log('写入文件成功')
//     fs.close(fd, (err)=>{
//       if (err) throw err;
//       console.log('文件以保存并关闭')
//     })
//   })
// })


// /**
//  * @description
//  * 异步读取文件 fs.readFile
//  */
// fs.readFile('source/file.txt','utf8',(err,data) => {
//   if (err) throw err;
//   console.log(data); //data 默认读取的是二进制 使用toString() 方法转换成

// })

// /**
//  * @description
//  * 异步读取文件 fs.readFile
//  * 异步写入文件 fs.writeFile
//  */
// fs.readFile("source/a.jpg",(err,data) => {
//   if (err) throw err;
//   // 文件写入
//   fs.writeFile('b.jpg', data, (err) => {
//     if (err) throw err;
//     console.log('写入成功！')
//   })
// })


// /**
//  * @description
//  * 异步读取文件 fs.readFile
//  * 异步写入文件 fs.writeFile
//  * 创建文件读取流 fs.createReadStream
//  * 创建文件写入流 fs.createWriteStream
//  * 创建管道 fileStream.pipe
//  * fs.readFile() 函数会缓冲整个文件。 
//  * 为了最小化内存成本，尽可能通过 fs.createReadStream() 进行流式传输。
//  */

// fs.readFile('source/a.mp4', (err, data) => {
//   if (err) throw err;
//   // 文件写入
//   fs.writeFile('b.mp4', data, (err) => {
//     if (err) throw err;
//     console.log('写入成功！');
//   });
// });

// let rs = fs.createReadStream('source/a.mp4');
// let ws = fs.createWriteStream('new.mp4');
// re.pipe(ws);


// 引入 path 模块
// const path = require('path');

// console.log(path.reslove(''));


/**
 * 创建主进程
 * master
 */

// 引入核心模块http
let http = require('http');

// 创建服务
let server = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World !')
})

// 指定域名
let domain = '127.0.0.1';

// 随机创建端口
let port = Math.round((1 + Math.random()) * 1000);

// 监听启动服务
server.listen(port, domain)

let childProcess = require('child_process');
let os = require('os');
for (let i = 0; i < os.cpus().length; i++) {
  childProcess.fork('./worker.js')
}



let obj = {
  value: 20,
  fun: function () {
    this.value
  }
}

obj.fun() // 20

