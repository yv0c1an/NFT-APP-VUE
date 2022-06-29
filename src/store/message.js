import { defineStore } from "pinia"
import axios from "../axios"

const messageStore = defineStore({
    // 每个 message 的 id 必须唯一
    id: 'messageStore',
    // state 表示数据源
    state: () => ({
        message_list: []
    }),
    getters: {

    },
    actions: {
        message_add (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('message', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        message_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('message', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        message_lists () {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('message').then(response => {
                    t.message_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default messageStore
