---
title: vue 原理之组件更新
date: 2019-09-18 10:50:28
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

上一篇文章我们对响应式原理进行了梳理，知道了当数据发生变化会触发 watcher 的回调，进行组件更新，那么接下来我们看看更新的操作是怎么进行了。`src/core/instance/lifecycle.js` 中 `vm._update` 方法

### vm._update <hr>

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  // ...
  const prevVnode = vm._vnode
  if (!prevVnode) {
     // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  // ...
}
```

###  vm.__patch__ <hr>

`vm._update` 方法主要通过节点来判断传入的参数，但是执行的方法都是 `vm.__patch__`,接下我们看一下 `src/core/vdom/patch.js` 中 patch 函数

 ```js
return function patch (oldVnode, vnode, hydrating, removeOnly) {
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
    return
  }

  let isInitialPatch = false
  const insertedVnodeQueue = []

  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element
    isInitialPatch = true
    createElm(vnode, insertedVnodeQueue)
  } else {
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // patch existing root node
      patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
    } else {
      if (isRealElement) {
         // ...
      }

      // replacing existing element
      const oldElm = oldVnode.elm
      const parentElm = nodeOps.parentNode(oldElm)

      // create new node
      createElm(
        vnode,
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm)
      )

      // update parent placeholder node element, recursively
      if (isDef(vnode.parent)) {
        let ancestor = vnode.parent
        const patchable = isPatchable(vnode)
        while (ancestor) {
          for (let i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](ancestor)
          }
          ancestor.elm = vnode.elm
          if (patchable) {
            for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, ancestor)
            }
            // #6513
            // invoke insert hooks that may have been merged by create hooks.
            // e.g. for directives that uses the "inserted" hook.
            const insert = ancestor.data.hook.insert
            if (insert.merged) {
              // start at index 1 to avoid re-invoking component mounted hook
              for (let i = 1; i < insert.fns.length; i++) {
                insert.fns[i]()
              }
            }
          } else {
            registerRef(ancestor)
          }
          ancestor = ancestor.parent
        }
      }

      // destroy old node
      if (isDef(parentElm)) {
        removeVnodes(parentElm, [oldVnode], 0, 0)
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode)
      }
    }
  }

  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
  return vnode.elm
}
 ```


 可以看到 patch 的逻辑进来通过判断是否有 oldVnode 来区分是否是首次渲染，进行不同的逻辑，接下来我们通过  `sameVNode(oldVnode, vnode)` 

```js
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```

根据 vnode 的 key 进行判断是否是相同的，再继续根据 isComment、data、sameInputType 的类型是否相同来判断同步组件，对于异步组件则通过判断 asyncFactory 是否相同，所以是根据判断它们是否是相同的 vnode 来区分不同的更新逻辑

### 新旧节点不同<hr>

如果新旧节点不同,那么就是替换已经存在的节点大致流程为

- 创建新节点
- 更新父的占位符节点
- 删除旧节点

```js
const oldElm = oldVnode.elm
const parentElm = nodeOps.parentNode(oldElm)
// create new node
createElm(
  vnode,
  insertedVnodeQueue,
  // extremely rare edge case: do not insert if old element is in a
  // leaving transition. Only happens when combining  transition +
  // keep-alive + HOCs. (#4590)
  oldElm._leaveCb ? null : parentElm,
  nodeOps.nextSibling(oldElm)
)
```
创建新节点调用的是 createElm 方法， 以当前旧节点为参考，创建新的节点，并插入到 DOM 中

```js
// update parent placeholder node element, recursively
if (isDef(vnode.parent)) {
  let ancestor = vnode.parent
  const patchable = isPatchable(vnode)
  while (ancestor) {
    for (let i = 0; i < cbs.destroy.length; ++i) {
      cbs.destroy[i](ancestor)
    }
    ancestor.elm = vnode.elm
    if (patchable) {
      for (let i = 0; i < cbs.create.length; ++i) {
        cbs.create[i](emptyNode, ancestor)
      }
      // #6513
      // invoke insert hooks that may have been merged by create hooks.
      // e.g. for directives that uses the "inserted" hook.
      const insert = ancestor.data.hook.insert
      if (insert.merged) {
        // start at index 1 to avoid re-invoking component mounted hook
        for (let i = 1; i < insert.fns.length; i++) {
          insert.fns[i]()
        }
      }
    } else {
      registerRef(ancestor)
    }
    ancestor = ancestor.parent
  }
}
```

找到当前的 vnode 的 父的占位符节点，先执行 cbs.destroy 钩子函数，如果当前占位符是一个可挂载的节点，则执行 cbs.create 钩子函数

```js
// destroy old node
if (isDef(parentElm)) {
  removeVnodes(parentElm, [oldVnode], 0, 0)
} else if (isDef(oldVnode.tag)) {
  invokeDestroyHook(oldVnode)
}
```

将 oldVnode 从当前 DOM 树中删除，如果存在父节点，执行 removeVnodes 方法

```js
function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (isDef(ch)) {
      if (isDef(ch.tag)) {
        removeAndInvokeRemoveHook(ch)
        invokeDestroyHook(ch)
      } else { // Text node
        removeNode(ch.elm)
      }
    }
  }
}

