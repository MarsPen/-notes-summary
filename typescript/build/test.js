"use strict";
var Disposable = (function () {
    function Disposable() {
    }
    Disposable.prototype.dispose = function () {
        console.log(this.isDisposed);
    };
    return Disposable;
}());
var Activatable = (function () {
    function Activatable() {
    }
    Activatable.prototype.activate = function () {
        console.log(this.isActive);
    };
    return Activatable;
}());
var SmartObject = (function () {
    function SmartObject() {
        this.isDisposed = false;
        this.isActive = false;
    }
    return SmartObject;
}());
applyMixins(SmartObject, [Disposable, Activatable]);
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
var smartObject = new SmartObject();
smartObject.dispose();
smartObject.activate();
//# sourceMappingURL=test.js.map