<?php 
  // $age = 20; //全局作用域
  // $name = 'zhangsan';
  // function people () {
  //   $isJob  = 'yes'; //局部变量
  //   global $name;   //访问全局作用域
  //   var_dump($name);
  // }
  // people();


  // function test() {
  //   static $a = 0;
  //   echo $a;
  //   $a++;
  // }
  // test (); //0
  // test (); //1
  // test (); //2


  // function test1() {
  //   $a = 1;
  //   $b = &$a;
  //   $b = "2$b";
  //   echo "$a,$b";
  // }
  // test1();

  // for循环
  // for ($i = 0; $i <= 100; $i++) {
  //   echo "$i <br/>";
  // } 

  // foreach 只适用于数组
  // $name = array("zhangsan","lisi","wangwu");  // 创建数组
  // foreach ($name as $value) {
  //   echo "$value <br/>";
  // }

  // $nameLength = array("zhangsan","lisi","wangwu");
  // echo count($nameLength);
  // $name = array("zhangsan","lisi","wangwu");
  // echo current($name) . "<br/>"; 

  // $name = array("zhangsan","lisi","wangwu");

  // echo current($name); // 返回第一个元素zhangsan 

  // echo end($name); // 返回最后一个元素wangwu

  // echo next($name); // 返回指定元素的下一个元素

  // echo prev($name); // 返回指定元素的上一个元素


  // $numbers = array(1,5,4,3,10,7);
  // var_dump(array_reverse($numbers));
  // $arr = array(1,2,3,3,4,5,6,2);
  // $arr1 = array(10,20,30);

  // var_dump(json_encode(array_merge($arr,$arr1 )));

  // $name = 'wang';
// $name1  = array('zhang','li');

// // print_r(array_push($name1,$name));
// print_r(array_pop($name1))

// $val = array(1,2,3,3,4,3,3,1,1);
// print_r(array_count_values($val));

// function func ($var) {
//   return($var & 1);
// }

// $val = array("a","b",2,3,4);
// print_r(array_filter($val,"func"));
// $val = array('zhangsan', 'lisi', 'wangwu');
// if (in_array('zhangsan', $val)) {
//   echo '存在';
// }


// $people = array('name'=>'renbo','age'=>'28');
// print_r(array_keys($people)); // name age
// class People {
//   // 公有成员属性
//   public $name = 'zhangsan';
//   public $age = 28;
//   // 公有成员函数方法（$this代表自身的对象);
//   public function study () {
//     echo $this->name;
//   }
// }
// //创建对象
// $body = new People();
// // 成员对象的调用
// $body->study();

// class People {
//   // 通过构造方法为成员变量赋初始值
//   function __construct( $name, $age ) {
//     $this->name = $name;
//     $this->age = $age;
//   }
//   // 公有成员函数方法（$this代表自身的对象);
//   public function sayName () {
//     echo("my name is &nbsp;" .$this->name.",&nbspI`m&nbsp;" .$this->age ."&nbsp;years old");
//     echo '</br>';
//   }
// }
// // 通过new操作符创建zhangsan对象
// $zhangsan = new People('zhangsan', 28);
// $zhangsan->sayName();

// // 通过new操作符创建lisi对象
// $lisi = new People('lisi', 26);
// $lisi->sayName();
// class People {
//   // 通过构造方法为成员变量赋初始值
//   function __construct ($name, $age) {
//     $this->name = $name;
//     $this->age = $age;
//   }
//   // 公有成员函数方法（$this代表自身的对象);
//   public function sayName () {
//     echo("my name is &nbsp;" .$this->name.",&nbspI`m&nbsp;" .$this->age ."&nbsp;years old");
//     echo '</br>';
//   }
//   // 析构函数用于销毁某些变量、对象，操作等
//   function __destruct () {
//     $this->name = '';
//     return true;
//   }
// }
// // 通过new操作符创建lisi对象
// $lisi = new People('lisi', 26);
// var_dump($lisi);
// echo '<br/>';
// if ($lisi->__destruct()) {
//   echo '销毁成功</br>';
//   var_dump($lisi);
// }


// class People {
//   var $name;
//   var $age;
//   function __construct ($name, $age) {
//     $this->name = $name;
//     $this->age = $age;
//   }
//   public function sayName () {
//     echo("my name is &nbsp;" .$this->name.",&nbspI`m&nbsp;" .$this->age ."&nbsp;years old");
//     echo '</br>';
//   }
// }

