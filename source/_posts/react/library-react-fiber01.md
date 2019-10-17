---
title: React 原理之 FiberRoot 构建过程
date: 2019-10-04 13:20:25
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

fiber 是当前整个 react 核心部分，其中包含了大量的计算机知识。如果阅读 react 的源码能让人感觉到无力。

每次版本更新，核心部分的函数总是要动那么一动。从 15, 到 16 到 16.8、16.9 到现在的 16.10，包括现在已经改版的 vue3.0 着实让人难受。但是学习的步伐还是不能停下。react 系列文章主要是依赖 16.9 的源码进行分析。

我们言归正传，这一章到后面的几篇文章都是对 fiber 的学习和理解包括构建、调度、更新等。如有错误欢迎在 git 博客项目下提交 issue。


## 创建 FiberRoot<hr>

下面我们就 FiberRoot 的创建来开始我们的这篇文章，我们在 <a href="https://www.studyfe.cn/2019/10/01/react/library-react-jsx/">jsx</a> 转换的时候介绍过 jsx 主要是在编译的时候通过 React.createElement 这个函数进行转换的，那么转换后的代码会在 ReactDOM.render 中进行执行，首先我们看一下 ReactDOM.render 的执行函数，定义在文件 `packages/react-dom/src/client/ReactDOM.js` 中

```js
const ReactDOM: Object = {
 // ...
  hydrate(element: React$Node, container: DOMContainer, callback: ?Function) {
    invariant(
      isValidContainer(container),
      'Target container is not a DOM element.',
    );
    if (__DEV__) {
      // ...
    }
    // TODO: throw or warn if we couldn't hydrate?
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      true,
      callback,
    );
  },

  render(
    element: React$Element<any>,
    container: DOMContainer,
    callback: ?Function,
  ) {
    invariant(
      isValidContainer(container),
      'Target container is not a DOM element.',
    );
    if (__DEV__) {
      // ...
    }
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback,
    );
  }
```
经过上面的部分代码我们已经看到了 render 函数，但是在执行 render 函数之前执行了 hydrate 函数，这段代码是 React16 新增的主要是使⽤用服务端渲染和本地 DOM 进行调和，通过参数区分是否是服务端渲染，最后在创建 fiberRoot 过程中做区分。具体过程在后面会作出分析。

接下来我们看 render 函数，通过 invariant 验证是否是有效的 DOM element 然后执行了一个主要的方法 legacyRenderSubtreeIntoContainer

### legacyRenderSubtreeIntoContainer <hr>

> legacyRenderSubtreeIntoContainer 方法主要的作用是

- 调用 legacyCreateRootFromDOMContainer 给 root 元素打上标识 _reactRootContainer，这里面的 forceHydrate 就是区分是否是服务端的标志 
- 调用 ReactSyncRoot 创建 fiberRoot
- 调用 unbatchedUpdates，第一次渲染是不使用批量更新。最后调用 updateContainer 更新子节点，生成完整的 fiber 树

```js
// 渲染Dom Tree到挂载的container节点上
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: DOMContainer,
  forceHydrate: boolean,
  callback: ?Function,
) {
  if (__DEV__) {
    // ...
  }

  // 判断container 是否有_reactRootContainer属性，正常情况第一次渲染 container 是不会有 _reactRootContainer 属性的
  let root: _ReactSyncRoot = (container._reactRootContainer: any);
  let fiberRoot;
  if (!root) {
    // 初次渲染，初始化 root 对象
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    // 结合 ReactSyncRoot 函数 this._internalRoot = root;  
    // fiberRoot 为 createContainer 函数返回结果
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // 初次渲染不使用批量更新.
    unbatchedUpdates(() => {
      // 批量更新子节点
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}
```
通过上面的大致流程，来详细的说明三个步骤中的执行过程

### legacyCreateRootFromDOMContainer <hr> 

> legacyCreateRootFromDOMContainer，此方法的作用是

