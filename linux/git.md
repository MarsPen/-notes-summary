## 在mac中配置多个github账号ssh密钥
## 概述
很多时候我们本地生成的只有一个自己的ssh，但是多个ssh配置的场景也是蛮多的，所以想要commit，push等操作需要配置私钥ssh或者http，才能连接远程git仓库

## 步骤
- 我们假设原来在~/.ssh目录下已经生成了一对密钥,此密钥文件名字是默认生成
  ```
  id_rsa
  id_rsa.pub
  ```
- 生成第二个ssh key
  ```
  ssh-keygen -t rsa -C "yourmail@gmail.com"
  ```
  这里面不要一路回车，第一步需要我们手动填写保存文件的名字和路径
  ```
  Generating public/private rsa key pair.
  Enter file in which to save the key (/Users/renbo/.ssh/id_rsa): /Users/renbo/.ssh/id_rsa_github
  <剩下两个直接回车>
  ```
  这里我们用id_rsa_github来区别原有密钥对，避免被覆盖。
  完成之后，我们可以看到~/.ssh目录下多了两个文件，变成：
  ```
  id_rsa
  id_ras.pub
  id_rsa_github
  id_rsa_github.pub
  known_hosts
  ```
- 打开ssh-agent(关于ssh-agent后续介绍)
  这里如果你用的github官方的bash，用：
  ```
  ssh-agent -s
  ```
  如果是其他的，比如msysgit，用：
  ```
  eval $(ssh-agent -s)
  ```
  略过这一步的话，下一步会提示这样的错误：Could not open a connection to your authentication agent.
  
- 添加私钥

  ```
  ssh-add ~/.ssh/id_rsa
  ssh-add ~/.ssh/id_rsa_github
  ```
- 创建config文件
  在~/.ssh目录下创建名为config的文件。mkdir config
  
  打开文件sudo vim config添加一下内容：
  ```
  # gitlab
    Host gitlab.com
    HostName gitlab.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa_gitlab

  # github
    Host github.com
    HostName github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa_github
  ```
  其中，Host和HostName填写git服务器的域名。
  IdentityFile指定私钥的路径。
  如果在Linux系统下提示错误：Bad owner or permissions on /home/gary/.ssh/config
  说明config权限过大，chmod命令调整：
  ```
  chmod 644 ~/.ssh/config
  ```
  然后在github和gitlab上添加公钥即可。githua 在右上角的头像的设置中
- 测试
  然后用ssh命令分别测试：
  ```
  ssh -T git@github.com
  ```
- 调试
  如果到这里你没有成功的话，别急，教你解决问题的终极办法--debug
  比如测试github：
  ```
  ssh -vT git@github.com
  ```
  -v 是输出编译信息，然后根据编译信息自己去解决问题吧。
- 关于https用户名
  如果之前有设置全局用户名和邮箱的话，需要unset一下
  ```
  git config --global --unset user.name
  git config --global --unset user.email
  ```
  然后在不同的仓库下设置局部的用户名和邮箱
  比如在公司的repository下
  ```
  git config user.name "yourname" 
  git config user.email "youremail"
  ```
  在自己的github的仓库在执行刚刚的命令一遍即可。
  这样就可以在不同的仓库，已不同的账号登录。





