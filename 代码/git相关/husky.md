# [husky]([Husky - Git hooks (typicode.github.io)](https://typicode.github.io/husky/#/))

## 使用的工具

**husky**：Git hooks 工具

- 对git执行的一些命令，通过对应的hooks钩子触发，执行自定义的脚本程序

**lint-staged**：检测文件插件

- 只检测git add . 中暂存区的文件，对过滤出的文件执行脚本

## 安装

```bash
npm install -D husky lint-staged
```

## 使用

**启用Git钩子**

```shell
npx husky install
```

在packgae.json中添加prepare脚本.要想在安装后自动启用 Git 钩子，请编辑 package.json

```bash
npm set-script prepare "husky install"
```

会在package.json生成如下代码，没有就手动加

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "src/**/*.{wxml,ts,json,js,vue,...}": [
      "eslint --fix"
    ]
  }
}
```

prepare脚本会在`npm install`（不带参数）之后自动执行。也就是说当我们执行npm install安装完项目依赖后会执行 `husky install`命令，该命令会创建.husky/目录并指定该目录为git hooks所在的目录。

**添加git hooks，运行一下命令创建git hooks**

```bash
npx husky add .husky/pre-commit "npm test"
```

运行完该命令后我们会看到.husky/目录下新增了一个名为pre-commit的shell脚本。也就是说在在执行git commit命令时会先执行pre-commit这个脚本。pre-commit脚本内容如下：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
   
npm run  test
```

可以看到该脚本的功能就是执行npm run test这个命令

### 需要注意的点

在项目中我们会使用commit-msg这个git hook来校验我们commit时添加的备注信息是否符合规范。在以前的我们通常是这样配置：

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -e $HUSKY_GIT_PARAMS" // 校验commit时添加的备注信息是否符合我们要求的规范
    }
  }
}
```

在新版husky中`$HUSKY_GIT_PARAMS`这个变量不再使用了，取而代之的是$1。在新版husky中我们的commit-msg脚本内容如下：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

#--no-install 参数表示强制npx使用项目中node_modules目录中的commitlint包
npx --no-install commitlint --edit $1
```

这个脚本应该也能使用类似于`npx husk add .husky/commit-msg "npx --no-install commitlint --edit $1"`这样的命令进行添加，但是由于本人对shell编程不熟，不知道如何将$1当成一个普通的字符串输出的文件中去，所以一直没有成功。希望有知道的大神能够告诉我一下。

感谢 

[@chuan](https://www.zhihu.com/people/79349b1cf75ea23bce01aaa2e073af1d)

 大佬的帮助，对于commit-msg hook我们可以使用以下命令来创建git hook所要执行的脚本



```bash
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"' 
```



**例子**

pre-commit文件

```
#!/bin/sh 
. "$(dirname "$0")/_/husky.sh"

npm run lint:lint-staged --allow-empty $1
```

commit-msg文件

```
#!/bin/sh 
. "$(dirname "$0")/_/husky.sh"

node --loader ts-node/esm .husky/commit.ts --edit $1

```

commit.ts

```ts
import chalk from 'chalk' // 修改控制台中字符串的样式
import * as fs from 'fs'

const msgPath = process.argv.slice(2)[1]
const msg = fs.readFileSync(msgPath, 'utf-8').trim()

const releaseRE = /^v\d/
const commitRE = /^(feat|fix|docs|style|refactor|test|chore|types)(\(.+\))?: \[.{1,10}\].{1,50}|^Merge branch|^Revert/

if (!releaseRE.test(msg) && !commitRE.test(msg)) {
  console.log()
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`invalid commit message format.`)}\n\n` +
      chalk.red(`  Proper commit message format is required for automated changelog generation. Examples:\n\n`) +
      `    ${chalk.green(`feat: [模块名称]具体的变动细节`)}\n` +
      `    ${chalk.green(`fix: [模块名称]具体的变动细节`)}\n\n`
  )
  process.exit(1)
}
```

