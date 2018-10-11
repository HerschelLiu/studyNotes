## 多github帐号的SSH key切换

我有两个github帐号，一个是个人所用，一个是为公司项目所用。如果是单用户(single-user)，很方便，默认拿id_rsa与你的github服务器的公钥对比；如果是多用户（multi-user）如user1,user2,那么就不能用在user2的身上了，这个时候就要配置一下了：

**1、新建user2的SSH Key**

```
#新建SSH key：
$ cd ~/.ssh     # 切换到C:\Users\Administrator\.ssh
ssh-keygen -t rsa -C "mywork@email.com"  # 新建工作的SSH key
# 设置名称为id_rsa_work
Enter file in which to save the key (/c/Users/Administrator/.ssh/id_rsa): id_rsa_work
```

**2、新密钥添加到SSH agent中**

因为默认只读取id_rsa，为了让SSH识别新的私钥，需将其添加到SSH agent中：

```
ssh-add ~/.ssh/id_rsa_work
```

如果出现Could not open a connection to your authentication agent的错误，就试着用以下命令：

```
ssh-agent bash
ssh-add ~/.ssh/id_rsa_work
```

**3、修改config文件**
在~/.ssh目录下找到config文件，如果没有就创建：

```
touch config        # 创建config
```

然后修改如下：
我的config配置如下：

```
# 该文件用于配置私钥对应的服务器
# Default github user(first@mail.com)
Host github.com
 HostName github.com
 User git
 IdentityFile C:/Users/Administrator/.ssh/id_rsa

 # second user(second@mail.com)
 # 建一个github别名，新建的帐号使用这个别名做克隆和更新
Host github2
 HostName github.com
 User git
 IdentityFile C:/Users/Administrator/.ssh/id_rsa_work
```

如果存在的话，其实就是往这个config中添加一个Host：

```
#建一个github别名，新建的帐号使用这个别名做克隆和更新
Host github2
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa2
```

我自己配置好的的文件：

```
//这是默认的
#Default GitHub
Host github.com
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa
// 这是新创建的
Host github-my
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa_my
```





其规则就是：从上至下读取config的内容，在每个Host下寻找对应的私钥。这里将GitHub [SSH仓库地址中的git@github.com替换成新建的Host别名如](mailto:SSH%E4%BB%93%E5%BA%93%E5%9C%B0%E5%9D%80%E4%B8%AD%E7%9A%84git@github.com%E6%9B%BF%E6%8D%A2%E6%88%90%E6%96%B0%E5%BB%BA%E7%9A%84Host%E5%88%AB%E5%90%8D%E5%A6%82)：github2，那么原地址是：[git@github.com](mailto:git@github.com):funpeng/Mywork.git，替换后应该是：github2:funpeng/Mywork.git.

**4、打开新生成的~/.ssh/id_rsa2.pub文件，将里面的内容添加到GitHub后台。**

可不要忘了添加到你的另一个github帐号下的SSH Key中。

**5、测试：**

```
Administrator@FANGPENG /e/work
$ ssh -T git@github.com
Hi BeginMan! You've successfully authenticated, but GitHub does not provide shel
l access.

Administrator@FANGPENG /e/work
$ ssh -T github2
Hi funpeng! You've successfully authenticated, but GitHub does not provide shell
 access.
```

**6、应用**

测试成功，[那么我尝试在我的work目录下克隆我@126.com账号下的远程仓库](mailto:%E9%82%A3%E4%B9%88%E6%88%91%E5%B0%9D%E8%AF%95%E5%9C%A8%E6%88%91%E7%9A%84work%E7%9B%AE%E5%BD%95%E4%B8%8B%E5%85%8B%E9%9A%86%E6%88%91@126.com%E8%B4%A6%E5%8F%B7%E4%B8%8B%E7%9A%84%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93)。如下：

```
Administrator@FANGPENG /e/work
$ git clone github2:funpeng/Mywork.git
Cloning into 'Mywork'...
remote: Counting objects: 3, done.
remote: Total 3 (delta 0), reused 0 (delta 0)
Receiving objects: 100% (3/3), done.
Checking connectivity... done
```

克隆成功，大功告成了！