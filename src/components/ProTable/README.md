# ProTable 高级表格组件

ProTable 是一个基于 Ant Design Table 的高级表格组件，旨在简化开发流程，提升开发效率。它集成了多种常见的表格功能，让开发者可以轻松构建功能丰富的表格界面。

## 特性

- 🔍 **自动生成搜索表单**：根据列配置自动生成对应的搜索表单项
  - 支持搜索条件的展开/收起功能
  - 可配置默认显示的搜索项数量
- 🔄 **集成请求和分页**：内置数据加载和分页逻辑
- 📋 **自定义列设置**：支持显示/隐藏列
- 📏 **列宽调整**：可拖动调整列宽度，带有平滑的动画效果
- 🔃 **列排序**：可拖拽调整列顺序，提供流畅的交互体验
- 📊 **数据导出**：一键导出表格数据为CSV
- 💾 **状态持久化**：可保存列宽、列显示状态等配置到localStorage
- 📱 **响应式设计**：适配不同屏幕尺寸
- 🖥️ **全屏模式**：支持表格全屏展示，无黑色背景
- 🔘 **操作按钮靠右**：表单按钮和工具栏按钮均支持右对齐布局

## 安装

```bash
# 如果你使用npm
npm install @/components/ProTable

# 如果你使用yarn
yarn add @/components/ProTable
```

## 基本用法

```tsx
import React from 'react';
import ProTable, { ProTableColumn } from '@/components/ProTable';

// 定义数据类型
interface UserRecord {
  id: string;
  name: string;
  age: number;
  status: 'active' | 'inactive';
}

// 定义列配置
const columns: ProTableColumn<UserRecord>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text', // 搜索表单类型
    width: 120,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 80,
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      active: { text: '活跃', status: 'success' },
      inactive: { text: '未活跃', status: 'error' },
    },
  },
];

// 模拟API请求
const fetchUserList = async (params: any) => {
  // 处理API请求逻辑
  return {
    data: [], // 你的数据列表
    success: true,
    total: 0,
  };
};

const UserTable: React.FC = () => {
  return (
    <ProTable<UserRecord>
      columns={columns}
      request={fetchUserList}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      headerTitle="用户列表"
      search={{
        layout: 'vertical',
        defaultCollapsed: true,
        defaultColsNumber: 3
      }}
      dateFormatter="string"
    />
  );
};

export default UserTable;
```

## API

### ProTable

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表格列配置 | `ProTableColumn[]` | - |
| request | 获取数据的函数 | `(params) => Promise<{ data, success, total }>` | - |
| dataSource | 数据源 | `any[]` | - |
| rowKey | 表格行key | `string` \| `(record) => string` | 'id' |
| pagination | 分页配置 | `TablePaginationConfig` \| `false` | `{ pageSize: 10 }` |
| loading | 加载状态 | `boolean` | - |
| search | 搜索表单配置 | `boolean` \| `{ layout: 'horizontal' \| 'vertical' \| 'inline'; defaultCollapsed?: boolean; defaultColsNumber?: number }` | `true` |
| dateFormatter | 日期格式化 | `'string'` \| `'number'` \| `false` | `'string'` |
| headerTitle | 表格标题 | `React.ReactNode` | - |
| toolBarRender | 工具栏渲染函数 | `(action) => React.ReactNode[]` | - |
| options | 工具栏选项 | `object` \| `false` | 见下文 |
| columnsStateKey | 列状态保存的key | `string` | - |
| exportFileName | 导出文件名 | `string` | - |

### ProTableColumn

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dataIndex | 列数据索引 | `string` | - |
| title | 列标题 | `string` | - |
| valueType | 值类型 | `'text'` \| `'select'` \| `'date'` \| `'dateRange'` \| `'textarea'` | `'text'` |
| valueEnum | 枚举映射 | `Record<string, { text: string; status: string }>` | - |
| hideInTable | 是否在表格中隐藏 | `boolean` | `false` |
| hideInSearch | 是否在搜索表单中隐藏 | `boolean` | `false` |
| width | 列宽度 | `number` \| `string` | - |
| sorter | 排序配置 | `boolean` \| `function` | - |
| filters | 筛选菜单项 | `{ text, value }[]` | - |
| search | 是否可搜索 | `boolean` | - |
| fixed | 列固定位置 | `'left'` \| `'right'` | - |
| ellipsis | 是否自动缩略 | `boolean` | `false` |
| copyable | 是否可复制 | `boolean` | `false` |
| align | 列对齐方式 | `'left'` \| `'right'` \| `'center'` | `'left'` |

### 搜索表单配置

search属性扩展配置：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| layout | 表单布局 | `'horizontal'` \| `'vertical'` \| `'inline'` | `'horizontal'` |
| defaultCollapsed | 是否默认收起 | `boolean` | `true` |
| defaultColsNumber | 默认显示的搜索项数量 | `number` | `3` |

## 高级用法

### 自定义表单项渲染

```tsx
{
  title: '创建时间',
  dataIndex: 'createTime',
  valueType: 'date',
  renderFormItem: (item, { type, defaultRender }) => {
    return <YourCustomDatePicker />;
  },
}
```

### 配置搜索条件展开/收起

```tsx
<ProTable
  search={{
    layout: 'vertical',
    defaultCollapsed: true,  // 默认是否收起
    defaultColsNumber: 3     // 默认显示几项搜索条件
  }}
  // ...其他配置
/>
```

### 保存列状态

```tsx
<ProTable
  columnsStateKey="table-columns-key"
  // ...其他配置
/>
```

### 自定义工具栏

工具栏按钮可以灵活配置，并且默认右对齐：

```tsx
<ProTable
  toolBarRender={({ reload, exportData }) => [
    <Button key="download" onClick={handleDownload}>
      下载模板
    </Button>,
    <Button key="export" onClick={exportData}>
      导出
    </Button>,
    <Divider type="vertical" key="divider" />,
    <Button key="add" type="primary" onClick={handleAdd}>
      新建
    </Button>
  ]}
  // ...其他配置
/>
```

## 注意事项

1. 为了确保表格性能，建议给每一列都设置合适的宽度
2. 如果使用 `request` 属性，需要返回符合接口规范的数据
3. 对于需要持久化的表格，请确保提供唯一的 `columnsStateKey`
4. 当搜索条件较多时，推荐使用 `search.defaultCollapsed` 设置默认收起状态
5. 拖拽调整列顺序和宽度现在有了更流畅的动画效果
6. 表单的查询、重置按钮和工具栏按钮已默认实现靠右对齐

## 贡献与反馈

如发现任何问题或有改进建议，欢迎提交 Issue 或 Pull Request。 