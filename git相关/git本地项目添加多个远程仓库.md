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

**注意**: 添加第二种地址时候,必须先有这个名字的地址,比如

```
// 有一个名叫github的地址
git remote -v
github  github-my:FishSay/studyNotes.git

// 增加同步push的第二个地址
git remote set-url --add origin git@gitee.com:FishSay/studyNotes.git

// 此时会报错fatal: No such remote 'gitee2'
```

一般情况下第一个地址都是叫origin,所以如下

```
// 有一个名叫origin的地址
git remote -v
origin  github-my:FishSay/studyNotes.git

// 增加同步push的第二个地址
git remote set-url --add origin git@gitee.com:FishSay/studyNotes.git
```

保证两个仓库内的内容是一样的,否则会失败,或者第二个仓库为空(没尝试)



#### 第二台电脑git pull报错

在一台电脑上设置完第一种以及第二种方法后，在另一台电脑git pull会报错`ssh: Could not resolve hostname github.com: Name or service not known`，猜测是因为加入了第一种方法，有别名。解决就是第二台电脑也添加相同的remote