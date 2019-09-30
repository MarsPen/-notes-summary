---
title: Vuex 原理
date: 2018-09-10 19:05:12
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

说我 Vuex 大家也都能够耳熟能详了，它是进行状态管理的，也就是说全局数据缓存，通讯的作用。

## 什么是 Vuex

用 Vuex 官网的话讲 Vuex 是 Vue.js 应用程序的状态管理模式+库。它充当应用程序中所有组件的集中存储，其规则确保状态只能以可预测的方式进行更改。下面我们来看一张很熟悉的图来理解 Vuex 背后的基本思想

<img src="/images/vuex.png">

## Vuex 的核心概念

下面我们通过几个概念的解释来理解上面的图

### State<hr>

Vuex 的唯一数据源，我们想使用的数据都定义在此处，唯一数据源确保我们的数据按照我们想要的方式去变动，可以通过 store.state 来取得内部数据

### Getter<hr>

store 的计算属性，当我们需要对 state 的数据进行一些处理的时候，可以先在 getters 里进行操作，处理完的数据可以通过 store.getters 来获取。

### Action<hr>

Action 类似于 mutation，不同在于：

Action 通过 commit 方法提交 mutation，而不是直接变更状态。
Action 可以包含任意异步操作。
Action 通过 store.dispatch(action) 来触发事件

### Mutation<hr>

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation，避免我们在使用过程中覆盖 state 造成数据丢失。

每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)

如果我们直接通过 store.state 来修改数据，vue 会抛出警告，并无法触发 mutation 的修改。


### Module<hr>

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。
为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割。

还有一些其他辅助函数的概念在这个就不一一列举了，每个名称的更全面的概念以及 demo 请查看 vuex<a href="https://vuex.vuejs.org/zh/">官网</a>文档


## vuex 的源码分析

关于使用我相信大家都会bu用过多的介绍，下面我们通过对源码的分析来了解 vuex 的原理更有利于我们在日常开发中使用，出现问题能够更清楚的知道问题出在哪里

### 初始化<hr>

当我们在代码中通过引入如下代码的时候

```js
import Vuex from 'vuex'
```

实际上是引用一个对象，它定义在 `src/index.js`

```js
    
import { Store, install } from './store'
import { mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers } from './helpers'

export default {
  Store,
  install,
  version: '__VERSION__',
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}
```
通过上面代码看见在引用的时候实际上就暴露了很多方法也是我们非常熟悉并且经常用的。

### 使用<hr>

当我们执行以下代码的时候

```js
Vue.use(Vuex)
```

和 vue-router 一样，Vue.use 方法会注入一个插件，调用这个对象的 install 方法，该方法定义在 `src/store.js` 中

```js
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```

通过上面代码我们看到其实和vue-router 差不多也是做了几件事情

- 对 vue 对象做校验防止重复安装
- 将 vue 对象传递到本地中
- 调用 applyMixin 方法进行初始化

接下来我们看一下 applyMixin 方法，定义在 `src/mixin.js` 中

```js
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // ...
  }

 
  // Vuex init钩子，注入到每个实例 init 钩子列表
  function vuexInit () {
    const options = this.$options
    // 进行依赖注入
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}

```

通过上面代码我们知道在执行 applyMixin 的时候实际上就是在 Vue beforeCreate 生命周期钩子函数里执行了 vuexInit 方法，将实例化的 Store 对象挂载到 $store 上。

### Store 实例化<hr>

当我们执行

```js
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  modules
  // ...
})
```
我们看到实际上 Store 对象的构造函数接收一个对象参数它包含 actions、getters、state、mutations、modules 等 Vuex 的核心概念，它定义在 `src/store.js` 中

```js
export class Store {
  constructor (options = {}) {
    // 如果没有挂在成功 Vue 这里面自动在 window 上挂载 Vue
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }

    // ...

    const {
      plugins = [],
      strict = false
    } = options

    // store 的内部状态
    this._committing = false
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modules = new ModuleCollection(options)
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()

    // 绑定、提交和分发
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    // 严格模式
    this.strict = strict

    const state = this._modules.root.state

    // 初始化模块，递归地注册所有的子模块，并在 this. _wrappedge 中收集所有的模块 getter
    installModule(this, state, [], this._modules.root)

    // 初始化负责响应的存储vm(也将 _wrappedgeas 登记为计算属性)
    resetStoreVM(this, state)

    // apply plugins
    plugins.forEach(plugin => plugin(this))

    const useDevtools = options.devtools !== undefined ? options.devtools : Vue.config.devtools
    if (useDevtools) {
      devtoolPlugin(this)
    }
  }
  // ...
}
```

