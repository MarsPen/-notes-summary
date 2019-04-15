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


/**
 * @description
 * 异步读取文件 fs.readFile
 */
fs.readFile('source/file.txt','utf8',(err,data) => {
  if (err) throw err;
  console.log(data); //data 默认读取的是二进制 使用toString() 方法转换成
  
})

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
})


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

fs.readFile('source/a.mp4', (err, data) => {
  if (err) throw err;
  // 文件写入
  fs.writeFile('b.mp4', data, (err) => {
    if (err) throw err;
    console.log('写入成功！');
  });
});

let rs = fs.createReadStream('source/a.mp4');
let ws = fs.createWriteStream('new.mp4');
re.pipe(ws);