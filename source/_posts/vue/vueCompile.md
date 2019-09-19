---
title: vue 原理之编译
date: 2019-09-19 15:02:12
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


## 编译入口

还记得我们在第一篇文章介绍整理的执行过程的时候通过，在 $mount 这个函数内调用 compileToFunctions 吗？下面我们再来看看这个方法

```js
// ...
  const { render, staticRenderFns } = compileToFunctions(template, {
    shouldDecodeNewlines,
    shouldDecodeNewlinesForHref,
    delimiters: options.delimiters,
    comments: options.comments
  }, this)
  options.render = render
  options.staticRenderFns = staticRenderFns
// ...
```

compileToFunctions 来至于 `src/compiler/index.js` 中  createCompiler(baseOptions) 

```js

// createCompilerCreator 允许创建使用alternative的编译器
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// 这里我们只是使用默认部分导出一个默认编译器
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

### createCompilerCreator <hr>

createCompilerCreator 来至于 `src/compiler/create-compiler.js`中

```js
export function createCompilerCreator (baseCompile: Function): Function {
  return function createCompiler (baseOptions: CompilerOptions) {
    function compile (
      template: string,
      options?: CompilerOptions
    ): CompiledResult {
      const finalOptions = Object.create(baseOptions)
      const errors = []
      const tips = []
      finalOptions.warn = (msg, tip) => {
        (tip ? tips : errors).push(msg)
      }

      if (options) {
        // 合并自定义模块
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules)
        }
        // 合并自定义指令
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          )
        }
        // 复制其他参数
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key]
          }
        }
      }

      const compiled = baseCompile(template, finalOptions)
      if (process.env.NODE_ENV !== 'production') {
        errors.push.apply(errors, detectErrors(compiled.ast))
      }
      compiled.errors = errors
      compiled.tips = tips
      return compiled
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}
```

该方法返回了一个 createCompiler 的函数，它接收一个 baseOptions 的参数，返回的是一个对象，包括 compile 方法属性和 compileToFunctions 属性，这个 compileToFunctions 对应的就是 $mount 函数调用的 compileToFunctions 方法，它是调用 createCompileToFunctionFn 方法的返回值。

### createCompileToFunctionFn <hr>

我们接下来看一下 createCompileToFunctionFn 方法，它的定义在 `src/compiler/to-function/js` 中

```js
export function createCompileToFunctionFn (compile: Function): Function {
  const cache = Object.create(null)

  return function compileToFunctions (
    template: string,
    options?: CompilerOptions,
    vm?: Component
  ): CompiledFunctionResult {
    options = extend({}, options)
    const warn = options.warn || baseWarn
    delete options.warn

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      // detect possible CSP restriction
      try {
        new Function('return 1')
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          )
        }
      }
    }

    // check cache
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template
    if (cache[key]) {
      return cache[key]
    }

    // 编译
    const compiled = compile(template, options)

    // 检查编译错误/提示
    if (process.env.NODE_ENV !== 'production') {
      if (compiled.errors && compiled.errors.length) {
        warn(
          `Error compiling template:\n\n${template}\n\n` +
          compiled.errors.map(e => `- ${e}`).join('\n') + '\n',
          vm
        )
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(msg => tip(msg, vm))
      }
    }

    // 将代码转换为函数
    const res = {}
    const fnGenErrors = []
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors)
    })

    // 检查函数生成错误.
    // 只有当编译器本身存在错误时，才会发生这种情况
    // 主要用于codegen 开发使用
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          `Failed to generate render function:\n\n` +
          fnGenErrors.map(({ err, code }) => `${err.toString()} in\n\n${code}\n`).join('\n'),
          vm
        )
      }
    }

    return (cache[key] = res)
  }