通过上面代码主要是执行了以下过程

- 如果没有传入 Vue，那么自动安装一下插件
- 初始化模块、安装模块收集所有模块的 getter
- 初始化 store._vm

### 获取模块<hr>

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象，这样我们可以将 store 分割成模块（module，每个模块都拥有自己的 state、mutation、action、getter，甚至是嵌套子模块。如下

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... },
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

我们打开 `module/module-collection.js` 文件，找到 ModuleCollection 类

```js
export default class ModuleCollection {
  constructor (rawRootModule) {
    this.register([], rawRootModule, false)
  }
}
```
可以看到上面执行了 register 方法

```js
register (path, rawModule, runtime = true) {
  const newModule = new Module(rawModule, runtime)
  if (path.length === 0) {
    this.root = newModule
  } else {
    const parent = this.get(path.slice(0, -1))
    parent.addChild(path[path.length - 1], newModule)
  }

  if (rawModule.modules) {
    forEachValue(rawModule.modules, (rawChildModule, key) => {
      this.register(path.concat(key), rawChildModule, runtime)
    })
  }
}
```

register 接收 3 个参数

- path 表示路径，因为我们整体目标是要构建一颗模块树，path 是在构建树的过程中维护的路径
- rawModule 表示定义模块的配置项
- runtime 表示是否是一个运行时创建的模块

上面实际上注册了 Module 的实例，Module 是用来描述单个模块的类，它的定义在 `src/module/module.js` 中

```js
export default class Module {
  constructor (rawModule, runtime) {
    this.runtime = runtime
    
    this._children = Object.create(null)
    
    this._rawModule = rawModule
    const rawState = rawModule.state

    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }
}
```

对于每一个模块而言，_children 是该模块的子模块，_rawModule 是该模块的配置，state 是该模块的 state。

回到 register，那么在实例化一个 Module 后，判断当前的 path 的长度如果为 0，则说明它是一个根模块，所以把 newModule 赋值给了 this.root

接着判断是否有 modules 项，如果有，则执行下面代码

```js
forEachValue(rawModule.modules, (rawChildModule, key) => {
  this.register(path.concat(key), rawChildModule, runtime)
})
```
这段代码主要是遍历 modules，递归调用 register 方法，将配置项里的 modules 的 key 作为路径保存到 path 中，传入子 module 和创建状态。


如果 path 的长度不为 0，那么执行以下代码建立父子关系

```js
const parent = this.get(path.slice(0, -1))
parent.addChild(path[path.length - 1], newModule)
```

上面调用了 get

```js
get (path) {
  return path.reduce((module, key) => {
    return module.getChild(key)
  }, this.root)
}
```
首先获取父模块，这里通过 get 方法中的 reduce 方法一层层去找到对应的模块，查找的过程中，执行的是 module.getChild(key) 方法

```js
getChild (key) {
  return this._children[key]
}
```
返回当前模块的 _children 中对应 key 的模块，那么每个模块当中的 key 是如何添加的呢

```js
addChild (key, module) {
  this._children[key] = module
}
```

对于 root module 的下一层 modules 来说，它们的 parent 就是 root module，那么他们就会被添加的 root module 的 _children 中。每个子模块通过路径找到它的父模块，然后通过父模块的 addChild 方法建立父子关系，递归执行这样的过程，最终就建立一颗完整的模块树。


### 安装模块

当我们构建好模块树，接下来就需要去安装这些模块了，看一下 installModule 方法代码如下

