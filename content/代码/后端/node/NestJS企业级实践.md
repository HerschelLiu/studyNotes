---
title: "NestJS 企业级实践"
---

> 前置：[Express 项目规范](./Express项目规范.md)，理解分层、鉴权、测试。
>
> 定位：NestJS 不是“更高级的 Express”，而是用**模块 + 依赖注入 + 约定**把团队协作和可测试性固化下来。小项目用它可能偏重，中大型项目收益明显。

## 1. 核心概念

| 概念 | 作用 | 类比 Express |
| --- | --- | --- |
| Module | 组织一组控制器与提供者 | 一个业务目录 |
| Controller | 声明路由，处理请求/响应 | Router + handler |
| Provider / Service | 业务逻辑，可被注入 | service 文件 |
| DI | 依赖由容器创建和注入 | 手动 require/import |
| Pipe | 参数转换与校验 | 校验中间件 |
| Guard | 鉴权/权限 | 鉴权中间件 |
| Interceptor | 统一响应、耗时、缓存 | 包装器 |
| Exception Filter | 统一异常格式 | 错误中间件 |
| Middleware | 原始请求处理 | Express 中间件 |

**请求生命周期**：

```text
Middleware → Guard → Interceptor(前) → Pipe → Handler
         → Interceptor(后) → Exception Filter
```

记住这个顺序，排障时能判断“为什么 Guard 拿不到 Pipe 转换后的值”。

## 2. 最小模块

```ts
// todos/todos.module.ts
import { Module } from '@nestjs/common'
import { TodosController } from './todos.controller'
import { TodosService } from './todos.service'

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  exports: [TodosService],
})
export class TodosModule {}
```

```ts
// todos/todos.controller.ts
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.todosService.list(user.id)
  }

  @Post()
  create(@Body() dto: CreateTodoDto, @CurrentUser() user: User) {
    return this.todosService.create(user.id, dto)
  }
}
```

依赖注入的价值：service 可以被替换成 mock，测试不需要启动数据库。

## 3. 企业级目录结构

```text
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── filters/          # 全局异常过滤
│   ├── guards/           # 登录、角色
│   ├── interceptors/     # 响应包装、耗时
│   ├── decorators/       # @CurrentUser、@Roles
│   └── dto/              # 分页等通用 DTO
├── config/
│   └── configuration.ts
├── infra/
│   ├── database/
│   ├── redis/
│   └── logger/
└── modules/
    ├── auth/
    ├── users/
    ├── todos/
    └── health/
```

约定：

- **按业务域分模块**，不要按 controller/service 全平铺；
- 模块之间通过 service 或事件通信，不直接跨模块访问 repository；
- 公共能力放 `common` 或 `infra`，避免循环依赖；
- 一个模块内部再分 `dto/`、`entities/`、`tests/`。

## 4. 配置与校验

```ts
// app.module.ts
ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().min(32).required(),
  }),
})
```

- 启动即校验，缺配置直接失败；
- 用 `ConfigService.getOrThrow()`，不要到处 `process.env`；
- 敏感配置由部署平台注入，不提交 `.env`。

## 5. 校验、响应与异常

### 5.1 全局校验

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,          // 去掉 DTO 未声明字段
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
```

DTO 用 `class-validator`：

```ts
export class CreateTodoDto {
  @IsString()
  @Length(1, 100)
  title: string

