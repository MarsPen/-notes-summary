## Linux用户及用户组管理<br/>

**查看存储用户账号**
```
cat /etc/passwd

输出的结构
用户名:口令:用户标识号:组标识号:注释性描述:主目录:登录Shell
```

**查看存储组账号**
```
cat /etc/group  
```

**查看存储用户账号的密码**
```
cat /etc/shadow   

输出结构
登录名:加密口令:最后一次修改时间:最小时间间隔:最大时间间隔:警告时间:不活动时间:失效时间:标志
```
  
**查看存储用户组账号的密码**
```
cat /etc/gshadow  
```


**建立用户帐号**
```
参数
-c comment 指定一段注释性描述。
-d 目录 指定用户主目录，如果此目录不存在，则同时使用-m选项，可以创建主目录。
-g 用户组 指定用户所属的用户组。
-G 用户组，用户组 指定用户所属的附加组。
-s Shell文件 指定用户的登录Shell。
-u 用户号 指定用户的用户号，如果同时有-o选项，则可以重复使用其他用户的标识号。

useradd renbo  添加一般用户

useradd -g root renbo  为添加用户指定用户组

useradd -r renbo  创建系统用户

useradd -d /home renbo  为新添加的用户指定home目录

useradd caojh -u 544  建立用户且制定ID
```

**删除用户帐号**
```
userdel  同建立账号用法相同 

```
 **新建组**
 ```
groupadd 组名
 ```

**删除组**
```
groupdel 组名
```

**修改账号**
```
usermod 选项 用户名和useradd用法相同
```

**用户口令管理给root设置密码(用户账号刚创建时没有口令，但是被系统锁定，无法使用，必须为其指定口令后才可以使用，即使是指定空口令)**
```
passwd root 

-l 锁定口令，即禁用账号。
-u 口令解锁。
-d 使账号无口令。
-f 强迫用户下次登录时修改口令。
```

**切换用户**
```
su root 

su - root   切换到root用户改变环境变量

su user   切换用户，加载配置文件.bashrc

su - user 切换用户，加载配置文件/etc/profile ，加载bash_profile
```


**系统环境变量文件**
```
cat /etc/profile 查看

vim /etc/profile 编辑
```

**用户环境变量文件**
```
cat /etc/bash_profile 查看

vim /etc/bash_profile 编辑

cat .bashrc
```


**更改文件的用户及用户组**
```
sudo chown [-R] owner[:group] {File|Directory}

例如：还以jdk-7u21-linux-i586.tar.gz为例。属于用户hadoop，组hadoop

```

**切换此文件所属的用户及组。可以使用命令。**
```
sudo chown root:root jdk-7u21-linux-i586.tar.gz
```




## 下一篇文章
<a href='https://github.com/MarsPen/-notes-summary/blob/master/linux/fileauth.md'>linux基础系列之-文件权限管理</a>

## linux基础命令系列目录
<a href='https://github.com/MarsPen/-notes-summary/blob/master/linux/index.md'>linux基础命令系列</a>







