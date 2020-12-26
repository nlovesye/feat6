const router = require('koa-router')()
const { db } = require('../../utils')

router.prefix('/api/tree')
// const jsonName = 'tree'
const jsonName = 'tree_test'

function treeToArray (tree) {
    const arr = []
    function core (node) {
        arr.push(node)
        if (node.children) node.children = node.children.map(c => core(c))
    }
    core(tree)
    return arr
}

function getNewId (arr, i) {
    const id = `id-${i}`
    if (arr.some(node => node.id === id)) {
        return core(arr, ++i)
    }
    return id
}

// 获取树
router.get(`/`, async (ctx, next) => {
    // db.clear(userName)
    // const req = ctx.req  
    // const clientIP = req.headers['x-forwarded-for'] ||
    //     req.connection.remoteAddress ||
    //     req.socket.remoteAddress ||
    //     req.connection.socket.remoteAddress;
    // console.log('req', clientIP)
    const rt = db.findJson(jsonName)
    return rt || {}
})

router.get('/newId', async (ctx, next) => {
    const rt = db.findJson(jsonName)
    const arr = treeToArray(rt)
    const id = getNewId(arr, arr.length)
    return id
})

// 修改树
router.put('/', async (ctx) => {
    const rt = db.updateJson(jsonName, ctx.request.body)
    return rt
})

module.exports = router
