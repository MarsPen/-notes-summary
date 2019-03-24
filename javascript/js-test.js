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
  console.log(a);    // f a() {console.log(10)}
  console.log(a());    //  undefined
  var a = 1;
  function a() {
    console.log('nihao') //nihao
  }
  console.log(a)   //1
  a = 3;
  console.log(a());  //a is not a function;

  /*
   *demo4:
   */
  function fun(){ var a=b=3;}
 console.log(b)//B是全局变量 var a是局部变量  b=3;b=undefine

 /*
   *demo5:
   */
  var x = 10;
  function fn () {
    console.log(x);
  }
  function show (fn) {
    var x = 20;
    fn();
  }
  show(fn);

  function Function(name,age){
    this.name  = name
    this.age = age
  }
  Function.prototype.sayName = function () {
    console.log(this.name)
  }
  var f = new Function('zhangsan', 20)

  function Object(name,age){
    this.name  = name
    this.age = age
  }
  Object.prototype.sayName = function () {
    console.log(this.name)
  }
  var o = new Object('zhangsan', 20)

  function Person(name,age){
    this.name  = name
    this.age = age
  }
  Person.prototype.sayName = function () {
    console.log(this.name)
  }
  var p = new Person('zhangsan', 20)
  Object.prototype.__proto__ === o.prototype
  Function.prototype.__proto__ === o.prototype








