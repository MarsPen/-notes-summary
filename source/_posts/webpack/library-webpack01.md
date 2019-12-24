---
title: webpack 使用总结
date: 2019-11-20 20:06:12
top: false
cover: false
password:
toc: true
mathjax: false
summary:
tags:
  - webpack
categories:
  - webpack
---

## 介绍<hr>
在前端的历史车轮中出现过很多优秀的构建工具，例如 npm script、grunt、gulp、fis3、webpack、rollup, parcel 等等。也正是因为前端技术发展之快，才出现各种可以提高开发效率的工具，来提高生产力，减小开发成本。通过这篇文章主要了解以下两点

- 各大主流构建工具的对比以及优缺点
- webpack 常用的插件总结及配置

## 构建工具作用<hr>
在了解各大构建工具之前，我们要清楚构建工具是做什么的。实际上它就是将源代码转化成可执行的代码。如转换 javaScript、css、html等。在转换的过程中包含以下功能

- 将代码转换成能在浏览器中可执行的代码（es6、sass、less 等）
- 进行代码和页面级别、资源级别的优化（压缩、混淆、合并、缓存等）
- 进行代码分割和模块合并、规范校验等工作（提取页面公共代码等）
- 进行开发热更新、区分环境自动发布等

上面说了这么多实际上就是工程化、自动化的思想。将手动的流程用工具自动的解决一系列复杂的操作，解放生产力。

## 构建工具对比

通过对比能够更好的了解当前构建工具的应用场景和优缺点，下面我们来看看

### npm <hr>

> <a href="http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html">npm scripts 使用指南</a>

Npm Scripts（NPM脚本）是一个任务执行者。NPM 是安装 Node 时附带的一个包管理器，Npm Script 则是 NPM 内置的一个功能，允许在 package.json 文件里面使用 scripts 字段定义任务：

```js
{
    "scripts":{
        "dev": "node dev.js",
        "pub": "node build.js"
    }
}
```

里面的 scripts 字段是一个对象，每个属性对应一个 Shell 脚本，以上代码定义了两个任务，dev 和 pub。其底层实现原理是通过调用 Shell 去运行脚本命令，例如，执行 npm run pub 命令等同于执行 node build.js 命令。

优点：npm scripts 的优点是内置，无需安装其他依赖
缺点：功能太简单，虽然提供了 pre 和 post 两个钩子，但不能方便的管理多个任务之间的依赖。

### grunt <hr>

> <a href="https://gruntjs.com/">grunt 官网</a>

Grunt 现在已基本不用了，简单说一下。Grunt 和 Npm Scripts 类似，也是一个任务执行者。Grunt 有大量现成的插件封装了常见任务，也能管理任务之间的依赖关系，自动化地执行依赖任务，每个任务的具体执行代码和依赖关系写在配置文件 gruntfile.js 里。

优点：灵活，它只负责执行我们定义好的任务。大量可复用插件封装好了常见的构建任务。
缺点：集成度不高，要写很多配置后才可以用，无法做到开箱即用

### gulp <hr>

> <a href="https://www.gulpjs.com.cn/">gulp 官网</a>

Gulp 是一个基于流的自动化构建工具。除了可以管理任务和执行任务，还支持监听文件、读写文件。Gulp 被设计的非常简单，只通过下面5个方法就可以支持几乎所有构建场景：

- 通过 gulp.task 注册一个任务
- 通过 gulp.run 执行任务
- 通过 gulp.watch 监听文件变化
- 通过 gulp.src 读取文件
- 通过 gulp.dest 写完文件

```js
// 大致方法
// 引入 Gulp
var gulp = require("gulp");
// 引入插件
var jshint = require("gulp-jshint");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
....
// SCSS任务
gulp.task('scss', function() {
    // 读取文件，通过管道执行插件
    gulp.src('./scss/*.scss')
        // SCSS 插件将 scss 文件编译成 css
        .pipe(sass())
        // 输出文件
        .pipe(guilp.dest('./css'));
});
// 合并压缩 JavaScript 文件
gulp.task('scripts', function() {
    gulp.src('./js/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dest'));
});
// 监听文件变化
gulp.task('watch', function() {
    // 当 SCSS 文件被编辑时执行 SCSS 任务
    gulp.watch('./scss/*.scss', ['sass']);
    gulp.watch('./js/*.js', ['scripts']);
});
```

优点：好用又不失灵活，既可以单独完成构建，也可以和其他工具搭配使用
缺点：集成度不高，要写很多配置后才可以用，无法做到开箱即用

