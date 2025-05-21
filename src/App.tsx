import AtInput from './components/AtInput'
import ProTable from './components/ProTable/example'
import type { ProTableColumn } from './components/ProTable'
import { useRef } from 'react'
import { Button, Space, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import MarkdownEditor from './components/MarkdownEditor';
// 定义数据类型
interface User {
  id: number
  name: string
  age: number
  email: string
  status: 'active' | 'inactive' | 'pending'
  role: string
  createTime: string
  address: string
  tags: string[]
}

function App() {
  const queryUserAll = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: [
            {
              uid: 1,
              nickname: '唐老师',
              avatarUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
            },
            {
              uid: 2,
              nickname: '邓老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/27.jpg'
            },
            {
              uid: 3,
              nickname: '郑老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/26.jpg'
            },
            {
              uid: 4,
              nickname: '刘老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/25.jpg'
            },
            {
              uid: 5,
              nickname: '李老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/24.jpg'
            },
            {
              uid: 6,
              nickname: '刘老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/23.jpg'
            },
            {
              uid: 7,
              nickname: '张老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/22.jpg'
            },
            {
              uid: 8,
              nickname: '徐老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/21.jpg'
            },
            {
              uid: 9,
              nickname: '陈老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/20.jpg'
            }
          ]
        })
      }, 100)
    })
  }

  // 可以通过 ref 调用 ProTable 的方法（如果有）
  const tableRef = useRef<any>()

  // 定义表格列
  const columns: ProTableColumn<User>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left',
      hideInSearch: true
    },
    {
      title: '用户名',
      dataIndex: 'name',
      width: 120,
      copyable: true // 开启复制功能
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 80,
      sorter: true,
      hideInSearch: true
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 180,
      ellipsis: true // 开启省略展示
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        active: { text: '活跃', status: 'success' },
        inactive: { text: '非活跃', status: 'default' },
        pending: { text: '待审核', status: 'warning' }
      },
      render: status => {
        const statusMap = {
          active: { color: 'green', text: '活跃' },
          inactive: { color: 'grey', text: '非活跃' },
          pending: { color: 'orange', text: '待审核' }
        }
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      }
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 120,
      valueType: 'select',
      valueEnum: {
        admin: { text: '管理员', status: 'error' },
        user: { text: '普通用户', status: 'default' },
        guest: { text: '访客', status: 'default' }
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      valueType: 'dateRange',
      sorter: true,
      hideInTable: false // 在表格中显示
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 200,
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 200,
      hideInSearch: true,
      render: (tags: string[]) => (
        <>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      )
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 180,
      hideInSearch: true,
      render: (_, record) => (
        <Space>
          <Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type='link' danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  // 模拟的数据请求函数
  const fetchUserList = async (params: any) => {
    // console.log('请求参数:', params);
    // 实际应用中，这里应该是真实的 API 请求
    try {
      // 模拟 API 请求
      // const response = await axios.get('/api/users', { params });
      // return {
      //   data: response.data.items,
      //   success: true,
      //   total: response.data.total,
      // };

      // 为示例目的，这里使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 500)) // 模拟网络延迟

      // 构建模拟数据
      const { current = 1, pageSize = 10 } = params
      const total = 100

      // 创建模拟数据的函数
      const generateMockData = () => {
        const mockData: User[] = []
        const startIdx = (current - 1) * pageSize
        const endIdx = Math.min(startIdx + pageSize, total)

        for (let i = startIdx; i < endIdx; i++) {
          mockData.push({
            id: i + 1,
            name: `用户${i + 1}`,
            age: 20 + (i % 40),
            email: `user${i + 1}@example.com`,
            status: ['active', 'inactive', 'pending'][i % 3] as 'active' | 'inactive' | 'pending',
            role: ['admin', 'user', 'guest'][i % 3],
            createTime: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
            address: `中国北京市朝阳区第${i + 1}街区`,
            tags: [`标签${(i % 5) + 1}`, `标签${((i + 2) % 5) + 1}`]
          })
        }

        return mockData
      }

      // 如果有搜索条件，筛选数据
      const mockDataList = generateMockData()

      // 返回数据
      return {
        data: mockDataList,
        success: true,
        total
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      // message.error('获取用户列表失败')
      return {
        data: [],
        success: false,
        total: 0
      }
    }
  }

  // 操作函数
  const handleAdd = () => {
    // message.info('点击了添加按钮')
    // 这里可以打开添加用户的表单或抽屉等
  }

  const handleEdit = (record: User) => {
    // message.info(`编辑用户: ${record.name}`)
    // 这里可以打开编辑用户的表单或抽屉等
  }

  const handleDelete = (record: User) => {
    // message.info(`删除用户: ${record.name}`)
    // 这里可以弹出确认删除的对话框
  }

  const handleExport = () => {
    // message.info('导出用户数据')
    // 导出数据的逻辑
  }

  // 渲染自定义工具栏按钮
  const toolBarRender = (actions: { reload: () => void; exportData: () => void }) => [
    <Button key='add' type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
      新建用户
    </Button>,
    <Button
      key='export'
      onClick={() => {
        actions.exportData() // 调用内置的导出功能
        handleExport()
      }}
    >
      导出数据
    </Button>
  ]

  return (
    <div className={'App'}>
      <AtInput
        height={150}
        onRequest={async () => {
          const { data = [] }: any = await queryUserAll()
          return data?.map((v: { uid: number; nickname: string; avatarUrl: string }) => ({
            id: v.uid,
            name: v.nickname,
            avatarUrl: v.avatarUrl
          }))
        }}
        onChange={(content, selected) => {
          console.log(content, selected)
        }}
      />
      <ProTable />
      {/* <MarkdownEditor ossConfig={{
        region: 'oss-cn-hangzhou',
        accessKeyId: 'LTAI5t7mMtUt1hZgxSgGo51F',
        accessKeySecret: 'KxgMGLVxWggw8QbGonT2kPwxx6wIH8',
        bucket: 'ly-hz-blog-oss',
      }} /> */}
      <MarkdownEditor
        initialValue="## 欢迎使用 Markdown 编辑器\n\n这是一个基于 React 和 TypeScript 的 Markdown 编辑器。\n\n## 功能特点\n\n- 实时预览\n- 图片上传\n- 导入/导出文档\n- 全屏编辑"
        onSave={(value) => { console.log('保存', value) }}
      />

    </div>
  )
}

export default App
