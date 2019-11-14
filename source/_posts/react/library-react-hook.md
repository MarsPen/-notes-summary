---
title: React 原理之 hook
date: 2019-11-09 19:12:35
top: false
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

### 什么是 hook<hr>
hook 意为钩子，当代码执行特定的时期时会自动调用 hook 中的代码和生命周期类似。

### 解决的问题<hr>
它能够在不使用类的情况下使用状态和其他功能，它的编写基本上是函数组件的方式，在这之前我们写 react 虽然都是组件式开发，提高了代码的灵活性，但是随着业务复杂化，好多业务代码不得不和各种生命周期的钩子相关联，不方便抽离，所以只能复制，粘贴进行修改。


hook 就是为了解决组件复用这个问题出现的，下面我会通过 hook 使用和原理来说明它的强大之处。

### 补充的知识<hr>
在了解 hook 之前先看一下 react 这两方面<a href="https://reactjs.org/docs/render-props.html">渲染属性</a>和<a href="https://reactjs.org/docs/higher-order-components.html">高阶组件</a>的知识有助于理解 hook

### hook 的规则<hr>

hook 本质就是 JavaScript 函数，但是在使用它时需要遵循两条规则

 - 只在最顶层使用 hook，不要在循环，条件或嵌套函数中调用 hook
 - 只在 React 函数中调用 hook，不要在普通的 JavaScript 函数中调用 hook

通过<a href="https://www.npmjs.com/package/eslint-plugin-react-hooks">eslint-plugin-react-hooks</a>插件可以强制执行这两条规则

```js
npm install eslint-plugin-react-hooks --save-dev
```

```js
// 你的 ESLint 配置
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
    "react-hooks/exhaustive-deps": "warn" // 检查 effect 的依赖
  }
}
```

### hook 的分类<hr>

hook分为内置的和自定义的两种类型，内置的 hook 有以下几个

基础 hook
  - useState
  - useEffect
  - useContext

额外 hook
- useReducer
- useCallback
- useMemo
- useRef
- useImperativeHandle
- useLayoutEffect
- useDebugValue

### hook 的使用<hr>

> useState 返回一个 state，以及更新 state 的函数

```js
const [state, setState] = useState(initialState);
```

```js
// hook 模式
import React, { useState } from 'react';

const  Example  = () => {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Example;
```
```js
// class 模式
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```
通过上面来自官网的例子我们很清晰的看到没有 class、也没有了显示声明的constructor、this，而是使用了 useState 这个函数。
但是上面的代码有一个疑问我们怎么定义多个 state？ 让我们来看看下面两种方式

```js
import React, { useState, useEffect } from 'react';

const Example = ()=> {
  // count
  const [count, setCount] = useState(0);
  // name
  const [name, setName] = useState('renbo');
  // age
  const [age, setAge] = useState(28);
}

export default Example;

```

```js
import React, { useState, useEffect } from 'react';

const Example = ()=> {
  // propertys
  const [propertys, setPropertys] = useState({count:0, name: 'renbo', age: 28 });
}

export default Example;

```

官方建议是将不同功能的 state 抽离到 不同 useState 中。这样在后期拆分逻辑的时候更加容易控制

通过上面代码我们知道 useState 的作用是

- 它让我们在函数组件中存储内部 state
- 可以通过 useState 的返回值来更新 state
- 根据 useState 出现的顺序来保证在使用的能找到对应的 state（useEffect 会讲），所以在上面说到 hook 声明要在最外层
- hook 中没有使用 this，而是通过组件内部的「记忆单元格」列表来对当先渲染中的组件进行追踪。

> useEffect 接收一个函数。默认的情况下 effect 将在每轮渲染结束后执行

```js
useEffect(didUpdate);
```

```js

// hook 模式
import React, { useState, useEffect } from 'react';

const Example = ()=> {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Example;
```
```js
// class 模式
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```
 
通过上面的代码对比应该知道了 useEffect，的基本作用了，我们可以在这个 hook 中发送网络请求，进行有副作用操作的计算等等。

所以可以把它当作 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。

回到多个 useState 的问题，我们来看一个多个 useEffect 是怎么执行和匹配的

```js
const Example = (props)=> {

  // hook 1
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  // hook 2
  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
}

export default Example;
```

上面的例子看到 hook 允许我们按照代码的用途分离他们，React 将按照 effect 声明的顺序依次调用组件中的每一个 effect，否则就有可能找不到对应的标识而出错


在每次进行重新渲染的时候都要运行 Effect，而不是只在卸载组件的时候执行一次。是防止没有处理更新逻辑而导致的常见 bug，但是每次渲染后都执行清理或者执行 effect 可能会导致性能问题我们怎么来解决呢？

