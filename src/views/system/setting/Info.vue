<template>
    <el-form :model="form.value" label-width="150px" style="width: 300px">
        <el-form-item label="品牌名称">
            <el-input v-model="form.value.name" :maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item label="登录页面LOGO">
            <UploadImage width="100px" height="100px" @callback="callback" :url="form.value.logo"></UploadImage>
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
import UploadImage from '@/components/UploadImage.vue'

const loading = ref(false)
const settingStore = api.settingStore()
const form = ref({
    key: 'brand',
    value: {
        name: '',
        logo: ''
    }
})
let eLoading = null
nextTick(()=> {
    eLoading = ElLoading.service({
        target: '.main_box',
        fullscreen: false
    })
})
settingStore.get_setting({type: 'brand'}).then(res=>{
    form.value.value.name = res?.name
    form.value.value.logo = res?.logo
    eLoading.close()
}).catch(err=>{
    eLoading.close()
})
const callback = (val) => {
    form.value.value.logo = val
}
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
