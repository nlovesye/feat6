export {
    default as axiosInstance,
    apiGet,
    apiPost,
    apiDelete,
    apiPut
} from './request'

export {
    grade,
    getLocal,
    setLocal,
    removeLocal,
    tryCatch,
    sleep,
    deepClone,
    chineseReg
} from './util'

export * as dataDic from './dataDic'

export { default as extend } from './extend'
