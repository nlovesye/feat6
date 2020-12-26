import Vue from 'vue'
import Vuex from 'vuex'
import { getLocal, setLocal, removeLocal, apiPost, apiGet } from '@/utils'
import { viewsToRouter, getRouter } from '@/router/routes'

Vue.use(Vuex)

function getInitState () {
    const isLogin = getLocal('isLogin') === 'true'
    const views = getLocal('views') || '[]'
    const auth = JSON.parse(getLocal('auth') || '[]')
    return {
        isLogin,
        routerMounted: false,
        views: JSON.parse(views),
        userName: getLocal('userName') || '', // 用户名称
        nickName: getLocal('nickName') || '游客',
        token: getLocal('token') || '',
        auth
    }
}

export default new Vuex.Store({
    state: getInitState(),
    mutations: {
        setLoginInfo (state, d) {
            state.isLogin = d.isLogin
            state.userName = d.userName
            state.token = d.token
            state.nickName = d.nickName
        },
        // 注销登录
        mLogout (state) {
            removeLocal('isLogin')
            removeLocal('userName')
            removeLocal('nickName')
            removeLocal('token')
            removeLocal('auth')
            state.isLogin = false
            state.userName = ''
            state.token = ''
            state.nickName = '游客'
        },
        setRouterMounted (state, mounted) {
            state.routerMounted = mounted
        },
        setViews (state, views = []) {
            state.views = views
            setLocal('views', JSON.stringify(views))
        },
        setAuth (state, auth = []) {
            state.auth = auth
            setLocal('auth', JSON.stringify(auth))
        }
    },
    actions: {
        // 登录
        async loginAction ({ state, commit, dispatch }, { reqData, vm }) {
            const ret = await apiPost('/user/login', { data: reqData })
            if (ret) {
                setLocal('isLogin', true)
                setLocal('userName', ret.userName)
                setLocal('nickName', ret.nickName)
                setLocal('token', ret.token)
                setLocal('auth', JSON.stringify(ret.auth))
                commit('setLoginInfo', {
                    isLogin: true,
                    userName: ret.userName,
                    nickName: ret.nickName,
                    token: ret.token,
                    auth: ret.auth
                })
                let mounted = state.routerMounted
                if (mounted) {
                    vm.$router.push('/')
                } else {
                    mounted = await dispatch('addDynamicRoutes', { router: vm.$router })
                    mounted && vm.$router.push('/')
                }
            }
        },
        async addDynamicRoutes ({ commit }, { router }) {
            try {
                const views = await apiGet('/views/all')
                const { allRoutes, addRoutes } = getRouter(router.options.routes, viewsToRouter(views))
                router.options.routes = allRoutes
                router.addRoutes(addRoutes)
                // console.log('addDynamicRoutes', views, allRoutes, addRoutes)
                commit('setViews', views)
                commit('setRouterMounted', true)
                return true
            } catch (error) {
                commit('setViews', [])
                commit('setRouterMounted', false)
                console.log('addDynamicRoutes fail', error)
                return false
            }
        },
        async refreshViews ({ commit }, fn) {
            try {
                const views = await apiGet('/views/all')
                commit('setViews', views)
                fn()
            } catch (error) {
                console.log('refreshViews fail', error)
            }
        }
    },
    modules: {}
})