- 判断是否是服务端渲染标志 shouldHydrate
- 清除所有子元素 removeChild
- 返回 ReactSyncRoot 的实例

```js

function legacyCreateRootFromDOMContainer(
  container: DOMContainer,
  forceHydrate: boolean,
): _ReactSyncRoot {

  // 通过传递过来的 hydrate 标志，来确定是否会调和（复用）原来存在的 dom 节点，以提高性能，之后在和新渲染的节点进行合并
  const shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;
    // 删除container 下的所有子节点
    while ((rootSibling = container.lastChild)) {
      if (__DEV__) {
        // ...
      }
      container.removeChild(rootSibling);
    }
  }
  if (__DEV__) {
    // ...
  }

  // root 是同步更新的.
  return new ReactSyncRoot(container, LegacyRoot, shouldHydrate);
}

```

### ReactSyncRoot <hr>

> ReactSyncRoot，此方法主要的作用是

- 调用 createContainer
- 创建了一个 fiberRoot 进行赋值

```js
function ReactSyncRoot(
  container: DOMContainer,
  tag: RootTag,
  hydrate: boolean,
) {
  // 将 createContainer 返回的值赋值给实例的 _internalRoot
  const root = createContainer(container, tag, hydrate);
  this._internalRoot = root;
}
```

### createContainer <hr>

> createContainer 此方法主要来源于 `react-reconciler/inline.dom`

```js
import {
  computeUniqueAsyncExpiration,
  findHostInstanceWithNoPortals,
  updateContainerAtExpirationTime,
  flushRoot,
  createContainer,
  updateContainer,
  batchedEventUpdates,
  batchedUpdates,
  unbatchedUpdates,
  discreteUpdates,
  flushDiscreteUpdates,
  flushSync,
  flushControlled,
  injectIntoDevTools,
  getPublicRootInstance,
  findHostInstance,
  findHostInstanceWithWarning,
  flushPassiveEffects,
  IsThisRendererActing,
} from 'react-reconciler/inline.dom';
```

可以看到引入的这个文件里面定义的很多相关方法，那么我们进入这个文件

```js
export * from './src/ReactFiberReconciler';
```

通过名字就能看到这是 fiber 的构建文件，进入这个文件查看 createContainer

```js
export function createContainer(
  containerInfo: Container,
  tag: RootTag,
  hydrate: boolean,
): OpaqueRoot {
  return createFiberRoot(containerInfo, tag, hydrate);
}
```

此方法主要的作用是

- 返回 createFiberRoot 方法的值

### createFiberRoot<hr>

> createFiberRoot 方法来源于文件 `./ReactFiberRoot`，此方法的主要作用是

- 调用 createHostRootFiber 函数返回  uninitializedFiber
- 将 uninitializedFibe 赋值在 root 对象的 current 上
- 将 root 赋值给 uninitializedFiber.stateNode

```js
export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
): FiberRoot {
   // root 节点是 fiber
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);
  // 循环结构，进行相互引用
  // 此处实际上一个单向链表的串联方式，用这个数据结构把整个 fiber 树串联起来
  const uninitializedFiber = createHostRootFiber(tag);
  // current 是 uninitializedFiber
  // 每一个 ReactElment 节点都对应一个 fiber 对象，也就会有一个树状结构
  // root.current 是当前的 fiber 对象的树状结构的顶点
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  return root;
}
```

通过上面的方法我们知道执行了 FiberRootNode 和 createHostRootFiber 来创建整个结构我们必须清楚他们是什么关系

- root 是 ReactRoot 实例，
- root._internalRoot 是 fiberRoot 实例，
- root._internalRoot.current 是 Fiber 实例，
- root._internalRoot.current.stateNode = root._internalRoot


### FiberRootNode <hr>

> new FiberRootNode 此方法的作用是创建 FiberRootNode，也就是 fiber 的 root 节点 

