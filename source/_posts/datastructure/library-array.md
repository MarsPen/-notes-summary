---
title: 数组、栈、队列
date: 2019-11-25 21:20:12
top: false
cover: false
password:
toc: true
mathjax: false
summary:
tags:
  - 数据结构与算法
categories:
  - 数据结构与算法
---

## 数组
数组是最简单的内存数据结构了，在前端也有数组类型下面我们看看关于数组的知识
### 什么是数组<hr>
数组是存储一系列同一种类型的值（js 中可以是不同类型的值）。定义的时候为其分配存储单元，此存储单元在内存中是一块连续的区域，在使用前要先申请占用的内存大小。
```js
// js 中声明数组的一种方式，也可以使用 new Array
var arr = [1,2,3,4,5,6]
```
<img src="/images/array-what.jpg" width="50%"></img>

上面我们在代码中初始化了一个名为 arr 的数组，数组中的元素为 1，2，3，4，5，6，可以通过数组的 length 属性知道数组里面存了多少个元素。因为数组都有自己的下标 从 0 开始（上图中的[0]-[5]），所以可以通过 [] 中括号下标的方式去得到对应的值

```js
arr.length // 6
arr[0] // 1
arr[1] // 2
...
```
### 数组的操作<hr>

在 javascript 中对数组的操作其实也很容易，因为操作数组的 api 太多，所以我们通过添加、删除、合并、迭代、搜索、排序这几个方面来了解数组的常规操作。当然这里不会将所有的 api 都用到。更多 api 介绍请移步 <a href="https://www.studyfe.cn/2019/03/20/javascript/api/">操作数组的 API 方法</a>

> 数组的添加

在 javaScript 中，数组是一个可以修改的对象，如果向末尾添加元素，只要把值赋给数组最后一个空位上的元素即可。它就会动态增长这点和 java 有一定的区别。在 java 中要添加元素就必须创建一个全新的数组。因为在数组定义的时候要定义其长度，为其分配内存空间。如果类似 javaScript 那么在 java 中可以用集合 ArrayList。 

```js
// javascript
var arr = [1, 2, 3, 4, 5];
arr.push(6) // [1,2,3,4,5,6]
arr.push(7,8) // [1,2,3,4,5,6,7,8]
```
```java
// java
int[] arr = {1, 2, 3, 4, 5}; // 初始化默认值为1-5，分配长度为5的int 类型数组arr(静态) 
int arr = new int[5]; // 声明并分配一个长度为 5 的 int 类型数组 arr（动态），
```

```java
// java
ArrayList<Integer> list = new ArrayList(); // 声明实例的一个 int 类型的数组集合
list.add(1); // 向集合中添加一个元素
```

上面的 javascript 代码中我们向数组末尾添加了一个元素。接下来我们向数组首位添加一个元素。如果向首位添加一个元素，就需要将腾出数组中第一个元素的位置，把所有元素向右移动一位。

```js
var arr = [1, 2, 3, 4, 5];

for (var i = arr.length; i >= 0; i--) {
  arr[i] = arr[i-1];
}
arr[0] = 0; // [0, 1, 2, 3, 4, 5]
```

这段代码中我们通过循环向数组的首位添加了一个为 0 的元素。当然只是为了更好的演示数组的操作，也可以直接通过 api unshift 来添加。

```js
var arr = [1, 2, 3, 4, 5];
arr.unshift(0);
console.log(arr); // [0, 1, 2, 3, 4, 5]
```

下面这张图很好的描述了我们刚才的操作过程

<img src="/images/array-unshift.jpg" width="50%"></img>

现在数组中输出的数字是 0-5 并且数组的长度从 5 变为 6，那么接下来看看数组的删除

> 数组的删除

还是跟上面的操作一样，这回我们还是用循环删除数组中第一个元素，当然也可以用api shift 来删除

```js
// 循环
var arr = [0, 1, 2, 3, 4, 5];
for (var i = 0; i < arr.length; i ++) {
  arr[i] = arr[i+1];
}
console.log(arr) // [1, 2, 3, 4, 5, undefined]

// shift
arr.shift(); // 返回删除的元素 0
console.log(arr) // [1, 2, 3, 4, 5]
```

下面这张图很好的描述的这段代码的执行过程

<img src="/images/array-shift.jpg" width="50%"></img>

