// 定义泛型结构
interface CreatePeopleFunc {
  <T>(name: string, age: T): Array<T>;
}

// 创建泛型
let createPeople:CreatePeopleFunc;
let people: T[] = []
createPeople = function<T>(name: string, age: T): Array<T> {
  
  let temp:any = {
    name : name,
    age: age
  }
  people.push(temp)
  return people
}
// 调用函数
createPeople('zhangsan', 28)
// 调用函数
createPeople('', 28)

let obj = {
  ['name': '1111','age': 23],
  ['name': 'lisi','age': '29']
}