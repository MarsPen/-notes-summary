<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 11:41:05
 * @LastEditTime: 2019-08-15 13:34:52
 * @LastEditors: Please set LastEditors
 -->
## 函数节流与抖动

说起函数的节流与抖动这个老生长谈的话题，我们就不的不说为什么会出现这两个概念

我们所说的都是在浏览器的环境内，但是浏览器有各种进程，来保证浏览器正常的，流畅的呈现在用户的眼前。例如渲染进程，其中非常重要的一个进程，那么 web 页面在渲染的时候就涉及到两个非常重要的概念重（repaint）绘与回流（reflow）

我们先来看下面一张来至 W3C 的图

<img src="https://github.com/MarsPen/-notes-summary/blob/master/images/timestamp-diagram.svg"></img>


从图中我们看到处理模型大概分为如下几个阶段
- DNS 查询
- TCP 连接
- HTTP 请求即响应
- 服务器响应
- 客户端渲染

这篇文章我们不讨论 Resource Timing 阶段，会在后续文章中讨论前端性能的时候重新提起

通过第五个阶段客户端渲染简单的回忆一下网页的生成过程，大致分为几个步骤

- HTML解析器解析成DOM 树
- CSS解析器解析成CSSOM 树
- 结合DOM树和CSSOM树，生成一棵渲染树(Render Tree)
- 生成布局（flow），根据渲染树来布局，以计算每个节点的几何信息
- 最后一步是绘制（paint），使用最终渲染树将像素渲染到在屏幕上














重绘(repaint)：当元素简单的样式改变不影响布局时，浏览器将使用重绘对元素进行更新，此时由于只需要 UI 层面的重新像素绘制，因此损耗较少。
