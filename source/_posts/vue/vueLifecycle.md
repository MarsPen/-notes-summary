---
title: vue 原理之生命周期
date: 2019-09-21 13:50:28
top: false
cover: false
password:
toc: true
mathjax: false
summary: 
tags:
- vue
categories:
- vue
---

每一个 vue 的实例在创建的时候都经过一系列的初始化操作，在每一个阶段都会有相对应的生命周期钩子函数，来在特定的场景实现一些功能


### 生命周期方法<hr>

- beforeCreate（实例创建前）
- created（实例创建后）
- beforeMount（渲染 DOM 前）
- mounted（渲染 DOM 后）
- beforeUpdate（更新数据前）
- updated（更新数据后）
- beforeDestroy（销毁组件前）
- destroyed（销毁组件后）




### 执行流程 <hr>

通过上面生命周期的方法，看一下来至官网的一张神图，告诉我们大致的工作流程。通过每个阶段的源码来分析，在日常开发中遇到的问题。比如到底那个阶段做请求好，父子组件的生命周期在不同情况的下执行顺序是怎样的。

<img src="/images/lifecycle.png" width="50%">


### callHook<hr>

我们在介绍 vue 主流程的时候知道首先会执行实例的 _init(options)，然后会执行一个 merge options 的逻辑，通过调用 mergeOptions 处理不同的合并策略，其中 mergeHook 就是关于生命周期的

```js
function mergeHook (
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

```

这其中的 LIFECYCLE_HOOKS 的定义在 `src/shared/constants.js` 中：

```js
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
]
```

通过上面我们看到了生命周期的钩子函数， 然后再通过 callHook 就能调用某个生命周期钩子注册的所有回调函数了，callHook 定义在 `src/core/instance/lifecycle.js` 中

```js
export function callHook (vm: Component, hook: string) {
  pushTarget()
  const handlers = vm.$options[hook] 
  const info = `${hook} hook`
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info)
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}
```

上面 callHook 主要执行了 invokeWithErrorHandling 定义在 `src/core/util/error.js` 中

```js
export function invokeWithErrorHandling (
  handler: Function,
  context: any,
  args: null | any[],
  vm: any,
  info: string
) {
  let res
  try {
    res = args ? handler.apply(context, args) : handler.call(context)
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res._handled = true
    }
  } catch (e) {
    handleError(e, vm, info)
  }
  return res
}
```

通过调用 handler.apply(context, args) : handler.call(context)，改变了当前的 this，这就是我们在写生命周期的时候不能用箭头函数的原因。接下来我们继续探讨生命周期的执行时机。

### beforeCreate & created<hr>

这两个钩子函数主要是在 vue 初始化实例阶段，定义在 `src/core/instance/init.js` 中

```js
Vue.prototype._init = function (options?: Object) {
  // ...
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')
  // ...
}
```

可以看到 beforeCreate 是在初始化生命周期、事件，渲染函数之后调用，那么 created 是在初始化 initInjections、initState 等函数之后，那么这里的 initState 在前面的文章说过，主要是初始化 props、data、methods、watch、computed 等属性，所以 beforeCreate 中是不能够操作 data、props 等数据、也不能调用 methods 中定义的函数。 

### beforeMount & mounted <hr>

