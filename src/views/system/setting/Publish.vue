<template>
    <el-form :model="form.value" label-width="150px" style="width: 400px">
        <el-form-item label="最大发行数量">
            <el-input v-model.number="form.value.publish_max" placeholder="填写最大发行数量" />
        </el-form-item>
        <el-form-item label="最小发行数量">
            <el-input v-model.number="form.value.publish_min" placeholder="填写最小发行数量" />
        </el-form-item>
        <el-form-item label="发行手续费">
            <el-input v-model="form.value.publish_fee" placeholder="填写发行手续费" >
                <template #append>
                    元/个
                </template>
            </el-input>
            <div class="tip">例：发行1000个，手续费为0.1/个，则总手续费为 1000 * 0.1 = 100元</div>
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
    key: 'publish',
    value: {
        publish_max: 9999,
        publish_min: 1,
        publish_fee: 0.1
    }
})
let eLoading = null
nextTick(()=> {
    eLoading = ElLoading.service({
        target: '.main_box',
        fullscreen: false
    })
})
settingStore.get_setting({type: 'publish'}).then(res=>{
    form.value.value.publish_max = res?.publish_max
    form.value.value.publish_min = res?.publish_min
    form.value.value.publish_fee = res?.publish_fee
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
