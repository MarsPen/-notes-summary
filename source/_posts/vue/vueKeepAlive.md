---
title: vue 原理之keep-alive
date: 2019-09-22 20:55:12
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

在我们的平时开发工作中，有很多组件没有必要多次初始化，通过缓存组件的状态减少性能上的开销。而 vue 的组件缓存优化则使用内置组件 <keep-alive>

### 基本用法

```js
<keep-alive>
  <component />
</keep-alive>
```
上面代码示例说明被 keep-alive 包含的组件已经成为被缓存的组件，只渲染一次，也就是说生命周期也不起任何作用。但是如果你想要重新在某一个时机想要重新渲染，keep-alive 内置组件提供了两个钩子函数

- activated 当 keepalive 包含的组件再次渲染的时候触发
- deactivated 当 keepalive 包含的组件销毁的时候触发

vue 对 keep-alive 内置组件还提供了 3个属性作为参数进行匹配对应的组件进行缓存

- include 通过字符串、数组、正则表达式进行匹配，匹配到的组件会进行缓存
- exclude 通过字符串、数组、正则表达式进行匹配，匹配到的组件不会进行缓存
- max 通过设置字符或者数字控制组件缓存的最大个数

```js
// 只缓存a或者b组件
<keep-alive include="a,b"> 
  <component />
</keep-alive>

// c组件不被缓存
<keep-alive exclude="c"> 
  <component />
</keep-alive>

// 缓存的最大个数
<keep-alive  max="5"> 
  <component />
</keep-alive>

// 如果同时使用 exclude 优先级高于 include 所以只缓存 a,c 组件
<keep-alive include="a,b,c" exclude="b"> 
  <component />
</keep-alive>
```
### 配合 router

```js
<keep-alive :include="cacheList">
  <router-view />
</keep-alive>
```
只有路径匹配到的 name 是 cacheList 方法中返回的组件名称就会被缓存，当然也可以所有路由都缓存

```js
<keep-alive>
  <router-view>
      <!-- 所有路径匹配到的视图组件都会被缓存！ -->
  </router-view>
</keep-alive>
```

也可以使用 meta 属性单独控制路由的缓存

```js
// routes 配置
export default [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      keepAlive: true // 需要被缓存
    }
  }, {
    path: '/user-registration',
    name: 'user-registration',
    component: UserRegistrationManager,
    meta: {
      keepAlive: false // 不需要被缓存
    }
  }
]
```

```js
<keep-alive>
  <router-view v-if="$route.meta.keepAlive">
    <!-- 这里是会被缓存的视图组件，比如 Home！ -->
  </router-view>
</keep-alive>

<router-view v-if="!$route.meta.keepAlive">
  <!--   -->
</router-view>
```

### 源码理解

通过上面的例子我们已经基本的了解了 keep-alive 的使用，接下来我们通过源码来分析它的实现，它定义在`定义在 src/core/components/keep-alive.js`

```js
export default {
  name: 'keep-alive,
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created () {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render () {
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
```

通过上面源码我们可以看到通过 getFirstComponentChild 函数获取第一个子节点，<keep-alive> 只处理第一个子元素，所以一般和它搭配使用的有 component 动态组件或者是 router-view，之后又根据传的 include 和 exclude， 用 matches 去做匹配，如果命中缓存则直接从缓存中拿 vnode 组件实例，重新调整 key 的顺序，放在最后一个，否则重新放进缓存，如果配置了 max 并且缓存的长度超过了 this.max 则要从缓存中删除第一个

```js
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null 
  remove(keys, key)
}
```


### 首次渲染
我们前面介绍过渲染最后在 patch 过程中会执行 createComponent 方法

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

当 vnode 已经执行完 patch 后，执行 initComponent 函数：

```js
function initComponent (vnode, insertedVnodeQueue) {
  if (isDef(vnode.data.pendingInsert)) {
    insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert)
    vnode.data.pendingInsert = null
  }
  vnode.elm = vnode.componentInstance.$el
  if (isPatchable(vnode)) {
    invokeCreateHooks(vnode, insertedVnodeQueue)
    setScope(vnode)
  } else {
    // empty component root.
    // skip all element-related modules except for ref (#3455)
    registerRef(vnode)
    // make sure to invoke the insert hook
    insertedVnodeQueue.push(vnode)
  }
}
```

这里会有 vnode.elm 缓存了 vnode 创建生成的 DOM 节点。所以对于首次渲染而言，除了在 <keep-alive> 中建立缓存，和普通组件渲染没什么区别。

### 缓存渲染

当数据发送变化，在 patch 执行 patchVnode 的逻辑,对比新旧节点之前 会执行 prepatch 函数,定义在 `src/core/vdom/create-component` 中

```js
const componentVNodeHooks = {
  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  },
  // ...
}
```

它会执行 updateChildComponent 方法，定义在 `src/core/instance/lifecycle.js` 中

```js
export function updateChildComponent (
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: MountedComponentVNode,
  renderChildren: ?Array<VNode>
) {
  const hasChildren = !!(
    renderChildren ||          
    vm.$options._renderChildren ||
    parentVnode.data.scopedSlots || 
    vm.$scopedSlots !== emptyObject 
  )

  // ...
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context)
    vm.$forceUpdate()
  }
}
```

上面看到在执行过中会 触发 <keep-alive> 组件实例 $forceUpdate 逻辑，也就是重新执行 <keep-alive> 的 render 方法，如果这个时候命中缓存，则直接返回 vnode.componentInstance ，再次执行 createComponent 

```js
unction createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

这个时候 isReactivated 为 true，就会执行 reactivateComponent 方法

```js
unction reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i
  // hack for #4339: a reactivated component with inner transition
  // does not trigger because the inner node's created hooks are not called
  // again. It's not ideal to involve module-specific logic in here but
  // there doesn't seem to be a better way to do it.
  let innerNode = vnode
  while (innerNode.componentInstance) {
    innerNode = innerNode.componentInstance._vnode
    if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
      for (i = 0; i < cbs.activate.length; ++i) {
        cbs.activate[i](emptyNode, innerNode)
      }
      insertedVnodeQueue.push(innerNode)
      break
    }
  }
  // unlike a newly created component,
  // a reactivated keep-alive component doesn't insert itself
  insert(parentElm, vnode.elm, refElm)
}
```

这个时候会执行 insert(parentElm, vnode.elm, refElm) 就把缓存的 DOM 对象直接插入到目标元素中，所以就不会在执行组件的 created、mounted 等钩子函数了。

<keep-alive> 组件的钩子函数 activated 和 deactivated,则是定义在 insert 方法中,定义在 `src/core/vdom/create-component.js` 

```js
const componentVNodeHooks = {
  insert (vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance)
      } else {
        activateChildComponent(componentInstance, true /* direct */)
      }
    }
  },
  // ...
}
```

通过判断包裹组件是否被 mounted 分别执行 queueActivatedComponent(componentInstance) 和 activateChildComponent(componentInstance, true)

在上述两个方法中会执行 callHook(vm, 'activated') 钩子函数，唯一不同点是 queueActivatedComponent 是等所有的渲染完毕，在 nextTick后会执行 flushSchedulerQueue，通过队列的方式就是把整个 activated 时机延后的，而组件的 deactivated 钩子，也是同理进行递归销毁。













