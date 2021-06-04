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

export function getMonitor (data) {
  return request({
    url: `/api/cloudPicture/cameraIndexCodeLists?pageNo=${data.pageNo}&pageSize=${data.pageSize}`,
    method: 'post'
  })
}

// 获取出勤和其他数据
export function get (params) {
  return request({
    url: '/api/cloudPicture/project/basis',
    method: 'get',
    params
  })
}
