`npm i validing`

```ts
import validing from 'validing'
import { reactive } from 'vue'

import { isArray, isHaveValue, isPhone } from '@/hooks/useValidate'

interface RulesOptions {
  key: string
  type?: 'text' | 'upload' | 'checked'
  label?: string
  message?: string
  required?: boolean
  trigger?: string[]
}

function getMessage(type: RulesOptions['type']) {
  switch (type) {
    case 'text':
    default:
      return '必填'
    case 'upload':
      return '必传'
    case 'checked':
      return '必选'
  }
}

/**
 * 创建rules，非响应式
 * @param options 要插入的规则，key是字段名，type是类型，message是错误提示，required是是否必填，trigger是触发器
 * @param haveRules 后置的规则，前面有key时会追加，否则补充值，可以是对象，也可以是数组，key值是要插入的key
 * @returns element-plus的rules
 */
export function useRules(options: RulesOptions[], haveRules?: { [key: string]: any }) {
  const rules: AnyObject = {}
  options.forEach(item => {
    rules[item.key] = [
      {
        required: item.required ?? true,
        message: item.message ?? `${item.label || ''}${getMessage(item.type)}`,
        trigger: item.trigger ?? ['blur', 'change']
      }
    ]
  })
  if (haveRules) {
    for (const key in haveRules) {
      if (Reflect.has(rules, key)) {
        if (isArray(haveRules[key])) rules[key] = [...rules[key], ...haveRules[key]]
        else rules[key] = [...rules[key], haveRules[key]]
      } else rules[key] = haveRules[key]
    }
  }

  return reactive(rules)
}

/** 校验价格 */
export const useValidatePrice = (tip = '金额格式不正确') => {
  return {
    validator: validing.rules.validateNumber({ required: false, range: '[0,-]', decimal: 0, tip }),
    trigger: ['blur']
  }
}

/** 校验折扣 */
export const useValidateOff = (tip = '折扣格式不正确') => {
  return {
    validator: validing.rules.validateNumber({ required: false, range: '[0,100]', decimal: 0, tip }),
    trigger: ['blur']
  }
}

/** 校验重量 */
export const useValidateWeight = (tip = '重量格式不正确', includeZero = true) => {
  return {
    validator: validing.rules.validateNumber({ required: false, range: includeZero ? '[0,-)' : '(0,-)', decimal: 2, tip }),
    trigger: ['blur']
  }
}

/** 校验体积 */
export const useValidateVolume = (tip = '体积格式不正确', includeZero = true) => {
  return {
    validator: validing.rules.validateNumber({ required: false, range: includeZero ? '[0,10000000000)' : '(0,10000000000)', decimal: 0, tip }),
    trigger: ['blur']
  }
}

/** 校验数量，正整数 */
export const useValidateCount = (tip = '数量格式不正确，只能输入大于0的正整数', includeZero = false) => {
  return {
    validator: validing.rules.validateNumber({ required: false, range: includeZero ? '[0,-)' : '(0,-)', decimal: 0, tip }),
    trigger: ['blur']
  }
}

/** 校验手机号码 */
export const useValidateMobile = (tip = '手机号码格式不正确') => {
  return {
    validator: validing.rules.validatePhone({ required: true, type: 1, tip }),
    trigger: ['blur']
  }
}

/** 校验电话号码 */
export const useValidatePhone = (rule: any, value: any, callback: any) => {
  if (isPhone(value) || !isHaveValue(value)) {
    callback()
    return
  }
  callback(new Error('电话号码格式不正确'))
}

/** 校验配置编码 */
export const validCode = (rule: any, value: any, callback: any) => {
  if (/^[a-zA-Z\d_-]{3,20}$/.test(value)) {
    callback()
    return
  }
  callback(new Error('配置编码格式不正确，3-20位数字英文组合'))
}

/** 校验sku编码 */
export const validSkuCode = (rule: any, value: any, callback: any) => {
  if (/^[a-zA-Z\d-]{1,50}$/.test(value)) {
    callback()
    return
  }
  callback(new Error('sku编码格式不正确，1-50位数字英文或中横线组合'))
}

/** 校验版本号 */
export const validateVersion = (v1: string, v2: string) => {
  if (!v1 || !v2) return false
  const [a1, b1, c1] = v1.split('.')
  const [a2, b2, c2] = v2.split('.')
  if (!(Number(a1) > Number(a2) || Number(b1) > Number(b2) || Number(c1) > Number(c2)) && v1 !== v2) {
    return false
  }
  return true
}

/** 校验网址集 */
export const validateWebsite = (rule: any, value: any, callback: any) => {
  const domains = value.split(';').filter((item: string) => isHaveValue(item))
  if (domains.every((item: string) => item.startsWith('https://') && domains.every((item: string) => !item.endsWith('/')))) {
    callback()
    return
  }
  callback(new Error('域名格式不正确'))
}
export const validateWss = (rule: any, value: any, callback: any) => {
  const domains = value.split(';').filter((item: string) => isHaveValue(item))
  if (domains.every((item: string) => item.startsWith('wss://') && domains.every((item: string) => !item.endsWith('/')))) {
    callback()
    return
  }
  callback(new Error('域名格式不正确'))
}
export const validateUdp = (rule: any, value: any, callback: any) => {
  const domains = value.split(';').filter((item: string) => isHaveValue(item))
  if (domains.every((item: string) => item.startsWith('udp://') && domains.every((item: string) => !item.endsWith('/')))) {
    callback()
    return
  }
  callback(new Error('域名格式不正确'))
}
export const validateTcp = (rule: any, value: any, callback: any) => {
  const domains = value.split(';').filter((item: string) => isHaveValue(item))
  if (domains.every((item: string) => item.startsWith('tcp://') && domains.every((item: string) => !item.endsWith('/')))) {
    callback()
    return
  }
  callback(new Error('域名格式不正确'))
}

```

