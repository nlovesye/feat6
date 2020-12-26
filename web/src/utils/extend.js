import { apiGet, apiPost, apiDelete, apiPut } from './request'
import { tryCatch } from './util'

export default function use () {
    return {
        install: function (Vue) {
            Vue.prototype.$apiGet = apiGet
            Vue.prototype.$apiPost = apiPost
            Vue.prototype.$apiDelete = apiDelete
            Vue.prototype.$apiPut = apiPut
            Vue.prototype.tryCatch = tryCatch
        }
    }
}
