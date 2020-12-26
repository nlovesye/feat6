const router = require('koa-router')()
const { db } = require('../../utils')
const multer = require('koa-multer')
const path = require('path')

const destPath = path.join(__dirname, '../../static/img/shediao')
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destPath)
        },
        filename: function (req, file, cb) {
            const fileFormat = (file.originalname).split(".") // 以点分割成数组，数组的最后一项就是后缀名
            const ext = fileFormat[fileFormat.length - 1]
            const { uploadName } = req.body
            const filename = uploadName + "." + ext
            // console.log('filename', filename)
            cb(null, filename)
        }
    })
})

router.prefix('/api/shediao')

const tableName = 'shediao'

// 侠客库
router.get(`/list`, async (ctx, next) => {
    const rt = db.findJson(tableName)
    return rt || []
})

// 新增侠客
router.post('/', async (ctx) => {
    const { name } = ctx.request.body
    const isExists = db.isExistsOne(tableName, item => item.name === name)
    if (isExists) {
        throw Error('已存在同名侠客')
    }
    const rt = db.insert(tableName, ctx.request.body)
    return rt
})

// 编辑侠客
router.put('/', async (ctx) => {
    const { name } = ctx.request.body
    const isExists = db.isExistsOne(tableName, item => item.name === name)
    if (!isExists) {
        throw Error('侠客不存在')
    }
    const rt = db.updateOne(tableName, ctx.request.body, item => item.name === name)
    return rt
})

// 侠客图片上传
router.post('/upload', upload.single('pic'), async (ctx) => {
    return 'upload successed'
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
