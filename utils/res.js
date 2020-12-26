class AppRes {
    constructor() {

    }

    success(data = 'default data response') {
        return {
            code: 200,
            success: true,
            data
        }
    }

    fail(msg = '', code = 500) {
        return {
            code,
            success: false,
            msg
        }
    }
}
AppRes.getInstance = function() {
    if (!AppRes.instance) {
        AppRes.instance = new AppRes()
    }
    return AppRes.instance
}

module.exports = AppRes.getInstance()
