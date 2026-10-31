import type { Widget } from '../utils/type.ts'
import { onMounted } from 'vue'

export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 8)
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`
}


export function deepClone(obj: any): any {
  if(obj==null){
    return null
  }
  if(Array.isArray(obj)){
    let newobj: any[] = []
    obj.forEach((item: any) => newobj.push(deepClone(item)))
    return newobj
  }
  else if(typeof obj==='object'){
    let newobj: any = {}
    for(let key in obj){
        newobj[key] = deepClone(obj[key])
    }
    return newobj
  }
  else{
    return obj
  }
}

interface FormConfig{
    modelName:string
    refName:string
    rulesName:string
    labelWidth:number
    labelPosition:string
    size:string
    cssCode:string  
    customClass:any[]
    functions:string
    layoutType:string
    jsonVersion:number
    onFormCreated:string
    onFormMounted:string
    onFormDataChange:string
}
export function getDefaultFormConfig():FormConfig{
    return {
        modelName:'formData',
        refName:'vForm',
        rulesName:'rules',
        labelWidth:80,
        labelPosition:'left',
        size:'',
        cssCode:'',
        customClass:[],
        functions:'',
        layoutType:'PC',
        jsonVersion:3,
        onFormCreated:'',
        onFormMounted:'',
        onFormDataChange:''
    }
}

export function buildDefaultFormJson(){
    return{
        widgetList: [],
        formConfig: deepClone(getDefaultFormConfig())
    }
}
//根据控件类型返回校验规则
export function getRules(widget: Widget) {
    if (widget.options.required===true) {
      const trigger = ['input', 'textarea'].includes(widget.type) ? 'blur' : 'change'
      return [{ required: true, message: widget.options.requiredHint || '请输入' + widget.options.label, trigger }]
    }
    return []
  }
//formData里的值加上一个默认值
export function useFieldDefault(formData: Record<string, any>, widget: Widget){
  onMounted(()=>{
    if(formData[widget.options.name]===undefined&&widget.options.defaultValue!==undefined){
      formData[widget.options.name] =deepClone(widget.options.defaultValue)
    }
  })
}