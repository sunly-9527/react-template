import Mock from 'mockjs'

Mock.mock('/api/user', 'get', {
  code: 200,
  data: {
    id: '@id',
    name: '@name',
    age: '@integer(20, 50)'
  }
})
