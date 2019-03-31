## 语法、变量、数据类型

## 基础语法

1. PHP 脚本以 `<?php 开始，以 ?> 结束`<br/>
2. PHP 文件的默认文件扩展名是 ".php"<br/>
3. PHP 文件通常包含 HTML 标签和一些 PHP 脚本代码<br/>
4. PHP 中的每个代码行都必须以分号结束，否则输出错误<br/>
```
<!DOCTYPE html> 
<html> 
<body> 

<?php 
  echo "Hello World!"; 
?> 

</body> 
</html>
```

## 变量

**PHP 变量规则：**<br/>
1. 变量以 $ 符号开始，后面跟着变量的名称,$a<br/>
2. 变量名必须以字母或者下划线字符开始<br/>
3. 变量名只能包含字母数字字符以及下划线（A-z、0-9 和 _ ）<br/>
4. 变量名不能包含空格<br/>
5. 变量名是区分大小写的（$y 和 $Y 是两个不同的变量）<br/>
6. 由于PHP是弱类型语言所以变量不必声明类型和JS类似 <br/>

**PHP 变量作用域**<br/>

**四种不同的变量作用域**<br/>
```
local 局部
global 全局
static 局部-静态变量
parameter 参数
```

**局部和全局作用域 local global**<br/>
```
<?php 
  $age = 20; //全局作用域
  $name = 'zhangsan';
  function people () {
    $isJob  = 'yes'; //局部变量
    global $name;   //访问全局作用域
    var_dump($name);  // zhangsan 
  }
  people()
?>
```
解析：<br/>
1. $age 是在函数外部定义的变量，拥有全局作用域，但是这里和 JS 的区别是 $age 在people函数中是不可访问的<br/>
2. $isJob 是在函数内部声明的变量所以是局部变量，只能在函数内部访问<br/>
3. $name global 是在函数内部**调用**函数外部定义的全局变量,正常情况在函数内部访问函数外部的变量则为NULL<br/>


**Static 作用域**<br/>
```
<?php
  function test() {
    static $a = 0;
    // static $a = 1 + 2; // 解析错误 参照解析2
    echo $a;
    $a++;
  }
  test (); //0
  test (); //1
  test (); //2
?>
```
解析：<br/>
1. 静态全局变量的作用域局限于一个源文件内，只能为该源文件内的函数公用<br/>
2. 不能对静态变量用表达式的结果赋值，否则会导致解析错误<br/>
3. static全局变量只初使化一次，下一次依据上一次结果值，上例子中调用三次执行的结果是累加的。<br/>
4. 在内存的静态存储区中（静态存储区在整个程序运行期间都存在，其他局部变量存储在栈中。<br/>


**parameter 参数作用域**<br/>

```
  function test($a) {
    echo $a;
  }
  test (1); //1
```

**小结**

1. 定义在函数外部的就是全局变量，它的作用域从定义处一直到文件结尾。
2. 函数内定义的变量就是局部变量，它的作用域为函数定义范围内。
3. 函数内访问全局变量需要 global 关键字,如果不使用，则会覆盖全局变量


## 数据类型

**php数据类型**

String（字符串）, Integer（整型）, Float（浮点型）, Boolean（布尔型）, Array（数组）, Object（对象）, NULL（空值）。<br/>

这里由于和 JS 类似所以不多做解释<br/>



## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/php/method.md'>php基础系列之-常见操作方法</a>

## linux基础命令系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/php/index.md'>php基础系列</a>