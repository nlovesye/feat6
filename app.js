const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')

const defaultRouter = require('./routes')
const allApi = require('./routes/api')
const { apiAuth, response } = require('./utils')

// console.log('all', allApi)

const app = new Koa()

// error handler
onerror(app)

app.use(bodyParser())
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/static'))
// app.use(require('koa-static')(__dirname + '/web/dist'))
app.use(views(__dirname + '/views', {
    extension: 'html'
}))
// app.use(views(__dirname + '/web/dist', {
//     extension: 'html'
// }))


// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    // console.log(`query: `, ctx.request.query)
    // console.log(`reqbody: `, ctx.request.body)
})

// page routes
app.use(defaultRouter.routes(), defaultRouter.allowedMethods())

// 响应中间件
app.use(response())
// 鉴权验证
app.use(apiAuth())

// routes
for (const key in allApi) {
    if (allApi.hasOwnProperty(key)) {
        const api = allApi[key]
        app.use(api.routes(), api.allowedMethods())
    }
}


// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
