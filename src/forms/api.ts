import request from '../utils/request'

export const getForms=async()=>{
    const res=await request.get('/forms')
    return res.data
}
export const getFormDetail=async(id:string)=>{
    const res=await request.get(`/forms/${id}`)
    console.log(res.data)
    return res.data
}
export const createForm=async(title:string)=>{
    const res=await request.post('/forms',{title})
    return res.data
}
//点保存，存到form里
export const saveForm=async(id:string,formJson:string)=>{
    const res=await request.put(`/forms/${id}`,{formJson})
    return res.data
}
//点提交按钮，把formData存到submission表里
export const submitForm=async(id:string,formData:string)=>{
    const res=await request.post(`/forms/${id}/submit`,{formData})
    return res.data
}
//查看提交记录
export const getSubmissions=async(id:string)=>{
    const res=await request.get(`/forms/submissions/${id}`)
    return res.data
}
