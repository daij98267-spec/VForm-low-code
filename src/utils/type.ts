  // 下拉选项的一项
  export type FieldOption = {
    label: string
    value: string
  }
  // 每个控件的可编辑配置（那个"盒子"）
  export type WidgetOptions = {
    label: string          // 显示名，给人看
    name: string           // 字段名，formData 的 key，给机器看
    placeholder?: string
    required?:boolean  // 是否必填
    optionItems?: FieldOption[]   // 只有 selecth和Radio,checkbox类才有
    sliderItems?:SliderOption//滑块的选项
    switchItems?:SwitchOption//开关的选项
  }

  // 一个完整控件
  export type Widget = {
    id: string
    type: string
    options: WidgetOptions
    category?: string
    formItemFlag?: boolean
    icon?: string
    children?: Widget[][]
  }
  // 单选框的选项
  export type RadioOption = {
    label: string
    value: string
  }
  //滑块的选项
  export type SliderOption={
    min: number
    max: number
    step: number
  }
  //开关的选项
  export type SwitchOption={
    activeValue?: boolean
    inactiveValue?: boolean
  }