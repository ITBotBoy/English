import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn'

const app = createApp(App as any)
app.config.globalProperties.baseUrl = process.env.NODE_ENV === 'production'?'/english/api':'//172.24.29.21:5200'
app.use(router)
app.use(store)
app.use(ElementPlus,{locale})
app.mount('#app')
