import { defineStore } from "pinia"
import axios from "../axios"

const rechargeStore = defineStore({
    // 每个 store 的 id 必须唯一
    id: 'rechargeStore',
    // state 表示数据源
    state: () => ({
        recharge_list: []
    }),
    getters: {

    },
    actions: {
        recharge_lists (payload) {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('recharge', {
                    params: payload
                }).then(response => {
                    t.recharge_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        recharge (payload) {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.post('recharge', payload).then(response => {
                    t.recharge_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default rechargeStore
