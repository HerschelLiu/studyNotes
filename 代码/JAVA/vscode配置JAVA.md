1. 下载jdk

2. 安装jdk，**记住安装路径**

3. 配置环境变量：

   1. 打开环境变量配置。计算机→右键属性→高级系统设置→高级→环境变量，在系统变量中配置。
   2. 配置JAVA_HOME。新建，变量名JAVA_HOME，变量值，jdk路径，填上刚才的安装路径，比如`C:\Program Files\Java\jdk1.8.0_121`，保存。
   3. 配置CLASSPATH。新建变量名CLASSPATH，变量值填 `.;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;`（**第一个分号前前面有一个点**)
   4. 配置Path。设置Path变量，加入`%JAVA_HOME%\bin`
   5. 安装验证，打开windows的cmd工具（这个要是不知道，真得先补补基础了），在cmd窗口中输入`java -version` 回车， 如果正常显示java版本，证明安装正确。如果没有正常显示版本，说明安装有问题或者设置环境变量有问题，请重新看一遍本文的安装步骤，一步一步跟着操作。
   
4. 下载[Maven ](http://maven.apache.org/download.cgi)：是专门用于构建和管理Java相关项目的工具。

   1. Link下点击下载，windows系统下载bin.zip包(Binary zip archive)，linux或者mac 下载.bin.tar.gz结尾的文件(Binary tar.gz archive)。
   2. 将下载下来的maven zip文件包进行解压，解压的目录随意
   3. 配置环境变量
      1. 分别添加 MAVEN_HOME到 Windows 环境变量，并将其指向你的 Maven 文件夹（比如你解压到D:\apache\maven\apache-maven-3.3.9）。
      2. 编辑环境变量Path，追加`%MAVEN_HOME%\bin`
      3. 在windows的cmd窗口下，运行“mvn -version”, 如果正常显示版本信息，说明安装正确。

5. 安装vscode插件：

   * **Java Extension Pack**：安装这一个就行，它包括以下在内的6个插件

   * Language Support for Java(TM) by Red Hat：Java运行支持
   * Debugger for Java： Java调试，不调试的话可以不装
   * Java Test Runner：运行单元测试需要的插件
   * Maven for Java： Maven支持插件