可以将 Gulp 看做是 Grunt 的加强版。相对于 Grunt ，Gulp 增加了文件监听、读写文件、流式处理的功能。

### fis3 <hr>

> <a href="http://fis.baidu.com/">fis3 官网</a>

Fis3是一个来自百度的优秀国产构建工具。相对于 Grunt、Gulp 这些只提供了基本功能的工具。Fis3集成了开发者常用的构建功能，如下所述。

- 读写文件：通过 fis.match 读文件，release 配置文件输出路径。
- 资源定位：解析文件之间的依赖关系和文件位置。
- 文件指纹：在通过 useHash 配置输出文件时为文件 URL加上 md5 戳，来优化浏览器的缓存。
- 文件编译：通过 parser 配置文件解析器做文件转换，例如将 ES6 编译成 ES5。
- 压缩资源：通过 optimizer 配置代码压缩方法。
- 图片合并：通过 spriter 配置合并 CSS 里导入的图片到一个文件中，来减少 HTTP 请求数。

```js
// 加 md5
fis.match('*.{js,css,png}', {
    useHash: true
});
// 通过fis3-parse-typescript插件可将 TypeScript 文件转换成 JavaScript 文件
fis.match('*.ts', {
    parser: fis.plugin('typescript')
});
// 对CSS进行雪碧图合并
fis.match('*.css', {
    // 为匹配到的文件分配属性 useSprite
    useSprite: true
});
// 压缩 JavaScript
fis.match('*.js', {
    optimizer: fis.plugin('uglify-js')
});
// 压缩CSS
fis.match('*.css', {
    optimizer: fis.plugin('clean-css')
});
// 压缩图片
fis.match('*.png', {
    optimizer: fis.plugin('png-compressor')
});
```

优点：集成了各种Web所需的构建功能，配置简单，开箱即用
缺点：目前官方已经不再更新和维护，不支持最新版本的 Node

> <a href="https://webpack.js.org/"> webpack 官网 </a>

webpack 是一个打包模块化的 JavaScript 的工具，在 webpack 里一切文件皆模块，通过 loader 转换文件，通过 Plugin 注入钩子，最后输出由多个模块组合成的文件。webpack 专注于构建模块化项目。

```js
// 大致方法
module.exports = {
    entry: './app.js',
    output: {
        filename: 'bundle.js'
    }
}
```

优点：

- 专注于处理模块化的项目，能做到开箱即用、一步到位；
- 可通过 Plugin 扩展，完整好用又不失灵活性；
- 使用场景不局限于Web开发；
- 社区庞大活跃，经常引入紧跟时代发展的新特性，能为大多数场景找到已有的开源扩展；
- 良好的开发体验；

缺点： 

只能用于采用模块化开发的项目

### rollup <hr>

> <a href="https://www.rollupjs.com/"> rollup 官网 </a>

Rollup 是一个和 webpack 很类似但专注于 ES6 的模块打包工具。它的亮点在于，针对 ES6 源码进行 Tree Shaking, 以去除那些已经被定义但没被使用的代码并进行 Scope Hoisting，以减少输出文件的大小和提升运行性能。然而 Rollup 的这些亮点随后就被 webpack 模仿和实现了。由于 Rollup 的使用方法和 webpack 差不多，所以这里就不详细介绍如何使用 Rollup 了，而是详细说明他们的差别：

- Rollup 是在 webpack 流行后出现的替代品；
- Rollup 生态链不完善，体验还不如 webpack；
- Rollup 的功能不如 webpack 完善，但其配置和使用更简单；
- Rollup 不支持 Code Spliting， 但好处是在打包出来的代码中没有 webpack 那段模块的加载、执行和缓存的代码。
- Rollup 在用于打包 JavaScript 库时比 webpack 更有优势，因为其打包出来的代码更小、更快。但他的功能不够完善，在很多场景下都找不到现成的解决方案

### parcel<hr>

>  <a href="https://parceljs.org/"> parcel 官网 </a>

Parcel 适用于经验不同的开发者。它利用多核处理提供了极快的速度，并且不需要任何配置。做到开箱即用。

优点：

- 极速打包。Parcel 使用 worker 进程去启用多核编译。同时有文件系统缓存，即使在重启构建后也能快速再编译。
- 开箱即用。对 JS, CSS, HTML, 文件 及更多的支持，而且不需要插件。
- 自动转换。如若有需要，Babel, PostCSS, 和PostHTML甚至 node_modules 包会被用于自动转换代码.
- 热模块替换。Parcel 无需配置，在开发环境的时候会自动在浏览器内随着你的代码更改而去更新模块。
- 友好的错误日志。当遇到错误时，Parcel 会输出 语法高亮的代码片段，帮助你定位问题。

