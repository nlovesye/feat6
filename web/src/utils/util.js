const grades = ['C', 'B', 'A', 'S']
// 检测中文字符
const chineseReg = /[\u4e00-\u9fa5]/

export const grade = function (val = 1) {
    const i = val - 1
    return grades[i] || ''
}

// 获取本地localStorage
export const getLocal = function (key) {
    return localStorage.getItem(key)
}

// 设置本地localStorage
export const setLocal = function (key, val) {
    localStorage.setItem(key, val)
}

// 删除本地localStorage
export const removeLocal = function (key) {
    localStorage.removeItem(key)
}

// 对象、数组深拷贝
export function deepClone (obj) {
    const newObj = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
        for (const key in obj) {
            newObj[key] = (obj && (typeof obj[key]) === 'object') ? deepClone(obj[key]) : obj[key]
            // if (obj.hasOwnProperty(key)) {
            //     newObj[key] = (obj && (typeof obj[key]) === 'object') ? deepClone(obj[key]) : obj[key]
            // }
        }
    }
    return newObj
}

export const sleep = async second => await new Promise(resolve => setTimeout(resolve, 1000 * second))

export function tryCatch (fn) {
    return async function (ins, loadingKey) {
        try {
            await fn()
        } catch (error) {
            console.log('catch Error', error)
            if (ins && loadingKey) {
                ins[loadingKey] = false
            }
        }
    }
}

export { chineseReg }
