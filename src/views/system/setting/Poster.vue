<template>
    <div class="main_body">
        <div class="main_body_left" style="width: 500px">
            <el-form :model="form.value" label-width="100px" style="width: 300px">
                <el-form-item label="海报图片">
                    <UploadImage width="100px" height="100px" @callback="callback" :url="form.value.invite.qrcode.img"></UploadImage>
                    <div class="tip">宽度750px,高度不要超过1334px</div>
                </el-form-item>
                <el-form-item label="二维码宽度">
                    <el-input v-model="form.value.invite.qrcode.w" :min="0" type="number" >
                        <template #append>px</template>
                    </el-input>
                    <div class="tip">高度与宽度相同，所以无需设置高度</div>
                </el-form-item>
                <el-form-item label="x轴位置">
                    <el-input v-model="form.value.invite.qrcode.x" type="number" >
                        <template #append>px</template>
                    </el-input>
                    <div class="tip">二维码在海报中的x轴位置</div>
                </el-form-item>
                <el-form-item label="y轴位置">
                    <el-input v-model="form.value.invite.qrcode.y" type="number" >
                        <template #append>px</template>
                    </el-input>
                    <div class="tip">二维码在海报中的y轴位置</div>
                </el-form-item>
                <el-form-item style="margin-top: 30px;">
                    <el-button type="primary" @click="onSubmit" :loading="loading">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="main_body_right">
            <h3>预览</h3>
            <div class="poster_view">
                <img :src="form.value.invite.qrcode.img?file_url+form.value.invite.qrcode.img:''">
                <div class="poster_qrcode" :style="{left: form.value.invite.qrcode.x+'px', top: form.value.invite.qrcode.y+'px', width: form.value.invite.qrcode.w+'px', height: form.value.invite.qrcode.w+'px'}">二维码位置</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed, ref, onMounted, reactive, nextTick} from "vue"
import api from '/src/store'
import {ElMessage, ElLoading} from "element-plus"
import UploadImage from '@/components/UploadImage.vue'

const loading = ref(false)
const settingStore = api.settingStore()
const configStore = api.configStore()
const file_url = computed(()=>configStore.file_url)
const form = reactive({
    key: 'poster',
    value: {
        invite: {
            qrcode: {
                img: '',
                x: 0,
                y: 0,
                w: 100
            }
        },
        goods: {

        }
    }
})
let eLoading = null
nextTick(()=> {
    eLoading = ElLoading.service({
        target: '.main_box',
        fullscreen: false
    })
})
settingStore.get_setting({type: 'poster'}).then(res=>{
    if(res){
        form.value.invite.qrcode.w = res?.invite.qrcode.w
        form.value.invite.qrcode.x = res?.invite.qrcode.x
        form.value.invite.qrcode.y = res?.invite.qrcode.y
        form.value.invite.qrcode.img = res?.invite.qrcode.img
    }
    eLoading.close()
}).catch(err=>{
    eLoading.close()
})
const callback = (val) => {
    form.value.invite.qrcode.img = val
}
const onSubmit = () => {
    loading.value = true
    settingStore.setting_update(form).then(res=>{
        loading.value = false
        ElMessage.success(res.msg)
    }).catch(err=>{
        loading.value = false
    })

}
</script>

<style scoped lang="scss">
.main_body_right{
    flex: 1;
    border-left: 1px solid #e6effb;
    padding-left: 20px;
    h3{
        margin-top: 0;
        display: block;
        padding-bottom: 10px;
    }
}
.poster_view{
    zoom: 0.5;
    position: relative;
    .poster_qrcode{
        position: absolute;
        border: 2px dotted #e6effb;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #666;
        background: #eee;
    }
}
</style>
