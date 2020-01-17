# 安装 #
+ npm install -g vue
  
  >全局安装vue
  
+ npm install -g vue-cli
  
  >全局安装vue-cli

+ 3.0安装`npm install -g @vue/cli`

+ 3.0安装需要单独安装`安装工具`

  > npm install -g @vue/cli-init

---------------------------
# 3.0 安装+创建

* `npm install -g vue-cli`

* `npm install -g @vue/cli`

* 如果需要旧版本init功能:

  ```
  npm install -g @vue/cli-init
  vue init webpack my-project
  ```

* `vue create hello-world`-出现选项:默认模板(default),手动(Manually),上次存储的模板

  * 配置:看个人项目需求, **注意，空格键是选中与取消，A键是全选**

    * babel

      TypeScript 支持使用 TypeScript 书写源码
       Progressive Web App (PWA) Support PWA 支持。
       Router 支持 vue-router 。
       Vuex 支持 vuex 。
       CSS Pre-processors 支持 CSS 预处理器。
       Linter / Formatter 支持代码风格检查和格式化。
       Unit Testing 支持单元测试。
       E2E Testing 支持 E2E 测试。

  * `pick a css pre-processor`-选择css预处理器

  * `pick a linter / formatter config`-最熟悉的就是最后一个`ESLint + Prettier`

  * `pick additional lint feature:`-语法检查方式:第一个是保存后,第二个是fix和commit的时候

  * `pick a unit testing solution` -单元测试,我一般不选, 要选的话选Mocha+chai啊,网上看到选的这个

  * `where do you prefer placing config for Babel,PostCSS,PostCSS, ESlint, etc,?` -配置文件存放地方,第一个是独立文件夹位置,第二个是在package.json文件里,我选的是第二个,

  * `save this as a preset for future projects` - 询问是否记录这一次的配置,以便下次使用

  * 回车确认等待下载

* `vue ui`打开可视化界面

# 项目准备

+ vue init webpack name
  > 创建一个基于webpack模板且名字为name的新项目。
	注意：你可以在你想要放文件的位置调出命令行，并写这行代码。
+ cd name
  
  > 进入到创建好的name文件夹内
+ 安装依赖
	-npm install
	  > 可以用cnpm
	-npm run dev
	  > 把地址复制进浏览器就好
--------------------------------------------

# 网页的文件要放在src文件夹中
# 运行项目就是 npm run dev,并且要注意，命令行窗口不能关

# 下载webpack（手动配置自己webpack，webpack+vue-loader）
在你想要的位置
`(c)npm install webpack webpack-dev-server`
这其实是两条命命令下载两个东西。这么写就直接两个都下在了