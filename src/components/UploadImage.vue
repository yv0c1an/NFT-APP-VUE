<template>
    <div class="multiple_img" v-show="avatar">
        <div class="multiple_img_item" :style="{width: width, height: height}">
            <div class="multiple_img_action">
                <i class="iconfont icon-browse" @click.stop="showImg(file_url+avatar)"></i>
                <i class="iconfont icon-shanchu" @click.stop="rmImg"></i>
            </div>
            <div class="multiple_img_loading" v-if="loading">
                <el-progress
                    :percentage="100"
                    status="success"
                    :indeterminate="true"
                    :duration=".8"
                    :show-text="false"
                />
            </div>
            <img :class="'view-image'+id" v-if="avatar" :data-url="loading?avatar:file_url+avatar" :src="loading?avatar:file_url+avatar+'?x-oss-process=style/w600'">
        </div>
    </div>
    <el-upload
        :style="{width: width, height: height}"
        v-show="!avatar"
        :headers="headers"
        :action="upload_url"
        :show-file-list="false"
        :on-change="onChange"
        :on-error="onError"
        class="multiple_img"
        accept="image/png, image/jpeg"
    >
        <div class="multiple_img_item">
            <i class="iconfont icon-add-select"></i>
        </div>
    </el-upload>
</template>

<script>
import {ref, computed, watch} from "vue"
import api from "../store";
import {ElMessage} from "element-plus";
import Viewer from "viewerjs";
export default {
    emits: ["callback"],
    props: {
        width: {
            type: String,
            default: '58px'
        },
        height: {
            type: String,
            default: '58px'
        },
        url: {
            type: String,
            default: ''
        },
        id: {
            type: [Number, String],
            default: ''
        }
    },
    setup(props, ctx){
        const loading = ref(false)
        const configStore = api.configStore()
        const AttachmentStore = api.AttachmentStore()
        const file_url = computed(()=>configStore.file_url)
        // 上传接口
        const upload_url = computed(()=>configStore.upload_url)
        // 上传加上token
        const l = localStorage.getItem(import.meta.env.VITE_API_STORAGENAME)
        const obj = JSON.parse(l)
        let headers = {}
        if (typeof obj == 'object' && obj) {
            headers.Authorization = 'Bearer '+obj.token
        }
        const avatar = ref(props.url)
        watch(
            () => props.url,
            (val, prevCount) => {
                avatar.value = val
            }
        )
        const onChange = (res) => {
            if(res.status == "ready"){
                loading.value = true
                avatar.value = res.url
            }else if(res.status == "success"){
                loading.value = false
                if(res.response.code == 200){
                    avatar.value = res.response.data.url
                    ctx.emit('callback', res.response.data.url, props.id)
                    ElMessage.success(res.response.msg)
                }else{  // 上传出错
                    avatar.value = ''
                    ElMessage.error(res.response.msg)
                }
            }
        }

        const onError = (res, file) => {
            loading.value = false
            const err = JSON.parse(res.message)
            ElMessage.error(err.msg)
            avatar.value = ''
        }

        const showImg = () => {
            const viewer = new Viewer(document.querySelector('.view-image'+props.id), {
                hidden: function () {
                    viewer.destroy();
                },
                zIndex: 9999,
                url: 'data-url' // 可指定img的一个data属性作文图片地址
            })
            viewer.show()
        }

        const rmImg = () => {
            AttachmentStore.attachment_del({id: window.btoa(avatar.value)}).then(res=>{
                ElMessage.success(res.msg)
            })
            ctx.emit('callback', '', props.id)
            avatar.value = ''
        }

        return {
            avatar,
            file_url,
            upload_url,
            onChange,
            onError,
            showImg,
            rmImg,
            headers,
            loading
        }
    }
}
</script>

<style scoped lang="scss">

</style>
