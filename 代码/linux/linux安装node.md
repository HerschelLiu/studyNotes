1. 下载nodejs的包（例：包名：node-v14.7.0-linux-x64.tar.xz）

2. 解压tar.xz。在linux下，大部分情况下不能解压tar.xz文件

   ```bash
   #将xxx.tar.xz解压成xxx.tar
   xz -d node-v14.7.0-linux-x64.tar.xz
   
   tar xvf node-v14.7.0-linux-x64.tar
   ```

3. 配置开发环境

   ```bash
   sudo vi /etc/profile #必须是管理员权限才有写的权限
   
   #增加以下内容
   #SET PATH FOR NODEJS
   export NODE_HOME=node包路径
   export PATH=$NODE_HOME/bin:$PATH
   # ESC->:wq
   
   #使用指令使环境变量生效
   source /etc/profile
   ```

   