## 基础

### 名词及实现

##### LLM

**Large Language Model**，中文叫“大语言模型”

你可以把它想象成一个**超级聪明的“文字接龙机器”**：你给它一句开头，它根据学过的大量资料，一个字一个字地往下猜，猜出最可能的下文。举例：你说“今天天气真”，它大概率接“好”、“不错”、“糟糕”等。它不会真正“懂”意思，但它算出来的文字组合很接近真实人类。

##### Prompt（美 [prɑːmpt] p rang —— 特）

Prompt = 你给 LLM 的**输入指令/问题**。比如“用一句话介绍 Vue3”就是一个 Prompt。

##### Token

LLM 不是按“字”读的，而是把文字切成一个个小块（可能是半个词、一个词或标点），这些小块叫 **Token**。

比如“我爱北京”可能被切成“我”、“爱”、“北京”三个 Token。

为什么要关心它？因为模型有**上下文窗口**限制（比如一次最多处理 8k token），超出就报错或丢失信息。而且 Token 也影响计费。

##### Agent 又是什么？和普通聊天机器人有什么区别？

你问聊天机器人：“帮我把深圳本周的天气整理成表格。” 它只能回答：“我做不到，因为我不能访问天气数据。”

你问 Agent 同样的话。 它会：

1. 调用一个“天气查询”工具，拿到数据。
2. 再调用一个“表格生成”工具，生成表格。
3. 最后告诉你：“表格已经生成好了，给你。”

**核心区别：Agent 能通过“工具”去改变世界，而聊天机器人只能躺着说话。**

##### (Agent Loop)Agent 到底是怎么“运作”的？——一个完整的循环

```
用户提问 
  ↓
调用 LLM，把问题发给它 
  ↓
LLM 决定要调用哪个工具（比如天气查询）
  ↓
你的代码执行这个工具（真实去查天气）
  ↓
把工具返回的结果拼到消息里，再发给 LLM
  ↓
LLM 根据结果生成最终回答
  ↓
把回答展示给用户
```

上面这个循环，专业术语叫 **Agent Loop**（智能体循环）。

**现在你只需要记住：Agent 开发 = 写这个循环。**

##### Tool（工具）

就是 Agent 可以调用的**一个函数**。 比如“查天气”是一个工具，“算数学题”也是一个工具。 在代码里，你只需要写一个普通的函数，然后把它的描述告诉模型。

##### Function Calling（函数调用）

这是 LLM 的一个特殊能力： 当你告诉模型“有哪些工具可以用”，模型在回答你的问题时，如果发现需要某一个工具，它不会自己去执行，而是返回一个**“请求”**，比如：

> “请帮我调用 get_weather 工具，参数是 { city: '北京' }”

真正执行这个函数的是你的代码。执行完再把结果还给模型，模型才给你最终答案。

##### Skills（技能）

**Skills** 是社区里很火的一个说法，尤其在一些 AI 产品里（比如 OpenAI 的 Skills、Claude 的 Skills）。 你可以把它理解成 **Tool 的进阶版**。

- **一个 Tool** 就是单个函数，比如“查天气”。
- **一个 Skill** 则是“一组相关能力”的打包，里面可能包含多个 Tool、几段 Prompt 模板，甚至一些处理逻辑。

举个例子：

| Skills 名称    | 包含内容                                                     |
| :------------- | :----------------------------------------------------------- |
| 网页搜索 Skill | 搜索工具 + 网页抓取工具 + “如何提取关键信息”的 Prompt 模板   |
| 数据分析 Skill | 数据库查询工具 + 数据可视化工具 + “怎么解析结果”的 Prompt 模板 |

**在代码层面，Skills 和 Tool 没有本质区别，** 都是通过 `tools` 数组传给模型。 你不需要特意区分它们，只要知道：

> 你在代码里定义的工具，就是你的 Agent 所拥有的“技能”。

##### RAG（检索增强生成）

RAG 全称 **Retrieval-Augmented Generation**，中文叫“检索增强生成”。 它解决一个问题：**LLM 不知道你公司内部资料，也不知道最新发生的事情。**