我们将数组里的所有元素左移动了一位。数组的长度依然是17，所以数组的末尾有一个额外的 undefined，因为在最后一次循环 ， i+1 引用了一个数组里还未初始化的位置。

当然我们也可以删除数组内指定的元素可以用 splice,从数组的索引开始的几个元素（下面就是从数组的索引2开始的3元素）

```js
var arr = [0,1,2,3,4,5];
var newArr = arr.splice(2,3); //[2,3,4]
console.log(arr) // [0,1,5]
console.log(newArr) //[2,3,4]
```

> 数组的合并

数组的合并在实际开发的应用中经常会用到，将多个数组进行迭代，把每个元素加入定义好的数组中。在 JavaScript 中提供了 concat 的方法来实现合并

```js
// concat
var arr = [1, 2, 3];
var arr1 = 0;
var arr2 = [-3, -2, -1];
var arr3 = arr2.concat(arr1, arr2);
console.log(arr3) // [-3, -2, -1, 0, 1, 2, 3]
```
```js
var arr = [1, 2, 3];
var arr1 = 0;
var arr2 = [-3, -2, -1];
var arr3  = [];

for(var i = 0; i < arr2.length; i++) {
  arr3.push(arr2[i]);
}
arr3.push(arr1);
for (var j = 0; j < arr.length; j++) {
  arr3.push(arr[j])
}
console.log(arr3) // [-3, -2, -1, 0, 1, 2, 3]
```
> 数组的迭代

在 javaScript 中内置了很多数组迭代的方法，every、some、forEach、map、filter、reduce 具体的 api 使用请参考 <a href="https://www.studyfe.cn/2019/03/20/javascript/api/">操作数组的 API 方法</a>原生方法实现请参考<a href="https://juejin.im/post/5c0b7f03e51d452eec725729">map 和 filter 的实现</a>也可以参考<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map">mdn 的 Polyfill</a>

> 数组的搜索

数组的搜索方法请参考 <a href="https://www.studyfe.cn/2019/03/20/javascript/api/#toc-heading-15">indexOf</a>

> 数组的排序

在 Javascript 中对数组的排序提供了 sort api ，下面我们来看看 sort

sort 是按照字符编码顺序进行排序，如果想要实现业务逻辑排序需要自定义比较函数

**数字升序排序**

```js
var arr = [15,18,10,9,8,11,6,7];
let newArr = arr.sort(function (a,b){
  return a - b;
})

console.log(newArr); // [6, 7, 8, 9, 10, 11, 15, 18]
```

**字符串进行排序**

```js
var names = ['Ana','ana','john','John'];
var newNames = names.sort(); 
console.log(newNames) // ["Ana", "John", "ana", "john"]
```
上面这样可定是不对的因为 Javascript 做字符串比较的时候是根据ASCII值来比较的 A,j,a,j对应的值为65，75，97，106。所以需要我们要自定义函数

```js
var names = ['Ana','ana','john','John'];
var newNames = names.sort(function (a, b) {
  return a-b;
})
console.log(newNames) // ['Ana','ana','john','John']
```

**数组对象排序**

下面按照年龄排序，实际项目中有可能会用 id 进行排序

```js
var friends = [
  {name: 'zhangsan', age:30},
  {name: 'lisi', age:28},
  {name: 'wangwu', age: 29}
]
var newFriends = friends.sort(function (a, b) {
  return a.age - b.age;
})
console.log(newFriends)

```

### 小结<hr>

数组是最常用的数据结构，我们在上面举例说明了什么是数组、数组的创建、以及一些操作数组的常用API。虽然过于简单，但有助于我们在后续编写自己的算法时能够更好的深入和理解。当然有很多优秀的库供我们使用例如 <a href="https://www.lodashjs.com/">Lodash</a>。

以下内容未完待续......

## 栈
数组是最常用的数据结构，可以在数组的任意位置上进行删除和添加元素，然而我们需要在添加和删除时有更多控制的数据结构，其中一个就是栈。
### 什么是栈<hr>
### 栈的创建<hr>
### 使用栈<hr>
### 小结<hr>

## 队列
 上一小结说我们需要在添加和删除时有更多控制的数组结构，除了栈另一个就是队列
### 什么是队列<hr>
### 队列的创建<hr>
### 队列的使用<hr>
### 优先队列<hr>
### 循环队列<hr>
### 小结<hr>



















