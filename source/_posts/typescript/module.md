---
title:  模块与命名空间
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

在 JS 中 有 module 模块机制，和 TS 类似，在 TS 中内部模块命名空间为关键字namespaces。外部模块现在只是modules

### 使用命名空间 <br/>
- 命名空间只是全局命名空间中的JavaScript对象
- 使用 namespace 关键字
- 跨多个文件，并且可以使用连接--outFile
- 不使用require关键字

**1.单文件命名空间**
  ```
  namespace Validation {
    export interface StringValidator {
      isAcceptable(s: string): boolean;
    }

    const lettersRegexp = /^[A-Za-z]+$/;
    const numberRegexp = /^[0-9]+$/;

    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }

    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
  }
  ```
**2.多文件命名空间及引入**

Validation.ts
```
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```

LettersOnlyValidator.ts
```
/// <reference path="Validation.ts" />
namespace Validation {
    const lettersRegexp = /^[A-Za-z]+$/;
    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
}
```
ZipCodeValidator.ts
```
/// <reference path="Validation.ts" />
namespace Validation {
    const numberRegexp = /^[0-9]+$/;
    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}
```
Test.ts
```
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
  for (let name in validators) {
    console.log(`"${ s }" - ${ validators[name].isAcceptable(s) ? "matches" : "does not match" } ${ name }`);
  }
}
```

涉及多个文件，我们需要确保加载所有已编译的代码。有两种方法可以做到这一点。

1. **--outFile 编译器将根据文件中存在的引用标记自动排序输出文件**
  ```
  tsc --outFile sample.js Test.ts
  ```
2. **为每一个文件编译一个 JS 文件利用 Script 按照顺序引入**
  ```
  <script src="Validation.js" type="text/javascript" />
  <script src="LettersOnlyValidator.js" type="text/javascript" />
  <script src="ZipCodeValidator.js" type="text/javascript" />
  <script src="Test.js" type="text/javascript" />
  ```

### 使用模块 <br/>
- 模块在自己的范围内执行，而不是在全局范围内执行
- 模块中声明的变量，函数，类等在模块外部不可见,除非使用其中一个export显式导出
- 模块是声明性的; 模块之间的关系是根据文件级别的导入和导出来指定的
- 模块文件之间引用用关键字 import 或被 export

**1.使用 export 关键字来导出声明**

单模块导出
```
export interface StringValidator {
  isAcceptable(s: string): boolean;
}
```

重命名导出
```
class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };
```
导出所有模块
```
export * from "./StringValidator";

export * from "./ZipCodeValidator";
```

**2.使用 import 关键字来导入声明**

从模块导入单个导出
```
import { ZipCodeValidator } from "./ZipCodeValidator";

let myValidator = new ZipCodeValidator();
```

重命名导入
```
import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";
let myValidator = new ZCV();
```

将整个模块导入单个变量，并使用它来访问模块导出
```
import * as validator from "./ZipCodeValidator";

let myValidator = new validator.ZipCodeValidator();
```

仅使用这个文件
```
import "./my-module.js";
```
**3.模块的代码生成**

编译器将为Node.js（CommonJS），require.js（AMD），UMD，SystemJS或ECMAScript 2015本机模块（ES6）模块加载系统生成适当的代码

编译 commonjs 规范
```
tsc --module commonjs Test.ts
```

编译 amd 规范
```
tsc --module amd Test.ts
```

