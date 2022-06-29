<template>
    <div class="main_body flex-column">
        <div class="main_body flex-column overflow-y-auto m">
            <div class="filter">
                <el-button @click="add" type="primary"><i class="iconfont icon-add-select"></i><span>新增</span></el-button>
                <el-button @click="refresh" :class="loading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i><span>{{ loading? '加载中...':'刷新' }}</span></el-button>
            </div>
            <el-table :data="list" stripe style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="name" label="名称" width="200" />
                <el-table-column prop="remark" label="描述" />
                <el-table-column label="操作">
                    <template #default="item">
                        <el-button @click="edit(item.row)" type="primary" size="small"><span>编辑</span></el-button>
                        <el-popconfirm title="删除后无法恢复，确定删除?" @confirm="delListConfirm(item.row)">
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
                <page :total="total" />
            </div>
        </div>
    </div>
    <el-drawer
        v-model="dialogVisible"
        :title="form.id?'编辑角色':'新建角色'"
        direction="rtl"
        :destroy-on-close="true"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="form.name" placeholder="填写角色名称" />
            </el-form-item>
            <el-form-item label="角色描述" prop="remark">
                <el-input type="textarea" v-model="form.remark" placeholder="填写角色描述" />
            </el-form-item>
            <el-form-item label="角色权限" prop="permissions">
                <div style="width: 100%"><el-tree-v2 @check-change="checkChange" :default-checked-keys="form.permissions" :data="treeData" :props="treeProps" show-checkbox /></div>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit" :loading="submitLoading">确定</el-button>
        </template>
    </el-drawer>
</template>

<script setup>
import page from '../../components/page.vue'
import {computed, ref, onMounted, reactive} from "vue"
import api from '/src/store'
import {ElMessage} from "element-plus"

const permissionStore = api.permissionStore()
const roleStore = api.roleStore()
const list = computed(()=>roleStore.role_list)
const treeData = computed(()=>permissionStore.permission_tree_list)
const total = computed(()=>roleStore.role_list.length)
const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()

const treeProps = {
    value: 'id',
    label: 'title',
    children: 'children'
}
const form = ref({
    name: '',
    remark: '',
    permissions: [],
    id: ''
})

const rules = reactive({
    name: [
        { required: true, message: '请填写角色名称', trigger: 'blur' }
    ],
    permissions: [
        { required: true, message: '选择角色权限', trigger: 'blur' }
    ]
})

const edit = (item) => {
    form.value.id = item.id
    form.value.name = item.name
    form.value.remark = item.remark
    form.value.permissions = item.permissions.map(item=>item.id)
    dialogVisible.value = true
}

const add = () => {
    form.value.name = ''
    form.value.remark = ''
    form.value.id = ''
    form.value.permissions = []
    dialogVisible.value = true
}

const delListConfirm = (item) => {
    roleStore.roles_del({id: item.id}).then(res=>{
        refresh()
    })
}

const checkChange = (data, selected)=>{
    let arr = form.value.permissions
    if(selected){ // 勾选
        if(data?.children){
            for (const datum of data.children) {
                arr.push(datum.id)
            }
        }else{
            arr.push(data.id)
        }
    }else{ // 取消
        if(data?.children){
            for (const datum of data.children) {
                arr.splice(arr.findIndex(item => item === datum.id), 1)
            }
        }else{
            arr.splice(arr.findIndex(item => item === data.id), 1)
        }
    }
}

const submit = () => {
    formRef.value.validate((valid, fields) => {
        if(valid){
            if(form.value.id > 0){ // 编辑
                submitLoading.value = true
                roleStore.roles_update(form.value).then(res=>{
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
                roleStore.roles_add({name: form.value.name, permissions: form.value.permissions}).then(res=>{
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
    permissionStore.permission_tree_lists()
})

const refresh = () => {
    loading.value = true
    roleStore.roles_lists().then(res=>{
        loading.value = false
    }).catch(err=>{
        loading.value = false
    })
}

</script>

<style scoped>

</style>
