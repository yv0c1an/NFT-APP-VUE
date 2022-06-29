import { defineStore } from "pinia"
import axios from "../axios"

const authStore = defineStore({
    // 每个 store 的 id 必须唯一
    id: 'authStore',
    // state 表示数据源
    state: () => ({
        user: localStorage.getItem(import.meta.env.VITE_API_STORAGENAME)?JSON.parse(localStorage.getItem(import.meta.env.VITE_API_STORAGENAME)):{},
        menu: [
            [
                // {
                //     path: 'dashboard',
                //     icon: 'icon-yibiaopan',
                //     title: '概览'
                // },
                {
                    path: 'goods',
                    icon: 'icon-mendianshenhe',
                    title: '商品'
                },
                {
                    path: 'market_order',
                    icon: 'icon-dingdan',
                    title: '订单',
                    children: [
                        {
                            path: 'market_order',
                            icon: 'icon-dingdan',
                            title: '支付订单',
                        }
                    ]
                }
            ],
            [
                {
                    path: 'withdrawal',
                    icon: 'icon-dingdan',
                    title: '提现'
                },
                {
                    path: 'recharge',
                    icon: 'icon-dingdan',
                    title: '充值'
                },
                {
                    path: 'auth',
                    icon: 'icon-certified-supplier',
                    title: '实名'
                },
                {
                    path: 'account',
                    icon: 'icon-certified-supplier',
                    title: '绑卡'
                },
            ],
            [
                {
                    path: 'page',
                    icon: 'icon-dingdan',
                    title: '页面'
                },
                {
                    path: 'announcement',
                    icon: 'icon-dingdan',
                    title: '公告'
                },
                {
                    path: 'message',
                    icon: 'icon-dingdan',
                    title: '通知'
                },
                {
                    path: 'help',
                    icon: 'icon-dingdan',
                    title: '帮助'
                }
            ],
            [
                {
                    path: 'system',
                    icon: 'icon-shezhi',
                    title: '系统',
                    children: [
                        {
                            path: 'users',
                            icon: 'icon-Customermanagement',
                            title: '用户管理'
                        },
                        {
                            path: 'permission',
                            icon: 'icon-connections',
                            title: '权限管理'
                        },
                        {
                            path: 'role',
                            icon: 'icon-certified-supplier',
                            title: '角色管理'
                        },
                        {
                            path: 'setting',
                            icon: 'icon-conditions',
                            title: '系统设置'
                        },
                        {
                            path: 'log',
                            icon: 'icon-suggest',
                            title: '操作日志'
                        }
                    ]
                }
            ]
        ]
    }),
    // getters 类似于 computed，可对 state 的值进行二次计算
    getters: {
        // double () {
        //     // getter 中的 this 指向👉 state
        //     return this.count * 2
        // },
        // 如果使用箭头函数会导致 this 指向有问题
        // 可以在函数的第一个参数中拿到 state
        // double: (state) => {
        //     return state.count * 2
        // }
    },
    // actions 用来修改 state
    actions: {
        captcha(payload) {
            return new Promise((resolve,reject) =>{
                axios.post('captcha', payload).then((response) => {
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        login(payload) {
            const t = this
            return new Promise((resolve,reject) =>{
                axios.post('login', payload).then((response) => {
                    localStorage.setItem(import.meta.env.VITE_API_STORAGENAME, JSON.stringify(response.data))
                    t.user = response.data
                    resolve(response.data)
                }).catch(function (error) {
                    reject(error)
                })
            })
        },
        logout(){
            const t = this
            return new Promise((resolve,reject) =>{
                axios.get('logout').then((response) => {
                    localStorage.removeItem(import.meta.env.VITE_API_STORAGENAME)
                    t.user = {}
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            })
        }
    }
})

export default authStore
