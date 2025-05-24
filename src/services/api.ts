import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const url = new URL(window.location.href)
    const token = url.searchParams.get('token')
    const path = config.url
    if (token && path) {
      // 将 token 和 path 作为查询参数
      config.params = {
        token,
        path: path.startsWith('/') ? path : `/${path}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('zerotier_token')
      localStorage.removeItem('zerotier_network_id')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// API 方法
export const getNetworks = () => api.get('/network')
export const getNetwork = (networkId: string) => api.get(`/network/${networkId}`)
export const getMembers = (networkId: string | null) => {
  if (!networkId) {
    return Promise.reject(new Error('Network ID is required'))
  }
  return api.get(`/network/${networkId}/member`)
}

// 获取网络成员详情
export const getMember = (networkId: string | null, nodeId: string) => {
  if (!networkId) {
    return Promise.reject(new Error('Network ID is required'))
  }
  return api.get(`/network/${networkId}/member/${nodeId}`)
}

export default api 