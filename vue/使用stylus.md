1.创建完成一个初始项目后，通过 npm install stylus -D命令，在项目内安装stylus。（注意：命令结尾 -D 即是 --save-dev 的简写形式）

2.需要安装loader，通过 npm install stylus-loader css-loader style-loader --save-dev  命令。

3.找到 webpack.base.conf.js 文件，并在其中的rules中写入配置：

```json
{

  test:/\.css$/,

  loader:'style-loader!css-loader!stylus-loader'

}

```



4.在组件内部的style标签中，加入 lang="stylus" 即可。 <style lang="stylus"><style>