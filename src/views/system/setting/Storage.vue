<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="150px" style="width: 400px">
        <el-form-item label="储存位置">
            <div style="display: flex">
                <el-radio v-model="form.value.type" label="local">本地储存</el-radio>
                <el-radio v-model="form.value.type" label="oss">阿里云OSS</el-radio>
                <el-radio v-model="form.value.type" label="cos">腾讯云COS</el-radio>
            </div>
        </el-form-item>
        <el-form-item v-if="form.value.type=='local'">
            <div class="tip">本地储存无需设置参数</div>
        </el-form-item>
        <template v-if="form.value.type=='oss'">
            <el-form-item label="AccessKey ID" prop="value.oss.access_key_id">
                <el-input v-model="form.value.oss.access_key_id" placeholder="填写AccessKey ID" />
            </el-form-item>
            <el-form-item label="AccessKey Secret" prop="value.oss.access_key_secret">
                <el-input v-model="form.value.oss.access_key_secret" placeholder="填写AccessKey Secret" />
            </el-form-item>
            <el-form-item label="存储空间名称" prop="value.oss.bucket">
                <el-input v-model="form.value.oss.bucket" placeholder="填写存储空间的Bucket名称" />
                <div class="tip">填写存储空间的Bucket名称</div>
            </el-form-item>
            <el-form-item label="外网节点" prop="value.oss.endpoint">
                <el-input v-model="form.value.oss.endpoint" placeholder="填写外网节点域名" />
                <div class="tip">OSS外网节点(endpoint)或自定义外部域名</div>
            </el-form-item>
            <el-form-item label="内网节点">
                <el-input v-model="form.value.oss.internal" placeholder="填写内网节点域名" />
                <div class="tip">OSS内网(internal)节点域名</div>
            </el-form-item>
            <el-form-item label="自定义域名">
                <el-input v-model="form.value.oss.domain" placeholder="填写域名" />
                <div class="tip">例: mydomain.com，不要带http://或https://</div>
            </el-form-item>
            <el-form-item label="启用https">
                <el-switch
                    v-model="form.value.oss.use_ssl"
                    inline-prompt
                    active-text="是"
                    inactive-text="否"
                    :active-value="1"
                    :inactive-value="0"
                />
                <div class="tip">是否开启HTTPS</div>
            </el-form-item>
            <el-form-item label="路径前缀">
                <el-input v-model="form.value.oss.prefix" placeholder="填写路径前缀" />
                <div class="tip">全局路径前缀</div>
            </el-form-item>
        </template>
        <template v-if="form.value.type=='cos'">
            <el-form-item label="App ID" prop="value.cos.app_id">
                <el-input v-model="form.value.cos.app_id" placeholder="填写App ID" />
            </el-form-item>
            <el-form-item label="Secret ID" prop="value.cos.secret_id">
                <el-input v-model="form.value.cos.secret_id" placeholder="填写Secret ID" />
            </el-form-item>
            <el-form-item label="Secret Key" prop="value.cos.secret_key">
                <el-input v-model="form.value.cos.secret_key" placeholder="填写Secret Key" />
            </el-form-item>
            <el-form-item label="存储空间名称" prop="value.cos.bucket">
                <el-input v-model="form.value.cos.bucket" placeholder="填写存储空间的Bucket名称" />
                <div class="tip">不带数字 app_id 后缀</div>
            </el-form-item>
            <el-form-item label="Region" prop="value.cos.region">
                <el-input v-model="form.value.cos.region" placeholder="填写Region" />
            </el-form-item>
            <el-form-item label="Signed Url">
                <el-switch
                    v-model="form.value.cos.signed_url"
                    inline-prompt
                    active-text="是"
                    inactive-text="否"
                    :active-value="1"
                    :inactive-value="0"
                />
                <div class="tip">如果 bucket 为私有访问请打开此项</div>
            </el-form-item>
            <el-form-item label="使用https">
                <el-switch
                    v-model="form.value.cos.use_https"
                    inline-prompt
                    active-text="是"
                    inactive-text="否"
                    :active-value="1"
                    :inactive-value="0"
                />
                <div class="tip">是否使用 https，默认 false</div>
            </el-form-item>
            <el-form-item label="域名(domain)">
                <el-input v-model="form.value.cos.domain" placeholder="填写域名" />
                <div class="tip">例: mydomain.com，不要带http://或https://</div>
            </el-form-item>
            <el-form-item label="CDN">
                <el-input v-model="form.value.cos.cdn" placeholder="填写CDN" />
                <div class="tip">使用 CDN 域名时指定生成的 URL host</div>
            </el-form-item>
            <el-form-item label="路径前缀">
                <el-input v-model="form.value.cos.prefix" placeholder="填写路径前缀" />
                <div class="tip">全局路径前缀</div>
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
    'value.oss.bucket': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.oss.access_key_id': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.oss.access_key_secret': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.oss.endpoint': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.cos.bucket': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.cos.app_id': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.cos.secret_id': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.cos.secret_key': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
    'value.cos.region': [
        { required: true, message: '参数必填', trigger: 'blur' }
    ],
})
const formRef = ref()
const loading = ref(false)
const settingStore = api.settingStore()
const form = reactive({
    key: 'storage',
    value: {
        type: 'local',
        oss: {
            driver: 'oss',
            bucket: '',
            domain: '',
            access_key_id: '',
            access_key_secret: '',
            prefix: '',
            endpoint: '',
            internal: '',
            use_ssl: 0
        },
        cos: {
            driver: 'cos',
            app_id: '',
            bucket: '',
            use_https: 0,
            signed_url: 0,
            domain: '',
            secret_id: '',
            secret_key: '',
            cdn: '',
            prefix: '',
            region: ''
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
settingStore.get_setting({type: 'storage'}).then(res=>{
    form.value.type = res?.type
    form.value.oss.bucket = res?.oss?.bucket
    form.value.oss.domain = res?.oss?.domain
    form.value.oss.access_key_id = res?.oss?.access_key_id
    form.value.oss.access_key_secret = res?.oss?.access_key_secret
    form.value.oss.prefix = res?.oss?.prefix
    form.value.oss.endpoint = res?.oss?.endpoint
    form.value.oss.internal = res?.oss?.internal
    form.value.oss.use_ssl = res?.oss?.use_ssl

    form.value.cos.app_id = res?.cos?.app_id
    form.value.cos.bucket = res?.cos?.bucket
    form.value.cos.use_https = res?.cos?.use_https
    form.value.cos.signed_url = res?.cos?.signed_url
    form.value.cos.domain = res?.cos?.domain
    form.value.cos.secret_id = res?.cos?.secret_id
    form.value.cos.secret_key = res?.cos?.secret_key
    form.value.cos.cdn = res?.cos?.cdn
    form.value.cos.prefix = res?.cos?.prefix
    form.value.cos.region = res?.cos?.region
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
