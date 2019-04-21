## node API 之 crypto 加密模块

crypto 模块也是核心模块之一，提供了加密功能，包括对 OpenSSL 的哈希、HMAC、加密、解密、签名、以及验证功能的一整套封装。上文中提到过核心 C/C++ 模块运行速度比其他模块要快。<br/>

**MD5和SHA1**<br/>
MD5是一种常用的哈希算法，用于给任意数据一个“签名”。这个签名通常用一个十六进制的字符串表示：<br/>

```
// 引入加密模块
const crypto = require('crypto');

// 创建 Hash 实例
const hash = crypto.createHash('md5');

// 计算后的HMAC摘要 update() 方法默认字符串编码为UTF-8，也可以传入Buffer
hash.update('Hello, nodejs!');

// encoding 值可以是 'hex', 'latin1' 或者 'base64'. 
  如果encoding 是字符串会被直接返回，其它情况会返回一个 a Buffer.
console.log(hash.digest('hex'));

Hash 对象在 hash.digest() 方法调用之后不能再次被使用。多次的调用会引发错误并抛出

```

**Hmac**<br/>
Hmac算法也是一种哈希算法，它可以利用MD5或SHA1等哈希算法。不同的是，Hmac还需要一个密钥：<br/>

```
// 引入加密模块
const crypto = require('crypto');

// 创建 hmac 实例
const hmac = crypto.createHmac('sha256', 'secret-key');

// 计算后的HMAC摘要 update() 方法默认字符串编码为UTF-8，也可以传入Buffer
hmac.update('Hello, nodejs!');

// encoding 值可以是 'hex', 'latin1' 或者 'base64'. 
  如果encoding 是字符串会被直接返回，其它情况会返回一个 a Buffer.
console.log(hmac.digest('hex'));

只要密钥发生了变化，那么同样的输入数据也会得到不同的签名，因此，可以把Hmac理解为用随机数“增强”的哈希算法
```

**AES**<br/>
AES是一种常用的对称加密算法，加解密都用同一个密钥。crypto模块提供了AES支持，但是需要自己封装好函数，便于使用：<br/>

```
// 引入加密模块
const crypto = require('crypto');
// 加密函数
function aesEncrypt(data, key) {
  const cipher = crypto.createCipher('aes192', key);
  let crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}
// 解密函数
function aesDecrypt(encrypted, key) {
  const decipher = crypto.createDecipher('aes192', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

let data = 'Hello, this is a secret message!';
let key = 'Password!';
let encrypted = aesEncrypt(data, key);
let decrypted = aesDecrypt(encrypted, key);

console.log('Plain text: ' + data);
console.log('Encrypted text: ' + encrypted);
console.log('Decrypted text: ' + decrypted);
```
运行结果如下：<br/>
```
Plain text: Hello, this is a secret message!
Encrypted text: 8a944d97bdabc157a5b7a40cb180e7...
Decrypted text: Hello, this is a secret message!
```

**Diffie-Hellman**<br/>

DH算法是一种密钥交换协议，它可以让双方在不泄漏密钥的情况下协商出一个密钥来。DH算法基于离散对数数学原理<br/>

```
// 引入加密模块
const crypto = require('crypto');

// 进行加密交换 crypto_a
let crypto_a = crypto.createDiffieHellman(512);
let crypto_a_keys = crypto_a.generateKeys();


let prime = crypto_a.getPrime();
let generator = crypto_a.getGenerator();

console.log('Prime: ' + prime.toString('hex'));
console.log('Generator: ' + generator.toString('hex'));


// 进行加密交换 crypto_b
let crypto_b = crypto.createDiffieHellman(prime, generator);
let crypto_b_keys = crypto_b.generateKeys();


// 交换生成密钥
let a_secret = crypto_a.computeSecret(crypto_b_keys);
let b_secret = crypto_b.computeSecret(crypto_a_keys);

```

**RSA**

RSA算法是一种非对称加密算法，即由一个私钥和一个公钥构成的密钥对，通过私钥加密，公钥解密，或者通过公钥加密，私钥解密。其中，公钥可以公开，私钥必须保密<br/>

1、生成一个RSA密钥对：<br/>
```
openssl genrsa -aes256 -out rsa-key.pem 2048
```
2、通过上面的rsa-key.pem加密文件，导出原始的私钥<br/>
```
openssl rsa -in rsa-key.pem -outform PEM -out rsa-prv.pem
```
3、命令导出原始的公钥<br/>
```
openssl rsa -in rsa-key.pem -outform PEM -pubout -out rsa-pub.pem
这样，我们就准备好了原始私钥文件rsa-prv.pem和原始公钥文件rsa-pub.pem，编码格式均为PEM
```


使用crypto模块提供的方法，即可实现非对称加解密<br/>

```
const fs = require('fs');
const crypto = require('crypto');

// 从文件加载key:
function loadKey(file) {
  // key实际上就是PEM编码的字符串:
  return fs.readFileSync(file, 'utf8');
}

let prvKey = loadKey('./rsa-prv.pem');
let pubKey = loadKey('./rsa-pub.pem');
let message = 'Hello, world!';

// 使用私钥加密:
let enc_by_prv = crypto.privateEncrypt(prvKey, Buffer.from(message, 'utf8'));
console.log('encrypted by private key: ' + enc_by_prv.toString('hex'));


let dec_by_pub = crypto.publicDecrypt(pubKey, enc_by_prv);
console.log('decrypted by public key: ' + dec_by_pub.toString('utf8'));


执行后，可以得到解密后的消息，与原始消息相同。

接下来我们使用公钥加密，私钥解密：

// 使用公钥加密:
let enc_by_pub = crypto.publicEncrypt(pubKey, Buffer.from(message, 'utf8'));
console.log('encrypted by public key: ' + enc_by_pub.toString('hex'));

// 使用私钥解密:
let dec_by_prv = crypto.privateDecrypt(prvKey, enc_by_pub);
console.log('decrypted by private key: ' + dec_by_prv.toString('utf8'));
执行得到的解密后的消息仍与原始消息相同。

```

**证书**
crypto模块也可以处理数字证书。数字证书通常用在SSL连接，也就是Web的https连接。一般情况下，https连接只需要处理服务器端的单向认证，如无特殊需求（例如自己作为Root给客户发认证证书），建议用反向代理服务器如Nginx等Web服务器去处理证书。<br/>


## 更多参考<br/>
<a href='https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001434501504929883d11d84a1541c6907eefd792c0da51000'>廖雪峰老师的Crypto</a>

<a href='http://nodejs.cn/api/crypto.html'>Node Api crypto 加密模块 </a>



## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/node/event.md'>node 基础API-事件驱动模型</a>

## node系列
<a href='https://github.com/MarsPen/-notes-summary/blob/master/node/index.md'>node 系列</a>