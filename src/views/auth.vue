<template>
    <div class="main_body flex-column">
        <div class="main_body flex-column overflow-y-auto m">
            <div class="filter">
<!--                <el-button @click="add" type="primary"><i class="iconfont icon-add-select"></i><span>新增</span></el-button>-->
                <el-button @click="refresh" :class="loading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i><span>{{ loading? '加载中...':'刷新' }}</span></el-button>
            </div>
            <el-table :data="list.data" stripe style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="username" label="姓名" width="200" />
                <el-table-column prop="user.mobile" label="账号" width="200" />
                <el-table-column prop="card_no" label="身份证号码" width="200" />
                <el-table-column prop="status" label="状态" width="100" >
                    <template #default="scope">
                        <el-tag size="small" effect="dark" :type="scope.row.status==0?'':scope.row.status==1?'success':'danger'">{{scope.row.status==0?'待审':scope.row.status==1?'通过':'待审'}}</el-tag>
                    </template>
                </el-table-column>
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
        :title="form.id?'编辑认证信息':'新建认证信息'"
        direction="rtl"
        :destroy-on-close="true"
        :size="850"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
            <el-form-item label="姓名" prop="username">
                <el-input v-model="form.username" placeholder="填写姓名" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="身份证号" prop="card_no">
                <el-input v-model="form.card_no" placeholder="填写身份证号码" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio-button :label="0" >待审</el-radio-button>
                    <el-radio-button :label="1" >通过</el-radio-button>
                    <el-radio-button :label="2" >驳回</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="驳回理由" prop="remark" v-if="form.status==2">
                <el-input v-model="form.remark" type="textarea" placeholder="填写驳回理由" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit" :loading="submitLoading">确定</el-button>
        </template>
    </el-drawer>
</template>

<script setup>
import dayjs from 'dayjs'
import page from '@/components/page.vue'
import {computed, ref, onMounted, reactive, nextTick} from "vue"
import api from '/src/store'
import {ElMessage} from "element-plus"
import UploadImage from '@/components/UploadImage.vue'

const authenticationStore = api.authenticationStore()
const configStore = api.configStore()
const list = computed(()=>authenticationStore.authentication_list)
const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()

onMounted(()=>{
    //initMap()
})

let form = ref({
    username: '',
    id: '',
    uid: '',
    card_no: '',
    status: '',
    remark: ''
})

const rules = reactive({
    username: [
        { required: true, message: '请填写姓名', trigger: 'blur' }
    ],
    card_no: [
        { required: true, message: '请填写身份证号码', trigger: 'blur' }
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
    authenticationStore.authentication_del({id: item.id}).then(res=>{
        refresh()
    })
}

const submit = () => {
    formRef.value.validate((valid, fields) => {
        if(valid){
            let data = JSON.parse(JSON.stringify(form.value))
            if(data.id > 0){ // 编辑
                submitLoading.value = true
                authenticationStore.authentication_update(data).then(res=>{
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
                authenticationStore.authentication_add(data).then(res=>{
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
    authenticationStore.authentication_lists().then(res=>{
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
