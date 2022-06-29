import { defineStore } from "pinia"
import axios from "../axios"

const configStore = defineStore({
    id: 'configStore',
    // state 表示数据源
    state: () => ({
        file_url: 'http://qqoq-nft.oss-cn-hangzhou.aliyuncs.com/', // 文件域名
        // upload_url: 'http://erp.qqoq.net/api/upload', // 文件上传地址
        upload_url: import.meta.env.VITE_API_URL+'upload', // 文件上传地址
    }),
    getters: {

    },
    actions: {

    }
})

export default configStore
