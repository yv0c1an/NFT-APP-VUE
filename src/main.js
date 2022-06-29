import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import './assets/styles/main.scss'
import config from './config.js'
import 'viewerjs/dist/viewer.css'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

const app = createApp(App)
app.config.globalProperties.$config = config
app.use(ElementPlus, {locale: zhCn})
app.use(createPinia())
app.use(router)
app.mount('#app')
