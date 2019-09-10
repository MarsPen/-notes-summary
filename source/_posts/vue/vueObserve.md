---
title: vue 原理解析之响应式
date: 2019-09-5 16:45:09
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

## 响应式对象

提到 vue 的双向数据绑定原理，我们都知道是利用了 `Object.defineProperty` 给数据添加 getter 和 setter，来进行依赖收集和数据派发更新，首先我们再来熟悉一下这个方法

### Object.defineProperty <hr>

MDN 中写到 `Object.defineProperty()` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象

```js

function Person () {}

Object.defineProperty(Person.prototype, 'sayHello', {
  enumerable: true,
  configurable: true,
  get: function () {
    return `my name is ${this.name}`
  },
  set:function (value) {
    this.name = value
  }
})
let p = new Person()
p.name = 'renbo'
console.log(p.sayHello) // my name is renbo
```
我们在实现一个极简版双向绑定

```html

<div>请输入:</div>
<input type="text" id="input">
<div id="content"></div>

```

```js
  
let obj = {}

Object.definePerperty(obj,'text', {

  get:function () {
    console.log('获得的值')
  },
  set:function (newVal) {
    console.log('设置的值')
    document.getElementById('input').value = newVal
    document.getElementById('content').innerHTML = newVal;
  }
})

const input = document.getElementById('input');
input.addEventListener('keyup', function(e){
  obj.text = e.target.value;
})

```

set 提供 setter 方法，当我们对 p.name 做修改的时候会触发 setter 方法， 我们访问 sayHello 的时候会触发 getter 方法，取到对应的值，那么一旦对象拥有了 getter 和 setter，就把这个对象变为自动存取的响应对象

### initState <hr>

在 vue _init 阶段我们还执行了 initState(vm) 方法，我们上篇文章写到这个方法主要是对 props、methods、data、computed 和 wathcer 等属性做了初始化操作,在 `src/core/instance/state.js 中定义`

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

### initProps <hr>

```js
function initProps (vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) {
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      defineReactive(props, key, value)
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  toggleObserving(true)
}
```

从上面代码中我们看到 props 过程，主要就是遍历 propsOptions ，调用 defineReactive 方法和 proxy，但是上面在开发环境中调用 defineReactive 给一个警告，平时我们通过 props 方法来接受父组件所传过来的值，但是这个过程是单项的，父组件可以改变传给子组件的值，但是如果子组件想改变所接受的值并传给父组件是不可以的，会收到这个警告

这个错误告诉我们避免去直接更改 props 因为当父组件重新渲染时，该值就会被覆盖。这个时候就需要用到计算属性或者侦听属性了。

defineReactive 方法和 proxy 具体作用我们在后面介绍。

### initData<hr>

```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
```

initData 主要是遍历data，取到对应的key 调用 proxy ；另一个是调用 observe 方法

### proxy<hr>

平时我们写 vue 的时候我们可以直接在方法中访问 props 和 data，看下面例子

```js

props: {
  name: {
    type: String,
    default () {
      return 'renbo'
    }
  }
},
data:{
  return {
     age: 26
  }
},
methods: {
  sayHello () {
    console.log(this.name, this.age)
  }
}
```

这就是通过 proxy 将 props 和 data 上的属性代理到 vm 实例上，所以我们可以直接通过 this 访问到

那么我们看看 proxy 是如何定义的呢

```js
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

通过 Object.defineProperty 把 target[sourceKey][key] 的读写变成了对 target[key] 的读写，所以对于 props 和 data 而言就是

```js
vm._props.xxx -> vm.xxx
vm._data.xxx -> vm.xxx
```

### observe<hr>

上面在 initData中调用了 observe 函数，进入文件 `src/core/observer/index.js` 中

```js
**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

observe 就是给除了 vnode 的对象类型的数据添加一个观察者实例

如果已经添加过则直接返回，否则在满足一定条件下去 new Observer

接下来我们来看一下 Observer 的作用

```js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

```

Observer 是一个构造函数
- 在constructor 中实例化了 Dep 对象
- 执行了 `def(value, '__ob__', this)`
- 对 value 进行判断，如果是数组调用 observeArray，如果是纯对象调用 walk 
- observeArray 方法中遍历数组再次调用 observer，而 walk 遍历对象的 key 调用 defineReactive

