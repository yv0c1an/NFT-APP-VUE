<template>
    <div class="main_body flex-column">
        <div class="main_body flex-column overflow-y-auto m">
            <div class="filter">
                <el-button @click="add" type="primary"><i class="iconfont icon-add-select"></i><span>新增</span></el-button>
                <el-button @click="refresh" :class="loading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i><span>{{ loading? '加载中...':'刷新' }}</span></el-button>
            </div>
            <el-table :data="list?.data" stripe style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="title" label="标题" width="400" >
                    <template #default="scope">
                        {{scope.row.title}} <el-tag size="small" v-if="scope.row.slide" effect="dark">幻灯片</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="cover" label="封面" width="200" >
                    <template #default="scope">
                        <div class="table-cell-avatar">
                            <el-image
                                v-if="scope.row.cover"
                                style="width: 150px; height: auto"
                                :preview-src-list="[file_url+scope.row.cover]"
                                :src="file_url+scope.row.cover+'?x-oss-process=style/w600'"
                                fit="cover"
                                preview-teleported
                                hide-on-click-modal
                            />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="80" />
                <el-table-column prop="uid" label="发布者" width="200" >
                    <template #default="scope">
                        {{scope.row.user?.name}}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100" >
                    <template #default="scope">
                        <el-tag size="small" effect="dark" :type="scope.row.status?'success':'danger'">{{scope.row.status?'正常':'禁用'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="200" />
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
                <page :total="param.total" :pageSize="param.per_page" @currentChange="currentChange" @sizeChange="sizeChange" />
            </div>
        </div>
    </div>
    <el-drawer
        v-model="dialogVisible"
        :title="form.id?'编辑公告':'新建公告'"
        direction="rtl"
        :destroy-on-close="true"
        :size="850"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="填写标题" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="封面" prop="cover">
                <UploadImage @callback="callback" :url="form.cover"></UploadImage>
                <div class="tip">幻灯片尺寸为750*400像素</div>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model.number="form.sort" placeholder="填写排序" style="width: 200px;" />
                <div class="tip">数字越高排在越前面</div>
            </el-form-item>
            <el-form-item label="幻灯片" prop="slide">
                <el-switch
                    v-model="form.slide"
                    inline-prompt
                    active-text="是"
                    inactive-text="否"
                    :active-value="1"
                    :inactive-value="0"
                />
                <div class="tip">是否设置为幻灯片</div>
            </el-form-item>
            <el-form-item label="显示状态" prop="slide">
                <el-switch
                    v-model="form.status"
                    inline-prompt
                    active-text="开"
                    inactive-text="关"
                    :active-value="1"
                    :inactive-value="0"
                />
                <div class="tip">是否显示此公告</div>
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

const announcementStore = api.announcementStore()
const configStore = api.configStore()
const file_url = computed(()=>configStore.file_url)
const list = computed(()=>announcementStore.announcement_list)
const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()


const editor_callback = (val) => {
    form.value.content = val
}
const callback = (val) => {
    form.value.cover = val
}
onMounted(()=>{
    //initMap()
})

let form = ref({
    cover: '',
    id: '',
    title: '',
    content: '',
    slide: false,
    sort: 0,
    status: 1
})

const rules = reactive({
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
    form.value.sort = 0
    form.value.status = 1
    form.value.id = ''
    form.value.cover = ''
    form.value.slide = false
    form.value.title = ''
    form.value.content = ''
    dialogVisible.value = true
}

const delListConfirm = (item) => {
    announcementStore.announcement_del({id: item.id}).then(res=>{
        refresh()
    })
}

const submit = () => {
    formRef.value.validate((valid, fields) => {
        if(valid){
            let data = JSON.parse(JSON.stringify(form.value))
            if(data.id > 0){ // 编辑
                submitLoading.value = true
                announcementStore.announcement_update(data).then(res=>{
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
                announcementStore.announcement_add(data).then(res=>{
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
    announcementStore.announcement_lists().then(res=>{
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
