---
title: vue 原理之组件注册
date: 2019-09-08 12:08:25
top: false
cover: false
password:
toc: false
mathjax: false
summary: 
tags:
- vue
categories:
- vue
---

在日常开发中我们经常会用到许多自定义的组件，除了内置组件自定义组件用的时候必须注册，否则会提示如下信息

```md
'Unknown custom element: <xxx> - did you register the component correctly?
 For recursive components, make sure to provide the "name" option.'
```

在<a href="https://cn.vuejs.org/v2/guide/components-registration.html">官网</a>中提到组件组册的方式分为全局和局部

### 全局注册

```js
Vue.component('my-component-name', {
  // ... 选项 ...
})
```

官方文档中有这样一句话 **全局注册的行为必须在根 Vue 实例 (通过 new Vue) 创建之前发生** ，那么代码被定义在 `src/core/global-api/assets.js ` 中

```js
import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  // 创建注册的方法
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
```
遍历 ASSET_TYPES，得到 type 后挂载到 Vue 上，定义在 `src/shared/constants.js` 中

```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```

实际上 vue 是初始化了3个全局函数，那么对于 component 来说是使用 Vue.extend 把这个对象转换成一个继承于 Vue 的构造函数，最后通过 `this.options[type + 's'][id] = definition` 把它挂载到 `Vue.options.components` 上。然后在通过 mergeOptions 进行参数合并，最后在创建 vnode 的时候执行 _createElement 方法，定义在 `src/core/vdom/create-element.js` 中
```js
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  // ...
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // ...
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
    // ...
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  // ...
}
```

通过 _createElement  方法中的 resolveAsset 拿到这个组件的构造函数，并作为 createComponent 的钩子的参数

```js
export function resolveAsset (
  options: Object,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  // 组件名称必须是字符串
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
  // 检查本地的注册变量
  if (hasOwn(assets, id)) return assets[id]
  const camelizedId = camelize(id)
  if (hasOwn(assets, camelizedId)) return assets[camelizedId]
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
  // 如果条件都满足那么返回标志，进行 createComponent
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    )
  }
  return res
}
```

上面代码很直观的分析到关于我们关于组件名字的注意事项

- 直接使用 id 拿，如果不存在，则把 id 变成驼峰的形式再拿
- 如果仍然不存在则在驼峰的基础上把首字母再变成大写的形式再拿
- 如果仍然拿不到则报错

这样说明了我们在使用 Vue.component(id, definition) 全局注册组件的时候，id 可以是连字符、驼峰或首字母大写的形式。那么在在<a href="https://cn.vuejs.org/v2/guide/components-registration.html">官网</a>中关于组件的命令也写到使用 kebab-case 方式 或者 使用 PascalCase 方式

### 局部注册

```js
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  },
  // ...
}

```

其实通过上面全局组件的注册，局部组件就很好理解了，也是经过参数合并，通过 resolveAsset 拿到组件的构造函数，并作为createComponent 钩子的参数，区别是局部组件只有该类型的组件才可以访问局部注册的子组件，而全局注册是扩展到 Vue.options 下，所以在所有组件创建的过程中，都会从全局的 Vue.options.components 扩展到当前组件的 vm.$options.components 下，这就是全局注册的组件能被任意使用的原因。

### Vue.use

我们都知道使用插件的话 vue 提供一个 Vue.use 方法，具体用法见<a href="https://cn.vuejs.org/v2/api/#Vue-use">官网文档</a>  

那么它的原理是什么呢？定义在 `vue/src/core/index.js` 中

```js
// ...

// 初始化全局API
import { initGlobalAPI } from './global-api/index'

// ...

//初始化全局API变量
initGlobalAPI(Vue)

// ...
export default Vue
```

initGlobalAPI 定义在 `/src/core/global-api/index.js`

```js
export function initGlobalAPI (Vue: GlobalAPI) {
  // ...
  // 初始化use()
  initUse(Vue)
  // ...
}
```

initUse(Vue) 定义在 `vue/src/core/global-api/use.js`

```js
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // installedPlugins 存储 install 后的插件
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      // 同一个插件只会安装一次
      return this
    }
    // 插件以外的其他参数 Vue.use(MyPlugin, { someOption: true })
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      // 如果插件是一个对象，必须提供 install 方法
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      // 如果插件是一个函数，它会被作为 install 方法
      plugin.apply(null, args)
    }
    // install 之后通过队列储存插件再次安装时匹配判断避免重复安装
    installedPlugins.push(plugin)
    return this
  }
}
```

通过上面我们总结到

- Vue.use 对象的原理是使用 install 字段，来进行插件安装
- Vue.use 调用必须在 new Vue 之前
- 同一个插件多次使用 Vue.use 只会被运行一次

















