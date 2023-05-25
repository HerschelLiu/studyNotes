## Error: Cannot find module 'vue-template-compiler'

`npm i vue-template-compiler -g `或`yarn add vue-template-compiler -g`

## 如何切换包管理器

明确的说明了包管理器和淘宝npm镜像源会存入 ~/.vuerc 

此文件如果是windows环境，则存在了 C:/user/administrator/ 下：

打开此文件：

只需手动更改配置内容npm为yarn，即可更改创建项目时的包管理器了（亦可删除 .vuerc 文件重新运行 vue create xx 选择配置）而 .vuerc 文件是在初次使用 vue create xx 时进行提示选择配置：之后就会按照第一次选择的配置进行安装，不再重复提示选择包管理器。