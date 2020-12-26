const router = require('koa-router')()
const { db } = require('../../utils')
const jwt = require('jsonwebtoken')

router.prefix('/api/user')
const jsonName = 'user'
const cert = 'ns'

// 注册
router.post(`/logon`, async (ctx, next) => {
    const { userName } = ctx.request.body
    if (db.isExistsOne(jsonName, user => {
        return userName === user.userName
    })) {
        throw new Error('当前用户已存在！')
    } else {
        const rt = db.insert(jsonName, {
            ...ctx.request.body,
            nickName: 'n-' + userName
        })
        return {
            userName,
            nickName: rt.nickName
        }
    }
})

// 登录
router.post('/login', async (ctx, next) => {
    const {
        userName,
        pwd
    } = ctx.request.body
    const rt = db.findOne(jsonName, user => user.userName === userName && user.pwd === pwd)
    if (rt) {
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 7,
            data: userName
        }, cert)
        return {
            userName: rt.userName,
            nickName: rt.nickName,
            token,
            auth: rt.auth || []
        }
    } else {
        throw new Error('用户名或密码错误')
    }
})

// 获取用户列表
router.get('/list', async () => {
    const rt = db.findJson('user')
    return rt || []
})

// 编辑
router.put('/change', async (ctx) => {
    const { userName } = ctx.request.body
    const isExists = db.isExistsOne(jsonName, item => item.userName === userName)
    if (!isExists) {
        throw Error('用户名不存在')
    } else {
        const rt = db.updateOne(jsonName, ctx.request.body, item => item.userName === userName)
        return rt
    }
})

// 配置权限
router.put('/auth', async (ctx) => {
    const { userName, auth } = ctx.request.body
    const isExists = db.isExistsOne(jsonName, item => item.userName === userName)
    if (!isExists) {
        throw Error('用户名不存在')
    } else {
        const rt = db.updateOne(jsonName, { auth }, item => item.userName === userName)
        return rt
    }
})

module.exports = router
