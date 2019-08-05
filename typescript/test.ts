
// 定义规则
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}
// 实现规则
function getCounter(): Counter {
  
  let counter = <Counter>function (start: number) { 
    console.log(start)
  };

  counter.interval = 0;

  counter.reset = function () {
    console.log('reset')
  };

  return counter;
}

let counter = getCounter()
counter(20); // 20
counter.reset(); // reset 
counter.interval = 5; // 5
