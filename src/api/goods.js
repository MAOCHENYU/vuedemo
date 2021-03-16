import request from '@/utils/request'
import qs from 'qs'
// export function fetchList(query) {
//   return request({
//     url: '/vue-element-admin/article/list',
//     method: 'get',
//     params: query
//   })
// }
export function test() {
  return request({
    url: '/api/Values',
    method: 'get'
  })
}
export function fetchList(query) {
  return request({
    url: '/api/CommodityClassification/List',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function goodslist(data) {
  return request({
    url: '/api/Commodity/List',
    method: 'get',
    params: data
  })
}

export function goodsadd(data) {
  return request({
    url: '/api/Commodity/Create',
    method: 'post',
    data
  })
}
export function goodsedit(data, id) {
  return request({
    url: '/api/Commodity/Edit/' + id,
    method: 'put',
    data
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  // data = qs.stringify(data);
  return request({
    url: '/api/CommodityClassification/Create',
    method: 'post',
    data
  })
}

export function updateArticle(data, id) {
  return request({
    url: '/api/CommodityClassification/Edit/' + id,
    method: 'put',
    data
  })
}

export function deletegoostype(id) {
  return request({
    url: '/api/CommodityClassification/Delete/' + id,
    method: 'delete'
  })
}
