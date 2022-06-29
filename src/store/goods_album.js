import { defineStore } from "pinia"
import axios from "../axios"

const goodsAlbumStore = defineStore({
    // 每个 store 的 id 必须唯一
    id: 'goodsAlbumStore',
    // state 表示数据源
    state: () => ({
        goods_album_list: []
    }),
    getters: {

    },
    actions: {
        goods_album_add (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('goods_album', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        goods_album_update (payload) {
            return new Promise((resolve,reject) =>{
                axios.post('goods_album_update', payload).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        goods_album_del (payload) {
            return new Promise((resolve,reject) =>{
                axios.delete('goods_album', {
                    params: payload
                }).then(response => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        goods_all_album_lists (payload) {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('goods_all_album', {
                    params: payload
                }).then(response => {
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        goods_album_lists (payload) {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('goods_album', {
                    params: payload
                }).then(response => {
                    t.goods_album_list = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default goodsAlbumStore
