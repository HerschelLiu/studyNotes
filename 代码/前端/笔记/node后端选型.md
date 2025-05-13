* node环境选择**[express](https://express.nodejs.cn/)**，其他环境用**[hono](https://hono-dev.myedgetech.com/docs/)**
  * hono是唯一支持全部runtime的框架，若需要用到特殊runtime，没有第二选择
  * node下express比hono好？**生态**
  * Express 内置常用的插件，开箱即用，像静态资源、路由、文件上传下载、json解析等，此外他的 req和res继承自 nodejs标准库，减少学习成本
* **[Fastify](https://www.fastify.cn/)** 类似 express 内置了更多功能，例如基于[json schema](https://zhida.zhihu.com/search?content_id=570701686&content_type=Answer&match_order=1&q=json+schema&zhida_source=entity)的参数检验和json序列化，文档很丰富，上手成本比express 要高；**高性能需求选它**
* **[Koa](https://www.koajs.net/)** 过于简化，完成常见的任务也需要装一堆插件，而且路由插件就有好多个，不适合选择困难的同学
* **[nest](https://nest.nodejs.cn/)**:看作高级版express；只能跑node。大而全，模仿springboot风格；学go更好，“性价比”不足;内置[依赖注入](https://zhida.zhihu.com/search?content_id=570701686&content_type=Answer&match_order=1&q=依赖注入&zhida_source=entity)和ts支持，强制规范化了结构，使得项目更容易规模化，非常适合多人协作的大项目，当然上手成本这是最高的一个.