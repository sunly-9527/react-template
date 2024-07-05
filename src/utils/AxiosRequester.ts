import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'

const { REACT_APP_API_URL } = process.env || {}

const createAxiosInterceptors = (config?: AxiosRequestConfig): AxiosInstance => {
  // let showLoading = true
  const axiosInstance = axios.create({
    timeout: 2000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    withCredentials: true,
    ...config
  })

  axiosInstance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token') || ''
      if (token) {
        config.headers.Authorization = token
      }
      return config
    },
    err => {
      console.error(`网络请求错误：${err}`)
      return Promise.reject(err)
    }
  )

  axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => {
      const { status } = res || {}
      if (status === 401) {
        localStorage.removeItem('token')
        return Promise.reject(res.data)
      }
      return res
    },
    err => {
      console.error(`网络请求响应错误：${err}`)
      return Promise.reject(err)
    }
  )

  return axiosInstance
}

const AxiosRequester = createAxiosInterceptors({ baseURL: REACT_APP_API_URL })

export default AxiosRequester