比如你问它：“我司员工手册第 12 条规定了什么？” 它大概率答不上来，因为它的训练数据里没有你公司的文档。

RAG 的做法非常简单，用三步走：

1. **提前**：把你的文档切成很多小块，每块都用“嵌入模型”（embedding）转成向量（向量可以理解为“一串有规律的数字，能表示一段文字的意思”），然后存起来。
   - 比如把“Vue3 支持组合式 API”切成“Vue3”、“支持”、“组合式 API”这样的块。
2. **提问**：用户问问题时，把用户问题也转成向量，然后去你存好的向量里找“意思最相近”的几块文档。
3. **增强**：把找到的几块文档，直接塞进 Prompt 里，让模型看文档再回答。

**在工程上，RAG 通常会被封装成一个工具（Tool）**，比如：

- 工具名：`search_docs`
- 功能：搜索知识库，返回相关文档片段

这样 Agent 就可以在回答问题时，主动调用 `search_docs` 工具获取信息，再结合上下文回答问题。 可以说，**RAG 是一个专门负责“查资料”的工具**。

##### MCP

MCP 全称 **Model Context Protocol**，中文叫**模型上下文协议**。

你可以把它理解成 **AI 世界的“USB-C 接口”**。

- 以前：一个设备（AI 应用）想连一个工具（比如查天气），就得专门给它做一根线（你写的代码）。
- 现在：大家都用一个标准接口，设备只要支持 USB-C，插上就能用。

在 AI 里，MCP 是一个**标准化协议**，它让 AI 应用（比如 Claude、Cursor）和外部工具 / 数据源之间，通过一种统一的格式互相沟通。

##### **Embedding（嵌入）**

把一段文字（或者一张图片、一个声音）转换成一串数字（向量），让计算机能“理解”它的含义。 比如：

- “猫” → [0.1, 0.3, 0.2, ...]
- “喵星人” → [0.12, 0.31, 0.19, ...]

这两个向量数值很像，说明它们含义相近。 Embedding 是 RAG 和语义搜索的基础。

##### Vector Database（向量数据库）

专门用来存储和搜索“向量”的数据库。 比如你有很多文档，每段都转成向量后存进向量数据库，以后查询时它会快速找到“最像”的向量。 常见的免费开源选择：ChromaDB、Qdrant、Milvus。

##### Chunking（分块）

把一篇很长的文档切成一段段小片段。 比如一篇文章有 10000 字，你按 500 字切成 20 块。 切块的目的是为了方便做 Embedding 和检索，因为模型一次能处理的文字有限。

##### Context Window（上下文窗口）

模型能同时“看到”的最大文字量。 比如 GPT-4o mini 可以有 128k 的上下文窗口，意味着你可以一次输入很长的对话历史。 如果超出窗口，模型会“忘记”最早的内容。

##### Temperature（温度）

控制模型输出随机性的参数。

- 温度低（比如 0）：回答保守、稳定，适合 Agent（需要确定性）。
- 温度高（比如 1）：回答更有创造力，但可能胡言乱语。

##### Fine-tuning（微调）

在一个已经训练好的大模型基础上，用你自己的数据再训练一小段时间，让模型更擅长某个特定任务。 比如你收集了很多客服对话，微调一个模型专做客服。 **注意**：对于 Agent 开发，90% 的情况下不需要微调，用 RAG 就够了，微调成本高且容易过时。

##### Prompt Template（提示词模板）

提前写好的 Prompt 框架，可以动态填入变量。 比如：

```text
你是一个{角色}，请根据以下内容回答{问题}。
```

工程上使用模板可以方便复用和修改。

##### Structured Output（结构化输出）

让模型输出格式化的 JSON，而不是自由文本。 这在 Agent 开发中特别重要，因为程序需要解析模型的回复来决定下一步动作。

##### 记忆 Memory

- 短期记忆：多轮对话消息列表
- 长期记忆：向量数据库存储历史/用户偏好
- 摘要记忆：把长对话压缩成摘要

