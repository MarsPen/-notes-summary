---
title: vue-router 原理
date: 2018-08-10 22:01:12
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

路由的概念，在现在的前端领域其实不算陌生。它的作用就是根据不用的路径去映射到不同的视图。

## 后端路由

路由的概念实际上是从后端开始由来的，后端根据不同的路径去匹配不同的资源例如

```js
https://www.studyfe.cn/login
```
大致流程可以分为以下几个阶段

- 浏览器发送请求
- 服务器监听到请求，解析 url 路径
- 根据路由配置，返回资源信息
- 浏览器通过解析资源信息，呈现到前端页面

## 前端路由

### hash 模式<hr>

在 HTML5 的 history 没有出来之前，要实现前端路由机制而不请求后端资源就应用到了 hash 模式，hash 是指 url 尾巴后的 # 号及后面的字符。也被常称为锚点。hash 改变会触发 hashchange 事件，也能对浏览器的前进后退进行控制

```js
window.location.hash = '#toc-heading-1'
window.addEventListener('hashchange', function(){ 
  // 根据业务场景进行控制
})
```

### history 模式<hr>

HTML5标准发布。多了两个 API，history.pushState 和 history.replaceState 来进行路由控制。通过这两个方法可以改变 url 且不向服务器发送请求。比较两种方法

- history 比 hash 更美观，url 后面不会多一个 #，
- history API 可以是更灵活的控制前端路由，例如前进后退等等
- history 模式在用户刷新的时候需要服务端支持进行重定向，避免出现错误
- hash 传参是基于 url 的如果要传递复杂数据会有体积限制
- hash 兼容到 IE8， history 兼容到 IE10

```js
/**
 * @param state：状态对象，通过pushState () 创建新的历史记录条目。大小不能超过640k
 * @param title：标题，基本没用，一般传 null。Firefox 目前忽略这个参数
 * @param url：该参数定义了新的历史URL记录。新的 url 与当前 url 的 origin 必须一样，否则会抛出错误
 */
window.history.pushState(state, title, url) 
// 示例
window.history.pushState('https://www.studyfe.cn/2018/08/10/vue/vueroute', null, "/2019/08/27/vue/vueprinciple/") 

// 修改当前历史记录与 pushState 类似
window.history.replaceState(state, title, url) 

 // 监听浏览器前进后退事件
window.addEventListener("popstate", function(e) {
  console.log(e)            
});

window.history.back() // 后退
window.history.forward() // 前进
window.history.go(1) // 前进一步
window.history.length // 查看当前记录的栈的数量
```
## vue-router

vue-router 在开发中 vue 项目中起到了非常大的作用，它支持 hash、history、abstract 3 种路由方式，提供了提供了 <router-link> 和 <router-view> 2 种组件和一系列的路由配置

使用 <router-link> 和 <router-view> 组件进行路由操作

```html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```

