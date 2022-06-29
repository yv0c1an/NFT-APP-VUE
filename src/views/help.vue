<template>
    <div class="main_side" style="width:200px;">
        <div class="main_side_top">
            <div class="main_side_top_l"><h3>帮助分类</h3></div>
            <div class="main_side_top_r">
                <el-button size="small" @click="get_help_lists" circle :class="parentLoading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i></el-button>
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
                        {{item.name}}
                    </div>
                    <div class="main_side_menu_r">
                        <i @click.stop="editParent(item)" class="iconfont icon-bianji"></i>
                        <el-popconfirm title="删除后无法恢复，确定删除?" @confirm="delParent(item)">
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
                <el-button @click="addCon" type="primary"><i class="iconfont icon-add-select"></i><span>新增</span></el-button>
                <el-button @click="refresh" :class="loading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i><span>{{ loading? '加载中...':'刷新' }}</span></el-button>
            </div>
            <el-table :data="list.data" stripe style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="title" label="标题" width="200" />
                <el-table-column prop="sort" label="排序" width="180" />
                <el-table-column prop="status" label="状态" >
                    <template #default="scope">
                        {{scope.row.status==0?'禁用':'正常'}}
                    </template>
                </el-table-column>
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
    <el-dialog
        v-model="dialogVisible"
        :title="form.id?'编辑分组':'新增分组'"
        width="450px"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
            <el-form-item label="分组名称" prop="name">
                <el-input v-model="form.name" placeholder="填写分组名称" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="form.sort" placeholder="填写排序序号" />
                <div class="tip">数字越高越排前面</div>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitParent" :loading="submitLoading">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <el-drawer
        v-model="conVisible"
        :title="conform.id?'编辑帮助内容':'新建帮助内容'"
        direction="rtl"
        :destroy-on-close="true"
        :size="850"
    >
        <el-form ref="conformRef" :model="conform" :rules="conrules" label-width="80px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="conform.title" placeholder="填写标题" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="conform.sort" placeholder="填写排序" style="width: 200px;" />
                <div class="tip">数字越高越排前面</div>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="conform.status">
                    <el-radio-button :label="0" >禁用</el-radio-button>
                    <el-radio-button :label="1" >正常</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <div style="border: 1px solid #dcdfe6">
                    <Editor :content="conform.content" @callback="editor_callback" />
                </div>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="conVisible = false">取消</el-button>
            <el-button type="primary" @click="submit" :loading="consubmitLoading">确定</el-button>
        </template>
    </el-drawer>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import api from '@/store'
import page from '@/components/page.vue'
import Editor from '@/components/Editor.vue'

const parentLoading = ref(false)
const loading = ref(false)
const helpStore = api.helpStore()
const helpCategoryStore = api.helpCategoryStore()
const parentList = computed(()=>helpCategoryStore.help_category_list)
const list = computed(()=>helpStore.help_list)
const curId = ref(parentList.value.length>0?parentList.value[0].id:0)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const form = ref({
    sort: 0,
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

const get_help_lists = () => {
    parentLoading.value = true
    helpCategoryStore.help_category_lists().then(res=>{
        parentLoading.value = false
        curId.value = res[0].id
        refresh()
    }).catch(err=>{
        parentLoading.value = false
    })
}
get_help_lists()

const selectParent = (id) => {
    curId.value = id
    refresh()
}

const editParent = (item) => {
    dialogVisible.value = true
    form.value = item
}

const addParent = () => {
    form.value.sort = 0
    form.value.name = ''
    form.value.id = ''
    dialogVisible.value = true
}

const submitParent = () => {
    formRef.value.validate((valid, fields) => {
        if(valid){
            if(form.value.id > 0){ // 编辑
                submitLoading.value = true
                helpCategoryStore.help_category_update(form.value).then(res=>{
                    submitLoading.value = false
                    dialogVisible.value = false
                    get_help_lists()
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
                helpCategoryStore.help_category_add(p).then(res=>{
                    submitLoading.value = false
                    dialogVisible.value = false
                    get_help_lists()
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
const delParent = (item) => {
    helpCategoryStore.help_category_del({id: item.id}).then(res=>{
        ElMessage({
            type: 'success',
            message: res.msg,
        })
        get_help_lists()
    })
}

// 帮助文章
const conformRef = ref()

const conrules = reactive({
    title: [
        { required: true, message: '请填写标题', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请填写内容', trigger: 'blur' }
    ]
})
const edit = (item) => {
    let items = JSON.parse(JSON.stringify(item))
    console.log(items)
    conVisible.value = true
    conform.value = items
}
const refresh = () => {
    if(curId.value < 1)
        return
    loading.value = true
    helpStore.help_lists({category: curId.value}).then(res=>{
        loading.value = false
    }).catch(err=>{
        loading.value = false
    })
}
const conform = ref({
    title: '',
    id: '',
    content: '',
    sort: 0,
    status: 1
})
const editor_callback = (val) => {
    conform.value.content = val
}
const conVisible = ref(false)
const consubmitLoading = ref(false)
const delListConfirm = (item) => {
    helpStore.help_del({id: item.id}).then(res=>{
        ElMessage({
            type: 'success',
            message: res.msg,
        })
        refresh()
    })
}
const addCon = () =>{
    conform.value.id = ''
    conform.value.title = ''
    conform.value.content = ''
    conform.value.sort = 0
    conform.value.status = 1
    conVisible.value = true
}
const submit = () =>{
    conformRef.value.validate((valid, fields) => {
        if(valid){
            conform.value.category = [curId.value]
            if(conform.value.id > 0){ // 编辑
                consubmitLoading.value = true
                helpStore.help_update(conform.value).then(res=>{
                    consubmitLoading.value = false
                    conVisible.value = false
                    refresh()
                    ElMessage({
                        type: 'success',
                        message: res.msg,
                    })
                }).catch(err=>{
                    consubmitLoading.value = false
                })
            }else{ // 新增
                consubmitLoading.value = true
                helpStore.help_add(conform.value).then(res=>{
                    consubmitLoading.value = false
                    conVisible.value = false
                    refresh()
                    ElMessage({
                        type: 'success',
                        message: res.msg,
                    })
                }).catch(err=>{
                    consubmitLoading.value = false
                })
            }
        }
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