  @IsOptional()
  @IsBoolean()
  done?: boolean
}
```

### 5.2 统一响应

```ts
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => ({ data })))
  }
}
```

### 5.3 统一异常

```ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    const status = exception instanceof HttpException ? exception.getStatus() : 500
    res.status(status).json({
      message: status === 500 ? '服务器内部错误' : (exception as Error).message,
      code: status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR',
    })
  }
}
```

生产环境不要把堆栈返回给客户端，但要完整记录到日志。

## 6. 鉴权与权限

```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!roles?.length) return true
    const user = context.switchToHttp().getRequest().user
    return roles.includes(user.role)
  }
}
```

```ts
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Delete(':id')
remove(@Param('id') id: string) {
  return this.todosService.remove(id)
}
```

资源归属校验放在 service，Guard 只判断角色。两者不能互相替代。

## 7. 数据库与事务

### 7.1 ORM 选择

- Prisma：类型安全、迁移体验好、适合新项目；
- TypeORM：Nest 生态集成早、装饰器实体；
- Drizzle：更贴近 SQL、轻量。

### 7.2 事务

```ts
// Prisma
await prisma.$transaction(async (tx) => {
  await tx.account.update({ where: { id: from }, data: { balance: { decrement: amount } } })
  await tx.account.update({ where: { id: to }, data: { balance: { increment: amount } } })
})
```

```ts
// TypeORM
const runner = dataSource.createQueryRunner()
await runner.connect()
await runner.startTransaction()
try {
  await runner.manager.decrement(Account, from, 'balance', amount)
  await runner.manager.increment(Account, to, 'balance', amount)
  await runner.commitTransaction()
} catch (error) {
  await runner.rollbackTransaction()
  throw error
} finally {
  await runner.release()
}
```

事务内不要调用第三方接口，避免长事务锁表。

## 8. 日志、监控与文档

- 日志：`nestjs-pino`，注入请求 id，输出 JSON；
- 健康检查：`@nestjs/terminus` 暴露 `/health`；
- 指标：`prom-client` 暴露 `/metrics`；
- 链路：OpenTelemetry，至少记录入口、数据库、外部调用；
- 接口文档：`@nestjs/swagger` 生成 OpenAPI，和前端联调用同一份契约。

```ts
const document = SwaggerModule.createDocument(app, new DocumentBuilder()
  .setTitle('API')
  .setVersion('1.0')
  .addBearerAuth()
  .build())
SwaggerModule.setup('docs', app, document)
```

## 9. 测试

```ts
describe('TodosService', () => {
  let service: TodosService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile()

    service = module.get(TodosService)
  })

  it('只能查询自己的数据', async () => {
    await expect(service.list('user-a')).resolves.toEqual([])
  })
})
```

- 单元测试：service + mock repository；
- 集成测试：`Test.createTestingModule` + 真实测试库；
- e2e：启动完整应用 + supertest，覆盖鉴权与错误格式；
- 测试文件与模块同目录，命名 `*.spec.ts` / `*.e2e-spec.ts`。

## 10. 部署

```ts
// main.ts
app.enableShutdownHooks()
await app.listen(process.env.PORT ?? 3000)
```

- Docker 多阶段构建，运行 `node dist/main.js`；
- 优雅退出：`enableShutdownHooks` + 容器 `SIGTERM`；
- 先构建再运行，不要在容器里跑 `ts-node`；
- 健康检查与就绪探针分开（存活 / 可接收流量）。

## 11. 落地方式（真实工作）

不要一上来重写整个项目。建议：

1. 选一个边界清晰的模块（如通知、审计、文件）；
2. 用 Nest 新建服务或模块，先打通鉴权、日志、配置；
3. 与旧 Express 服务通过 HTTP/消息通信，保持契约一致；
4. 补测试与监控，再逐步迁移核心模块；
5. 统一错误码与响应结构，避免两套风格长期并存。

## 12. 常见误区

| 误区 | 问题 | 建议 |
| --- | --- | --- |
| 把 Nest 当 Express 用 | controller 里写 SQL、逻辑膨胀 | 严格分层，service 承载业务 |
| 模块越多越好 | 循环依赖、跳转困难 | 按业务域拆，必要时合并 |
| 滥用微服务 | 分布式复杂度远超收益 | 先模块化单体，确有瓶颈再拆 |
| 所有东西全局注册 | 隐式依赖、难测试 | 只把日志/配置/过滤器等真正全局化 |
| 忽略 DTO | 参数裸奔、类型不安全 | 全局 ValidationPipe + DTO |
| 直接返回实体 | 泄露字段、耦合表结构 | 映射为响应 DTO |

## 13. Express 与 Nest 怎么选

| 场景 | 建议 |
| --- | --- |
| 小工具、BFF、原型 | Express / Fastify |
| 团队协作、长期维护、模块多 | NestJS |
| 需要严格分层与测试 | NestJS |
| 极致轻量、边缘运行时 | Hono / Fastify |

先掌握 Express 的“手动分层”，再用 Nest 的“约定分层”，能看懂框架替你做了什么，也能在缺少约定时自己补。
