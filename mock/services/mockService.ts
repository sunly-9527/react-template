import { users } from '../data/users'
import type { User } from '../models/User'
import { mock, Random } from 'mockjs'

mock('/api/users', 'get', () => ({
  code: 200,
  data: users,
  message: '成功'
}))

mock('/api/users', 'post', (options: any) => {
  const newUser: User = JSON.parse(options.body)
  newUser.id = Random.guid()
  users.push(newUser)
  return { user: newUser }
})
