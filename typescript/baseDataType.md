## TS基础系列之-基本数据类型

每种语言都会有属于自己的数据类型，ts的基本数据类型基本上是继承了js，但也在基础之上增加了几个不一样的类型

### 布尔型 true／false <br/>
```
//在js中声明boolean型的方法和ts中的不同之处
let flag = true;
let flag: boolean = true;
```

### float,数值型（在js和ts中数字型都是float）<br/>
```
//在js中声明number型的方法和ts中的不同之处
let age = 26;
let age: number = 26;
```

### 字符型 String <br/> 
```
//在js中声明number型的方法和ts中的不同之处
let name = 'boren';
let name: string = 'boren';
```

### 数组 Array <br/> 
```
//在js中声明数组的方法和ts中的不同之处
//1.js中声明数组的两种方式
let city = [];
let city = new Array();
//2.ts中声明数组的两种方式
let city: string[] = [];
let city:Array<string> = []
//在ts中声明数组必须提前指定其数据类型，如果其数组中的元素其数据类型不相同，声明的方式会在后面介绍
```

### 元组 Tuple <br/> 
```
//可以定义数组中元素不相同的数据类型
let people = ['boren',26];//js
let people:[string,number];
people = ['boren',26];//ts
```

### 枚举 Enum <br/> 
```
//js中没有此方法，都是以object或者json的形式去实现枚举的特性如：
let school = {

     teacherOne : 'Mars',
     teacherTwo:'yupeng',
     teacherThree:'luxuesong'

} 
console.log(school.teacherOne)//Mars

在ECMA2015，简称es5中Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象
Object.getOwnPropertyDescriptor（school,‘teacherOne’）

// {
// value: Mars,
// writable: true,
// enumerable: true,
// configurable: true
// }

其中这么方法打印出来的对象中key enumerable属性，为可枚举性，在js es5中有三个操作会忽略枚举为 false，for...in、 Object...keys()、 JSON.stringify()；在es6中新增一个方法Object.assign()会忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。关于更多js中对枚举属性的支持，在这里就不一一介绍，例如toString()和length等等其枚举属性为false
//ts中枚举类型的用法
enum classMember = {chenchao,rongbin,chenhua,liurui,luxuesong};
let teacher:classMember = classMember.luxuesong

我们也可以给枚举中的成员进行编号等等，以便于更方便的去找到相应的对象元素
```

### 通用数据类型 Any<br/>
```
这种数据类型个人认为是万能的，它可以在你不知道这个变量为什么数据类型的情况下，并且项目比较急的时候标注为Any，它可以通过编译时的类型检查，有人会说那我所有的类型都写Any，如果你非要这么干，也无妨，那就失去了ts这么语言本身的意义所在，可以用这种方法去解决一个上述声明数组类型时很麻烦的问题
let lists: any[] = ['boren',26,'body']; 

let age: any = 26;
let name: any = 'boren';
```

### 空值Void <br/>
```
在js中我们其实对void不是那么的陌生，它被认为是一个操作符，这个操作符可以计算表达式但不会返回任何值，在js中常常出现的位置就是在a标签的链接中，我们不想让页面刷新，更不想链接到某些位置只是简简单单的a标签，有时候会调用一个简单的函数，仅此而已，那么我们就会
<a href="javascript:void(0)" onclick="people()">点我</a>

//在ts中，void类型像是与any类型相反，它表示没有任何类型。
function student(): void{
   console.log('my name is renbo')
}

在上述函数中没有返回任何值，所以类型为void，其实void的变量没什么用处和null,undefined一样职能作为数据的类型的判断。
```

### 永不存在值的类型Never<br/>
```
官网解释
never is the return type for a function expression or an 
arrow function expression that always throws an exception or one that 
never returns;
Variables also acquire the type never when narrowed by any type guards that can never be true. 
never类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是never类型，当它们被永不为真的类型保护所约束时。
个人觉得没什么太大用这里就不做深究。
```

### 类型断言 <br/>
```
在ts中类型断言这种方式还是比较有用处的，其相当于js中的类型转换。但是只在编译的时候起作用。并不会改变其数据的本身结构。
let city: any = "beijing";

let strLength: number = (city as string).length;

另外一种写法：
let city: any = "beijing";

let strLength: number = (<string>city).length;
```
<hr/>
总结：通过以上的介绍相信大家对ts的数据类型已经有了大概的了解，其实相对于js,ts的数据类型并没有做什么变更，只是在声明其数据类型的时候必须明确的指定其相应的数据类型，否则代码编译会报错。虽然 ts的文件是xxx.ts 但由于编译过后和js 没有什么大的不同点，能够很好的运行在浏览器端，其中class、public等等函数及模块编译过后的js能后让你更深入的了解js

<hr/>

## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/typescript/function.md'>函数</a>

## TypeScript基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/typescript/index.md'>TypeScript基础</a>



                
