---
title: 小程序框架跨端框架
date: 2021-01-14 23:35:09
top: false
cover: false
password:
toc: true
mathjax: false
summary: 
tags:
- 小程序
categories:
- 小程序
---

### 跨端框架<hr>

到2021年前端的跨端项目已经达到一个瓶颈期，从原生的 RN、Weex、Flutter 到小程序生态的各平台跨端框架已经百花齐放。除了Flutter 实现的自渲染以外，其他的都脱离不了 web。而小程序跨端框架虽然很多，但可以从两个纬度来进行分类

- 从框架的语法来说
  - Vue 语法
  - React 语法
- 从实现原理来说
  - 编译时 compile time 框架约定了一套自己的<a href="https://zhuanlan.zhihu.com/p/107947462"> DSL</a>，在编译打包过程中，利用 babel 工具通过 AST 进行转译，生成符合小程序规则的代码。
  - 运行时 runtime，这种框架是在小程序逻辑层中运行 React 和 Vue，然后通过适配层，实现自定义渲染器

实现原理上运行时比编译时更消耗性能，但是编译时不够灵活，需要 case by case 的进行语法转换，需要按照框架规定的语法进行开发。
到 2021 年一些跨端框架其实已经放弃了维护，下面列举了一些小程序框架按照 github 上 star 数量从左到右

|  | uniapp | Taro | wepy | chameloen | Remax | megalo | mpvue|
| -----| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 语法 | vue | react/vue | 类vue | 类vue | react | vue | vue |
| 厂家 | Hbuilder | 京东 | 腾讯 | 滴滴 | 蚂蚁 | 网易 | 美团 | 


### vue 核心流程<hr>

从实现的语法上可以看出一种是 vue 一种是 react，本文只从 vue 的角度上分析其核心原理。
在开发中写的是 vue 代码然后经过打包编译之后就可以在小程序中运行。那这些框架背后做了什么呢？

其实从根本上都属于 vue 的基本能力，没发生改变（双向绑定、虚拟DOM、diff算法等）。只是在最后更新数据的时候vue 是操作DOM，而跨端框架交给小程序setData。

在了解跨端框架原理之前，我们先来看看 vue。一个 .vue 单文件由三个部分 `template`、`script`、`style` 构成，如下图

<img src="/images/mini16.jpg">

template 模板部分会在编译打包的过程中，被 vue-loader 调用 compile 方法通过词法分析生成一个 ast 对象，然后调用代码生成器，经过遍历 AST 树递归的拼接字符串操作，最终生成一段 render 函数。而 render 函数会在第一次 mount 时，或者 data 更新的时候才会被执行，执行后，会创建不同类型的 vnode 节点，最后会生成 vnode tree （虚拟 DOM 树）,vue 在拿到 vnode tree 之后就去和上次老的 vnode tree 做 patch diff 找出最小更新策略，patch 之后就会更新真实的视图DOM

script 中我们会 new Vue，在 vue 初始化的时候会利用 Object.defineproperty 对数据进行劫持做响应式，当数据发生变化的时候，最终会调用上下文 render 函数，生成最新的 vnode tree，接着对比老的 vnode tree 然后进行 patch

以上是 vue 的核心流程如果想要了解的更多可查看另外几篇文章 
- <a href="https://www.studyfe.cn/2019/08/27/vue/vueprinciple/">vue 主线流程</a>
- <a href="https://www.studyfe.cn/2019/09/05/vue/vueobserve/">vue 响应式</a>
- <a href="https://www.studyfe.cn/2019/09/19/vue/vuecompile/">vue 编译部分</a>

### mpvue 核心流程<hr>
由于小程序不支持 DOM，所以小程序这些跨端框架也不可能操作DOM，那是如何更新小程序的视图呢。
我们先来看一下 mpvue 框架，从源码架构、运行时、编译时三个方面说明

**源码架构 🚩**
通过下图可以看出，mpvue 实际上是将 vue 的源码拿过来在 platforms 跨平台上增加了自己的源码，然后强行改了一波兼容，实现的方案。
<img src="/images/mini21.png">

