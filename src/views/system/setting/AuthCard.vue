<template>
    <el-alert type="warning" show-icon style="margin-bottom: 30px;" :closable="false" v-if="form.value.type=='aliyun'">
        当前使用的是阿里云市场的 <a target="_blank" href="https://market.aliyun.com/products/57000002/cmapi026109.html">「天眼数聚」</a> 接口，如需更换其他阿里云市场的接口，只需修改 <code>/app/Service/Auth.php</code> 里的 <code>card_auth</code> 方法逻辑即可。
    </el-alert>
    <el-alert type="warning" show-icon style="margin-bottom: 30px;" :closable="false" v-if="form.value.type=='yuebao'">
        <a target="_blank" href="https://ybinsure.com/">悦保</a> 官方网站。
    </el-alert>
    <el-form :model="form.value" label-width="150px" style="width: 400px">
        <el-form-item label="服务商">
            <div style="display: flex">
                <el-radio v-model="form.value.type" label="aliyun">阿里云市场</el-radio>
                <el-radio v-model="form.value.type" label="yuebao">悦保</el-radio>
            </div>
        </el-form-item>
        <template v-if="form.value.type=='aliyun'">
            <el-form-item label="AppKey">
                <el-input v-model="form.value.aliyun.app_key" placeholder="填写AppKey" />
            </el-form-item>
            <el-form-item label="AppSecret">
                <el-input v-model="form.value.aliyun.app_secret" placeholder="填写AppSecret" />
            </el-form-item>
            <el-form-item label="AppCode">
                <el-input v-model="form.value.aliyun.app_code" placeholder="填写AppCode" />
            </el-form-item>
        </template>
        <template v-if="form.value.type=='yuebao'">
            <el-form-item label="accessKey">
                <el-input v-model="form.value.yuebao.accessKey" placeholder="填写accessKey" />
            </el-form-item>
            <el-form-item label="accessSecret">
                <el-input v-model="form.value.yuebao.accessSecret" placeholder="填写accessSecret" />
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

const loading = ref(false)
const settingStore = api.settingStore()
const form = ref({
    key: 'auth_card',
    value: {
        type: 'aliyun',
        aliyun: {
            app_key: '',
            app_secret: '',
            app_code: ''
        },
        yuebao:{
            accessKey: '',
            accessSecret: ''
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
settingStore.get_setting({type: 'auth_card'}).then(res=>{
    form.value.value.type = res?.type
    form.value.value.aliyun.app_key = res?.aliyun.app_key
    form.value.value.aliyun.app_secret = res?.aliyun.app_secret
    form.value.value.aliyun.app_code = res?.aliyun.app_code
    form.value.value.yuebao.accessKey = res?.yuebao.accessKey
    form.value.value.yuebao.accessSecret = res?.yuebao.accessSecret
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
