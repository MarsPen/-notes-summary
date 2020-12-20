---
title: Linux软件包管理
date: 2018-7-12 22:28:12
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


### dpkg 

(Debian Package)管理工具，软件包名以.deb后缀

```js
sudo dpkg -i package.deb 安装/更新 deb 包 

sudo dpkg -r package 删除 deb 包 

sudo dpkg -l 获取所有已经安装的 deb 包 

sudo dpkg -s package 获得已经安装的包的信息
```

### APT

（Advanced Packaging Tool）

```js
sudo apt-get install package 安装package包

sudo apt-get remove package 卸载package包

sudo apt-get upgrade 更新所有package包  

sudo apt-get update 更新package包                             
```    

 
### YUM 软件包升级器

```js
yum install package 下载并安装rpm包 

yum update package 更新rpm包 

yum remove package 删除rpm包 

yum list 列出当前系统中安装的所有包

yum search package 在rpm仓库中搜寻软件包 

yum clean packages 清理rpm缓存删除下载的包 

yum clean headers 删除所有头文件

yum clean all 删除所有缓存的包和头文件 
```

 
### RPM包

```js
rpm -ivh package.rpm 安装rpm包 
rpm -ivh --nodeeps package.rpm 安装rpm包而忽略依赖关系警告 
rpm -U package.rpm 更新rpm包但不改变其配置文件 
rpm -F package.rpm 更新确定已经安装的rpm包 
rpm -e package.rpm 删除rpm包 
rpm -qa 显示系统中所有已经安装的rpm包 
```

### 注意

rpm文件是Redhat支持的软件包格式，而.deb是Debian上支持软件包的扩展名

由于ubuntu是对Debian的扩展，在ubuntu下不能直接使.rpm文件的，需要将.rmp转换成.deb

解决方法

1.安装alien，执行`sudo apt-get install alien`

2.使用alien，执行`sudo alien abc.rpm`

3.执行完成后，目录下会生成一个abc.deb文件

4.安装并使用dpkg