在 mounted 阶段主要是执行了 mountComponent 方法，核心就是先实例化一个渲染 Watcher，在前面主流程中和响应式数据中我们经常提到两个核型方法 vm._render() 和 vm._update()，用于生成 DOM，mountComponent 方法定义在 `src/core/instance/lifecycle` 中

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    ...
  }
  callHook(vm, 'beforeMount')  // beforeMount 钩子

  let updateComponent
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      //...
      // 渲染 VNode
      const vnode = vm._render()
      // ...

      // 渲染真实 DOM
      vm._update(vnode, hydrating)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  new Watcher(vm, updateComponent, noop, {
    before () {
     // 判断是否 mouted 完成阶段并且没有被销毁
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate') // 数据更新之前
      }
    }
  }, true /* isRenderWatcher */)
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')  // mounted 钩子
  }
  return vm
}
```

通过上面的代码，我们可以看出 beforeMount 钩子函数是在执行 vm._render() 函数渲染 VNode 之前执行的 ，在执行完 vm._update() 把 VNode patch 到真实 DOM 后，执行 mouted 钩子。上面有个逻辑 `vm.$vnode == null` 这表明不是一次组件的初始化过程，而是通过 new Vue() 创建的。当组件的 VNode patch 到 DOM 后，会执行 invokeInsertHook 函数，把 insertedVnodeQueue 里保存的钩子函数依次执行一遍，它的定义在 `src/core/vdom/patch.js` 中

```js
function invokeInsertHook (vnode, queue, initial) {
  // 在真正插入元素后调用，延迟组件根节点的插入钩子，
  if (isTrue(initial) && isDef(vnode.parent)) {
    vnode.parent.data.pendingInsert = queue
  } else {
    for (let i = 0; i < queue.length; ++i) {
      queue[i].data.hook.insert(queue[i])
    }
  }
}
```

该函数会执行 insert 这个钩子函数，对于组件而言，insert 钩子函数的定义在 `src/core/vdom/create-component.js` 中的 componentVNodeHooks 中

```js
const componentVNodeHooks = {
  // ...
  insert (vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    // ...
  },
}
```

每个子组件都是在这个钩子函数中执行 mounted 钩子函数，insertedVnodeQueue 的添加顺序是先子后父，所以对于同步渲染的子组件而言，mounted 钩子函数的执行顺序也是先子后父。

### beforeUpdate & updated <hr>

updated 阶段也就是数据的依赖收集更新阶段，在响应式数据中我们已经提到，在文件 `src/core/instance/lifecycle` 中定义

```js
 new Watcher(vm, updateComponent, noop, {
    before () {
      // 判断是否 mouted 完成阶段并且没有被销毁
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')  // 调用 beforeUpdate 钩子
      }
    }
  }, true /* isRenderWatcher */)

```

通过上面可以看到 beforeUpdate 是在满足 vm._isMounted && !vm._isDestroyed 条件才会被调用的,那么 updated 调用时机是在哪里呢，它被定义在 `src/core/observer/scheduler.js`

```js
function callUpdatedHooks (queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated')
    }
  }
}
```

我们可以看到在执行 updated 之前，对 watcher 队列进行了遍历，只有条件满足当前 watcher 为 vm._watcher 和 mounted 阶段，才会执行 updated 钩子函数，那么接下来我们看一下 watcher 到底做了什么，其实在响应式数据中我们已经分析过，被定义在 `src/instance/observer/watcher.js` 中

```js
export default class Watcher {
  // ...
  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    ...
}
```

在 watcher 实例化的过程中会会判断 isRenderWatcher。 接着把当前 watcher 的实例赋值给 vm._watcher,同时将 watcher 的实例 push 到 vm._watchers 中。通过 vm._watcher 对 vm 上数据变化的监测，当数据发生变化就会重新渲染。所以在 callUpdatedHooks 函数中，只有 vm._watcher 的回调执行完毕后，才会执 updated 钩子函数。所以是通过 watcher 监听实例上的数据变化来控制整个 vue 的渲染流程。

### beforeDestroy & destroyed<hr>

这个阶段也是最后一个阶段进行组件的销毁，它被定义在 `src/core/instance/lifecycle.js` 中

```js
Vue.prototype.$destroy = function () {
    const vm: Component = this
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy')
    vm._isBeingDestroyed = true
    // 从 parent 的 $children 中删掉自身
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm)
    }
    // 删除 watcher
    if (vm._watcher) {
      vm._watcher.teardown()
    }
    let i = vm._watchers.length
    while (i--) {
      vm._watchers[i].teardown()
    }
    ...
    vm._isDestroyed = true
    vm.__patch__(vm._vnode, null)
    callHook(vm, 'destroyed')  // 调用 destroyed 钩子
    // 关闭实例侦听器。
    vm.$off()
    // 删除 __vue__ 引用
    if (vm.$el) {
      vm.$el.__vue__ = null
    }
    // 释放循环引用
    if (vm.$vnode) {
      vm.$vnode.parent = null
    }
  }
}

```

在 $destroy 的执行过程中，它又会执行 `vm.__patch__(vm._vnode, null)` 触发它子组件的销毁钩子函数，这样一层层的递归调用，所以 destroy 钩子函数执行顺序是先子后父，和 mounted 过程一样。

通过上面八种钩子，我们了解了组件销毁阶段的拆卸过程，那么在官网中除了这八种钩子函数其实还有集中不常见的钩子

### activated & deactivated<hr>

这两个钩子函数是 keep-alive 组件独有的。用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 activated 钩子函数。


### errorCaptured<hr>

通过 errorCaptured 钩子可以捕获来自子孙组件的错误，通过设置钩子的返回状态为 false，防止当一个错误被捕获时该组件进入无限的渲染循环，导致程序失败。


### 总结<hr>

通过对上面的理解我们总结一下 vue 生命周期在不同场景的执行顺序

<img src="/images/vue-lifecycle.png">
































