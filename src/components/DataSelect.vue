<template>
    <el-dialog
        title="选择数据"
        :width="800"
        :destroy-on-close="true"
        v-model="show"
        @close="close"
    >
        <el-input
            v-model="key"
            placeholder="搜索"
            style="width: 200px;margin-bottom: 20px;"
        />
        <el-table :data="lists" stripe style="width: 100%" v-loading="loading" @select="select" @select-all="select">
            <el-table-column type="selection" width="50" />
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="user.name" label="用户" />
            <el-table-column prop="mobile" label="电话" v-if="name == 'user'" />
        </el-table>
        <div class="main_footer" style="margin-top: 20px;border-top: none;padding: 0;">
            <div class="main_footer_l">
                <page :total="param.total" @currentChange="currentChange" @sizeChange="sizeChange" />
            </div>
            <div class="main_footer_r">
                <el-button type="primary" @click="ok">确定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import page from '@/components/page.vue'
import { ref, reactive, computed, watch } from "vue";
import api from "@/store";

export default {
    emits: ["selectList", "close"],
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
        },
        params: {
            type: Object,
            default: ()=>{}
        }
    },
    setup(props, ctx){
        const goodsAlbumStore = api.goodsAlbumStore()
        const userStore = api.userStore()
        const goodsStore = api.goodsStore()
        const key = ref()
        const lists = ref()
        const category_list = ref([])
        const selectList = ref([])
        const loading = ref(false)
        const param = ref({
            total: 0,
            page: 1,
            per_page: 10,
            key: '',
            category: []
        })

        const selectChange = (item) => {
            console.log(param.value)
            refresh()
        }

        watch(() => props.show,(newVal,oldVal)=>{
            if(props.show){
                param.value = {...param.value, ...props.params}
                console.log(props.params)
                refresh()
                refresh_category()
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

        const ok = () => {
            ctx.emit('selectList', selectList.value, props.name)
            ctx.emit('close')
        }

        const select = (selection, item) => {
            selectList.value = selection
        }

        const refresh_category = () => {
            // if(props.name == 'album'){
            //     goodsAlbumStore.goods_album_lists().then(res=>{
            //         category_list.value = res
            //     })
            // }
            // else if(props.name == 'service'){
            //     serviceCategoryStore.service_category_lists().then(res=>{
            //         category_list.value = res
            //     })
            // }else if(props.name == 'combo'){
            //     comboCategoryStore.combo_category_lists().then(res=>{
            //         category_list.value = res
            //     })
            // }else if(props.name == 'card'){
            //     cardCategoryStore.card_category_lists().then(res=>{
            //         category_list.value = res
            //     })
            // }
        }

        const refresh = ()=>{
            loading.value = true
            if(props.name == 'user'){
                param.value.type = [1]
                userStore.user_lists(param.value).then(res=>{
                    param.value.total = res.total
                    lists.value = res.data
                    loading.value = false
                }).catch(err=>{
                    loading.value = false
                })
            }else if(props.name == 'goods'){
                goodsStore.goods_lists(param.value).then(res=>{
                    param.value.total = res.total
                    lists.value = res.data
                    loading.value = false
                }).catch(err=>{
                    loading.value = false
                })
            }else if(props.name == 'album'){
                goodsAlbumStore.goods_album_lists(param.value).then(res=>{
                    param.value.total = res.total
                    lists.value = res.data
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
            ok,
            select,
            category_list,
            selectChange
        }
    }
}
</script>

<style scoped>

</style>
