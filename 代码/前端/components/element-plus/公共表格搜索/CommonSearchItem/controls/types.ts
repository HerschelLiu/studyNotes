import type { Component } from 'vue'

/** 所有搜索控件统一接收的属性（v-model 由 defineModel 接管） */
export interface ControlProps {
  /** 由 CommonSearchItem 解析好的透传属性 */
  controlProps?: Record<string, any>
  /** 选项数据，select 类控件使用 */
  options?: Record<string, any>[]
  optionKey?: string
  optionLabel?: string
  changeFn?: (val: any) => void
}

/** 控件注册表条目 */
export interface ControlDefinition {
  component: Component
}
