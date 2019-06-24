安装系统,如果分区不是gpt分区,则不能安装

1. 如果是在安装界面,按`shift+f10`,就会启动cmd

2. 进入CMD程序后，依次输入以下命令：

   ```cmd
   1.diskpart（启动Diskpart程序）
   
   2.list disk （查看电脑中有哪些磁盘）
   
   3.select disk 0（选中磁盘0）
   
   4.clean（清除磁盘所有分区）// 不清除的话无法进行5
   
   5.convert gpt（将磁盘转换成GPT格式）
   
   6.list partition（查看当前磁盘分区情况）
   
   7.create partition efi size=100（默认大小为M）
   
   8.create partition msr size =128
   
   9.create partition primary size =102400(此处为你想设置C盘的大小)
   
   10.两次输入exit // 7 8 9 可以不用
   ```

   