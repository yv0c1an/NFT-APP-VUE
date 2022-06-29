<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="150px" style="width: 400px">
        <el-form-item label="启用验证码">
            <div style="display: flex">
                <el-radio v-model="form.value.type" label="">不使用</el-radio>
                <el-radio v-model="form.value.type" label="qcloud">腾讯云</el-radio>
            </div>
        </el-form-item>
        <template v-if="form.value.type=='qcloud'">
            <el-form-item label="CaptchaAppId" prop="value.qcloud.captcha_app_id">
                <el-input v-model="form.value.qcloud.captcha_app_id" placeholder="填写CaptchaAppId" />
            </el-form-item>
            <el-form-item label="AppSecretKey" prop="value.qcloud.app_secret_key">
                <el-input v-model="form.value.qcloud.app_secret_key" placeholder="填写AppSecretKey" />
            </el-form-item>
            <el-form-item label="Secret ID" prop="value.qcloud.secret_id">
                <el-input v-model="form.value.qcloud.secret_id" placeholder="填写Secret ID" />
            </el-form-item>
            <el-form-item label="Secret Key" prop="value.qcloud.secret_key">
                <el-input v-model="form.value.qcloud.secret_key" placeholder="填写Secret Key" />
            </el-form-item>
        </template>
        <el-form-item style="margin-top: 30px;">
            <el-button type="primary" @click="onSubmit" :loading="loading">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import {computed, ref, onMounted, reactive, nextTick} from "vue"
import api from '/src/store'
import {ElMessage, ElLoading} from "element-plus"

const rules = reactive({
    'value.qcloud.captcha_app_id': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.qcloud.secret_id': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.qcloud.secret_key': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.qcloud.app_secret_key': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ]
})
const formRef = ref()
const loading = ref(false)
const settingStore = api.settingStore()
const form = reactive({
    key: 'auth_code',
    value: {
        type: '',
        qcloud: {
            captcha_app_id: '',
            app_secret_key: '',
            secret_id: '',
            secret_key: '',
        }
    }
})
let eLoading = null
nextTick(()=> {
    eLoading = ElLoading.service({
        target: '.main_box',
        fullscreen: false
    })
})
settingStore.get_setting({type: 'auth_code'}).then(res=>{
    form.value.type = res?.type
    form.value.qcloud.captcha_app_id = res?.qcloud?.captcha_app_id
    form.value.qcloud.secret_id = res?.qcloud?.secret_id
    form.value.qcloud.secret_key = res?.qcloud?.secret_key
    form.value.qcloud.app_secret_key = res?.qcloud?.app_secret_key
    eLoading.close()
}).catch(err=>{
    eLoading.close()
})

const onSubmit = () => {
    formRef.value.validate((valid) => {
        if(valid){
            loading.value = true
            settingStore.setting_update(form).then(res=>{
                loading.value = false
                ElMessage.success(res.msg)
            }).catch(err=>{
                loading.value = false
            })
        }else{
            return false
        }
    })
}
</script>

<style scoped>

</style>
