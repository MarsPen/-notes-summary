---
title: React 之生命周期使用
date: 2019-10-02 13:20:25
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


和 Vue 一样 React 也会有对应的生命周期钩子函数，在相对应的钩子函数内，分别在不同时机处理相对应的逻辑，贴一张来至官网<a href="http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/">生命周期图</a>，通过周期图让我们看看 react 的生命周期具体的含义。

在 react 中，我们可以将生命周期分为四个阶段：

- 初始化阶段
- 挂载阶段
- 更新阶段
- 卸载阶段


下面我们就根据不同阶段对应不同的钩子函数进行简单的介绍使用（本文主要依据版本16.9.0）

### 初始化阶段（Initalization）<hr>

挂载阶段实际上就是在做初始化的过程，当组件实例被创建并插入 DOM 中的时候，将依次调用以下生命周期函数

```js
class Demo extends React.Component {
  static propTypes = {}
  static defaultProps = {}
  constructor(props) {
    super(props)
    this.state = {}
  }
  static getDerivedStateFromProps(nextProps, prevState) {return null}
  render() {return null}
  componentDidMount() {}
}
```

下面对上面的代码进行拆分

> static propTypes = {} 和 static defaultProps = {}

getDefaultProps 相当于 ES6中 static defaultProps = {}
getInitialState 相当于 constructor中 的 this.state = {}

- static defaultProps = {} 是设置组件的默认 props
- static propTypes = {} 组件的 props类型检测

> constructor(props)

在组件进行挂载之前，调用它的构造函数，可以做如下事情

- 访问 props
- 初始化 state 值
- 绑定事件处理函数

### 挂载阶段（Mounting）<hr>

将虚拟 DOM 转化为真实 DOM 的过程

> static getDerivedStateFromProps(props, state) 此钩子会执行 > 1 次

getDerivedStateFromProps 是在 render 之前被调用的，主要存在的作用是让组件的 props 变化时更新 state。
在初始化挂载和后续更新都会被调用，它返回一个对象来更新状态，或者返回 null 来表明新属性不需要更新任何状态。

使用此生命周期有几点需要注意的地方

- 调用 this.setState() 通常不会触发此方法
- 此方法会被调用多次
- 必须有返回值，返回一个对象更新 state 或者返回 null


> render() 此函数会执行 > 1 次，代表挂载（渲染）组件

render 函数是组件中唯一一个必须实现的方法，该函数在使用过程中有几点注意的地方

- 此函数会被调用多次
- 不能在函数中调用 this.setState() 方法
- render() 函数应该为<a href="https://www.studyfe.cn/2019/07/15/javascript/functionalpurity/">纯函数</a>
- 必须有返回值，可以有<a href="https://zh-hans.reactjs.org/docs/react-component.html#render">多种类型</a>。如果没有任何返回值，可以直接返回 null。


> componentDidMount()，此钩子只执行一次，代表组件渲染完成

此钩子函数并不是在 render 调用后立即调用，会在组件挂载后（插入 DOM 树中）立即调用。

- 依赖于 DOM 节点的初始化应该放在这里
- 如需通过网络请求获取数据，此处是实例化请求的好地方
- 在此钩子函数中可以直接调用 setState()，但会触发额外的渲染，调用两次 render，导致性能问题。所以如果不依赖 DOM，做数据初始化最好是用constructor。当然如果使用 redux 作为数据存储就无关紧要了。因为 redux 作初始数据载入时，是可以不需透过 react 组件的生命周期方法。


**挂载阶段即将废弃的钩子函数**

```js
/**
 * componentWillMount
 * 从 15 更新到 16 后不建议使用，该名称将继续使用至 React 17
 * 它在 render() 之前调用，因此在此方法中同步调用 setState() 不会触发额外渲染
 * 此钩子做的事情完全可以在 constructor 中做到，所以这个函数没什么存在感
 */
componentWillMount() {}
```

### 更新阶段（Updation）<hr>

组件 state，props 变化引发的重新渲染的过程，将依次调用以下生命周期函数

```js
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  static getDerivedStateFromProps(props,state) {return null }
  shouldComponentUpdate (nextProps, nextState) {return true}
  render() {return null}
  getSnapshotBeforeUpdate(prevProps, prevState) {return null}
  componentDidUpdate(prevProps, prevState, snapshot){}
}
```
> getDerivedStateFromProps(props,state) 在组件挂载阶段有说明，在更新阶段用法一样，就不多做介绍了

