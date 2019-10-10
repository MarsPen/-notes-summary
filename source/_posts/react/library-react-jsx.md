---
title: React 原理之 JSX 转换
date: 2019-10-01 18:06:25
top: true
cover: false
password:
toc: true
mathjax: false
summary: 
tags:
- react
categories:
- react
---

## JXS 转换

在我们写 react 组件的时候都会去写 jsx，那么 jsx 在 react 内部到底是怎么进行转换编译的呢？

### babel 转换<hr>

在进行转换编译之前，我们先来配置环境。这样方便我们查看转换后的代码。当然我们也使用 babel 去编译，但这里只是简单的说明 jsx 转换，所以不去配置 .babelrc 或者其他配置方式。

执行下面步骤

- 创建并进入文件夹
- 在终端中执行 npm init -y 
- 在终端中执行 npm install babel-cli@6 babel-preset-react-app@3
- 创建 demo.html,并写入

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
</head>

<body>
  <div id="root"></div>
  <script src="demo.js"></script>
</body>

</html>
```

- 创建 src 文件夹，在 src 文件中创建 demo.jsx，并写入

```js
function App() {
  let arr = ["zhangsan", "lisi", "wangwu"]
  return (
    <ul>
      {
        arr.map((item, index) => {
          return <li key={index} >{item}</li>
        })
      }
    </ul>
  );
}
ReactDOM.render(
  <App key="app" />,
  document.getElementById('root')
);
```
- 执行 npx babel --watch src --out-dir . --presets react-app/prod


经过 babel 编译之后的代码为

```js
function App() {
  var arr = ["zhangsan", "lisi", "wangwu"];
  return React.createElement(
    "ul",
    null,
    arr.map(function (item, index) {
      return React.createElement(
        "li",
        { key: index },
        item
      );
    })
  );
}
console.log(React.createElement(App));
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
```

上面编译完成的代码，可以看到 jsx 只是为 `React.createElement(component, props, ...children)` 方法提供的语法糖，实际上和直接写 `React.createElement（）` 等价，只是 babel 帮助我们完成了这个转换的过程

*`注意 babel 在编译时会判断 jsx 中组件的首字母，当首字母为小写时，其被认定为原生DOM标签，createElement 的第一个变量被编译为字符串，当首字母为大写时，其被认定为自定义组件，createElement 的第一个变量被编译为对象；`*

### createElement<hr/>

在进行编译的时候 jsx 主要调用了 React.createElement 函数，那么接下来我们看看这个函数的主要作用（注意本文主要依托于源码 v16.9.0 版本)， 定义在 `react/packages/react/src/React.js` 中

```js
// ...
import {
  createElement,
  createFactory,
  cloneElement,
  isValidElement,
  jsx,
} from './ReactElement';
// ...
```

找到 `react/packages/react/src/ReactElement.js` 文件中定义的 ReactElement 方法

```js

// ...
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner,
  };

  // ...
  return element;
};

export function createElement(type, config, children) {

  let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

   // 1. 处理 props
  if (config != null) {
    // ...
  }
  // 2. 获取并处理 children 节点
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    // ...
  } else if (childrenLength > 1) {
    // ...
  }
  // 3. 处理默认 props
  if (type && type.defaultProps) {
    // ...
  }

  // ...
  // 4. 返回 ReactElement 对象
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}

```
可以看到 createElement 主要的作用很简单就是将 props 和子元素进行处理之后返回一个 ReactElement 对象，下面我们分析上面三个步骤

> 1.处理 props

```js
 if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }
```

- 从 config 中取出ref，key
- 从 config 中取出 self，source
- 将除特殊属性的其他属性取出并赋值给 props


> 2.获取并处理 children 节点

```js
const childrenLength = arguments.length - 2;
if (childrenLength === 1) {
  props.children = children;
} else if (childrenLength > 1) {
  const childArray = Array(childrenLength);
  for (let i = 0; i < childrenLength; i++) {
    childArray[i] = arguments[i + 2];
  }
  if (__DEV__) {
    if (Object.freeze) {
      Object.freeze(childArray);
    }
  }
  props.children = childArray;
}
```

- 获取第二个参数后面的所有参数
- 如果只有一个子元素，直接赋值给 props.children
- 如果有多个子元素，将子元素改变为数组赋值给 props.children

> 3.处理默认 props

```js
if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
```

将组件的静态属性 defaultProps 赋值给定义的默认 props 

> 4.返回 ReactElement

可以看到 ReactElement 函数将几个参数进行重新组合，最后返回组合的对象 element，那么这几个参数的是干什么的呢？

- type：元素的类型，可以是字符串或者是函数
- key：组件的唯一标识，用于Diff算法
- ref：用于直接访问原生的 DOM
- props：组件通信的 props
- owner：维护在构建虚拟DOM过程中，随时会变动的变量的临时保存位置所在，是识别自定义组件的关键
- $$typeof： 一个 Symbol 类型的变量，防止XSS

$$typeof 在 ReactElement 中被赋值为 `REACT_ELEMENT_TYPE`，定义在 `react/packages/shared/ReactSymbols.js`

```js
const hasSymbol = typeof Symbol === 'function' && Symbol.for;

