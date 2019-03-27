## 常用指令<br/>

**ls显示文件或目录**<br/>
```
ls -F  //显示文件或目录
ls -l  //列出文件详细信息l(list)
ls -a  //列出当前目录下所有文件及目录，包括隐藏的a(all)
```

**mkdir创建目录**
```
mkdir dir  //创建一个dir的目录
```
mkdir -p 创建目录，若无父目录，则创建p(parent) <br/>
```
mkdir -p /study/dir1/dir2  //创建一个的目录树
```

**cd切换目录**
```
cd ..  //返回上级目录
cd /home  //进入指定目录
cd - //返回上次所在的目录 
```

**touch修改文件或者目录的时间属性，包括存取时间和更改时间。若文件不存在，系统会建立一个新的文件**
```
touch temp  //创建名为temp的空文件
touch temp  //如果temp存在则是修改文件的时间属性 可通过ls -l temp 查看文件属性
```

**echo命令行输出内容**
```
echo 'zhangsan' >> temp //创建名为temp带有zhangsan内容的文件
```
**cat查看文件内容**
```
cat temp  //查看temp文件中的内容
cat -n temp  //标示文件的行数
```

**cp拷贝**
```
cp temp newtemp  //复制temp文件
cp temp/* .  //复制temp目录下的所有文件到当前工作目录 
cp -a /temp/dir1 . //复制/temp/dir1目录到当前工作目录 
cp -a temp newtemp //复制temp目录 
```

**mv移动或重命名**
```
mv temp newtemp //重命名/移动一个目录 
```

**rm删除文件**
```
rm -f file  //删除file文件' 
rmdir dir1  //删除dir1的目录' 
rm -rf dir1 //递归删除dir1目录所有的内容
rm -rf dir1 dir2 //同时删除两个目录及它们的内容 
```

**find在文件系统中查找某文件**
```
find / -name file1  //从根文件系统查找文件和目录 
find / -user renbo  //查找属于用户 'renbo' 的文件和目录 
find /home/renbo -name \*.bin  // 查找带home/renbo目录中有.bin结尾的文件 
find / -name \*.rpm -exec chmod 755 '{}' \ //查找以.rpm结尾的文件并定义其权限 
find / -xdev -name \*.rpm  //查找所有以.rpm结尾的文件
```

**wc统计文本中行数、字数、字符数**
```
wc gitcommit.sh  //3   13  73 gitcommit.sh
```

**grep在文本文件中查找某个字符串**
```
grep Aug /var/log/messages  //在文件 '/var/log/messages'中查找关键词"Aug" 
grep ^Aug /var/log/messages  //在文件 '/var/log/messages'中查找以"Aug"开始的词汇 
grep [0-9] /var/log/messages //选择 '/var/log/messages' 文件中所有包含数字的行 
grep Aug -R /var/log/*  //在目录 '/var/log' 及随后的目录中搜索字符串"Aug" 
```

**tree树形结构显示目录，需要安装tree包**
```
tree  //显示文件和目录由根目录开始的树形结构 
```

**pwd显示当前目录**
```
pwd 显示当前路径
```

**ln创建链接文件**
```
ln -s file1 lnk1  //创建一个指向文件或目录的软链接 
ln file1 lnk1  //创建一个指向文件或目录的物理链接 
```

**more、less  分页显示文本文件内容**
```
more file1  //查看一个长文件的内容 
less file1  //类似于 'more' 命令，但是它允许在文件中和正向操作一样的反向操作 
```

**head、tail**
```
head -2 file1 //查看一个文件的前两行 
tail -2 file1 //查看一个文件的最后两行 
tail -f /var/log/messages //实时查看被添加到一个文件中的内容 
```


## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/linux/system.md'>linux基础系列之-系统管理系列</a>

## linux基础命令系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/linux/index.md'>linux基础命令系列</a>






