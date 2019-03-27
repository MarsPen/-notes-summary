## linux基础系列之-常见指令

## 常用指令

**ls显示文件或目录**
ls -F 显示文件或目录<br/>
ls -l 列出文件详细信息l(list)<br/>
ls -a 列出当前目录下所有文件及目录，包括隐藏的a(all)<br/>

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
cp temp temp1  //复制temp文件
cp temp/* .  //复制temp目录下的所有文件到当前工作目录 
cp -a /temp/dir1 . //复制/temp/dir1目录到当前工作目录 
cp -a temp temp1 //复制temp目录 
```

**mv移动或重命名**
```
```

**rm删除文件**
```
```

**find在文件系统中搜索某文件**
```
```

**wc统计文本中行数、字数、字符数**
```
```

**grep在文本文件中查找某个字符串**
```
```

**rmdir删除空目录**
```
```

**tree树形结构显示目录，需要安装tree包**
```
```

**pwd显示当前目录**
```
```

**ln创建链接文件**
```
```

**more、less  分页显示文本文件内容**
```
```

**head、tail**
```
```

**ctrl+alt+F1  命令行全屏模式**









