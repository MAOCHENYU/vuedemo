import request from '@/utils/request'
import qs from 'qs'
// export function fetchList(query) {
//   return request({
//     url: '/vue-element-admin/article/list',
//     method: 'get',
//     params: query
//   })
// }

export function orderlist(data) {
  return request({
    url: '/api/Order/List',
    method: 'get',
    params: data
  })
}

export function orderdetail(id) {
  return request({
    url: '/api/Order/Detail/' + id,
    method: 'get'
  })
}
