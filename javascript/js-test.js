  /*
   *demo1:  先执行变量提升, 再执行函数提升
   */
  
  function a() {}
  var a
  console.log(typeof a) // 'function'

 /*
  *demo2:
  */
  if (!(b in window)) {
    var b = 1
  }
  console.log(b) // undefined

  /*
   demo3:
   */
  var c = 1
  function c(c) {
    console.log(c)
    var c = 3
  } 
  c(2) // 报错

  /*
   *demo4:
   */
  function fun(){ var a=b=3;}
 console.log(b)//B是全局变量 var a是局部变量  b=3;b=undefine






