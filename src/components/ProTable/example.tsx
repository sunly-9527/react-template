import React, { useState } from 'react'
import ProTable, { ProTableColumn } from './index'
import { Button, message, Space, Tag, Divider } from 'antd'
import { PlusOutlined, DownloadOutlined, ExportOutlined } from '@ant-design/icons'

interface UserRecord {
  id: string
  name: string
  age: number
  address: string
  tags: string[]
  status: 'active' | 'inactive'
  createTime: string
  email: string
  phone: string
  department: string
  role: string
}

const Example: React.FC = () => {
  // 模拟API请求函数
  const fetchUserList = async (params: any) => {
    console.log('请求参数:', params)
    
    // 模拟请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟搜索过滤
    let dataSource = [...mockData]
    
    // 处理搜索条件
    if (params.name) {
      dataSource = dataSource.filter(item => item.name.includes(params.name))
    }
    
    if (params.status) {
      dataSource = dataSource.filter(item => item.status === params.status)
    }
    
    if (params.department) {
      dataSource = dataSource.filter(item => item.department.includes(params.department))
    }
    
    if (params.role) {
      dataSource = dataSource.filter(item => item.role === params.role)
    }
    
    if (params.email) {
      dataSource = dataSource.filter(item => item.email.includes(params.email))
    }
    
    if (params.phone) {
      dataSource = dataSource.filter(item => item.phone.includes(params.phone))
    }
    
    if (params.ageStart && params.ageEnd) {
      dataSource = dataSource.filter(
        item => item.age >= params.ageStart && item.age <= params.ageEnd
      )
    }
    
    // 处理排序
    if (params.sortField && params.sortOrder) {
      const sortOrder = params.sortOrder === 'ascend' ? 1 : -1
      
      dataSource.sort((a, b) => {
        const aValue = (a as any)[params.sortField]
        const bValue = (b as any)[params.sortField]
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * sortOrder
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * sortOrder
        }
        
        return 0
      })
    }
    
    // 分页处理
    const pageSize = params.pageSize || 10
    const current = params.current || 1
    const start = (current - 1) * pageSize
    const end = current * pageSize
    
    return {
      data: dataSource.slice(start, end),
      success: true,
      total: dataSource.length
    }
  }
  
  // 定义表格列
  const columns: ProTableColumn<UserRecord>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      copyable: true,
      width: 80,
      fixed: 'left'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
      width: 120,
      search: true
    },
    {
      title: '年龄',
      dataIndex: 'age',
      valueType: 'dateRange',
      width: 100,
      sorter: (a, b) => a.age - b.age
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      width: 180,
      search: true
    },
    {
      title: '电话',
      dataIndex: 'phone',
      valueType: 'text',
      width: 150,
      search: true
    },
    {
      title: '部门',
      dataIndex: 'department',
      valueType: 'text',
      width: 150,
      search: true
    },
    {
      title: '角色',
      dataIndex: 'role',
      valueType: 'select',
      width: 120,
      valueEnum: {
        admin: { text: '管理员', status: 'warning' },
        user: { text: '用户', status: 'default' },
        editor: { text: '编辑', status: 'processing' }
      },
      search: true
    },
    {
      title: '地址',
      dataIndex: 'address',
      valueType: 'text',
      ellipsis: true,
      width: 200
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <>
          {tags.map(tag => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      width: 100,
      valueEnum: {
        active: { text: '活跃', status: 'success' },
        inactive: { text: '未活跃', status: 'error' }
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'date',
      width: 160
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <a onClick={() => message.success(`查看: ${record.name}`)}>查看</a>
          <a onClick={() => message.success(`编辑: ${record.name}`)}>编辑</a>
          <a onClick={() => message.success(`删除: ${record.name}`)}>删除</a>
        </Space>
      )
    }
  ]
  
  // 添加用户
  const handleAdd = () => {
    message.success('点击了添加按钮')
  }
  
  // 导出数据
  const handleExport = () => {
    message.success('点击了导出按钮')
  }
  
  // 下载模板
  const handleDownload = () => {
    message.success('点击了下载模板按钮')
  }
  
  return (
    <ProTable<UserRecord>
      headerTitle="用户列表"
      rowKey="id"
      columns={columns}
      request={fetchUserList}
      search={{ 
        layout: 'vertical', 
        defaultCollapsed: true, 
        defaultColsNumber: 3 
      }}
      dateFormatter="string"
      toolBarRender={({ reload, exportData }) => [
        <Button key="add" type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
          新建
        </Button>
      ]}
      columnsStateKey="pro_table_user_list"
      exportFileName="用户列表导出数据"
      pagination={{ pageSize: 5 }}
      scroll={{ x: 1500 }}
    />
  )
}

// 模拟数据生成函数
const generateMockData = (count: number): UserRecord[] => {
  const departments = ['技术部', '市场部', '销售部', '财务部', '人事部']
  const roles = ['admin', 'user', 'editor']
  const domains = ['gmail.com', 'qq.com', 'outlook.com', '163.com', '126.com']
  
  return Array.from({ length: count }).map((_, index) => {
    const deptIndex = index % departments.length
    const roleIndex = index % roles.length
    const name = `用户${index + 1}`
    
    return {
      id: `${index + 1}`,
      name,
      age: Math.floor(Math.random() * 50) + 18,
      address: `北京市朝阳区某某街道第${Math.floor(Math.random() * 100) + 1}号`,
      tags: [`标签${index % 5 + 1}`, `类型${Math.floor(index / 10) + 1}`],
      status: index % 3 === 0 ? 'inactive' : 'active',
      createTime: new Date(
        Date.now() - Math.floor(Math.random() * 60 * 60 * 24 * 365) * 1000
      ).toISOString().split('T')[0],
      email: `${name.toLowerCase()}@${domains[index % domains.length]}`,
      phone: `1${Math.floor(Math.random() * 9) + 1}${Array.from({ length: 9 })
        .map(() => Math.floor(Math.random() * 10))
        .join('')}`,
      department: departments[deptIndex],
      role: roles[roleIndex]
    }
  })
}

// 生成模拟数据
const mockData: UserRecord[] = generateMockData(50)

export default Example 