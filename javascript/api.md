## API操作数组方法

**Array对象的作用**：Array 对象用于在单个的变量中存储多个值。<br/>

**创建Array对象的方法：**

`var arrayObj = new Array()；`<br/>
`var arrayObj = []; //本人习惯用这种`<br/>
返回值：返回新创建并被初始化了的数组。如果调用arrayObj时没有参数或者没有指定 值，那么返回的值为空，数组的length为0。<br/>

**Array对象的三个属性：**

`constructor` //返回数组函数的引用。<br/>
`length` //返回数组元素的长度（最常用）<br/>
`prototype` //可以向数组对象添加属性和方法。<br/>

## ECMAScript5:

**concat()-该方法用于连接或者合并数组，并且不会改变原数组，返回一个新数组的副本**<br/>
```
var arrObj = [1,2,3,4];
var arrObj1 = [5,6,7,8];
arrObj.concat(arrObj1); //[1,2,3,4,5,6,7,8]
```

**join()-该方法用于把数组中的所有元素用指定的分隔符分割，返回一个字符串**
```
newArray.join() //"1,2,3,4,5,6,7,8"
```

**pop()-该方法用于删除并返回数组的最后一个元素,并将原数组的length -1。**
```
arrObj.pop()//4
console.log(arrObj); //[1,2,3]
```

**push()-该方法可向数组的末尾添加一个或多个元素，并返回新的长度。**
```
arrObj.push(4);
console.log(arrObj); //[1,2,3,4]
```

**shift()-该方法用于删除并返回数组的第一个元素,并将原数组的length -1。**
```
arrObj.shift() //1
console.log(arrObj) //[2,3,4]
```

**unshift()-该方法可向数组的开头添加一个或多个元素，并返回新的长度。**
``` 
arrObj.unshift(1);
console.log(arrObj); //[1,2,3,4]
```

**slice()- 该方法可从已有的数组中返回选定的元素,形成一个新的数组。**
```
arrObj.slice(1,2); //[2]
console.log(arrObj) //[1,2,3,4]
```

**splice()-该法向数组中添加/删除元素，然后返回被删除的元素。该方法会改变原数组**
```
arrObj.splice(1,2,5); //[2,3]
console.log(arrObj); //[1,5,4]
```

**reverse()-该方法用于颠倒数组中元素的顺序，并且改变原来的数组，而不会创建新的数组**
```
arrObj.reverse(); //[4,5,1]
```

**sort()-该方法用于对数组的元素进行排序。**<br/>
注意：该方法是按照字符编码顺序进行排序，如果想要实现业务逻辑排序需要自定义比较函数<br/>
```
var arrObjSort = [1,5,4,2,3];
var arrObjSort1 = [1,2,10,3,20,4,30,50,5];
arrObjSort.sort(); //[1,2,3,4,5]
arrObjSort1.sort(); //[1, 10, 2, 20, 3, 30, 4, 5, 50]
```
自定义排序：<br/>
```
function __sortNumber(a,b){
   return a-b;
}
arrObjSort1.sort(__sortNumber); //[1, 2, 3, 4, 5, 10, 20, 30, 50]
```

**toString()-该方法可把数组转换为字符串，并返回结果，与不带参数的join相同**
```
arrObjSort1.toString(); //"1,2,3,4,5,10,20,30,50"
```
toLocaleString-该方法可数组转换为本地字符串。和toString基本相同，但toLocaleString调用的是地区特定的分隔符把生成的字符串连接起来。<br/>
如果你开发的脚本在世界范围都有人使用,那么将对象转换成字符串时请使用toString()方法<br/>
因为LocaleString()会根据你机器的本地环境来返回字符串,它和toString()返回的值在不同的本地环境下使用的符号会有微妙的变化.<br/>
如果是为了返回时间类型的数据,推荐使用LocaleString().若是在后台处理字符串,请务必使用toString()<br/>

```
var date = new Date();
var myArr = [date,'go home'];
myArr.toLocaleString(); //"2017/11/7 下午4:35:43,go home"
myArr.toString(); //"Tue Nov 07 2017 16:36:25 GMT+0800 (CST),go home"
```

**indexOf()-该方法可确定某个元素在数组实例中第一次出现的索引位置。如果没找到返回-1,可用索引值进行逻辑判断**
```
var arr = [1,2,3,4,5];
arr.indexOf(2);  //1
arr.indexOf(2,1); //1
arr.indexOf(2,2); //-1
arr.indexOf(6);  //-1

```
查找元素出现的位置索引<br/>
```
var indices = [];
var arr = [1,2,3,2,5,2,7];
var index = arr.indexOf(2);
while(index != -1){
  indices.push(index);
  index = arr.indexOf(2,index + 1);
}
console.log(indices)
```
判断一个元素是否在数组里，不在则向数组中添加元素<br/>
```
var arr = [1,2,3,4,5,6,7];
function __upDataCollection(arrCollection,indicesEle){
  var matchIndex =  arrCollection.indexOf(indicesEle);
  if(matchIndex === -1){
     arr.push(indicesEle);        
  }else{
    console.log('元素中存在相同的值');
  }
}
__upDataCollection(arr,8); //[1, 2, 3, 4, 5, 6, 7, 8]
__upDataCollection(arr,2); //'元素中存在相同的值'
```

