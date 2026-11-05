import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({          // ① 造一个「配置好的实例」
    baseURL: 'http://localhost:3000',     //    后端地址写一次，以后只写路径
    timeout: 10000,                       //    10 秒超时自动报错
})

request.interceptors.response.use(      // ② 响应拦截器：每个响应都会经过
    response => response,                 //    成功：原样放行（数据在 response.data）
    error => {                            //    失败：统一处理
        ElMessage.error('请求失败：' + (error.message || '网络错误'))
        return Promise.reject(error)        // ③ 关键：要把错误继续抛出去，调用处才能 catch 到
    }
)

export default request