使用 vue-cli 我们经常会在入口文件进行配置

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  el: '#app',
  render(h) {
    return h(App)
  },
  router
})
```

通过上面的例子可以看到 vue-router 是通过 Vue.use 的方法被注入进 Vue 实例中，那么接下来我们就通过 Vue.use 来了解整个 vue-router

### vue-router 实现之 install<hr>

Vue.use 定义在 `vue/src/core/global-api/use.js` 中

```js
Vue.use = function (plugin: Function | Object) {
  const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
  if (installedPlugins.indexOf(plugin) > -1) {
    return this
  }

  const args = toArray(arguments, 1)
  args.unshift(this)
  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args)
  } else if (typeof plugin === 'function') {
    plugin.apply(null, args)
  }
  installedPlugins.push(plugin)
  return this
}
```
通过上面方法很清晰的看到 Vue.use 实际上就是执行这个 install 方法，并且在这个 install 方法的第一个参数我们可以拿到 Vue 对象。Vue-Router 的入口文件是 `src/index.js`，其中定义了 VueRouter 类，也实现了 install 的静态方法

```js
VueRouter.install = install
```
它的定义在 src/install.js 中

```js
// ...
export function install (Vue) {
 // ...
  // 混入 beforeCreate 钩子
  Vue.mixin({
    beforeCreate () {
      // 在option上面存在router则代表是根组件 
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        // 执行_router实例的 init 方法
        this._router.init(this)
        // 为 vue 实例定义数据劫持
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 非根组件则直接从父组件中获取
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })
 
  // 设置代理，当访问 this.$router 的时候，代理到 this._routerRoot._router
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
  // 设置代理，当访问 this.$route 的时候，代理到 this._routerRoot._route
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })
 
  // 注册 router-view 和 router-link 组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  // Vue钩子合并策略
  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
  // ...
}
```

通过上面的伪代码我们看到 Vue-Router 的 install 方法 实际上就是初始化的过程
- 混入了 beforeCreate，在执行 `new Vue({router})` 的时候传入 router 对象，挂在到 vue 的根组件上
- 执行 `this._router.init(this)` 
- 调用了 `Vue.util.defineReactive` 方法来进行响应式数据定义，主要是为了路由的变化能够即使响应页面的更新
- 通过 registerInstance(this, this) 这个方法来实现对 router-view 的挂载操作
- 通过 Object.defineProperty 在 Vue 的原型上定义了 $router 和 $route 2 个属性的 get 方法
- 进行组件的注册钩子合并等操作

### vue-router 实现之 new VueRouter<hr>

 为了构造出 router 实例对象，VueRouter 定义了一些属性和方法，当我们进行 new VueRouter 的时候，如下

```js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/foo', name: 'foo', component: Foo },
    { path: '/bar/:id', name: 'bar', component: Bar }
  ]
})
```
那么接下来我们看看 new VueRouter 的时候做了什么

```js
export default class VueRouter {
 
  // ...
  constructor (options: RouterOptions = {}) {
    this.app = null
    this.apps = []
    this.options = options
    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []
    this.matcher = createMatcher(options.routes || [], this)

    let mode = options.mode || 'hash'
    this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }

  match (
    raw: RawLocation,
    current?: Route,
    redirectedFrom?: Location
  ): Route {
    return this.matcher.match(raw, current, redirectedFrom)
  }

  get currentRoute (): ?Route {
    return this.history && this.history.current
  }

  init () {}
  // ...
```

通过上面我们可以看得出 constructor 中 主要是通过参数 mode 来指定路由模式，在最初阶段还进行了兼容判断。如果当前环境不支持 history 模式，会强制切换到 hash 模式。如果当前环境不是浏览器环境，会切换到abstract模式下。然后再根据不同模式来生成不同的 history 操作对象。

实例化 VueRouter 后会返回它的实例 router，我们在 new Vue 的时候会把 router 作为配置的属性传入，在混入 beforCreate 钩子的时候执行了

```js
this._router.init(this)
```
接下来我们看看 init 方法

```js
init (app: any) {
  // ...
  this.apps.push(app)

  if (this.app) {
    return
  }

  this.app = app

  const history = this.history

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation())
  } else if (history instanceof HashHistory) {
    const setupHashListener = () => {
      history.setupListeners()
    }
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    )
  }

  history.listen(route => {
    this.apps.forEach((app) => {
      app._route = route
    })
  })
}
```

init 主要是通过 history 不同执行 history.transitionTo 切换路由。最后通过 history.listen 来注册路由变化的响应回调。

### vue-router 实现之 HashHistory<hr>

在上面代码中如果 mode 为 hash 则执行 new HashHistory 函数

```js
export class HashHistory extends History {
  constructor (router: Router, base: ?string, fallback: boolean) {
    super(router, base)
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    // 保证 hash 是以 / 开头，而不是 #/，如果是 #/就会触发 hashchange 事件 这样执行 beforeEnter 钩子时候会触发两次
    ensureSlash()
  }
  // ...
}

function checkFallback (base) {
  const location = getLocation(base)
  if (!/^\/#/.test(location)) {
    window.location.replace(cleanPath(base + '/#' + location))
    return true
  }
}

function ensureSlash (): boolean {
  const path = getHash()
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path)
  return false
}

