import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/wx/person-list',
    method: 'get',
    params
  })
}
