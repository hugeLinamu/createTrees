import { createRouter , createWebHistory, RouteRecordRaw } from 'vue-router'

const routes:Array<RouteRecordRaw> = [
    {
        path:'/',
        component: ()=> import('../views/createTrees.vue')
    }
]

export default createRouter({
    routes,
    history:createWebHistory()
})


