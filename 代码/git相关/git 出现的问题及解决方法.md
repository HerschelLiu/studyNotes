### Please enter a commit message to explain why this merge is necessary.
翻译：请输入提交消息来解释为什么这种合并是必要的

git 在pull或者合并分支的时候有时会遇到这个界面。可以不管(直接下面3,4步)，如果要输入解释的话就需要:

1. 按键盘字母 i 进入insert模式

2. 修改最上面那行黄色合并信息,可以不修改

3. 按键盘左上角"Esc"

4. 输入":wq",注意是冒号+wq,按回车键即可

### HTTP Basic: Access denied

```
git clone 项目失败，报下面的错误信息：
$ git clone xxx
Cloning into 'appEnterprise'...
remote: HTTP Basic: Access denied
fatal: Authentication failed for ...
```

因为之前输入错误的gitlab用户名和密码，第二次clone不弹框提示输入用户名和密码的解决方案。

打开凭据管理器 - Windows凭据，找到对应的凭据，删除掉，重新clone，就会弹框
提示用户名和密码。