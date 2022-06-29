<template>
    <div class="main_body flex-column">
        <div class="main_body flex-column overflow-y-auto m">
            <div class="filter">
<!--                <el-button @click="add" type="primary"><i class="iconfont icon-add-select"></i><span>新增</span></el-button>-->
                <el-button @click="refresh" :class="loading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i><span>{{ loading? '加载中...':'刷新' }}</span></el-button>
            </div>
            <el-table :data="list?.data" stripe style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="user.name" label="姓名" width="200" />
                <el-table-column prop="amount" label="提现金额" width="100" />
                <el-table-column prop="poundage" label="手续费" width="100" />
                <el-table-column prop="real_amount" label="实际到账" width="100" />
                <el-table-column prop="type" label="账号类型" width="100" >
                    <template #default="item">
                        {{item.row.type == 0?'银行卡':item.row.type == 1?'支付宝':'微信'}}
                    </template>
                </el-table-column>
                <el-table-column prop="account" label="账号" width="200" />
                <el-table-column prop="order_id" label="订单号" width="200" />
                <el-table-column prop="status" label="状态" width="100" >
                    <template #default="item">
                        <el-tag :type="item.row.status==0?'info':item.row.status==1?'':item.row.status==2?'success':item.row.status==3?'danger':item.row.status==4?'warning':'danger'">{{statusText[item.row.status]}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="申请时间" width="200" />
                <el-table-column label="操作">
                    <template #default="item">
                        <el-button @click="edit(item.row)" type="primary" size="small"><span>编辑</span></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="main_footer">
            <div class="main_footer_l">

            </div>
            <div class="main_footer_r">
                <page :total="param.total" :pageSize="param.per_page" @currentChange="currentChange" @sizeChange="sizeChange" />
            </div>
        </div>
    </div>
    <el-drawer
        v-model="dialogVisible"
        :title="form.id?'编辑转账信息':'新建转账信息'"
        direction="rtl"
        :destroy-on-close="true"
        :size="850"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
            <el-form-item label="转账状态" prop="type">
                <el-select v-model="form.status" placeholder="选择转账状态" size="large">
                    <el-option :value="0" label="待审中" />
                    <el-option :value="1" label="转账中" />
                    <el-option :value="2" label="转账成功" />
                    <el-option :value="3" label="转账失败" />
                    <el-option :value="4" label="取消订单" />
                    <el-option :value="5" label="驳回" />
                </el-select>
            </el-form-item>
            <el-form-item label="驳回理由" prop="account">
                <el-input v-model="form.remark" type="textarea" :row="8" placeholder="填写驳回理由" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit" :loading="submitLoading">确定</el-button>
        </template>
    </el-drawer>
</template>

<script setup>
import page from '@/components/page.vue'
import {computed, ref, onMounted, reactive, nextTick} from "vue"
import api from '/src/store'
import {ElMessage} from "element-plus"
import bankType from "@/assets/bankType";

const withdrawalStore = api.withdrawalStore()
const configStore = api.configStore()
const list = computed(()=>withdrawalStore.withdrawal_list)
const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()

const statusText = {
    0: '待审中',
    1: '转账中',
    2: '转账成功',
    3: '转账失败',
    4: '取消订单',
    5: '驳回',
}
onMounted(()=>{
    //initMap()
})

let form = ref({
    type: '',
    id: '',
    account: '',
    bank_code: '',
    bank_name: '',
    bank_open: ''
})

const rules = reactive({
    // type: [
    //     { required: true, message: '请选择帐户类型', trigger: 'blur' }
    // ],
    // account: [
    //     { required: true, message: '请填写帐号', trigger: 'blur' }
    // ]
})

const edit = (items) => {
    let item = JSON.parse(JSON.stringify(items))
    form.value = item
    dialogVisible.value = true
}

const add = () => {
    dialogVisible.value = true
}

const submit = () => {
    formRef.value.validate((valid, fields) => {
        if(valid){
            let data = JSON.parse(JSON.stringify(form.value))
            if(data.id > 0){ // 编辑
                submitLoading.value = true
                withdrawalStore.withdrawal_update(data).then(res=>{
                    submitLoading.value = false
                    dialogVisible.value = false
                    refresh()
                    ElMessage({
                        type: 'success',
                        message: res.msg,
                    })
                }).catch(err=>{
                    submitLoading.value = false
                })
            }
        }
    })
}

onMounted(()=>{
    refresh()
})

const refresh = () => {
    loading.value = true
    withdrawalStore.withdrawal_lists().then(res=>{
        loading.value = false
    }).catch(err=>{
        loading.value = false
    })
}

const param = ref({
    total: 0,
    page: 1,
    per_page: 20,
    key: ''
})

const currentChange = val =>{
    param.value.page = val
    refresh()
}

const sizeChange = val =>{
    param.value.per_page = val
    refresh()
}

</script>

<style scoped>

</style>
