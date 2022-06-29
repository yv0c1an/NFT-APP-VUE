import { defineStore } from "pinia"
import axios from "../axios"

const helpStore = defineStore({
    // 每个 store 的 id 必须唯一
    id: 'helpStore',
    // state 表示数据源
    state: () => ({
        help_list: []
    }),
    getters: {

    },
    actions: {
        help_add (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('help', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        help_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('help_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        help_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('help', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        help_lists (payload) {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('help', {
                    params: payload
                }).then(response => {
                    t.help_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default helpStore
