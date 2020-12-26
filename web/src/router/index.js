import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { getRouter, viewsToRouter } from './routes'

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
    }
]

const router = (function () {
    const mode = 'history'
    const { isLogin, views } = store.state
    // console.log('initRouter', store, isLogin)
    if (isLogin) {
        const { allRoutes } = getRouter(routes, viewsToRouter(views))
        store.commit('setRouterMounted', true)
        return new VueRouter({
            mode,
            base: process.env.BASE_URL,
            routes: allRoutes
        })
    } else {
        return new VueRouter({
            mode,
            base: process.env.BASE_URL,
            routes
        })
    }
})()

router.beforeEach(async (to, from, next) => {
    const { isLogin } = store.state
    // console.log('router.beforeEach', isLogin, to, from, router)
    if (!isLogin) {
        if (to.path !== '/login' && from.path !== '/login') {
            next('/login')
        } else {
            next()
        }
    } else {
        if (to.path === '/login') {
            next('/')
        } else {
            next()
        }
    }
})

export default router
