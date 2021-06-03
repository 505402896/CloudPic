import { request } from '@/api/request'

export function getData (params) {
  return request({
    url: '/api/cloudPicture/installation/mete/chart',
    method: 'get',
    params
  })
}

export function getProjectList (params) {
  return request({
    url: '/api/cloudPicture/installation/project',
    method: 'get',
    params
  })
}
