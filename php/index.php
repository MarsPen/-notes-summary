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


$people = array('name'=>'renbo','age'=>'28');
print_r(array_keys($people)); // name age
?>