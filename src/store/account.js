import { defineStore } from "pinia"
import axios from "../axios"

const accountStore = defineStore({
    // 每个 account 的 id 必须唯一
    id: 'accountStore',
    // state 表示数据源
    state: () => ({
        account_list: []
    }),
    getters: {

    },
    actions: {
        account_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('account_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        account_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('account', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        account_lists () {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('account').then(response => {
                    t.account_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default accountStore
