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
