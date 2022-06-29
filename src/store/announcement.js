import { defineStore } from "pinia"
import axios from "../axios"

const announcementStore = defineStore({
    // 每个 announcement 的 id 必须唯一
    id: 'announcementStore',
    // state 表示数据源
    state: () => ({
        announcement_list: []
    }),
    getters: {

    },
    actions: {
        announcement_add (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('announcement', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        announcement_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('announcement_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        announcement_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('announcement', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        announcement_lists () {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('announcement').then(response => {
                    t.announcement_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default announcementStore
