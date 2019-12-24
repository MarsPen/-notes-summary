---
title: flutter 之 dart 基础语法
date: 2019-12-15 20:12:06
top: false
cover: false
password:
toc: true
mathjax: false
tags:
- Flutter
categories:
- Flutter
---

dart 作为 flutter 选用的基础语言，具有一定的优势。下面我们来简单的了解一下这门语言。

### 什么是 dart <hr>

dart 是由 Google 主导开发的一种编程语言，于 2011 年 10 月公开。也是一种面向对象语言，但是它采用基于类编程。

### 特性<hr>

- 所有的对象都继承自 Object，即使是 numbers、function、null
- 在 running 之前解析所有代码，指定类型会更安全，加快编译
- 如果没有显示定义类型，则会自动推导，没有初始化的变量则默认值为 null
- dart 提供顶级函数（如main（))
- dart 没有 public、private、protected，变量名以“_”开头意味着对它的 lib 是私有的
- 内嵌的 dart vm 的 Chromium，可以在浏览器中直接执行 dart
- dart2js 是可以将 dart 代码编译为 Javascript 的工具

### 运行 dart 环境<hr>
- 在 vscode 编辑器中添加插件 dart，
- 新建文件 demo.dart
- 在文件中写入 main 入口函数，在函数内定义其他可执行代码
- 关于 flutter 环境布置在后续文章中会介绍

### 声明变量与常量<hr>

**var 定义变量（编译器确定变量类型）**

```js
main(List<String> args) {
  var name = 'renbo';
  var age = 28;
  print('my name is $name I,m $age years old' );

  // age = '28';  // 错误
}
```
**dynamic （运行期确定变量类型）**

```js
main(List<String> args) {
  dynamic name = 'renbo';
  dynamic age = 28;
  print('my name is $name I,m $age years old' );

  // age = '28'; 正确
}
```

**const 定义常量（编译期确定常量值）** 

```js
main(List<String> args) {
  const String name= 'renbo';
  const int age = 25;
  print('$name + $age');
}
```

**final 定义常量（运行期确定常量值）**

```js
main(List<String> args) {
  final String city = 'biejing';
  final int phone = 15212345678;
  print('$city + $phone');
}
```

- 所有未初始化的变量的初始值为 null
- var 在编译期会自动匹配类型，所以当改变的值类型不同时会提示错误
- dynamic 被编译后是 object 类型，在编译器不进行任何类型的检查，将检查放到了运行期
- final 必须被初始化，只能赋值一次，赋值可以是常量也可以是变量，赋值后不能更改
- const 必须被初始化，只能赋值一次，赋值必须是常量，赋值后不能更改

### 基本数据类型<hr>

**Number 数字类型 有两个子类 int 和 double**

```js
main(List<String> args) {
  int a = 100;
  double b  = 100.01;
  int c = int.parse('10');
  double d = double.parse('100.01');
  print('$a + $b + $c + $d');
}
```

**String 用$ 计算字符串值，如果是表达式用 ${}**
```js
main (List<String> args) {
  String name = 'Renbo';
  String nametoLowerCase = '${name.toUpperCase()}';
  print('$nametoLowerCase'); // RENBO
}
```

**Booleans true or false**
```js
main (List<String> args) {
  bool isFlag = true;
  print(isFlag);
}
```

**Lists 集合 类似于 javaScript 中的数组**
```js
main (List<String> args) {
  // 定义集合
  var list = [1,3,2,3,3,4];
  print(list); // [1,3,2,3,3,4]
  print(list.length); // 6
  // 向末尾添加元素
  list.add(5); 
  print(list); // [1,3,2,3,3,4,5]
  // 移除为3的元素，如果有多个相同的，则移除第一个
  list.remove(3); 
  print(list); // [1, 2, 3, 3, 4, 5]
  // 根据下表移除
  list.removeAt(0); 
  print(list); // [2, 3, 3, 4, 5]

  // 定义常量集合
  var list  = const [1,2,3,4];
  print(list);
}
```

