import axios from 'axios'

export function request (config) {
  const instance = axios.create({
    baseURL: 'http://192.168.10.138:8080',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
  })
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log(err)
  })
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err)
  })

  return instance(config)
}
