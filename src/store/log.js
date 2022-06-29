import { defineStore } from "pinia"
import axios from "../axios"

const logStore = defineStore({
    // 每个 store 的 id 必须唯一
    id: 'logStore',
    // state 表示数据源
    state: () => ({
        log_list: []
    }),
    getters: {

    },
    actions: {
        log_lists (payload) {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('log', {
                    params: payload
                }).then(response => {
                    t.log_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default logStore
