import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from "./router"
import api from './store'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    //timeout: 1000
})

// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// instance.defaults.headers['X-Requested-With']= 'XMLHttpRequest';

// instance.defaults.transformRequest = [
//     data => {
//         return qs.stringify(data)
//     }
// ]

// axios请求拦截器
instance.interceptors.request.use(
    config => {
        // 如果存在token，在每个请求头加上token
        const l = localStorage.getItem(import.meta.env.VITE_API_STORAGENAME)
        const obj = JSON.parse(l)
        if (typeof obj == 'object' && obj) {
            config.headers.Authorization = 'Bearer '+obj.token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)
// axios响应拦截器
instance.interceptors.response.use(
    response => {
        console.log(response.data)
        if(response.data.code === 301){
            console.log('301')
            //const auth = api.authStore()
            //auth.logout()
            router.replace({ path: '/login' })
        }
        if(response.data.code != 200){
            ElMessage({
                type: 'error',
                message: response.data.msg,
                grouping: true
            })
            return Promise.reject({code: response.data.code, msg: response.data.msg});
        }
        return response.data
    },
    err => {
        //console.log(err.response)
        let msg = err.response?.data?.message ? err.response.data.message : '请求异常'
        ElMessage({
            type: 'error',
            message: msg,
            grouping: true
        })
        return Promise.reject({ code: 0, msg: msg })
    }
)

export default instance
