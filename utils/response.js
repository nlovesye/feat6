const appRes = require('./res')


module.exports = function () {
    return  async function (ctx, next) {
        try {
            const data = await next()
            const result = appRes.success(data)
            console.log('response', data)
            if (result.data === 'default data response') {
                ctx.status = 404
                ctx.body = 'Not found!'
            } else {
                ctx.status = result.code
                ctx.body = result
            }
        } catch (error) {
            console.log('response Err', error)
            if (error.type && error.type === 'AppError') {
                const result = appRes.fail(error.msg, error.code)
                ctx.status = result.code
                ctx.body = result
            } else {
                const result = appRes.fail(error.message || 'server error', 500)
                ctx.status = result.code
                ctx.body = result
            }
        }
    }
}
