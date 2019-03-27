## 系统管理指令<br/>

**stat**  显示指定文件的详细信息<br/>

**who**   显示在线登陆用户<br/>

**whoami** 显示当前操作用户 <br/>

**hostname**  显示主机名 <br/>

**uname**  显示系统信息<br/>

**top**  动态显示当前耗费资源最多进程信息<br/>

**ps**  查看进程状态 ps -aux<br/>
```
-A ：所有的进程均显示出来，与 -e 具有同样的效用
-a ：显示现行终端机下的所有进程，包括其他用户的进程
-u ：以用户为主的进程状态
x ：通常与 a 这个参数一起使用，可列出较完整信息

```

**du**  查看目录大小 du -h /home带有单位显示目录信息<br/>

**df**  查看磁盘大小 df -h 带有单位显示磁盘信息<br/>

**ifconfig**  查看网络情况<br/>

**ping**  测试网络连通 <br/>

**netstat**  显示网络状态信息<br/>

**man**  命令帮助文档如：man ls<br/>

**clear**  清屏<br/>

**alias**  对命令重命名 <br/>
```
alias l="ls" 
``` 
<br/>

**kill**   杀死进程，可以先用ps 或 top命令查看进程的id，然后再用kill命令杀死进程。<br/>


## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/linux/compression.md'>linux基础系列之-打包压缩相关系列</a>

## linux基础命令系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/linux/index.md'>linux基础命令系列</a>