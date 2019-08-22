---
title:  Mixinx
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

 一般情况下，我们已经习惯了用面向对象的继承方式，比如在 JS ES5中用 prototype， 在 ES6 和 TS 中 用extends,然而用 mixinx 也是一种通过可重用组件创建类的方式，来进行混用，混合多个类的方法到一个类上

 ### 应用例子

```
// Disposable Mixin
class Disposable {
    isDisposed!: boolean;
    dispose() {
    console.log(this.isDisposed);
    }
}

// Activatable Mixin
class Activatable {
    isActive!: boolean;
    activate() {
       console.log(this.isActive)
    }
}

// 没使用 extends 而是使用 implements
class SmartObject implements Disposable,Activatable {
    // Disposable
    isDisposed: boolean = false;
    dispose!: () => void;
    // Activatable
    isActive: boolean = false;
    activate!: () => void;
}

// mixins混入定义的类，完成全部实现部分
applyMixins(SmartObject, [Disposable, Activatable]);


// 创建 applyMixins 混用函数，作用是遍历mixins上的所有属性，并复制到目标上去，把之前的占位属性替换成真正的实现代码。
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

let smartObject = new SmartObject()

smartObject.dispose() // false
smartObject.activate() // false

```




  