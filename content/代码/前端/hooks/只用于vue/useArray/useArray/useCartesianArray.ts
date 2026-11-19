/** 具名维度 */
export interface CartesianField<V = any> {
  name: string
  data: V[]
}

export type CartesianRow = Record<string, any>

export type CartesianRowFactory<Row = CartesianRow> = (...items: any[]) => Row | Row[]

/**
 * 取值器
 * 例：useCartesianArray([a, a => a.b])
 */
export type CartesianResolver = (prevItem: any) => any[] | undefined

export type CartesianDimension = any[] | CartesianField | CartesianResolver

/** 是否为具名维度 */
const isCartesianField = (dim: CartesianDimension): dim is CartesianField =>
  !!dim && !Array.isArray(dim) && typeof dim === 'object' && typeof dim.name === 'string' && Array.isArray(dim.data)

/** 判断是否为普通对象（非 null、非数组） */
const isRecord = (value: any): value is CartesianRow => !!value && typeof value === 'object' && !Array.isArray(value)

/** 把单个维度解析成候选值数组 */
const resolveDimension = (dim: CartesianDimension, prevItem: any): any[] => {
  const data = typeof dim === 'function' ? dim(prevItem) : isCartesianField(dim) ? dim.data : dim
  return data ?? []
}

/**
 * 通用笛卡尔积
 * @param dimensions 维度列表，顺序即组合顺序
 * @param newRow     行工厂（可选）
 * @param base       每行追加的公共属性（可选）
 * @returns 所有组合拼装成的笛卡尔积数组
 */
export const useCartesianArray = <Row = CartesianRow>(
  dimensions: CartesianDimension[],
  newRow?: CartesianRowFactory<Row>,
  base?: CartesianRow
): Row[] => {
  if (!dimensions?.length) return []

  // 笛卡尔积数组
  const tuples = dimensions.reduce<any[][]>(
    (partials, dim) => partials.flatMap(values => resolveDimension(dim, values.at(-1)).map(value => [...values, value])),
    [[] as any[]]
  )

  const hasBase = !!base && Object.keys(base).length > 0

  /** 格式化返回数组的格式 */
  return tuples.flatMap((values): any => {
    /** 模板模式 */
    if (newRow) {
      const result = newRow(...values)
      const rows = Array.isArray(result) ? result : [result]
      return hasBase ? rows.map(row => (isRecord(row) ? { ...base, ...row } : row)) : rows
    }

    /** 合并模式 */
    const row: CartesianRow = { ...base }
    dimensions.forEach((dim, index) => {
      const value = values[index]
      if (isCartesianField(dim)) {
        row[dim.name] = value
      } else if (value && typeof value === 'object') {
        Object.assign(row, value)
      } else {
        throw new Error(
          `useCartesianArray: 第 ${index} 个维度的值是基本类型（${String(value)}），无法写入对象行。` +
            `请改用 { name: '字段名', data: [...] } 或传入 newRow。`
        )
      }
    })
    return [row]
  }) as Row[]
}
