### 插件配置

```ts
import vue from '@vitejs/plugin-vue'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import { viteMockServe } from 'vite-plugin-mock'
import { PluginOption } from 'vite'

export default function createVitePlugins(viteEnv: Record<string, string>, isBuild = false) {
  const vitePlugins: PluginOption[] = [
    vue({
      script: {
        defineModel: true
      }
    }),
    {
      name: 'mock-url-rewrite',
      enforce: 'pre',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url?.includes('/mock/')) {
            req.url = req.url.replace(/^\/[^/]+(?=\/mock\/)/, '')
          }
          next()
        })
      }
    },
    viteMockServe({
      mockPath: 'src/mock',
      enable: true,
      logger: true,
      watchFiles: true
    })
  ]
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createSvgIcon(isBuild))
  isBuild && vitePlugins.push(...createCompression(viteEnv))
  return vitePlugins
}

```

`vite.config.ts`

```ts
erver: {
  port: Number(env.VITE_APP_PORT),
  host: true,
  open: false,
  proxy: {
    // https://cn.vitejs.dev/config/#server-proxy
    [env.VITE_APP_BASE_API]: { // env.VITE_APP_BASE_API = /dev-api
      target: baseUrl,
      changeOrigin: true,
      rewrite: p => p.replace(new RegExp('^' + env.VITE_APP_BASE_API), ''),
      bypass: req => (req.url?.includes('/mock/') ? req.url : undefined)
    },
  }
},
```