**mpvue编译时🚩**
在编译阶段实际上就是 case by case 的过程
- template 主要是使用了 ast 来解析转化将两侧的语法对齐的过程。
- script 实际上就是将 vue 的 script 移动到小程序的 js 文件中，然后在引入 vue.js，具体如何执行的下面介绍。
- style 大部分可以直接挪到 wxss 中剔除小程序不支持的<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html">选择器</a>最后做 rpx 转换。
<img src="/images/mini20.png">

**mpvue运行时 🚩**

下面的图和 vue 的原理图很类似 vue 的编译、双向绑定、虚拟dom、diff 算法都没有发生改变，只是在 patch 更新 dom 的地方替换成了小程序的 setData。
<img src="/images/mini22.png">

因为小程序框架要求页面在页面调用 Page 方法否则就会报错。所以一些 vue 框架的做法实际上是在初始化的时候调用 Page()，这样小程序进行扫描的时候页面就不会出错

```js
Vue.init = () => {
  ...
  Page()
}
new Vue()
```

这样在小程序容器中就会出现两个实例，Page 和 Vue。在页面初始化的时候，先实例化一个 Vue，然后在 Vue.init 中调用小程序的 Page()，生成小程序 page 实例，最后在 Vue 的 mounted 中把数据同步到小程序 page 实例上。

<img src="/images/mini18.png">

在 vue 数据发生变化的时候
🌟 先进行 vue 的流程
- 触发响应式
- 执行 render 生成新的 vnode
- diff 新旧 vnode，得到修改数据最优解

🌟 后进行小程序的流程
- 调用 setData 方法修改小程序实例的数据，触发小程序视图层，重新渲染

**小结 🚩**
- 数据归 vue 管，当数据放生变化后，通过框架的 runtime 进行中间桥接同步到小程序中
- 事件及渲染由小程序管，用户在小程序触发各种事件后，先触发小程序的事件函数，然后通过框架的 runtime 运行事件代理，触发 vue 函数

### taro/vue 核心流程<hr>
Taro 是一个开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架来开发，Taro3.x 版本相对与 1/2 采用了重运行时的架构，下图为它的实现架构
<img src="/images/mini28.jpg">
Taro 代码编译之后分为两个大部分左侧 App Service(逻辑层)、右侧 View 视图层，和其他类 vue 框架一样 数据层是 taro管理，而事件层为小程序管理
<img src="/images/mini23.jpg">

> App Service(逻辑层) 🚩 - 参见源码 `taro-runtime > src > dsl > vue.ts` 

🌟 vue：提供基础能力，这部分就没有好说的了
🌟 taro-runtime：核心底层 DOM、BOM 的实现、各平台实现代码、工具类等

在 runtime 的 DSL vue.ts 中主要有`createVueApp`、 `connectVuePage` 方法，源码如下
```js 
  export function createVueApp (App: VueInstance, vue: V, config: AppConfig) {
    // ....
    const wrapper = new (Vue as VueConstructor)({
      render (h) {
        while (pages.length > 0) {
          const page = pages.pop()!
          elements.push(page(h))
        }
        return h(App.$options, { ref: 'app' }, elements.slice())
      },
      methods: {
        mount (component: ComponentOptions<VueCtor>, id: string, cb: () => void) {
          pages.push((h) => h(component, { key: id }))
          this.updateSync(cb)
        },
        updateSync (this: VueInstance, cb: () => void) {
          this._update(this._render(), false)
          this.$children.forEach((child: VueInstance) => child._update(child._render(), false))
          cb()
        }
        // ...
      }
    })

    const app: AppInstance = Object.create({
      mount (component: ComponentOptions<VueCtor>, id: string, cb: () => void) {
        const page = connectVuePage(Vue, id)(component)
        wrapper.mount(page, id, cb)
      },
    }, {
      // ...
    })

    Current.app = app

    return Current.app
  }
  ```

上面的代码主要的流程就是 
- new Vue 创建 vue 实例 wrapper
- render 时，循环 pages，每个 page 实际就是通过 Vue.CreateElement创建的 vnode
- 调用 vue 的实例方法 mount 生成 pages
- 调用 vue 的实例方法 updateSync 进行 render，最后合并默认配置生成如下 json 结构

