## PHP 面向对象

**面向对象基础概念**<br/>
Object Oriented Programming，简称OOP，是一种程序设计思想。OOP把对象作为程序的基本单元，一个对象包含了数据和操作数据的函数<br/>

**对象的主要三个特性**<br/>
对象的行为：可以对 对象施加那些操作，开灯，关灯就是行为<br/>
对象的形态：当施加那些方法是对象如何响应，颜色，尺寸，外型<br/>
对象的表示：对象的表示就相当于身份证，具体区分在相同的行为与状态下有什么不同<br/>

比如 People(人) 是一个抽象类，我们可以具体到男人和女人，男人和女人就是具体的对象，他们有名字属性，可以写，可以学习说话等行为状态。

**面向对象内容**<br/>
```
类 − 定义了一件事物的抽象特点。类的定义包含了数据的形式以及对数据的操作

对象 − 是类的实例

成员变量 − 定义在类内部的变量。该变量的值对外是不可见的，但是可以通过成员函数访问，在类被实例化为对象后，该变量即可称为对象的属性

成员函数 − 定义在类的内部，可用于访问对象的数据

继承 − 继承性是子类自动共享父类数据结构和方法的机制，这是类之间的一种关系。在定义和实现一个类的时候，可以在一个已经存在的类的基础之上来进行，把这个已经存在的类所定义的内容作为自己的内容，并加入若干新的内容

父类 − 一个类被其他类继承，可将该类称为父类，或基类，或超类

子类 − 一个类继承其他类称为子类，也可称为派生类

多态 − 多态性是指相同的函数或方法可作用于多种类型的对象上并获得不同的结果。不同的对象，收到同一消息可以产生不同的结果，这种现象称为多态性

重载 − 简单说，就是函数或者方法有同样的名称，但是参数列表不相同的情形，这样的同名不同参数的函数或者方法之间，互相称之为重载函数或者方法

抽象性 − 抽象性是指将具有一致的数据结构（属性）和行为（操作）的对象抽象成类。一个类就是这样一种抽象，它反映了与应用有关的重要性质，而忽略其他一些无关内容。任何类的划分都是主观的，但必须与具体的应用有关

封装 − 封装是指将现实世界中存在的某个客体的属性与行为绑定在一起，并放置在一个逻辑单元内

构造函数 − 主要用来在创建对象时初始化对象， 即为对象成员变量赋初始值，总与new运算符一起使用在创建对象的语句中

析构函数 − 析构函数(destructor) 与构造函数相反，当对象结束其生命周期时（例如对象所在的函数已调用完毕），系统自动执行析构函数。析构函数往往用来做"清理善后" 的工作（例如在建立对象时用new开辟了一片内存空间，应在退出前在析构函数中用delete释放）
```

## 代码解析上述概念

**PHP中类的定义**<br/>
```
  <?php
    class People {
      // 公有成员属性
      public $name = 'zhangsan';
      public $age = 28;
      // 公有成员函数方法
      public function sayName () {
        //业务逻辑 
      }
    }
  ?>

```
**PHP中对象的创建**<br/>
```
  class People {
    // 公有成员属性
    public $name = 'zhangsan';
    public $age = 28;
    // 公有成员函数方法（$this代表自身的对象);
    public function sayName () {
      echo $this->name;
    }
  }
  // 通过new操作符创建对象
  $body = new People();
  // 成员对象的调用
  $body->study();
```
**PHP中构造函数**<br/>
构造函数是一种特殊的方法。主要用来在创建对象时初始化对象和JS中构造函数中的constructor相似<br/>
```
  class People {
    // 通过构造方法为成员变量赋初始值
    function __construct( $name, $age ) {
      $this->name = $name;
      $this->age = $age;
    }
    // 公有成员函数方法（$this代表自身的对象);
    public function sayName () {
      echo("my name is &nbsp;" .$this->name.",&nbspI`m&nbsp;" .$this->age ."&nbsp;years old");
      echo '</br>';
    }
  }
  // 通过new操作符创建zhangsan对象
  $zhangsan = new People('zhangsan', 28);
  $zhangsan->sayName();

  // 通过new操作符创建lisi对象
  $lisi = new People('lisi', 26);
  $lisi->sayName();