```js
function FiberRootNode(containerInfo, tag, hydrate) {
  // 标记不同的组件类型
  this.tag = tag;
  // 对应的 root 节点，也是对应的 fiber 对象
  this.current = null;
  // dom 上的 root 节点 render 里接收的第二个参数
  // ReactDOM.render(element, document.getElementById('root'));
  this.containerInfo = containerInfo;
  // 在持久更新中用到
  this.pendingChildren = null;
  this.pingCache = null;

  this.finishedExpirationTime = NoWork;
  // 记录更新任务的优先级，在commit 阶段只会处理这个值对应的任务
  this.finishedWork = null;
  // 在任务被挂起的时候通过 setTimeout 设置的返回内容，用来下⼀次如果有新的任务挂起时清理还没触发的 timeout
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  // 是否进行调合标志
  this.hydrate = hydrate;
  this.firstBatch = null;
  this.callbackNode = null;
  this.callbackExpirationTime = NoWork;
  this.firstPendingTime = NoWork;
  this.lastPendingTime = NoWork;
  this.pingTime = NoWork;

  if (enableSchedulerTracing) {
    this.interactionThreadID = unstable_getThreadID();
    this.memoizedInteractions = new Set();
    this.pendingInteractionMap = new Map();
  }
}

```

接下来会执行 createHostRootFiber

### createHostRootFiber <hr>

> createHostRootFiber 来源于 `./ReactFiber`，此方法的主要作用是

- 通过 RootTag 来进行对比区分创建 fiber 的模式
- 执行 createFiber 函数，拿到返回值

```js
export function createHostRootFiber(tag: RootTag): Fiber {
  let mode;
  if (tag === ConcurrentRoot) {
    mode = ConcurrentMode | BatchedMode | StrictMode;
  } else if (tag === BatchedRoot) {
    mode = BatchedMode | StrictMode;
  } else {
    mode = NoMode;
  }

  if (enableProfilerTimer && isDevToolsPresent) {
    mode |= ProfileMode;
  }

  return createFiber(HostRoot, null, null, mode);
}

```

**上面的对比过程有几个变量我觉得挺有意思，如果其他同学不感兴趣可以直接略过以下此部分**

```js
import {ConcurrentRoot, BatchedRoot} from 'shared/ReactRootTags';

export type RootTag = 0 | 1 | 2;

export const LegacyRoot = 0;
export const BatchedRoot = 1;
export const ConcurrentRoot = 2;

```

```js
import {
  NoMode,
  ConcurrentMode,
  ProfileMode,
  StrictMode,
  BatchedMode,
} from './ReactTypeOfMode';


export type TypeOfMode = number;

export const NoMode = 0b0000;
export const StrictMode = 0b0001;
// 从 root 中读取数据，删除 BatchedMode 和 ConcurrentMode
export const BatchedMode = 0b0010;
export const ConcurrentMode = 0b0100;
export const ProfileMode = 0b1000;

```

通过上面二进制计算，来确定 expiriation-time 模式，关于此模式我们会在后续文章中进行介绍。

接下来我们看一下 createFiber

### createFiber <hr>

> createFiber 此方法主要的作用是返回了 FiberNode 的实例 进行 FiberNode 的初始化

```js
const createFiber = function(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
): Fiber {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, pendingProps, key, mode);
};
```

### FiberNode <hr>

> FiberNode

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Instance
  // 区分 fiber的不同类型，标记不同的组件类型
  this.tag = tag;
  // ReactElement里面的key
  this.key = key;
  // 调用`createElement`的第一个参数
  this.elementType = null;
  // 异步组件resolved之后返回的内容，一般是`function`或者`class`
  this.type = null;
  // 对应节点的实例 
  this.stateNode = null;

  // Fiber 单链表结构树结构.
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 在 setState 之后 pendingProps 里存的新的 props 
  this.pendingProps = pendingProps;
  // 在 setState 之后 memoizedProps 存的老的 props
  this.memoizedProps = null;
  // 在 setState 或者 forceUpdate 创建更新之后就会存在此队列里，也是单向链表结构
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  // 节点的更新模式
  this.mode = mode;

  // Effects
  // 标记最终dom节点要进行哪些更新的工具
  // 标记是否执行组件生命周期的内容
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;
  //任务优先级调度的过期时间
  this.expirationTime = NoWork;
  this.childExpirationTime = NoWork;

  this.alternate = null;

  // ...
}

