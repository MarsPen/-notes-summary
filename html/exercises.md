# 第一部分html基础知识
 
![这是html基础思维导图](https://github.com/MarsPen/-notes-summary/blob/master/images/html.png "这是html基础思维导图")

## 基础知识概念

### 1．什么是html
  &nbsp;超文本标记语言（HyperText Markup Language），是“网页创建和其它可在网页浏览器中看到的信息”设计的一种标记语言
### 2.Doctype含义
  1. <!DOCTYPE>声明位于位于HTML文档中的第一行，告诉浏览器的解释器用什么文档标准来解析这个文档。
  2. DOCTYPE书写错误或者不存在会导致文档已兼容模式呈现。
### 3.标准模式和混杂模式
  1. 标准模式：html排版和js渲染工作模式都是以改浏览器支持的最高标准运行。
  2. 兼容模式：页面已宽松的向后兼容的方式显示，模拟老浏览器的行为。
### 4.HTML5 为什么只需要写 `<!DOCTYPE HTML>`
  &nbsp;html5不是基于SGML,所以不需要对DTD进行引用，但是它需要对文档类型声明，需要doctype来规范浏览器行为。
### 5.行内元素-块级元素-空元素
  1. css中规定每个元素都有默认的display属性和值
  -  该元素的属性的值为‘inline’的则为行内元素（如:`span,a img,input`等）
  -  该元素的属性的值为‘block’的则为块级元素（`div，ul,li h1...p`等）
  -  空（void）元素 `<br> <hr> <img> <input> <link> <meta>` 等
### 6.html语义化
  1. 定义：正确的标签做正确的事情
  2. 为什么要做语义化
  -  有利于SEO，有利于搜索引擎爬虫更好的理解我们的网页，从而获取更多的有效信息，提升网页的权重。
  -  在没有CSS的时候能够清晰的看出网页的结构，增强可读性，便于团队开发和维护。
  -  支持多终端设备的浏览器渲染。
  3. SEO
  - 汉译为搜索引擎优化。是一种方式：利用搜索引擎的规则提高网站在有关搜索引擎内的自然排名。
  - 目的：
    为网站提供生态式的自我营销解决方案，让其在行业内占据领先地位，获得品牌收益；SEO包含站外SEO和站内SEO两方面；为了从搜索引擎中获得更多的免费流量，从网站结构、内容建设方案、用户互动传播、页面等角度进行合理规划，还会使搜索引擎中显示的网站相关信息对用户来说更具有吸引力。
  - 优化方式： 
    - 内部优化：
      1. META标签优化：例如：TITLE，KEYWORDS，DESCRIPTION等的优化。
      2. 内部链接的优化，包括相关性链接（Tag标签），锚文本链接，各导航链接，及图片链接。
      3. 网站内容更新：每天保持站内的更新(主要是文章的更新等)。
    - 外部优化：
      1. 外部链接类别：友情链接、博客、论坛、B2B、新闻、分类信息、贴吧、知道、百科、站群、相关信息网等尽量保持链接的多样性。
      2. 外链运营：每天添加一定数量的外部链接，使关键词排名稳定提升。
      3. 外链选择：与一些和你网站相关性比较高,整体质量比较好的网站交换友情链接,巩固稳定关键词排名。

## 前端跨域请求解决方案

### 同源策略
  1. 概念：如果两个页面的协议，端口（如果有指定）和域名都相同，则两个页面具有相同的源。
  2. 目的：保证用户信息安全，防止恶意网站窃取数据，防止cookie共享
  3. 限制范围
   - cookie、localStorage、indexedDB无法读取
   - dom 无法获取
   - ajax不能发送
   - form表单没有限制
  4. 如何设置同源策略(host)：document.domain
  5. 不受同源策略限制：
   - 页面中的链接，重定向以及表单提交是不会受到同源策略限制的。
   - 跨域资源的引入是可以的。但是js不能读写加载的内容。如嵌入到页面中的`<script src="..."></script>，<img>，<link>，<iframe>`等。

### 跨域
  1. 概念：受到浏览器同源策略的影响，要操作其他源下面的脚本，就需要跨域。
### Ajax跨域的解决方案
  1. JSONP：网页添加一个`<script>`元素，向服务器请求JSON数据。服务器收到请求后，将数据放在一个指定名字的回调函数里传回来。
  - 缺点只支持get请求
  - 如下示例代码
  ```
    //动态创建script，用于跨越操作
    function creatScriptTag(src) {
      var script = document.createElement('script');
      script.setAttribute("type","text/javascript");
      script.src = src;
      document.body.appendChild(script);
    }
    // 调用creatScriptTag函数
    window.onload = function () {
       creatScriptTag('http://studyfe.cn?jsoncallback=result');
    }
    // 定义回调函数
    function result (data) {
      consle.log('请求成功' + data);
    }
  ```
  ```
  // php jsonp demo代码
  <?php
    header('Content-type: application/json');
    //获取回调函数名
    $jsoncallback = htmlspecialchars($_REQUEST ['jsoncallback']);
    //取数据
	  $data = [
		  'data'=>'123',
	  ];
	  $json_data = json_encode(
      array(
        'code'=>'200',
        'msg'=>'请求成功',
        'data' => $data
      ),JSON_UNESCAPED_UNICODE);
    //输出jsonp格式的数据
    echo $jsoncallback . "(" . $json_data . ")";
  ?>
  ```
  2. WebSocket:是一种通信协议，使用ws://（非加密）和wss://（加密）作为协议前缀。该协议不实行同源政策，只要服务器设置利用origin字段设置白名单，就可以通过它进行跨源通信。
  3. CORS（Cross-Origin Resource Sharing）
   - 在请求头信息中增加Origin字段，用来说明此次请求来自那个源（协议+域名+端口），此字段可以设置相应白名单
   - 必须设置`Access-Control-Allow-Origin`字段，值要求是`Origin`字段的值或者是*，*的意思是接受任意域名的请求
   - CORS请求默认不发送cookie和http认证信息，如果要发送，要在服务器端指`Access-Control-Allow-Credentials: true`,并且ajax请求必须打开withCredentials属性
   ```
   var xhr = new XMLHttpRequest();
   xhr.withCredentials = true;
   ```
   - 如果选择发送cookie,`Access-Control-Allow-Origin`字段不能设为*，必须指定明确的，与当前网页一致的域名




