import type { App, Plugin } from 'vue'

import CompForm from './CompForm.vue'
import CompFormItem from './Item.vue'

// 让 CompForm 兼具 Vue 插件能力：既能 import 局部用，又能 app.use() 全局注册
;(CompForm as Plugin & typeof CompForm).install = (app: App) => {
  app.component('CompForm', CompForm)
  app.component('CompFormItem', CompFormItem)
}

export { CompForm, CompFormItem }
export default CompForm