```js
function installModule (store, rootState, path, module, hot) {
  const isRoot = !path.length
  const namespace = store._modules.getNamespace(path)

  // 注册命名空间 map
  if (module.namespaced) {
    if (store._modulesNamespaceMap[namespace] && process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] duplicate namespace ${namespace} for the namespaced module ${path.join('/')}`)
    }
    store._modulesNamespaceMap[namespace] = module
  }

  // 获取父模块的 state，获取当前模块的名称，通过 Vue.set 将当前模块的 state 挂载到父模块上，key 是模块名称。
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      Vue.set(parentState, moduleName, module.state)
    })
  }

  // 通过 makeLocalContext 方法创建本地上下文环境，接收 store（root store）、namespace（模块命名空间）、path（模块路径） 三个参数
  const local = module.context = makeLocalContext(store, namespace, path)

  // 调用 registerMutation 方法进行 Mutations 注册
  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })

  // 调用 registerAction 方法进行 Actions 注册
  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })
  // 调用 registerGetter 方法进行 Getter 注册
  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })
  // 开始遍历模块的子模块，然后递归安装。
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}
```

上面的逻辑就是初始化 state、getters、mutations、actions，这里有 5 个参数，分别代表

- store：root store
- rootState：root state
- path：模块访问路径
- module：当前模块
- hot：是否热更新

默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。如果我们希望模块具有更高的封装度和复用性，可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。例如：

```js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 模块内容（module assets）
      state: { ... }, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

回到 installModule 方法，第一步根据 path 获取 namespace

```js
const namespace = store._modules.getNamespace(path)
```

getNamespace 的定义在 src/module/module-collection.js 中

```js
getNamespace (path) {
  let module = this.root
  return path.reduce((namespace, key) => {
    module = module.getChild(key)
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
}
```

从 root module 开始，通过 reduce 方法一层层找子模块，如果发现该模块配置了 namespaced 为 true，则把该模块的 key 拼到 namesapce 中，最终返回完整的 namespace 字符串


为了方便以后能根据 namespace 查找模块执行以下方法把 namespace 对应的模块保存下来

```js
if (module.namespaced) {
  store._modulesNamespaceMap[namespace] = module
}
```

第二步根据 !isRoot && !hot 来获取模块的名称、state 等

从 root state 开始，通过 path.reduce 方法一层层查找子模块 state，最终找到目标模块的 state。

```js
function getNestedState (state, path) {
  return path.length
    ? path.reduce((state, key) => state[key], state)
    : state
}
```

第三步通过 makeLocalContext 方法创建本地上下文环境

```js
const local = module.context = makeLocalContext(store, namespace, path)
```

```js
function makeLocalContext (store, namespace, path) {
  const noNamespace = namespace === ''

  const local = {
    dispatch: noNamespace ? store.dispatch : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(`[vuex] unknown local action type: ${args.type}, global type: ${type}`)
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(`[vuex] unknown local mutation type: ${args.type}, global type: ${type}`)
          return
        }
      }

      store.commit(type, payload, options)
    }
  }

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? () => store.getters
        : () => makeLocalGetters(store, namespace)
    },
    state: {
      get: () => getNestedState(store.state, path)
    }
  })

  return local
}
```

如果没有命名空间的情况就是直接使用 root store 上的 dispatch 和 commit 方法，否则使用新定义的方法，这个方法接收三个参数

- _type：dispatch、commit 的 type
- _payload：提交的参数
- _options：其他选项，例如 { root: true } 这个在子模块派发到根仓库的配置项


把 type 自动拼接上 namespace，然后执行 store 上对应的方法。

对于 getters 而言，如果没有 namespace，则直接返回 root store 的 getters，否则返回 makeLocalGetters(store, namespace) 的返回值

```js
function makeLocalGetters (store, namespace) {
  const gettersProxy = {}

  // 获取了 namespace 的长度
  const splitPos = namespace.length
  // 遍历 root store 下的所有 getters
  Object.keys(store.getters).forEach(type => {
    
    // 判断它的类型是否匹配 namespace,不匹配直接结束
    if (type.slice(0, splitPos) !== namespace) return

    // 获取本地 type，也就是 getNumberPlusOne
    const localType = type.slice(splitPos)

    // 用 Object.defineProperty 定义了 gettersProxy，获取 localType 实际上就是访问了 store.getters[type]
    Object.defineProperty(gettersProxy, localType, {
      get: () => store.getters[type],
      enumerable: true
    })
  })

  // 访问代理对象
  return gettersProxy
}
```

第四步注册 Mutations

```js
module.forEachMutation((mutation, key) => {
  const namespacedType = namespace + key
  registerMutation(store, namespacedType, mutation, local)
})

function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload)
  })
}
```

