# Hooks 分类索引

按「能否脱离框架使用」优先分类，其次按框架/生态分。判断标准：

1. **跨框架（纯 JS）**：只依赖原生 JS/DOM/浏览器 API 或通用库（axios、jsencrypt、clipboard 等），不 import `vue` / `react`，可直接复制到任何项目。
2. **Vue 专用**：import `vue`、`vue-router`、`@vueuse/core` 等，依赖响应式或生命周期。
3. **配合 ElementPlus**：核心逻辑就是调用 EP 的组件/类型（`ElMessage`、`FormItemRule`、`UploadUserFile`…），脱离 EP 无法运行。
4. **小程序 / uniapp**：依赖 `wx.*`、`uni.*`。
5. **React**：当前目录下没有 React hook（0 个文件），如需新增建议建 `React/`。

> 注意：不少文件是「一份文档多端实现」（`## VUE` + `## 微信小程序` + `## uniapp`）。归类时按**主实现**放，多端片段在文件内有小标题，见下方 ⚠️ 标记。

## 目录结构

```
hooks/
├── 跨框架（纯JS）/          # 无框架依赖，可直接复用
├── 只用于vue/               # Vue 专用
│   ├── 配合 ElementPlus/    # EP 强耦合
│   ├── useArray/            # 数组/树工具（模块 + 文档）
│   └── vue-query/           # @tanstack/vue-query 生态
├── 只用于微信小程序/         # wx.* 原生小程序
├── uniapp/                  # uni.* 跨端
├── 插件/                    # 第三方插件（base64、农历）
├── 若依/                    # 若依框架专用
└── 参考资料/                # 非 hook 的速查表
```

## 跨框架（纯JS）

| 文件 | 说明 |
| --- | --- |
| `filterByQuery.md` | 按请求 query 过滤数组（field/fuzzy 配置），后端分页场景 |
| `useCalc.md` | 金额/数量精确计算：加减乘除、小数位、精度处理 |
| `useEnum.md` | 枚举对象转 `{key,value}` 选项、按值取枚举名 |
| `useFormat.md` | 输入框格式化：金额、纯整数、小数、千分位 |
| `useString.md` | 驼峰↔中划线、随机串、字节长度、随机密码 |
| `useValidate.md` | 类型/格式判断：日期、外链、有效值、手机号… |
| `useUtils.md` | 业务小工具：富文本取图、数字转中文、sleep、可控定时器 |
| `useSecret.md` | RSA 加解密（jsencrypt） |
| `防抖与节流.md` | debounce / throttle（Map 缓存 timer） |
| `根据手机加速计计算步数的js.md` | H5 加速度计计步算法 |
| `useDownload.md` ⚠️ | 浏览器下载（Blob/直链/objectURL 释放）+ `## 微信小程序` 段 |
| `useStyle.md` ⚠️ | 对象转内联样式字符串、单位补全 + 小程序 `rpxToPx` |
| `log.md` ⚠️ | 带样式的 console 美化（Vite `import.meta.env` 判断） |
| `useLog.md` ⚠️ | 带样式打印 + `## 微信小程序` 日志上报段 |
| `utils.md` | 浏览器/DOM 片段：点击空白关闭、手机号格式化、监听返回、全局回车 |

> `useArray/` 主体是纯函数，但 `useMergeArrayByKey`、`useUniqueByKey` 用了 Vue 的 `MaybeRefOrGetter` + `toValue`（为了同时接受纯值和 ref），整包编译/运行依赖 Vue，所以归到 `只用于vue/useArray/`，不放在这里。

## 只用于vue

