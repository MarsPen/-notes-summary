---
title: computed 和 watcher 
date: 2019-09-7 22:25:12
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


vue 的 computed 和 watch 是我们在开发中经常用的方法，从而实现数据的响应与监听，下面我们从使用和源码来分析一下这两个属性的实现原理是什么。

### computed 和 watch 使用<hr>

> computed 计算属性，根据依赖的数据动态显示新的计算结果。当依赖的属性值改变之后，通过调用对应的 getter 来计算并进行缓存，计算的属性名称不能在组件的 props 和 data 中定义，否则会报错。

```js
<template>
  <div class="hello">
    {{fullName}}
  </div>
</template>

<script>
export default {
    data() {
      return {
        firstName: 'ren',
        lastName: "bo"
      }
    },
    computed: {
      fullName() {
        return this.firstName + ' ' + this.lastName
      }
    }
}
</script>
```

> watcher 侦听属性，当依赖的 data 的数据变化，执行回调方法，在方法中传入 newVal 和 oldVal。Vue 实例将会在实例化时调用 $watch()，遍历 watch 对象的每一个属性。来实现数据的监听和观察，并在使用watch 的时候可以执行异步操作，设置中间状态等。

```js
<template>
  <div class="hello">
    {{fullName}}
    <button @click="handleChangName">改变姓名</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: 'ren',
      lastName: "bo",
      fullName: ''
    }
  },
  methods: {
    handleChangName() {
      this.firstName = "zhang";
      this.lastName = "san"
    }
  },
  watch: {
    firstName: {
      handler(newval, oldval) {
        console.log(newval)
        console.log(oldval)
        this.fullName = newval + ' ' + this.lastName
      },
      immediate: true
    }
  }
}
</script>
```

watch 只有在数据发生变化的时候，执行回调方法，但是初始化的时候也可以执行，如上面的 firstName 方法中增加 handler 和 immediate 立即执行，具体为什么会立即执行，稍后在做分析，如果我们要监听对象中属性的添加和删除那么我们必须为 watch 中添加 deep 来进行对象深度遍历，进行监听，如下所示

```js
<template>
  <div class="hello">
    {{fullName}}
    <button @click="handleChangName">改变姓名</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      person: {
        name: 'renbo',
        age: 26
      },
      fullName: '',
    }
  },
  methods: {
    handleChangName() {
      this.person.name = "zhangsan";
      this.person.age = 27
    }
  },
  watch: {
    person: {
      handler(newVal, oldVal) {
        this.fullName = newVal.name + newVal.age
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
```

### computed 和 watch 的异同<hr>

通过上面的使用对比

相同点
- computed 和watch 都能起到监听和依赖处理数据
- 都是通过 vue 的监听器实现的

不同点
- computed 主要用于对同步数据的处理
- watch 则主要用于监听某个值的变化去完成开销较大的复杂业务逻辑

主要的应用场景就是如果一个数据依赖另一个数据那么就用 computed，如果在监听数据发生变化去实现某一些功能，状态，异步等那就就用 watch，但是由于 watch 使用deep进行深度遍历监听会消耗性能，所以还是尽量少用 

### computed 本质 -- computed watch<hr>

前面分析过 new Vue() 的时候会调用 _init 方法，该方法会初始化生命周期，初始化事件，初始化render，初始化data，computed，methods，wacther等等，不清楚大致流程的请参考另一篇文章 <a href="https://www.studyfe.cn/2019/08/27/vue/vueprinciple/#toc-heading-12">vue 的主线流程</a>。计算属性的初始化是发生在 vue 实例初始化阶段的 initState 函数中

```js
 export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```
上面进行了判断，我们先来看看 opts.computed 存在的情况执行 initComputed 方法，该方法定义在`src/core/instance/state.js` 中

```js
// 用于传入 Watcher 实例的一个对象，即computed watcher
const computedWatcherOptions = { lazy: true }
function initComputed (vm: Component, computed: Object) {
  // 声明 watchers，同时在实例上挂载 _computedWatchers
  const watchers = vm._computedWatchers = Object.create(null)
  // 计算属性在 ssr 模式在只能使用 getter 方法
  const isSSR = isServerRendering()

  for (const key in computed) {
    // 遍历取出 computed 对象中的每个方法并赋值给 userDef
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    if (!isSSR) {
      // 如果不是SSR服务端渲染，则创建一个watcher实例
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // 组件定义的计算属性已经在组件原型上定义。我们只需要定义在实例化时定义的计算属性。
    if (!(key in vm)) {
      // 如果computed 中的 key 没有设置到 vm 中，通过defineComputed函数挂载上去
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      // props 和 data 中不能和 computed 的 key 同名
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
```