### 技术栈选型（TS/JS）

| 层级        | 推荐                                 | 原因                               |
| :---------- | :----------------------------------- | :--------------------------------- |
| 前端        | Vue3 + TypeScript                    | 你已有的优势                       |
| AI 流式接入 | Vercel AI SDK + @ai-sdk/vue          | 自动处理 SSE、流式渲染、错误处理   |
| 后端        | Node.js + NestJS / Express           | 稳定、企业级、TS 生态好            |
| Agent 编排  | LangChain.js / LangGraph.js / Mastra | 多 Agent、状态机、工作流           |
| 向量数据库  | pgvector（PostgreSQL）               | 企业不用额外组件，事务+向量一体    |
| 传统数据库  | PostgreSQL + Prisma / TypeORM        | 用户、订单、权限、会话管理         |
| 队列/任务   | BullMQ + Redis                       | 异步任务、批量处理、任务调度       |
| 部署        | Docker + GitHub Actions + 云厂商     | 容器化 CI/CD                       |
| 可观测      | OpenTelemetry + LangSmith / 自建日志 | 每次调用的 token、延迟、成败可追踪 |

### 需要补齐的知识

1. **Node.js 后端基础**
   - Express / NestJS
   - 中间件、鉴权、文件上传
   - SSE / WebSocket 流式通信
2. **数据库基础**
   - PostgreSQL 基本增删改查
   - 数据库索引
   - pgvector
3. **部署基础**
   - Docker 打包
   - 环境变量管理
   - 了解一个云平台（阿里云 / AWS / Vercel / Railway）
4. **异步任务**
   - 用 BullMQ 做队列，处理耗时的 Agent 任务

## 实现（Express）

### 基础

> system 是系统指令，user 是用户输入，assistant 是模型之前的回复，tool 是工具返回的结果

```bash
mkdir express-agent
cd express-agent
npm init -y
```

项目结构

```
express-agent/
├── src/
│   ├── index.ts          // 入口
│   ├── config.ts         // 配置
│   ├── agent.ts          // Agent 核心逻辑
│   ├── tools/
│   │   ├── index.ts      // 工具注册表
│   │   └── orders.ts     // 具体工具
│   ├── routes/
│   │   └── chat.ts       // 聊天路由
│   └── services/
│       └── memory.ts     // 对话记忆
├── .env
└── package.json
```

```bash
# 设置国内环境
npm config set registry https://registry.npmmirror.com

npm install express axios cors dotenv 
npm -D i @types/express @types/node tsx typescript@5

npx tsc --init
```

- `cors`：允许前端跨域请求
- `dotenv`：读取 `.env` 文件里的密钥
- `npx tsc`优先调用项目ts

#### 第一步

**目标：** 发送一个“你好”，并打印AI的回复。

**你要做的事：**

在项目根目录创建 `.env` 文件：

```env
ZHIPU_API_KEY=把刚才复制的key粘贴到这里
```

`src/routers/chat.ts`

```ts
import type { Request, Response } from 'express'

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/chat', async (req: Request, res: Response) => {
  const { message } = req.body

  try {
    const response = await axios.post(
      'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      {
        model: 'glm-4-flash',
        messages: [{ role: 'user', content: message }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ZHIPU_API_KEY}`
        }
      }
    )

    const reply = response.data.choices[0].message.content
    res.json({ reply })
  } catch (error: any) {
    console.error(error.response?.data || error.message)
    res.status(500).json({ error: 'AI服务暂时不可用' })
  }
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})