| 文件 | 说明 |
| --- | --- |
| `useArgs.md` ⚠️ | URL query ↔ 响应式参数（类型转换/校验），提示依赖 `useTip` + `## 微信小程序` 段 |
| `useDate.md` | 日期获取/格式化/时间戳校准；**依赖 `useStorage`，因此算 Vue 侧** |
| `useFilter.md` | 展示层过滤器：金额、折扣、日期、默认头像；依赖 useDate/useValidate |
| `useFormatValue.md` | 统一值格式化：boolean/date/enum/dict，支持 `MaybeRef` |
| `useObject.md` | 对象工具：纯 JS 深拷贝/空值清理 + Vue 响应式合并/取值（`useAssign`/`useValue`/`useReactive`） |
| `useModal.md` | 多弹窗显隐状态管理 |
| `usePermission.md` | 路由/按钮权限判断（vue-router） |
| `useEcharts.md` | ECharts 实例 + 生命周期 + tooltip 响应式修复 |
| `useCalcHeight.md` | 自适应高度（rAF + ResizeObserver），含 vueUse 版/原生版 |
| `useStorage.md` ⚠️ | localStorage 响应式封装（ref/watch + base64）+ `## 微信小程序` 段 |
| `useList通用.md` ⚠️ | 列表/分页/查询状态，含 vue-query、`## vue3uniapp`、`## 小程序` 三个版本 |
| `useRequest.md` | axios 实例 + 拦截器 + 统一提示（间接依赖 `useTip`） |
| `useClipboard.md` | clipboard.js 复制（提示依赖 `useTip`） |
| `useIcon.md` | vite-plugin-svg-icons + `SvgIcon` 组件，默认挂载 EP 图标目录 |
| `useMitt.md` | mitt 全局事件总线（单例） |
| `useModelValue.md` | v-model 双向绑定（vue3.3 新增 `defineModel` 前的写法） |
| `useRouteInit.md` | keepAlive 下 `onActivated` / `onMounted` 初始化 |
| `useHotUpdate.md` | 打包后轮询 HTML 检测版本更新并提示刷新（依赖 useTip/useDate） |
| `useLargeScreen.md` | 大屏等比缩放 |
| `useState.md` | ref 版状态：`setState`、readonly、watch 回调 |
| `改名useTempRefs.md` | 常用组件 ref 集合（`ELTable`/`ELForm`…） |
| `useElementVisible.md` ⚠️ | **纯 DOM**（getBoundingClientRect + computedStyle），可移到跨框架 |
| `useWatchElement.md` ⚠️ | **纯 DOM**（MutationObserver 监听元素挂载/移除），可移到跨框架 |
| `useScrollTo.md` ⚠️ | **纯 DOM**（requestAnimationFrame 平滑滚动），可移到跨框架 |

### useArray（数组/树模块）

`useArray/useArray.md` 是使用文档，`useArray/useArray/` 是实现，`index.ts` 统一导出 7 个：

| 实现 | 说明 |
| --- | --- |
| `useCartesianArray.ts` | 笛卡尔积 |
| `useFindNode.ts` | 查找节点 |
| `useFindNodeWithParent.ts` | 查节点 + 父级信息 |
| `useMapTree.ts` | 树结构映射 |
| `useMergeArrayByKey.ts` ⚠️ | 按 key 去重合并（编辑/新建场景），入参用 Vue `MaybeRefOrGetter` |
| `useTreeNormalize.ts` | 层级异字段归一树 |
| `useUniqueByKey.ts` ⚠️ | 按 key 去重，入参用 Vue `MaybeRefOrGetter` |

> 只有两个 ⚠️ 文件 import 了 `vue`（为同时接受纯值和 ref），其余是纯函数。若想让它彻底跨框架，把这两个的入参改成普通值即可。

### vue-query（@tanstack/vue-query）

| 文件 | 说明 |
| --- | --- |
| `queryKeys统一管理.md` | queryKeys 的组织方式 |
| `useListQuery（已有新useList文件，仅做保留及查看）.md` | 旧版列表查询，仅保留查阅 |
| `useSubmit.md` | `useMutation` 提交与 loading 状态 |
| `useTansQuery.md` | queryClient 配置、缓存联动 |
| `处理queryKeys文件脚本.md` | 批量生成/处理 queryKeys 的脚本 |
| `列表表格中，同一接口不同数据源.md` | 同一接口多数据源处理 |
| `全局联动list↔tree模块.md` | list ↔ tree 联动模块 |

> `useList通用.md` 已是列表主实现，`useListQuery` 仅保留查阅。

### 配合 ElementPlus

