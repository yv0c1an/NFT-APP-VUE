<template>
    <div class="auto_tag">
        <el-tag closable size="large" :key="item" v-for="item in tags" @close="handleClose(item)">{{item}}</el-tag>
        <el-input ref="input" style="width: 100px;" autofocus @blur="blur" v-model="value" v-show="!is_show"/>
        <el-button @click="add" v-show="is_show" type="primary" class="auto_tag_create" plain>
            <template v-if="data.length==0">
                {{title}}
            </template>
            <template v-else>
                <i class="iconfont icon-add-select"></i>
            </template>
        </el-button>
    </div>
</template>

<script>
import {ref} from "vue"
export default {
    emits: ["callback"],
    props: {
        title: {
            type: String,
            default: '创建标签'
        },
        data: {
            type: Array,
            default: ()=>{
                return []
            }
        }
    },
    setup(props, ctx){
        const is_show = ref(true)
        const value = ref()
        const input = ref()
        const tags = ref([])
        tags.value = [...props.data]
        const add = () => {
            is_show.value = !is_show.value
            input.value.focus()
        }

        const blur = () => {
            is_show.value = !is_show.value
            if(!value.value){
                return
            }
            tags.value.push(value.value)
            value.value = ''
            ctx.emit('callback', tags.value)
        }
        const handleClose = (tag) => {
            tags.value.splice(tags.value.indexOf(tag), 1)
            ctx.emit('callback', tags.value)
        }

        return{
            is_show,
            value,
            add,
            blur,
            handleClose,
            input,
            tags
        }
    }
}
</script>

<style scoped lang="scss">
.auto_tag{
    display: flex;
    .auto_tag_create{
        border-style: dashed;
        &:hover,&:active{
            background: transparent;
            color: var(--el-color-primary);
        }
    }
    .el-tag{
        margin-right: 5px;
    }
}
</style>
