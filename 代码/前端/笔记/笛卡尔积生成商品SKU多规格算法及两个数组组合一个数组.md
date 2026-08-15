## 笛卡尔积生成商品SKU多规格算法

方式1

```js
let arr = [
    ['红色', '黑色', '白色'],
    ['16G', '32G'],
    ['移动版', '联通版'],
]
let result = arr.reduce((a, b, c) => {
    var res = []
    a.map(x => {
        b.map(y => {
            res.push([...x, y])
        })
    })
    return res
}, [[]])
console.log(result)
```



```js
[
    ["红色", "16G", "移动版"],
    ["红色", "16G", "联通版"],
    ["红色", "32G", "移动版"],
    ["红色", "32G", "联通版"],
    ["黑色", "16G", "移动版"],
    ["黑色", "16G", "联通版"],
    ["黑色", "32G", "移动版"],
    ["黑色", "32G", "联通版"],
    ["白色", "16G", "移动版"],
    ["白色", "16G", "联通版"],
    ["白色", "32G", "移动版"],
    ["白色", "32G", "联通版"]
]
```





方式2

生成对象形式的笛卡尔积（这种形式常用与elementui）方便简单

```js
let newArr = [{
        name: 'color',
        data: ['红色', '黑色', '白色'],
    },
    {
        name: 'size',
        data: ['16G', '32G'],
    },
    {
        name: 'banben',
        data: ['移动版', '联通版'],
    }
]
 
let newResult = newArr.reduce((a, b, c) => {
    let res=[]
    a.map(x=>{
        b.data.map(y=>{
            res.push({...x,[b.name]:y})
        })
    })
    return res
},[{}])
console.log(newResult)
```



```js
[
    {
        "color": "红色",
        "size": "16G",
        "banben": "移动版"
    },
    {
        "color": "红色",
        "size": "16G",
        "banben": "联通版"
    },
    {
        "color": "红色",
        "size": "32G",
        "banben": "移动版"
    },
    {
        "color": "红色",
        "size": "32G",
        "banben": "联通版"
    },
    {
        "color": "黑色",
        "size": "16G",
        "banben": "移动版"
    },
    {
        "color": "黑色",
        "size": "16G",
        "banben": "联通版"
    },
    {
        "color": "黑色",
        "size": "32G",
        "banben": "移动版"
    },
    {
        "color": "黑色",
        "size": "32G",
        "banben": "联通版"
    },
    {
        "color": "白色",
        "size": "16G",
        "banben": "移动版"
    },
    {
        "color": "白色",
        "size": "16G",
        "banben": "联通版"
    },
    {
        "color": "白色",
        "size": "32G",
        "banben": "移动版"
    },
    {
        "color": "白色",
        "size": "32G",
        "banben": "联通版"
    }
]
```



## 两个数组组合成一个数组

```ts
export interface RequestAddBudgetTaskStageTask {
  /** 任务阶段名称 */
  taskPhase: string
  /** 计划开始时间 */
  planStartTime: string
  /** 计划结束时间 */
  planEndTime: string
}
export interface RequestAddBudgetTaskStageDept {
  /** 科室id */
  deptId: string
  /** 科室编码 */
  deptCode: string
  /** 科室名称 */
  deptName: string
}
export interface RequestAddBudgetTaskStage extends RequestAddBudgetTaskStageTask, RequestAddBudgetTaskStageDept {
  /** 预算任务ID */
  taskId?: string
}

const form = {
  taskList: <RequestAddBudgetTaskStageTask[]>[],
  deptList: <RequestAddBudgetTaskStageDept[]>[],
}

const request: RequestAddBudgetTaskStage[] = form.deptList.flatMap(dept =>
  form.taskList.map(task => ({
    ...dept,
    ...task
  }))
)
```

### 拆分

```ts
const readDetails = async () => {
    const arr = [{deptId: '1',deptCode: '10',deptName: '行政',taskPhase: '1',planStartTime: '2026-08-10',planEndTime: '2026-08-11'},{deptId: '1',deptCode: '10',deptName: '行政',taskPhase: '2',planStartTime: '2026-08-10',planEndTime: '2026-08-11'},{deptId: '7',deptCode: '20',deptName: '住院部',taskPhase: '1',planStartTime: '2026-08-10',planEndTime: '2026-08-11'},{deptId: '7',deptCode: '20',deptName: '住院部',taskPhase: '2',planStartTime: '2026-08-10',planEndTime: '2026-08-11'},{deptId: '8',deptCode: '30',deptName: '门诊部',taskPhase: '1',planStartTime: '2026-08-10',planEndTime: '2026-08-11'},{deptId: '8',deptCode: '30',deptName: '门诊部',taskPhase: '2',planStartTime: '2026-08-10',planEndTime: '2026-08-11'},{deptId: '5',deptCode: '1001',deptName: '党政综合办公室',taskPhase: '1',planStartTime: '2026-08-10',planEndTime: '2026-08-11'},{deptId: '5',deptCode: '1001',deptName: '党政综合办公室',taskPhase: '2',planStartTime: '2026-08-10',planEndTime: '2026-08-11'},{deptId: '6',deptCode: '1002',deptName: '组织人事部',taskPhase: '1',planStartTime: '2026-08-10',planEndTime: '2026-08-11'},{deptId: '6',deptCode: '1002',deptName: '组织人事部',taskPhase: '2',planStartTime: '2026-08-10',planEndTime: '2026-08-11'}]

    /** 按 deptId 分组（deptId 重复 taskList.length 次） */
    const deptMap = new Map<string, RequestAddBudgetTaskStage[]>()
    arr.forEach(item => {
      const { deptId } = item
      if (!deptMap.has(deptId)) deptMap.set(deptId, [])
      deptMap.get(deptId)!.push(item)
    })

    const groups = [...deptMap.values()]

    /** deptList: 去重后的科室 */
    form.deptList = groups.map(group => {
      const { deptId, deptCode, deptName } = group[0]
      return { deptId, deptCode, deptName }
    })

    /** taskList: 取第一组的任务数据（所有科室共享同一套任务） */
    form.taskList = groups[0].map(({ taskPhase, planStartTime, planEndTime }) => ({
      taskPhase,
      planStartTime,
      planEndTime
    }))
  }
```

