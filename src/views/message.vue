<template>
    <div class="main_body flex-column">
        <div class="main_body flex-column overflow-y-auto m">
            <div class="filter">
                <el-button @click="add" type="primary"><i class="iconfont icon-add-select"></i><span>新增</span></el-button>
                <el-button @click="refresh" :class="loading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i><span>{{ loading? '加载中...':'刷新' }}</span></el-button>
            </div>
            <el-table :data="list?.data" stripe style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="id" label="ID" width="100" />
                <el-table-column prop="title" label="标题" width="200" />
                <el-table-column prop="uid" label="发布者" width="200" >
                    <template #default="scope">
                        {{scope.row.publish_uid==0?'系统发布':scope.row.user?.name}}
                    </template>
                </el-table-column>
                <el-table-column prop="receive" label="接收对象" width="200" >
                    <template #default="scope">
                        {{scope.row.all_user?scope.row.receive.length+'个用户':'全部用户'}}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" >
                    <template #default="scope">
                        <el-tag effect="dark" :type="!scope.row.status?'info':'success'">{{!scope.row.status?'推送中':'推送完毕'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="item">
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
                <page :total="param.total" :pageSize="param.per_page" @currentChange="currentChange" @sizeChange="sizeChange" />
            </div>
        </div>
    </div>
    <el-drawer
        v-model="dialogVisible"
        title="创建通知"
        direction="rtl"
        :destroy-on-close="true"
        :size="850"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="填写标题" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="接收对象" prop="all_user">
                <el-radio-group v-model="form.all_user" class="ml-4">
                    <el-radio :label="0">全部用户</el-radio>
                    <el-radio :label="1">部分用户</el-radio>
                </el-radio-group>
                <div style="width: 100%;" v-if="form.all_user==1">
                <div style="width: 100%;">
                    <el-tag
                        v-if="form.receive.length>0"
                        effect="dark"
                        closable
                        round
                        @close="userClose(index)"
                        v-for="(item, index) in form.receive"
                    >
                        {{ item.name }}
                    </el-tag>
                </div>
                <el-button type="primary" @click="dataSelect('user')" style="margin-top: 10px;width: 150px;" plain><i class="iconfont icon-add-select"></i> 选择用户</el-button>
                </div>
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
    <DataSelect :show="selectShow" :name="selectName" @close="selectClose" @selectList="selectList" />
</template>

<script setup>
import dayjs from 'dayjs'
import page from '@/components/page.vue'
import {computed, ref, onMounted, reactive, nextTick} from "vue"
import api from '/src/store'
import {ElMessage} from "element-plus"
import UploadImage from '@/components/UploadImage.vue'
import Editor from '@/components/Editor.vue'
import DataSelect from '@/components/DataSelect.vue'

const messageStore = api.messageStore()
const configStore = api.configStore()
const list = computed(()=>messageStore.message_list)
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
    all_user: 0,
    title: '',
    receive: [],
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


const add = () => {
    dialogVisible.value = true
}

const delListConfirm = (item) => {
    messageStore.message_del({id: item.id}).then(res=>{
        refresh()
    })
}

const submit = () => {
    formRef.value.validate((valid, fields) => {
        if(valid){
            let data = JSON.parse(JSON.stringify(form.value))
            data.receive = data.receive.map(item=>item.id)
            console.log(data)
            submitLoading.value = true
            messageStore.message_add(data).then(res=>{
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
    })
}

onMounted(()=>{
    refresh()
})

const refresh = () => {
    loading.value = true
    messageStore.message_lists().then(res=>{
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

// 选择用户
const selectName = ref()
const selectShow = ref(false)
const userClose = (index) =>{
    form.value.receive.splice(index, 1)
}
const dataSelect = name =>{
    console.log(name)
    selectName.value = name
    selectShow.value = true
}
const selectClose = () =>{
    selectShow.value = false
}
const selectList = items =>{
    form.value.receive = items
}
</script>

<style scoped>

</style>