// class Boy extends People {

//   function getParentProperty () {
//     var_dump($this);
//   }

// }
// $lisi = new People('lisi', 26);
// $boy = new Boy('wangwu',28);
// $boy->sayName();
// $boy->getParentProperty();


// // 父类
// class People {
//   var $name;
//   var $age;
//   function __construct ($name, $age) {
//     $this->name = $name;
//     $this->age = $age;
//   }
//   public function sayName () {
//     echo("my name is &nbsp;" .$this->name.",&nbspI`m&nbsp;" .$this->age ."&nbsp;years old");
//     echo '</br>';
//   }
// }
// // 子类
// class Boy extends People {
//   // 重写父类方法
//   public function sayName () {
//     echo ("my name is &nbsp;" .$this->name);
//     return $this->name;
//   }
// }
// $lisi = new People('lisi', 26);
// $boy = new Boy('wangwu',28);
// // 子类调用父类方法
// $boy->sayName();
  /**
   * 基类
   * Define People
   */
  // class People 
  // {
  //   // 声明一个公有的构造函数
  //   public function __construct () {}

  //   // 声明一个共有的方法
  //   public function sayName () 
  //   {
  //     echo 'sayname</br>';
  //   }

  //   // 声明一个受保护的方法
  //   protected function swim () 
  //   {
  //     echo 'swim</br>';
  //   }

  //   // 声明一个私有方法
  //   private function study () 
  //   {
  //     echo 'study';
  //   }
    
  //   // 不加关键字默认公有方法
  //   function getFun () {
  //     $this->sayName();
  //     $this->swim();
  //     $this->study();
  //   }
  // }
  // $people = new People();
  // // 正常运行输出sayname
  // $people->sayName();
  // // 产生错误
  // $people->swim();
  // // 产生错误
  // $people->study();
  // // 公有，受保护，私有都可以执行
  // $people->getFun(); 

  // /**
  //  * 子类
  //  * Define Boy
  //  */

  // class Boy extends People
  // {
  //   function getFun2 ()
  //   {
  //     $this->sayName();
  //     $this->swim();
  //     // 这行会产生一个错误
  //     $this->study(); 
  //   }
  // }
  // $body = new Boy();
  // // 这行能被正常执行
  // $body ->sayName();
  // // 公有的和受保护的都可执行，但私有的不行
  // $body->getFun2(); 

  // /**
  //  * 定义抽象类People
  //  */
  // abstract class People 
  // {

  //   abstract protected function eat();
  //   abstract protected function sleep();
  //   abstract protected function study();
  //   public function runing() 
  //   {
  //     echo '跑啊跑！</br>';
  //   }
  // }

  // /**
  //  * 实现抽象类
  //  */
  // class Zhangsan extends People
  // {
  //   protected function eat()
  //   {
  //     echo 'eat </br>';
  //     return 'eat';
  //   }

  //   protected function sleep()
  //   {
  //     echo 'sleep </br>';
  //     return 'sleep';
  //   }

  //   protected function study()
  //   {
  //     echo 'study </br>';
  //     return 'study';
  //   }

  //   public function getFunc () 
  //   {
  //     $this->eat();
  //     $this->sleep();
  //     $this->study();
  //   }
  // }
  // // 调用子类
  // $zhangsan = new Zhangsan;
  // $zhangsan->runing();
  // $zhangsan->getFunc();


// // 定义接口类
// interface People  
// {
//   public function eat($color);
// }

// // 实现接口类Apple
// class Apple implements People
// {
//  public function eat($color)
//  {
//     echo("我吃的$color 🍎<br/>");
//  }
// }

// // 实现接口类Grape
// class Grape implements People
// {
//   public function eat($color)
//   {
//     echo("我吃的$color 🍇");
//   }
// }

// $apple = new Apple();
// $apple->eat('红'); 

// $grape = new Grape();
// $grape->eat('紫'); 

// 定义People接口类
// interface People  
// {  
//  public function eat();  
// }  
// // 继承People接口类
// interface Boy extends People  
// {  
//  public function drink();  
// }  
// // 接口方法实现
// class Behavior implements Boy  
// {  
//  public function eat()  
//  {  
//     echo "吃东西<br>";  
//  }  
  
//  public function drink()  
//   {  
//     echo "喝饮料<br>";  
//   }  
// }         
// Behavior::eat();      
// Behavior::drink();
?>