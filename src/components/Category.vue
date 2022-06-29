<template>
    <el-dialog
        title="分类管理"
        :width="600"
        :destroy-on-close="true"
        v-model="show"
        @close="close"
    >
        <el-input
            v-model="key"
            placeholder="搜索"
            style="width: 200px;margin-bottom: 20px;"
        />
        <el-popover placement="top" trigger="click" @before-enter="beforeEnter">
            <template #reference>
                <el-button style="margin-left: 10px;" type="primary"><span>新增</span></el-button>
            </template>
            <div style="display: flex;flex-flow: column;">
                <el-input v-model="form.name" size="small" placeholder="输入分类名称" />
                <div style="margin-top: 5px;display: flex;justify-content: flex-end;">
                    <el-button type="primary" @click="save" size="small" :loading="saveLoading"><span>保存</span></el-button>
                </div>
            </div>
        </el-popover>
        <el-table :data="lists?.data" stripe style="width: 100%" v-loading="loading" @select="select" @select-all="select">
<!--            <el-table-column type="selection" width="50" />-->
            <el-table-column prop="name" label="名称" />
            <el-table-column label="操作">
                <template #default="item">
                    <el-popover placement="top" trigger="click" @before-enter="editBeforeEnter(item.row)">
                        <template #reference>
                            <el-button type="primary" size="small"><span>编辑</span></el-button>
                        </template>
                        <div style="display: flex;flex-flow: column;">
                            <el-input v-model="form.name" size="small" />
                            <div style="margin-top: 5px;display: flex;justify-content: flex-end;">
                                <el-button type="primary" @click="edit" size="small" :loading="saveLoading"><span>保存</span></el-button>
                            </div>
                        </div>
                    </el-popover>
                    <el-popconfirm title="删除后无法恢复，确定删除?" @confirm="del(item.row)">
                        <template #reference>
                            <el-button type="danger" size="small"><span>删除</span></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <div class="main_footer" style="margin-top: 20px;border-top: none;padding: 0;">
            <div class="main_footer_l">
                <page :total="param.total" @currentChange="currentChange" @sizeChange="sizeChange" />
            </div>
            <div class="main_footer_r">

            </div>
        </div>
    </el-dialog>
</template>

<script>
import page from '@/components/page.vue'
import { ref, reactive, computed, watch } from "vue";
import api from "@/store";
import {ElMessage} from "element-plus";

export default {
    emits: ["close"],
    components:{
        page
    },
    props: {
        name: {
            type: String,
            default: '',
            required: true
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    setup(props, ctx){
        const goodsAlbumStore = api.goodsAlbumStore()
        const key = ref()
        const lists = ref()
        const selectList = ref([])
        const loading = ref(false)
        const saveLoading = ref(false)
        const param = ref({
            total: 0,
            page: 1,
            per_page: 10,
            key: ''
        })

        const form = ref({
            name: '',
            id: '',
            sort: 0
        })

        watch(() => props.show,(newVal,oldVal)=>{
            if(props.show){
                refresh()
                console.log('loading')
            }
        })
        const currentChange = val =>{
            param.value.page = val
            refresh()
        }

        const sizeChange = val =>{
            param.value.per_page = val
            refresh()
        }

        const close = () => {
            ctx.emit('close')
            selectList.value = []
        }

        const del = (item) => {
            if(props.name == 'album'){
                goodsAlbumStore.goods_album_del({id: item.id}).then(res=>{
                    ElMessage.success(res.msg)
                    refresh()
                }).catch(err=>{

                })
            }
        }

        const edit = () => {
            saveLoading.value = true
            if(props.name == 'album'){
                goodsAlbumStore.goods_album_update(form.value).then(res=>{
                    ElMessage.success(res.msg)
                    saveLoading.value = false
                    refresh()
                }).catch(err=>{
                    saveLoading.value = false
                })
            }
        }

        const editBeforeEnter = item => {
            let a = JSON.parse(JSON.stringify(item))
            form.value.id = a.id
            form.value.name = a.name
            form.value.sort = a.sort
            console.log(item)
        }

        const select = (selection, item) => {
            selectList.value = selection
        }

        const beforeEnter = () => {
            form.value.name = ''
            form.value.id = ''
            form.value.sort = 0
        }

        const save = () => {
            if(form.value.name == ''){
                ElMessage.error('请输入分类名称')
                return
            }
            saveLoading.value = true
            if(props.name == 'album'){
                goodsAlbumStore.goods_album_add(form.value).then(res=>{
                    ElMessage.success(res.msg)
                    saveLoading.value = false
                    refresh()
                }).catch(err=>{
                    saveLoading.value = false
                })
            }
        }

        const refresh = ()=>{
            loading.value = true
            if(props.name == 'album'){
                goodsAlbumStore.goods_album_lists(param.value).then(res=>{
                    param.value.total = res.total
                    lists.value = res
                    loading.value = false
                }).catch(err=>{
                    loading.value = false
                })
            }
        }

        return{
            key,
            param,
            sizeChange,
            currentChange,
            lists,
            loading,
            close,
            select,
            del,
            edit,
            form,
            save,
            saveLoading,
            beforeEnter,
            editBeforeEnter
        }
    }
}
</script>

<style scoped>

</style>