```

```bash
npx tsx src/routers/chat.ts
```

使用postman等工具，请求头设置`Content-Type: application/json`,传参使用json`{"message": "你好"}`,请求后会返回`{"reply":"你好👋！有什么可以帮助你的吗？"}`

##### 改造流式输出

```ts
import type { Request, Response } from 'express'

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/chat-stream', async (req: Request, res: Response) => {
  const { message } = req.body

  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const aiResponse = await axios.post(
      'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      {
        model: 'glm-4-flash',
        messages: [{ role: 'user', content: message }],
        stream: true
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ZHIPU_API_KEY}`
        },
        responseType: 'stream'
      }
    )

    // 智谱返回的数据是 SSE 格式，我们需要逐块转发
    aiResponse.data.on('data', (chunk: any) => {
      const lines = chunk
        .toString()
        .split('\n')
        .filter((line: string) => line.startsWith('data:'))

      for (const line of lines) {
        const data = line.replace('data:', '').trim()

        if (data === '[DONE]') {
          res.write('data: [DONE]\n\n')
          if (!res.writableEnded) res.end()
          break
        }

        try {
          const json = JSON.parse(data)
          const content = json.choices[0]?.delta?.content
          if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`)
          }
        } catch (e) {
          // 忽略 JSON 解析错误
        }
      }
    })

    aiResponse.data.on('end', () => {
      if (!res.writableEnded) res.end()
    })
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: '流式输出失败' })}\n\n`)
    res.end()
  }
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})

```

> 返回的结构(SSE格式)：
>
> ```
> data: {"choices":[{"delta":{"content":"你好"}}]}
> 
> data: {"choices":[{"delta":{"content":"，世界"}}]}
> 
> data: [DONE]
> ```
>
> 



`index.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Chat</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
  <div id="app">
    <div style="height: 100vh">
      <button @click="handleSend">发送</button>
      <p>{{ msg }}</p>
    </div>
  </div>

  <script>
    const { createApp, ref } = Vue

    createApp({
      setup() {
        const msg = ref('')
        const handleSend = async () => {
          const response = await fetch('http://localhost:3000/chat-stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: '讲个故事' })
          })

          const reader = response.body.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const text = decoder.decode(value)
            const lines = text.split('\n').filter(l => l.startsWith('data:'))
            for (const line of lines) {
              const data = line.slice(5).trim()
              if (data === '[DONE]') return
              const json = JSON.parse(data)
              msg.value += json.content
            }
          }
        }

        return { handleSend, msg }
      }
    }).mount('#app')
  </script>
</body>
</html>

```

> `const reader = response.body.getReader()`作用即打字机效果
>
> - `response.body` 是一个 `ReadableStream` 对象（Web Streams API），里面装的是从网络**持续到来的字节流**，不是一次性给的字符串。
> - `.getReader()` 把这个流锁定到一个 reader 上，之后只能通过 `reader.read()` 一块一块地取数据。
>
> `const text = await response.text()` 一次性取——等整个响应结束才返回，看不到"逐字蹦出来"的效果 

> node端可以使用axios，用户端为什么使用fetch？
>
> **核心注意点：**
>
> - `axios` 在浏览器端底层是 `XMLHttpRequest`，不支持 `responseType: 'stream'`，所以“真正流式”的 axios SSE 处理是在 **Node.js** 中。
> - 浏览器端如果一定要用 axios，只能通过 `onDownloadProgress` + `xhr.responseText` 做“伪流式”处理；生产环境更推荐 `fetch` + `ReadableStream`。
> - SSE 数据格式通常是：
>
> ```json
> data: {"choices":[{"delta":{"content":"你好"}}]}
> 
> data: {"choices":[{"delta":{"content":"，世界"}}]}
> 
> data: [DONE]
> ```
>
> 

#### 第二步：让 Agent 能调用工具（Function Calling）

**目标：** 用户问“查一下张三的订单”，AI 不直接回答，而是调用一个工具函数（查订单），把结果返回再组织语言。

这是成为 Agent 的关键一步。

**核心逻辑：**

1. 我们把“工具”的定义告诉模型
2. 模型判断该调用哪个工具，返回一个“调用请求”
3. 我们在代码里执行那个工具函数
4. 把工具执行结果回传给模型
5. 模型根据结果生成最终回答

这就是一个循环（ReAct）。

**你现在要做：**

先定义一个工具。我们用一个本地数组模拟订单数据。

创建 `tools/orders.ts`：

