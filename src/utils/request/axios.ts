import axios, { type AxiosResponse } from 'axios'
import { getJWT } from '@/store/modules/auth/helper'

const service = axios.create({
  // baseURL: import.meta.env.VITE_GLOB_API_URL,
  baseURL: 'https://chatgptapi.2huo.tech/',
  // baseURL: 'https://api.maidangjia.tech/',
})

service.interceptors.request.use(
  (config) => {
    const token = getJWT()
    if (token)
      config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