| 文件 | 说明 |
| --- | --- |
| `useTip.md` | **基础依赖**：`ElMessage` / `ElMessageBox` / `ElLoading` 统一封装 |
| `useRules.md` | 表单校验规则：基于 `FormItemRule`（async-validator），支持 `MaybeRef` 动态 required |
| `useState.md` | 页面状态：busy/loading/request/handleCancel，依赖 EP Loading |
| `useFormAttachment静态附件管理(非通用).md` | 表单静态附件增删改（EP Upload 类型），**含业务耦合，非通用** |
| `CommonTable/` | 通用表格组件 |
| `useDatePicker.md` / `useTimePicker.md` | 日期、时间选择器封装 |
| `useTableStyle.md` | 表格样式 |
| `表格多选和单选.md` | 表格多选/单选逻辑 |
| `useSelect选择弹窗表格/` | 弹窗选择表格 |
| `表格+表单校验/` | 表格内表单校验 |
| `表格及多选/` | 表格与多选（含 useList 原始版本） |

## 只用于微信小程序

`computed.js`（小程序计算属性）、`useBase.md`、`useData.md`、`useCanvas.md`（canvas 节点获取 + uniapp 段）、`useElement.md`、`代理页面useProxyPage.md`、`代理自定义组件useProxyComponent.md`。

## uniapp

`settings.md`（全局配置/样式）、`useCommon.md`（上传）、`useHeader.md`（自定义导航栏）、`useImage.md`（图片信息/下载/保存相册）、`useRouter.md`（页面栈）。

## 插件 / 若依

- `插件/base64/`：base64 编解码（js + d.ts）。
- `插件/1900 年至 2100 年公历、农历互转/`：`solarlunar.min.js` 农历转换。
- `若依/useRouter.md`：若依框架动态路由处理。
- `若依` 属框架专用，`插件` 属第三方代码，都不算 hook，单列保留。

## 参考资料

`常用正则表达式.md`、`常用URLScheme.md`（App URL Scheme 速查）。非 hook，纯速查。

## 依赖关系（放错目录会被牵连）

```
useTip（EP）  ← useClipboard / useRequest / useArgs / useHotUpdate / useState(EP)
useStorage（Vue） ← useDate ← useFilter（展示过滤器）
useDate ← useHotUpdate（useTimeStamp）
useValidate（纯JS） ← useDate / useFilter / useFormatValue / useRules / useState(Vue) / useObject / useArray
useEnum（纯JS） ← useFormatValue
useString（纯JS） ← useStyle / useTip
```

`useDateFormat` 定义在 `useDate`，被 `useFilter` 引用。

## 容易混淆 / 建议后续整理

- `useState.md` 有**两份**：`只用于vue/useState.md`（ref + setState）、`只用于vue/配合 ElementPlus/useState.md`（页面 busy/loading/request）。建议重命名，如 `useRefState` / `usePageState`。
- `log.md` 与 `useLog.md`：前者纯浏览器美化打印，后者多端（含小程序上报 + template 调试）。可合并为一份「多端日志」。
- `useUtils.md` 与 `utils.md`：前者是业务工具函数，后者是 DOM/浏览器片段速查，命名太像，建议 `utils.md` → `domSnippets.md`。
- `useArray` 与 `useList通用` 都涉及数组/树，但前者纯函数、后者是查询状态，边界清晰，保持分开。
- `useElementVisible` / `useWatchElement` / `useScrollTo` 是纯 DOM，放在 `只用于vue` 里只是因为「只在 Vue 项目用过」；若想严格按能力分，可移入 `跨框架（纯JS）`。
- 多端文件（⚠️）建议后续拆成 `xxx.vue.md` / `xxx.wx.md`，或至少在文首加「适用端」标签。

## 新增约定

- 先判断能否脱离框架：能 → `跨框架（纯JS）`；否则按框架放进对应目录。
- EP 强耦合才进 `配合 ElementPlus`，只是「用了 EP 的提示/图标」的放 Vue 目录并在文首注明依赖。
- 一个文件包含多端实现时，按主实现归类，并在本索引标 ⚠️。
