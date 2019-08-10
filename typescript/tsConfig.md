## tsconfig.json

如果一个目录下存在一个tsconfig.json文件，它会把一个文件夹转换为项目，也意味着这个目录是TypeScript项目的根目录

### 使用tsconfig.json

初始化 tsconfig.json 或者手动建立文件tsconfig.json
```
tsc --init
```

如果项目配置了tsconfig.json，那么在进行转换的时候可以在命令行直接输入
```
tsc 
```
编译器会从当前目录开始去查找tsconfig.json文件，逐级向上搜索父目录

否则就需要在编译时加上文件及目录
```
tsc test.ts
```
默认在当前目录生成test.js


### 编写需要的配置项

下面这个例子是列举了在项目中经常用到的配置，当前根据项目的不同会有区别

```
{

  "compileOnSave": true, //让IDE在保存文件的时候根据tsconfig.json重新生成文件
  "compilerOptions": {
    "target": "ES5", // 目标代码类型版本
    "outDir":"build/", // 重定向输出目录
    "baseUrl":  "https://test.file.com", // 解析非相对模块名的基准目录
    "noImplicitAny":true, // 在表达式和声明上有隐含的'any'类型时报错
    "removeComments":true, //编译 js 的时候，删除掉注释
    "preserveConstEnums":true, // 保留const和enum声明
    "experimentalDecorators": true, // 使用装饰器要开始此选项
    "emitDecoratorMetadata": true, // 在使用reflect-metadata库时候需要添加，给源码里的装饰器声明加上设计类型元数据
    "declaration": true, // 编译时候是否同时产生一份 声明文件
    "strict": true, // 编译时开启严格模式
    "sourceMap": true, // 生成相应的.map文件
    "module": "commonjs", //生成哪种模块系统代码
    "watch": true, //会在文件改变时候监视输出文件，重新进行编译
    
  },
  "include": [ // 编译时包含的目录及文件
    "test.ts" 
  ],
  "exclude": [ // 编译时排除的目录及文件
    "node_modules", 
    "dist",  
    "mock"
    "build"
  ],
  "lib": [ // 需编译过程中需要引入的库文件的列表，不然编译器识别错误报错
    "es2017",
    "dom"
  ]
}
```

*注意使用"include"引入的文件可以使用"exclude"属性过滤。 然而，通过 "files"属性明确指定的文件不管"exclude"如何设置却总是会被包含在内。 如果没有特殊指定， "exclude"默认情况下会排除node_modules，bower_components，jspm_packages和outDir目录。*

更多参数请参考官网<a href="https://www.tslang.cn/docs/handbook/compiler-options.html"> tsconfig配置列表 </a>



## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/typescript/buildingTools.md'>构建工具集成</a>

## TypeScript基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/typescript/index.md'>TypeScript基础</a>

















