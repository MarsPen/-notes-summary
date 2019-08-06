// 定义泛型结构
interface CreatePeopleFunc {
  <T>(name: string, age: T): Array<T>;
}

// 创建泛型
let createPeople:CreatePeopleFunc;
createPeople = function<T>(name: string, age: T): Array<T> {
  private people: T[] = []
  let temp:any = {
    name : name,
    age: age
  }
  people.push(temp)
  return people
}
// 调用函数
createPeople('zhangsan', 28)



