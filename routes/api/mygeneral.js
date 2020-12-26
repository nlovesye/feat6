const router = require('koa-router')()
const { db } = require('../../utils')

router.prefix('/api/mygeneral')

// 获取武将
router.get(`/`, async (ctx, next) => {
    // db.clear(userName)
    const { userName } = ctx.request.query
    const rt = db.findJson(userName)
    return rt || []
})

// 新增武将
router.post('/', async (ctx) => {
    const { userName, general } = ctx.request.body
    const isExists = db.isExistsOne(userName, item => item.name === general.name)
    if (isExists) {
        throw Error('已存在同名武将')
    } else {
        const rt = db.insert(userName, general)
        return rt
    }
})

// 编辑武将
router.put('/', async (ctx) => {
    const { userName, general } = ctx.request.body
    const isExists = db.isExistsOne(userName, item => item.name === general.name)
    if (!isExists) {
        throw Error('武将不存在')
    } else {
        const rt = db.updateOne(userName, general, item => item.name === general.name)
        return rt
    }
})

// 删除武将
router.delete('/', async (ctx) => {
    const { userName, name } = ctx.request.query
    const isExists = db.isExistsOne(userName, item => item.name === name)
    if (!isExists) {
        throw Error('武将不存在')
    } else {
        const rt = db.removeOne(userName, item => item.name === name)
        if (rt) {
            return '删除成功'
        } else {
            throw Error('未知错误')
        }
    }
})

module.exports = router