**Maps 集合**
```js
// 用 {} 直接声明 map
Map info = {
  'name': 'renbo',
  'age': 20,
  'city': 'beijing'
};
print(info); // {name: renbo, age: 20, city: beijing}
// 获取值
print(info['name']); // renbo
// 添加新键值对
info['phone'] = 15212344567;
print(info); // {name: renbo, age: 20, city: beijing, phone: 15210713603}
// map 长度
print(info.length); // 4
// 检索Map是否含有某Key
print(info.containsKey('gender')); // false

// 先声明，再去赋值
var map = new Map();
map['name'] = 'renbo';
print(map); 

// 编译时常量的map
Map infoConst = const {
  'name': 'renbo',
  'age': 28,
};
print(infoConst);
```

上面简单的介绍了 dart 的基本数据类型，当然有很多操作上的 api 就不一一列举了，可自行查找 api

### 运算符与流程控制<hr>

**if...else**
```js
main(List<String> args) {
  var id = 101;
  if (id > 100) {
    print('大于100');
  } else if(id > 200) {
    print('大于200');
  } else if(id > 300) {
    print('大于300');
  }
}
```
**三元运算符**
```js
main(List<String> args) {
  int age = 28;
  String status = age < 28 ? "年轻人" : "老男人";
  print(status);
}
```
**switch...case**
```js
main(List<String> args) {
  int age = 28;
  switch(age) {
    case 18:
      print('18');
      break;
    case 28:
      print('28');
      break;
    case 38:
      print('38');
      break;
  }
}
```
**for 循环**
```js
main(List<String> args) {
  var list = [1,2,3,4,5];
  for (int i= 0; i < list.length; i++) {
    print('$i');
  }
}
```
**while 循环**
```js
main(List<String> args) {
  int i = 0;
  while(i < 10) {
    print('$i');
    i++;
  }
}
```
**Do-while**
```js
main(List<String> args) {
  int i = 0;
  do {
    print('$i');
    i++;
  } while (i < 10);
}
```

### 函数<hr>

**函数调用**

```js
main(List<String> args) {
  String name = fullName('zhangsan', 'lisi');
  print(name);
}
 
String fullName(String firstName, String lastName) {
  return "$firstName $lastName";
}
```

**如果函数内表达式较为简单可以使用箭头函数**

```js
main(List<String> args) {
  String name = fullName('zhangsan','lisi');
  print(name);
}

fullName (String firstName, String lastName) => "$firstName $lastName";
```

**函数的参数**

- 函数的参数有两种形式分为可选参数和必要参数
- 必要参数定义在参数列表前面，可选参数则定义在必要参数后面
- 可选参数分为命名参数和位置参数，可在参数列表中任选其一使用，但两者不能同时出现在参数列表中
- 可以使用 @required 注解来标识一个命名参数是必须的参数

**参数的默认值 = 表示**

```js
main(List<String> args) {
  var name = fullName(firstName: 'zhangsan');
  print(name);
}

fullName({String firstName, String lastName = "lisi"}) {
  return "$firstName $lastName";
}
```

**命名参数 指定参数名字**
```js
main(List<String> args) {
  var name = fullName(lastName: 'lisi');
  print(name);
}

fullName({String firstName, String lastName}) {
  return "$firstName $lastName";
}
```
**函数当参数**
```js
main(List<String> args) {
  out(printOutLoud);
}
 
out(void inner(String message)) {
  inner('My Name Is Renbo');
}
 
printOutLoud(String message) {
  print(message.toUpperCase());
}
```

**匿名函数**
```js
main(List<String> args) {
  out((message) {
    print(message.toUpperCase());
  });
}
 
out(void inner(String message)) {
  inner('My Name Is Renbo');
}
```
**词法作用域(大括号内定义的变量只能在大括号内访问，作用域在书写代码的时候就已经确定)**
```js
// myFunction 函数可以访问包括顶层变量在内的所有的变量
String name = 'renbo';
void main () {
  int age = 28;
  void myFunction () {
    String gender = 'm';
    print(name);
    print(age);
    print(gender);
  }
  myFunction();
}
```

**闭包(函数对象，即使函数对象的调用在它原始作用域之外，依然能够访问在它词法作用域内的变量)**
```js
Function add(num value) {
  return (num i) => value + i;
}
void main() {
  var add1 = add(1);
  var add2 = add(2);

  assert(add1(3) == 4);
  assert(add2(3) == 5);
}
```

### 类<hr>

