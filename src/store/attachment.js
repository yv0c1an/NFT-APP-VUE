import { defineStore } from "pinia"
import axios from "../axios"

const AttachmentStore = defineStore({
    // 每个 store 的 id 必须唯一
    id: 'AttachmentStore',
    // state 表示数据源
    state: () => ({

    }),
    getters: {

    },
    actions: {
        attachment_lists (payload) {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('attachment', {
                    params: payload
                }).then(response => {
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        attachment_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('attachment_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        attachment_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('attachment', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
    }
})

export default AttachmentStore
