<template>
    <el-tabs v-model="activeName" :stretch="true" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="账号登录" name="account">
            <el-form
                label-position="top"
                label-width="100px"
                :model="form"
                ref="ruleFormRef"
                :rules="rules"
                size="large"
            >
                <el-form-item label="账号" prop="username">
                    <el-input v-model="form.username" placeholder="输入您的账号"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password" show-password placeholder="输入您的密码"></el-input>
                </el-form-item>
                <el-form-item class="btn">
                    <el-button :loading="loading" type="primary" @click="submitForm(ruleFormRef)">{{loading?'登录中...':'确定'}}</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="扫码登录" name="scan">
            <div class="scan"></div>
        </el-tab-pane>
    </el-tabs>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '/src/store'

const router = useRouter()
const auth = api.authStore()
const activeName = ref('account')
const form = reactive({
    username: '',
    password: ''
})

const ruleFormRef = ref()
const loading = ref(false)
const rules = reactive({
    username: [
        {
            required: true,
            message: '请输入账号',
            trigger: 'blur',
        }
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        }
    ]
})

const handleClick = (tab, event) => {
    console.log(tab, event)
}
const config = getCurrentInstance()?.appContext.config.globalProperties.$config
const message = getCurrentInstance()?.appContext.config.globalProperties.$message
let captcha = new TencentCaptcha(config.tx_captcha_appid, (res)=>{
    console.log(res)
    if(res.ret != 0){
        loading.value = false
        return
    }
    auth.captcha({ticket: res.ticket, randstr: res.randstr}).then(res=>{
        auth.login({requestId: res.requestId, username: form.username, password: form.password}).then(res=>{
            loading.value = false
            message.success('登录成功')
            router.push({name: 'dashboard'})
        }).catch(err=>{
            loading.value = false
        })
    }).catch(err=>{
        loading.value = false
    })
})
const submitForm = (formEl) => {
    if (!formEl) return
    loading.value = true
    formEl.validate((valid) => {
        if (valid) {
            //captcha.show()
            auth.login({username: form.username, password: form.password}).then(res=>{
                loading.value = false
                message.success('登录成功')
                router.push({name: 'goods'})
            }).catch(err=>{
                loading.value = false
            })
        }else{
            loading.value = false
        }
    })
}
</script>

<style scoped lang="scss">
.demo-tabs{
    width: 100%;
}
#pane-account{
    padding-top: 10px;
}
:deep(.el-form-item__label){
    margin-bottom: 5px !important;
    font-size: 13px;
}
.btn{
    margin-top: 50px;
    .el-button{
        width: 100%;
    }
}
#pane-scan{
    display: flex;
    justify-content: center;
    align-items: center;
}
.scan{
    width: 150px;
    height: 150px;
    background: #f8fafc;
    margin-top: 70px;
}
</style>
