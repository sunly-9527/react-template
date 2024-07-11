import request from '@/utils/AxiosRequester'

export const getRecommendList = () => {
  return request.get('https://mcs.snssdk.com/list')
}
