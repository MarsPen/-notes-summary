## Linux文件权限管理<br/>

**三种基本权限**
```
R  读  数值表示为4
W  写  数值表示为2
X  可执行  数值表示为1
```

1.执行ls -al命令行会出现<br/>
```
drwxr-xr-x  19 renbo  staff   608B Mar 27 11:31 -notes-summary
drwxr-xr-x  41 renbo  staff   1.3K Mar 12 17:05 ant-design-pro
drwxr-xr-x   7 renbo  staff   224B May 18  2018 canvas
drwxr-xr-x   8 renbo  staff   256B Sep 11  2017 doT-demo
drwxr-xr-x  19 renbo  staff   608B May 24  2018 egg-example
drwxr-xr-x   4 renbo  staff   128B Nov 21 13:52 express
drwxr-xr-x   3 renbo  staff    96B Aug 13  2018 flutter
```
2.解释：
```
d ：第一位表示文件类型，d是目录文件、l是链接文件、-是普通文件、p是管道

rwx ：第2-4位表示这个文件的属主拥有的权限。r是读、w是写、x是执行

r-x ：第5-7位表示和这个文件属主所在同一个组的用户所具有的权限

r-x ：第8-10位表示其他用户所具有的权限

r:read就是读权限     --数字4表示

w:write就是写权限    --数字2表示

x:excute就是执行权限 --数字1表示
```

**更改权限**
```
sudo chmod [u所属用户  g所属组  o其他用户  a所有用户]  [+增加权限  -减少权限]  [r  w  x]   目录名 

例如：有一个文件filename，权限为“-rw-r----x” ,将权限值改为"-rwxrw-r-x"，用数值表示为765

sudo chmod u+x g+w o+r  filename

上面的例子可以用数值表示

sudo chmod 765 filename

一般超级权限为sudo chmod 777 filename
```




## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/linux/vim.md'>linux shell系列之-vim使用</a>

## linux基础命令系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/linux/index.md'>linux基础命令系列</a>
