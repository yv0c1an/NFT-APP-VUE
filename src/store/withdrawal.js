import { defineStore } from "pinia"
import axios from "../axios"

const withdrawalStore = defineStore({
    // 每个 withdrawal 的 id 必须唯一
    id: 'withdrawalStore',
    // state 表示数据源
    state: () => ({
        withdrawal_list: []
    }),
    getters: {

    },
    actions: {
        withdrawal_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('withdrawal_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        withdrawal_lists () {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('withdrawal').then(response => {
                    t.withdrawal_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default withdrawalStore