Dep 主要的作用就是进行依赖收集，是整个 getter 的核心，在后面会介绍，def 函数是通过 Object.defineProperty 的封装的，作用是将自身实例添加到数据对象 value 的 `__ob__` 属性上，这样我们在开发中就会看到 data 上对象类型的数据多了一个 `__ob__ `的属性

### defineReactive<hr> 

defineReactive 的作用就是定义一个响应式对象，给对象动态添加 getter 和 setter

```js

/**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}

```

defineReactive 函数

-  new Dep()
-  通过 Object.getOwnPropertyDescriptor 拿到 obj 的属性描述符
-  对子对象递归调用 observe 方法，把所有子属性变成响应式对象
-  利用 Object.defineProperty 给 obj 的属性 key 添加 getter 和 setter


下面我们通过上面的逻辑步骤整理下面一张图

<img src="/images/vue-observer.png" />

通过上面的逻辑和总结发现响应式对象的核心其实就是利用 Object.defineProperty 给数据添加了 getter 和 setter，来进行依赖收集`dep.depend()` 和派发更新 `dep.notify()`

## 依赖收集

通过响应式对象我们知道在 defineReactive 函数内的 Object.defineProperty 定义的 get 内部实例了 Dep

### dep<hr>

```js
const dep = new Dep()
dep.depend()
```

前文说过 Dep 是整个 getter 依赖收集的核心，打开文件在 `src/core/observer/dep.js`

```js

// ...

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

export function pushTarget (_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}

```

### watcher<hr>

我们来看一下 Dep 中主要就是对 Watcher 的一种管理，其中 `subs: Array<Watcher>;` 就是订阅者列表,在Watcher 中进行定义

查看 `src/core/observer/watcher.js`

```js
let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  computed: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  dep: Dep;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

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
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.computed = !!options.computed
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.computed = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.computed // for computed watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    if (this.computed) {
      this.value = undefined
      this.dep = new Dep()
    } else {
      this.value = this.get()
    }
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * Add a dependency to this directive.
   */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
  // ...
}
```

### 依赖收集过程<hr>

当我们在 mount 过程中调用 mountComponent 函数的时候实例化了 `new Watcher`, 然后执行了 `this.get()` 方法
进入 get 函数 会执行 `pushTarget(this)`

打开文件 `src/core/observer/dep.js` 

```js
export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}
```
pushTarget 主要两个作用 
- 把 Dep.target 赋值为当前的 Watcher
- 将 target 进行压栈操作

接着执行

```js
value = this.getter.call(vm, vm)
```
this.getter 对应就是 updateComponent 函数，这实际上就是在执行：

```js
vm._update(vm._render(), hydrating)
```

它会先执行 vm._render() 方法，生成渲染 VNode，访问 vm 上的数据，这样就触发了数据对象的 getter。
每个getter 上都有一个 dep ，这样就是调用 dep.depend() 进行依赖收集

```js
addDep (dep: Dep) {
  const id = dep.id
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id)
    this.newDeps.push(dep)
    if (!this.depIds.has(id)) {
      dep.addSub(this)
    }
  }
}

```

在保证添加的数据的唯一性 后执行 `dep.addSub(this)`

也就是执行了`this.subs.push(sub)`

通过上面的执行顺序，当前的 watcher 已经订阅到了数据 dep 的 subs 数组中，当数据放生改变在进行 dep.notify

接下来执行递归去访问 value，触发它所有子项的 getter

```js
if (this.deep) {
  traverse(value)
}
```

之后执行 popTarget(),打开文件 `src/core/observer/dep.js`

```js
export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

```
这个时候 vm 的数据依赖收集已经完成需要将 Dep.target 改变成上一个状态，完成  Dep.target 渲染，最后执行`this.cleanupDeps()` 进行依赖清空


```js
cleanupDeps () {
  let i = this.deps.length
  while (i--) {
    const dep = this.deps[i]
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this)
    }
  }
  let tmp = this.depIds
  this.depIds = this.newDepIds
  this.newDepIds = tmp
  this.newDepIds.clear()
  tmp = this.deps
  this.deps = this.newDeps
  this.newDeps = tmp
  this.newDeps.length = 0
}
```

