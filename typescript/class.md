## TS基础系列之-类

在JavaScript 通过构造函数和原型链来实现类和继承。而在 ES6 中，也用语法糖实现了class，下面介绍一下在 ts 中的类。

### 类的概念 <br/>

类是面向对象程序设计中的概念，是面向对象编程的基础，由于是一种数据类型，而不是数据，所以不存在于内存中。

- 类(Class)：定义了一件事物的抽象特点，包含它的属性和方法
- 对象（Object）：类的实例，通过 new 生成，类是概念，对象是实体
- 面向对象（OOP）的三大特性：封装、继承、多态
- 封装（Encapsulation）：将对数据的操作细节隐藏起来，只暴露对外的接口。外界调用端不需要（也不可能）知道细节，就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据
- 继承（Inheritance）：子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性
- 多态（Polymorphism）：由继承而产生了相关的不同的类，对同一个方法可以有不同的响应。
- 存取器（getter & setter）：用以改变属性的读取和赋值行为
- 修饰符（Modifiers）：修饰符是一些关键字，用于限定成员或类型的性质。比如 public 表示公有属性或方法
- 抽象类（Abstract Class）：抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现
- 接口（Interfaces）：不同类之间公有的属性或方法，可以抽象成一个接口。接口可以被类实现（implements）。一个类只能继承自另一个类，但是可以实现多个接口

### ES6中类的用法 <br/>

1. **定义属性和方法**<hr>
    ```
    // 定义类
    class Parent{
      // 定义构造函数
      constructor(name='wang',age='27'){
        // 定义属性
        this.name = name;
        this.age = age;
      }
      // 定义方法
      eat(){
        console.log(`${this.name} ${this.age} eat food`)
      }
    }

    ```
2. **利用关键字extends 和 super 继承**<hr>
    ```
    class Child extends Parent{ 
        constructor(name = 'ren',age = '27'){ 
          //继承父类属性
          super(name, age); 
        } 
          eat(){ 
          //继承父类方法
            super.eat() 
          } 
      } 
      let child =new Child('xiaoxiami'); 
      child.eat();
    ```
3. **存储器getter,setter改变属性和读取**<hr>

    ```
    class People{
      // 定义构造函数
      constructor(name){
        // 定义属性
        this.name = name;
      }
      get name () {
        return 'renbo';
      }
      set name (value) {
        console.log('setter: ' + value);
      }
      // 定义方法
      eat(){
        console.log(`${this.name}  eat food`)
      }
    }
    let people = new People('lisi'); // setter: lisi
    people.name = 'zhangsan'; // setter: zhangsan
    console.log(people.name); // renbo
    ```
4. **静态方法使用static修饰符（由于分配在静态内存空间中，所以不需要实例化，只需要吊影即可）**<hr>
    ```
    class People{
      // 定义静态方法
      static eat(name){
        console.log(`${name} eat food`)
      }
    }
    console.log(People.eat('renbo')) // renbo eat food
    ```

### ES7中类的用法 <br/>

1. **定义属性可以直接在类中定义**<hr>
  ```
    class People{
      name = 'zhangsan'
      constructor () {
        // 
      }
    }
    let people = new People();
    console.log(npeople.name) // zhangsan
  ```

2. **定义静态属性**<hr>
```
  class People{
   static  name = 'zhangsan'
    constructor () {
      // 
    }
  }
  console.log(People.name) // zhangsan
```

### TypeScript 中类的用法 <br/>

1. **说起 ts 中的类不得不说访问修饰符 public private protected**<hr>

- public 说明属性或方法是公有的，在任何地方被访问到，在 ts 中方法和属性默认的是 public
- private 说明属性或方法是私有的，不能在类的外部访问
- protected 说明属性或方法是受保护的，和 private 类似，但是 protected 也可以在子类中访问

**public 修饰符**

```
class People {
  public name;
  public constructor(name) {
    this.name = name;
  }
}

let people = new People('renbo');
console.log(people.name); // renbo
```

**private 修饰符**

```
class People {
  private  name;
  public constructor(name) {
    this.name = name;
  }
}

let people = new People('renbo');
console.log(people.name); // Property 'name' is private and only accessible within class 'People'.

// 在子类中也不允许访问，只是私有
class People {
  private  name: string;
  public constructor(name: string) {
    this.name = name;
  }
}

class SmilePeople extends People {

  public constructor (name:string) {
    super(name)
    console.log(this.name); // Property 'name' is private and only accessible within class 'People'.
  }
}
```

**protected 修饰符**

```
class People {
  protected  name;
  public constructor(name) {
    this.name = name;
  }
}

let people = new People('renbo');
console.log(people.name); // Property 'name' is protected and only accessible within class 'People' and its subclasses.ts
```

**protected 修饰符(子类访问)**

```
class People {
  protected  name: string;
  public constructor(name: string) {
    this.name = name;
  }
}

class SmilePeople extends People {

  public constructor (name:string) {
    super(name)
    console.log(this.name)
  }
}

let people  = new People ('zhangsna')
let smilePeople = new SmilePeople('wangwu'); // wangwu

```

2. **抽象类（ abstract 用于定义抽象类以及抽象类中的抽象方法）**<hr>

- 抽象类可以作为派生其他类的基类
- 抽象类中的抽象方法必须被子类实现
- 抽象类无法直接实例化
- 与接口不同，抽象类可以包含其成员的实现细节

``` 
// 上述1，2
abstract class People {
  public name:string;
  public constructor (name:string) {
    this.name = name;
  }
  public abstract eat():string
}
// 派生类
class SmilePeople extends People {
  static food: string = 'apple'
  // eat 方法必须在子类中实现
  public eat ():string {
    return `my name is ${this.name} I,m eating ${SmilePeople.food}`
  }
}

let smilePeople = new SmilePeople('zhangsan');
smilePeople.eat()

// 无法直接实例化
abstract class People {
  public name:string;
  public constructor (name:string) {
    this.name = name;
  }
  public abstract eat ():void
}

let people = new People('zhangsan') // Cannot create an instance of an abstract class.

```


## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/typescript/interfaces.md'>接口</a>

## TypeScript基础列系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/typescript/index.md'>TypeScript基础</a>









