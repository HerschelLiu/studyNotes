`src/constants/queryKeys.ts`

```ts
import type { EnableStatus, YesOrNo } from '@/enum/budget'

/**
 * TanStack Query key 统一管理
 */
export const queryKeys = {
  budget: {
    /** 预算科室/归口科室列表（参数：是否滚动） */
    listDept: (isRoll?: YesOrNo) => ['BUDGET_LIST_DEPT', isRoll] as const,
    /** 预算科室树 */
    treeDept: () => ['BUDGET_TREE_DEPT'] as const,

    /** 预算单位/医院信息列表 */
    listBudgetUnit: () => ['BUDGET_LIST_UNIT'] as const,
    /** 预算单位/医院信息树 */
    treeBudgetUnit: () => ['BUDGET_TREE_BUDGET_UNIT'] as const,

    /** 专项管理-项目类型列表 */
    listProjType: () => ['BUDGET_LIST_PROJ_TYPE'] as const,
    /** 专项管理-项目类型树 */
    treeProjType: () => ['BUDGET_TREE_PROJ_TYPE'] as const,

    /** 项目年度（预算期间）列表 */
    listBudgTimeDim: () => ['BUDGET_LIST_BUDG_TIME_DIM'] as const,

    /** 预算类别列表 */
    listBudgetType: () => ['BUDGET_LIST_TYPE'] as const,
    /** 预算类别树 */
    treeBudgetType: () => ['BUDGET_TREE_BUDGET_TYPE'] as const,

    /** 编制流程列表 */
    listCompileFlow: () => ['BUDGET_LIST_COMPILE_FLOW'] as const,

    /** 预算项目列表（项目立项）参数：状态、是否论证 */
    listBudgetProject: (status?: EnableStatus, isDemonstrate?: YesOrNo) => ['BUDGET_LIST_PROJECT', status, isDemonstrate] as const,

    /** 预算任务列表 */
    listBudgetTask: () => ['BUDGET_LIST_TASK'] as const,

    /** 收支项目列表 */
    listBudgetExpense: () => ['BUDGET_LIST_EXPENSE'] as const
  },

  budgCompileFlow: {
    /** 编制流程详情（参数：id） */
    detail: (id?: string | number) => ['budgCompileFlow', id] as const
  }
} as const

```



使用

```ts
const useGetListCompileFlow = () => {
  return useQuery<(ResponseListBudgCompileFlow & SelectDefaultItems)[], Error>({
    queryKey: queryKeys.budgCompileFlow.list(),
    queryFn: async () => {
      const { rows } = await listCompileProcess({})
      return rows.map(item => ({
        _label: item.planName,
        _value: item.id,
        ...item
      }))
    }
  })
}
```

