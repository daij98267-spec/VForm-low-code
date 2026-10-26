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
    labelAlign:string
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
        labelAlign:'label-left-align',
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

