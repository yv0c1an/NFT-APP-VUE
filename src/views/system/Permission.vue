<template>
    <div class="main_side" style="width:200px;">
        <div class="main_side_top">
            <div class="main_side_top_l"><h3>权限分类</h3></div>
            <div class="main_side_top_r">
                <el-button size="small" @click="get_permission_lists" circle :class="parentLoading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i></el-button>
                <el-button style="margin-left: 5px;" size="small" @click="addParent" circle><i class="iconfont icon-add-select"></i></el-button>
            </div>
        </div>
        <div class="main_side_bottom">
            <div class="empty" v-if="parentList.length==0">无分类数据，请先添加</div>
            <el-menu
                :defaultActive="parentList.length>0?parentList[0].id.toString():''"
                class="main_side_menu space-between"
                @select="selectParent"
            >
                <el-menu-item :index="item.id.toString()" v-for="item in parentList">
                    <div class="main_side_menu_l">
                        {{item.title}}
                    </div>
                    <div class="main_side_menu_r">
                        <i @click.stop="editParent(item)" class="iconfont icon-bianji"></i>
                        <el-popconfirm title="删除后无法恢复，确定删除?" @confirm="delConfirm(item)">
                            <template #reference>
                                <i class="iconfont icon-shanchu" @click.stop></i>
                            </template>
                        </el-popconfirm>
                    </div>
                </el-menu-item>
            </el-menu>
        </div>
    </div>
    <div class="main_body flex-column">
        <div class="main_body flex-column overflow-y-auto m">
            <div class="filter">
                <el-button @click="add" type="primary"><i class="iconfont icon-add-select"></i><span>新增</span></el-button>
                <el-button @click="refresh" :class="loading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i><span>{{ loading? '加载中...':'刷新' }}</span></el-button>
            </div>
            <el-table :data="list" stripe style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="title" label="名称" width="200" />
                <el-table-column prop="name" label="标识" width="180" />
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
    <el-dialog
        v-model="dialogVisible"
        :title="editType=='edit'?'编辑权限':editType=='add'?'新建权限':editType=='editCate'?'编辑分组':'新增分组'"
        width="450px"
    >
        <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item :label="editType=='edit'||editType=='add'?'权限名称':'分组名称'" prop="title">
                <el-input v-model="form.title" placeholder="填写权限名称" />
            </el-form-item>
            <el-form-item :label="editType=='edit'||editType=='add'?'权限标识':'分组标识'" prop="name">
                <el-input v-model="form.name" placeholder="填写权限标识" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit" :loading="submitLoading">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import api from '/src/store'
import page from '../../components/page.vue'

const parentLoading = ref(false)
const loading = ref(false)
const permissionStore = api.permissionStore()
const parentList = computed(()=>permissionStore.permission_parent_list)
const list = computed(()=>permissionStore.permission_list)
const curId = ref(parentList.value.length>0?parentList.value[0].id:0)
const total = computed(()=>permissionStore.permission_list.length)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const editType = ref('add') // 编辑框类型，add新增权限，edit编辑权限，addCate新增分类，editCate编辑分类
const form = ref({
    title: '',
    name: '',
    id: ''
})
const formRef = ref()

const rules = reactive({
    title: [
        { required: true, message: '请填写权限名称', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请填写权限标识', trigger: 'blur' }
    ]
})

const add = () => {
    editType.value = 'add'
    form.value.title = ''
    form.value.name = ''
    form.value.id = ''
    dialogVisible.value = true
}

const edit = (item) => {
    editType.value = 'edit'
    dialogVisible.value = true
    form.value.title = item.title
    form.value.name = item.name
    form.value.id = item.id
}

const submit = () => {
    formRef.value.validate((valid, fields) => {
        if(valid){
            if(form.value.id > 0){ // 编辑
                submitLoading.value = true
                permissionStore.permission_update(form.value).then(res=>{
                    submitLoading.value = false
                    dialogVisible.value = false
                    if(editType.value == 'add' || editType.value == 'edit'){
                        refresh()
                    }else{
                        get_permission_lists()
                    }
                    ElMessage({
                        type: 'success',
                        message: res.msg,
                    })
                }).catch(err=>{
                    submitLoading.value = false
                })
            }else{ // 新增
                submitLoading.value = true
                let p = {
                    title: form.value.title,
                    name: form.value.name
                }
                if(editType.value == 'add'){
                    p.parent = curId.value
                }
                permissionStore.permission(p).then(res=>{
                    submitLoading.value = false
                    dialogVisible.value = false
                    if(editType.value == 'add' || editType.value == 'edit'){
                        refresh()
                    }else{
                        get_permission_lists()
                    }
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

const get_permission_lists = (callback) => {
    parentLoading.value = true
    permissionStore.permission_lists({id: 0}).then(res=>{
        parentLoading.value = false
        callback(res)
    }).catch(err=>{
        parentLoading.value = false
    })
}
if(parentList.value.length == 0){
    get_permission_lists(function(res){
        curId.value = res[0].id
        refresh()
    })
}

onMounted(()=>{
    refresh()
})

const selectParent = (id) => {
    curId.value = id
    refresh()
}

const del = (item, callback) => {
    permissionStore.permission_del({id: item.id}).then(res=>{
        ElMessage({
            type: 'success',
            message: res.msg,
        })
        callback(res)
    })
}

const delListConfirm = (item) => {
    del(item, (res)=>{
        refresh()
    })
}

const delConfirm = (item) => {
    del(item, (res)=>{
        get_permission_lists()
    })
}

const refresh = () => {
    if(curId.value < 1)
        return
    loading.value = true
    permissionStore.permission_lists({id: curId.value}).then(res=>{
        loading.value = false
    }).catch(err=>{
        loading.value = false
    })
}

const editParent = (item) => {
    editType.value = 'editCate'
    dialogVisible.value = true
    form.value.title = item.title
    form.value.name = item.name
    form.value.id = item.id
}

const addParent = () => {
    editType.value = 'addCate'
    form.value.title = ''
    form.value.name = ''
    form.value.id = ''
    dialogVisible.value = true
}
</script>

<style scoped>

</style>
