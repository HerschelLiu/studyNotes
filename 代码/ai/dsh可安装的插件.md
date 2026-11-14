# dsh可安装的插件

## 界面与日常效率

1. dsh-market（dsh-market/dsh-market）

先装一个插件市场，再谈装别的插件。它直接出现在设置页里，可以搜索、安装、更新和卸载社区插件，还会提示构建脚本和安装来源。面对几百上千个仓库，这类插件反而是最实用的入口。

2. [dsh-web-ui](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=dsh-web-ui&zhida_source=entity)（zhu1090093659/dsh-web-ui）（皮肤太花花，不知道怎么关，其他的也还用不上）

目前比较有代表性的 Web UI 全家桶。皮肤只是最显眼的一层，里面还有任务看板、[Git](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=Git&zhida_source=entity) 图谱、文件面板、手机远程、[SSH](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=SSH&zhida_source=entity)、Token 统计和一批独立模块。适合想一次性把 Web 端补全的人。

3. dsh-better-sidebar（omdsh-dev/DSH-better-sidebar）

把 DSH 变成更像 VS Code 的工作台：文件树、CodeMirror 编辑器、图片/Markdown/HTML/PDF/Office 预览、真实终端、Git 面板和后台任务都塞进右侧栏与底部面板。功能很重，但也是“装一个顶一组”的类型。

4. dsh-at-file（omdsh-dev/dsh-at-file）（有问题，不兼容）:web使用；在输入框里键入 @ 就能搜索当前工作区文件和目录，再把路径引用进任务。习惯 Codex、[Cursor](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=Cursor&zhida_source=entity) 或 [Claude Code](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=Claude+Code&zhida_source=entity) 的人会立刻明白它为什么好用。它很窄，却属于每天都能用到的效率插件。

5. [dsh-cc-tui](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=dsh-cc-tui&zhida_source=entity)（ccch1mneyyy/dsh-TUI）（不兼容，版本低）

喜欢终端就看这个。它把流式输出、工具卡片、文件引用、会话恢复、模型切换、审批交互和上下文状态放进全屏 TUI。它是另一套前端，不是给 Web UI 换个皮肤，所以两边选一个主力即可。

6. [dsh-git-graph](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=dsh-git-graph&zhida_source=entity)（WhitePlusMS/dsh-git-graph）：在 Chat 和 [Trajectory](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=Trajectory&zhida_source=entity) 旁边增加只读 Git 图谱，能看分支、标签、HEAD、工作区状态和提交关系。它不做 merge、rebase、push 之类的写操作，所以很适合只想快速检查仓库历史的人。

## 代码审查、回退与权限

1. dsh-change-review（cirelir/dsh-change-review）

   最推荐的编码插件之一。它追踪会话里的 write/edit，把每次修改显示成逐行 diff，还能聚合子 Agent 的改动，并支持单次修改或整文件回退。终于不用靠聊天记录猜“模型刚才到底改了什么”。

2. dsh-undo-plugin（lire1131/dsh-undo-plugin）（不兼容，版本低）

   它保护的不是项目 Git，而是 DSH 配置和用户插件代码。装插件、换皮肤、改配置时自动创建存档，支持撤销、重做和回到任意快照；即使 DSH 已经启动不了，还有离线 [PowerShell](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=PowerShell&zhida_source=entity) 工具救场。喜欢折腾插件的人很需要。

3. dsh-permissions（940842546/dsh-permissions）

   提供 hard、deny、ask、allow 四级规则，可以按全局或工作区保护 .ssh、.env、密钥文件和危险命令。它会收窄现有权限，但不会绕过 DSH 原生沙箱，适合希望比默认审批更精细的人。

4. dsh-automode（log-li/dsh-automode）

   给 DSH 增加类似 Claude Code 的 Auto 模式：明显安全的调用自动放行，命中规则或分类器判断危险的操作拦截。它和 dsh-permissions 的区别是，前者偏自动决策，后者偏显式规则；可以按自己的风险偏好选择。

5. dsh-replay（zoahdev/dsh-replay）

   这是读取 DSH 会话日志的离线调试器，不是让模型“变强”的插件。它能把一次任务的消息、推理、工具调用和结果整理成 HTML 时间线，也能比较两个会话。长任务跑偏时，用它定位从哪一步开始出问题。

6. dsh-cost-meter（Han-1413141/dsh-cost-meter）

   显示本会话、当天和历史费用，支持预算、余额、峰谷价格和不同模型的价格配置。经常切换模型、用 [Coding Plan](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=Coding+Plan&zhida_source=entity) 或跑多 Agent 的人，装完才知道有多少 Token 花在了重复试错上。

7. dsh-messager（ly6170/dsh-messager）

   任务完成、出错、需要审批或等待输入时，可以发系统通知、浏览器通知或飞书 Webhook。轻量需求也可以用 dsh-plugin-task-notification；两者不必同时装。

## 多 Agent、长任务与自动化

1. dsh-agent-teams（NanmiCoder/dsh-agent-teams）

   这是目前比较完整的多 Agent 团队插件：当前会话当队长，创建可续聊成员，拆分带依赖的任务，成员之间可以直接发消息，Web 面板还能看到成员树、任务 DAG 和实时进度。适合代码审查、竞品研究和前后端并行开发。

2. [dsh-automation](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=dsh-automation&zhida_source=entity)（titanwings/dsh-automation）

   让任务按一次、每天或每周等计划运行。每次触发都会创建新的 Agent 和 Session，保存运行历史，并明确选择只读或工作区写权限。适合定时回归检查、依赖更新、日报和仓库巡检。

3. dsh-memory（haitang1/dsh-memory）（不兼容，版本低 ）

   给不同会话提供持久记忆：保存原始记忆、每轮摘要和全局摘要，并把压缩后的记忆自动注入后续任务。适合长期维护同一项目，但要控制注入长度，避免旧经验反过来污染新任务。

4. dsh-data-agent（omdsh-dev/dsh-data-agent）

   给 DSH 增加专用 Data Agent 模式，支持 MySQL、PostgreSQL、SQLite、Oracle、[Hive](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=Hive&zhida_source=entity) 和 [Impala](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=Impala&zhida_source=entity)，让模型自己写 SQL、执行、看结果再修正。它支持 [CRUD](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=CRUD&zhida_source=entity)，适合明确授权 AI 操作数据库的场景。

5. dsh-chat-import（Nwflower/dsh-chat-import）

   可以把 Claude Code、Codex、ChatGPT、Cursor、[Gemini](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=Gemini&zhida_source=entity)、OpenCode、Kimi 等十几种会话导入 DSH，并保留工具调用和推理记录继续聊天；也支持再导出或同步回部分客户端。换工具但不想丢历史的人会很喜欢。

6. dsh-agents-plugins-bridge（openma-ai/dsh-agents-plugins）

   用于导入 Codex、Claude Code、Pi 和 Agent Plugins 格式的 Skill、[MCP](https://zhida.zhihu.com/search?content_id=795451348&content_type=Answer&match_order=1&q=MCP&zhida_source=entity) 与 Hook。它解决的是“别的 Agent 生态已经装了一堆能力，能不能迁到 DSH”，适合重度多工具用户。
