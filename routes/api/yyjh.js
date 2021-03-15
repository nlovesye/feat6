const router = require('koa-router')()
const { db } = require('../../utils')

router.prefix('/api/yyjh')

const tableName = 'yyjh'

// 列表
router.get(`/list`, async (ctx, next) => {
    const rt = db.findJson(tableName)
    return rt || []
})

// // 新增侠客
// router.post('/', async (ctx) => {
//     const { name } = ctx.request.body
//     const isExists = db.isExistsOne(tableName, item => item.name === name)
//     if (isExists) {
//         throw Error('已存在同名侠客')
//     }
//     const rt = db.insert(tableName, ctx.request.body)
//     return rt
// })


// 批量修改
router.put('/batch', async (ctx) => {
    const rt = db.updateAllMatched(tableName, ctx.request.body)
    return rt
})

// 修改
router.put('/', async (ctx) => {
    const { name } = ctx.request.body
    const isExists = db.isExistsOne(tableName, item => item.name === name)
    if (!isExists) {
        throw Error('地图不存在')
    }
    const rt = db.updateOne(tableName, ctx.request.body, item => item.name === name)
    return rt
})


// // 删除武将
// router.delete('/', async (ctx) => {
//     const { userName, name } = ctx.request.query
//     const isExists = db.isExistsOne(userName, item => item.name === name)
//     if (!isExists) {
//         throw Error('武将不存在')
//     } else {
//         const rt = db.removeOne(userName, item => item.name === name)
//         if (rt) {
//             return '删除成功'
//         } else {
//             throw Error('未知错误')
//         }
//     }
// })

module.exports = router
