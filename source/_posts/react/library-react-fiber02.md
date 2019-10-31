---
title: React 原理之 FiberRoot 调度过程
date: 2019-10-06 19:20:25
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

上篇文章我们对 fiber 的创建做了大概的了解，并且还引入了 scheduleWork 函数。scheduleWork 函数实际执行了如下几个重要的函数

- checkForNestedUpdates 判断是否有无限循环的 update
- markUpdateTimeFromFiberToRoot 找到 rootFiber 并遍历更新子节点的 expirationTime 
- checkForInterruption 判断是否有高优先级任务打断当前正在执行的任务
- schedulePendingInteractions 立即执行调度任务
- scheduleCallbackForRoot 异步任务立即执行调度任务
- rootsWithPendingDiscreteUpdates 得到 DiscreteTime

## checkForNestedUpdates <hr>

> checkForNestedUpdates 最大更新深度为 50，防止无限循环 

```js
const NESTED_UPDATE_LIMIT = 50;
let nestedUpdateCount: number = 0;
function checkForNestedUpdates() {
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    nestedUpdateCount = 0;
    rootWithNestedUpdates = null;
    invariant(
      false,
      'Maximum update depth exceeded. This can happen when a component ' +
        'repeatedly calls setState inside componentWillUpdate or ' +
        'componentDidUpdate. React limits the number of nested updates to ' +
        'prevent infinite loops.',
    );
  }
  // ...
}

```

## markUpdateTimeFromFiberToRoot <hr>

> markUpdateTimeFromFiberToRoot 

```js
function markUpdateTimeFromFiberToRoot(fiber, expirationTime) {
  //如果fiber对象的过期时间小于 expirationTime，则更新fiber对象的过期时间
  if (fiber.expirationTime < expirationTime) {
    fiber.expirationTime = expirationTime;
  }
  let alternate = fiber.alternate;
  if (alternate !== null && alternate.expirationTime < expirationTime) {
    alternate.expirationTime = expirationTime;
  }

  //向上遍历父节点，直到root节点，在遍历的过程中更新子节点的expirationTime
  let node = fiber.return;
  let root = null;
  // 树的顶层节点 root
  if (node === null && fiber.tag === HostRoot) {
    root = fiber.stateNode;
  } else {
    while (node !== null) {
      alternate = node.alternate;
      if (node.childExpirationTime < expirationTime) {
        node.childExpirationTime = expirationTime;
        if (
          alternate !== null &&
          alternate.childExpirationTime < expirationTime
        ) {
          alternate.childExpirationTime = expirationTime;
        }
      } else if (
        alternate !== null &&
        alternate.childExpirationTime < expirationTime
      ) {
        alternate.childExpirationTime = expirationTime;
      }
      //如果是顶层 rootFiber，结束循环
      if (node.return === null && node.tag === HostRoot) {
        root = node.stateNode;
        break;
      }
      node = node.return;
    }
  }

  if (root !== null) {
    // Update the first and last pending expiration times in this root
    const firstPendingTime = root.firstPendingTime;
    if (expirationTime > firstPendingTime) {
      root.firstPendingTime = expirationTime;
    }
    const lastPendingTime = root.lastPendingTime;
    if (lastPendingTime === NoWork || expirationTime < lastPendingTime) {
      root.lastPendingTime = expirationTime;
    }
  }

  return root;
}
```

通过上面的函数我们知道此函数有如下作用

- 更新 fiber 对象的 expirationTime
- 根据 fiber.return 向上遍历寻找 FiberRoot，并更新父对象的子节点的 childExpirationTime
- 更新该 rootFiber 的新老挂起时间
- 返回 FiberRoot

## checkForInterruption <hr>

> checkForInterruption

```js

function checkForInterruption(
  fiberThatReceivedUpdate: Fiber,
  updateExpirationTime: ExpirationTime,
) {
  if (
    enableUserTimingAPI &&
    workInProgressRoot !== null &&
    updateExpirationTime > renderExpirationTime
  ) {
    // 打断当前任务，优先执行优先级高的任务
    interruptedBy = fiberThatReceivedUpdate;
  }
}

```

## schedulePendingInteractions<hr>

> schedulePendingInteractions

```js
function schedulePendingInteractions(root, expirationTime) {
  if (!enableSchedulerTracing) {
    return;
  }
  // 如果是同步任务并且是初次渲染的话，则会先执行
  // __interactionsRef 设置当前跟踪的 interactions 栈
  scheduleInteractions(root, expirationTime, __interactionsRef.current);
}
```

