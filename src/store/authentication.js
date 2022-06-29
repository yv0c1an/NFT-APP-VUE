import { defineStore } from "pinia"
import axios from "../axios"

const authenticationStore = defineStore({
    // 每个 authentication 的 id 必须唯一
    id: 'authenticationStore',
    // state 表示数据源
    state: () => ({
        authentication_list: []
    }),
    getters: {

    },
    actions: {
        authentication_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('auth_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        authentication_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('auth', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        authentication_lists () {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('auth').then(response => {
                    t.authentication_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default authenticationStore
