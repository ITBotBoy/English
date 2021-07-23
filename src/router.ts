import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue'
import Setting from '@/views/setting.vue'

const routes:any[] = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }
]

export default  createRouter({
    history: createWebHistory('/english/'),
    routes
})
