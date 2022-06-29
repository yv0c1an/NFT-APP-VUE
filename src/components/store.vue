<template>
    <el-dialog
        :width="1070"
        title="文件管理器"
        custom-class="store"
        @close="close"
        v-model="show"
    >
        <div class="main_body">
            <div class="main_side">
                <div class="main_side_top">
                    <div class="main_side_top_l"><h3>文件分类</h3></div>
                    <div class="main_side_top_r">
                        <el-button size="small" circle @click="cate_refresh" :class="cate_refresh_loading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i></el-button>
                        <el-popover
                            :width="250"
                            ref="popover"
                            trigger="click"
                            :hide-after="0"
                        >
                            <template #reference>
                                <el-button style="margin-left: 5px;" size="small" circle><i class="iconfont icon-add-select"></i></el-button>
                            </template>
                            <template #default>
                                <el-input v-model="cate_name" placeholder="输入分类名称" />
                                <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
                                    <el-button type="primary" size="small" :loading="cate_loading" @click="add_cate">确定</el-button>
                                </div>
                            </template>
                        </el-popover>
                    </div>
                </div>
                <div class="main_side_bottom scrollbar">
                    <el-menu
                        :defaultActive="'menu_'+selected_group_id"
                        class="main_side_menu space-between"
                        @select="selectCate"
                    >
                        <el-menu-item index="menu_0">全部</el-menu-item>
                        <el-menu-item :index="'menu_'+item.id" v-for="item in cate_list">
                            <div class="main_side_menu_l">
                                <i class="icons icon_folder"></i>
                                <span>{{item.name}}</span>
                            </div>
                            <div class="main_side_menu_r" v-if="item.id != 1">
                                <el-popover
                                    :width="250"
                                    :hide-after="0"
                                    trigger="click"
                                >
                                    <template #reference>
                                        <i @click.stop="editCateGorup(item)" class="iconfont icon-bianji"></i>
                                    </template>
                                    <template #default>
                                        <el-input v-model="cate_form.name" placeholder="输入分类名称" />
                                        <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
                                            <el-button type="primary" size="small" :loading="cate_loading" @click="update_cate">确定</el-button>
                                        </div>
                                    </template>
                                </el-popover>
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
            <div class="main_body">
                <div class="main_body flex-column">
                    <div class="main_body flex-column" style="overflow:hidden;">
                        <div class="main_side_top store_filter">
                            <div class="main_side_top_l">
                                <el-input
                                    v-model="key"
                                    class="w-50 m-2"
                                    placeholder="文件名搜索"
                                    style="width: 250px"
                                    clearable
                                    @clear="search"
                                >
                                    <template #prefix>
                                        <i style="display: flex;align-items: center;" class="iconfont icon-sousuo"></i>
                                    </template>
                                    <template #append>
                                        <a style="cursor: pointer;color:#fff;" @click="search">搜索</a>
                                    </template>
                                </el-input>
                                <div class="store_select_num" v-if="selectList.length>0">共选择 {{selectList.length}} 个</div>
                            </div>
                            <div class="main_side_top_r">

                            </div>
                        </div>
                        <div class="main_side_bottom store_con scrollbar">
                            <el-upload class="store_main upload--picture-card" :data="postData" :headers="headers" :action="upload_url" :show-file-list="false" multiple :on-change="onChange" :on-error="onError" :on-progress="onProgress" :on-success="onSuccess">
                                <div class="upload_text">
                                    <i class="iconfont icon-add-select"></i>
                                    <span>上传文件</span>
                                </div>
                            </el-upload>
                            <div class="store_item" :class="{allow_select: item.id, store_select:store_select(item.id)}" v-for="(item, index) in fileList" @click="view(item)">
                                <div class="store_select_label"><i class="iconfont icon-seleted"></i></div>
                                <div class="store_item_action">
                                    <i class="iconfont icon-browse" @click.stop="showImg(index)"></i>
                                    <i class="iconfont icon-shanchu" @click.stop="rmImg(item.id)"></i>
                                </div>
                                <div class="store_loading" v-if="!item.id">
                                    <div class="store_loading_progress">
                                        <el-progress
                                            status="warning"
                                            :percentage="100"
                                            :indeterminate="true"
                                            :show-text="false"
                                            :duration="1"
                                        />
                                    </div>
                                </div>
                                <img :data-url="item.id?file_url+item.url:item.url" :src="item.id?file_url+item.url+'?x-oss-process=style/w600':item.url">
                            </div>
                        </div>
                    </div>
                    <div class="main_footer">
                        <div class="main_footer_l"></div>
                        <div class="main_footer_r">
                            <page :total="page.total" :page-size="page.per_page" :current-page="page.page" @sizeChange="sizeChange" @currentChange="currentChange" />
                        </div>
                    </div>
                </div>
                <div class="main_side main_side_image" style="width: 250px;">
                    <div v-if="curItem">
                        <div class="store_view_img">
                            <img :src="file_url+curItem.url+'?x-oss-process=style/w600'">
                        </div>
                        <el-form
                            :model="curItem"
                            size="small"
                        >
                            <el-form-item label="尺寸" v-if="curItem.width">
                                {{curItem.width}}px * {{curItem.height}}px
                            </el-form-item>
                            <el-form-item label="大小">
                                {{size(curItem.size)}}
                            </el-form-item>
                            <el-form-item label="链接" class="store-append">
                                <el-input :modelValue="file_url+curItem.url">
                                    <template #append>
                                        <div class="store-append-icon" ref="copyUrlRef" :data-clipboard-text="file_url+curItem.url" @click="copy(copyUrlRef)">
                                            <i class="iconfont icon-fuzhi"></i>
                                        </div>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="分类">
                                <el-select v-model="curItem.group_id" placeholder="移动到分组" @change="editStore">
                                    <el-option
                                        v-for="item in cate_list"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="名称">
                                <el-input v-model="curItem.title" @change="editStore" />
                            </el-form-item>
                            <el-form-item label="描述">
                                <el-input v-model="curItem.remark" type="textarea" @change="editStore" />
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="store_footer">
                <div class="store_l">
                    <el-progress class="store_progress" :percentage="50"><div class="store_progress_text">2G/20G</div></el-progress>
                </div>
                <div class="store_l">
                    <el-button @click="close">取消</el-button>
                    <el-button type="primary" @click="submit">确认</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import Clipboard from 'clipboard'