```

### compile<hr>

通过上面函数我们看到 compileToFunctions 接收三个参数，编译模板 template，编译配置 options 和 Vue 实例 vm。核心代码只有一行

```js
const compiled = compile(template, options)
```

### baseCompile<hr>

compile 函数执行的逻辑是先处理配置参数，真正执行编译过程就一行代码：

```js
const compiled = baseCompile(template, finalOptions)
```

baseCompile 是在执行 createCompilerCreator 方法时作为参数传入的所以绕了一圈真正的入口就是

```js
// `createCompilerCreator`允许创建使用alternative的编译器
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// 这里我们只是使用默认部分导出一个默认编译器
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```
### 主要执行步骤<hr>

> 解析模板字符串生成 AST

```js
const ast = parse(template.trim(), options)
```

> 优化语法树

```js
optimize(ast, options)
```

> 生成代码

```js
const code = generate(ast, options)
```


## parse

parse 定义在 `src/compiler/parser/index.js` 中，由于编译流程较为复杂难懂所以我们只了解大概的流程

parse 接收两个参数 template 和 options 对于 options 不去研究平台特殊性，template 模板的解析主要是通过 parseHTML 函数循环解析

```js
parseHTML(template, options)
```

对于不同情况分别进行不同的处理，在匹配的过程中会利用 advance 函数不断前进整个模板字符串，直到字符串末尾。

```js
function advance (n) {
  index += n
  html = html.substring(n)
}
```

- 对于注释和条件注释节点，前进至它们的末尾位置；对于文档类型节点，则前进它自身长度的距离
- 通过 parseStartTag 解析开始标签(通过 startTagOpen配置开始标签，然后定义了 match 对象，通过 handleStartTag 处理 match.attrs,最后调用 options.start回调函数)
- 通过正则 endTag 匹配到闭合标签，然后前进到闭合标签末尾，然后执行 parseEndTag 方法对闭合，最后调用 options.end 回调函数
- 判断 textEnd 是否大于等于 0 说明从当前位置到 textEnd 位置都是文本，如果 extEnd 小于 0 的情况，则说明整个 template 解析完毕了，将剩余的 html 都赋值给了 text，最后调用了 options.chars 回调函数，并传 text 参数

### options.start 处理开始标签<hr>

```js
// ...
start (tag, attrs, unary) {
  let element = createASTElement(tag, attrs)
  processElement(element)
  treeManagement()
}
// ...
```
- 通过 createASTElement 创建 AST 元素
- 处理 AST 元素
- AST 树管理

> createASTElement

```js
// ...
// 每一个 AST 元素是一个普通的 JavaScript 对象
// type 表示 AST 元素类型
// tag 表示标签名
// attrsList 表示属性列表
// attrsMap 表示属性映射表
// parent 表示父的 AST 元素
// children 表示子 AST 元素集合。
export function createASTElement (
  tag: string,
  attrs: Array<Attr>,
  parent: ASTElement | void
): ASTElement {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent,
    children: []
  }
}
// ...
```
> processElement(element)

调用 preTransforms、transforms、postTransforms 函，然后通过各种指令 processXXX 做处理，处理的结果就是扩展 AST 元素的属性，如 processFor 解析 v-for 指令内容，将解析的属性值添加到 AST 的元素上

> treeManagement()

AST 树管理的目标是构建一颗 AST 树，本质上利用 stack 栈的数据结构来维护 root 根节点和当前父节点 currentParent。



### options.end 处理闭合标签<hr>

```js
end () {
  treeManagement()
  closeElement()
}
```

> 首先处理了尾部空格的情况,然后把 stack 的元素弹一个出栈，并把 stack 最后一个元素赋值给 currentParent，这样就维护了整个 AST 树。

```js
// remove trailing whitespace
const element = stack[stack.length - 1]
const lastNode = element.children[element.children.length - 1]
if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
  element.children.pop()
}
// pop stack
stack.length -= 1
currentParent = stack[stack.length - 1]
closeElement(element)
```

> closeElement 更新一下 inVPre 和 inPre 的状态，以及执行 postTransforms 函数 

```js
function closeElement (element) {
  // check pre state
  if (element.pre) {
    inVPre = false
  }
  if (platformIsPreTag(element.tag)) {
    inPre = false
  }
  // apply post-transforms
  for (let i = 0; i < postTransforms.length; i++) {
    postTransforms[i](element, options)
  }
}
```

### options.chars 处理文本内容<hr>

```js
chars (text: string) {
  handleText()
  createChildrenASTOfText()
}
```

通过执行 parseText(text, delimiters) 对文本解析, 定义在 `src/compiler/parser/text-parsre.js` 中，主要流程就是

```js

// 先根据分隔符（默认是 `{{}}`）构造了文本匹配的正则表达式，然后再循环匹配文本
// 遇到普通文本就 push 到 rawTokens 和 tokens 中
// 如果是表达式就转换成 `_s(${exp})` push 到 tokens 中
// 转换成 `{@binding:exp}` push 到 rawTokens 中

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g

const buildRegex = cached(delimiters => {
  const open = delimiters[0].replace(regexEscapeRE, '\\$&')
  const close = delimiters[1].replace(regexEscapeRE, '\\$&')
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
})