```
**PHP中析构函数**<br/>
析构函数 (destructor) 与构造函数相反，当对象结束其生命周期时，系统自动执行析构函数，常用场景例如连接数据库在__construct中,处理完数据断开连接在__destruct方法中<br/>
```
  class People {
    // 通过构造方法为成员变量赋初始值
    function __construct ($name, $age) {
      $this->name = $name;
      $this->age = $age;
    }
    // 公有成员函数方法（$this代表自身的对象);
    public function sayName () {
      echo("my name is &nbsp;" .$this->name.",&nbspI`m&nbsp;" .$this->age ."&nbsp;years old");
      echo '</br>';
    }
    // 析构函数用于销毁某些变量、对象，操作等
    function __destruct () {
      $this->name = '';
      return true;
    }
  }
  // 通过new操作符创建lisi对象
  $lisi = new People('lisi', 26);

  var_dump($lisi);
  echo '<br/>';

  if ($lisi->__destruct()) {
    echo '销毁成功 <br/>';
    var_dump($lisi);
  }
```

**PHP中继承实现**<br/>
PHP 使用关键字 extends 来继承一个类<br/>
```
  // 父类
  class People {
    var $name;
    var $age;
    function __construct ($name, $age) {
      $this->name = $name;
      $this->age = $age;
    }
    public function sayName () {
      echo("my name is &nbsp;" .$this->name.",&nbspI`m&nbsp;" .$this->age ."&nbsp;years old");
      echo '</br>';
    }
  }
  // 子类
  class Boy extends People {

    function getParentProperty () {
      var_dump($this);
    }

  }
  $lisi = new People('lisi', 26);
  $boy = new Boy('wangwu',28);
  $boy->getParentProperty();
  // 子类调用父类方法
  $boy->sayName();
```
**PHP中方法重写**
```
  class People {
    var $name;
    var $age;
    function __construct ($name, $age) {
      $this->name = $name;
      $this->age = $age;
    }
    public function sayName () {
      echo("my name is &nbsp;" .$this->name.",&nbspI`m&nbsp;" .$this->age ."&nbsp;years old");
      echo '</br>';
    }
  }
  // 子类
  class Boy extends People {
    // 重写父类方法
    public function sayName () {
      echo ("my name is &nbsp;" .$this->name);
      return $this->name;
    }
  }
  $lisi = new People('lisi', 26);
  $boy = new Boy('wangwu',28);
  // 重写方法
  $boy->sayName();
```
**PHP中访问的控制**<br/>
PHP 对属性或方法的访问控制，是通过在前面添加关键字 public（公有），protected（受保护）或 private（私有）来实现的<br/>

public & var（公有）：公有的类成员可以在任何地方被访问<br/>

protected（受保护）：受保护的类成员则可以被其自身以及其子类和父类访问<br/>

private（私有）：私有的类成员则只能被其定义所在的类访问<br/>

```
  /**
   * 基类
   * Define People
   */
  class People 
  {
    // 声明一个公有的构造函数
    public function __construct () {}

    // 声明一个共有的方法
    public function sayName () 
    {
      echo 'sayname</br>';
    }

    // 声明一个受保护的方法
    protected function swim () 
    {
      echo 'swim</br>';
    }

    // 声明一个私有方法
    private function study () 
    {
      echo 'study';
    }
    
    // 不加关键字默认公有方法
    function getFun () {
      $this->sayName();
      $this->swim();
      $this->study();
    }
  }
  $people = new People();
  // 正常运行输出sayname
  $people->sayName();
  // 产生错误
  $people->swim();
  // 产生错误
  $people->study();
  // 公有，受保护，私有都可以执行
  $people->getFun(); 

  /**
   * 子类
   * Define Boy
   */

  class Boy extends People
  {
    function getFun2 ()
    {
      $this->sayName();
      $this->swim();
      // 这行会产生一个错误
      $this->study(); 
    }
  }
  $body = new Boy();
  // 这行能被正常执行
  $body ->sayName();
  // 公有的和受保护的都可执行，但私有的不行
  $body->getFun2(); 
```

**PHP中抽象类**<br/>
利用关键字abstract声明抽象

如果类中有一个方法被是声明为抽象，那么这个类也必须声明为抽象<br/>

抽象方法只声明了调用方式（参数），不能定义其具体的功能实现（相当于没有函数体），子类通过继承实现抽象方法，且不能被实例化<br/>

继承一个抽象类，子类必须定义父类中的所有抽象方法并且必须要和父类的声明访问级别保持一致或者更宽松<br/>

```
  /**
   * 定义抽象类People
   */
  abstract class People 
  {

    abstract protected function eat();
    abstract protected function sleep();
    abstract protected function study();
    public function runing() 
    {
      echo '跑啊跑！</br>';
    }
  }

  /**
   * 实现抽象类
   */
  class Zhangsan extends People
  {
    protected function eat()
    {
      echo 'eat </br>';
      return 'eat';
    }

    protected function sleep()
    {
      echo 'sleep </br>';
      return 'sleep';
    }

    protected function study()
    {
      echo 'study </br>';
      return 'study';
    }

    public function getFunc () 
    {
      $this->eat();
      $this->sleep();
      $this->study();
    }
  }
  // 调用子类
  $zhangsan = new Zhangsan;
  $zhangsan->runing(); //跑啊跑！
  $zhangsan->getFunc(); // eat sleep study