export function getHash (): string {

  // 主要是取 hash，因为兼容性问题所以没有直接使用 window.location.hash
  let href = window.location.href
  const index = href.indexOf('#')
  if (index < 0) return ''

  href = href.slice(index + 1)
  const searchIndex = href.indexOf('?')
  if (searchIndex < 0) {
    const hashIndex = href.indexOf('#')
    if (hashIndex > -1) {
      href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex)
    } else href = decodeURI(href)
  } else {
    if (searchIndex > -1) {
      href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex)
    }
  }

  return href
}
// ...
```

在 init 的时候如果是 HashHistory 则会执行 history.transitionTo

```js
history.transitionTo(
  history.getCurrentLocation(),
  setupHashListener,
  setupHashListener
)
```

```js
transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
   // 通过 match 匹配 URL 的 router 对象 
    const route = this.router.match(location, this.current)
    this.confirmTransition(route, () => {
      this.updateRoute(route)
      onComplete && onComplete(route)
      this.ensureURL()

      // fire ready cbs once
      if (!this.ready) {
        this.ready = true
        this.readyCbs.forEach(cb => { cb(route) })
      }
    }, err => {
      if (onAbort) {
        onAbort(err)
      }
      if (err && !this.ready) {
        this.ready = true
        this.readyErrorCbs.forEach(cb => { cb(err) })
      }
    })
  }
```

transitionTo 首先根据目标 location 和当前路径 this.current 执行 this.router.match 方法去匹配到目标的路径。这里 this.current 是 history 维护的当前路径，它的初始值是在 history 的构造函数中初始化的：

```js
this.current = START
```
START 的定义在 src/util/route.js 中：

```js
// ...
export const START = createRoute(null, {
  path: '/'
})
```

这样我们就创建了初始的 Route，那么接下来会执行 confirmTransition 做真正的切换处理

```js
confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
  const current = this.current
  const abort = err => {
    // ...
    onAbort && onAbort(err)
  }
  // 如果是相同的路由并且 matched.length 相同，那么进行跳转 / 且记进行中断处理
  if (
    isSameRoute(route, current) &&
    route.matched.length === current.matched.length
  ) {
    this.ensureURL()
    return abort()
  }

  const {
    updated,
    deactivated,
    activated
  } = resolveQueue(this.current.matched, route.matched)

  // 整个切换周期的队列
  const queue: Array<?NavigationGuard> = [].concat(
    // 得到即将被销毁组建的 beforeRouteLeave 钩子函数
    extractLeaveGuards(deactivated),
    // 全局 router before hooks
    this.router.beforeHooks,
    // 得到组件 updated 钩子
    extractUpdateHooks(updated),
    // 将要更新的路由的 beforeEnter 钩子
    activated.map(m => m.beforeEnter),
    // 异步组件的执行
    resolveAsyncComponents(activated)
  )

  this.pending = route
  // 每一个队列执行的 iterator 函数
  const iterator = (hook: NavigationGuard, next) => {
    // ...
  }
  // 执行队列 leave 和 beforeEnter 相关钩子
  runQueue(queue, iterator, () => {
    // ...
  })
}
```

上面函数的内部实现我们就略过通过注释我们知道它的作用就可以了，现在我们屡一下上面的流程

- 执行 transitionTo 函数，通过 match 函数的匹配得到 router 对象
- 执行 confirmTransition 函数，判断是否需要跳转，如果不需要则进行中断处理，否则先得到钩子函数的任务队列 queue
- 通过 runQueue 函数来批次执行任务队列中的每个方法
- 执行 queue 的钩子函数的时候，通过 iterator 来构造迭代器由用户传入 next 方法，确定执行的过程
- 整个队列执行完毕后，开始处理完成后的回调函数。

> 导航守卫

导航守卫，实际上就是发生在路由路径切换的时候，执行的一系列钩子函数。

我们先从整体上看一下这些钩子函数执行的逻辑，首先构造一个队列 queue，它实际上是一个数组；然后再定义一个迭代器函数 iterator；最后再执行 runQueue 方法来执行这个队列。我们先来看一下 runQueue 的定义，在 `src/util/async.js` 中：

```js
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => { 
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
```
这是非常经典的异步函数队列执行模式，fn 就是我们传入的 iterator 函数

```js
const iterator = (hook: NavigationGuard, next) => {
  if (this.pending !== route) {
    return abort()
  }
  try {
    hook(route, current, (to: any) => {
      if (to === false || isError(to)) {
        this.ensureURL(true)
        abort(to)
      } else if (
        typeof to === 'string' ||
        (typeof to === 'object' && (
          typeof to.path === 'string' ||
          typeof to.name === 'string'
        ))
      ) {
        abort()
        if (typeof to === 'object' && to.replace) {
          this.replace(to)
        } else {
          this.push(to)
        }
      } else {
        next(to)
      }
    })
  } catch (e) {
    abort(e)
  }
}
```
iterator 函数就是去执行每一个导航守卫 hook，并传入 route、current 和匿名函数，这些参数分别对应得到是文档中的 to、from、next 当执行了匿名函数，会根据一些条件执行 abort 或 next，只有执行 next 的时候，才会前进到下一个导航守卫钩子函数中，这也就是为什么官方文档会说只有执行 next 方法来 resolve 这个钩子函数。

最后我们来看一下 queue 是怎么构造的

```js
const queue: Array<?NavigationGuard> = [].concat(
  extractLeaveGuards(deactivated),
  this.router.beforeHooks,
  extractUpdateHooks(updated),
  activated.map(m => m.beforeEnter),
  resolveAsyncComponents(activated)
)
```

按照顺序如下：

1. 在失活的组件里调用离开守卫。

2. 调用全局的 beforeEach 守卫。

3. 在重用的组件里调用 beforeRouteUpdate 守卫

3. 在激活的路由配置里调用 beforeEnter。

4. 解析异步路由组件。


接下来我们来分别介绍这 5 步的实现

第一步执行 extractLeaveGuards(deactivated)，先来看一下 extractLeaveGuards 的定义

```js
function extractLeaveGuards (deactivated: Array<RouteRecord>): Array<?Function> {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}
```

它内部调用了 extractGuards 的通用方法，可以从 RouteRecord 数组中提取各个阶段的守卫

```js
function extractGuards (
  records: Array<RouteRecord>,
  name: string,
  bind: Function,
  reverse?: boolean
): Array<?Function> {
  const guards = flatMapComponents(records, (def, instance, match, key) => {
    const guard = extractGuard(def, name)
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(guard => bind(guard, instance, match, key))
        : bind(guard, instance, match, key)
    }
  })
  return flatten(reverse ? guards.reverse() : guards)
}
```

这里用到了 flatMapComponents 方法去从 records 中获取所有的导航，它的定义在 `src/util/resolve-components.js` 中

```js
export function flatMapComponents (
  matched: Array<RouteRecord>,
  fn: Function
): Array<?Function> {
  return flatten(matched.map(m => {
    return Object.keys(m.components).map(key => fn(
      m.components[key],
      m.instances[key],
      m, key
    ))
  }))
}