export function parseText (
  text: string,
  delimiters?: [string, string]
): TextParseResult | void {
  const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE
  if (!tagRE.test(text)) {
    return
  }
  const tokens = []
  const rawTokens = []
  let lastIndex = tagRE.lastIndex = 0
  let match, index, tokenValue
  while ((match = tagRE.exec(text))) {
    index = match.index
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index))
      tokens.push(JSON.stringify(tokenValue))
    }
    // tag token
    const exp = parseFilters(match[1].trim())
    tokens.push(`_s(${exp})`)
    rawTokens.push({ '@binding': exp })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex))
    tokens.push(JSON.stringify(tokenValue))
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}
```

### 小结 <hr>

- parse 的作用就是将 template 模版字符串转换成 AST 树。其实是用对象的形式来描述整个模版，用正则顺序解析模版，达到构建 AST 树的目的
- AST 元素节点总共有 3 种类型，type 为 1 表示是普通元素，为 2 表示是表达式，为 3 表示是纯文本


## optimize

optimize 方法的定义，在 `src/compiler/optimizer.js` 中

```js
export function optimize (root: ?ASTElement, options: CompilerOptions) {
  if (!root) return
  isStaticKey = genStaticKeysCached(options.staticKeys || '')
  isPlatformReservedTag = options.isReservedTag || no
  // first pass: mark all non-static nodes.
  markStatic(root)
  // second pass: mark static roots.
  markStaticRoots(root, false)
}

function genStaticKeys (keys: string): Function {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}
```

通过 optimize 函数我们看到优化主要就做了两件事情

### markStatic(root) 标记静态节点<hr>

```js
function markStatic (node: ASTNode) {
  node.static = isStatic(node)
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i]
      markStatic(child)
      if (!child.static) {
        node.static = false
      }
    }
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block
        markStatic(block)
        if (!block.static) {
          node.static = false
        }
      }
    }
  }
}

function isStatic (node: ASTNode): boolean {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}
```
- 通过 isStatic 函数判断 AST 是否是静态
- type === 2 为表达式不是静态
- type === 3 是纯文本是静态
- 普通元素，如果有 pre 属性 是静态
- 没有使用 v-if、 v-for 、没有使用其它指令（不包括 v-once）、非内置组件、是平台保留的标签、节点的所有属性的 key 都满足静态 key，这些都满足则这个 AST 节点是一个静态节点
- 递归遍历普通元素，如果一旦子节点有不是静态的情况，则父节点的 static 变为 false

### markStaticRoots(root, false) 标记静态根<hr>

```js
function markStaticRoots (node: ASTNode, isInFor: boolean) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true
      return
    } else {
      node.staticRoot = false
    }
    if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for)
      }
    }
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor)
      }
    }
  }
}
```

- 对于已经是 static 的节点或者是 v-once 指令的节点，node.staticInFor = isInFor
- 本身是一个静态节点外，满足拥有 children，并且 children 不能只是一个文本节点，才有资格成为 staticRoot 的节点
- 递归遍历普通元素，如果一旦子节点有不是静态的情况，则父节点的 static 变为 false


### 小结<hr>

optimize 的过程，就是深度遍历这个 AST 树，检测它的每一颗子树是不是静态节点，如果是静态节点则它们生成 DOM 永远不需要改变，这样我们在 patch 的过程就不会对比为静态属性的节点


## codegen

最后一步就是将优化过后的 AST 树转化成执行的代码

```js
const code = generate(ast, options)
```

generate 函数的定义在 src/compiler/codegen/index.js 中

```js
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}
```
### CodegenState <hr>

调用 CodegenState 函数，获取所有 modules 中的 genData 函数

### genElement <hr>

调用 genElement 函数生成 code

```js
export function genElement (el: ASTElement, state: CodegenState): string {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    let code
    if (el.component) {
      code = genComponent(el.component, el, state)
    } else {
      const data = el.plain ? undefined : genData(el, state)

      const children = el.inlineTemplate ? null : genChildren(el, state, true)
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
    // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code)
    }
    return code
  }
}
```

根据 AST 的属性执行不同的代码生成函数，这里面有 genStatic、genOnce、genFor、genIf、genChildren、genSlot、genData、genComponent

### 执行 code <hr> 

用 `with(this){return ${code}}` 将 code 传入 render 中执行 new Function()

```js
const compiled = compile(template, options)
res.render = createFunction(compiled.render, fnGenErrors)

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}
```

## 总结

<img src="/images/vue-dom-diff12.png"></img>



















