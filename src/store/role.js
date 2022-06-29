import { defineStore } from "pinia"
import axios from "../axios"

const roleStore = defineStore({
    // 每个 store 的 id 必须唯一
    id: 'roleStore',
    // state 表示数据源
    state: () => ({
        role_list: []
    }),
    getters: {

    },
    actions: {
        roles_add (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('roles', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        roles_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('roles_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        roles_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('roles', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        roles_lists () {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('roles').then(response => {
                    t.role_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default roleStore
