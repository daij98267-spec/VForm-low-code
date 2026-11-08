// 生成 N 个字段的大表单测试 JSON，用于压测「导入→渲染」性能
// 用法：node gen-big-form.cjs 1000   （不传参数默认 1000）
const fs = require('fs')
const path = require('path')

const count = parseInt(process.argv[2], 10) || 1000

// input / textarea 是最简单的两种，不需要额外配置（optionItems/sliderItems 等），不会因缺字段报错
const types = ['input', 'textarea']

const widgetList = []
for (let i = 0; i < count; i++) {
  widgetList.push({
    formItemFlag: true,
    type: types[i % types.length],
    id: 'field_' + i,           // 唯一，draggable 的 item-key 靠它
    options: {
      label: '字段' + i,
      name: 'field' + i,        // 唯一，el-form 的 prop / formData 的 key 靠它
      placeholder: '请输入',
      defaultValue: '',
      required: false
    }
  })
}

const json = {
  widgetList,
  formConfig: { labelWidth: 80, labelPosition: 'left', size: '' }
}

const outPath = path.join(__dirname, `big-form-${count}.json`)
fs.writeFileSync(outPath, JSON.stringify(json, null, 2), 'utf8')
console.log('已生成：' + outPath)
console.log('字段数：' + widgetList.length)