- dart 是支持基于 mixin 继承机制的面向对象语言
- 所有对象都是一个类的实例，而所有的类都继承自 Object 类
- Extension 方法是一种在不更改类或创建子类的情况下向类添加功能的方式

**构造函数(Constructors)**

- 构造函数不被继承
  - 子类不会继承父类的构造函数，如果子类没有声明构造函数，那么只会有一个默认无参数的构造函数
  - 如果希望拥有父类的一样功能的命名构造函数，则必须在子类中重新定义
- 默认构造函数
  - 如果没有声明构造函数，dart 会自动生成一个无参数的构造函数并且该构造函数会调用其父类的无参数构造方法
- 声明一个和类名相同的函数，则作为类的构造函数

```js
main(List<String> args) {
  Person p = new Person('renbo', 28);
  print(p.age);
}

class Person {
  // 声明实例变量，初始化为null 
  String name;
  int age;
  // 声明构造函数
  Person (String name, int age) {
    // this 指当前的实例
    this.name = name;
    this.age = age;
  }
  //Person (this.name,this.age); // dart 语法糖和上面声明方式一样 
}
```
**命名构造函数**

命名式构造函数可以为一个类声明多个命名式构造函数来表达更明确的意图

```js
main(List<String> args) {
  Person p = new Person.study();
  print(p.age);
}

class Person {
  // 声明实例变量
  String name;
  int age;

  Person (this.name,this.age);
  // 命名构造函数
  Person.study() {
    name = 'renbo';
    age = 28;
  }
}
```

**重定向构造函数**

- 有时构造函数的唯一目的是重定向到同一个类中的另一个构造函数 
- 重定向构造函数的函数体为空， 构造函数的调用在冒号 ( : ) 之后

```js
main(List<String> args) {
  Person p = new Person.study('renbo');
  print(p.age);
  print(p.name);
}

class Person {
  // 声明实例变量
  String name;
  int age;

  Person (this.name,this.age);
  // 重定向构造函数
  Person.study(String name ): this(name,28);
}
```
**常量构造函数**
- 如果类生成的对象都是不会变的，那么可以在生成这些对象时就将其变为编译时常量
- 优点是在编译时已经知道所有字段值的对象，而不执行任何语句
- 由于常量不会每次都重新创建。在编译时被规范化，并存储在特殊的查找表中（通过规范签名进行哈希处理），方便重新使用

```js
main(List<String> args) {
  Person p = new Person.study('renbo');
  print(p.age);
  print(p.name);
}

class Person {
  // 声明实例变量
  final String name;
  final int age;

  const Person (this.name,this.age);
  // 重定向构造函数
  const Person.study(String name ): this(name,28);
}
```
**工厂构造函数**

- 使用 factory 关键字标识类的构造函数将会令该构造函数变为工厂构造函数
- 这将意味着使用该构造函数构造类的实例时并非总是会返回新的实例对象
- 可能会从缓存中返回一个实例，或者返回一个子类型的实例
- 在工厂构造函数中无法访问 this

```js
main(List<String> args) {
  Person p = new Person('renbo',28);
  print(p.age);
  print(p.name);
}

class Person {
  // 声明实例变量
  final String name;
  final int age;
  // _cache 是一个私有库
  static final Map<String, Person> _cache = <String, Person>{};
  // 定义工厂函数
  factory Person (String name,int age) {
    if (_cache.containsKey(name)) {
      print('从缓冲中取值');
      return _cache[name];
    } else {
      print('放入缓存中');
      final person = new Person._study(name,age);
      _cache[name] = person ;
      return person;
    }
  }
  Person._study(this.name,this.age);
}

```
**类-方法（Methods）**
方法是对象提供行为的函数，有实例方法、Getter 和 Setter、抽象方法几种方式

实例方法可以访问实例变量和 this

```js
main(List<String> args) {
  Person p = new Person('renbo', 28);
  print(p.smile());
}
 
class Person {
  String name;
  int age;

  Person(this.name, this.age); 
  // 实例方法
  String smile() {
    print('😂😂😂😂😂😂😂😂');
    return "${this.name} ${this.age}";
  }
}
```
- Getter 和 Setter 是一对用来读写对象属性的特殊方法
- 实例对象的每一个属性都有一个隐式的 Getter 方法
- 如果为非 final 属性的话还会有一个 Setter 方法
- 可以使用 get 和 set 关键字为额外的属性添加 Getter 和 Setter 方法