```

上面的初始化 fiberRoot 的过程就结束了，在创建 fiberRoot 的同时还进行了 

```js
unbatchedUpdates(() => {
  updateContainer(children, fiberRoot, parentComponent, callback);
});
```

下面我们就看看怎么更新的子节点

### unbatchedUpdates

创建完 fiberRoot 在 unbatchedUpdates 中执行 updateContainer 对容器内容进⾏更新。那么在执行更新之前 unbatchedUpdates 做了什么？接下来进入 unbatchedUpdates

> unbatchedUpdates 不会进行批量更新，定义在文件 `packages/react-reconciler/src/ReactFiberWorkLoop.js` 中

```js
export function unbatchedUpdates<A, R>(fn: (a: A) => R, a: A): R {
  // type ExecutionContext = number;
  // const NoContext = /*                    */ 0b000000;
  // const BatchedContext = /*               */ 0b000001;
  // const EventContext = /*                 */ 0b000010;
  // const DiscreteEventContext = /*         */ 0b000100;
  // const LegacyUnbatchedContext = /*       */ 0b001000;
  // const RenderContext = /*                */ 0b010000;
  // const CommitContext = /*                */ 0b100000;
  // let executionContext: ExecutionContext = NoContext;

  const prevExecutionContext = executionContext;
  executionContext &= ~BatchedContext;
  executionContext |= LegacyUnbatchedContext;
  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;
    if (executionContext === NoContext) {
      // 刷新在此批处理期间调度的即时回调
      flushSyncCallbackQueue();
    }
  }
}
```

运算符的概念

- & 如果两位都是 1 则设置每位为 1 
- | 如果两位之一为 1 则设置每位为 1
- ~ 反转操作数的比特位，即 0 变成 1，1 变成 0

上面表达式相当于下面写法，初始化的值为

```js
executionContext = executionContext & (~BatchedContext)  // 0 & (~1) 为 0
executionContext = executionContext | LegacyUnbatchedContext // 0 | 8 则为 8
```

executionContext 则是这些 Context 组合的结果:
- 将当前上下文添加 render：executionContext |= RenderContext
- 判断当前是否处于 render 阶段： executionContext &= RenderContext === NoContext
- 去除 render: executionContext &= ~RenderContext


所以此方法的执行流程是

- 将当前的执行上下文赋值给 prevExecutionContext 默认为 0
- 当前上下文设置成 BatchedContext 默认为 0
- 把当前上下文设置成 LegacyUnbatchedContext 默认为 8
- 执行 try 中的回调之后执行 flushSyncCallbackQueue
- 最后返回执行结果

在初始化更新阶段 try 中的回调实际上就是 updateContainer，那么接下来我们看看 updateContainer

### updateContainer <hr>

> updateContainer 定义在 `/packages/react-reconciler/src/ReactFiberReconciler.js`

```js
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  // 上面提到过，对应的是一个 fiber 对象
  const current = container.current;
  // 获取当前任务时间
  // 过期时间是通过添加当前时间(开始时间)来计算的
  const currentTime = requestCurrentTime();
  if (__DEV__) {
   // ...
  }

  // 批处理的过程的配置 SuspenseConfig 默认为 null
  // export type SuspenseConfig = {
  //  timeoutMs: number,
  //  busyDelayMs?: number,
  //  busyMinDurationMs?: number,
  // };
  const suspenseConfig = requestCurrentSuspenseConfig();
  // 通过 expirationTime 对节点计算超时时间
  // 如果在同一个事件中安排了两个更新，应该将它们的开始时间视为同时发生的
  // 即使在第一次和第二次调用之间实际的时钟时间已经提前
  // 过期时间决定更新的批处理方式，在同一事件中发生的具有相同优先级的所有更新都能接收到相同的过期时间
  const expirationTime = computeExpirationForFiber(
    currentTime,
    current,
    suspenseConfig,
  );
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    suspenseConfig,
    callback,
  );
}

