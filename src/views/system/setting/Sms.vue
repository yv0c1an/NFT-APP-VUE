<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="150px" style="width: 400px">
        <el-form-item label="短信通道" prop="value.type">
            <div style="display: flex">
                <el-radio v-model="form.value.type" label="aliyun">阿里云</el-radio>
                <el-radio v-model="form.value.type" label="qcloud">腾讯云</el-radio>
            </div>
        </el-form-item>
        <template v-if="form.value.type=='aliyun'">
            <el-form-item label="AccessKey ID" prop="value.aliyun.access_key_id">
                <el-input v-model="form.value.aliyun.access_key_id" placeholder="填写AccessKey ID" />
            </el-form-item>
            <el-form-item label="AccessKey Secret" prop="value.aliyun.access_key_secret">
                <el-input v-model="form.value.aliyun.access_key_secret" placeholder="填写AccessKey Secret" />
            </el-form-item>
            <el-form-item label="短信签名" prop="value.aliyun.sign_name">
                <el-input v-model="form.value.aliyun.sign_name" placeholder="填写短信签名" />
            </el-form-item>
            <el-form-item label="短信模板ID" prop="value.aliyun.template_id">
                <el-input v-model="form.value.aliyun.template_id" placeholder="填写短信模板ID" />
            </el-form-item>
        </template>
        <template v-if="form.value.type=='qcloud'">
            <el-form-item label="Sdk App ID" prop="value.qcloud.app_id">
                <el-input v-model="form.value.qcloud.app_id" placeholder="填写Sdk App ID" />
            </el-form-item>
            <el-form-item label="Secret ID" prop="value.qcloud.secret_id">
                <el-input v-model="form.value.qcloud.secret_id" placeholder="填写Secret ID" />
            </el-form-item>
            <el-form-item label="Secret Key" prop="value.qcloud.secret_key">
                <el-input v-model="form.value.qcloud.secret_key" placeholder="填写Secret Key" />
            </el-form-item>
            <el-form-item label="短信签名" prop="value.qcloud.sign_name">
                <el-input v-model="form.value.qcloud.sign_name" placeholder="填写短信签名" />
            </el-form-item>
            <el-form-item label="短信模板ID" prop="value.qcloud.template_id">
                <el-input v-model="form.value.qcloud.template_id" placeholder="填写短信模板ID" />
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
    'value.type': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.aliyun.sign_name': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.aliyun.access_key_id': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.aliyun.access_key_secret': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.aliyun.template_id': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],

    'value.qcloud.app_id': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.qcloud.secret_id': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.qcloud.secret_key': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.qcloud.sign_name': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.qcloud.template_id': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
})
const formRef = ref()
const loading = ref(false)
const settingStore = api.settingStore()
const form = reactive({
    key: 'sms',
    value: {
        type: 'aliyun',
        aliyun: {
            access_key_id: '',
            access_key_secret: '',
            sign_name: '',
            template_id: '',
        },
        qcloud: {
            sign_name: '',
            app_id: '',
            template_id: '',
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
settingStore.get_setting({type: 'sms'}).then(res=>{
    form.value.type = res?.type
    form.value.aliyun.access_key_id = res?.aliyun?.access_key_id
    form.value.aliyun.access_key_secret = res?.aliyun?.access_key_secret
    form.value.aliyun.sign_name = res?.aliyun?.sign_name
    form.value.aliyun.template_id = res?.aliyun?.template_id

    form.value.qcloud.app_id = res?.qcloud?.app_id
    form.value.qcloud.secret_id = res?.qcloud?.secret_id
    form.value.qcloud.secret_key = res?.qcloud?.secret_key
    form.value.qcloud.sign_name = res?.qcloud?.sign_name
    form.value.qcloud.template_id = res?.qcloud?.template_id
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
