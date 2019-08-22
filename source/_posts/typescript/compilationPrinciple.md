---
title: TypeScript编译原理
date: 2017-01-23 12:32:09
top: false
cover: false
password:
toc: true
mathjax: false
summary: 
tags:
- TypeScript
categories:
- TypeScript
---


TypeScript 编译器源文件位于 <a href="https://github.com/Microsoft/TypeScript/tree/master/src/compiler">src/compiler </a> 目录下

主要的应用文件

<image src="https://github.com/MarsPen/-notes-summary/blob/master/images/TypeScript 编译原理.png" />


### 编译器的大概工作流

```
SourceCode（源码） ~~ 扫描器 ~~> Token 流
```

```
Token 流 ~~ 解析器 ~~> AST（抽象语法树）
```

```
AST ~~ 绑定器 ~~> Symbols（符号）
```

```
AST + 符号 ~~ 检查器 ~~> 类型验证
```

```
AST + 检查器 ~~ 发射器 ~~> JavaScript 代码
```



## TypeScript基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/typescript/index.md'>TypeScript基础</a>