```

上面的逻辑最主要的的两个方法 computeExpirationForFiber 和 updateContainerAtExpirationTime

### computeExpirationForFiber <hr>

> computeExpirationForFiber 计算节点超时时间

```js
export function computeExpirationForFiber(
  currentTime: ExpirationTime,
  fiber: Fiber,
  suspenseConfig: null | SuspenseConfig,
): ExpirationTime {
  // 当前 fiber 对象采用的模式 
  const mode = fiber.mode;

  /**
   * form ./ReactTypeOfMode 
   * 调度系统的处理模式
   * NoMode 0b0000 --> 0
   * BatchedMode 0b0010 --> 2
   * ConcurrentMode 0b0100  --> 4
   */

  /**
   * from ./ReactFiberWorkLoop 
   * 当前调度系统的 Execution
   * ExecutionContext 默认值  NoContext  0b000000 --> 0
   * RenderContext 0b010000 --> 16
   */
  
  /**
   * from ./ReactFiberExpirationTime 
   * 调度系统的处理模式
   * Sync 默认值 MAX_SIGNED_31_BIT_INT --> 1073741823 (最大 31 位整数。32 位系统的 V8 中的最大整数大小, Math.pow(2, 30) - 1)
   * Batched  Sync - 1
   * LOW_PRIORITY_EXPIRATION 5000
   * LOW_PRIORITY_BATCH_SIZE 250
   * HIGH_PRIORITY_EXPIRATION  __DEV__ ? 500 : 150
   * HIGH_PRIORITY_BATCH_SIZE 100
   */

  /**
   * ./SchedulerWithReactIntegration
   * 除了 NoPriority 之外，这些都对应于调度器优先级
   * 使用升序数字，从90开始，以避免与调度程序的优先级冲突
   * ImmediatePriority  99 
   * UserBlockingPriority 98
   * NormalPriority 96
   * IdlePriority 95
   * NoPriority 90
   */

  // (mode & 2) === 0 
  if ((mode & BatchedMode) === NoMode) {
    // return 1073741823
    return Sync;
  }
  const priorityLevel = getCurrentPriorityLevel();
  // (mode & 4) === 0 执行 
  if ((mode & ConcurrentMode) === NoMode) {
    // priorityLevel === 99 ? 1073741823 : (1073741823 - 1)
    return priorityLevel === ImmediatePriority ? Sync : Batched;
  }
  // (0 & 16-> 0b010000) !== 0 (0b000000)
  if ((executionContext & RenderContext) !== NoContext) {
    // 利用我们已经渲染的时间, 默认是 nowork（0）
    return renderExpirationTime;
  }


  // expirationTime 代表该 fiber 的优先级，数值越大，优先级越高，Sync 的优先级最高
  let expirationTime;
  if (suspenseConfig !== null) {
    // 基于暂停超时计算过期时间
    expirationTime = computeSuspenseExpiration(
      currentTime,
      suspenseConfig.timeoutMs | 0 || LOW_PRIORITY_EXPIRATION,
    );
  } else {
    // 根据调度器优先级计算 expirationTime
    switch (priorityLevel) {
      case ImmediatePriority:
        expirationTime = Sync; 
        break;
      case UserBlockingPriority:
        expirationTime = computeInteractiveExpiration(currentTime); 
        break;
      case NormalPriority:
      case LowPriority:
        expirationTime = computeAsyncExpiration(currentTime);
        break;
      case IdlePriority:
        expirationTime = Never;
        break;
      default:
        invariant(false, 'Expected a valid priority level');
    }
  }

  // 如果正在渲染一个树，不要在已经渲染的超时时间上更新操作。
  // 如果在不同的 root 节点上更新移动到单独的批处理中
  if (workInProgressRoot !== null && expirationTime === renderExpirationTime) {
    expirationTime -= 1;
  }

  return expirationTime;
}