通过遍历 module 下的每一个 mutations 属性的值，然后获取带有命名空间的 type，再调用 registerMutation 方法进行注册，该方法实际上就是给 root store 上的 _mutations[types] 添加 wrappedMutationHandler 方法，从而允许我们一个 type 对应多个 mutaions。


第五步注册 Actions

```js
module.forEachAction((action, key) => {
  const type = action.root ? key : namespace + key
  const handler = action.handler || action
  registerAction(store, type, handler, local)
})

function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload, cb) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}
```

通过遍历模块中的 actions 拿到每一个 action 和 key。判断 action.root，如果否的情况把 key 拼接上 namespace，然后执行 registerAction 方法。registerAction 接收四个参数

- store：store 实例
- namespacedType：带命名空间的 type
- handler：回调函数
- local：上下文环境，root 为 store，module 为 local

可以看到 actions 回调的第一个参数是一个对象，里面包含了 dispatch、commit、getters、state、rootGetters、rootState 字段，最后 actions 里通过 Promise 的异步过程，判断 res 的类型返回对应的值



第五步注册 Getters

```js
module.forEachGetter((getter, key) => {
  const namespacedType = namespace + key
  registerGetter(store, namespacedType, getter, local)
})


function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] duplicate getter key: ${type}`)
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  }
}
```

通过遍历模块中的 getters 的定义，拿到每一个 getter 和 key，并把 key 拼接上 namespace，然后执行 registerGetter 方法。registerGetter 首先通过 store._wrappedGetters[type] 方法 判断 getter key 重复是否重复，接着在 _wrappedGetters 上以 type 为 key，挂载 wrappedGetter 函数，返回 rawGetters 函数执行的结果。


第六步安装子模块

```js
module.forEachChild((child, key) => {
  installModule(store, rootState, path.concat(key), child, hot)
})
```
很简单就是递归安装的过程

以上就是 installModule 函数的作用进行 state、getters、actions、mutations 等模块的初始化和安装工作，接下来我们看 Store 实例化的最后一步，就是执行初始化 store._vm 的逻辑

### 初始化 store._vm<hr>

入口是

```js
resetStoreVM(this, state)
```

看一下这个函数的定义

```js
function resetStoreVM (store, state, hot) {
  const oldVm = store._vm

  // 建立 getters 和 state 的联系
  store.getters = {}
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  // 执行 computed[key] 对应的函数的时候，会执行 rawGetter(local.state,...) 方法，那么就会访问到 store.state，进而访问到 store._vm._data.$$state，这样就建立了一个依赖关系。当 store.state 发生变化的时候，下一次再访问 store.getters 的时候会重新计算。
  forEachValue(wrappedGetters, (fn, key) => {
    //使用 computed 来利用其延迟缓存机制
    computed[key] = () => fn(store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })

  // 使用一个Vue实例来存储状态树抑制警告，以防用户添加了一些奇怪的全局混合
  const silent = Vue.config.silent
  Vue.config.silent = true
  // 实例化一个 Vue 实例 store._vm，并把 computed 进去
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  // 为新vm启用严格模式
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    if (hot) {
      // 将所有订阅的观察者的更改发送到强制 getter 重新评估以便热重载
      // store._vm 会添加一个 wathcer 来观测 this._data.$$state 的变化，也就是当 store.state 被修改的时候, store._committing 必须为 true，否则在开发阶段会报警告
      store._withCommit(() => {
        oldVm._data.$$state = null
      })
    }
    Vue.nextTick(() => oldVm.$destroy())
  }
}
```

这里方法的主要是将 state 与 getters 建立好关系，实例化一个 Vue 挂载到 _vm 属性上，通过 computed 属性将 getters 与 state 关联起来并缓存结果。

### 辅助函数过程分析<hr>

当然还有很多 API 的分析过程比如怎么执行的 commit、dispatch，mapState 和 mapGetters、mapMutations、mapActions 等辅助函数的实现

我们可以看 <a href="https://ustbhuangyi.github.io/vue-analysis/vuex/api.html#%E6%95%B0%E6%8D%AE%E5%AD%98%E5%82%A8">Vue 技术揭秘</a>中关于这些的讲些










