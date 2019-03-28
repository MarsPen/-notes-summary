## Linux备份操作<br/>

**tar**
```
tar -cvf log.tar log2012.log    仅打包，不压缩！ 

tar -zcvf log.tar.gz log2012.log   打包后，以 gzip 压缩 

tar -jcvf log.tar.bz2 log2012.log  打包后，以 bzip2 压缩 

tar -zxvf /opt/soft/test/log.tar.gz 解压缩
```

**dump**
```
dump -0aj -f /tmp/home0.bak /home  制作一个 '/home' 目录的完整备份

dump -1aj -f /tmp/home0.bak /home  制作一个 '/home' 目录的交互式备份
```

**restore**
```
restore -if /tmp/home0.bak  还原备份
```

**rsync**
```
rsync -rogpav --delete /home /tmp  同步两边的目录 

rsync -rogpav -e ssh --delete /home ip_address:/tmp  通过SSH通道rsync 

rsync -az -e ssh --delete ip_addr:/home/public /home/local  通过ssh和压缩将一个远程目录同步到本地目录 

rsync -az -e ssh --delete /home/local ip_addr:/home/public  通过ssh和压缩将本地目录同步到远程目录 
```


## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/linux/shutdown.md'>linux基础系列之-关机重启</a>

## linux基础命令系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/linux/index.md'>linux基础命令系列</a>


