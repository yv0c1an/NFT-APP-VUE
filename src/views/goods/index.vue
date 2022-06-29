<template>
    <div class="main_body flex-column" style="height: 100%;">
        <div class="filter_main">
            <el-form class="filter_top" label-width="80px">
                <div class="filter_box">
                    <el-form-item label="搜索">
                        <el-input v-model="param.key" clearable placeholder="输入作品名字或作品ID搜索" />
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="param.type" placeholder="选择商品类型">
                            <el-option label="全部" value="" />
                            <el-option label="首发" :value="1" />
                            <el-option label="空投" :value="2" />
                            <el-option label="合成" :value="3" />
                            <el-option label="盲盒" :value="4" />
                        </el-select>
                    </el-form-item>
                </div>
                <div class="filter_box">
                    <el-form-item label="状态">
                        <el-select v-model="param.status" multiple placeholder="选择状态">
                            <el-option label="待审" :value="0" />
                            <el-option label="审核通过" :value="1" />
                            <el-option label="驳回" :value="2" />
                            <el-option label="待售" :value="3" />
                            <el-option label="在售" :value="4" />
                            <el-option label="已售罄" :value="5" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发行日期">
                        <el-date-picker
                            v-model="param.date"
                            type="daterange"
                            unlink-panels
                            :shortcuts="shortcuts"
                            value-format="YYYY-MM-DD"
                        />
                    </el-form-item>
                </div>
                <div class="filter_box">
                    <el-form-item label="专辑">
                        <el-select v-model="param.album" placeholder="选择专辑">
                            <el-option label="全部" value="" />
                            <el-option :label="item.name" :value="item.id" v-for="item in album_list" />
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            <div class="filter_bottom">
                <el-button size="small" @click="refresh" :loading="loading" type="primary"><span>查询</span></el-button>
            </div>
        </div>
        <div class="main_body flex-column overflow-y-auto m">
            <div class="filter">
                <el-button @click="add" type="primary"><i class="iconfont icon-add-select"></i><span>新增</span></el-button>
                <el-button @click="refresh" :class="loading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i><span>{{ loading? '加载中...':'刷新' }}</span></el-button>
                <el-button @click="albumShow=true" type="primary"><i class="iconfont icon-add-select"></i><span>管理专辑</span></el-button>
            </div>
            <el-table :data="list?.data" stripe style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="id" label="ID" width="50" />
                <el-table-column prop="name" label="作品名称" width="200" >
                    <template #default="scope">
                        <div class="table-cell-avatar">
                            <el-image
                                v-if="scope.row.photo"
                                style="width: 50px; height: auto"
                                :preview-src-list="[file_url+scope.row.photo]"
                                :src="file_url+scope.row.photo+'?x-oss-process=style/w600'"
                                fit="cover"
                                preview-teleported
                                hide-on-click-modal
                            />
                            <span>{{scope.row.name}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="uid" label="铸造者" width="150" >
                    <template #default="scope">
                        {{scope.row.user?.name}}
                    </template>
                </el-table-column>
                <el-table-column prop="album.name" label="专辑" width="100" />
                <el-table-column prop="type" label="商品类型" width="200" >
                    <template #default="scope">
                        <el-tag :type="typeDesc[scope.row.type]?.color" effect="dark">{{ typeDesc[scope.row.type]?.name }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="发行价格" width="200" />
                <el-table-column prop="release_at" label="发行日期" width="200" />
                <el-table-column prop="num" label="发行数量" />
                <el-table-column prop="sale_num" label="已售数量" />
                <el-table-column prop="status" label="状态" >
                    <template #default="scope">
                        {{scope.row.status==0?'待审':scope.row.status==1?'审核通过':scope.row.status==2?'驳回':scope.row.status==3?'待售':scope.row.status==4?'在售':'已售罄'}}
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
    <el-drawer
        v-model="dialogVisible"
        :title="form.id?'编辑作品':'铸造作品'"
        direction="rtl"
        :destroy-on-close="true"
        :size="1050"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
            <el-form-item label="铸造者" prop="uid">
                <div style="width: 100%;">
                    <el-tag
                        v-if="form.user"
                        effect="dark"
                        closable
                        round
                        @close="userClose"
                    >
                        {{ form.user.name }}
                    </el-tag>
                </div>
                <el-button type="primary" @click="dataSelect('user')" style="margin-top: 10px;width: 150px;" plain><i class="iconfont icon-add-select"></i> 选择铸造者</el-button>
            </el-form-item>
            <el-form-item label="专辑">
                <div style="width: 100%;">
                    <el-tag
                        v-if="form.album"
                        effect="dark"
                        closable
                        round
                        @close="albumRm"
                    >
                        {{ form.album.name }}
                    </el-tag>
                </div>
                <el-button type="primary" @click="dataSelect('album')" style="margin-top: 10px;width: 150px;" plain><i class="iconfont icon-add-select"></i> 选择专辑</el-button>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="form.name" placeholder="填写商品名称" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="商品类型" prop="type">
                <div style="width: 100%">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="1">首发</el-radio>
                        <el-radio :label="2">空投</el-radio>
                        <el-radio :label="3">合成</el-radio>
                        <el-radio :label="4">盲盒</el-radio>
                    </el-radio-group>
                </div>
                <div style="width: 100%" v-if="form.type==3">
                    <el-table :data="form.compose" style="width: 100%" size="small">
                        <el-table-column prop="id" label="ID" width="80" />
                        <el-table-column prop="name" label="名称" width="180" />
                        <el-table-column label="合成所需数量" width="200" >
                            <template #default="scope">
                                <el-input v-model.number="scope.row.compose_num" type="number" style="width: 100px;" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" >
                            <template #default="scope">
                                <el-button type="danger" @click="form.compose.splice(scope.$index, 1)" size="small"><span>删除</span></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button type="primary" @click="dataSelect('goods')" style="margin-top: 10px;width: 150px;" plain><i class="iconfont icon-add-select"></i> 选择合成商品</el-button>
                </div>
                <div style="width: 100%" v-if="form.type==4">
                    <el-table :data="form.blind_box" style="width: 100%" size="small">
                        <el-table-column label="作品" width="100" >
                            <template #default="scope">
                                <UploadImage @callback="blind_box_callback" :id="scope.$index" :url="scope.row.photo"></UploadImage>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="名称" width="180">
                            <template #default="scope">
                                <el-input v-model="scope.row.name" />
                            </template>
                        </el-table-column>
                        <el-table-column label="稀有属性" width="150" >
                            <template #default="scope">
                                <el-select v-model="scope.row.attribute" placeholder="选择稀有属性">
                                    <el-option label="UR(极稀有)" value="UR"/>
                                    <el-option label="SSR(超级稀有)" value="SSR"/>
                                    <el-option label="SR(较稀有)" value="SR"/>
                                    <el-option label="R(一般稀有)" value="R"/>
                                    <el-option label="N(稀有)" value="N"/>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="盲盒数量" width="100" >
                            <template #default="scope">
                                <el-input v-model.number="scope.row.num" type="number" :min="1" style="width: 80px;" />
                            </template>
                        </el-table-column>
                        <el-table-column label="概率" width="80" >
                            <template #default="scope">
                                {{scope.row.num?(scope.row.num/form.num*100).toFixed(2):0}}%
                            </template>
                        </el-table-column>
                        <el-table-column label="内容介绍">
                            <template #default="scope">
                                <MultiUpload :list="scope.row.content" :id="scope.$index" :max="max-scope.row.content.length" @callback="BlindMultiUploadCallBack" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template #default="scope">
                                <el-button type="danger" @click="form.blind_box.splice(scope.$index, 1)" size="small"><span>删除</span></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="tip">发行总数：{{form.num?form.num:0}}，已分配：{{use_num}}，剩余：{{form.num-use_num}}</div>
                    <el-button type="primary" @click="add_blind_box" style="margin-top: 10px;width: 150px;" plain><i class="iconfont icon-add-select"></i> 增加盲盒产品</el-button>
                </div>
            </el-form-item>
            <el-form-item label="销售属性" prop="sale">
                <div style="width: 100%;">
                    <el-checkbox v-model="form.allow_sale" :true-label="1" :false-label="0" label="允许寄售" />
                    <el-checkbox v-model="form.allow_give" :true-label="1" :false-label="0" label="允许赠与" />
                </div>
            </el-form-item>
            <el-form-item label="已售数量" prop="limit">
                <el-input v-model.number="form.sale_num" type="number" placeholder="填写已售数量" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="每人限购数量" prop="limit">
                <el-input v-model.number="form.limit" type="number" placeholder="填写每人限购数量" style="width: 200px;" />
                <div class="tip">每人限购数量，0表示不限制</div>
            </el-form-item>
            <el-form-item label="发行价格" prop="price" v-show="form.type==1||form.type==4">
                <el-input v-model.number="form.price" type="number" placeholder="填写发行价格" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="发行数量" prop="num" v-show="form.type!=3">
                <el-input v-model="form.num" type="number" placeholder="填写发行数量" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="作品图片" prop="photo">
                <UploadImage @callback="callback" :url="form.photo"></UploadImage>
                <div class="tip">宽度为600像素，高度最好在840以内</div>
            </el-form-item>
            <el-form-item label="发行日期" prop="release_at">
                <el-date-picker
                    v-model="form.release_at"
                    type="datetime"
                    placeholder="填写发行日期"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :teleported="false"
                />
            </el-form-item>
            <el-form-item label="扣除铸造费" prop="publish_fee" v-if="!form.id">
                <el-switch
                    v-model="form.publish_fee"
                    inline-prompt
                    active-text="是"
                    inactive-text="否"
                />
                <div class="tip">选择是时将会按照系统的设置扣除用户相应的铸造费用</div>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio-button :label="0" >待审</el-radio-button>
                    <el-radio-button :label="1" >审核通过</el-radio-button>
                    <el-radio-button :label="2" >驳回</el-radio-button>
                    <el-radio-button :label="3" >待售</el-radio-button>
                    <el-radio-button :label="4" >在售</el-radio-button>
                    <el-radio-button :label="5" >已售罄</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="驳回理由" prop="remark" v-if="form.status==2">
                <el-input v-model="form.remark" type="textarea" placeholder="填写驳回理由" />
            </el-form-item>
            <el-form-item label="作品介绍" prop="desc">
                <MultiUpload :list="form.content" :max="maxSelectImg" @callback="MultiUploadCallBack" />
                <div class="tip">最多可上传{{max}}张图片</div>
            </el-form-item>
<!--            <el-form-item label="作品标签" prop="tag">-->
<!--                <AutoTag :data="form.tag" @callback="tagCallback" title="创建作品标签" />-->
<!--            </el-form-item>-->
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit" :loading="submitLoading">确定</el-button>
        </template>
    </el-drawer>
    <DataSelect :show="selectShow" :params="selectParams" :name="selectName" @close="selectClose" @selectList="selectList" />
    <Category name="album" :show="albumShow" @close="albumClose" />
</template>

<script setup>
import dayjs from 'dayjs'
import page from '../../components/page.vue'
import {computed, ref, onMounted, reactive, nextTick} from "vue"
import api from '/src/store'
import {ElMessage} from "element-plus"
import UploadImage from '@/components/UploadImage.vue'
import DataSelect from '@/components/DataSelect.vue'
import Category from '@/components/Category.vue'
import MultiUpload from '@/components/MultiUpload.vue'

const goodsAlbumStore = api.goodsAlbumStore()
const goodsStore = api.goodsStore()
const configStore = api.configStore()
const file_url = computed(()=>configStore.file_url)
const list = ref([])
const album_list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()
const max = 5 // 最多上传图片数
const maxSelectImg = computed(()=>{
    return max-form.value.content?.length?Number(max-form.value.content.length):max
})
const MultiUploadCallBack = (arr)=>{
    form.value.content = arr
}

goodsAlbumStore.goods_all_album_lists().then(res=>{
    album_list.value = res
}).catch(err=>{

})
const typeDesc = {
    1: {
        color: 'success',
        name: '首发'
    },
    2: {
        color: '',
        name: '空投'
    },
    3: {
        color: 'info',
        name: '合成'
    },
    4: {
        color: 'warning',
        name: '盲盒'
    }
}
const shortcuts = [
    {
        text: '一周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '一个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '三个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]

const callback = (val) => {
    form.value.photo = val
}

onMounted(()=>{
    //initMap()
})

let form = ref({
    name: '',
    id: '',
    uid: '',
    tag: [],
    photo: '',
    price: '',
    num: '',
    content: [],
    user: null,
    album: null,
    status: 3,
    limit: 0,
    release_at: '',
    remark: '',
    publish_fee: 1,
    type: 1,
    allow_sale: 1,
    allow_give: 1,
    compose: [],
    blind_box: [],
    sale_num: ''
})

const rules = reactive({
    name: [
        { required: true, message: '请填写商品名称', trigger: 'blur' }
    ],
    type: [
        {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback)=>{
                if(form.value.type == 3){
                    if(form.value.compose.length <= 0){
                        callback(new Error('请选择合成商品'))
                        return
                    }
                    for (const item of form.value.compose) {
                        if(!item.compose_num){
                            callback(new Error('请填写合成所需的商品数量'))
                            return
                        }
                    }
                }else if(form.value.type == 4){
                    if(form.value.blind_box.length <= 0){
                        callback(new Error('请添加盲盒产品'))
                        return
                    }
                    if(form.value.num != use_num.value){
                        callback(new Error('分配的盲盒总数与发行总数不一致'))
                        return
                    }
                    for (const item of form.value.blind_box) {
                        if(!item.name){
                            callback(new Error('请填写名称'))
                            return
                        }
                        if(!item.photo){
                            callback(new Error('请上传作品素材'))
                            return
                        }
                        if(!item.attribute){
                            callback(new Error('请选择稀有属性'))
                            return
                        }
                    }
                }
                callback()
            }
        }
    ],
    photo: [
        { required: true, message: '请上传商品图片', trigger: 'blur' }
    ],
    price: [
        {
            trigger: 'blur',
            validator: (rule, value, callback)=>{
                if(form.value.type == 1 && form.value.price <= 0){
                    callback(new Error('请设置价格'))
                    return
                }
                callback()
            }
        }
    ],
    num: [
        {
            trigger: 'blur',
            validator: (rule, value, callback)=>{
                if((form.value.type == 1 || form.value.type == 2) && form.value.num <= 0){
                    callback(new Error('请设置发行数量'))
                    return
                }
                callback()
            }
        }
    ],
    uid: [
        { required: true, message: '请选择铸造者', trigger: 'blur' }
    ],
    release_at: [
        { required: true, message: '请选择发行日期', trigger: 'blur' }
    ],
    remark: [
        {
            trigger: 'blur',
            validator: (rule, value, callback) => {
                if(form.value.status == 2 && (form.value.remark == '' || !form.value.remark)){
                    callback(new Error('请填写驳回理由'))
                }
                callback()
            }
        }
    ]
})

const edit = (items) => {
    let item = JSON.parse(JSON.stringify(items))
    form.value = item
    dialogVisible.value = true
}

const add = () => {
    form.value.name = ''
    form.value.id = ''
    form.value.uid = ''
    form.value.tag = []
    form.value.photo = ''
    form.value.price = ''
    form.value.num = ''
    form.value.sale_num = ''
    form.value.content = []
    form.value.remark = ''
    form.value.user = null
    form.value.album = null
    form.value.status = 3
    form.value.type = 1
    form.value.limit = 0
    form.value.publish_fee = 1
    form.value.allow_sale = 1
    form.value.allow_give = 1
    form.value.release_at = ''
    form.value.compose = []
    form.value.blind_box = []
    dialogVisible.value = true
}

const delListConfirm = (item) => {
    goodsStore.goods_del({id: item.id}).then(res=>{
        refresh()
    })
}

const submit = () => {
    formRef.value.validate((valid, fields) => {
        if(valid){
            let data = JSON.parse(JSON.stringify(form.value))
            data.content = data.content??[]
            //data.release_at = dayjs(data.release_at).format('YYYY-MM-DD HH:mm:ss')
            //data.compose = data.compose.map(item=>item.id)
            data.album = data.album?.id
            if(data.id > 0){ // 编辑
                submitLoading.value = true
                goodsStore.goods_update(data).then(res=>{
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
                goodsStore.goods_add(data).then(res=>{
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
    goodsStore.goods_lists(param.value).then(res=>{
        list.value = res
        param.value.total = res.total
        loading.value = false
    }).catch(err=>{
        loading.value = false
    })
}

const param = ref({
    total: 0,
    page: 1,
    per_page: 20,
    key: '',
    type: '',
    status: '',
    date: [],
    album: ''
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
const selectParams = ref([])
const selectName = ref()
const selectShow = ref(false)
const dataSelect = name =>{
    if(name == 'goods'){
        selectParams.value = {status:[4],type:1}
    }else{
        selectParams.value = []
    }
    selectName.value = name
    selectShow.value = true
}
const selectClose = () =>{
    selectShow.value = false
}
const userClose = () =>{
    form.value.user = null
    form.value.uid = ''
}
const albumRm = ()=>{
    form.value.album = null
}

const selectList = (items, name) =>{
    if(items.length>0){
        if(name == 'user'){
            form.value.user = items[0]
            form.value.uid = items[0].id
        }else if(name == 'goods'){
            const ids = form.value.compose?.map(item=>item.id)??[]
            form.value.compose = form.value.compose??[]
            for (const it of items) {
                if(!ids.includes(it.id)){
                    form.value.compose.push(it)
                }
            }
        }else if(name == 'album'){
            form.value.album = items[0]
        }
    }
}

// 盲盒
const add_blind_box = ()=>{
    if(form.value.num < 1){
        ElMessage({
            type: 'error',
            message: '请先设置发行数量',
        })
        return
    }
    form.value.blind_box.push({
        photo: '',
        num: form.value.num - use_num.value,
        attribute: '',
        name: '',
        content: []
    })
}
// 计算已分配数量
const use_num = computed(()=>{
    let i = 0
    for (const item of form.value.blind_box) {
        i += item?.num??0
    }
    return i
})
const blind_box_callback = (val, id)=>{
    console.log(val, id)
    console.log(form.value.blind_box)
    form.value.blind_box[id].photo = val
}
const BlindMultiUploadCallBack = (val, id)=>{
    console.log(val)
    form.value.blind_box[id].content = val
    console.log(form.value.blind_box)
}

const albumShow = ref(false)
const albumClose = ()=>{
    albumShow.value = false
}
</script>

<style scoped>

</style>