```

场景：在很多类里面很多的方法都是在重复。这里就可以去用抽象类，当然也可以重写一个类，每个公共类实例化实例化一次，调用相同的方法。但是abstract可以省去实例化的步骤，而且可以重载这个方法,这样不是更方便简单嘛<br/>
**PHP中接口的使用**<br/>
interface主要对类名，类所拥有的方法，以及所传参数起约束和规范作用，和abstract类似。在多人协同开发项目时起重要作用<br/>
```
// 定义接口类
interface People  
{
  public eat () {};
}
// 实现接口类
class Apple implements People{
 public function eat ()
 {
   echo '我吃的苹果';
 }
}

$apple = new Apple();
$apple->eat(); 
```

参数约束，如果参数名字不一样会报错<br/>
```
// 定义接口类
interface People  
{
  public function eat($color);
}

// 实现接口类Apple
class Apple implements People
{
 public function eat($color)
 {
    echo("我吃的$color 🍎<br/>");
 }
}

// 实现接口类Grape
class Grape implements People
{
  public function eat($color)
  {
    echo("我吃的$color 🍇");
  }
}

$apple = new Apple();
$apple->eat('红'); 

$grape = new Grape();
$grape->eat('紫'); 
```

接口继承<br/>
```
  // 定义People接口类
  interface People  
  {  
    public function eat();  
  }

  // 继承People接口类
  interface Boy extends People  
  {  
    public function drink();  
  }

  // 接口方法实现
  class Behavior implements Boy  
  {  
    public function eat()  
    {  
        echo "吃东西<br>";  
    }  
    
    public function drink()  
    {  
      echo "喝饮料<br>";  
    }  
  }         
  Behavior::eat();      
  Behavior::drink();

```
**总结抽象类和接口**<br/>
抽象类就是一个类的服务提供商，拥有众多服务<br/>

接口类就是一个类的规范，子类必须完成它指定方法<br/>

它们的区别：<br/>

抽象类继承用extends,接口继承用implements<br/>

抽象类能多重继承,接口多重继承用","隔开<br/>

抽象类中的方法不必全部重载,接口方法必须声明或者重载<br/>

抽象类不必只包含抽象方法,可以定义完整的方法,接口不能包含任何完整定义方法<br/>


**__set,__get,__isset,__unset,__call,__sleep(),__wakeup()等魔术方法**

1. __sleep() 方法常用于提交未提交的数据，或类似的清理操作。同时，如果有一些很大的对象，但不需要全部保存，这个功能就很好用<br/>

__wakeup() 经常用在反序列化操作中，例如重新建立数据库连接，或执行其它初始化操作<br/>

引入php手册中的例子<br/>
```
  class Connection 
  {
      protected $link;
      private $server, $username, $password, $db;
      
      public function __construct($server, $username, $password, $db)
      {
          $this->server = $server;
          $this->username = $username;
          $this->password = $password;
          $this->db = $db;
          $this->connect();
      }
      
      private function connect()
      {
          $this->link = mysql_connect($this->server, $this->username, $this->password);
          mysql_select_db($this->db, $this->link);
      }
      
      public function __sleep()
      {
          return array('server', 'username', 'password', 'db');
      }
      
      public function __wakeup()
      {
          $this->connect();
      }
  }
```

2. 属性重载__set,__get,__isset,__unset<br/>
```
public __set ( string $name , mixed $value ) : void // 设置私有属性值的时候调用
public __get ( string $name ) : mixed  // 获取私有属性值的时候调用
public __isset ( string $name ) : bool // 当判断一个私有成员属性是否被设置过时调用
public __unset ( string $name ) : void // 当销毁一个私有成员属性的时候调用
```
当实例化一个对象后，调用类中不存在或者没有权限访问的属性的时候，默认调用__get()方法。可以访问内部属性<br/>


3. 方法重载__call和__callStatic<br/>
```
call 和 callStatic 是类似的方法，前者是调用类不存在的方法时执行，而后者是调用类不存在的静态方式方法时执行。正常情况下如果调用一个类不存在的方法 PHP 会抛出致命错误，而使用这两个魔术方法我们可以替换一些更友好的提示或者记录错误调用日志信息、将用户重定向、抛出异常等等，亦或者是如同set 和 get 那样做方法的重命名。
```


## PHP基础命令系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/php/index.md'>php基础系列</a>