```

从上到代码的注释就能看到 computeExpirationForFiber 主要是根据不同的任务优先级去进行调度执行计算超时时间 expirationTime，那么在不同的任务优先级下面具体是怎么计算的呢

主要有下面四种

- computeSuspenseExpiration 暂停任务的计算
- Sync 同步任务的计算值
- computeInteractiveExpiration 交互更新的计算
- computeAsyncExpiration 异步任务的计算 
 

上面的方法除了 Sync 任务优先级最高为 99 外，其他需要计算，都调用了 ./ReactFiberExpirationTime 文件中 computeExpirationBucket 方法

```js

/*
* computeSuspenseExpiration (currentTime, timeoutMs, LOW_PRIORITY_BATCH_SIZE) {}
* timeoutMs --> suspenseConfig.timeoutMs | 0 || LOW_PRIORITY_EXPIRATION
* LOW_PRIORITY_BATCH_SIZE --> 200
*/

/*
* computeInteractiveExpiration (currentTime, HIGH_PRIORITY_EXPIRATION, HIGH_PRIORITY_BATCH_SIZE) {}
* HIGH_PRIORITY_EXPIRATION --> __DEV__ ? 500 : 150
* HIGH_PRIORITY_BATCH_SIZE --> 100
*/

/*
* computeAsyncExpiration (currentTime, LOW_PRIORITY_EXPIRATION, LOW_PRIORITY_BATCH_SIZE) {}
* LOW_PRIORITY_EXPIRATION --> 5000
* LOW_PRIORITY_BATCH_SIZE --> 250
*/

// MAGIC_NUMBER_OFFSET = Batched-1 --> (Sync - 1)-1 --> 1073741821;
// UNIT_SIZE = 10
function computeExpirationBucket(
  currentTime,
  expirationInMs,
  bucketSizeMs,
): ExpirationTime {
  return (
    MAGIC_NUMBER_OFFSET -
    ceiling(
      MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE,
    )
  );
}

function ceiling(num: number, precision: number): number {
  return (((num / precision) | 0) + 1) * precision;
} 

