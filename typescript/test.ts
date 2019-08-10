/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-31 15:40:44
 * @LastEditTime: 2019-08-09 17:24:00
 * @LastEditors: Please set LastEditors
 */

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
class SmartObject implements Disposable, Activatable {
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