```ts
const orders = [
  { id: 1, user: '张三', product: '键盘', status: '已发货' },
  { id: 2, user: '张三', product: '显示器', status: '已取消' },
  { id: 3, user: '李四', product: '鼠标', status: '已发货' }
]

function getOrdersByUser(user: string) {
  return orders.filter(o => o.user === user)
}

module.exports = { getOrdersByUser }

```

然后在`tools/index.ts`中构造工具定义：

```ts
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_orders',
      description: '查询用户的订单',
      parameters: {
        type: 'object',
        properties: {
          user: { type: 'string', description: '用户名' }
        },
        required: ['user']
      }
    }
  }
]

module.exports = { tools }

```

现在写一个新的接口 `POST /agent`，实现完整的 Agent 循环：

`src/routers/agent.ts`

```ts
import type { Request, Response } from 'express'

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json())

// 引入工具模块
const { tools } = require('../tools')
const { getOrdersByUser } = require('../tools/order')

app.post('/agent', async (req: Request, res: Response) => {
  const { message } = req.body
  const messages: Record<string, any>[] = [
    { role: 'system', content: '你是订单助手。查订单时必须调用工具，不能自己编造。' },
    { role: 'user', content: message }
  ]

  try {
    let response = await axios.post(
      'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      { model: 'glm-4-flash', messages, tools },
      { headers: { Authorization: `Bearer ${process.env.ZHIPU_API_KEY}` } }
    )

    let assistantMsg = response.data.choices[0].message
    messages.push(assistantMsg)

    // 检查是否需要调用工具
    while (assistantMsg.tool_calls) {
      for (const toolCall of assistantMsg.tool_calls) {
        const { name, arguments: args } = toolCall.function
        const parsedArgs = JSON.parse(args)

        let result
        if (name === 'get_orders') {
          result = getOrdersByUser(parsedArgs.user)
        }

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        })
      }

      // 再次请求智谱
      const nextResponse = await axios.post(
        'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        { model: 'glm-4-flash', messages, tools },
        { headers: { Authorization: `Bearer ${process.env.ZHIPU_API_KEY}` } }
      )

      assistantMsg = nextResponse.data.choices[0].message
      messages.push(assistantMsg)
    }

    res.json({ reply: assistantMsg.content })
  } catch (error: any) {
    console.error(error.response?.data || error.message)
    res.status(500).json({ error: 'Agent 调用失败' })
  }
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})

```

postmand调用

```
POST http://localhost:3000/agent
{
  "message": "帮我查一下张三的订单"
}
```

#### 第三步 加记忆（多轮对话）

现在 Agent 是无状态的，每次请求都忘记之前说过什么。企业级需要多轮记忆。

**思路：**

- 用 `sessionId` 标识一个用户
- 服务器内存里存一个 Map，key 是 sessionId，value 是消息数组
- 每次请求带上 sessionId，后端取出历史，追加新消息，再调用智谱

```ts
const sessions = new Map();

app.post('/agent', async (req, res) => {
  const { message, sessionId = 'default' } = req.body;

  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, [
      { role: 'system', content: '你是订单助手。查订单时必须调用工具。' }
    ]);
  }

  const messages = sessions.get(sessionId);
  messages.push({ role: 'user', content: message });

  // ... 之后的 Agent 循环使用 messages

  // 最后把 assistant 回复推入 messages
  messages.push({ role: 'assistant', content: finalReply });
  sessions.set(sessionId, messages);
});
```

#### 最后企业级

你已经有一个能运行的 Agent 了。下面这些不是马上要做，但你需要知道方向：

1. **数据库持久化** 不要用内存 Map，改用 PostgreSQL 存会话和用户。
2. **多租户隔离** 不同企业有不同知识库、不同工具权限。每个 sessionId 关联一个 tenantId。
3. **RAG（知识库问答）** 把企业文档向量化存入数据库，用户提问时先检索再交给AI。
4. **安全与限流** 加 JWT 登录、限制每个用户每天调用次数、记录 token 消耗。
5. **工作流引擎** 当有多步任务时，用类似 LangGraph.js 的框架来管理状态流转。

