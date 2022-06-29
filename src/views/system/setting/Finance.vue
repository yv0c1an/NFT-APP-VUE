<template>
    <el-form :model="form.value" label-width="150px" style="width: 400px">
        <el-form-item label="最大充值额度">
            <el-input v-model.number="form.value.recharge_max" type="number" :min="0" placeholder="填写最大充值额度" >
                <template #append>
                    元
                </template>
            </el-input>
            <div class="tip">0表示无限额</div>
        </el-form-item>
        <el-form-item label="最小充值额度">
            <el-input v-model.number="form.value.recharge_min" type="number" :min="0.01" placeholder="填写最小充值额度" >
                <template #append>
                    元
                </template>
            </el-input>
            <div class="tip">至少为0.01</div>
        </el-form-item>
        <el-divider />

        <el-form-item label="最大提现额度">
            <el-input v-model.number="form.value.withdrawal_max" type="number" :min="0" placeholder="填写最大提现额度" >
                <template #append>
                    元
                </template>
            </el-input>
            <div class="tip">0表示无限额</div>
        </el-form-item>
        <el-form-item label="最小提现额度">
            <el-input v-model.number="form.value.withdrawal_min" type="number" :min="0.01" placeholder="填写最小提现额度" >
                <template #append>
                    元
                </template>
            </el-input>
            <div class="tip">至少为0.01</div>
        </el-form-item>
        <el-form-item label="提现续费">
            <el-input v-model="form.value.withdrawal_poundage" type="number" :min="0" placeholder="填写提现手续费" >
                <template #append>
                    %
                </template>
            </el-input>
            <div class="tip">0表示无手续费</div>
        </el-form-item>
        <el-form-item label="每天提现次数">
            <el-input v-model="form.value.withdrawal_num" type="number" :min="0" :step="1" placeholder="填写每天提现次数" />
            <div class="tip">0表示无限次数</div>
        </el-form-item>
        <el-divider />

        <el-form-item label="支持提现帐户类型">
            <el-checkbox-group v-model="form.value.account_type">
                <el-checkbox :label="0">银行卡</el-checkbox>
                <el-checkbox :label="1">支付宝</el-checkbox>
                <el-checkbox :label="2">微信</el-checkbox>
            </el-checkbox-group>
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
    key: 'finance',
    value: {
        recharge_max: 0,
        recharge_min: 0.01,
        withdrawal_poundage: 0,
        withdrawal_max: 0,
        withdrawal_min: 0.01,
        withdrawal_num: 0,
        account_type: []
    }
})
let eLoading = null
nextTick(()=> {
    eLoading = ElLoading.service({
        target: '.main_box',
        fullscreen: false
    })
})
settingStore.get_setting({type: 'finance'}).then(res=>{
    form.value.value.recharge_max = res?.recharge_max
    form.value.value.recharge_min = res?.recharge_min
    form.value.value.withdrawal_poundage = res?.withdrawal_poundage
    form.value.value.withdrawal_max = res?.withdrawal_max
    form.value.value.withdrawal_min = res?.withdrawal_min
    form.value.value.withdrawal_num = res?.withdrawal_num
    form.value.value.account_type = res?.account_type
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
