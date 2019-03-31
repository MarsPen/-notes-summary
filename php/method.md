## PHP 常用方法

此篇文章JS数组方法总结一样纯属是为了熟悉API，不得不承认PHP大法好比JS的原生方法多的很。这里只列出个人认为比较常用的。<br/>

**数组内置函数**<br/>

1. for、foreach循环输出数组元素<br/>
```
<?php 
  // for循环
  for ($i = 0; $i <= 100; $i++) {
    echo "$i <br/>";
  } 

  // foreach 只适用于数组
  $name = array('zhangsan', 'lisi', 'wangwu');  // 创建数组
  foreach ($name as $value) {
    echo "$value <br/>";
  }
?>
```

2. count() 获取数组元素的个数 <br/>
```
<?php
  $nameLength = array('zhangsan', 'lisi', 'wangwu');
  echo count($nameLength); // 3
?>
```

3. 输出数组当前的元素的值，如果当前元素为空或者无值则返回FALSE <br/>
``` 
<?php
  $name = array('zhangsan', 'lisi', 'wangwu');

  echo current($name); // 返回第一个元素zhangsan 

  echo end($name); // 返回最后一个元素wangwu

  echo next($name); // 返回指定元素的下一个元素

  echo prev($name); // 返回指定元素的上一个元素

  echo reset($name); // 把内部指针移动到数组的首个元素zhangsan

?>
```

4. 对当前数组进行排序<br/>
```
  $numbers = array(1, 2, 3, 3, 4, 5, 6, 2);

  // 返回bool
  sort($numbers);  //对数组进行升序成功则为true 失败则为false
  rsort($numbers); //对数组进行降序成功则为true 失败则为false
  array_reverse($array, $preserve); //对原数组按反序排序，返回排序后的数组(2, 6, 5, 4, 3, 3, 2, 1)
```

5. 合并数组<br/>
```
$arr = array(1, 2, 3, 3, 4, 5, 6, 2);
$arr1 = array(10, 20, 30);

array_merge($arr, $arr1 );
```

6. 压栈，出栈<br/>
```
$name = 'wang';
$name1  = array('zhang', 'li');

array_push($name1, $name); // 3 返回新数组的长度

array_pop($name1); //li 返回被pop的值。栈为空，返回null

array_shift($name1); //删除第一个元素并返回；

array_unshift(array，val1，val2,...); //将参数按照顺序加入队列中
```

7. 统计数组中值为出现的次数<br/>

```
$val = array(1, 2, 3, 3, 4, 3, 3, 1, 1);
print_r(array_count_values($val));
```

8. 过滤数组的元素<br/>
```
function func ($var) {
  return($var & 1);
}

$val = array('a', 'b', 2, 3, 4);
print_r(array_filter($val, 'func')); // 3
```

9. 检查索引是否在数组中<br/>
```
$people = array('name'=>'renbo', 'age'=>'28');

if (array_key_exists('name', $people)) {
  echo 'name存在';
}
```

10. 检查数组中是否存在指定的值<br/>
```
$val = array('zhangsan', 'lisi', 'wangwu');
if (in_array('zhangsan', $val)) {
  echo '存在';
}
```

11. 返回当前元素的Key<br/>
```
$people = array('name'=>'renbo', 'age'=>'28');
key($people); //name
```

12. 返回当前元素所有的key<br/>
```
$people = array('name'=>'renbo','age'=>'28');
print_r(array_keys($people)); // name age
```

**时间内置函数**<br/>
```
date(format[,timestamp])

mktime(hour,minute,second,month,day,year) //省略的参数将以本地日期和时间代替

getdate([timestamp]) 
``` 

**URL处理内置函数**<br/>
```
urlencode(str) 返回值字符串中所有的非字母和数字字符变成一个百分号(%) 和一个两位的十六进制数，空格被转换成+,-、_和.不做任何转换

urldecode(str) 
```


其实还有好多比如字符串的内置函数、文件操作的内置函数、数据库连接的内置函数等等。其实PHP方法还是比JS多用到的时候查看API即可...<br/>


## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/php/oop.md'>php基础系列之-面向对象</a>

## linux基础命令系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/php/index.md'>php基础系列</a>