export function flatten (arr: Array<any>): Array<any> {
  return Array.prototype.concat.apply([], arr)
}
```
flatMapComponents 的作用就是返回一个数组，数组的元素是从 matched 里获取到所有组件的 key，然后返回 fn 函数执行的结果，flatten 作用是把二维数组拍平成一维数组。

那么对于 extractGuards 中 flatMapComponents 的调用，执行每个 fn 的时候，通过 extractGuard(def, name) 获取到组件中对应 name 的导航守卫

```js
function extractGuard (
  def: Object | Function,
  key: string
): NavigationGuard | Array<NavigationGuard> {
  if (typeof def !== 'function') {
    def = _Vue.extend(def)
  }
  return def.options[key]
}
```

获取到 guard 后，还会调用 bind 方法把组件的实例 instance 作为函数执行的上下文绑定到 guard 上，bind 方法的对应的是 bindGuard

```js
function bindGuard (guard: NavigationGuard, instance: ?_Vue): ?NavigationGuard {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}
```

那么对于 extractLeaveGuards(deactivated) 而言，获取到的就是所有失活组件中定义的 beforeRouteLeave 钩子函数。

第二步是 `this.router.beforeHooks`，在我们的 VueRouter 类中定义了 beforeEach 方法，在 `src/index.js` 中：

```js
beforeEach (fn: Function): Function {
  return registerHook(this.beforeHooks, fn)
}

