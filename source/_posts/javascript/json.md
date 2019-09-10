---
title: json 对象
date: 2019-5-11 18:32:09
top: true
cover: true
password:
toc: true
mathjax: false
summary: 
tags:
- JavaScript
categories:
- JavaScript
---

## JSON.stringify

- 将值转换为相应的JSON格式
- 布尔值、数字、字符串在序列化过程中会自动转换成对应的原始值 (字符串需要单独处理)
- NaN和Infinity格式的数值及null都会被当做null
- 不可枚举的属性会被忽略
- undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）
- 函数、undefine,Sysmbol被单独转换时，会返回undefined
- 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误


### 语法

```js
JSON.stringify(value[, replacer [, space]])
```

### 实现

通过上述说明处理不同情况下的数据情况，此实现不包括第二个和第三个参数

```js
function jsonStringify(data) {

  let dataType = typeof data

  if (dataType !== "object") {

    let isString = dataType === 'string'
    let isNull = Number.isNaN(data) || data === Infinity
    let isUndefined = dataType === "undefined" || dataType === "function" || dataType === "symbol"

    if (isNull) {
      return String("null")
    } else if (isUndefined) {
      return undefined
    } else if (isString) {
      return String('"' + data + '"')
    } else {
      return String(data)
    }

  } else if (dataType === "object") {

    if (data === null) {

      return "null"

    } else if (data.toJSON && typeof data.toJSON === "function") {

      return jsonStringify(data.toJSON())

    } else if (data instanceof Array) {

      let result = []
      data.forEach(function (item, index) {

        let isNull = typeof item === "undefined" || typeof item === "function" || typeof item === "symbol"
        if (isNull) {
          result[index] = "null"
        } else {
          result[index] = jsonStringify(item)
        }
      })
      result = "[" + result + "]"
      return result.replace(/'/g, '"')

    } else if (data instanceof Object) {

      let result = []
      Object.keys(data).forEach(function (item, index) {

        let dataType = typeof data[item] !== "undefined" && typeof data[item] !== "function" && typeof data[item] !== "symbol"
        if (typeof item !== "symbol") {
          if (dataType) {
            result.push('"' + item + '"' + ":" + jsonStringify(data[item]))
          }
        }
      })
      return ("{" + result + "}").replace(/'/g, '"');
    }
  }
}
```


## JSON.pase

解析 JSON 字符串

### 语法
```js
JSON.parse(text[, reviver])
```

### evel 版本实现

```js
function jsonPase (data) {
  return evel('('+ data + ')')
} 
```

直接调用存在 xss 漏洞，数据中可能不是json 数据，所以需要对数据进行校验

```js
var rx_one = /^[\],:{}\s]*$/;
var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rx_four = /(?:^|:|,)(?:\s*\[)+/g;

if (
    rx_one.test(
        json
            .replace(rx_two, "@")
            .replace(rx_three, "]")
            .replace(rx_four, "")
    )
) {
    var obj = eval("(" +json + ")");
}
```

### Function 版本实现
```js
var jsonStr = '{ "age": 20, "name": "renbo" }'
var json = (new Function('return ' + jsonStr))();
```




