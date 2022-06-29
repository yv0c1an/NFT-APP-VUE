import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        redirect: {name: 'login'}
    },
    {
        path: '/sign',
        name: 'sign',
        component: () => import("@views/sign/Base.vue"),
        children: [
            {
                path: '/login',
                name: 'login',
                component: () => import("@views/sign/Login.vue")
            }
        ]
    },
    {
        path: '/main',
        name: 'main',
        component: () => import("@views/main.vue"),
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import("@views/dashboard/Index.vue")
            },
            {
                path: '/goods',
                name: 'goods',
                component: () => import("@views/goods/index.vue")
            },
            {
                path: '/page',
                name: 'page',
                component: () => import("@views/page.vue")
            },
            {
                path: '/message',
                name: 'message',
                component: () => import("@views/message.vue")
            },
            {
                path: '/announcement',
                name: 'announcement',
                component: () => import("@views/announcement.vue")
            },
            {
                path: '/help',
                name: 'help',
                component: () => import("@views/help.vue")
            },
            {
                path: '/order',
                name: 'order',
                component: () => import("@views/empty.vue"),
                redirect: {name: 'market_order'},
                children: [
                    {
                        path: '/market_order',
                        name: 'market_order',
                        component: () => import("@views/order/Index.vue"),
                    }
                ]
            },
            {
                path: '/withdrawal',
                name: 'withdrawal',
                component: () => import("@views/withdrawal.vue")
            },
            {
                path: '/recharge',
                name: 'recharge',
                component: () => import("@views/recharge.vue")
            },
            {
                path: '/auth',
                name: 'auth',
                component: () => import("@views/auth.vue")
            },
            {
                path: '/account',
                name: 'account',
                component: () => import("@views/account.vue")
            },
            {
                path: '/system',
                name: 'system',
                component: () => import("@views/empty.vue"),
                redirect: {name: 'users'},
                children: [
                    {
                        path: '/permission',
                        name: 'permission',
                        component: () => import("@views/system/Permission.vue")
                    },
                    {
                        path: '/role',
                        name: 'role',
                        component: () => import("@views/system/Role.vue")
                    },
                    {
                        path: '/users',
                        name: 'users',
                        component: () => import("@views/system/users/index.vue")
                    },
                    {
                        path: '/setting',
                        name: 'setting',
                        component: () => import("@views/system/setting/Base.vue")
                    },
                    {
                        path: '/log',
                        name: 'log',
                        component: () => import("@views/system/Log.vue")
                    }
                ]
            }
        ]
    },
    {
        path: '/404',
        name: '404',
        component: () => import("@views/404.vue")
    },
    {
        path: '/:pathMatch(.*)',
        redirect: {name: '404'}
    }
]
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router
