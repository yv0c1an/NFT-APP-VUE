import { defineStore } from "pinia"
import axios from "../axios"

const permissionStore = defineStore({
    // 每个 store 的 id 必须唯一
    id: 'permissionStore',
    // state 表示数据源
    state: () => ({
        permission_list: [],
        permission_parent_list: [],
        permission_tree_list: []
    }),
    getters: {

    },
    actions: {
        permission(payload) {
            return new Promise((resolve,reject) =>{
                axios.post('permission', payload).then((response) => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        permission_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('permission_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        permission_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('permission', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        permission_lists (payload) {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('permission?id='+payload.id, payload).then(response => {
                    if(payload.id > 0){
                        t.permission_list = response.data
                    }else{
                        t.permission_parent_list = response.data
                    }
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        permission_tree_lists () {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('permission_tree_lists').then(response => {
                    t.permission_tree_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default permissionStore