function removeAndInvokeRemoveHook (vnode, rm) {
  if (isDef(rm) || isDef(vnode.data)) {
    let i
    const listeners = cbs.remove.length + 1
    if (isDef(rm)) {
      // we have a recursively passed down rm callback
      // increase the listeners count
      rm.listeners += listeners
    } else {
      // directly removing
      rm = createRmCb(vnode.elm, listeners)
    }
    // recursively invoke hooks on child component root node
    if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
      removeAndInvokeRemoveHook(i, rm)
    }
    for (i = 0; i < cbs.remove.length; ++i) {
      cbs.remove[i](vnode, rm)
    }
    if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
      i(vnode, rm)
    } else {
      rm()
    }
  } else {
    removeNode(vnode.elm)
  }
}

function invokeDestroyHook (vnode) {
  let i, j
  const data = vnode.data
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode)
    for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
  }
  if (isDef(i = vnode.children)) {
    for (j = 0; j < vnode.children.length; ++j) {
      invokeDestroyHook(vnode.children[j])
    }
  }
}
```

- 遍历待删除的 vnodes 做删除，
- 调用 removeAndInvokeRemoveHook 执行 cbs.remove 钩子进行删除。如果存在子节点则进行递归调用 removeAndInvokeRemoveHook
- 调用 invokeDestroyHook 执行 cbs.destroy 钩子，进行销毁。如果存在子节点则进行递归调用 invokeDestroyHook
- 执行 removeNode 调用平台的 DOM API 删除真正的 DOM 节点


### 新旧节点相同<hr>

```js
 if (!isRealElement && sameVnode(oldVnode, vnode)) {
    // patch existing root node
    patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
  } else {
    // ...
  }
```

当新旧节点相同的时候,会调用 patchVnode 方法

```js
function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  if (oldVnode === vnode) {
    return
  }

  const elm = vnode.elm = oldVnode.elm

  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    if (isDef(vnode.asyncFactory.resolved)) {
      hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
    } else {
      vnode.isAsyncPlaceholder = true
    }
    return
  }

  // reuse element for static trees.
  // note we only do this if the vnode is cloned -
  // if the new node is not cloned it means the render functions have been
  // reset by the hot-reload-api and we need to do a proper re-render.
  if (isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    vnode.componentInstance = oldVnode.componentInstance
    return
  }

  let i
  const data = vnode.data
  if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
    i(oldVnode, vnode)
  }

  const oldCh = oldVnode.children
  const ch = vnode.children
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
  }
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    } else if (isDef(ch)) {
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text)
  }
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
  }
}
```

patchVnode 将 vnode patch 到旧的 vnode 上将执行以下主要过程
- 如果两个vnode相等，不需要 patch
- 如果是异步占位，执行 hydrate 方法或者定义 isAsyncPlaceholder 为 true
- 当更新的 vnode 是组件 vnode 的时候， 执行 i.prepatch 钩子函数，拿到最新的 vnode 组件配置以及组件的实例后，执行 updateChildComponent 方法更新 vm 实例上一系列的属性和方法
- 执行 cbs.update 钩子函数
- 完成 patch 过程
- 执行 postpatch 钩子函数

上面执行的步骤我们重点关注一下完成 patch 的过程，这也是 vnode diff 最复杂的地方

```js
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    } else if (isDef(ch)) {
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text)
  }
