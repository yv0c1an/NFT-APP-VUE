<template>
    <div class="main_body flex-column">
        <div class="main_body flex-column overflow-y-auto m">
            <div class="filter">
                <el-button @click="refresh" :class="loading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i><span>{{ loading? '加载中...':'刷新' }}</span></el-button>
            </div>
            <el-table :data="list?.data" stripe style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="user.name" label="所属用户" />
                <el-table-column prop="amount" label="支付金额" />
                <el-table-column prop="payment" label="支付方式" >
                    <template #default="scope">
                        <el-tag v-if="scope.row?.pay_type" effect="dark" :type="payDesc[scope.row.pay_type]?.color" >{{payDesc[scope.row.pay_type]?.name}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" >
                    <template #default="scope">
                        <el-tag effect="dark" :type="statusDesc[scope.row.status]?.color" >{{statusDesc[scope.row.status]?.text}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="时间" />
                <el-table-column label="操作" fixed="right">
                    <template #default="item">
                        <el-button @click="view(item.row)" type="primary" size="small"><span>详情</span></el-button>
                    </template>
                </el-table-column>
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
    <el-dialog v-model="dialogTableVisible" title="订单详情">
        <table class="table">
            <tr>
                <th>ID</th>
                <td colspan="3">{{item.id}}</td>
            </tr>
            <tr>
                <th>订单号</th>
                <td>{{item.order_id}}</td>
                <th>支付金额</th>
                <td>{{item.amount}}</td>
            </tr>
            <tr>
                <th>三方订单号</th>
                <td colspan="3">{{item.mer_order_id}}</td>
            </tr>
            <tr>
                <th>创建时间</th>
                <td>{{item.created_at}}</td>
                <th>更新时间</th>
                <td>{{item.updated_at}}</td>
            </tr>
            <tr>
                <th>回调信息</th>
                <td colspan="3">{{item.notify_remark}}</td>
            </tr>
        </table>
    </el-dialog>
</template>

<script setup>
import page from '@/components/page.vue'
import {computed, ref, onMounted, reactive} from "vue"
import api from '@/store'
import {ElMessage} from "element-plus"

const rechargeStore = api.rechargeStore()
const list = computed(()=>rechargeStore.recharge_list)
const loading = ref(false)
const dialogTableVisible = ref(false)
const formRef = ref()
const param = ref({
    total: 0,
    page: 1,
    per_page: 20,
    type: [0]
})
const statusDesc = [
    {
        text: '付款中',
        color: 'info'
    },
    {
        text: '付款成功',
        color: 'success'
    },
    {
        text: '付款失败',
        color: 'danger'
    },
    {
        text: '订单超时',
        color: 'warning'
    },
    {
        text: '订单取消',
        color: ''
    }
]
const payDesc = {
    balance: {
        name: '余额',
        color: 'info'
    },
    alipay_h5: {
        name: '支付宝H5',
        color: ''
    },
    alipay_app: {
        name: '支付宝APP',
        color: ''
    },
    wxpay_h5: {
        name: '微信H5',
        color: 'success'
    },
    wxpay_app: {
        name: '微信APP',
        color: 'success'
    },
    wxpay_js: {
        name: '微信JSAPI',
        color: 'success'
    },
    admin: {
        name: '后台充值',
        color: 'success'
    }
}
const item = ref({})

onMounted(()=>{
    refresh()
})

const view = items => {
    dialogTableVisible.value = true
    item.value = items
    console.log(item.value)
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
    rechargeStore.recharge_lists(param.value).then(res=>{
        param.value.total = res.total
        loading.value = false
    }).catch(err=>{
        loading.value = false
    })
}
const showStore = items =>{
    return items.map(item=>item.name).toString()
}
</script>

<style scoped lang="scss">

</style>
