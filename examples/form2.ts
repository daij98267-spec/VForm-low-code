//个人职业规划表
import {getDefaultFormConfig} from '../src/utils/util'
 const widgetList = [
    {
      id: 'input_1',
      type: 'input',
      options: {
        label: '姓名',
        name: 'name',
        placeholder: '请输入姓名',
        required: true,
        defaultValue: '',
      },
      category: 'field',
      formItemFlag: true,
      icon: 'input',
    },
    {
      id: 'select_1',
      type: 'select',
      options: {
        label: '目标职业',
        name: 'career',
        placeholder: '请选择目标职业',
        defaultValue: '老师',   // 默认选老师，加载后先看到「教的学科」显示着
        required: true,
        optionItems: [
          { label: '老师', value: '老师' },
          { label: '程序员', value: '程序员' },
          { label: '医生', value: '医生' },
        ],
      },
      category: 'field',
      formItemFlag: true,
      icon: 'select',
    },
    {
      id: 'input_2',
      type: 'input',
      options: {
        label: '教的学科',
        name: 'subject',
        placeholder: '请输入所教学科',
        defaultValue: '',
        visibleWhen: { field: 'career', value: '老师' },   // 只有当 career === '老师' 才显示
      },
      category: 'field',
      formItemFlag: true,
      icon: 'input',
    },
    {
      id: 'select_2',
      type: 'select',
      options: {
        label: '编程语言',
        name: 'language',
        placeholder: '请选择编程语言',
        visibleWhen: { field: 'career', value: '程序员' },
        optionItems: [
          { label: 'Java', value: 'Java' },
          { label: 'Python', value: 'Python' },
          { label: 'JavaScript', value: 'JavaScript' },
        ],
      },
      category: 'field',
      formItemFlag: true,
      icon: 'select',
    },
    {
      id: 'select_3',
      type: 'select',
      options: {
        label: '科室',
        name: 'department',
        placeholder: '请选择科室',
        visibleWhen: { field: 'career', value: '医生' },
        optionItems: [
          { label: '内科', value: '内科' },
          { label: '外科', value: '外科' },
          { label: '儿科', value: '儿科' },
        ],
      },
      category: 'field',
      formItemFlag: true,
      icon: 'select',
    },
  ]

const formJson={
    widgetList,
    formConfig:getDefaultFormConfig()
}
export default formJson