但你现在不需要一次全部学会，**先把上面四步走完**，你就已经掌握了 Agent 开发最核心的骨架。



## 框架

- 偏向底层、灵活、体积小的：**自己写 Agent 循环**（+ 用 **Vercel AI SDK** 处理流式输出。
- 偏向高层、开箱即用、适合业务逻辑复杂的：**Mastra**（TS 原生 Agent 框架，设计清晰，支持自定义模型）。

1. **前端**：Vue + Vercel AI SDK 的 `useChat`（或 `useAssistant`）来处理流式聊天 UI。
2. **后端**：用 Mastra 定义工具和 Agent，然后把它封装进 NestJS 或 Nuxt 的 API 路由里。

#### LangChain/Mastra/Vercel AI SDK

##### 谁该选哪个

- **Next.js 14+ 项目,前端流式优先**：Vercel AI SDK
- **重 retriever / RAG / 多 chain 组合**、生态更倾向 Python 版,JS 版功能滞后约 1-2 个月。：LangChain JS
- **想做长 workflow（定时、事件触发、人审）**：Mastra
- **预算紧、要快**：Vercel AI SDK,代码最少
- **要 self-host workflow runner**：Mastra

##### 局限

- Vercel AI SDK 在长 workflow（>10 步）上需要自己包 state machine
- LangChain JS 生态分散,文档版本碎片化
- Mastra 较新,生产案例少,社区资源有限

**最推荐的组合是：Vue3 + Vercel AI SDK（前端） + Mastra（后端）**

### Vercel AI SDK（重点推荐）

这是一个专门为前端全栈场景设计的 AI SDK，**不是 Agent 框架，但它是 TS/JS 里流式输出和模型接入的标准**。

- 支持 React / Vue / Svelte
- 你可以自定义 Provider，对接智谱 AI
- 自带 `useChat` 这种 Vue3 组合式函数，处理流式聊天 UI 非常方便
- 没有复杂的 Agent 状态管理，但和自写 Agent 循环是绝配

**示例：在 Vue3 中使用 `@ai-sdk/vue` 的 `useChat`**：

```ts
import { useChat } from 'ai/vue';

const { messages, input, handleSubmit } = useChat({
  api: '/api/chat', // 你的后端接口
});
```

模板中直接 `v-for` 渲染 `messages`，`handleSubmit` 直接发送消息，**流式解析、状态管理全都内置了**。

> 你可以把之前自己写的 `/chat` 接口改造成兼容 Vercel AI SDK 的格式（它需要返回 `text/event-stream`），这样前端代码量能砍掉 80%。

### Mastra（TS 原生 Agent 框架）

Mastra 是 2024 年出的新框架，设计思路和 LangChain 完全不同，**它就是为 TS 设计的**，没有太多历史包袱，文档清晰。

特点：

- 内置 Agent、Tool、Workflow、RAG、Memory、Evaluator
- 模型接入是 OpenAI 兼容风格，智谱的接口就是 OpenAI 兼容的，所以直接可以配
- 支持 TypeScript，类型提示优秀
- 比 LangChain 轻很多，可以理解为一个“企业级 Agent 脚手架”

**示例：用 Mastra 定义一个带工具的 Agent**（需要先安装 `@mastra/core`）：

```ts
import { Agent } from '@mastra/core';
import { openai } from '@ai-sdk/openai'; // 也可以用自定义 Provider

// 定义工具
const getOrders = {
  name: 'get_orders',
  description: '查询用户的订单',
  execute: async ({ user }: { user: string }) => {
    return orders.filter(o => o.user === user);
  }
};

// 创建 Agent
const agent = new Agent({
  name: '订单助手',
  model: openai('glm-4-flash'), // 如果智谱兼容 OpenAI，可以这么配
  tools: { getOrders },
  systemPrompt: '你是订单助手，查订单必须调用 get_orders 工具',
});

// 调用
const response = await agent.generate('张三的订单有什么？');
console.log(response.text);
```