缺点：

- 不支持SourceMap：在开发模式下，Parcel也不会输出SourceMap，目前只能去调试可读性极低的代码；
- 不支持剔除无效代码(TreeShaking)：很多时候我们只用到了库中的一个函数，结果Parcel把整个库都打包了进来；
- 一些依赖会让Parcel出错：当你的项目依赖了一些Npm上的模块时，有些Npm模块会让Parcel运行错误；
- 不灵活的配置： 零配置的Parcel关闭了很多配置项，在一些需要的配置的场景下无法改变
- 场景受限制：只能用来构建能用来构建用于运行在浏览器中的网页


通过上面的对比我们看到每种构建工具实际上都有应用的场景。每种工具也是时代应运产生的。那么在这几年流行的模块化、组件化也出现了很多组件库，CMD 规范的 seaJs、AMD 规范的 requireJs 等（<a href="https://juejin.im/post/5aaa37c8f265da23945f365c">区别</a>），这写规范无外乎都是解决开发中实际的问题。那么我们为什么会去选择 webpack 呢。

- 当前前端技术都会采用的新思想（模块化+新语言+新框架）去开发
- webpack 在4.0以后可以几乎零配置
- 可以为新项目提供一站式解决方案
- 有良好的生态和维护团队，学习资源多并且能够保证良好体验和质量
- vue 和 react 库的 cli 流行也是造成我们选择它的理由

那么接下来我来了解一下 webpack 的原理

## webpack 原理

在了解原理之前我们先认识基本的构建概念和构建流程

### 基本概念 <hr>

- entry 构建的入口文件
- output 构建完成的文件输出的位置
- module 模块，通过模块内的匹配规则和loader来处理文件
- loader 处理文件的文件转化器（ES6 -> ES5 等）
- plugin 插件，通过监听执行流程上的钩子函数可以做扩展功能
- chunk 多个文件组成的代码快

```js
// 简单的例子
const webpackConfig = {
  mode: _mode == "test" ? "development" : _mode,
  entry: {
    main: "./src/main.js"
  },
  output: {
    path: join(__dirname, "./dist/assets")
  },
  module: {
    // ...
  },
  optimization: {
    // ...
  },
  plugins: [..._plugins, new VueLoaderPlugin()],
  externals: {
    ..._externals
  },
  resolve: {
   // ...
  }
};
```

### 运行流程 <hr>

webpack 就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。

webpack 通过 Tapable 来组织这条复杂的生产线。 webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。  --吴浩麟《深入浅出webpack》

上面这段话把 webapck 做的事情解释的很清楚，实际上就是在构建的时候通过一系列的事件处理和回调来处理不同的功能。那么这种事件流是通过 Tapable 来管理的，关于 <a href="https://github.com/Pein892/learn-webpack-tapable">Tapable</a>请移步大佬的源码分析。

但是在 webpack4 中重写了事件流机制 <a href="https://webpack.js.org/api/compiler-hooks/"> webpack Hook</a>，由于源码的复杂性。在后面会通过思维导图的方式整理方便记忆。那么在<a href="https://github.com/webpack/changelog-v5/blob/master/README.md">webpack5</a> 中其实也增加了一些功能。在这里就不展开讨论了。


下面我们通过流程图来对 webpack 的执行流程作出分析

<img src="/images/webpack.png"></img>


- 首先读取 webpack.config.js 文件，初始化本次构建的配置参数
- 初始化参数阶段开始读取配置 Entries ，遍历所有入口文件。
- 依次进入每个入口文件使用配置好的loader 对文件内容进行解析编译，生成<a hre="https://juejin.im/post/5bff941e5188254e3b31b424">AST（静态语法树）</a>
- 最后输出代码 chunk、打包好的文件等


上面的过程只是粗略的介绍了执行流程，那么接下来还是通过一张图来看一下 webpack 内部到底是如何工作的

<img src="/images/webpack-render.jpg"></img>

通过上面的图已经很清楚的看到在 webpack 的每个阶段要做的事情熟悉整个流程有助于帮助我们理解日常的开发。下面我们就日常开发列出一些常用 loader 和 plugin

## webpack 常用插件

我们通过配置的伪代码来介绍我们常用的功能几插件

### mode<hr>

```js
const webpackConfig  = {
  mode: _mode == "test" ? "development" : 'production',
}
```

通过 mode 可以控制我们是开发还是线上环境通过控制环境来区分执行的文件如果 production 除了我们配置的以外 webpack 会默认开启以下插件

