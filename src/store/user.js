import { defineStore } from "pinia"
import axios from "../axios"

const userStore = defineStore({
    // 每个 store 的 id 必须唯一
    id: 'userStore',
    // state 表示数据源
    state: () => ({
        user_list: []
    }),
    getters: {

    },
    actions: {
        user_add (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('user', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        user_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('user_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        user_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('user', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        user_lists (payload) {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('user', {
                    params: payload
                }).then(response => {
                    t.user_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default userStore
