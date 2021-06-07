import { request } from '@/api/request'

// 获取图标数据
export function getChart (params) {
  return request({
    url: '/api/cloudPicture/installation/mete/chart',
    method: 'get',
    params
  })
}

// 获取项目列表
export function getProjectList (params) {
  return request({
    url: '/api/cloudPicture/installation/project',
    method: 'get',
    params
  })
}

export function getMonitor (params) {
  return request({
    url: '/api/cloudPicture/cameraIndexCodeList',
    method: 'post',
    params
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

export function getMonitorInfo () {
  return request({
    url: '/api/cloudPicture/cameraIndexCode',
    method: 'post'
  })
}
