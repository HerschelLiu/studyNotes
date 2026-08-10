export interface TableColumn {
    key: string
    title: string
    width?: string
    fixed?: 'left' | 'right'
    align?: 'left' | 'center' | 'right'
    slot?: boolean // 是否使用自定义插槽
    formatter?: (row: any) => string // 自定义格式化
    buttons?: { label: string; type: 'primary' | 'success' | 'warning' | 'danger'; click: (row: any) => void }[] // 操作按钮配置
}