export const REACT_ELEMENT_TYPE = hasSymbol
  ? Symbol.for('react.element')
  : 0xeac7;
```

可以看到上面判断，如果当前环境支持 Symbol， 那么就是用 Symbol.for 来进行组件的标示，否则 $$typeof 被赋值为 0xeac7。至于为什么 React 开发者给出了答案：0xeac7看起来有点像 React 😄😄😄 （如果不熟悉 Symbol.for，请参考<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for">MDN</a>。）
当 React 渲染时会把没有 $$typeof 标识的以及规则校验不通过的组件过滤掉，这样就知道了 React 组件是否是有效的

```js
ReactElement.isValidElement = function (object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
};
```

### 小结<hr>

通过上述分析我们知道了 React.createElement 实际上返回的是一个特定格式的对象，这个对象大致如下

```js
{
  $$typeof: Symbol(react.element)
  key: null
  props: {}
  ref: null
  type: ƒ App()
  _owner: null
  _store: {validated: false}
  _self: null
  _source: null
  __proto__: Object
}
```

## React.Children 原理

在 createElement 方法中执行了 props.children，那它到底在那进行处理的呢？下面我们来介绍 React.Children 方法，定义在`react/packages/react/src/React.js`

```js
// ...
import {forEach, map, count, toArray, only} from './ReactChildren';

const React = {
  Children: {
    map,
    forEach,
    count,
    toArray,
    only,
  }
  // ...
};
// ...
```
### 原理流程图<hr>

React.Children.map 调度的时候创建 children 节点防⽌子节点内存抖动，由于代码量比较大所以我们来看一下流程图

<img src="/images/react-jsx-children.png">


### map <hr>

来看一下简化后的 map 代码

```js

// ...
/**
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  const result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

// ...

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  let escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  const traverseContext = getPooledTraverseContext(
    array,
    escapedPrefix,
    func,
    context,
  );
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}

// ...

export {
  forEachChildren as forEach,
  mapChildren as map,
  countChildren as count,
  onlyChild as only,
  toArray,
};
```

### contextPool <hr>

从上面的流程图能够看出调用过程和函数的作用，那么 ContextPool 的作用是什么？那么我们来看一下 getPooledTraverseContext 和 releaseTraverseContext 方法

```js
const POOL_SIZE = 10;
const traverseContextPool = [];
// 获取 contextPool 
// 实际上维护了一个 size 为 10 的缓冲池
// 如果 contextPool 中有对象, 则 pop 出一个进行使用. 如果 contextPool 为空, 则 return 一个新的对象
function getPooledTraverseContext(
  mapResult,
  keyPrefix,
  mapFunction,
  mapContext,
) {
  if (traverseContextPool.length) {
    // 复用对象
    const traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    // 第一次获取 contextPool 中的对象
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0,
    };
  }
}
// traverseContext 复用之后，进行清空操作
// 这里面有一个判断，如果 traverseContextPool 小于 10，就将 traverseContext push 到 traverseContextPool 中，进行对象的复用
function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;
  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}
```

上面提到过 React.Children.map 调度的时候创建 children 节点，防⽌子节点内存抖动。
因为每次构建新对象的时候都会复用 contextPool。会直接从 contextPool 里获取第一个对象，也就是 traverseContextPool.pop()，进行重新进行赋值。
当使用完之后调用 releaseTraverseContext 再清空这个对象，最后 push traverseContextPool（contextPool）对象中，以供下次使用。这样就完成了对内存的重复使用，防止节点内存抖动。
如果在每次构建节点的时候都重新构建对象，那么用完之后会被系统垃圾回收，这样对于内存来讲就是反复分配，释放的过程，会造成内存抖动。


### 小结 <hr>

至此, React.Children.map 就分析完了，其实 mapChildren 就是调用了 mapIntoWithKeyPrefixInternal 通过这个函数执行

```js

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  let escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  // 将 func（mapFunction） 处理函数和 上下文（mapContext）封装成一个对象 traverseContext 
  const traverseContext = getPooledTraverseContext(
    array,
    escapedPrefix,
    func,
    context,
  );
  // 深度遍历子元素, 并调用处理函数
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  // 释放 traverseContext 对象
  releaseTraverseContext(traverseContext);
}
```

## 相关链接
<a href="http://www.que01.top/2019/06/28/react-ReactCurrentOwner/">React ReactCurrentOwner</a>
<a href="http://js.walfud.com/React.Children.xxx%20%E7%9A%84%E4%BD%9C%E7%94%A8/">React.Children.xxx 的作用</a>



















































