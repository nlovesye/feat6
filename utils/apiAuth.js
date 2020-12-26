const jwt = require('jsonwebtoken')
const cert = 'ns'

module.exports = function() {
    const whiteUrl = ['/api/user/logon', '/api/user/login', '/api/library/generals', '/api/tree', '/api/tree/newId']
    return async function (ctx, next) {
        if (ctx.url.startsWith('/api') && whiteUrl.indexOf(ctx.url) < 0) {
            try {
                const token = ctx.request.header.auth
                jwt.verify(token, cert)
                // console.log('apiAuth', ctx.request.body, ctx.url, ctx.request.header, token, rt)
            } catch (error) {
                // console.log('err', error)
                if (error.name === 'TokenExpiredError') {
                    throw {
                        type: 'AppError',
                        code: 401,
                        msg: '登录信息已过期，请重新登录！'
                    }
                } else if (error.name === 'JsonWebTokenError') {
                    throw {
                        type: 'AppError',
                        code: 401,
                        msg: '鉴权失败！'
                    }
                } else {
                    throw {
                        type: 'AppError',
                        code: 401,
                        msg: 'auth验证失败！'
                    }
                }
            }
        }
        try {
            return await next()
        } catch (error) {
            throw error
        }
    }
}
