import request from '@/utils/AxiosRequester'
import '../../mock'

export const getRecommendList = () => {
  return request.get('https://mcs.snssdk.com/list')
}

export const queryUserList = () => {
  return request.get('/api/users')
}
