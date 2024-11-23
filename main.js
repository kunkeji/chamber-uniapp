
import App from './App'

import Vue from 'vue'
import store from './store'
import './uni.promisify.adaptor'
import tools from './common/tools.js'
import titleBar from '@/pages/component/title-bar/title-bar.vue'
import tabBar from '@/pages/component/tab-bar/tab-bar.vue'
import empty from '@/pages/component/empty/empty.vue'
Vue.component("title-bar", titleBar)
Vue.component("tab-bar", tabBar)
Vue.component("empty", empty)
// #ifdef H5
Vue.config.ignoredElements.push('wx-open-launch-weapp')
// #endif
Vue.prototype.$store = store
Vue.prototype.$util = tools
Vue.prototype.$onLaunched = new Promise(resolve => {
	Vue.prototype.$isResolve = resolve
})
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	store
})
app.$mount()