- FlagDependencyUsagePlugin（编译时标记依赖）
- FlagIncludedChunksPlugin（标记chunks,防止chunks多次加载）
- ModuleConcatenationPlugin（scope hoisting，预编译功能，提升代码在浏览器中的执行速度）
- NoEmitOnErrorsPlugin（在编译时候遇到错误可以跳过输出阶段，确保输出资源不会包含错误）
- OccurrenceOrderPlugin（给生成的 chunkid 排序）
- SideEffectsFlagPlugin（module.rules 的SideEffects 标志）
- uglifyjs-webpack-plugin（删除未引用代码并压缩 js） 


### entry <hr>

单页面入口配置

```js
const webpackConfig  = {
  mode: _mode == "test" ? "development" : 'production',
  entry: {
    main: "./src/main.js"
  }
}
```

多页面入口配置

```js
const webpackConfig  = {
  mode: _mode == "test" ? "development" : 'production',
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
}
```

### output<hr>

```js
const webpackConfig  = {
  //...
  output: {
    path: join(__dirname, "./dist/assets")
  }
}
```

也可以对输出文件进行 hash 和 publicPath 设置，publicPath 可以设置 cdn 地址这样可以优化加载文件时间

```js
const webpackConfig  = {
  // ...
  output: {
    filename: "scripts/[name].[contenthash:5].bundule.js",
    publicPath: "/assets/"
  }
}
```

### module <hr>

```js
// loaders
const webpackConfig  = {
  // ...
  module: {
    // 创建模块时，匹配请求的规则数组
    // 通过这些规则可以对模块(module)应用 loader 和或者修改解析器(parse)
    rules: [
      {
        test: /\.js$/,  // 匹配规则
        exclude: /(node_modules|bower_components)/,   // 排除文件
        use: {
          loader: "babel-loader"  // 使用的loader
        }
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              // 小于 10kB(10240字节）的内联文件
              limit: 5 * 1024,
              name: _modeflag
                ? "images/[name].[contenthash:5].[ext]"
                : "images/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
}
```
更多配置参数请参考<a href="https://webpack.docschina.org/configuration/module/#module-rules">webpack 官网</a>

### plugin <hr>

```js
// plugins
const webpackConfig  = {
  // ...
  plugins: [
    //分析当前包的大小
    new BundleAnalyzerPlugin(),
    // 创建html入口文件
    new HtmlwebpackPlugin({
      filename: "index.html",
      template: "./src/index-dev.html"
    }),
    // webpack构建错误和警告通知
    new webpackBuildNotifierPlugin({
      title: "前端项目",
      logo: resolve("./favicon.png"),
      suppressSuccess: true
    }),
    // 友好提示插件
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: ["You application is running here http://localhost:8080"],
        notes: ["请配置代理之后运行本服务"]
      },
      //提示好的工具 进行更详细的展现
      onErrors: function(severity, errors) {},
      clearConsole: true
    })
  ]
}
```
上面只是列举了几个开发环境中常用的 plugin，其实还有很多例如线上环境可以配置 OptimizeCssAssetsPlugin 、MiniCssExtractPlugin可以进行css 优化，ProgressBarPlugin 进度条等在这里就不列举了。

### optimization<hr>

```js
// 优化配置
const webpackConfig = {
  // ...
  optimization: {
    runtimeChunk: {
      name: "runtime"
    },
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          name: "commons"
        }
      }
    }
  }
}
```

关于更多参数及更多 plugins 请参考<a href="https://webpack.docschina.org/plugins/split-chunks-plugin/">webapck 官网</a>

### externals<hr>

```js
// 外部扩展
const webpackConfig = {
  // ...
  externals: {
    vue: "Vue",
    "vue-router": "VueRouter",
    vuex: "Vuex",
    axios: "axios"
  }
}
```

### resolve<hr>
```js
// 别名设置
const webpackConfig  = {
  // ...
  resolve: {
    alias: {
      "@": resolve("src")
    },
    extensions: [".js", ".vue"]
  }
}
```

### devServer<hr>

```js
// 开发环境启动服务配置
const webpackConfig = {
  devServer: {
    quiet: true,
    open:true,
    historyApiFallback: true,
    proxy: {
      "/api": "http://localhost:3000"
    },
    hot: true,
    contentBase: join(__dirname, "../dist/assets"),
  }
}
```

以上就是在 webpack 开发中常用的配置，更多配置及优化请参考官网。

## 参考文章
<a href="https://github.com/gwuhaolin/dive-into-webpack/">深入浅出 webpack </a>