> scheduleInteractions

```js
// 和 schedule 的交互
function scheduleInteractions(root, expirationTime, interactions) {
  if (!enableSchedulerTracing) {
    return;
  }

  if (interactions.size > 0) {
    const pendingInteractionMap = root.pendingInteractionMap;
    const pendingInteractions = pendingInteractionMap.get(expirationTime);
    if (pendingInteractions != null) {
      // 遍历并更新还未调度的同步任务的数量
      interactions.forEach(interaction => {
        if (!pendingInteractions.has(interaction)) {
          interaction.__count++;
        }

        pendingInteractions.add(interaction);
      });
    } else {
      // 重新设置 fiberRoot 上的 pendingInteractionMap
      pendingInteractionMap.set(expirationTime, new Set(interactions));

      // 获取当前调度中同步任务的数量
      interactions.forEach(interaction => {
        interaction.__count++;
      });
    }

    const subscriber = __subscriberRef.current;
    if (subscriber !== null) {
      const threadID = computeThreadID(root, expirationTime);
      // 利用线程去查看同步的更新任务是否会报错
      subscriber.onWorkScheduled(interactions, threadID);
    }
  }
}
```

通过上面代码 scheduleInteractions 的主要作用是

- 获取 fiber 上的 pendingInteractionMap 属性
- 通过 pendingInteractionMap 获取 expirationTime
- 获取每次 schedule 所需的 update 任务的集合


## scheduleCallbackForRoot<hr>
 
在render()之后，立即执行调度任务

```js
function scheduleCallbackForRoot(
  root: FiberRoot,
  priorityLevel: ReactPriorityLevel,
  expirationTime: ExpirationTime,
) {
  // 获取root的回调过期时间
  const existingCallbackExpirationTime = root.callbackExpirationTime;
  // 更新root的回调过期时间
  if (existingCallbackExpirationTime < expirationTime) {
    // 当新的expirationTime比已存在的callback的expirationTime优先级更高的时候
    const existingCallbackNode = root.callbackNode;
    if (existingCallbackNode !== null) {
      // 打断已存在的 callback）
      // 将已存在的 callback 节点从链表中移除
      cancelCallback(existingCallbackNode);
    }
    // 更新callbackExpirationTime
    root.callbackExpirationTime = expirationTime;
    // 如果是同步任务
    if (expirationTime === Sync) {
      // 在临时队列中同步被调度的 callback
      root.callbackNode = scheduleSyncCallback(
        runRootCallback.bind(
          null,
          root,
          renderRoot.bind(null, root, expirationTime),
        ),
      );
    } else {
      let options = null;
      if (
        !disableSchedulerTimeoutBasedOnReactExpirationTime &&
        expirationTime !== Never
      ) {
        let timeout = expirationTimeToMs(expirationTime) - now();
        options = {timeout};
      }
      // callbackNode 即经过处理包装的新任务
      root.callbackNode = scheduleCallback(
        priorityLevel,
        runRootCallback.bind(
          null,
          root,
          renderRoot.bind(null, root, expirationTime),
        ),
        options,
      );
      if (
        enableUserTimingAPI &&
        expirationTime !== Sync &&
        (executionContext & (RenderContext | CommitContext)) === NoContext
      ) {
        // 开始调度 callback 的标志
        startRequestCallbackTimer();
      }
    }
  }

  // 跟踪队列，并计数检查是否报错
  schedulePendingInteractions(root, expirationTime);
}
```

通过上述代码我们知道 scheduleCallbackForRoot 的主要作用是