**forEach()- 该方法按升序为数组中含有效值的每一项执行一次callback 函数（遍历数组）** <br/>
`forEach()` 为每个数组元素执行callback函数；不像`map()` 或者`reduce()` ，它总是返回 `undefined`值，也没有办法终止或跳出正在运行循环的`forEach`。如果常规的遍历想要检测条件返回bool , 并且可以终止循环，可使用`Array.some,Ayyay.every`.或者es6新方法`Array.find()`等等
```
var arrayObj = [1,2,3,,5];
arrayObj.forEach(function(element, index, array){
   console.log("value[" + index + "] = " + element) 
},this);
//value[0] = 1
//value[1] = 2
//value[2] = 3
//value[4] = 5
//可以观察到以上遍历并没有出现undefind
```

**map()- 该方法会给原数组中的每个元素都按顺序调用一次 callback 函数。callback 每次执行后的返回值（包括 undefined）组合起来形成一个新数组，并且不修改调用它的原数组本身（当然可以在 callback 执行时改变原数组）。**
```
//常用的有些业务场景需要重新重组数组对象
var arrayObj = [
    {name: 'zhangsan', age: 20}, 
    {name: 'lisi', age: 30}, 
    {name: 'wangwu', age: 26}
  ];
var newArrayObj = arrayObj.map(function(obj, index, array) { 
   var newObj = {};
   newObj[obj.name] = obj.age;
   return newObj;
});
console.log(newArrayObj);
//[{'zhangsan':20},{'lisi':30},{'wangwu':26}]
```

**filter()- 该方法创建一个新数组,通过次函数方法会返回相应的过滤后的数据,并且不会改变原数组**
```
var arrayObj = [3,1,3,2,4,5,6];
var newArrayObj = arrayObj.filter(function(value,index,array){
   return value > 3
});
console.log(newArrayObj);//[4, 5, 6]
```

**reduce()-为数组中的每一个元素依次执行callback函数，不包括数组中被删除或从未被赋值的元素,返回函数累计处理的结果**
`callback`执行数组中每个值的函数，包含四个参数：<br/>

`accumulator`累加器累加回调的返回值; 它是上一次调用回调时返回的累积值，或initialValue（如下所示）。<br/>

`currentValue`数组中正在处理的元素。<br/>

`currentIndex`数组中正在处理的当前元素的索引。<br/>

如果提供了initialValue，则索引号为0，否则为索引为1。array调用reduce的数组initialValue[可选] 用作第一个调用 callback的第一个参数的值。<br/>

如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。<br/>

```
var totalValue = [0, 1, 2, 3].reduce(function(sum, value) {
  return sum + value;
}, 0); 
// totalValue  6

//将二维数组转化为一维数组
var flattened = [[0, 1], [2, 3], [4, 5]].reduce(
    function(a, b) {
      return a.concat(b);
    },[]);
  // flattened is [0, 1, 2, 3, 4, 5] 
```

**some()-该方法用于检测数组中的某些元素是否通过callback函数实现的方法。返回bool值**
```
var arrayObj = [1,2,3,4,5,6];
var flag = arrayObj.some(function(element,index,array){
  return element > 2;
});
console.log(flag);//true
```

**every()-该方法用于检测数组中的所有元素是否通过callback函数实现的方法。返回bool值**
```
var arrayObj = [1,2,3,4,5,6];
var flag = arrayObj.some(function(element,index,array){
  return element > 2;
});
console.log(flag);//false
```


## ECMAScript6:

**扩展运算符(...)-该运算符将一个数组转为用逗号分隔的参数序列。**<br/>
扩展运算符即可以复制，合并数组，操作分割字符串与结构赋值结合还可以当函数的形参<br/>
```
console.log(...[1,2,3,4,5]);//1 2 3 4 5
```

合并数组：<br/>
```
let arrayObj = [1,2,3,4,5,6];
let arrayObj1 = [7,8,9];
let newArray = [...arrayObj,...arrayObj1];
console.log(newArray) //[1, 2, 3, 4, 5, 6, 7, 8, 9]
```

复制数组：<br/>
```
let arrayObj = [1,2,3,4,5];
let arrayObjNew = [...arrayObj];
console.log(arrayObjNew) //[1,2,3,4,5];
```

与结构赋值结合：<br/>
```
const [variable, ...array] = [1, 2, 3, 4, 5];
console.log(variable); //1
console.log(array); //[2,3,4,5]
```

