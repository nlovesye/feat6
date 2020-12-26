const router = require('koa-router')()
const { db } = require('../../utils')

router.prefix('/api/views')
const tableName = 'views'
const userTable = 'user'

function arrayToTree (arr) {
    const map = {}
    const tree = []
    for (let i = 0, len = arr.length; i < len; i++) {
        const item = arr[i]
        item.expand = true
        map[item.name] = item
        map[item.name].children = []
    }
    for (let i = 0, len = arr.length; i < len; i++) {
        const { parentName } = arr[i]
        if (!!parentName && !!map[parentName]) {
            map[parentName].children.push(arr[i])
        } else {
            tree.push(arr[i])
        }
    }
    // console.log('arrayToTree', map, tree)
    return tree
}

// 获取所有视图
router.get('/all', async () => {
    const arr = db.findJson(tableName)
    const tree = arrayToTree(arr || [])
    return tree
})

// 获取权限视图
router.get('/auth', async () => {
    const arr = db.findJson(tableName)
    const tree = arrayToTree((arr || []).filter(item => item.auth))
    return tree
})

// 添加视图
router.post('/', async (ctx) => {
    const { parentName, name, title, path, icon } = ctx.request.body
    const isExists = db.isExistsOne(tableName, item => item.name === name)
    if (isExists) {
        throw Error('Name重复！')
    }
    const rt = db.insert(tableName, { parentName, name, title, path, icon })
    return rt
})

// 编辑视图
router.put('/', async (ctx) => {
    const { name, title } = ctx.request.body
    const isExists = db.isExistsOne(tableName, item => item.name === name)
    if (!isExists) {
        throw Error(`视图${title}不存在`)
    }
    const rt = db.updateOne(tableName, ctx.request.body, item => item.name === name)
    return rt
})

// 删除视图
router.delete('/', async (ctx) => {
    const { name } = ctx.request.query
    const isExists = db.isExistsOne(tableName, item => item.name === name)
    if (!isExists) {
        throw Error('视图不存在')
    }
    if (db.isExistsOne(tableName, item => item.parentName === name)) {
        throw Error('存在子视图')
    }
    const users = db.findJson(userTable)
    if (users.some(user => (user.auth || []).some(a => a.name === name))) {
        throw Error('存在用户配置该视图权限，无法删除！')
    }
    const rt = db.removeOne(tableName, item => item.name === name)
    if (rt) {
        return '删除成功'
    } else {
        throw Error('未知错误')
    }
})


module.exports = router
