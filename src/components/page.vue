<template>
    <el-pagination
        small
        background
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
    />
</template>

<script>
import { ref } from 'vue'
export default {
    props: {

    },
    setup(props, context){

    }
}
</script>

<style scoped>

</style>
