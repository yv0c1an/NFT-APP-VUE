<template>
    <el-aside id="sidebar" class="scrollbar">
        <div class="sidebar_top">
            <div class="logo"><img src="../assets/images/avt-12.jpeg" /></div>
            <div class="sidebar_item" v-for="item in menu">
                <router-link :to="{name: items.path}" v-for="items in item">
                    <i class="iconfont" :class="items.icon"></i>
                    <span>{{items.title}}</span>
                </router-link>
            </div>
        </div>
        <div class="sidebar_bottom">
            <div class="item">
                <i class="iconfont icon-tanhao"></i>
            </div>
        </div>
    </el-aside>
    <el-main id="main">
        <div class="main_side" :class="{'isCollapse':!isCollapse}" v-if="menus?.children && menus.children.length > 0">
            <div class="main_header">
                <h2>{{menus?.title}}管理</h2>
            </div>
            <div class="main_body">
                <el-menu
                    class="main_side_menu"
                    :default-active="defaultActive"
                    router
                >
                    <el-menu-item :index="item.path" v-for="item in menus.children"><i class="iconfont" :class="item.icon"></i><span>{{item.title}}</span></el-menu-item>
                </el-menu>
            </div>
        </div>
        <div class="main_con">
            <div class="main_header">
                <div class="main_header_left">
                    <div v-if="menus?.children && menus.children.length > 0" class="open" @click="isCollapse = !isCollapse"><i class="iconfont" :class="isCollapse?'icon-shouqi':'icon-zhankai'"></i></div>
                </div>
                <div class="main_header_right"></div>
            </div>
            <div class="main_body h100 overflow-y-auto">
                <router-view />
            </div>
        </div>
    </el-main>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import store from '../store'
const route = useRoute()
const authStore = store.authStore()
const isCollapse = ref(true)
const defaultActive = ref(route.name)
let menu = computed(()=>authStore.menu)
let menus = ref([])

onBeforeRouteUpdate((to) => {
    menus.value = []
    defaultActive.value = to.name
    setChildrenMenu()
})

const setChildrenMenu = ()=>{
    for (const item of menu.value) {
        for (const item1 of item) {
            if(!item1?.children){
                continue
            }
            const curMenu1 = item1.children.find(item=>item.path == defaultActive.value)
            if(curMenu1){
                menus.value = item1
                break
            }
        }
    }
}
setChildrenMenu()


</script>

<style scoped lang="scss">
#main{
    display: flex;
    padding: 0;
    height: 100%;
}
#sidebar{
    width: 95px;
    background: var(--el-color-primary);
    color: #fff;
    padding: 20px 0;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    .logo{
        width: 50px;
        height: 50px;
        background: #fff;
        border-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        overflow: hidden;
        img{
            width: auto;
            height: 100%;
        }
    }
    .item{
        width: 55px;
        height: 55px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 17px;
        .iconfont{
            font-size: 22px;
        }
        &:hover{
            background: var(--el-color-primary-light-3);
        }
    }
    .sidebar_top,.sidebar_bottom{
        display: flex;
        flex-flow: column;
        align-items: center;
    }
    .sidebar_item{
        padding: 15px 0;
        font-size: 13px;
        border-bottom: 1px solid #3e93f1;
        &:last-child{
            border-bottom: none;
        }
        a{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 6px 12px;
            margin-bottom: 7px;
            color: #fff;
            border-radius: 5px;
            &.router-link-active{
                background: var(--el-color-primary-light-3);
            }
            &:hover{
                background: var(--el-color-primary-light-3);
            }
        }
        .iconfont{
            font-size: 17px;
        }
        span{
            margin-left: 5px;
        }
    }
}
</style>
