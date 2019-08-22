---
title: event 事件驱动模型
date: 2017-01-23 12:32:09
top: false
cover: false
password:
toc: true
mathjax: false
summary: 
tags:
- Node
categories:
- Node
---


说起node的事件驱动模型首先我们来搞清楚几个概念CPU，线程、进程、调度、事件驱动<br/>

**CPU**<br/>

1、CPU 是中央处理器，是计算机的核心<br/>
2、CPU 通过和寄存器，高速缓存，以及内存交互来执行程序<br/>
3、32位 CPU 最多寻址4g内存，而64位 CPU 目前来说没有上限<br/>


**进程（Process）**<br/>

1、进程是资源分配最小单位，对于操作系统而言打开一个浏览器就是启动一个浏览器进程，打开 QQ 就是一个 QQ 进程<br/>
2、操作系统为进程开辟一段内存空间，每个进程占用一个进程表项，包含了进程状态的重要信息，包括程序计数器、堆栈指针、内存分配状况、所打开文件的状态、帐号和调度信息等，cpu根据这些信息配合寄存器进行函数调用和程序执行<br/>

3、 CPU利用率=1－pⁿ<br/>
  - 一个进程等待I/O操作的时间与其停留在内存中的时间比为p<br/>
  - 内存中同时有n个进程<br/>

**线程（Thread）**<br/>

线程是程序执行的最小单位，比如打开一个 QQ 进程在里面可以打字，发表情同时和很多人聊天。同时运行多个子任务，这样的子任务就可以成为线程，每一个进程中至少有一个线程。<br/>

**调度**<br/>

1、 *调度程序（scheduler）*-多进程同时竞争CPU时，超过两个的进程处于就绪态，那么单CPU必须选择下一个要运行的进程，完成选择工作的程序称为调度程序（另称CPU调度器）<br/>
2、 *CPU分配器（Dispatcher*- 决定了将CPU分配给谁，然后分配器将CPU控制权交给该进程<br/>
3、 *进程行为* - 一般分为I/O和计算（CPU），根据占用时间不同，分为I/O密集型（I/O burst）进程和CPU密集型（CPU burst）进程<br/>
4、 当然调度是一个复杂的操作会有调度算法具体请参考<a href="https://yq.aliyun.com/articles/278727">阿里云社区博客</a>


**计算密集型和IO密集型**<br/>

1、计算密集型任务的特点是要进行大量的计算，消耗CPU资源，计算密集型任务同时进行的数量应当等于CPU的核心数<br/>

2、IO密集型特点是CPU消耗很少，任务的大部分时间都在等待IO操作完成（因为IO的速度远远低于CPU和内存的速度）。对于IO密集型任务，任务越多，CPU效率越高，但也有一个限度。常见的大部分任务都是IO密集型任务，比如Web应用<br/>


**多进程-多线程**<br/>

1、多进程模式最大的优点就是稳定性高，因为子进程崩溃，不会影响主进程和其他子进程。著名的Apache最早就是采用多进程模式，多进程模式的缺点是创建进程的代价大<br/>

2、多线程模式致命的缺点就是任何一个线程挂掉都可能直接造成整个进程崩溃，因为所有线程共享进程的内存，但创建线程相对于进程开销较小，，所以运行速度较比多进程快，并且线程之间可以共享数据。可以有效解决多进程内存浪费问题。但由于每个线程都拥有自己独立的堆栈，需要占用一定的内存空间，而且操作系统内核在切换线程时也要切换线程上下文。所以在大并发量时，多线程结构无法做到强大的伸缩性<br/>

**异步I/O**<br/>

1、一个任务在执行的过程中大部分时间都在等待 I/O 操作，单进程单线程模型会导致别的任务无法并行执行<br/>
2、充分利用操作系统提供的异步 I/O 支持，就可以用单进程单线程模型来执行多任务，这种模型称为事件驱动模型<br/>
3、在单核CPU上采用单进程模型可以高效地支持多任务。在多核CPU上，可以运行多个进程（数量与CPU核心数相同），充分利用多核CPU。由于系统总的进程数量十分有限，因此操作系统调度非常高效<br/>


**事件驱动模型**<br/>

1、事件驱动模型是为了解决高并发（如Node，Nginx)<br/>
2、操作系统在调度时较少的切换上下文，没有线程同步等问题<br/>
3、所有处理都在单线程上进行，所以影响性能的点都在 CPU 的计算能力上，由于不受多进程或多线程模式中资源上线的影响，可伸缩性较强<br/>

**Node事件驱动模型**

1、每一个 I/O 工作被添加到事件队列中，线程循环地处理队列上的工作任务，当执行过程中遇到来堵塞(读取文件、查询数据库)时，线程不会停下来等待结果，而是留下一个处理结果的回调函数，转而继续执行队列中的下一个任务。这个传递到队列中的回调函数在堵塞任务运行结束后才被线程调用<br/>

<img src="https://github.com/MarsPen/-notes-summary/blob/master/images/event.png"><br/>

2、Node 在启动进程中会创建一个循环，每次循环运行就是一个Tick周期，每个Tick周期中会从事件队列查看是否有事件需要处理，直到事件队列全部执行完毕，node应用就会终<br/>
3、Node 对于堵塞 I/O 使用线程池来在操作，通过取其中一个子线程线程来执行复杂任务，而不占用主循环线程。当堵塞任务执行完毕通过添加到事件队列中的回调函数来处理接下来的工作，这样就防止堵塞 I/O 占用空闲资源，这就是所谓的非阻塞式 I/O<br/>

<img src="https://github.com/MarsPen/-notes-summary/blob/master/images/event-loop.png"><br/>

**事件队列调度（通过回调函数将任务添加事件队列中）**<br/>
1、内置的事件和事件监听器（http、server的一些事件）<br/>
2、异步堵塞 I/O 库(db处理、fs处理等)<br/>
3、定时器setTimeout、setInterval<br/>
4、全局对象process的.nextTick()API<br/>
5、自定义的事件和监听器<br/>


**内置事件(举例)**<br/>
```
// 引入 events 模块
let events = require('events');

// 创建事件对象
let eventEmitter = new events.EventEmitter();

// 创建事件处理程序
let connectHandler = function connected() {
   // 开始触发事件 
   eventEmitter.emit('start');
}

// 绑定事件处理程序
eventEmitter.on('connection', connectHandler);
eventEmitter.on('start', function(){});

// 触发事件处理程序
eventEmitter.emit('connection');

console.log("程序执行完毕。");
```


以上是Node 事件驱动模型的基本概念。在下篇进程文章中会介绍在 Node 中怎样创建多进程架构，也会在**node高级系列-v8与异步I/O**中详细介绍 Node的异步 I/O <br/>



## 更多方法参考<br/>
<a href='http://nodejs.cn/api/events.html'>Node Api events 事件模块 </a>


## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/node/process.md'>node 基础API-process进程</a>

## node系列
<a href='https://github.com/MarsPen/-notes-summary/blob/master/node/index.md'>node 系列</a>






