```


根据上面公式，我们通过不同的任务优先级来计算一下 expirationTime

computeAsyncExpiration 的 expirationTime 为

```js
1073741821-ceiling(1073741821-currentTime + 500, 25)
1073741821-((((1073741821 - currentTime + 500) / 25) | 0) + 1) * 25
我们取最后四位来看一下规律并且把 currentTime 变为 1000
1821-((((1821 - 996 + 500) / 25) | 0) + 1) * 25  //1821-1350
1821-((((1821 - 1021+ 500) / 25) | 0) + 1) * 25  //1821-1325
1821-((((1821 - 1022+ 500) / 25) | 0) + 1) * 25  //1821-1300
1821-((((1821 - 1047+ 500) / 25) | 0) + 1) * 25  //1821-1275
```
**可以得出，异步更新的过期时间间隔是25ms**

同理 computeInteractiveExpiration 的 expirationTime 为

```js
1073741821-ceiling(1073741821-currentTime+15,10)
```
**可以得出，交互更新的过期时间间隔是10ms**

computeSuspenseExpiration 中的 <a href="https://www.zhihu.com/question/268028123/answer/332182059" >suspenseConfig</a> 是用来解决异步 IO问题的，它计算的优先级取决于 suspenseConfig.timeoutMs 的时间，如果suspenseConfig.timeoutMs 没有值那么默认为 LOW_PRIORITY_EXPIRATION（5000），LOW_PRIORITY_BATCH_SIZE（250），代入公式为

```js
1073741821-ceiling(1073741821-currentTime+500,25)
```
**可以得出，时间间隔是25ms，但由于500 的取值不固定，所以它的优先级不固定**

通过上面计算的结论得出

- Sync 任务优先级最高 > computeInteractiveExpiration 用户交互更新任务 > computeAsyncExpiration 异步任务的计算 
- computeSuspenseExpiration 的情况由于不固定所以任务优先级不固定

从结论中得出 react 异步更新的 expirationTime 间隔是25ms，让两个或多个相近（25ms内）的更新得到相同的 expirationTime。目的就是让这两个更新自动合并成一个，从而达到自动批量更新的目的。这样在开发中不停的 setState() 进行更新操作，25ms内的就会合并提高性能。我们后面也会介绍 setState 和 BatchUpdate 的运行机制。

### updateContainerAtExpirationTime <hr>

> updateContainerAtExpirationTime 定义在文件 `packages/react-reconciler/src/ReactFiberReconciler.js`


```js
export function updateContainerAtExpirationTime(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  expirationTime: ExpirationTime,
  suspenseConfig: null | SuspenseConfig,
  callback: ?Function,
) {
  // TODO: If this is a nested container, this won't be the root.
  const current = container.current;

  if (__DEV__) {
    // ..
  }

  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  return scheduleRootUpdate(
    current,
    element,
    expirationTime,
    suspenseConfig,
    callback,
  );
}
```

从上面看到获取容器的节点，之后进入 scheduleRootUpdate 更新 container

### scheduleRootUpdate<hr>

> scheduleRootUpdate 

```js
function scheduleRootUpdate(
  current: Fiber,
  element: ReactNodeList,
  expirationTime: ExpirationTime,
  suspenseConfig: null | SuspenseConfig,
  callback: ?Function,
) {
  if (__DEV__) {
    // ...
  }

  // 获得优先级后则和同步更新一样， 创建 update 用于记录组件改变的状态的对象
  const update = createUpdate(expirationTime, suspenseConfig);
  // 设置update属性 初次渲染
  update.payload = {element};

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    // ...
    update.callback = callback;
  }

  if (revertPassiveEffectsChange) {
    flushPassiveEffects();
  }
  // enqueueUpdate 把 update 对象加入 fiber 对象的 updateQueue 中，updateQueue对象是一个单向链表结构 
  // 只要有 setState 或者其他方式触发了更新，就会在 fiber 上的 updateQueue 里插入一个 update
  // 这样在更新的时候就可以合并一起更新
  enqueueUpdate(current, update);
  // 开始进行任务调度流程，任务调度则需要按照优先级进行控制
  // 在同一时间有不同的任务优先级，则需要先执行优先级高的任务
  scheduleWork(current, expirationTime);

  return expirationTime;
}
```

### scheduleWork <hr>

> scheduleWork 异步调度流程，定义在文件 `/packages/react-reconciler/src/ReactFiberWorkLoop.js`

```js
export function scheduleUpdateOnFiber(
  fiber: Fiber,
  expirationTime: ExpirationTime,
) {

  // 判断是否有无限循环的 update，如果超过50层件套 update
  // 就会停止调度，并报错
  // 所以我们在我们不能在 render 中无条件的调用 setState，造成死循环
  checkForNestedUpdates();
  // ...
  // 找到 rootFiber 并遍历更新子节点的 expirationTime
  const root = markUpdateTimeFromFiberToRoot(fiber, expirationTime);
  if (root === null) {
    warnAboutUpdateOnUnmountedFiberInDEV(fiber);
    return;
  }
  // NoWork表示无更新操作 为 0 
  root.pingTime = NoWork;
  //判断是否有高优先级任务打断当前正在执行的任务
  checkForInterruption(fiber, expirationTime);
  // 报告调度更新
  recordScheduleUpdate();

  //  获取优先级
  const priorityLevel = getCurrentPriorityLevel();
  // 同步任务
  if (expirationTime === Sync) {
    if (
      // render前，也就是第一次执行 
      // 不批量更新
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      // 是否已经 render
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // 跟踪 在root 注册挂起的交互，以避免丢失跟踪的交互数据
      schedulePendingInteractions(root, expirationTime);

      // 批量更新时，render是同步的，但布局的更新要延迟到批量更新的末尾才执行
      // 渲染 root 组件
      // 调用workLoop进行循环单元更新
      let callback = renderRoot(root, Sync, true);
      while (callback !== null) {
        callback = callback(true);
      }
      // render 后
    } else {
      // 立即执行调度任务
      scheduleCallbackForRoot(root, ImmediatePriority, Sync);
      // 判断没有update时
      if (executionContext === NoContext) {
        // 刷新同步任务队列
        // 放在 scheduleUpdateOnFiber 而不是 scheduleCallbackForFiber中，以保留在不立即刷新回调的情况下调度回调的能力。
        // 只对用户发起的更新这样做，以保持同步模式的历史行为。
        flushSyncCallbackQueue();
      }
    }
  } else {
    // 异步任务立即执行调度任务
    scheduleCallbackForRoot(root, priorityLevel, expirationTime);
  }

  if (
    (executionContext & DiscreteEventContext) !== NoContext &&
    
    (priorityLevel === UserBlockingPriority || priorityLevel === ImmediatePriority)
  ) {
    
    if (rootsWithPendingDiscreteUpdates === null) {
      // key是root，value是expirationTime
      rootsWithPendingDiscreteUpdates = new Map([[root, expirationTime]]);
    } else {
      // 获取最新的DiscreteTime
      const lastDiscreteTime = rootsWithPendingDiscreteUpdates.get(root);
      // 更新DiscreteTime
      if (lastDiscreteTime === undefined || lastDiscreteTime > expirationTime) {
        rootsWithPendingDiscreteUpdates.set(root, expirationTime);
      }
    }
  }
}
export const scheduleWork = scheduleUpdateOnFiber;
```

通过上面的代码分析我们了解到了整个 fiber 的创建过程以及提到了一点点的调度，关于怎么执行调度机制会在下一篇文章中进行分析。


## 总结<hr>

### 什么是 fiber<hr>

Fiber 的中文解释是纤程，是线程的颗粒化的一个概念。也就是说一个线程可以包含多个 Fiber。可以使同步计算变得被拆解、异步化，使浏览器主线程得以调控。
通过把更新过程碎片化，当执行完一段更新的时候，把控制权交还给 React 负责任务协调的模块，通过调度系统的任务的优先级去执行更新操作。

### fiber 的实现原理<hr>

通过上面代码我们知道（虽然调度过程还没有分析），fiber 实际上是将需要执行的操作放在 updateQueue 队列中，而不是 Javascript 的栈。通过调度逻辑优先级控制在内存中保留栈帧，从而控制整个渲染。

### fiber 的作用<hr>

- 每一个 ReactElement 对应一个Fiber对象
- 记录每个节点的状态，例如 props 和 state 等
- 会串联整个应用形成树结构


###  fiber-tree<hr>

<img src="/images/library-react-fiber-tree.png">

上面的图就是整个 fiber-tree 的数据结构图，是通过递归 diff的过程，拆分成一系列小任务，通过调度算法，形成的结构。

### 其他 <hr>

由于篇幅过长所以调度流程只分析的大概，但是从上面的源码中我们知道一下几个知识点

- hydrate 的作用
- 在初次渲染时是不会进行批量更新的，因为要加速渲染过程
- FiberNode 中的节点字段信息都有什么含义
- 在初始化创建更新子节点，通过过期时间 expirationTime 来决定批处理的方式
- 任务执行的优先级为 Sync 任务优先级最高 > computeInteractiveExpiration 用户交互更新任务 > computeAsyncExpiration 异步任务的计算
- 进行 setState 的时候在 25ms内执行多次，会被进行合并，这个在后续文章中通过 BatchUpdate 会详细说明
- 所有的数据会放在 fiber 对象的 updateQueue 队列中等待更新操作
- 通过 scheduleWork 开启调度任务，调度任务的优先级通过 expirationTime 计算得出



























