> shouldComponentUpdate (nextProps, nextState)

此钩子首次渲染调用 render 的时候不会被触发，在更新阶段接收到新的 state 或者 props 的时候会在 render 方法前面被调用，使用此钩子应注意几个地方

- 首次渲染或使用 forceUpdate() 时不会调用该方法
- 默认行为是当 props 或 state 发生变化时，此钩子会在 render 之前被调用，返回默认 true
- 如果要手动的返回 false，则会跳过更新阶段，不会执行 UNSAFE_componentWillUpdate()，render() 和 componentDidUpdate()
- 不建议在此钩子中进行深层次的比较或使用 JSON.stringify()。这样非常影响效率，且会损害性能。
- 此钩子可以对 react 进行性能上的优化，因为因为父组件的重新更新，会造成它下面所有的子组件重新执行 render 方法，形成新的虚拟DOM，在进行比对决定是否重新渲染，影响性能。所以我们可以将 this.props 与 nextProps 以及 this.state 与nextState 进行比较，并返回 false 以告知 React 可以跳过更新。也可以考虑使用内置的 PureComponent 组件，来进行浅层比较，减少跳过更新的必要性。

> render () 根据新的状态对象重新挂载(渲染)组件，在挂载阶段有说明，在更新阶段，就不多做介绍了

> getSnapshotBeforeUpdate（prevProps, prevState）

此钩子触发的时机是发生在组件更新阶段，在 render 重新渲染之后，组件 DOM 渲染之前，返回一个值，为 componentDidUpdate 的第三个参数；配合 componentDidUpdate， 可以覆盖 componentWillUpdate 的所有用法。

- 此钩子可以处理异步加载资源和组件在发生更改之前从 DOM 中捕获一些信息（如滚动位置等）
- 应返回 snapshot 的值（或 null）


> componentDidUpdate（prevProps, prevState, snapshot）

此钩子首次渲染调用 render 的时候不会被触发，在更新后被立即调用


- 当组件更新后，可以在此处对 DOM 进行操作
- 如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求
- 可以在此钩子中直接调用 setState()，但请注意它必须被包裹在一个条件语件里，否则会造成死循环。它还会造成额外的重新渲染，影响性能。

```js
componentDidUpdate(prevProps) {
  // 典型用法（不要忘记比较 props）：
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

**更新阶段即将废弃的钩子函数**

```js
/**
 * componentWillReceiveProps和 componentWillUpdate
 * 从 15 更新到 16 后不建议使用，该名称将继续使用至 React 17
 * componentWillReceiveProps 组件收到新的属性对象时调用，首次渲染不会触发
 * componentWillUpdate 组件更新之前调用的钩子函数
 */
componentWillReceiveProps () {}
componentWillUpdate () {}
```
### 卸载阶段（Unmounting）<hr>

组件卸载之前调用此钩子

```js
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentWillUnmount()
}
```

> componentWillUnmount()

此钩子会在组件卸载及销毁之前直接调用，在此方法中执行必要的清理操作，例如，清除 timer，取消网络请求或清除在 componentDidMount() 中创建的订阅等

- 此钩子不应调用 setState()，因为该组件将永远不会重新渲染。组件实例卸载后，将永远不会再挂载它


### 其他钩子<hr>

当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法


```js
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  // 两个钩子用其中一个就可以
  static getDerivedStateFromError(error) {}
  componentDidCatch(error, info) {}
}
```

- Error boundaries 组件会捕获在渲染期间，在生命周期方法以及其整个树的构造函数中发生的错误
- Error boundaries 仅捕获组件树中以下组件中的错误。但它本身的错误无法捕获。
- 如果发生错误，你可以通过调用 setState 使用 componentDidCatch() 渲染降级 UI，但在未来的版本中将不推荐这样做。 可以使用静态 getDerivedStateFromError() 来处理降级渲染。

> static getDerivedStateFromError() 会在渲染阶段调用，因此不允许出现副作用。 如遇此类情况，请改用 componentDidCatch()。

此钩子会在后代组件抛出错误后被调用。 它将抛出的错误作为参数，并返回一个值以更新 state

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染可以降级 UI
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      // 你可以渲染任何自定义的降级  UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children; 
  }
}
```

> componentDidCatch(error, info) 会在 “提交” 阶段被调用，因此允许执行副作用。 用于记录错误之类的情况.

此生命周期在后代组件抛出错误后被调用。 它接收两个参数：

