//手写一份完整的表单，包含input、textarea、select用于测试啥的
//加上容器嵌套
import {getDefaultFormConfig} from '../src/utils/util'

const widgetList=[]
widgetList.push({
    id:'input_1',
    type:'input',
    options:{
    label:'姓名',
    name:'name',
    placeholder:'请输入姓名',
    required:true,
    defaultValue:''
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
    required:true,
    defaultValue:''
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
      defaultValue:'男',
      label: '性别',
      placeholder: '请选择性别',
      optionItems: [              // ← 下拉的选项列表，住进盒子里，换了个名
        { label: '男', value: '男' },
        { label: '女', value: '女' }
      ],
      required:true
    }
},
{
    id:'container_1',
    type:'grid',
    options:{
        label:'容器',
        name:'container',
    },
    category:'container',
    formItemFlag:false,
    icon:'grid',
    children: [[
       {
        id:'g_input',
        type:'input',
        options:{
        label:'姓名',
        name:'name_1',
        placeholder:'请输入姓名',
        required:true,
        defaultValue:''
        },
        category:'field',
        formItemFlag:true,
        icon:'input'
       },{
        id:'g_textarea',
        type:'textarea',
        options:{
        label:'描述',//给人看
        name:'description_1',//给机器看
        placeholder:'请输入描述',
        required:true,
        defaultValue:''
        },
        category:'field',
        formItemFlag:true,
        icon:'textarea'
       }
      ],
      [
       {
        id:'g_select',
        type:'select',
        options:{
        name:'gender_1',
        defaultValue:'男',
        label: '性别',
        placeholder: '请选择性别',
        optionItems: [
          { label: '男', value: '男' },
          { label: '女', value: '女' }
        ],
        required:true
        },
        category:'field',
        formItemFlag:true,
        icon:'select'
       },{
        id:'g_input1',
        type:'input',
        options:{
        label:'手机号',
        name:'phone_1',
        placeholder:'请输入手机号',
        required:true,
        defaultValue:''
        },
        category:'field',
        formItemFlag:true,
        icon:'input'
       }
      ]
    ]
}
)
//formData是表单数据模型
//导出Json格式
const formJson={
    widgetList,
    formConfig:getDefaultFormConfig()
}
export default formJson
