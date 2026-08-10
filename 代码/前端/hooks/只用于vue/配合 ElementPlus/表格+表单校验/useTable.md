```ts
/**
 * 根据 cellRules 中 required 项自动渲染带红色星号的表头
 * @param cellRules 单元格校验规则对象（
 * @returns renderRequiredHeader 渲染函数、getCellRules 获取规则函数
 */
export const useTableForm = <T extends Record<string, any>>(cellRules: T) => {
  /** 获取指定字段的校验规则 */
  const getCellRules = (fieldName: keyof T) => {
    return cellRules[fieldName]
  }

  /**
   * 渲染表头：根据该字段 rules 中是否存在 required: true 自动显示红色星号
   * @param label 列标题
   * @param fieldName 对应 cellRules 中的 key
   * @returns el-table-column 的 render-header 函数
   */
  const renderRequiredHeader = (label: string, fieldName: keyof T) => {
    return () => {
      const fieldRules = (cellRules[fieldName] as any[]) || []
      const isRequired = fieldRules.some((r: any) => r.required)
      return isRequired
        ? h('span', [
            h(
              'span',
              {
                style: {
                  color: 'var(--el-color-danger)',
                  marginRight: '4px'
                }
              },
              '*'
            ),
            label
          ])
        : h('span', label)
    }
  }

  return {
    /** 获取指定字段的校验规则 */
    getCellRules,
    /** 渲染带必填星号的表头 */
    renderRequiredHeader
  }
}

```