```

- 如果 vnode 是个文本节点且新旧文本不相同，则直接替换文本内容，否则根据不同情况处理逻辑
- oldCh 与 ch 都存在且不相同时，调用 updateChildren 来更新子节点
- 当只有 ch 存在，判断旧的节点是文本节点则先将节点的文本清除，然后通过 addVnodes 将 ch 批量插入到新节点 elm 下，表示不需要旧节点了
- 当只有 oldCh 存在，将旧的节点通过 removeVnodes 全部清除，表示更新的是空节点
- 当只有旧节点是文本节点的时候，则清除其节点文本内容

### updateChildren <hr>
上面在判断 oldCh 与 ch 都存在且不相同时调用 updateChildren 来更新子节点，接下来我们看看这个函数

```js
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0] 
  let oldEndVnode = oldCh[oldEndIdx] 
  let newEndIdx = newCh.length - 1 
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  
  // removeOnly 是一个只用于 <transition-group> 的特殊标签，
  // 确保移除元素过程中保持一个正确的相对位置。
  const canMove = !removeOnly

  if (process.env.NODE_ENV !== 'production') {
    checkDuplicateKeys(newCh)
  }

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      // 开始老 vnode 向右一位
      oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
    } else if (isUndef(oldEndVnode)) {
      // 结束老 vnode 向左一位
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 新旧开始 vnode 相似，进行pacth。开始 vnode 向右一位
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 新旧结束 vnode 相似，进行patch。结束 vnode 向左一位
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
      // 新结束 vnode 和老开始 vnode 相似，进行patch。
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
      // 老开始 vnode 插入到真实 DOM 中，老开始 vnode 向右一位，新结束 vnode 向左一位
      canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
     // 老结束 vnode 和新开始 vnode 相似，进行 patch。
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
      // 老结束 vnode 插入到真实 DOM 中，老结束 vnode 向左一位，新开始 vnode 向右一位
      canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 获取老 Idx 的 key
      if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      // 给老 idx 赋值
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      if (isUndef(idxInOld)) { // New element
        // 如果老 idx 为 undefined，说明没有这个元素，创建新 DOM 元素。
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
      } else {
        // 获取 vnode
        vnodeToMove = oldCh[idxInOld]
        if (sameVnode(vnodeToMove, newStartVnode)) {
          // 如果生成的 vnode 和新开始 vnode 相似，执行 patch。
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
          // 赋值 undefined，插入 vnodeToMove 元素
          oldCh[idxInOld] = undefined
          canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
          // 相同的key不同的元素，视为新元素
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        }
      }
      // 新开始 vnode 向右一位
      newStartVnode = newCh[++newStartIdx]
    }
  }
  // 如果老开始 idx 大于老结束 idx，如果是有效数据则添加 vnode 到新 vnode 中。
  if (oldStartIdx > oldEndIdx) {
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
```


上面的逻辑比较复杂，我们通过一个简单的例子先来看一下
```js
<div id="app">
  <div>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.val }}</li>
    </ul>
  </div>
  <button @click="change">点击我</button>
</div>

<script>
  var app = new Vue({
    el: '#app',
    data: {
      items: [
        { id: 0, val: 'A' },
        { id: 1, val: 'B' },
        { id: 2, val: 'C' },
        { id: 3, val: 'D' }
      ]
    },
    methods: {
      change() {
        this.items.reverse().push({ id: 4, val: 'E' })
      }
    }
  })
</script>
```

上面的代码很简单就是初始化的时候渲染列表为 A、B、C、D，当点击的时候将数据中 push 一个 E 并且进行反转，结果为 D、C、B、A、E 那么具体怎么更新的呢，看一下下面的流程

第一步:
<img src="/images/vue-dom-diff01.png">

第二步:
<img src="/images/vue-dom-diff02.png">

第三步:
<img src="/images/vue-dom-diff03.png">

第四步:
<img src="/images/vue-dom-diff04.png">

第五步:
<img src="/images/vue-dom-diff05.png">

第六步:
<img src="/images/vue-dom-diff06.png">


通过上面流程图，我们很清晰的知道实际上就是新旧节点对比移动的过程那么我们拆分 updateChildren 函数

> 初始化全局变量

```js
  let oldStartIdx = 0  // 旧节点索引开始位置
  let newStartIdx = 0 // 新节点索引开始位置
  let oldEndIdx = oldCh.length - 1 // 旧节点索引终点位置
  let oldStartVnode = oldCh[0] //  旧节点开始值
  let oldEndVnode = oldCh[oldEndIdx] // 旧节点最后一位的值
  let newEndIdx = newCh.length - 1 // 新节点索引结束位置
  let newStartVnode = newCh[0] // 新节点开始值
  let newEndVnode = newCh[newEndIdx] // 新节点结束的值
