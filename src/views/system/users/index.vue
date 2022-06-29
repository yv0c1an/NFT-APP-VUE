<template>
    <div class="main_body flex-column">
        <div class="main_body flex-column overflow-y-auto m">
            <div class="filter">
                <el-button @click="add" type="primary"><i class="iconfont icon-add-select"></i><span>新增</span></el-button>
                <el-button @click="refresh" :class="loading?'rotate is-loading':''"><i class="iconfont icon-shuaxin"></i><span>{{ loading? '加载中...':'刷新' }}</span></el-button>
            </div>
            <el-table :data="user_list?.data" stripe style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="id" label="用户ID" width="100" />
                <el-table-column prop="name" label="姓名" width="200">
                    <template #default="scope">
                        <div class="table-cell-avatar">
                            <el-image
                                v-if="scope.row.avatar"
                                style="width: 35px; height: auto"
                                :preview-src-list="[file_url+scope.row.avatar]"
                                :src="file_url+scope.row.avatar+'?x-oss-process=style/w600'"
                                fit="cover"
                                preview-teleported
                                hide-on-click-modal
                            />
                            <span>{{scope.row.name}}</span>
                            <el-tag style="margin-left: 5px;" type="success" size="small" v-if="scope.row.auth?.status==1">认证</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号" width="150" />
                <el-table-column prop="balance" label="余额" width="150" />
                <el-table-column prop="wallet_addr" label="钱包地址" width="150" />
                <el-table-column prop="roles" label="角色">
                    <template #default="scope">
                        <el-tag v-for="item in scope.row.roles">{{item.name}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template #default="scope">
                        <el-tag effect="dark" :type="scope.row.status == 1?'success':'danger'" class="mr-2" >{{scope.row.status == 1?'正常':'禁用'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="item">
                        <el-dropdown>
                            <el-button type="primary" plain>
                                操作
                                <i class="iconfont icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="recharge(item.row)">充值</el-dropdown-item>
                                    <el-dropdown-item @click="edit(item.row)">编辑</el-dropdown-item>
                                    <el-dropdown-item @click="delListConfirm(item.row)">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
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
        :title="form.id?'编辑会员':'新建会员'"
        direction="rtl"
        :destroy-on-close="true"
        :size="750"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="会员头像" prop="avatar">
                <UploadImage @callback="callback" :url="form.avatar"></UploadImage>
            </el-form-item>
            <el-form-item label="会员姓名" prop="name">
                <el-input v-model="form.name" placeholder="填写员工姓名"/>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="form.mobile" placeholder="填写手机号码"/>
                <div class="tip">手机号作为登录账号和接收通知</div>
            </el-form-item>
            <el-form-item label="登录密码" prop="password">
                <el-input type="password" v-model="form.password" placeholder="填写登录密码" show-password />
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
                <el-input type="password" v-model="form.repassword" placeholder="填写重复输入密码" show-password />
            </el-form-item>
            <el-form-item label="角色" prop="roles">
                <el-select v-model="form.roles" placeholder="选择角色" multiple>
                    <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in role_list" />
                </el-select>
            </el-form-item>
            <el-form-item label="邮箱账号" prop="email">
                <el-input v-model="form.email" placeholder="填写邮箱"/>
                <div class="tip">可用于接收通知</div>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio-button :label="1" >正常</el-radio-button>
                    <el-radio-button :label="0" >禁用</el-radio-button>
                </el-radio-group>
                <div class="tip">设置为禁用状态后系统的全部功能均会与其进行隔离</div>
            </el-form-item>
            <el-form-item label="允许铸造" prop="status">
                <el-radio-group v-model="form.publish">
                    <el-radio-button :label="1" >允许</el-radio-button>
                    <el-radio-button :label="0" >不允许</el-radio-button>
                </el-radio-group>
                <div class="tip">是否有权铸造产品</div>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="选择性别" style="width: 200px;">
                    <el-option label="男" :value="1" />
                    <el-option label="女" :value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="生日" prop="birthday">
                <el-date-picker
                    v-model="form.birthday"
                    type="date"
                    placeholder="选择生日"
                    value-format="YYYY-MM-DD"
                />
            </el-form-item>
            <el-form-item label="会员简介" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="填写会员简介"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit" :loading="submitLoading">确定</el-button>
        </template>
    </el-drawer>
    <el-dialog
        v-model="rechargeVisible"
        title="充值"
        width="450px"
    >
        <el-form :model="formRecharge" label-width="80px">
            <el-form-item required label="充值金额" prop="amount">
                <el-input v-model.number="formRecharge.amount" type="number" placeholder="填写充值额度" />
            </el-form-item>
            <el-form-item label="备注" prop="name">
                <el-input v-model="formRecharge.remark" type="textarea" placeholder="填写备注" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="rechargeVisible = false">取消</el-button>
                <el-button type="primary" @click="rechargeSubmit" :loading="rechargeLoading">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import page from '../../../components/page.vue'
import {computed, ref, onMounted, reactive} from "vue"
import api from '/src/store'
import {ElMessage, ElMessageBox} from "element-plus"
import UploadImage from '@/components/UploadImage.vue'

const permissionStore = api.permissionStore()
const AttachmentStore = api.AttachmentStore()
const roleStore = api.roleStore()
const configStore = api.configStore()
const userStore = api.userStore()
const role_list = computed(()=>roleStore.role_list)
const user_list = computed(()=>userStore.user_list)
const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()
const file_url = computed(()=>configStore.file_url)
const form = ref({
    name: '',
    email: '',
    birthday: '',
    sex: 1,
    status: 1,
    mobile: '',
    remark: '',
    id: '',
    openid: '',
    roles: [],
    avatar: '',
    password: '',
    repassword: '',
    publish: 0
})

const param = ref({
    total: 0,
    page: 1,
    per_page: 20,
    key: '',
    type: [1]
})

const callback = val => {
    form.value.avatar = val
}

const currentChange = val =>{
    param.value.page = val
    refresh()
}

const sizeChange = val =>{
    param.value.per_page = val
    refresh()
}

const rules = reactive({
    name: [
        { required: true, message: '请填写姓名', trigger: 'blur' }
    ],
    mobile: [
        { required: true, message: '请填写手机号码', trigger: 'blur' }
    ],
    // roles: [
    //     { required: true, message: '请选择角色', trigger: 'blur' }
    // ],
    repassword: [
        {
            trigger: 'blur',
            validator: (rule, value, callback) => {
                if(form.value.password != form.value.repassword){
                    callback(new Error('两次密码不一致'))
                }
                callback()
            }
        }
    ]
})

const edit = (item) => {
    form.value = JSON.parse(JSON.stringify(item))
    if(form.value.roles){
        form.value.roles = form.value.roles.map(item=>item.id)
    }
    dialogVisible.value = true
}

const add = () => {
    form.value = {}
    form.value.name = ''
    form.value.email = ''
    form.value.mobile = ''
    form.value.birthday = ''
    form.value.sex = 1
    form.value.status = 1
    form.value.remark = ''
    form.value.id = ''
    form.value.openid = ''
    form.value.avatar = ''
    form.value.roles = []
    form.value.password = ''
    form.value.repassword = ''
    form.value.publish = 0
    dialogVisible.value = true
}

const delListConfirm = (item) => {
    ElMessageBox.confirm('确定删除?', '操作提示', {
        customStyle: {
            width: '300px'
        }
    }).then(() => {
        userStore.user_del({id: item.id}).then(res=>{
            refresh()
        })
    }).catch(()=>{

    })
}

const submit = () => {
    formRef.value.validate((valid, fields) => {
        if(valid){
            if(form.value.id > 0){ // 编辑
                submitLoading.value = true
                userStore.user_update(form.value).then(res=>{
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
                userStore.user_add(form.value).then(res=>{
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
    roleStore.roles_lists()
})

const refresh = () => {
    loading.value = true
    userStore.user_lists(param.value).then(res=>{
        param.value.total = res.total
        loading.value = false
    }).catch(err=>{
        loading.value = false
    })
}
// 充值
const rechargeStore = api.rechargeStore()
const recharge = (item)=>{
    formRecharge.value.uid = item.id
    rechargeVisible.value = true
}
const rechargeVisible = ref(false)
const rechargeLoading = ref(false)
const formRecharge = ref({
    amount: '',
    remark: '',
    uid: ''
})
const rechargeSubmit = ()=>{
    if(formRecharge.value.amount<=0){
        ElMessage({
            type: 'error',
            message: '充值金额过小',
        })
        return
    }
    rechargeLoading.value = true
    rechargeStore.recharge(formRecharge.value).then(res=>{
        rechargeLoading.value = false
        rechargeVisible.value = false
        refresh()
    }).catch(err=>{
        rechargeLoading.value = false
    })
}
</script>

<style scoped lang="scss">

</style>