```js
main(List<String> args) {
  Person p = new Person('renbo', 28);
  print(p.get());
  p.name = 'zhangsan';
  print("${p.name} ${p.age}");
}
 
class Person {
  String name;
  int age;

  Person(this.name, this.age); 
  // 实例方法
  String get () {
    return "${this.name} ${this.age}";
  }
  void set (String value ) {
    this.name = value;
  }
}
```

- 抽象方法是定义一个接口方法，不关心业务逻辑。将实例方法、Getter 和 Setter 进行抽象分离,
- 抽象方法只能存在抽象类中
- 抽象类使用关键字 abstract 标识类可以让该类成为 抽象类，抽象类将无法被实例化

```js
// 定义抽象类
abstract class Person {
  // 定义实例变量和方法等等……

  void doSomething(); // 定义抽象方法。
}

class Man extends Person {
  void doSomething() {
    // 提供一个实现，所以在这里该方法不再是抽象的……
  }
}
```

**隐式接口（implements）**

- dart 中没有 interface 关键字定义接口，普通类或抽象类都可以作为接口被实现
- 使用 implements 关键字进行实现

```dart
main(List<String> args) {
  var man = new Man('zhangsan', 28);
  print(man.study());
  print(man.eat());
}
// 定义抽象类方法
abstract class Person  {
  String name;
  int age;
  void study();
  void eat();
}
// 用接口实现抽象类
class Man implements Person {

  @override
  String name;
  int age;

  Man (this.name, this.age);

  @override
  String study() {
    // TODO: implement study
    return "${this.name} ${this.age} studying";
  }

  @override
  String eat() {
    // TODO: implement eat
    return "${this.name} ${this.age} eating";
  }
}
```

**类继承（extends）**

使用 extends 关键字来创建一个子类，并可使用 super 关键字引用一个父类：

```js
main(List<String> args) {
  Man p = new Man('zhansan', 29);
  print(p.name);
}
 
class Person {
  String name;
  int age;
 
  Person(this.name, this.age);
 
  Person.study() {
    name = 'renbo';
    age = 28;
  }
}

class Man extends Person {
  Man(String name, int age): super(name, age);
}
```
**重写类成员（Overriding members）**



```js
main(List<String> args) {
  Man p = new Man.smile('renbo');
  p.bark();
}
 
class Person {
  String name;
  int age;
 
  Person(this.name, this.age);
 
  Person.constructor() {
    name = 'zhangsan';
    age = 30;
  }
 
  bark() {
    print('我是bark');
  }
}
 
class Man extends Person {
  Man(String name, int age): super(name, age);
 
  Man.smile(String name): this(name, 20);
 
 @override
  bark() {
   print('我是重写的bark方法');
  }
}
```

**类的静态变量和方法**

- 声明静态属性和静态方法使用 static 关键字
- 静态变量（即类变量）常用于声明类范围内所属的状态变量和常量
- 静态变量在其首次被使用的时候才被初始化
- 静态方法（即类方法）不能被一个类的实例访问，同样地，静态方法内也不可以使用 this
- 对于一些通用或常用的静态方法，应该将其定义为顶级函数而非静态方法

```js
main(List<String> args) {
  Person.smile(); 
}
 
class Person {
  String name;
  int age;
 
  Person(this.name, this.age);
 
  static smile() {
    print('😂😂😂😂😂😂');
  }
}
```

**泛型（Generics）**

- 泛型常用于需要要求类型安全的情况
- 适当地指定泛型可以更好地帮助代码生成
- 使用泛型可以减少代码重复
- <…> 符号表示是一个 泛型，用一个字母来代表类型参数，通常是T

比如你想声明一个只能包含 String 类型的数组，你可以将该数组声明为 List<String>（读作“字符串类型的 list”），这样的话就可以很容易避免因为在该数组放入非 String 类变量而导致的诸多问题，同时编译器以及其他阅读代码的人都可以很容易地发现并定位问题：

