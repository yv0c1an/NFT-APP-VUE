import { defineStore } from "pinia"
import axios from "../axios"

const pageStore = defineStore({
    // 每个 page 的 id 必须唯一
    id: 'pageStore',
    // state 表示数据源
    state: () => ({
        page_list: []
    }),
    getters: {

    },
    actions: {
        page_add (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('page', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        page_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('page_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        page_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('page', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        page_lists () {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('page').then(response => {
                    t.page_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default pageStore
