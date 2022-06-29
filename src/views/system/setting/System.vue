<template>
    <el-form :model="form.value" label-width="100px" style="width: 400px">
        <el-form-item label="静默模式">
            <el-switch
                v-model="form.value.market_log_switch"
                inline-prompt
                active-text="是"
                inactive-text="否"
            />
            <div class="tip">隐藏寄售记录和全部编号</div>
        </el-form-item>
        <el-form-item label="限制下单">
            <el-input v-model.number="form.value.limit_order" type="number" :min="0" />
            <div class="tip">每天取消订单次数或订单超时数量达到当前阈值时将限制用户下单，第二天自动解除，0表示不限制</div>
        </el-form-item>
        <el-form-item label="合约地址">
            <el-input v-model="form.value.contract" />
        </el-form-item>
        <el-form-item label="客服二维码">
            <UploadImage width="100px" height="100px" @callback="callback" :url="form.value.customer_qrcode"></UploadImage>
            <div class="tip">微信客服二维码</div>
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
    key: 'system',
    value: {
        market_log_switch: 0,
        contract: '', // 合约地址
        customer_qrcode: '',
        limit_order: ''
    }
})
let eLoading = null
nextTick(()=> {
    eLoading = ElLoading.service({
        target: '.main_box',
        fullscreen: false
    })
})
settingStore.get_setting({type: 'system'}).then(res=>{
    form.value.value.market_log_switch = res?.market_log_switch
    form.value.value.customer_qrcode = res?.customer_qrcode
    form.value.value.contract = res?.contract
    form.value.value.limit_order = res?.limit_order
    eLoading.close()
}).catch(err=>{
    eLoading.close()
})
const callback = (val) => {
    form.value.value.customer_qrcode = val
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
