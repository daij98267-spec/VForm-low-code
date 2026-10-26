//手写一份完整的表单，包含input、textarea、select用于测试啥的
import {getDefaultFormConfig} from '../src/utils/util'

const widgetList=[]
widgetList.push({
    id:'input_1',
    type:'input',
    options:{
    label:'姓名',
    name:'name',
    placeholder:'请输入姓名',
    required:true
    },
    category:'field',
    formItemFlag:true,
    icon:'input'
},{
    id:'textarea_1',
    type:'textarea',
    options:{
    label:'描述',//给人看
    name:'description',//给机器看
    placeholder:'请输入描述',
    required:true
},
    category:'field',
    formItemFlag:true,
    icon:'textarea'
},{
    type: 'select',
    id: 'select_1',
    category: 'field',
    icon: 'select',
    formItemFlag: true,
    options: {                    // ← 盒子（配置包装对象），所有组件都有
      name: 'gender',
      label: '性别',
      placeholder: '请选择性别',
      optionItems: [              // ← 下拉的选项列表，住进盒子里，换了个名
        { label: '男', value: '男' },
        { label: '女', value: '女' }
      ],
      required:true
    }
})
//formData是表单数据模型
//导出Json格式
const formJson={
    widgetList,
    formConfig:getDefaultFormConfig()
}
export default formJson
