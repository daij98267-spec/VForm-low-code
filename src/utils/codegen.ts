import type { Widget } from './type.ts'
import { collectFields } from './tree.ts'
// 这是死的源码文本，跟 renderer 里 <component :is> 的活组件是两回事。
function generateFieldComponent(widget: Widget, indent: string): string {
    const o = widget.options
    switch (widget.type) {
        case 'input':
            return `${indent}<el-input v-model="formData.${o.name}" placeholder="${o.placeholder || ''}" />`

        case 'textarea':
            return `${indent}<el-input type="textarea" v-model="formData.${o.name}" placeholder="${o.placeholder ||
                ''}" />`

        case 'select': {
            const opts = (o.optionItems || [])
                .map((it) => `${indent}  <el-option label="${it.label}" value="${it.value}" />`)
                .join('\n')
            return `${indent}<el-select v-model="formData.${o.name}" placeholder="${o.placeholder || ''}">
  ${opts}
  ${indent}</el-select>`
        }

        case 'radio': {
            const opts = (o.optionItems || [])
                .map((it) => `${indent}  <el-radio label="${it.label}" value="${it.value}"
  key="${it.value}">${it.label}</el-radio>`)
                .join('\n')
            return `${indent}<el-radio-group v-model="formData.${o.name}">
  ${opts}
  ${indent}</el-radio-group>`
        }

        case 'checkbox': {
            const opts = (o.optionItems || [])
                .map((it) => `${indent}  <el-checkbox label="${it.label}" value="${it.value}"
  key="${it.value}">${it.label}</el-checkbox>`)
                .join('\n')
            return `${indent}<el-checkbox-group v-model="formData.${o.name}">
  ${opts}
  ${indent}</el-checkbox-group>`
        }

        case 'datepicker':
            return `${indent}<el-date-picker v-model="formData.${o.name}" type="date" placeholder="${o.placeholder ||
                ''}" />`

        case 'switch':
            return `${indent}<el-switch v-model="formData.${o.name}" active-text="开启" inactive-text="关闭" />`

        case 'slider':
            return `${indent}<el-slider v-model="formData.${o.name}" :min="${o.sliderItems?.min || 0}"
  :max="${o.sliderItems?.max || 100}" :step="${o.sliderItems?.step || 1}" />`

        default:
            return `${indent}<el-input v-model="formData.${o.name}" />`
    }
}

// 一个字段 → 一个 <el-form-item>
function generateWidgetCode(widget: Widget, indent: string): string {
    if (widget.formItemFlag === false) {
        return generateContainer(widget, indent)   // ← 就这一行，容器交给 generateContainer
    }
    const o = widget.options
    const c = o.visibleWhen
    const vIf = (c && c.field) ? ` v-if='formData.${c.field} === ${JSON.stringify(c.value)}'` : ''
    return `${indent}<el-form-item label="${o.label || ''}" prop="${o.name}"${vIf}>
  ${generateFieldComponent(widget, indent + '  ')}
  ${indent}</el-form-item>`
}
// 容器（grid/tabs）阶段 D 再做，先跳过，否则 form1 里的 grid 会生成垃圾
function generateContainer(widget: Widget, indent: string): string {
    const cols = widget.children || []
    const childIndent = indent + '  '

    if (widget.type === 'grid') {
        const span = 24 / (cols.length || 1)
        const colBlocks = cols.map((col) =>
            `${childIndent}<el-col :span="${span}">
  ${col.map((child) => generateWidgetCode(child, childIndent + '  ')).join('\n')}
  ${childIndent}</el-col>`
        ).join('\n')
        return `${indent}<el-row :gutter="10">
  ${colBlocks}
  ${indent}</el-row>`
    }

    if (widget.type === 'tabs') {
        const tabBlocks = cols.map((tab, i) => {
            const label = widget.options.tabNames?.[i] ?? ''
            return `${childIndent}<el-tab-pane label="${label}" :name="${i}">
  ${tab.map((child) => generateWidgetCode(child, childIndent + '  ')).join('\n')}
  ${childIndent}</el-tab-pane>`
        }).join('\n')
        return `${indent}<el-tabs>
  ${tabBlocks}
  ${indent}</el-tabs>`
    }

    return `${indent}<!-- 容器 ${widget.type} 暂未支持 -->`
}
// 所有字段包进 <el-form>
 function generateTemplate(widgetList: Widget[]): string {
      const items = widgetList.map((w) => generateWidgetCode(w, '    ')).join('\n')
      return `<template>
    <el-form :model="formData" :label-width="80" :rules="rules">
  ${items}
    </el-form>
  </template>`
  }

// <script setup>：formData 每个字段初始值 = defaultValue ?? ''
// 校验规则
 const VALIDATION_PATTERNS: Record<string, { pattern: string; defaultMessage: string }> = {
      email: {
          pattern: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$',
          defaultMessage: '邮箱格式有误，请重新填写',
      },
      mobilePhone: {
          pattern: '^1[3456789]\\d{9}$',
          defaultMessage: '手机号格式有误，请重新填写',
      },
      number: {
          pattern: '^-?\\d+(\\.\\d+)?$',
          defaultMessage: '请输入数字',
      },
      age: {
          pattern: '^(?:[1-9]\\d?|100)$',
          defaultMessage: '请输入1-99岁',
      },
  }
// 校验规则
   function generateRules(widgetList: Widget[]): string {
      const entries = collectFields(widgetList)
          .map((w) => {
              const o = w.options
              const trigger = ['input', 'textarea'].includes(w.type) ? 'blur' : 'change'
              const ruleArr: string[] = []
              if (o.required === true) {
                  const message = o.requiredHint || '请输入' + o.label
                  ruleArr.push(`{ required: true, message: ${JSON.stringify(message)}, trigger: '${trigger}' }`)
              }
              if (o.validation && VALIDATION_PATTERNS[o.validation]) {
                  const v = VALIDATION_PATTERNS[o.validation]
                  const message = o.validationHint || v.defaultMessage
                  ruleArr.push(`{ pattern: ${JSON.stringify(v.pattern)}, message: ${JSON.stringify(message)}, trigger: '${trigger}' }`)
              }
              return ruleArr.length ? `  ${o.name}: [${ruleArr.join(', ')}]` : ''
          })
          .filter((line) => line !== '')
          .join(',\n')
      if (!entries) return 'const rules = {}'
      return `const rules = {\n${entries}\n}`
  }

    function generateScript(widgetList: Widget[]): string {
        const fields = collectFields(widgetList)
            .map((w) => `  ${w.options.name}: ${JSON.stringify(w.options.defaultValue ?? '')}`)
            .join(',\n')
        return `<script setup>
      import { reactive } from 'vue'

      ${generateRules(widgetList)}

      const formData = reactive({
      ${fields}
      })
      </script>`
    }
// 顶层入口：完整 SFC 字符串
export function generateCode(formJson: { widgetList: Widget[] }): string {
    return `${generateTemplate(formJson.widgetList)}\n\n${generateScript(formJson.widgetList)}\n`
}