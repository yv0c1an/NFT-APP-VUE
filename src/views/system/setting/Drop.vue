<template>
    <el-alert type="warning" show-icon style="margin-bottom: 30px;" :closable="false" >
        赠送空投的前提条件是注册用户只有实名认证后才会触发。
    </el-alert>
    <el-form :model="form.value" label-width="150px">
        <el-form-item label="注册即送">
            <div style="width: 100%;">
                <el-switch
                    v-model="form.value.reg_give_switch"
                    inline-prompt
                    active-text="是"
                    inactive-text="否"
                />
            </div>
            <div style="width: 100%;margin:5px 0;" v-if="form.value.reg_give_switch">
                <el-select
                    v-model="form.value.reg_give_goods_id"
                    style="width: 300px"
                    filterable
                    remote
                    clearable
                    placeholder="输入名称或ID搜索商品"
                    :remote-method="remoteMethod"
                    :loading="searchLoading"
                >
                    <el-option
                        v-for="item in list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </div>
        </el-form-item>
        <el-form-item label="邀请即送">
            <div style="width: 100%;">
                <el-switch
                    v-model="form.value.invite_give_switch"
                    inline-prompt
                    active-text="是"
                    inactive-text="否"
                />
            </div>
            <div style="width: 100%;margin:5px 0;" v-if="form.value.invite_give_switch">
                每满 <el-input v-model.number="form.value.invite_give_num" style="width: 50px" /> 人即送
            </div>
            <div style="width: 100%;margin:5px 0;" v-if="form.value.invite_give_switch">
                <el-select
                    v-model="form.value.invite_give_goods_id"
                    style="width: 300px"
                    filterable
                    remote
                    clearable
                    placeholder="输入名称或ID搜索商品"
                    :remote-method="remoteMethod"
                    :loading="searchLoading"
                >
                    <el-option
                        v-for="item in list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </div>
        </el-form-item>
        <el-form-item label="邀请即送(购买资格)">
            <div style="width: 100%;">
                <el-switch
                    v-model="form.value.invite_give_buygoods_switch"
                    inline-prompt
                    active-text="是"
                    inactive-text="否"
                />
            </div>
            <div style="width: 100%;margin:5px 0;" v-if="form.value.invite_give_buygoods_switch">
                每满 <el-input v-model.number="form.value.invite_give_buygoods_num" style="width: 50px" /> 人即送 <el-input v-model.number="form.value.invite_give_buygoods_no_num" style="width: 50px" /> 次购买资格
            </div>
            <div style="width: 100%;margin:5px 0;" v-if="form.value.invite_give_buygoods_switch">
                <el-select
                    v-model="form.value.invite_give_buygoods_goods_id"
                    style="width: 300px"
                    filterable
                    remote
                    clearable
                    placeholder="输入名称或ID搜索商品"
                    :remote-method="remoteMethod"
                    :loading="searchLoading"
                >
                    <el-option
                        v-for="item in list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </div>
        </el-form-item>
        <el-form-item style="margin-top: 30px;">
            <el-button type="primary" @click="onSubmit" :loading="loading">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import {computed, ref, onMounted,reactive, watch, nextTick} from "vue"
import api from '/src/store'
import {ElMessage, ElLoading} from "element-plus"

const goodsStore = api.goodsStore()
const list = ref([])
const loading = ref(false)
const settingStore = api.settingStore()
const searchLoading = ref(false)
const param = ref({
    total: 0,
    page: 1,
    per_page: 20,
    key: '',
    type: [2,4],
    status: [4]
})
const refresh = () => {
    searchLoading.value = true
    goodsStore.goods_lists(param.value).then(res=>{
        param.value.total = res.total
        list.value = res.data
        searchLoading.value = false
    }).catch(err=>{
        searchLoading.value = false
    })
}
refresh()

const form = reactive({
    key: 'drop',
    value: {
        reg_give_switch: 0,
        reg_give_goods_id: '',
        invite_give_switch: 0,
        invite_give_goods_id: '',
        invite_give_num: '',

        invite_give_buygoods_switch: 0,
        invite_give_buygoods_no_num: 0,
        invite_give_buygoods_goods_id: '',
        invite_give_buygoods_num: ''
    }
})
let eLoading = null
nextTick(()=> {
    eLoading = ElLoading.service({
        target: '.main_box',
        fullscreen: false
    })
})
const remoteMethod = (val)=>{
    param.value.key = val
    refresh()
}
settingStore.get_setting({type: 'drop'}).then(res=>{
    form.value.reg_give_switch = res?.reg_give_switch
    form.value.reg_give_goods_id = res?.reg_give_goods_id
    form.value.invite_give_switch = res?.invite_give_switch
    form.value.invite_give_goods_id = res?.invite_give_goods_id
    form.value.invite_give_num = res?.invite_give_num

    form.value.invite_give_buygoods_switch = res?.invite_give_buygoods_switch
    form.value.invite_give_buygoods_goods_id = res?.invite_give_buygoods_goods_id
    form.value.invite_give_buygoods_num = res?.invite_give_buygoods_num
    form.value.invite_give_buygoods_no_num = res?.invite_give_buygoods_no_num
    eLoading.close()
}).catch(err=>{
    eLoading.close()
})

const onSubmit = () => {
    if(form.value.reg_give_switch && !form.value.reg_give_goods_id){
        ElMessage.error('请选择注册即送的空投商品')
        return
    }
    if(form.value.invite_give_switch && (!form.value.invite_give_goods_id || !form.value.invite_give_num)){
        ElMessage.error('请选择邀请即送的空投商品和人数')
        return
    }
    if(form.value.invite_give_buygoods_switch && (!form.value.invite_give_buygoods_goods_id || !form.value.invite_give_buygoods_num || !form.value.invite_give_buygoods_no_num)){
        ElMessage.error('请选择邀请即送(购买资格)的空投商品和人数')
        return
    }
    loading.value = true
    settingStore.setting_update(form).then(res=>{
        loading.value = false
        ElMessage.success(res.msg)
    }).catch(err=>{
        loading.value = false
    })

}
</script>

<style scoped>

</style>
