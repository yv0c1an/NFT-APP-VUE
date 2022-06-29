<template>
    <div class="multiple_img multiple_imgs">
        <div class="multiple_img_item" :style="{width: width, height: height}" v-for="(item, index) in imglist">
            <div class="multiple_img_action">
                <i class="iconfont icon-browse" @click.stop="showImg"></i>
                <i class="iconfont icon-shanchu" @click.stop="rmImg(index)"></i>
            </div>
            <img :data-url="file_url+item" :src="file_url+item+'?x-oss-process=style/w600'">
        </div>
        <div class="multiple_img_item" :style="{width: width, height: height}" @click="storeShow=true" v-if="max>0">
            <i class="iconfont icon-add-select"></i>
        </div>
    </div>
    <Store :show="storeShow" @selectList="selectList" @close="storeClose" :max="max"></Store>
</template>

<script>
import Store from "@/components/store.vue"
import api from "@/store";
import { ref, reactive, computed, watch } from "vue";
import Viewer from "viewerjs";
export default {
    emits: ["callback"],
    components:{
        Store
    },
    props: {
        max: {
            type: Number,
            default: 0
        },
        width: {
            type: String,
            default: '58px'
        },
        height: {
            type: String,
            default: '58px'
        },
        list: {
            type: Array,
            default: ()=>{
                return []
            }
        },
        id: {
            type: [Number, String],
            default: 0
        }
    },
    setup(props, ctx){
        const configStore = api.configStore()
        const file_url = computed(()=>configStore.file_url)
        const imglist = ref(props.list?[...props.list]:[])
        const storeShow = ref(false)
        const selectList = (res) => {
            const p = res.map(item=>item.url)
            imglist.value.push(...p)
            storeClose()
        }
        watch(imglist.value,(newVal,oldVal)=>{
            ctx.emit('callback', imglist.value, props.id)
        })
        const storeClose = () => {
            storeShow.value = false
        }
        const rmImg = index => {
            imglist.value.splice(index, 1)
        }
        const maxSelectImg = computed(()=>{
            return Number(props.max-imglist.value.length)
        })
        const showImg = () => {
            const viewer = new Viewer(document.querySelector('.multiple_imgs'), {
                hidden: function () {
                    viewer.destroy();
                },
                zIndex: 9999,
                url: 'data-url' // 可指定img的一个data属性作文图片地址
            })
            viewer.show()
        }

        return{
            storeShow,
            selectList,
            storeClose,
            rmImg,
            maxSelectImg,
            file_url,
            imglist,
            showImg
        }
    }
}
</script>

<style scoped>
.multiple_img_item{
    margin-right: 5px;
}
</style>