```

> 定义循环，在遍历过程中，oldStartIdx 和 newStartIdx 递增，oldEndIdx 和 newEndIdx 递减。当条件不符合跳出遍历循环

```js
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  // ...
}
```

> 检测 oldStartVnode、oldEndVnode。如果 oldStartVnode 不存在，oldCh 起始点向后移动。如果 oldEndVnode 不存在，oldCh 终止点向前移动。

```js
if (isUndef(oldStartVnode)) {
  oldStartVnode = oldCh[++oldStartIdx]
} else if (isUndef(oldEndVnode)) {
  oldEndVnode = oldCh[--oldEndIdx]
}
```

> 对比 oldStartVnode 和 newStartVnode 如果为真则执行 patchVnode 同时彼此向后移动一位

```js
else if (sameVnode(oldStartVnode, newStartVnode)) {
  patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
  oldStartVnode = oldCh[++oldStartIdx]
  newStartVnode = newCh[++newStartIdx]
}
```

>  对比 oldEndVnode 和 newEndVnode 如果为真则执行 patchVnode 同时彼此向前移动一位

```js
else if (sameVnode(oldEndVnode, newEndVnode)) {
  patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
  oldEndVnode = oldCh[--oldEndIdx]
  newEndVnode = newCh[--newEndIdx]
}
```

> 对比 oldStartVnode 和 newEndVnode 如果为真则执行 patchVnode，然后将该节点移动到 vnode 数组最后一位

```js
else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
  patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
  canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
  oldStartVnode = oldCh[++oldStartIdx]
  newEndVnode = newCh[--newEndIdx]
}
```

> 对比 oldEndVnode 和 newStartVnode 如果为真则执行 patchVnode，然后将该节点移动到 vnode 数组第一位

```js
else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
  patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
  canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
  oldEndVnode = oldCh[--oldEndIdx]
  newStartVnode = newCh[++newStartIdx]
}
```
> 对比 idx 如果没有相同的 idx 则执行 createElm 创建元素。

```js
if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
idxInOld = isDef(newStartVnode.key)
  ? oldKeyToIdx[newStartVnode.key]
  : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
if (isUndef(idxInOld)) { // New element
  createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
}
```

>  对比 idx 如果两个 vnode 相似，则先执行 patchVnode，节点移动到 vnode 数组第一位。如果两个 vnode 不相似，视为新元素，执行 createElm 创建

```js
vnodeToMove = oldCh[idxInOld]
if (sameVnode(vnodeToMove, newStartVnode)) {
  patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
  oldCh[idxInOld] = undefined
  canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
} else {
 // same key but different element. treat as new element
 createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
}
newStartVnode = newCh[++newStartIdx]
```

>  如果老 vnode 数组的开始索引大于结束索引，说明新 node 数组长度大于老 vnode 数组，执行 addVnodes 方法添加这些新 vnode 到 DOM 中

```js
if (oldStartIdx > oldEndIdx) {
  refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
  addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
}
```

> 如果老 vnode 数组的开始索引小于结束索引，说明老 node 数组长度大于新 vnode 数组，执行 removeVnodes 方法从 DOM 中移除老 vnode 数组中多余的 vnode

```js
else if (newStartIdx > newEndIdx) {
  removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
}
```

### 总结

经过上面的代码解析我们知道 vue 的 diff 对默认的 diff 执行了优化，查找的同一级的节点通过唯一的 key 去区分。如果节点类型相同重新设置该节点的属性，直接更新。如果不同，直接干掉前面的节点，创建并插入新的节点，不再比较这个节点以后的子节点。而不是同一级别每一个去比较并更新替换。如下图
<img src="/images/vue-dom-diff08.png">

如上图我们希望在 A 和 B 之间加一个 F，那默认的 diff 算法是这样的
<img src="/images/vue-dom-diff09.png">

vue 通过每一个节点的 key 标识符是这样的
<img src="/images/vue-dom-diff10.png">

下面我们通过 一张图来大致总结 patchVnode 的流程
<img src="/images/vue-dom-diff11.png">
