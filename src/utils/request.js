import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
// if(process.env.NODE_ENV == 'development'){
//   process.env.VUE_APP_BASE_API = 'http://192.168.1.21:7125';
// }
console.log(process.env.VUE_APP_BASE_API)
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// service.defaults.headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'};

// 请求拦截器

service.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      config.data = { unused: 0 } // 这个是关键点，加入这行就可以了,解决get,请求添加不上Content-Type
    }
    // do something before request is sent
    config.headers['Content-Type'] = 'application/json; charset=UTF-8'
    // config.headers['Access-Control-Allow-Headers'] = '*'
    // if (store.getters.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    // config.headers['X-Token'] = getToken()
    // }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    return res
    if (response.status == 200) {
      return res
    } else if (response.status == 401) {
      Message({
        message: res.errmsg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // to re-login
      MessageBox.confirm('您已注销，您可以取消停留在该页上，或重新登录', '确认注销', {
        confirmButtonText: 'Re-Login',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      console.log(response)
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
