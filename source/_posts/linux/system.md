---
title: 系统管理指令
date: 2018-7-2 13:28:25
top: false
cover: false
password:
toc: true
mathjax: false
summary: 
tags:
- Linux
categories:
- Linux
---


### stat  
显示指定文件的详细信息

### who
显示在线登陆用户

### whoami
显示当前操作用户

### hostname
显示主机名

### uname
显示系统信息

### top  
动态显示当前耗费资源最多进程信息

### ps  
查看进程状态 

```js
ps -aux

-A ：所有的进程均显示出来，与 -e 具有同样的效用
-a ：显示现行终端机下的所有进程，包括其他用户的进程
-u ：以用户为主的进程状态
x ：通常与 a 这个参数一起使用，可列出较完整信息

```

### du  
查看目录大小 `du -h /home`带有单位显示目录信息

### df
查看磁盘大小 `df -h `带有单位显示磁盘信息

### ifconfig  
查看网络情况

### ping
测试网络连通

### netstat 
显示网络状态信息

### man  
命令帮助文档如：`man ls`

### clear
清屏

### alias
对命令重命名

```js
alias l="ls" 
``` 

### kill   
杀死进程，可以先用ps 或 top命令查看进程的id，然后再用kill命令杀死进程。
