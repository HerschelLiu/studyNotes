## 命令行

1. `vue create -p dcloudio/uni-preset-vue 项目名`
2. 选择`默认模板（Typescript）`
3. 安装`vue-class-component`和`vue-property-decorator`
4. 安装stylus`npm i stylus stylus-loader@3.0.2`

初始写法

```js
<script lang="ts">
    import Vue from 'vue';
	export default Vue.extend({
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	});
</script>
```



### [运行、发布uni-app](https://uniapp.dcloud.io/quickstart-cli?id=运行、发布uni-app)

```shell
npm run dev:%PLATFORM%
npm run build:%PLATFORM%
```

`%PLATFORM%` 可取值如下：

| 值                      | 平台                                                         |
| ----------------------- | ------------------------------------------------------------ |
| app-plus                | app平台生成打包资源（支持npm run build:app-plus，可用于持续集成。不支持run，运行调试仍需在HBuilderX中操作） |
| h5                      | H5                                                           |
| mp-alipay               | 支付宝小程序                                                 |
| mp-baidu                | 百度小程序                                                   |
| mp-weixin               | 微信小程序                                                   |
| mp-toutiao              | 字节跳动小程序                                               |
| mp-qq                   | qq 小程序                                                    |
| mp-360                  | 360 小程序                                                   |
| quickapp-webview        | 快应用(webview)                                              |
| quickapp-webview-union  | 快应用联盟                                                   |
| quickapp-webview-huawei | 快应用华为                                                   |

### 问题

#### TypeError: this.getOptions is not a function (安装stylus)

原因是`stylus-loader`版本过高

解决：

1. `npm uninstall stylus-loader`
2. 安装3.0.2：`npm instal stylus-loader@3.0.2`

#### 添加其他声明文件

这里需要注意的是，这种方式创建的 ts 项目只会包含 uni-app 本身的 @types 声明，如果你想直接使用 wx 或其他小程序的 api 的话就需要自行添加，以微信小程序为例：

```bash
npm i @types/weixin-app
```

然后在`tsconfig.json`中添加该声明后重启 vscode 即可：

```cpp
...
"types": [
      "webpack-env",
      // 添加 weixin 的声明
      "weixin-app",
      "@dcloudio/types/uni-app"
]
...
```

#### 解决未找到 sitemap

在 dist/dev/mp-weixin 目录下新建名为 sitemap.json 的文件。然后填写如下内容就可以了，这个文件新建后除非直接删除 dist 文件夹，不然后续的代码更新不会影响到这个文件：

```json
{
    "rules": [{
        "action": "allow",
        "page": "*"
    }]
}
```