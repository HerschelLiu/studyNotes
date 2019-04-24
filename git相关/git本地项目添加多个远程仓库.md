#### 第一种方式

1. 添加一个远程仓库,名字不能是origin

   ```
   // 1.github
   git remote add github git@github.com:FishSay/studyNotes.git
   
   // 2.gitee
   git remote add gitee git@gitee.com:FishSay/studyNotes.git
   ```

   

2. 拉,推

```
// 1
git pull/push github   远程分支名：本地分支名
// 2
git pull/push gitee   远程分支名：本地分支名
```

#### 第二种方式(好处是,推送时可以同时推送到另一个库)

1. 添加另一个远程仓库

```
// 现有仓库git@github.com:FishSay/studyNotes.git,添加码云仓库
git remote set-url --add origin git@gitee.com:FishSay/studyNotes.git
```

2. 正常推送

**注意**: 先用第一种方法吧,第二种成功添加了地址,但是并没有推上去gitee