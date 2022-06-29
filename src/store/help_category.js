import { defineStore } from "pinia"
import axios from "../axios"

const helpCategoryStore = defineStore({
    // 每个 store 的 id 必须唯一
    id: 'helpCategoryStore',
    // state 表示数据源
    state: () => ({
        help_category_list: []
    }),
    getters: {

    },
    actions: {
        help_category_add (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('help_category', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        help_category_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('help_category_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        help_category_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('help_category', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        help_category_lists (payload) {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('help_category', {
                    params: payload
                }).then(response => {
                    t.help_category_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default helpCategoryStore