```js
var names = List<String>();
names.addAll(['Seth', 'Kathy', 'Lars']);
names.add(42); // Error
```
另一个使用泛型的原因是可以减少重复代码。泛型可以让你在多个不同类型实现之间共享同一个接口声明，比如下面的例子中声明了一个类用于缓存对象的接口：

```js
abstract class Cache<T> {
  T getByKey(String key);
  void setByKey(String key, T value);
}
``` 

```js
main(List<String> args) {
  DataHolder<String> dataHolder = new DataHolder('Some data');
  print(dataHolder.getData());
  dataHolder.setData('New Data');
  print(dataHolder.getData());
}
 
class DataHolder<T> {
  T data;
 
  DataHolder(this.data);
 
  getData() {
    return data;
  }
 
  setData(data) {
    this.data = data;
  }
}
```

### 库和可见性<hr>

**导入库（import）**

```dart
// 导入 dart 内置库
import 'dart:html';
// 指定库来至包管理器
import 'package:flutter/cupertino.dart';
```

**指定库前缀**

如果导入的两个代码库有冲突的标识符，可以为其中一个指定前缀。比如如果 library1 和 library2 都有 Element 类，那么可以这么处理：

```dart
import 'package:lib1/lib1.dart';
import 'package:lib2/lib2.dart' as lib2;

// 使用 lib1 的 Element 类。
Element element1 = Element();

// 使用 lib2 的 Element 类。
lib2.Element element2 = lib2.Element();
```

**导入库的一部分**

如果你只想使用代码库中的一部分，你可以有选择地导入代码库。例如：

```dart
// 只导入 lib1 中的 foo。(Import only foo).
import 'package:lib1/lib1.dart' show foo;

// 导入 lib2 中除了 foo 外的所有。
import 'package:lib2/lib2.dart' hide foo;
```

### 异步

Dart 代码库中有大量返回 <a href="https://api.dart.dev/stable/2.7.0/dart-async/Future-class.html">Future</a> 或 <a href="https://api.dart.dev/stable/2.7.0/dart-async/Stream-class.html">Stream</a> 对象的函数，这些函数被成为异步函数，它们会在耗时操作（比如I/O）执行完毕前直接返回而不会等待耗时操作执行完毕。

async 和 await 关键字用于实现异步编程，并且让你的代码看起来就像是同步的。

Future 和 JavaScript 中 Promise 对象极其相似用于异步处理，当异步处理成功就成功的操作，否则就捕获错误或者停止后续操作。Future 返回值仍然是 Future对象，所以进行链式调用

**Future.then 返回成功的结果**

```dart
// 延时任务 2s 后 返回 hi world 结果
Future.delayed(new Duration(seconds: 2),(){
  return "hi world!";
}).then((data){
  print(data);
});
```

**Future.catchErro 捕获错误**

```dart
Future.delayed(new Duration(seconds: 2),(){
   //return "hi world!";
   throw AssertionError("Error");  
}).then((data){
   //执行成功会走到这里  
   print("success");
}).catchError((e){
   //执行失败会走到这里  
   print(e);
});

```

**Future.whenComplete 无论异步执行成功或者失败都执行**

```dart
Future.delayed(new Duration(seconds: 2),(){
   return "hi world!";
}).then((data){
   //执行成功会走到这里 
   print(data);
}).catchError((e){
   //执行失败会走到这里   
   print(e);
}).whenComplete((){
   //无论成功或失败都会走到这里
});
```

**Future.wait 类似 primise.all，当数组中所有 Future 都执行成功后，才会触发 then 的成功回调，只要有一个 Future 执行失败，就会触发错误回调**

```dart
Future.wait([
  // 2秒后返回结果  
  Future.delayed(new Duration(seconds: 2), () {
    return "hello";
  }),
  // 4秒后返回结果  
  Future.delayed(new Duration(seconds: 4), () {
    return " world";
  })
]).then((results){
  print(results[0]+results[1]);
}).catchError((e){
  print(e);
});

```

async 和 await 和 JavaScript 中用法相似，在这里就不多做介绍，更多用法请参考<a href="http://www.dartdoc.cn/guides/language/language-tour#asynchrony-support">异步</a>


### 参考<hr>

<a href="http://www.dartdoc.cn/guides/language/language-tour#class-variables-and-methods">Dart 开发文档</a>



