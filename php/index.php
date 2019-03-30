<?php 
  $age = 20; //全局作用域
  $name = 'zhangsan';
  function people () {
    $isJob  = 'yes'; //局部变量
    global $name;   //访问全局作用域
    var_dump($name);
  }
  people();


  function test() {
    static $a = 0;
    echo $a;
    $a++;
  }
  test (); //0
  test (); //1
  test (); //2
?>