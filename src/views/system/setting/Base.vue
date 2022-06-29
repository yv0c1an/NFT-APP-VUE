<template>
    <div class="main_body flex-column">
        <el-menu mode="horizontal" default-active="Info" @select="select" style="padding: 0 20px;">
            <el-menu-item index="Info">品牌信息</el-menu-item>
            <el-menu-item index="Storage">储存设置</el-menu-item>
            <el-menu-item index="Publish">发行设置</el-menu-item>
            <el-menu-item index="Version">版本控制</el-menu-item>
            <el-menu-item index="System">系统设置</el-menu-item>
            <el-menu-item index="Finance">充值提现</el-menu-item>
            <el-menu-item index="Drop">空投设置</el-menu-item>
            <el-menu-item index="Sms">短信设置</el-menu-item>
            <el-menu-item index="AuthCode">验证码</el-menu-item>
            <el-menu-item index="Poster">海报设置</el-menu-item>
            <el-menu-item index="AuthCard">实名认证</el-menu-item>
        </el-menu>
        <div class="main_body flex-column">
            <div class="main_body flex-column overflow-y-auto m main_box" style="padding: 50px 20px 20px !important;">
                <keep-alive>
                    <component :is="componentName"></component>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed, ref, onMounted, reactive, markRaw} from "vue"
import Storage from './Storage.vue'
import Info from './Info.vue'
import Publish from './Publish.vue'
import System from './System.vue'
import Finance from './Finance.vue'
import Drop from './Drop.vue'
import Sms from './Sms.vue'
import AuthCode from './AuthCode.vue'
import Poster from './Poster.vue'
import AuthCard from './AuthCard.vue'
import Version from './Version.vue'

const componentName = ref()
const components = reactive({
    Storage: markRaw(Storage),
    Info: markRaw(Info),
    Publish: markRaw(Publish),
    System: markRaw(System),
    Finance: markRaw(Finance),
    Drop: markRaw(Drop),
    Sms: markRaw(Sms),
    AuthCode: markRaw(AuthCode),
    Poster: markRaw(Poster),
    AuthCard: markRaw(AuthCard),
    Version: markRaw(Version),
})
componentName.value = components['Info']
const select = (index) => {
    componentName.value = components[index]
}
</script>

<style scoped>

</style>
