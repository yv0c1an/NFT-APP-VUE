import { defineStore } from "pinia"
import axios from "../axios"

const goodsStore = defineStore({
    // 每个 goods 的 id 必须唯一
    id: 'goodsStore',
    // state 表示数据源
    state: () => ({
        goods_list: []
    }),
    getters: {

    },
    actions: {
        goods_add (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('goods', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        goods_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('goods_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        goods_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('goods', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        goods_lists (payload) {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('goods', {
                    params: payload
                }).then(response => {
                    //t.goods_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default goodsStore
