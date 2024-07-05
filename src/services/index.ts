import request from '@/utils/AxiosRequester'

export const getRecommendList = () => {
  return request.get('/list', {
    params: {
      category: 'recommend',
      count: 20
    }
  })
}
