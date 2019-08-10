/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-31 15:40:44
 * @LastEditTime: 2019-08-09 17:24:00
 * @LastEditors: Please set LastEditors
 */
// Disposable Mixin
var Disposable = /** @class */ (function () {
    function Disposable() {
    }
    Disposable.prototype.dispose = function () {
        console.log(this.isDisposed);
    };
    return Disposable;
}());
// Activatable Mixin
var Activatable = /** @class */ (function () {
    function Activatable() {
    }
    Activatable.prototype.activate = function () {
        console.log(this.isActive);
    };
    return Activatable;
}());
// 没使用 extends 而是使用 implements
var SmartObject = /** @class */ (function () {
    function SmartObject() {
        // Disposable
        this.isDisposed = false;
        // Activatable
        this.isActive = false;
    }
    return SmartObject;
}());
// mixins混入定义的类，完成全部实现部分
applyMixins(SmartObject, [Disposable, Activatable]);
// 创建 applyMixins 混用函数，作用是遍历mixins上的所有属性，并复制到目标上去，把之前的占位属性替换成真正的实现代码。
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
var smartObject = new SmartObject();
smartObject.dispose(); // false
smartObject.activate(); // false