> 如果不设置bypass，系统会直接走服务器接口，或者修改mock数据的url，不要跟代理的接口一致
>
> **`bypass` 函数的返回值与行为**
>
> `bypass` 函数接收 `req`（请求对象）、`res`（响应对象）等参数，它的返回值直接决定了请求的最终去向[-1](https://ask.csdn.net/questions/8757601#1)[-12](https://blog.csdn.net/weixin_33218697/article/details/155860589#2)。
>
> | 返回值                    | 含义与行为                                                   |
> | :------------------------ | :----------------------------------------------------------- |
> | **`undefined` 或 `null`** | **不干预**。请求会继续执行后续的代理逻辑，按正常流程转发到 `target` 目标服务器[-1](https://ask.csdn.net/questions/8757601#1)。 |
> | **`false`**               | **显式跳过代理**。请求将不会转发，而是交给 Vite 开发服务器自身的其他中间件去处理。常用于**集成本地 Mock 服务**或处理**WebSocket 连接**[-1](https://ask.csdn.net/questions/8757601#1)[-4](https://github.com/vitejs/vite/issues/15163#1)。 |
> | **`string`（字符串）**    | **重定向路径**。请求会被导向该字符串指定的新路径。例如，返回 `'/index.html'`，可以让 SPA（单页应用）应用的所有 HTML 请求都返回首页[-1](https://ask.csdn.net/questions/8757601#1)。 |



> `viteMockServe` 的匹配机制是**精确按 mock 文件 url 字段匹配**（`pathToRegexp(item.url).test(reqUrl)`），它**没有任何「路径前缀」配置项**——能不能命中完全取决于 mock 文件里 `url` 字符串**写的是什么**。
>
> 所以要么写一个自定义vite插件处理，要么直接在mock的api中加上路径前缀，并吧vite.config中的bypass去掉

### 使用

`src/enum/map.ts` 

```ts
/** 会计平台url映射 */
export enum AcctUrlKey {
  '凭证生成-事件处理-事件分类' = '/mock/acct/voucher/events/class',
  '凭证生成-事件处理-事件列表' = '/mock/acct/voucher/events/list'
}
```



`src/mock/map.ts`

```ts
import { AcctUrlKey } from '@/enum/acct'

const eventProcMap = new Map<AcctUrlKey, readonly unknown[]>([
  [
    AcctUrlKey['凭证生成-事件处理-事件分类'],
    [
      { id: 1, displayName: '发票确认' },
      { id: 2, displayName: '批量付款申请支付' },
      { id: 3, displayName: '预付款申请支付' },
      { id: 4, displayName: '付款核销' },
      { id: 5, displayName: '其他付款申请支付' },
      { id: 6, displayName: '应收发票' },
      { id: 7, displayName: '收款确认' },
      { id: 8, displayName: '核销确认' },
      { id: 9, displayName: '资产增加与红冲' },
      { id: 10, displayName: '资产原值调整' },
      { id: 11, displayName: '资产类别调整' },
      { id: 12, displayName: '资产经费来源调整' },
      { id: 13, displayName: '资产减值准备' },
      { id: 14, displayName: '资产报废' },
      { id: 15, displayName: '资产折旧' },
      { id: 16, displayName: '门诊收入及结算' },
      { id: 17, displayName: '住院收入' },
      { id: 18, displayName: '住院结算' },
      { id: 19, displayName: '预交金' },
      { id: 20, displayName: '采购入库及采购退货' },
      { id: 21, displayName: '寄售入库及寄售退回' },
      { id: 22, displayName: '库存出库及退回' },
      { id: 23, displayName: '杂项出入库' },
      { id: 25, displayName: '内部转移' },
      { id: 26, displayName: '实际成本调整' },
      { id: 31, displayName: '费用报销' },
      { id: 32, displayName: '报销支付' },
      { id: 33, displayName: '借款支付' },
      { id: 35, displayName: '资金转卡' }
    ]
  ],
  [
    AcctUrlKey['凭证生成-事件处理-事件列表'],
    [
      {
        id: 1,
        state: 'booked',
        eventClassName: '资产增加与红冲',
        businessType: '资产增加',
        sourceName: '2023030001',
        sourceReference: 'eno.asset.addition,1',
        originName: '[2023030001]资产增加单',
        originReference: 'eno.asset.addition,1',
        date: '2023-03-28',
        periodName: '03/2023',
        amount: 2000000,
        accountDetailSummary: 2000000,
        accountMoveId: '5',
        applicationModel: 'eno_asset',
        accountBookName: '主账簿'
      },
      {
        id: 4,
        state: 'booked',
        eventClassName: '资产类别调整',
        businessType: '[118]设备科',
        sourceName: '防护装置-资产类别调整',
        sourceReference: 'eno.asset.transaction,7',
        originName: '[202303001]资产类别调整单',
        originReference: 'eno.asset.category.adjust,1',
        date: '2023-03-28',
        periodName: '03/2023',
        amount: 558000,
        accountDetailSummary: 0,
        accountMoveId: '1',
        applicationModel: 'eno_asset',
        accountBookName: '主账簿'
      },
      {
        id: 6,
        state: 'booked',
        eventClassName: '资产折旧',
        businessType: false,
        sourceName: '1',
        sourceReference: 'eno.asset.depreciation.event,1',
        originName: '1',
        originReference: 'eno.asset.depreciation.event,1',
        date: '2023-03-31',
        periodName: '03/2023',
        amount: 607344073,
        accountDetailSummary: 607344073,
        accountMoveId: '8',
        applicationModel: 'eno_asset',
        accountBookName: '主账簿'
      },
      {
        id: 7,
        state: 'booked',
        eventClassName: '资产折旧',
        businessType: false,
        sourceName: '2',
        sourceReference: 'eno.asset.depreciation.event,2',
        originName: '2',
        originReference: 'eno.asset.depreciation.event,2',
        date: '2023-03-31',
        periodName: '03/2023',
        amount: -32847618,
        accountDetailSummary: -32847618,
        accountMoveId: '9',
        applicationModel: 'eno_asset',
        accountBookName: '主账簿'
      },
      {
        id: 8,
        state: 'booked',
        eventClassName: '资产类别调整',
        businessType: '[118]设备科',
        sourceName: '恒温箱-资产类别调整',
        sourceReference: 'eno.asset.transaction,10',
        originName: '[202303002]资产类别调整单',
        originReference: 'eno.asset.category.adjust,2',
        date: '2023-03-29',
        periodName: '03/2023',
        amount: 2050000,
        accountDetailSummary: 0,
        accountMoveId: '1',
        applicationModel: 'eno_asset',
        accountBookName: '主账簿'
      },
      {
        id: 10,
        state: 'booked',
        eventClassName: '资产经费来源调整',
        businessType: '[118]设备科',
        sourceName: '新型智能多用途恒温箱-资产经费来源调整',
        sourceReference: 'eno.asset.transaction,12',
        originName: '[202303001]资产经费来源调整单',
        originReference: 'eno.asset.funds.source.adjustment.document,1',
        date: '2023-03-29',
        periodName: '03/2023',
        amount: 1000000,
        accountDetailSummary: 0,
        accountMoveId: '2',
        applicationModel: 'eno_asset',
        accountBookName: '主账簿'
      },
      {
        id: 11,
        state: 'booked',
        eventClassName: '资产报废',
        businessType: '[118]设备科',
        sourceName: '彩色激光一体机-资产报废',
        sourceReference: 'eno.asset.transaction,13',
        originName: '[202303001]资产报废申请',
        originReference: 'eno.asset.retirement.application,1',
        date: '2023-03-29',
        periodName: '03/2023',
        amount: 160716,
        accountDetailSummary: 263000,
        accountMoveId: '7',
        applicationModel: 'eno_asset',
        accountBookName: '主账簿'
      },
      {
        id: 12,
        state: 'booked',
        eventClassName: '资产报废',
        businessType: '[118]设备科',
        sourceName: '馒头机-资产报废',
        sourceReference: 'eno.asset.transaction,14',
        originName: '[202303002]资产报废申请',
        originReference: 'eno.asset.retirement.application,2',
        date: '2023-03-29',
        periodName: '03/2023',
        amount: 0,
        accountDetailSummary: 349200,
        accountMoveId: '7',
        applicationModel: 'eno_asset',
        accountBookName: '主账簿'
      },
      {
        id: 13,
        state: 'error',
        eventClassName: '借款支付',
        businessType: '员工借款',
        sourceName: 'PAY2023030226',
        sourceReference: 'eno.ap.payment,450',
        originName: 'L2023030001',
        originReference: 'eno.expense.loan.bill,1',
        date: '2023-03-30',
        periodName: '03/2023',
        amount: 10000,
        accountDetailSummary: 0,
        accountMoveId: false,
        applicationModel: 'eno_expense',
        accountBookName: '主账簿'
      },
      {
        id: 14,
        state: 'error',
        eventClassName: '收款确认',
        businessType: false,
        sourceName: 'REC00000001-1',
        sourceReference: 'eno.ar.receipt.trx,1',
        originName: 'REC00000001',
        originReference: 'eno.ar.receipt.header,1',
        date: '2023-03-30',
        periodName: '03/2023',
        amount: 2000,
        accountDetailSummary: 0,
        accountMoveId: false,
        applicationModel: 'eno_ar',
        accountBookName: '主账簿'
      },
      {
        id: 15,
        state: 'error',
        eventClassName: '费用报销',
        businessType: '五项费用报销单',
        sourceName: 'B2023030002',
        sourceReference: 'eno.expense.report,2',
        originName: '',
        originReference: false,
        date: '2023-03-30',
        periodName: '03/2023',
        amount: 8000,
        accountDetailSummary: 0,
        accountMoveId: false,
        applicationModel: 'eno_expense',
        accountBookName: '主账簿'
      },
      {
        id: 16,
        state: 'error',
        eventClassName: '借款支付',
        businessType: '员工借款',
        sourceName: 'PAY2023030227',
        sourceReference: 'eno.ap.payment,451',
        originName: 'L2023030002',
        originReference: 'eno.expense.loan.bill,2',
        date: '2023-03-30',
        periodName: '03/2023',
        amount: 80000,
        accountDetailSummary: 0,
        accountMoveId: false,
        applicationModel: 'eno_expense',
        accountBookName: '主账簿'
      },
      {
        id: 24,
        state: 'unbooked',
        eventClassName: '费用报销',
        businessType: '五项费用报销单',
        sourceName: 'B2023030008',
        sourceReference: 'eno.expense.report,8',
        originName: '',
        originReference: false,
        date: '2023-03-31',
        periodName: '03/2023',
        amount: 30000,
        accountDetailSummary: 0,
        accountMoveId: false,
        applicationModel: 'eno_expense',
        accountBookName: '主账簿'
      },
      {
        id: 25,
        state: 'booked_warning',
        eventClassName: '发票确认',
        businessType: '服务采购',
        sourceName: '12341234',
        sourceReference: 'eno.ap.invoice,1',
        originName: '【发票】12341234',
        originReference: 'eno.ap.invoice,1',
        date: '2023-03-31',
        periodName: '03/2023',
        amount: 0,
        accountDetailSummary: 0,
        accountMoveId: false,
        applicationModel: 'eno_ap',
        accountBookName: '主账簿'
      },
      {
        id: 26,
        state: 'error',
        eventClassName: '发票确认',
        businessType: '服务采购',
        sourceName: '12123',
        sourceReference: 'eno.ap.invoice,2',
        originName: '【发票】12123',
        originReference: 'eno.ap.invoice,2',
        date: '2023-03-31',
        periodName: '03/2023',
        amount: 100000,
        accountDetailSummary: 0,
        accountMoveId: false,
        applicationModel: 'eno_ap',
        accountBookName: '主账簿'
      },
      {
        id: 27,
        state: 'error',
        eventClassName: '批量付款申请支付',
        businessType: '员工借款',
        sourceName: 'PAY2023030235',
        sourceReference: 'eno.ap.payment,459',
        originName: '【付款申请】PR20230300001',
        originReference: 'eno.ap.payment.request,1',
        date: '2023-03-31',
        periodName: '03/2023',
        amount: 100000,
        accountDetailSummary: 0,
        accountMoveId: false,
        applicationModel: 'eno_ap',
        accountBookName: '主账簿'
      },
      {
        id: 29,
        state: 'unbooked',
        eventClassName: '费用报销',
        businessType: '五项费用报销单',
        sourceName: 'B2023030009',
        sourceReference: 'eno.expense.report,9',
        originName: '',
        originReference: false,
        date: '2023-03-31',
        periodName: '03/2023',
        amount: 30000,
        accountDetailSummary: 0,
        accountMoveId: false,
        applicationModel: 'eno_expense',
        accountBookName: '主账簿'
      },
      {
        id: 30,
        state: 'booked',
        eventClassName: '资产类别调整',
        businessType: '[115]图书馆',
        sourceName: '临床眼科学-资产类别调整',
        sourceReference: 'eno.asset.transaction,15',
        originName: '[202303004]资产类别调整单',
        originReference: 'eno.asset.category.adjust,4',
        date: '2023-03-31',
        periodName: '03/2023',
        amount: 203680,
        accountDetailSummary: 0,
        accountMoveId: '5',
        applicationModel: 'eno_asset',
        accountBookName: '主账簿'
      },
      {
        id: 32,
        state: 'error',
        eventClassName: '资产原值调整',
        businessType: '[118]设备科',
        sourceName: '电动吸引器-资产原值调整',
        sourceReference: 'eno.asset.transaction,17',
        originName: '[202303006]资产原值调整单',
        originReference: 'eno.asset.value.adjust,5',
        date: '2023-03-31',
        periodName: '03/2023',
        amount: 40000,
        accountDetailSummary: 0,
        accountMoveId: false,
        applicationModel: 'eno_asset',
        accountBookName: '主账簿'
      },
      {
        id: 33,
        state: 'booked',
        eventClassName: '资产原值调整',
        businessType: '[118]设备科',
        sourceName: '试剂卡孵化器-资产原值调整',
        sourceReference: 'eno.asset.transaction,18',
        originName: '[202303007]资产原值调整单',
        originReference: 'eno.asset.value.adjust,6',
        date: '2023-03-31',
        periodName: '03/2023',
        amount: 19900,
        accountDetailSummary: 19900,
        accountMoveId: '6',
        applicationModel: 'eno_asset',
        accountBookName: '主账簿'
      }
    ]
  ]
])

export default eventProcMap

```



`src/mock/xxx.ts`

```ts
import type { MockMethod } from 'vite-plugin-mock'

import eventProcMap from './map'
import { AcctUrlKey } from '@/enum/acct'

const createResult = <T>(data: readonly T[], type: 'rows' | 'data' = 'data') => ({
  code: 200,
  msg: 'success',
  [type]: data,
  total: type === 'rows' ? data.length : null
})


const apis: MockMethod[] = [
  {
    url: AcctUrlKey['凭证生成-事件处理-事件分类'], // 事件分类
    method: 'get',
    response: () => createResult(eventProcMap.get(AcctUrlKey['凭证生成-事件处理-事件分类']) || [], 'rows')
  },
  {
    url: AcctUrlKey['凭证生成-事件处理-事件列表'],
    method: 'get',
    response: ({ query }) => {
      const data = (eventProcMap.get(AcctUrlKey['凭证生成-事件处理-事件列表']) || []) as any[]
      return createResult(
        data.filter(item => item.state === query.type),
        'rows'
      )
    }
  }
]

export default apis

```