通过上面源码我们发现它先声明了一个名为 watchers 的空对象，同时在 vm 上也挂载了这个空对象。接着对 computed 对象做遍历，拿到每个 userDef，如果 userDef 是 function 的话就赋给 getter，如果不是服务端渲染，就会为这个 getter 创建一个 watcher，这个 watcher 和渲染 watcher 有一点很大的不同，我们在新建实例的时候传入了第四个参数 computedWatcherOptions，其实也就是在代码的第一行，`const computedWatcherOptions = { lazy: true }`，这个对象是实现computed watcher的关键，这样watcher 中就出现了变化，watcher 定义在 `src/core/observer/watcher.js`

```js
// ...

// options
if (options) {
  this.deep = !!options.deep
  this.user = !!options.user
  this.lazy = !!options.lazy
  this.sync = !!options.sync
  this.before = options.before
} else {
  this.deep = this.user = this.lazy = this.sync = false
}
this.cb = cb
this.id = ++uid // uid for batching
this.active = true
this.dirty = this.lazy // for lazy watchers

// ...
```

上面的 this.lazy 实际上就是 computedWatcherOptions 传递过来的，将 dirty 状态改为 true 之后在 createComputedGetter 方法中
```js
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}

```

可以看到之后执行了 watcher.evaluate()，通过调用 this.get() 方法实际上就是在执行 `value = this.getter.call(vm, vm)`，这样就能执行计算属性定义的 getter 函数

```js
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }
```
之后在执行 watcher.depend() 把自身持有的 dep 添加到当前正在计算的 watcher 中，这个时候 Dep.target 就是这个 computed watcher，最后拿到当前 watcher 的 value，当计算属性依赖的数据发生改变的时候，会触发 setter 过程，通知所有订阅它变化的 watcher 进行更新，执行 watcher.update() 方法

```js
update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
```

### watch 的工作原理<hr>
和 computed 一样也是在执行 initState 的时候执行了 `initWatch(vm, opts.watch)`
```js
 export function initState (vm: Component) {
   // ...
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```
initWatch 方法定义在 `src/core/instance/state.js` 中 

```js
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    // 遍历 watch 取到 key 
    const handler = watch[key]
    if (Array.isArray(handler)) {
      // 因为 Vue 是支持 watch 的同一个 key 对应多个 handler，所以如果 handler 是一个数组，则遍历这个数组
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
```
```js
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
```
通过对 hanlder 的类型做判断，拿到它最终的回调函数，最后调用 `vm.$watch(keyOrFn, handler, options)` 函数，vm.$watch 实际上是执行了 Vue.prototype.$watch

```js
Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
```
通过上面代码可以看到，侦听属性 watch 最终会调用 $watch 方法，这个方法首先判断 cb 如果是一个对象，则调用 createWatcher 方法，这是因为 $watch 方法是用户可以直接调用的，它可以传递一个对象，也可以传递函数。接着执行 const watcher = new Watcher(vm, expOrFn, cb, options) 实例化了一个 watcher，这里需要注意一点这是一个 user watcher，因为 options.user = true。通过实例化 watcher 的方式，一旦我们 watch 的数据发送变化，它最终会执行 watcher 的 run 方法，执行回调函数 cb，上面还有两点需要注意 如果参数传递的 deep ，这样就创建了一个 deep watcher 则会执行

```js
get() {
  let value = this.getter.call(vm, vm)
  // ...
  if (this.deep) {
    traverse(value)
  }
}
```

执行 traverse 函数进行深层递归遍历，那么这样就解决了我们开篇时使用 watch 观察改变一个复杂对象不起作用的问题，那么是 watch 立即执行是怎么做到的呢

```js
// ...
if (options.immediate) {
  try {
    cb.call(vm, watcher.value)
  } catch (error) {
    handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
  }
}
//...
```
通过设置 immediate 为 true，则直接会执行回调函数 cb。这样就会立即执行 watch 属性



### 总结<hr>

通过以上的分析，我们大概了解了计算属性本质上是一个computed watch，侦听属性本质上是一个user watch。计算属性适合在模版渲染中某一个值依赖了其他响应对象甚至是计算属性计算而来，而侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑。