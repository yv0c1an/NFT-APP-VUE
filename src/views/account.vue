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
                <el-table-column prop="account" label="账号" width="200" />
                <el-table-column prop="type" label="账号类型" width="200" >
                    <template #default="item">
                        {{item.row.type == 0?'银行卡':item.row.type == 1?'支付宝':'微信'}}
                    </template>
                </el-table-column>
                <el-table-column prop="bank_name" label="所属银行" width="200" />
                <el-table-column prop="created_at" label="申请时间" width="200" />
                <el-table-column label="操作">
                    <template #default="item">
                        <el-button @click="edit(item.row)" type="primary" size="small"><span>编辑</span></el-button>
                        <el-popconfirm title="删除后无法恢复，确定删除?" @confirm="delListConfirm(item.row)" v-if="item.row.id != 1 && item.row.id != 2">
                            <template #reference>
                                <el-button type="danger" size="small"><span>删除</span></el-button>
                            </template>
                        </el-popconfirm>
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
        :title="form.id?'编辑账号信息':'新建账号信息'"
        direction="rtl"
        :destroy-on-close="true"
        :size="850"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
            <el-form-item label="账号类型" prop="type">
                <el-radio-group v-model="form.type">
                    <el-radio-button :label="0" >银行卡</el-radio-button>
                    <el-radio-button :label="1" >支付宝</el-radio-button>
                    <el-radio-button :label="2" >微信</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="账号" prop="account">
                <el-input v-model="form.account" placeholder="填写账号" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="所属银行" prop="bank_name" v-if="form.type==0">
                <el-select v-model="form.bank_name" placeholder="选择所属银行">
                <el-option
                    v-for="(item, index) in bankType"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                />
                </el-select>
            </el-form-item>
            <el-form-item label="开户行" prop="remark" v-if="form.type==0">
                <el-input v-model="form.bank_open" placeholder="填写开户行" />
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

const accountStore = api.accountStore()
const configStore = api.configStore()
const list = computed(()=>accountStore.account_list)
const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()

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
    type: [
        { required: true, message: '请选择帐户类型', trigger: 'blur' }
    ],
    account: [
        { required: true, message: '请填写帐号', trigger: 'blur' }
    ]
})

const edit = (items) => {
    let item = JSON.parse(JSON.stringify(items))
    form.value = item
    dialogVisible.value = true
}

const add = () => {
    dialogVisible.value = true
}

const delListConfirm = (item) => {
    accountStore.account_del({id: item.id}).then(res=>{
        refresh()
    })
}

const submit = () => {
    formRef.value.validate((valid, fields) => {
        if(valid){
            let data = JSON.parse(JSON.stringify(form.value))
            if(data.id > 0){ // 编辑
                submitLoading.value = true
                accountStore.account_update(data).then(res=>{
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
            }else{ // 新增
                submitLoading.value = true
                accountStore.account_add(data).then(res=>{
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
    accountStore.account_lists().then(res=>{
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
