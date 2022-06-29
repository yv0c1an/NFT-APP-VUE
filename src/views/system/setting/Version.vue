<template>
    <el-form :model="form.value" label-width="100px" style="width: 400px">
        <el-form-item label="安卓版本名">
            <el-input v-model="form.value.AndVersionName" />
            <div class="tip">如：1.0.0，用于检测更新，请勿随意更改。</div>
        </el-form-item>
        <el-form-item label="安卓版本号">
            <el-input v-model.number="form.value.AndVersionCode" type="number" />
            <div class="tip">如：100，用于检测更新，请勿随意更改。</div>
        </el-form-item>
        <el-form-item label="安卓下载地址">
            <el-input v-model="form.value.AndDownUrl" type="text" />
            <div class="tip">如：http://xxx.com/app.apk</div>
        </el-form-item>
        <el-form-item label="安卓更新内容">
            <el-input v-model="form.value.AndUpdateDesc" type="textarea" :rows="5" />
        </el-form-item>

        <el-divider />

        <el-form-item label="苹果版本名">
            <el-input v-model="form.value.IosVersionName" />
            <div class="tip">如：1.0.0，用于检测更新，请勿随意更改。</div>
        </el-form-item>
        <el-form-item label="苹果版本号">
            <el-input v-model.number="form.value.IosVersionCode" type="number" />
            <div class="tip">如：100，用于检测更新，请勿随意更改。</div>
        </el-form-item>
        <el-form-item label="IOS下载地址">
            <el-input v-model="form.value.IosDownUrl" type="text" />
            <div class="tip">如：https://apps.apple.com/cn/app/xxxx/id12345678</div>
        </el-form-item>
        <el-form-item label="苹果更新内容">
            <el-input v-model="form.value.IosUpdateDesc" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item style="margin-top: 30px;">
            <el-button type="primary" @click="onSubmit" :loading="loading">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import {computed, ref, onMounted, reactive, nextTick} from "vue"
import api from '/src/store'
import {ElMessage, ElLoading} from "element-plus"

const loading = ref(false)
const settingStore = api.settingStore()
const form = ref({
    key: 'version',
    value: {
        AndVersionName: '', // 安卓版本名
        AndVersionCode: '', // 安卓版本号
        IosVersionName: '', // 苹果版本名
        IosVersionCode: '', // 苹果版本号
        AndDownUrl: '', // 安卓下载地址
        IosDownUrl: '', // 苹果下载地址
        AndUpdateDesc: '', // 安卓更新内容
        IosUpdateDesc: '', // Ios更新内容
    }
})
let eLoading = null
nextTick(()=> {
    eLoading = ElLoading.service({
        target: '.main_box',
        fullscreen: false
    })
})
settingStore.get_setting({type: 'version'}).then(res=>{
    form.value.value.AndVersionName = res?.AndVersionName
    form.value.value.AndVersionCode = res?.AndVersionCode
    form.value.value.IosVersionName = res?.IosVersionName
    form.value.value.IosVersionCode = res?.IosVersionCode
    form.value.value.AndDownUrl = res?.AndDownUrl
    form.value.value.IosDownUrl = res?.IosDownUrl
    form.value.value.AndUpdateDesc = res?.AndUpdateDesc
    form.value.value.IosUpdateDesc = res?.IosUpdateDesc
    eLoading.close()
}).catch(err=>{
    eLoading.close()
})

const onSubmit = () => {
    loading.value = true
    settingStore.setting_update(form.value).then(res=>{
        loading.value = false
        ElMessage.success(res.msg)
    }).catch(err=>{
        loading.value = false
    })

}
</script>

<style scoped>

</style>