function registerHook (list: Array<any>, fn: Function): Function {
  list.push(fn)
  return () => {
    const i = list.indexOf(fn)
    if (i > -1) list.splice(i, 1)
  }
}
```
当用户使用 router.beforeEach 注册了一个全局守卫，就会往 router.beforeHooks 添加一个钩子函数，这样 this.router.beforeHooks 获取的就是用户注册的全局 beforeEach 守卫。

第三步执行了 extractUpdateHooks(updated)，来看一下 extractUpdateHooks 的定义：

```js
function extractUpdateHooks (updated: Array<RouteRecord>): Array<?Function> {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}
```
和 extractLeaveGuards(deactivated) 类似，extractUpdateHooks(updated) 获取到的就是所有重用的组件中定义的 beforeRouteUpdate 钩子函数

第四步是执行 activated.map(m => m.beforeEnter)，获取的是在激活的路由配置中定义的 beforeEnter 函数。

第五步是执行 resolveAsyncComponents(activated) 解析异步组件，先来看一下 resolveAsyncComponents 的定义，在 `src/util/resolve-components.js` 中

```js
export function resolveAsyncComponents (matched: Array<RouteRecord>): Function {
  return (to, from, next) => {
    let hasAsync = false
    let pending = 0
    let error = null

    flatMapComponents(matched, (def, _, match, key) => {
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true
        pending++

        const resolve = once(resolvedDef => {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default
          }
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef)
          match.components[key] = resolvedDef
          pending--
          if (pending <= 0) {
            next()
          }
        })

        const reject = once(reason => {
          const msg = `Failed to resolve async component ${key}: ${reason}`
          process.env.NODE_ENV !== 'production' && warn(false, msg)
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg)
            next(error)
          }
        })

        let res
        try {
          res = def(resolve, reject)
        } catch (e) {
          reject(e)
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject)
          } else {
            const comp = res.component
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject)
            }
          }
        }
      }
    })

    if (!hasAsync) next()
  }
}
```

resolveAsyncComponents 返回的是一个导航守卫函数，有标准的 to、from、next 参数。它的内部实现很简单，利用了 flatMapComponents 方法从 matched 中获取到每个组件的定义，判断如果是异步组件，则执行异步组件加载逻辑，加载成功后会执行 match.components[key] = resolvedDef 把解析好的异步组件放到对应的 components 上，并且执行 next 函数。

这样在 resolveAsyncComponents(activated) 解析完所有激活的异步组件后，我们就可以拿到这一次所有激活的组件。这样我们在做完这 5 步后又做了一些事情

```js
runQueue(queue, iterator, () => {
  const postEnterCbs = []
  const isValid = () => this.current === route
  const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid)
  const queue = enterGuards.concat(this.router.resolveHooks)
  runQueue(queue, iterator, () => {
    if (this.pending !== route) {
      return abort()
    }
    this.pending = null
    onComplete(route)
    if (this.router.app) {
      this.router.app.$nextTick(() => {
        postEnterCbs.forEach(cb => { cb() })
      })
    }
  })
})
```

6. 在被激活的组件里调用 beforeRouteEnter。

7. 调用全局的 beforeResolve 守卫。

8. 调用全局的 afterEach 钩子。


可以看到，当处理完任务队列之后的回调主要是接入路由组件后期的钩子函数 beforeRouteEnter 和 beforeResolve，并进行队列执行。最后执行回调函数 onComplete

到这里，已经完成了对当前 route 的切换动作，在完成路由切换后执行了 `onComplete && onComplete(route)` ，那么主要会引起 url 和 组件的变化我们来看看

当我们点击 router-link 的时候，实际上最终会执行 router.push，如下

```js
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  this.history.push(location, onComplete, onAbort)
}
```
this.history.push 函数，这个函数是子类实现的，不同模式下该函数的实现略有不同，我们来看一下平时使用比较多的 hash 模式该函数的实现，在 `src/history/hash.js` 中

```js
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  this.transitionTo(location, route => {
    pushHash(route.fullPath)
    handleScroll(this.router, route, fromRoute, false)
    onComplete && onComplete(route)
  }, onAbort)
}
```

push 函数会先执行 this.transitionTo 做路径切换，在切换完成的回调函数中，执行 pushHash 函数

```js
function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path))
  } else {
    window.location.hash = path
  }
}
```

supportsPushState 的定义在 `src/util/push-state.js` 中

```js
export const supportsPushState = inBrowser && (function () {
  const ua = window.navigator.userAgent

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})()
```

如果支持的话，则获取当前完整的 url，执行 pushState 方法

```js
export function pushState (url?: string, replace?: boolean) {
  saveScrollPosition()
  const history = window.history
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url)
    } else {
      _key = genKey()
      history.pushState({ key: _key }, '', url)
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url)
  }
}
```

pushState 会调用浏览器原生的 history 的 pushState 接口或者 replaceState 接口，更新浏览器的 url 地址，并把当前 url 压入历史栈中。

然后在 history 的初始化中，会设置一个监听器，监听历史栈的变化

```js
setupListeners () {
  const router = this.router
  // 处理滚动
  const expectScroll = router.options.scrollBehavior
  const supportsScroll = supportsPushState && expectScroll

  if (supportsScroll) {
    setupScroll()
  }
  // 通过 supportsPushState 判断监听popstate 还是 hashchange
  window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', () => {
    const current = this.current
    // 判断路由格式
    if (!ensureSlash()) {
      return
    }
    this.transitionTo(getHash(), route => {
      if (supportsScroll) {
        handleScroll(this.router, route, current, true)
      }
      // 如果不支持 history 模式，则换成 hash 模式
      if (!supportsPushState) {
        replaceHash(route.fullPath)
      }
    })
  })
}
```

当点击浏览器返回按钮的时候，如果已经有 url 被压入历史栈，则会触发 popstate 事件，然后拿到当前要跳转的 hash，执行 transtionTo 方法做一次路径转换。

可以看到 setupListeners 这里主要做了 2 件事情，一个是对路由切换滚动位置的处理，另一个是对路由变动做了一次监听。这样我们就完成了对真个 hash 的分析过程

### vue-router 实现之 HTML5History<hr>

当初始化的时候 mode 等于 history 模式的时候，就会执行 HTML5History，然后会执行 history 对象上的 transitionTo 方法

在vue-router实例化过程中，执行对 HTML5History 的实例化

```js
this.history = new HTML5History(this, options.base)
```

看一下 HTML5History 函数的构造

```js
  constructor (router: Router, base: ?string) {
    // 实现 base 基类中的构造函数
    super(router, base)
    
    // 滚动信息处理
    const expectScroll = router.options.scrollBehavior
    const supportsScroll = supportsPushState && expectScroll

    if (supportsScroll) {
      setupScroll()
    }

    const initLocation = getLocation(this.base)
    window.addEventListener('popstate', e => {
      const current = this.current

      // 避免在有的浏览器中第一次加载路由就会触发 `popstate` 事件
      const location = getLocation(this.base)
      if (this.current === START && location === initLocation) {
        return
      }
      // 执行跳转动作
      this.transitionTo(location, route => {
        if (supportsScroll) {
          handleScroll(router, route, current, true)
        }
      })
    })
  }
```

可以看到，只是调用基类构造函数以及初始化监听事件。由于在上面已经介绍了 transitionTo 和 confirmTransition。这里不再过多介绍了。那么我们来看几个之前没介绍的一下 API 吧

```js
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.push(location, onComplete, onAbort)
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.replace(location, onComplete, onAbort)
  }

  go (n: number) {
    this.history.go(n)
  }

  back () {
    this.go(-1)
  }

  forward () {
    this.go(1)
  }
```
可以看到 vue-router 这个 API 实际上都是效仿 window.history API 的，所以也不用多说。这样我们就完成了对 HTML5History 的介绍

### 总结<hr>

从上面我们看到路径变化是路由中最重要的功能，在路由记性切换的时候会把当前的路线切换到目标路线，切换过程中会执行一系列的导航守卫钩子函数，更改 url，同时渲染组件。其实最重要的几个函数就是

- match 进行匹配路由得到路由对象
- transitionTo 做路径切换
- confirmTransition 处理队列的钩子函数，在处理钩子函数的时候会按照上面介绍的执行 8 个小步骤的顺序
- setupListeners 监听导航等功能