```js
// 在 class 中
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

```js
// hook 中
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```

上面的例子中我我们看到在 class 中 需要我们自己在 componentDidUpdate 中处理对应的逻辑，而 hook 中被内置到了 api 中它会对前一次和后一次进行比较，通过第二个参数来跳过对 effect 的调用实现了性能优化,但是在使用中还有一些问题如

```js
const Example = ({ someProp })=> {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 这样不安全（它调用的 `doSomething` 函数使用了 `someProp`）
}

export default Example
```
```js
const Example = ({ someProp })=> {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ 安全（我们的 effect 仅用到了 `someProp`）
}
export default Example
```

当函数（以及它所调用的函数）不引用 props、state 以及由它们衍生而来的值时，才可以通过第二个参数跳过 effect 的调用。


通过上面我们总结一下 useEffect

- 在执行 DOM 更新之后才调用此 hook
- 可以告诉 react 组件需要在渲染后执行某些操作（包含副作用的一些逻辑等）
- 放在组件内部让我们可以在 effect 中直接访问 state 的变量（因为使用了闭包机制，保存在函数作用域中）
- 会在每次渲染后都执行（第一次渲染和每次更新）可以通过第二个参数进行性能优化
- 使用 useEffect 调度的 effect 不会阻塞浏览器更新屏幕
- effect 返回一个函数是因为，可以在函数内进行清除一些副作用（引用了外部的变量上面的例子）

由于文章的篇幅问题我们就不再这里进行更多hook 的介绍了，可以查看<a href="https://zh-hans.reactjs.org/docs/hooks-reference.html">官网</a>

### hooks 的原理<hr>

在上面的介绍 useEffect 的时候提到过 hook 实际上是使用闭包机制，将状态行为和副作用封装在其中。

让我们来回忆一下什么是闭包，《你不知道的JS》这本书中将闭包定义为。

**闭包是指某个函数能够记住并访问其词法范围，即使该函数在其词法范围之外执行**

> useState 实现

我们通过上面的 demo 已经知道使用 useState 时候

- 返回一个变量和一个函数，
- 参数为返回变量的默认值

```js
function useState(initialValue) {
  var _val = initialValue 
  function state() {
    // 闭包
    return _val 
  }
  function setState(newVal) {
    // 闭包
    _val = newVal 
  }
  return [state, setState] 
}
var [foo, setFoo] = useState(0) 
console.log(foo()) // 0
setFoo(1)
console.log(foo()) // 1
```

通过上面代码我们看到借助 foo 和 setFoo，我们能够访问和操纵（也称为“封闭”）内部变量_val。

它们保留对 useState 的作用域的访问权限，该引用称为闭包。在 react 中这就是状态。

但是我们都知道状态必须是变量而不是函数。所以我们作出如下修改

```js
function useState(initialValue) {
  var _val = {value : initialValue}
  function setState(newVal) {
    _val.value = newVal
  }
  // 暴露 _val
  return [_val, setState] 
}
var [foo, setFoo] = useState(0)
console.log(foo) // {value: 0}
setFoo(1)
console.log(foo) // {value: 1}
```

上面的代码似乎跟我们想要的样子更近了，但是问题在于解构 foo 时返回的是一个对象和 React.useState API 还是有区别。

- useState 返回的新函数设置值之后需要重新渲染页面
- 由于 _val 在函数内部被声明的，每次重新调用都会被初始化，所以将 _val 提到全局

```js
const MyReact = (function() {
  // 将 _val 提交全局用于保存这个值
  let _val 
  return {
    // 模拟 render 用于改变值后需要重新渲染
    render(Component) {
      const Comp = Component()
      Comp.render()
      return Comp
    },
    // useState
    useState(initialValue) {
      _val = _val || initialValue
      function setState(newVal) {
        _val = newVal
      }
      return [_val, setState]
    }
  }
})()
```

```js
function Counter() {
  const [count, setCount] = MyReact.useState(0)
  return {
    click: () => setCount(count + 1),
    render: () => console.log('render:', { count })
  }
}
let App
App = MyReact.render(Counter) // render: { count: 0 }
App.click()
App = MyReact.render(Counter) // render: { count: 1 }
```

看到上面的执行结果之后，其实 useState 这个 api 就模拟成功了，下面让我看看 useEffect 的实现

> useEffect 实现

通过上面使用 useEffect，我们知道 useEffect实际上

- 有两个参数一个是函数，一个是可选参数-数组
- 根据第二个参数中是否有变化，来判断是否执行 useEffect 来提高性能

那么根据上面的规则我们实现如下


```js
const MyReact = (function() {
  let _val, _deps // 用于保持数据，因为依赖发生改变后会重新渲染执行
  return {
    // 模拟 render 函数
    render(Component) {
      const Comp = Component()
      Comp.render()
      return Comp
    },
    // 模拟 useEffect
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      const hasChangedDeps = _deps ? !depArray.every((el, i) => el === _deps[i]) : true
      if (hasNoDeps || hasChangedDeps) {
        callback()
        _deps = depArray
      }
    },
    // 模拟 useState
    useState(initialValue) {
      _val = _val || initialValue
      function setState(newVal) {
        _val = newVal
      }
      return [_val, setState]
    }
  }
})()


