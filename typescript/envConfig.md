## typeScript基础之概述和环境配置

### 什么是TypeScript？<br/>
  ts是一种的开源的编程语言，是由Microsoft主导研发。从工作机制上讲，它就像javaScript的超集。这个语言添加了可选的静态类型和基于类的面向对象编程。2012年首个版本公布


### TypeScript的特点?
  - JavaScript可以使用TypeScript。所有TypeScript代码也都转换为它的JavaScript等效代码
  - TypeScript支持其他JS库
  - TypeScript是可移植的。TypeScript可跨浏览器，设备和操作系统的移植
  - TypeScript与ECMAScript6规范一致

### 为什么要使用TypeScript？<br/>
  作为前端开发人员我们都知道，从本质上讲，JavaScript是一种自由语言，也叫弱类型的语言，它的语法规则并不是那么严格。正因为如此，我们就更容易犯错，而且，即使是在运行的时候，我们也不能找到所有的错误。鉴于此，TypeScript作为JavaScript的超集，它的语法更严格，我们在编写代码的时候就能够发现大部分错误。不仅如此，按照TypeScript官方的说法，TypeScript使得我们能够以JavaScript的方式实现自己的构思。TypeScript对面向对象的支持也非常完善，它拥有面向对象编程语言的所有特性。如果你想要获取有关TypeScript的更多信息，可以前往TypeScript的官方网站: <a href="http://www.typescriptlang.org/">TypeScript - JavaScript that scales.</a>

### TypeScript的组成部分?
  - 语言层 - 它包括语法，关键字和类型注释
  - 编译器层 - TypeScript编译器（TSC）将使用TypeScript编写的指令转换为其等效的JavaScript
  - 语言服务层 - “语言服务”在核心编译管道周围公开了一个额外的层，它是类似编辑器的应用程序。ts编译核心(core.ts,program.ts,scanner.ts,parser.ts,checker,emitter.ts)<br/>
<image src="https://github.com/MarsPen/-notes-summary/blob/master/images/ts-lang.png" width="350"></image>

### TypeScript 环境配置（本文不讨论 windows 安装过程和 mac 类似）
 - 下载并安装 node <a href="https://nodejs.org/en/">相关 node 官网</a>
 - 查看 node 是否安装成功，在命令行中执行 `node -v` 如果出现版本号则证明 node 安装成功 
 - 通过 npm 安装 typescript `npm install -g typescript` 
 - 执行 `tsc filename.ts` 编译过后默认会在当前目录产生js文件引入页面引入js文件即可







