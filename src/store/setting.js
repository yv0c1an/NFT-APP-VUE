import { defineStore } from "pinia"
import axios from "../axios"

const settingStore = defineStore({
    // 每个 store 的 id 必须唯一
    id: 'settingStore',
    // state 表示数据源
    state: () => ({

    }),
    getters: {

    },
    actions: {
        setting_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('setting_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        get_setting (payload) {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('setting', {
                    params: payload
                }).then(response => {
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default settingStore
