const router = require('koa-router')()
const { db } = require('../../utils')

router.prefix('/api/library')

router.get(`/generals`, async (ctx, next) => {
    // db.addJson('test')
    // db.insert('test', general)
    // db.clear('test')
    const rt = db.findJson('test')
    // console.log('str', str)
    return rt
})

module.exports = router
