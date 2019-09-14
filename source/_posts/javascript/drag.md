---
title: 原生拖拽
date: 2019-4-09 22:34:09
top: false
cover: false
password:
toc: true
mathjax: false
summary: 
tags:
- JavaScript
categories:
- JavaScript
---

在实际开发中我们经常会遇到关于元素拖拽的场景，那么在我们今天实现一个简单的拖拽元素功能

### css <hr>

```css
  * {
      margin: 0;
      padding: 0;
    }

    .demo-box {
      position: absolute;
      width: 100px;
      height: 100px;
      background: #ccc;
      border: solid 1px #ccc;
      border-radius: 5px;
      line-height: 100px;
      text-align: center;
    }
```

### html<hr>

```html
  <div id="demo" class="demo-box">按住左键拖动</div>
```

### js <hr>

```js
  window.onload = function () {
    //用于确定是否是拖拽的对象
    var drag;
    //鼠标位于目标元素上的时候距离目标元素的位置
    var x, y;
    //取得元素
    var ele = document.getElementById('demo');
    /**
     *鼠标按事件
     *@param  evt 事件形参
     */
    ele.onmousedown = function (evt) {
      //取得事件对象
      _event = evt || window.event;
      //设置drag元素,计算当前位置
      _target = _event.target || _event.srcElement;
      x = _event.clientX - _target.offsetLeft;
      y = _event.clientY - _target.offsetTop;
      drag = _target;
    }
    /**
     *鼠标移动事件
     * @param evt 事件形参
     */
    document.onmousemove = function (evt) {
      //确定鼠标是在目标元素上按下去后才开始移动
      if (drag) {
        _event = evt || window.event;
        //设置边界全局变量
        var _left = _event.clientX - x;
        var _top = _event.clientY - y;
        var _windowInnerWidth = window.innerWidth;
        var _windowInnerHeight = window.innerHeight
        var _dragOffWidth = drag.offsetWidth
        var _dragOffHeight = drag.offsetHeight
        var _windowWidth = _windowInnerWidth - _dragOffWidth
        var _windowHeight = _windowInnerHeight - _dragOffHeight

        //控制拖拽物体的范围只能在浏览器视窗内，不允许出现滚动条  
        if (_left < 0) {
          _left = 0;
        } else if (_left > _windowWidth) {
          _left = _windowWidth;
        }
        if (_top < 0) {
          _top = 0;
        } else if (_top > _windowHeight) {
          _top = _windowHeight;
        }
        //设置样式
        drag.style.cursor = 'move';
        drag.style.border = 'dashed 1px red';
        drag.style.left = _left + 'px';
        drag.style.top = _top + 'px';
      }
    }

    /** 
     * 松开鼠标事件
     * @param evt 事件形参 
     */
    document.onmouseup = function (evt) {
      if (drag) {
        //卸载样式
        drag.style.cursor = '';
        drag.style.border = 'dashed 1px #ccc';
      }
      drag = null;
    }
  }
```