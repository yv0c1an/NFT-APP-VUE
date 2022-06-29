import { defineStore } from "pinia"
import axios from "../axios"

const AttachmentGroupStore = defineStore({
    // 每个 store 的 id 必须唯一
    id: 'AttachmentGroupStore',
    // state 表示数据源
    state: () => ({
        attachment_group_list: []
    }),
    getters: {

    },
    actions: {
        attachment_group_add (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('attachment_group', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        attachment_group_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('attachment_group_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        attachment_group_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('attachment_group', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        attachment_group_lists () {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('attachment_group').then(response => {
                    t.attachment_group_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default AttachmentGroupStore