函数形参：
```
//例子1:
let _arrayObj = [1];
let _arrayObj1 = [1,2,3,4,5];
var __operationArr = (array,items)=>{ 
   array.push(...items);
   console.log(array); //[1,1,2,3,4,5]
}
__operationArr(_arrayObj,_arrayObj1);
//例子2:
var __add = (a,b,c,d,e) =>{
  return a + b + c +d + e;
}
__add(..._arrayObj1); //15
```

求出数组最大元素：<br/>
```
let arrayObj = [2,3,4,5,3,2,8];
Math.max(...arrayObj) //8
```

**form()-该法从一个类似数组或可迭代对象中创建一个新的数组实例，相当于相当于[].slice.call();**
```
//例子1:
let arrayItems = {
    '0': 'zhangsan',
    '1': 'lisi',
    '2': 'wangwu',
    length: 3
};

// ES5的写法
var arr1 = [].slice.call(arrayItems); // ['zhangsan', 'lisi', 'wangwu']
// ES6的写法
let arr2 = Array.from(arrayItems); // ['zhangsan', 'lisi', 'wangwu']

例子2:
// 常见的DOM NodeList对象
let ps = document.querySelectorAll('p');
let pElementArr = Array.from(ps);
pElementArr.forEach((p)=> {
  console.log(p);
});
```
将字符串分割字后变为数组<br/>
```
Array.from('foo');//['f','o','o']
```


**of()- 该方法创建一个具有可变数量参数的新数组实例，而不考虑参数的数量或类型。**<br/>
Array.of() 和 Array 构造函数之间的区别在于处理整数参数：Array.of(7) 创建一个具有单个元素 7 的数组，而 Array(7) 创建一个包含 7 个 undefined 元素的数组。<br/>
```
Array.of(7);       // [7] 
Array.of(1, 2, 3); // [1, 2, 3]

Array(7);          // [ , , , , , , ]
Array(1, 2, 3);    // [1, 2, 3]
```


**copyWithin()-该方法浅复制数组的一部分到同一数组中的另一个位置，并返回它，而不修改其大小。**<br/>
arr.copyWithin(target)<br/>

arr.copyWithin(target, start)<br/>

arr.copyWithin(target, start, end)<br/>

arr.copyWithin(目标索引, [源开始索引], [结束源索引])<br/>
```
[1, 2, 3, 4, 5].copyWithin(-2);
// [1, 2, 3, 1, 2]

[1, 2, 3, 4, 5].copyWithin(0, 3);
// [4, 5, 3, 4, 5]

[1, 2, 3, 4, 5].copyWithin(0, 3, 4);
// [4, 2, 3, 4, 5]

[1, 2, 3, 4, 5].copyWithin(-2, -3, -1);
// [1, 2, 3, 3, 4]

[].copyWithin.call({length: 5, 3: 1}, 0, 3);
// {0: 1, 3: 1, length: 5}
```


**find()-该方法返回数组中满足提供的callback的第一个元素的值。否则返回 undefined。**<br/>
如果你需要找到一个元素的位置或者一个元素是否存在于数组中，使用`Array.prototype.indexOf()` 或 `Array.prototype.includes()`。

如果你需要找到元素的索引，而不是其值`Array.prototype.findIndex() `;
```
let arrayObj = [2,4,5,60,39];
let backValue = arrayObj.find((element)=>{return element > 20});
console.log(backValue); //60
```


**fill()-该方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。**<br/>
语法：<br/>
arr.fill(value) <br/>
arr.fill(value, start) <br/>
arr.fill(value, start, end)<br/>
```
[1, 2, 3].fill(4)            // [4, 4, 4]
[1, 2, 3].fill(4, 1)         // [1, 4, 4]
[1, 2, 3].fill(4, 1, 2)      // [1, 4, 3]
[1, 2, 3].fill(4, 1, 1)      // [1, 2, 3]
[1, 2, 3].fill(4, -3, -2)    // [4, 2, 3]
[1, 2, 3].fill(4, NaN, NaN)  // [1, 2, 3]
Array(3).fill(4);            // [4, 4, 4]
[].fill.call({length: 3}, 4) // {0: 4, 1: 4, 2: 4, length: 3}
```

**entries()-该方法返回一个新的Array Iterator对象，该对象包含数组中每个索引的键/值对。**
```
var arr = ["a", "b", "c"];
var iterator = arr.entries();
// undefined

console.log(iterator);
// Array Iterator {}

console.log(iterator.next().value); 
// [0, "a"]
console.log(iterator.next().value); 
// [1, "b"]
console.log(iterator.next().value); 
// [2, "c"]
```

**includes()-该方法用来判断一个数组是否包含一个指定的值，如果是，酌情返回 true或 false。**<br/>
语法：<br/>
arr.includes(searchElement)<br/>
arr.includes(searchElement, fromIndex)<br/>
```
[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(4);     // false
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true
[1, 2, NaN].includes(NaN); // true
```

## JS基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/javascript/index.md'>JS基础系列</a>