```json
{
  config: {
    pages: ["pages/index/index","pages/my/index"],
    permission: {},
    subpackages: [
      {
        pages:[],
        root: ""
      },
      {
        pages:[],
        root: ""
      }
    ],
    tabBar: {},
    window: {},
    onHide: function () {},
    onLaunch: function () {},
    onShow: function () {}
  }
}
```

🌟 实现 render 函数 创建 Taro DOM Tree
- DOM/BOM API 主要包含几个方法
  - TaroRootElement
  - TaroElement、TaroText
  - TaroNode
  - TaroEventTarget

下面的 UML 图反映了几个主要的类的结构和关系
<img src="/images/mini30.jpg">


> View（视图层）🚩 - 参见源码 `taro-runtime > src > dom > html`

将小程序的所有组件进行模版化处理从而得到小程序组件对应的模版，如下图：

<img src="/images/mini32.jpg">

然后基于组件的 template，动态 “递归” 渲染整棵树
- 先去遍历 Taro DOM Tree 根节点的子元素
- 根据每个子元素的类型选择对应的模板来渲染子元素
- 在每个模板中又会去遍历当前元素的子元素，以此把整个节点树递归遍历出来。
<img src="/images/mini27.jpg">

> Taro 事件 🚩 - 参见源码 `taro-runtime > src > dom > event.ts`

Taro Next 事件，具体的实现方式如下：
- 在小程序组件的模版化过程中，将所有事件方法全部指定为其平台（ev）函数，如：bindtap、bindchange、bindsubmit 等
- 在运行时实现 eventHandler 函数，和 eh 方法绑定，收集所有的小程序事件
- 通过 document.getElementById() 方法获取触发事件对应的 TaroNode
- 通过 createEvent() 创建符合规范的 TaroEvent
- 调用 TaroNode.dispatchEvent 重新触发事件

<img src="/images/mini24.jpg">

> 更新 🚩 - 参见源码 `taro-runtime > src > dom > root.ts`

最终都会调用 Taro DOM 方法，如：appendChild、insertChild 等。

这些方法在修改 Taro DOM Tree 的同时，还会调用 enqueueUpdate 方法，这个方法能获取到每一个 DOM 方法最终修改的节点路径和值，如：`{root.cn.[0].cn.[4].value: "1"}`，并通过 setData 方法更新到视图层。

<img src="/images/mini25.jpg">

> 生命周期 🚩 - 参见源码 `taro-runtime > src > dsl > instance.ts`

生命周期的实现是在运行时维护的 App 实例 / Page 实例进行了生命周期方法的一一对应。

<img src="/images/mini26.jpg">

> 路由系统 🚩 - 参见源码 `taro-router > src > router.ts`

taro 的路由系统主要是引用了 `universal-router` 和 `history` 两个库，然后读取 config 中的配置，通过 createRouter 方法中 LocationListener 监听路由发生变化的时候， 页面具体的表现是 showPage、hidePage、loadPage还是 unloadPage 等


> 小结 🚩 

- Taro Next 的版本无 DSL 限制，用 React 还是 Vue 技术栈都可以开发
- 模版是固定的，然后基于组件的 template，动态 “递归” 渲染整棵 Taro DOM 树
- 虽然几乎全运行时框架优点很多，但是由于是运行时框架，所以会有一些性能问题

<img src="/images/mini33.jpg">

从上图可以看到相比于原生引入了 Vue 和 React包，这样无形之中对于小程序的拉包阶段来说就体积增大了.在加上运行时的耗时，Taro DOM Tree 的构建和更新，DOM data 的初始化和更新等一系列的时间成本。首次加载的性能数据跟原生比相对较低。但选择本身选择跨端框架就是一种则中的手段。具体性能可使用 <a href="https://github.com/NervJS/taro-benchmark">taro-benchmark</a> 和自己的项目进行对比。也可以看看<a href="https://my.oschina.net/o2team/blog/4450465">京东小程序 Taro 开发对比原生开发测评</a>




































