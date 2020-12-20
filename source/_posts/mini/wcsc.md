```js
var BASE_DEVICE_WIDTH = 750;
var isIOS = navigator.userAgent.match("iPhone");
var deviceWidth = window.screen.width || 375;
var deviceDPR = window.devicePixelRatio || 2;
var checkDeviceWidth = window.__checkDeviceWidth__ ||
function() {
    var newDeviceWidth = window.screen.width || 375
    var newDeviceDPR = window.devicePixelRatio || 2
    var newDeviceHeight = window.screen.height || 375
    if (window.screen.orientation && /^landscape/.test(window.screen.orientation.type || '')) newDeviceWidth = newDeviceHeight
    if (newDeviceWidth !== deviceWidth || newDeviceDPR !== deviceDPR) {
        deviceWidth = newDeviceWidth deviceDPR = newDeviceDPR
    }
}
checkDeviceWidth() var eps = 1e-4;
var transformRPX = window.__transformRpx__ ||
function(number, newDeviceWidth) {
    if (number === 0) return 0;
    number = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
    number = Math.floor(number + eps);
    if (number === 0) {
        if (deviceDPR === 1 || !isIOS) {
            return 1;
        } else {
            return 0.5;
        }
    }
    return number;
}
var setCssToHead = function(file, _xcInvalid, info) {
    var Ca = {};
    var css_id;
    var info = info || {};
    var _C = [];
    function makeup(file, opt) {
        var _n = typeof(file) === "number";
        if (_n && Ca.hasOwnProperty(file)) return "";
        if (_n) Ca[file] = 1;
        var ex = _n ? _C[file] : file;
        var res = "";
        for (var i = ex.length - 1; i >= 0; i--) {
            var content = ex[i];
            if (typeof(content) === "object") {
                var op = content[0];
                if (op == 0) res = transformRPX(content[1], opt.deviceWidth) + "px" + res;
                else if (op == 1) res = opt.suffix + res;
                else if (op == 2) res = makeup(content[1], opt) + res;
            } else res = content + res
        }
        return res;
    }
    var rewritor = function(suffix, opt, style) {
        opt = opt || {};
        suffix = suffix || "";
        opt.suffix = suffix;
        if (opt.allowIllegalSelector != undefined && _xcInvalid != undefined) {
            if (opt.allowIllegalSelector) console.warn("For developer:" + _xcInvalid);
            else {
                console.error(_xcInvalid + "This wxss file is ignored.");
                return;
            }
        }
        Ca = {};
        css = makeup(file, opt);
        if (!style) {
            var head = document.head || document.getElementsByTagName('head')[0];
            window.__rpxRecalculatingFuncs__ = window.__rpxRecalculatingFuncs__ || [];
            style = document.createElement('style');
            style.type = 'text/css';
            style.setAttribute("wxss:path", info.path);
            head.appendChild(style);
            window.__rpxRecalculatingFuncs__.push(function(size) {
                opt.deviceWidth = size.width;
                rewritor(suffix, opt, style);
            });
        }
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            if (style.childNodes.length == 0) style.appendChild(document.createTextNode(css));
            else style.childNodes[0].nodeValue = css;
        }
    }
    return rewritor;
}
setCssToHead([])();
setCssToHead([], undefined, {
    path: "./app.wxss"
})();;
var wxssMap = {
    './app.wxss': setCssToHead([], undefined, {
        path: "./app.wxss"
    }),
};
return function(filePath) {
    return wxssMap[filePath];
};
```
