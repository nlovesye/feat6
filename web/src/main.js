import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import { extend } from './utils'
import './app.less'
import './assets/style/theme.less'

Vue.config.productionTip = false
Vue.use(ViewUI, {
    transfer: true,
    size: 'small'
    // capture: false,
    // select: {
    //     arrow: 'md-arrow-dropdown',
    //     arrowSize: 20
    // }
})
Vue.use(extend())

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