// 来调用一下，看看结果
function Counter() {
  const [count, setCount] = MyReact.useState(0)
  MyReact.useEffect(() => {
    console.log('effect', count)
  }, [count])
  return {
    click: () => setCount(count + 1),
    noop: () => setCount(count),
    render: () => console.log('render', { count })
  }
}
let App
App = MyReact.render(Counter)
// effect 0
// render {count: 0}
App.click()
App = MyReact.render(Counter)
// effect 1
// render {count: 1}
App.noop()
App = MyReact.render(Counter)
// // no effect run
// render {count: 1}
App.click()
App = MyReact.render(Counter)
// effect 2
// render {count: 2}
```

上面基本实现了 useState、 useEffect，但是也只是调用了一次，如果组件中进行多次调用呢？如下

```js
const Example = (props)=> {

  // hook 1
  const [count, setCount] = useState(0);
  useEffect(() => {
   // ...
  });

  // hook 2
  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    // ...
  });
}

export default Example;
```
如果按照多次调用我们的实现就会发生变量冲突，因为在上面的实现过程中我们共享了一个全局变量用于存储数据。

通过上面介绍 API 的时候说过它是通过组件内部的「记忆单元格」列表来对当先渲染中的组件进行追踪，最主要的是根据执行的顺序来调用的。

那么我们是不是可以通过数组来维护当前的记忆列表呢？如下

```js
const MyReact = (function() {
  // 通过数组和索引维护当前的记忆单元
  let hooks = [],
    currentHook = 0
  return {
    render(Component) {
      // 运行 effects
      const Comp = Component()
      Comp.render()
      // 重置为下一次渲染
      currentHook = 0
      return Comp
    },
    // 模拟 useEffect
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      const deps = hooks[currentHook]
      const hasChangedDeps = deps ? !depArray.every((el, i) => el === deps[i]) : true
      if (hasNoDeps || hasChangedDeps) {
        callback()
        hooks[currentHook] = depArray
      }
      // 累加 currentHook
      currentHook++ 
    },
    // 模拟 useState
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue
      const setStateHookIndex = currentHook
      const setState = newState => (hooks[setStateHookIndex] = newState)
      //  返回 state 然后 currentHook+1
      return [hooks[currentHook++], setState]
    }
  }
})()
```

```js
function Counter() {
  const [count, setCount] = MyReact.useState(0)
  const [text, setText] = MyReact.useState('foo')
  MyReact.useEffect(() => {
    console.log('effect', count, text)
  }, [count, text])
  return {
    click: () => setCount(count + 1),
    type: txt => setText(txt),
    noop: () => setCount(count),
    render: () => console.log('render', { count, text })
  }
}
let App
App = MyReact.render(Counter)
// effect 0 foo
// render {count: 0, text: 'foo'}
App.click()
App = MyReact.render(Counter)
// effect 1 foo
// render {count: 1, text: 'foo'}
App.type('bar')
App = MyReact.render(Counter)
// effect 1 bar
// render {count: 1, text: 'bar'}
App.noop()
App = MyReact.render(Counter)
// // no effect run
// render {count: 1, text: 'bar'}
App.click()
App = MyReact.render(Counter)
// effect 2 bar
// render {count: 2, text: 'bar'}
```


通过上面的实现我们基本了解了 hooks 的实现及原理

- 利用了闭包机制
- 按照执行顺序放入维护的数组队列和索引中
- 当进行取值操作则按照压栈的顺序来进行取值和判断逻辑


### 推荐阅读<hr>
<a href="https://zh-hans.reactjs.org/docs/hooks-reference.html">Hook API</a>
<a href="https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889">理解 React Hook</a>
<a href="https://cloud.tencent.com/developer/article/1468196">Hook 原理</a>
<a href="https://overreacted.io/making-setinterval-declarative-with-react-hooks/">Hook 的使用问题</a>
<a href="https://github.com/facebook/react/blob/master/packages/react/src/ReactHooks.js">源码</a>


























