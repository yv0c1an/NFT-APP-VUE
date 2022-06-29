<template>
    <div class="main_body flex-column">
        <div class="main_body flex-column overflow-y-auto m">
            <div class="filter">
                <el-button @click="refresh" :class="loading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i><span>{{ loading? '加载中...':'刷新' }}</span></el-button>
            </div>
            <el-table :data="list.data" stripe style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="user.name" label="用户" width="200" />
                <el-table-column prop="ip" label="操作IP" />
                <el-table-column prop="desc" label="操作描述" />
                <el-table-column prop="created_at" label="时间" />
<!--                <el-table-column label="操作">-->
<!--                    <template #default="item">-->
<!--                        <el-button @click="view(item)" type="primary" size="small"><span>查看</span></el-button>-->
<!--                    </template>-->
<!--                </el-table-column>-->
            </el-table>
        </div>
        <div class="main_footer">
            <div class="main_footer_l">

            </div>
            <div class="main_footer_r">
                <page :page-size="param.per_page" :total="param.total" @currentChange="currentChange" @sizeChange="sizeChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import page from '../../components/page.vue'
import {computed, ref, onMounted, reactive} from "vue"
import api from '@/store'
import {ElMessage} from "element-plus"

const logStore = api.logStore()
const list = computed(()=>logStore.log_list)
const loading = ref(false)
const formRef = ref()
const param = ref({
    total: 0,
    page: 1,
    per_page: 20
})

onMounted(()=>{
    refresh()
})

const view = item => {

}

const currentChange = val =>{
    param.value.page = val
    refresh()
}

const sizeChange = val =>{
    param.value.per_page = val
    refresh()
}

const refresh = () => {
    loading.value = true
    logStore.log_lists(param.value).then(res=>{
        param.value.total = res.total
        loading.value = false
    }).catch(err=>{
        loading.value = false
    })
}

</script>

<style scoped>

</style>
