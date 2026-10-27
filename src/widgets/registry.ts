import SelectWidget from './field/select-widget.vue'
import TextareaWidget from './field/textarea-widget.vue'
import InputWidget from './field/input-widget.vue'
import RadioWidget from './field/radio-widget.vue'
import CheckboxWidget from './field/checkbox-widget.vue'
import DatePickerWidget from './field/datepicker-widget.vue'
import SliderWidget from './field/slider-widget.vue'
import SwitchWidget from './field/switch-widget.vue'
import type { WidgetOptions, Widget } from '../utils/type.ts'
//映射表，左边的字符串对应右边的组件，以后渲染表拿到form1.ts中组件对象的type，会根据字符串与这个映射表中的组件对应起来
//这个负责渲染组件的映射表，渲染器根据这个映射表，渲染到画布上
 export const basicFields: Record<string, any> = {
    select: SelectWidget,
    textarea: TextareaWidget,
    input: InputWidget,
    radio: RadioWidget,
    checkbox: CheckboxWidget,
    datepicker: DatePickerWidget,
    slider: SliderWidget,
    switch: SwitchWidget,
}
//导出一张label、type的映射表
//这个负责点击组件的时候，根据type，弄成一个对象，放到formJson.widgetList里
//加入显式必填选项
export const basicFieldsLabel:  {formItemFlag: boolean;category?: string;children?:Widget[]; type: string; options: Omit<WidgetOptions, 'name'> }[]= [
    {formItemFlag:true,type:'select',options:{placeholder:'请选择性别',
        optionItems: [{ label: '男', value: '男' }, { label: '女', value: '女' }],
        label:'下拉选择',required:true}},    
    {formItemFlag:true,type:'textarea',options:{placeholder:'请输入描述',label:'文本域',required:true}},
    {formItemFlag:true,type:'input',options:{placeholder:'请输入姓名',label:'输入框',required:true}},
    {formItemFlag:true,type:'radio',options:{placeholder:'请选择性别',
        optionItems: [{ label: '男', value: '男' }, { label: '女', value: '女' }],
        label:'单选框',required:true}},
    {formItemFlag:true,type:'checkbox',options:{placeholder:'请选择爱好',
        optionItems: [{ label: '篮球', value: '篮球' }, { label: '足球', value: '足球' }],
        label:'复选框',required:true}},
    {formItemFlag:true,type:'datepicker',options:{placeholder:'请选择日期',label:'日期选择器',required:true}},
    {formItemFlag:true,type:'slider',options:{label:'滑动选择器',sliderItems:{
        min:0,
        max:100,
        step:1,
    },required:true}},
    {formItemFlag:true,type:'switch',options:{label:'开关',switchItems:{
        activeValue:true,
        inactiveValue:false
    },required:true}},
    { type: 'grid', options: { label: '栅格容器', cols: 2 }, formItemFlag: false, category: 'container', children: [] }
]