在执行 cleanupDeps 函数，首先遍历 deps，移除对 dep.subs 数组中 Wathcer 的订阅，把 newDepIds 和 depIds 交换，newDeps 和 deps 交换，并把 newDepIds 和 newDeps 清空，因为 newDeps 是新添加的 Dep 实例数组，而 deps 表示上一次添加的 Dep 实例数组，所以每次订阅，在subs 中都是最新的，这样就完成了整个依赖收集


## 派发更新
通过 sub 这个数组，当我们修改数据的时候，就可以更新 sub 数组 进行派发更新，下面在进行代码分析这个过程
### setter 逻辑<hr>

通过 `defineReactive` 函数中，定义响应式的 setter 调用了 `dep.notify()` 来通知所有订阅者，我们要更新了。

```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // ...
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

### 派发更新过程<hr>

当我们修改了数据，触发了 setter ，调用 `dep.notify()` ,遍历所有 subs，调用 watcher 的 update 方法

```js
// src/core/observer/dep.js
class Dep {
  // ...
  notify () {
  // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```

```js
// src/core/observer/watcher.js
class Watcher {
  // ...
  update () {
    /* istanbul ignore else */
    if (this.computed) {
      // A computed property watcher has two modes: lazy and activated.
      // It initializes as lazy by default, and only becomes activated when
      // it is depended on by at least one subscriber, which is typically
      // another computed property or a component's render function.
      if (this.dep.subs.length === 0) {
        // In lazy mode, we don't want to perform computations until necessary,
        // so we simply mark the watcher as dirty. The actual computation is
        // performed just-in-time in this.evaluate() when the computed property
        // is accessed.
        this.dirty = true
      } else {
        // In activated mode, we want to proactively perform the computation
        // but only notify our subscribers when the value has indeed changed.
        this.getAndInvoke(() => {
          this.dep.notify()
        })
      }
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
}  
```

在进行 update 的时候会根据不同场景去派发更新，computed 与 sync 我们放在后面来说，这两个状态也就是我们的计算属性（computed）和侦听属性（watch），先看一下 queueWatcher 

```js
// src/core/observer/scheduler.js

const queue: Array<Watcher> = []
let has: { [key: number]: ?true } = {}
let waiting = false
let flushing = false
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```

用 has 保证在同一个 watcher 只添加一次，并且在派发更新的时候每次数据改变并不会都触发 watcher ，而是把watcher添加到队列里面通过执行 nextTick，下面来看一下 `flushSchedulerQueue`

```js

// src/core/observer/scheduler.js

let flushing = false
let index = 0
/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true
  let watcher, id

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort((a, b) => a.id - b.id)

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}
```


首先执行对队列做了从小到大的排序

1. 组件的更新由父到子；因为父组件的创建过程是先于子的，所以 watcher 的创建也是先父后子，执行顺序也应该保持先父后子。

2. 用户的自定义 watcher 要优先于渲染 watcher 执行；因为用户自定义 watcher 是在渲染 watcher 之前创建的。

3. 如果一个组件在父组件的 watcher 执行期间被销毁，那么它对应的 watcher 执行都可以被跳过，所以父组件的 watcher 应该先执行。

其次进行队列遍历

拿到对应的 watcher，执行 watcher.run()。如果在遍历的时候，用户有再添加新的 watcher 动作， 那么就在队列中从后往前找，找到第一个没有插入的 watcher 的 id 比当前队列中 watcher 的 id 的大的位置，放到队列中

```js
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // ...
  }
}
```

这样在执行 `watcher.run()` 时候，通过 `this.get()` 就能得到 watcher 当前的值，然后通过判断 新旧值不等、新值是对象类型、deep 模式中的任何一个条件成立都会触发 watcher 回调，传入新的 value 和 旧的 value，这样我们在我们自定义 watcher 的时候就可以在回调函数中拿到两个值。

当我们数据发生改变的时候，触发setter ，因为 watcher 是一个队列，通过调度进行了优化 在 nextTick 后执行所有 `watcher` 的 run 然后触发所有 watcher 的 update 进行进行 patch

### 总结 <hr>

<img src="/images/vue-dep.png">

通过上面几个模块的分析我们基本知道了 vue 的响应式过程，在生成响应对象的时候需要注意的是，vue 更新对象数组必须用他的全局方法也就是 `vue.set,vue.get,vue.del` 等，否则是不会触发setter，导致视图更新失败。


