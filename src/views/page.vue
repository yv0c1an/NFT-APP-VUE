<template>
    <div class="main_body flex-column">
        <div class="main_body flex-column overflow-y-auto m">
            <div class="filter">
                <el-button @click="add" type="primary"><i class="iconfont icon-add-select"></i><span>新增</span></el-button>
                <el-button @click="refresh" :class="loading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i><span>{{ loading? '加载中...':'刷新' }}</span></el-button>
            </div>
            <el-table :data="list.data" stripe style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="title" label="标题" width="200" />
                <el-table-column prop="name" label="标识" width="200" />
                <el-table-column prop="uid" label="发布者" width="200" >
                    <template #default="scope">
                        {{scope.row.user?.name}}
                    </template>
                </el-table-column>
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
        :title="form.id?'编辑页面':'新建页面'"
        direction="rtl"
        :destroy-on-close="true"
        :size="850"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="填写标题" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="标识" prop="name">
                <el-input v-model="form.name" placeholder="填写标识" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <div style="border: 1px solid #dcdfe6">
                    <Editor :content="form.content" @callback="editor_callback" />
                </div>
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
import Editor from '@/components/Editor.vue'

const pageStore = api.pageStore()
const configStore = api.configStore()
const list = computed(()=>pageStore.page_list)
const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()


const editor_callback = (val) => {
    form.value.content = val
}

onMounted(()=>{
    //initMap()
})

let form = ref({
    name: '',
    id: '',
    title: '',
    content: ''
})

const rules = reactive({
    name: [
        { required: true, message: '请填写标识', trigger: 'blur' }
    ],
    title: [
        { required: true, message: '请填写标题', trigger: 'blur' }
    ]
})

const edit = (items) => {
    let item = JSON.parse(JSON.stringify(items))
    console.log(item)
    form.value = item
    dialogVisible.value = true
}

const add = () => {
    form.value.name = ''
    form.value.id = ''
    form.value.title = ''
    form.value.content = ''
    dialogVisible.value = true
}

const delListConfirm = (item) => {
    pageStore.page_del({id: item.id}).then(res=>{
        refresh()
    })
}

const submit = () => {
    formRef.value.validate((valid, fields) => {
        if(valid){
            let data = JSON.parse(JSON.stringify(form.value))
            if(data.id > 0){ // 编辑
                submitLoading.value = true
                pageStore.page_update(data).then(res=>{
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
                pageStore.page_add(data).then(res=>{
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
    pageStore.page_lists().then(res=>{
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
