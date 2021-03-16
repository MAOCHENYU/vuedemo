import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import axios from 'axios'
import Print from './utils/print'
import IconSvg from '@/components/icon-component'

Vue.component('icon-svg', IconSvg)
Vue.use(Print)
Vue.prototype.$axios = axios
axios.defaults.baseUrl = '/api'
// Vue.config.productionTip = false

/**
 * 如果您不想使用模拟服务器
 * 您希望将MockJs用于mock api
 * 你可以执行: mockXHR()
 *
 * 目前MockJs将用于生产环境，
 * 请在上线前删除它！
 */
// if (process.env.NODE_ENV === 'development') {
const { mockXHR } = require('../mock')
mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// 注册全局实用程序筛选器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