- 对比任务优先级如果新的 scheduleCallback 的优先级更高时，中断当前任务(cancelCallback）
- 如果是同步任务，调用 scheduleSyncCallback 在临时队列中进行调度，否则更新调度队列的状态
- 设置开始调度的时间节点并通过 schedulePendingInteractions 计数跟踪队列的更新情况


通过上面 scheduleCallbackForRoot 方法，我们知道 Fiber 机制可以为每一个任务进行优先级排序，同时可以根据任务的优先级中断正在执行的任务，当优先级高的任务执行之后，还可以继续之前被中断的任务。在这个期间可以记录任务调度执行到了哪里。那么下面我们具体看看 scheduleCallbackForRoot 调用的几个重要的方法

### cancelCallback

> cancelCallback 中断正在执行的任务

定义在文件 /packages/react-reconciler/src/SchedulerWithReactIntegration.js

```js
export function cancelCallback(callbackNode: mixed) {
  if (callbackNode !== fakeCallbackNode) {
    Scheduler_cancelCallback(callbackNode);
  }
}

// 引入的单独 Scheduler 库
const { unstable_cancelCallback: Scheduler_cancelCallback } = Scheduler;
// 定义在 packages/scheduler/src/Scheduler.js
function unstable_cancelCallback(task) {
  // 获取 callbackNode 的 next 节点 
  var next = task.next;
  // 如果等于 null 说明当前节点已经不存在
  if (next === null) {
    // Already cancelled.
    return;
  }
  // 如果 task === next 相等说明链表结构中只有一个 callbackNode 
  if (task === next) {
    // 重置 firstTask / firstDelayedTask
    if (task === firstTask) {
      firstTask = null;
    } else if (task === firstDelayedTask) {
      firstDelayedTask = null;
    }
  } else {
    // 将 firstTask / firstDelayedTask 指向下一个节点
    if (task === firstTask) {
      firstTask = next;
    } else if (task === firstDelayedTask) {
      firstDelayedTask = next;
    }
    // 链表操作
    var previous = task.previous;
    previous.next = next;
    next.previous = previous;
  }
  // 删除已经存在的 callbackNode
  task.next = task.previous = null;
}

```

通过上面代码的上下文我们知道，通过操作 schedule 链表，通过对比正在执行任务的优先级来确定是否要移除正在执行的 callbackNode，将节点指向下一个调度任务

### scheduleSyncCallback <hr>

> scheduleSyncCallback 同步任务，将调度任务放入队列，并返回临时队列

```js

export function scheduleSyncCallback(callback: SchedulerCallback) {
  // 将此回调推入内部队列，如果同步队列为空，则初始化同步队列并在
  // 在下一次调度的时候刷新，或者更早的时候调用‘flushSyncCallbackQueue’。
  if (syncQueue === null) {
    syncQueue = [callback];
    // 最快在下一次刷新队列
    immediateQueueCallbackNode = Scheduler_scheduleCallback(
      Scheduler_ImmediatePriority,
      // 循环遍历 syncQueue，并更新节点的isSync状态，更新同步队列
      flushSyncCallbackQueueImpl,
    );
  //如果同步队列不为空，则将 callback push 到队列
  } else {
   // push 现有队列。不需要调度 callback，因为在创建队列时已经调度了回调
    syncQueue.push(callback);
  }
  return fakeCallbackNode;
}

```


### scheduleCallback<hr>

> scheduleCallback 异步任务，对 callback 进行包装返回新的 task 并更新调度队列的状态

```js
// 调用 Scheduler_scheduleCallback
export function scheduleCallback(
  reactPriorityLevel: ReactPriorityLevel,
  callback: SchedulerCallback,
  options: SchedulerCallbackOptions | void | null,
) {
  const priorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);
  return Scheduler_scheduleCallback(priorityLevel, callback, options);
}
 
// 引入单独 scheduler 库
const { unstable_scheduleCallback: Scheduler_scheduleCallback } = Scheduler;

// 定义在 packages/scheduler/src/Scheduler.js
function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = getCurrentTime();

  var startTime;
  var timeout;
  // 在上面执行同步任务队列为空的时候也调用了一次 
  // scheduleCallback 但传入了两个参数
  // 所以可以用来区分来区分执行的时候执行时机
  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;
    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
    timeout =
      typeof options.timeout === 'number'
        ? options.timeout
        : timeoutForPriorityLevel(priorityLevel);
  } else {

    /**
    * 根据传入任务的优先级来判断当前执行的 timeout
    * 立即执行 ImmediatePriority timeout -1 
    * 用户交互优先级 UserBlockingPriority  timeout 250
    * 普通优先级 NormalPriority timeout 5000
    * 闲置的优先级 IdlePriority timeout 1073741823
    * 低优先级 LowPriority timeout 10000
    */

    timeout = timeoutForPriorityLevel(priorityLevel);
    startTime = currentTime;
  }

  // expirationTime = 当前时间 + 5s 后
  var expirationTime = startTime + timeout;
  // 组成新的 task 结构
  var newTask = {
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    next: null,
    previous: null,
  };

  // 延期任务
  if (startTime > currentTime) {
    // 将延期的 task 插入到队列中 
    insertDelayedTask(newTask, startTime);
    //判断调度队列的 firstTask 任务为 null，并且 firstDelayedTask 调度队列的头任务正好是 newTask，
    //说明所有任务均延期，并且此时的任务是第一个延期任务
    if (firstTask === null && firstDelayedTask === newTask) {
      // 如果延迟调度开始的 flag 为 true，则取消定时的时间
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      // Schedule a timeout.
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
    // 正常任务
  } else {
    // 按照正常的执行任务插入 task 
    insertScheduledTask(newTask, expirationTime);
    // 是否更新调度的标志
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      // 更新调度执行
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}

```

通过上面的代码我们知道 Scheduler_scheduleCallback 的主要作用是

- 确定当前时间 startTime 和延迟更新时间 timeout
- 新建 newTask 包装对象
- 如果是延迟任务则将 newTask 放入延迟调度队列并执行 requestHostTimeout
- 如果是正常任务则将 newTask 放入正常调度队列并执行 requestHostCallback
- 返回新的 newTask


从上面的段落总结中我们看到 Scheduler_scheduleCallback 的作用，根据任务的不同去执行了 requestHostTimeout 和 requestHostCallback，由于这两个方法分为非 DOM 环境和 DOM 环境，我们只看 DOM 环境的实现即可

定义在文件 /packages/scheduler/src/forks/SchedulerHostConfig.default.js


### requestHostTimeout <hr>

> requestHostTimeout

```js
function handleTimeout(currentTime) {
  // 延期开启的 flag
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);
  // 是否开始更新调度的 flag
  if (!isHostCallbackScheduled) {
    // 如果第一个任务不为 null 
    if (firstTask !== null) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    // 如果第一个延时任务不为null
    } else if (firstDelayedTask !== null) {
      // 继续递归执行 requestHostTimeout
      requestHostTimeout(
        handleTimeout,
        firstDelayedTask.startTime - currentTime,
      );
    }
  }
}

requestHostTimeout(handleTimeout, startTime - currentTime);

requestHostTimeout = function(callback, ms) {
  taskTimeoutID = setTimeout(() => {
    callback(getCurrentTime());
  }, ms);
};
```

通过上面的代码我理解为如果是延期的任务，插入队列中。通过计算延期任务的时间和当前的最新时间来递归执行 requestHostTimeout，直到 isHostTimeoutScheduled 标志为 true 执行取消定时器函数。当 startTime < currentTime后插入正常任务队列执行 requestHostCallback


### requestHostCallback 

> requestHostCallback 在每一帧内执行调度任务

```js
requestHostCallback = function(callback) {
  // callback 就是 flushWork 回调用 workLoop 来执行任务
  scheduledHostCallback = callback;
  // 默认为 false
  if (enableMessageLoopImplementation) {
    if (!isMessageLoopRunning) {
      isMessageLoopRunning = true;
      port.postMessage(null);
    }
  } else {
    // 默认为 false 当执行一次循环后 isRAFLoopRunning 为 true 
    if (!isRAFLoopRunning) {
      // 开始一个 rAF (requestAnimationFrame) 循环。
      isRAFLoopRunning = true;
      requestAnimationFrame(rAFTime => {
        // 默认 false 
        if (requestIdleCallbackBeforeFirstFrame) {
          cancelIdleCallback(idleCallbackID);
        }
        // 默认 false 
        if (requestTimerEventBeforeFirstFrame) {
          clearTimeout(idleTimeoutID);
        }
        onAnimationFrame(rAFTime);
      });

      // 如果错过了上一个 vsync，下一个 rAF 可能就不会出现在另一个帧上
      // 为了争取尽可能多的空闲时间，使用 requestIdleCallback 发布一个回调
      // 如果帧中还有空闲时间，它应该被触发。这样就不会影响页面的刷新渲染，用户不会感到卡顿
      let idleCallbackID;
      if (requestIdleCallbackBeforeFirstFrame) {
        idleCallbackID = requestIdleCallback(
          function onIdleCallbackBeforeFirstFrame() {
            if (requestTimerEventBeforeFirstFrame) {
              clearTimeout(idleTimeoutID);
            }
            frameDeadline = getCurrentTime() + frameLength;
            performWorkUntilDeadline();
          },
        );
      }
      // 如果这是在 rAF 之前触发的，则很可能表示在下一次 vsync 之前有空闲时间。
      let idleTimeoutID;
      if (requestTimerEventBeforeFirstFrame) {
        idleTimeoutID = setTimeout(function onTimerEventBeforeFirstFrame() {
          if (requestIdleCallbackBeforeFirstFrame) {
            cancelIdleCallback(idleCallbackID);
          }
          frameDeadline = getCurrentTime() + frameLength;
          performWorkUntilDeadline();
        }, 0);
      }
    }
  }
};
```

从上面的代码中大概知道 requestHostCallback 主要是调用了如下几个方法

- requestAnimationFrame
- onAnimationFrame
- requestIdleCallback
- performWorkUntilDeadline

下面我们对上面的方法慢慢拆解

 > requestAnimationFrame 定义为 window.requestAnimationFrame

该方法告诉浏览器你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行（<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame">来至MDN</a>）


> onAnimationFrame

```js
const onAnimationFrame = rAFTime => {
  if (scheduledHostCallback === null) {
    prevRAFTime = -1;
    prevRAFInterval = -1;
    isRAFLoopRunning = false;
    return;
  }

  // 在帧的开头安排下一个动画回调
  // 这样能够确保它在尽可能早的框架内被触发，如果等到帧的末尾才发布回调
  // 那么就冒着浏览器跳过一帧的风险，直到那之后的帧才触发回调
  // 如果调度器队列在帧结束时不是空的，它将继续在回调中刷新
  // 如果队列是空的，那么它将立即退出
  isRAFLoopRunning = true;
  requestAnimationFrame(nextRAFTime => {
    clearTimeout(rAFTimeoutID);
    onAnimationFrame(nextRAFTime);
  });

  const onTimeout = () => {
    frameDeadline = getCurrentTime() + frameLength / 2;
    performWorkUntilDeadline();
    rAFTimeoutID = setTimeout(onTimeout, frameLength * 3);
  };
  rAFTimeoutID = setTimeout(onTimeout, frameLength * 3);

  if (
    prevRAFTime !== -1 &&
    // 确保这次 rAF 的时间与上次不同，保证不再同一帧内同时执行任务
    rAFTime - prevRAFTime > 0.1
  ) {
    const rAFInterval = rAFTime - prevRAFTime;
    if (!fpsLocked && prevRAFInterval !== -1) {
      // 观察两个连续的帧间隔。使用它来动态调整帧速率。
      // 如果一帧很长，那么下一帧就会很短。如果连续两帧都很短，那就说明我们的帧率比当前优化的帧率要高。
      // 动态调整帧率。例如，如果我们在 120h z显示器或 90hz VR 显示器上运行。取两个中的最大值，以防其中一个由于错过帧而异常
      if (rAFInterval < frameLength && prevRAFInterval < frameLength) {
        frameLength =
          rAFInterval < prevRAFInterval ? prevRAFInterval : rAFInterval;
        if (frameLength < 8.33) {
          // 防御性编码。不支持高于120hz的帧速率
          // 如果计算出的帧长度小于8，这可能是一个bug 
          frameLength = 8.33;
        }
      }
    }
    prevRAFInterval = rAFInterval;
  }
  prevRAFTime = rAFTime;
  frameDeadline = rAFTime + frameLength;
  // 使用 postMessage 技巧将空闲的任务延迟到重新绘制之后
  port.postMessage(null);
};
```

> requestIdleCallback 定义为 window.requestIdleCallback

window.requestIdleCallback()方法将在浏览器的空闲时段内调用的函数排队。这使开发人员能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间timeout，则有可能为了在超时前执行函数而打乱执行顺序。<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback">来至MDN</a>

> performWorkUntilDeadline 

由于 enableMessageLoopImplementation 为 false 所以我们只看 else 中的逻辑

```js
const performWorkUntilDeadline = () => {
  if (enableMessageLoopImplementation) {
      // ...
  } else {
    // 当前有任务需要执行
    if (scheduledHostCallback !== null) {
      const currentTime = getCurrentTime();
      // 
      const hasTimeRemaining = frameDeadline - currentTime > 0;
      try {
        // 开始执行任务
        const hasMoreWork = scheduledHostCallback(
          hasTimeRemaining,
          currentTime,
        );
        // 调度任务结束
        if (!hasMoreWork) {
          scheduledHostCallback = null;
        }
      } catch (error) {
        port.postMessage(null);
        throw error;
      }
    }
    // 浏览器绘制的标志
    needsPaint = false;
  }
};

const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;

```

通过拆解注释我们总结一下 requestHostCallback 的主要作用

- 利用浏览器的 window.requestAnimationFrame API 在每一帧之后的空闲时间开始执行任务。
- onAnimationFrame 会加入 event loop，进行递归也就是每一帧执行一次，当下一帧执行 onAnimationFrame 的时候，之前就已经计算出了 nextRAFTime。直到任务队列为空。
- 在执行 onAnimationFrame 期间对 frameDeadline 进行计算 `frameDeadline = getCurrentTime() + frameLength / 2` 得到当前帧的截止时间（33.33/2）16.7ms
- 如果错过了上一个requestAnimationFrame，则通过 window.requestIdleCallback 在发布一个回调，在帧中还有空余时间的时候会被触发，这样用户就不会感觉到卡顿。
- 最后通过 onmessage 接受 postMessage 指令, 触发消息事件的执行最终执行 scheduledHostCallback（也就是 flushWork）

上面说到 scheduledHostCallback 实际上就是 flushWork，那么接下来我们分析 flushWork 

### flushWork

> flushWork

```js
function flushWork(hasTimeRemaining, initialTime) {
  if (enableSchedulerDebugging && isSchedulerPaused) {
    return;
  }
  // 调度任务是否执行的标志
  isHostCallbackScheduled = false;
  if (isHostTimeoutScheduled) {
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  let currentTime = initialTime;
  // 检查是否有没过期的任务，并把它们加入到新的调度队列中
  advanceTimers(currentTime);

  isPerformingWork = true;
  try {
    // hasTimeRemaining = frameDeadline - currentTime > 0
    // 在一帧内执行的时间超时
    if (!hasTimeRemaining) {
      // 一直执行过期的任务，直到到达一个不过期的任务为止
      while (
        firstTask !== null &&
        // 如果 firstTask.expirationTime一直 >= currentTime，则递归执行 flushTask 方法
        firstTask.expirationTime <= currentTime &&
        !(enableSchedulerDebugging && isSchedulerPaused)
      ) {
        flushTask(firstTask, currentTime);
        currentTime = getCurrentTime();
        advanceTimers(currentTime);
      }
    } else {
      // 不断刷新回调，直到在帧中耗尽时间
      if (firstTask !== null) {
        do {
          flushTask(firstTask, currentTime);
          currentTime = getCurrentTime();
          advanceTimers(currentTime);
        } while (
          firstTask !== null &&
          // 比较 frameDeadline 和 currentTime，如果当前帧还有时间的话，就一直执行
          !shouldYieldToHost() &&
          !(enableSchedulerDebugging && isSchedulerPaused)
        );
      }
    }
    // Return whether there's additional work
    if (firstTask !== null) {
      return true;
    } else {
      if (firstDelayedTask !== null) {
        // 执行延期的任务
        requestHostTimeout(
          handleTimeout,
          firstDelayedTask.startTime - currentTime,
        );
      }
      return false;
    }
  } finally {
    isPerformingWork = false;
  }
}

```

通过上面注释我们了解到 flushWork 的主要作用
- 判断是否是超时任务，如果是则调用 cancelHostTimeout 取消执行的调度任务
- 调用 advanceTimers 重新检查是否有没过期的任务，将他们加入到新的调度队列
- 执行调度队列将 isPerformingWork 标志改为 true 
- 判断一帧内的剩余时间，执行调度队列，分为以下情况

**如果剩余时间小于0，调度队列存在且调度任务过期**
  1. 调用 flushTask()，从调度队列中取出调度任务并执行，之后将调度任务生出的子调度任务插入到其后
  2. 调用 getCurrentTime()，刷新当前时间
  3. 调用 advanceTimers()，检查是否有不过期的任务，并把它们加入到新的调度队列中 

**如果剩余时间大于0，调度队列存在且调度任务未被中断**
  1. 调用 flushTask()，从调度队列中取出调度任务并执行，执行调度任务生出的子调度任务
  2. 调用 getCurrentTime()，刷新当前时间
  3. 调用 advanceTimers()，检查是否有不过期的任务，并把它们加入到新的调度队列中

如果调度任务都执行完毕，则返回 true，否则返回 false，执行延期的任务

## 总结

至此，React 的基础调度流程便算是走了一遍，下面我们就16.9版本代码的执行顺序看一下流程图
<image src="/images/library-react-schedule.jpg" />


其实16.9和16.8 在调度流程上还是有一定区别的那么我们看一下16.8的整个调度流程，对比学习，更有助于加深理解。
<image src="/images/scheduler-fiber-scheduler.png" />

## 相关文章

<a href="https://juejin.im/post/5dadc6045188255a270a0f85">React Fiber(时间分片)</a>















