import {computed, ref, onMounted, reactive, watch, nextTick, onUpdated} from "vue"
import page from '@/components/page.vue'
import {ElMessage, ElLoading, ElMessageBox} from "element-plus"
import api from '/src/store'
import Viewer from 'viewerjs'

export default {
    emits: ["selectList", "close"],
    components: {
        page
    },
    props: {
        max: {
            type: Number,
            default: 0
        },
        show: {
            type: Boolean,
            default: true
        }
    },
    setup(props, ctx){
        const configStore = api.configStore()
        const upload_url = computed(()=>configStore.upload_url)
        const key = ref()
        const selected_group_id = ref(0) // 选中的分类ID
        const fileList = ref([])
        const selectList = ref([])
        const postData = computed(()=>{
            return {group_id: selected_group_id.value}
        })
        const AttachmentStore = api.AttachmentStore()
        const file_url = computed(()=>configStore.file_url)
        const curItem = ref()
        const page = reactive({
            total: 0, // 总页数
            per_page: 20, // 每页显示数量
            page: 1 // 当前页
        })

        const showImg = index => {
            const viewer = new Viewer(document.querySelector('.store_con'), {
                hidden: function () {
                    viewer.destroy();
                },
                initialViewIndex: index,
                zIndex: 9999,
                url: 'data-url' // 可指定img的一个data属性作文图片地址
            })
            viewer.show()
        }

        const rmImg = id => {
            ElMessageBox.confirm('删除后无法恢复，确定删除?', '操作提示', {
                customStyle: {
                    width: '400px'
                }
            }).then(() => {
                AttachmentStore.attachment_del({id: id}).then(res=>{
                    fileList.value.splice(fileList.value.findIndex(item=>item.id==id), 1)
                    selectList.value.splice(selectList.value.findIndex(item=>item.id==id), 1)
                    curItem.value = null
                    ElMessage.success(res.msg)
                })
            }).catch(()=>{

            })
        }
        const copyUrlRef = ref()
        const copy = (ele) => {
            let clipboard = new Clipboard(ele)
            clipboard.on('success', function(e) {
                ElMessage.success('复制成功')
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                ElMessage.error('复制失败')
                clipboard.destroy()
            })
        }

        const close = () => {
            ctx.emit('close')
            selectList.value = []
        }

        const submit = () => {
            if(props.max > 0 && selectList.value.length > props.max){
                ElMessage.error(`最多只能选择${props.max}个文件`)
                return
            }
            ctx.emit('selectList', selectList.value)
            selectList.value = []
        }

        const search = () => {
            list()
        }

        const editStore = (val) => {
            AttachmentStore.attachment_update(curItem.value).then(res=>{
                ElMessage.success(res.msg)
            })
        }

        const store_select = (id) => {
            return selectList.value.find(item=>item.id==id)
        }

        // 监听当前选中的ID
        watch(selected_group_id,(newVal,oldVal)=>{
            key.value = ''
            selectList.value = []
            page.page = 1
            list()
        })

        watch(() => props.show,(newVal,oldVal)=>{
            if(props.show){
                list()
                let { cate_refresh } = cate()
                cate_refresh()
            }
        })

        const sizeChange = num => {
            page.per_page = num
            list()
        }

        const currentChange = num => {
            page.page = num
            list()
        }

        // 获取分组数据
        const list = () => {
            let loading = null
            nextTick(()=>{
                loading = ElLoading.service({
                    target: '.store_con',
                    fullscreen: false
                })
            })

            fileList.value = []
            AttachmentStore.attachment_lists({
                group_id: selected_group_id.value,
                per_page: page.per_page,
                page: page.page,
                key: key.value
            }).then(res=>{
                page.total = res.total
                fileList.value = res.data
                loading.close()
            }).catch(err=>{
                loading.close()
            })
        }

        // 上传加上token
        const l = localStorage.getItem(import.meta.env.VITE_API_STORAGENAME)
        const obj = JSON.parse(l)
        let headers = {}
        if (typeof obj == 'object' && obj) {
            headers.Authorization = 'Bearer '+obj.token
        }

        // 转换大小
        const size = (val) => {
            if(val > 1024*1024*1024){ // G
                return (val/(1024*1024*1024)).toFixed(2)+'GB'
            }else if(val > 1024*1024){ // mb
                return (val/(1024*1024)).toFixed(2)+'MB'
            }else{
                return (val/1024).toFixed(2)+'KB'
            }
        }

        const view = (item) => {
            if(!item.id){
                return
            }
            curItem.value = item
            const index = selectList.value.findIndex(items=>items.id==item.id)
            if(index >= 0){ // 存在则删除
                selectList.value.splice(index, 1)
            }else{
                selectList.value.push(item)
            }
        }

        const onSuccess = (res) => {
            console.log(res)
        }

        const onError = (res, file) => {
            const err = JSON.parse(res.message)
            ElMessage.error(err.msg)
            console.log(file)
            fileList.value.splice(fileList.value.findIndex(item=>item.uid==file.uid), 1)
        }

        const onProgress = (res) => {
            console.log(res)
        }

        const onChange = (res) => {
            // console.log(res)
            if(res.status == "ready"){
                let reader = new FileReader();
                reader.readAsDataURL(res.raw);
                reader.onload = function(){
                    let img = new Image()
                    img.src = reader.result
                    img.onload = function () {
                        let obj = {
                            width: img.width,
                            height: img.height,
                            size: res.size,
                            url: reader.result,
                            title: res.name,
                            id: 0,
                            uid: res.uid,
                            type: 'image',
                            group_id: selected_group_id.value
                        }
                        fileList.value.unshift(obj)
                    }
                }
            }else if(res.status == "success"){
                const index = fileList.value.findIndex(item=>item.uid==res.uid)
                if(res.response.code == 200){
                    fileList.value[index] = res.response.data
                }else{  // 上传出错
                    ElMessage.error(res.response.msg)
                    fileList.value.splice(index, 1)
                }
            }
        }

        // 分类
        const cate = () => {
            const popover = ref()
            const AttachmentGroupStore = api.AttachmentGroupStore()
            const cate_name = ref()
            const cate_loading = ref(false)
            const cate_refresh_loading = ref(false)
            const cate_list = computed(()=>AttachmentGroupStore.attachment_group_list)
            const cate_form = ref({
                name: '',
                id: ''
            })

            const cate_refresh = () => {
                cate_refresh_loading.value = true
                AttachmentGroupStore.attachment_group_lists().then(res=>{
                    cate_refresh_loading.value = false
                    // if(!selected_group_id.value){
                    //     selected_group_id.value = res[0].id
                    // }else if(!res.find(item=>item.id==selected_group_id.value)){
                    //     selected_group_id.value = res[0].id
                    // }
                }).catch(err=>{
                    cate_refresh_loading.value = false
                })
            }
            const add_cate = () => {
                if(!cate_name.value){
                    ElMessage.error('请先填写分类名称')
                    return
                }
                cate_loading.value = true
                AttachmentGroupStore.attachment_group_add({name: cate_name.value}).then(res=>{
                    cate_loading.value = false
                    cate_name.value = ''
                    ElMessage.success(res.msg)
                    cate_refresh()
                    popover.value.hide()
                }).catch(err=>{
                    cate_loading.value = false
                })
            }

            const update_cate = () => {
                if(cate_form.value.name == ''){
                    ElMessage.error('请先填写分类名称')
                    return
                }
                cate_loading.value = true
                AttachmentGroupStore.attachment_group_update(cate_form.value).then(res=>{
                    cate_loading.value = false
                    cate_form.value.name = ''
                    cate_form.value.id = ''
                    ElMessage.success(res.msg)
                    cate_refresh()
                }).catch(err=>{
                    cate_loading.value = false
                })
            }

            const selectCate = (val) => {
                const a = val.split('_')
                selected_group_id.value = Number(a[1])
            }

            const editCateGorup = (item) => {
                cate_form.value.name = item.name
                cate_form.value.id = item.id
            }

            const delConfirm = (item) => {
                AttachmentGroupStore.attachment_group_del({id: item.id}).then(res=>{
                    cate_refresh()
                })
            }

            return{
                cate_name,
                cate_loading,
                add_cate,
                cate_refresh_loading,
                cate_refresh,
                cate_list,
                selectCate,
                editCateGorup,
                delConfirm,
                cate_form,
                update_cate,
                popover
            }
        }

        return{
            page,
            selected_group_id,
            ...cate(),
            key,
            fileList,
            onSuccess,
            onChange,
            onProgress,
            onError,
            upload_url,
            headers,
            postData,
            view,
            curItem,
            selectList,
            size,
            sizeChange,
            currentChange,
            store_select,
            editStore,
            search,
            submit,
            close,
            file_url,
            rmImg,
            copy,
            copyUrlRef,
            showImg
        }
    }
}
</script>

<style scoped>

</style>