- error —— 抛出的错误。
- info —— 带有 componentStack key 的对象。

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染可以显示降级 UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // "组件堆栈" 例子:
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 你可以渲染任何自定义的降级 UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

### 版本对比图<hr>

<img src="/images/library-react-lifecycle01.png">

通过上面版本对比图我们能够很清晰的看到在 Mounting 和 Updation 阶段16版本增加了深蓝色部分。 
- 16版本中 componentWillMount、componentWillReceiveProps、componmentWillUpdate 被标记为不安全的钩子，在17版本中被移除
- 增加了 getDeriveStateFromProps、getSnapshotBeforeUpdate。
- 增加了错误处理的钩子分别为 componentDidCatch、getDerivedStateFromError

### 流程图<hr>

<img src="/images/library-react-lifecycle02.png">

### 执行顺序<hr>

用下面的例子进行测试

父组件

```js
import React, { Component } from 'react';
import './ToDo.css';
import ToDoItem from './components/ToDoItem';

class ToDo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // this is where the data goes
      list: [
        {
          'todo': 'clean the house'
        },
        {
          'todo': 'buy milk'
        }
      ],
      todo: ''
    };
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('getDerivedStateFromProps父')
    return null
  }
  componentDidMount() {
    console.log('componentDidMount父')
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate父')
    return true
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate父')
    return null
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('componentDidUpdate父')
  }

  componentWillUnmount() {
    console.log('componentWillUnmount父')
  }


  createNewToDoItem = () => {
    this.setState(({ list, todo }) => ({
      list: [
        ...list,
        {
          todo
        }
      ],
      todo: ''
    }));
  }


  handleKeyPress = e => {
    if (e.target.value !== '') {
      if (e.key === 'Enter') {
        this.createNewToDoItem();
      }
    }
  }

  handleInput = e => {
    this.setState({
      todo: e.target.value
    });
  }


  // this is now being emitted back to the parent from the child component
  deleteItem = indexToDelete => {
    this.setState(({ list }) => ({
      list: list.filter((toDo, index) => index !== indexToDelete)
    }));
  }


  render() {
    console.log("render 父")
    return (
      <div className="ToDo">
        <h1 className="ToDo-Header">React To Do</h1>
        <div className="ToDo-Container">
          <div className="ToDo-Content">
            <ToDoItem />
            {this.state.list.map((item, key) => {
              return <ToDoItem
                key={key}
                item={item.todo}
                deleteItem={this.deleteItem.bind(this, key)}
              />
            }
            )}

          </div>
          <input type="text" value={this.state.todo} onChange={this.handleInput} onKeyPress={this.handleKeyPress} />
          <div className="ToDo-Add" onClick={this.createNewToDoItem}>+</div>
        </div>
      </div>
    );
  }
}

export default ToDo;
```
子组件

```js
mport React, { Component } from 'react';
import './ToDoItem.css';

class ToDoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('getDerivedStateFromProps子')
    return null
  }
  componentDidMount() {
    console.log('componentDidMount子')
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate子')
    return true
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate子')
    return null
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('componentDidUpdate子')
  }

  componentWillUnmount() {
    console.log('componentWillUnmount子')
  }

  render() {
    console.log("render 子")
    return (
      <div className="ToDoItem">
        <p className="ToDoItem-Text">{this.props.item}</p>
        <div className="ToDoItem-Delete" onClick={this.props.deleteItem}>-</div>
      </div>
    );
  }
}

export default ToDoItem;

```

使用父组件

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ToDo from './ToDo';

ReactDOM.render(<ToDo />, document.getElementById('root'));
```

通过上面代码看的初始化执行顺序是

<image src="/images/library-react-lifecycle03.jpg" />

可以看到先执行
- 父组件的 getDerivedStateFromProps -> render
- 子组件的 getDerivedStateFromProps -> render
- 子组件的 componentDidMount
- 父组件的 componentDidMount

更新阶段执行的顺序是
<image src="/images/library-react-lifecycle04.jpg" />

- 父组件的 getDerivedStateFromProps -> shouldComponentUpdate -> render
- 子组件的 getDerivedStateFromProps -> shouldComponentUpdate -> render
- 子组件 getSnapshotBeforeUpdate
- 父组件 getSnapshotBeforeUpdate
- 子组件 componentWillUnmount（因为删除了子组件）
- 子组件的 componentDidUpdate
- 父组件的 componentDidUpdate

### 相关链接

<a href="https://zh-hans.reactjs.org/docs/react-component.html">组件的生命周期<a>






























