<template>
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
    />
    <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        style="height: 500px; "
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onDestroyed="handleDestroyed"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
        @customAlert="customAlert"
        @customPaste="customPaste"
    />
</template>

<script>
import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { DomEditor } from '@wangeditor/editor'
export default {
    emits: ["callback"],
    components: { Editor, Toolbar },
    props:{
        content: {
            type: String,
            default: ''
        },
    },
    setup(props, ctx) {
        // 编辑器实例，必须用 shallowRef，重要！
        const editorRef = shallowRef()
        // 内容 HTML
        const valueHtml = ref(props.content)
        // 模拟 ajax 异步获取内容
        // onMounted(() => {
        //     setTimeout(() => {
        //         valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
        //     }, 1500)
        // })
        const toolbarConfig = {
            excludeKeys: ["codeBlock", "fullScreen", "todo", "lineHeight","emotion","fontFamily"]
        }
        const editorConfig = { placeholder: '请输入内容...' }
        // 组件销毁时，也及时销毁编辑器，重要！
        onBeforeUnmount(() => {
            const editor = editorRef.value
            if (editor == null) return
            editor.destroy()
        })
        watch(valueHtml,()=>{
            console.log(valueHtml.value)
            ctx.emit('callback', valueHtml.value)
        })
        // 编辑器回调函数
        const handleCreated = (editor) => {
            //console.log('created', editor);
            editorRef.value = editor // 记录 editor 实例，重要！
        }
        const handleChange = (editor) => {
            // const toolbar = DomEditor.getToolbar(editor)
            // console.log(toolbar.getConfig().toolbarKeys)
            console.log('change:', editor.getHtml());
        }
        const handleDestroyed = (editor) => {
            console.log('destroyed', editor)
        }
        const handleFocus = (editor) => {
            console.log('focus', editor)
        }
        const handleBlur = (editor) => {
            console.log('blur', editor)
        }
        const customAlert = (info, type) => {
            alert(`【自定义提示】${type} - ${info}`)
        }
        const customPaste = (editor, event, callback) => {
            console.log('ClipboardEvent 粘贴事件对象', event)
            // 自定义插入内容
            //editor.insertText('xxx')
            // 返回值（注意，vue 事件的返回值，不能用 return）
            //callback(false) // 返回 false ，阻止默认粘贴行为
            // callback(true) // 返回 true ，继续默认的粘贴行为
        }
        const insertText = () => {
            const editor = editorRef.value
            if (editor == null) return
            editor.insertText('hello world')
        }
        const printHtml = () => {
            const editor = editorRef.value
            if (editor == null) return
            console.log(editor.getHtml())
        }
        const disable = () => {
            const editor = editorRef.value
            if (editor == null) return
            editor.disable()
        }
        return {
            editorRef,
            mode: 'default',
            valueHtml,
            toolbarConfig,
            editorConfig,
            handleCreated,
            handleChange,
            handleDestroyed,
            handleFocus,
            handleBlur,
            customAlert,
            customPaste,
            insertText,
            printHtml,
            disable,
        };
    }
}
</script>

<style scoped>

</style>
