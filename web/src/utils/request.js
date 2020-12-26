import axios from 'axios'
import { Message } from 'view-design'
import store from '@/store'

const axiosInstance = axios.create({
    timeout: 1000 * 20
})

axiosInstance.interceptors.request.use(function (config) { // 请求成功
    return config
}, function (error) { // 请求失败
    return Promise.reject(error)
})

axiosInstance.interceptors.response.use(function (res) { // 响应成功
    return res
}, function (err) { // 响应失败
    return Promise.reject(err)
})

const whiteUrl = ['/api/user/logon', '/api/user/login']

const apiAction = async function (method, url, config = {}) {
    try {
        const conf = {
            method,
            url,
            ...config
        }
        const { isLogin, token } = store.state
        if (!!isLogin && whiteUrl.indexOf(url) < 0) {
            conf.headers = {
                auth: token
            }
        }
        const ret = await axiosInstance(conf)
        return ret.data.data
    } catch (error) {
        const res = error.response
        console.log(`${url}-${method}[api Error]`, error, res)
        if (res && res.data) {
            const { code, msg } = res.data
            if (code === 401) {
                store.commit('mLogout')
                Message.error(msg)
            } else {
                Message.error(msg)
            }
        } else {
            Message.error(error.message)
        }
        throw error
    }
}

export default axiosInstance

export const apiGet = async (url, config) => {
    return apiAction('get', `/api${url}`, config)
}

export const apiPost = async (url, config) => {
    return apiAction('post', `/api${url}`, config)
}

export const apiPut = async (url, config) => {
    return apiAction('put', `/api${url}`, config)
}

export const apiDelete = async (url, config) => {
    return apiAction('delete', `/api${url}`, config)
}
