import React, { useState, useEffect, useRef, Key } from 'react'
import {
  Table,
  Input,
  Button,
  Space,
  Form,
  Card,
  Dropdown,
  Menu,
  Tooltip,
  Divider,
  Tag,
  Typography,
  Row,
  Col,
  DatePicker,
  Select,
  Popover
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  DownOutlined,
  FilterOutlined,
  ExportOutlined,
  PlusOutlined,
  ColumnHeightOutlined,
  FullscreenOutlined,
  DragOutlined,
  EllipsisOutlined,
  UpOutlined
} from '@ant-design/icons'
import type { TableProps, ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { FilterValue, SorterResult } from 'antd/es/table/interface'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ResizableTitle from './ResizableTitle'

const { RangePicker } = DatePicker
const { Option } = Select
const { Title, Text } = Typography

type SizeType = 'small' | 'middle' | 'large'

export interface ProTableColumn<RecordType> {
  dataIndex: string
  title: string
  key?: string
  hideInTable?: boolean
  hideInSearch?: boolean
  filters?: { text: string; value: any }[]
  valueType?: 'text' | 'select' | 'date' | 'dateRange' | 'textarea'
  valueEnum?: Record<string, { text: string; status: string }>
  render?: (text: any, record: RecordType, index: number) => React.ReactNode
  width?: number | string
  sorter?: boolean | ((a: RecordType, b: RecordType) => number)
  search?: boolean
  fixed?: 'left' | 'right'
  ellipsis?: boolean
  copyable?: boolean
  defaultFilteredValue?: any[]
  formItemProps?: any
  renderFormItem?: (item: any, config: any) => React.ReactNode
  align?: 'left' | 'right' | 'center'
}

interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: string
  sortOrder?: string
  filters?: Record<string, FilterValue>
  [key: string]: any
}

export interface ProTableProps<RecordType extends object = any> {
  columns: ProTableColumn<RecordType>[]
  request?: (params: any) => Promise<{ data: RecordType[]; success: boolean; total?: number }>
  dataSource?: RecordType[]
  rowKey?: string | ((record: RecordType) => React.Key)
  pagination?: TablePaginationConfig | false
  loading?: boolean
  search?: boolean | { layout: 'horizontal' | 'vertical' | 'inline'; defaultCollapsed?: boolean; defaultColsNumber?: number }
  dateFormatter?: 'string' | 'number' | false
  defaultData?: RecordType[]
  headerTitle?: React.ReactNode
  toolBarRender?: (action: { reload: () => void; exportData: () => void }) => React.ReactNode[]
  options?:
    | {
        fullScreen?: boolean
        reload?: boolean
        setting?: boolean
        density?: boolean
      }
    | false
  tableClassName?: string
  tableStyle?: React.CSSProperties
  scroll?: { x?: number | string; y?: number | string }
  toolbar?: React.ReactNode
  rowSelection?: TableProps<RecordType>['rowSelection']
  beforeSearchSubmit?: (params: Record<string, any>) => Record<string, any>
  defaultSize?: SizeType
  onSizeChange?: (size: SizeType) => void
  onLoad?: (dataSource: RecordType[]) => void
  onLoadingChange?: (loading: boolean) => void
  columnsStateKey?: string
  exportFileName?: string
}

// Type for draggable column items
type DragItem = {
  index: number
  id: string
  type: string
}

// Drag and Drop Column component
const DragableTitle = ({
  index,
  moveColumn,
  title,
  ...restProps
}: {
  index: number
  moveColumn: (dragIndex: number, hoverIndex: number) => void
  title: React.ReactNode
  [key: string]: any
}) => {
  const ref = useRef<HTMLTableCellElement>(null)

  // Define drag behavior
  const [{ isDragging }, drag] = useDrag<DragItem, {}, { isDragging: boolean }>({
    type: 'DraggableColumn',
    item: { type: 'DraggableColumn', index, id: `column-${index}` },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    }),
    // 添加拖拽预览以提高流畅度
    previewOptions: {
      captureDraggingState: true,
      offsetX: 0,
      offsetY: 0
    }
  })

  // Define drop behavior
  const [, drop] = useDrop<DragItem, {}, {}>({
    accept: 'DraggableColumn',
    hover(item: DragItem) {
      if (item.index === index) {
        return
      }
      moveColumn(item.index, index)
      item.index = index
    }
  })

  drag(drop(ref))

  return (
    <th 
      ref={ref} 
      style={{ 
        cursor: 'move', 
        opacity: isDragging ? 0.5 : 1,
        transition: 'opacity 0.2s, background-color 0.2s' // 添加过渡效果
      }} 
      {...restProps}
    >
      {title}
    </th>
  )
}

// Get search form item based on column type
const getFormItemByValueType = (
  valueType: string = 'text',
  dataIndex: string,
  title: string,
  valueEnum?: Record<string, { text: string; status: string }>,
  formItemProps?: any
) => {
  switch (valueType) {
    case 'select':
      return (
        <Form.Item name={dataIndex} label={title} {...formItemProps}>
          <Select placeholder={`请选择${title}`} allowClear>
            {valueEnum &&
              Object.entries(valueEnum).map(([value, { text }]) => (
                <Option key={value} value={value}>
                  {text}
                </Option>
              ))}
          </Select>
        </Form.Item>
      )
    case 'date':
      return (
        <Form.Item name={dataIndex} label={title} {...formItemProps}>
          <DatePicker style={{ width: '100%' }} placeholder={`请选择${title}`} />
        </Form.Item>
      )
    case 'dateRange':
      return (
        <Form.Item name={dataIndex} label={title} {...formItemProps}>
          <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
        </Form.Item>
      )
    case 'textarea':
      return (
        <Form.Item name={dataIndex} label={title} {...formItemProps}>
          <Input.TextArea placeholder={`请输入${title}`} />
        </Form.Item>
      )
    default:
      return (
        <Form.Item name={dataIndex} label={title} {...formItemProps}>
          <Input placeholder={`请输入${title}`} allowClear />
        </Form.Item>
      )
  }
}

// Main ProTable Component
function ProTable<RecordType extends object = any>({
  columns,
  request,
  dataSource,
  rowKey = 'id',
  pagination = { pageSize: 10 },
  loading: controlledLoading,
  search = true,
  dateFormatter = 'string',
  defaultData = [],
  headerTitle,
  toolBarRender,
  options = { reload: true, setting: true, density: true, fullScreen: true },
  tableClassName,
  tableStyle,
  scroll,
  toolbar,
  rowSelection,
  beforeSearchSubmit,
  defaultSize = 'middle',
  onSizeChange,
  onLoad,
  onLoadingChange,
  columnsStateKey,
  exportFileName
}: ProTableProps<RecordType>) {
  // State management
  const [data, setData] = useState<RecordType[]>(defaultData)
  const [searchValues, setSearchValues] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<boolean>(!!controlledLoading)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination:
      pagination === false
        ? undefined
        : {
            current: 1,
            pageSize: 10,
            ...(pagination as TablePaginationConfig)
          },
    filters: {}
  })
  const [form] = Form.useForm()
  const [size, setSize] = useState<SizeType>(defaultSize)
  const [columnsState, setColumnsState] = useState<ProTableColumn<RecordType>[]>(
    columns.map(column => ({ ...column }))
  )
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [searchCollapsed, setSearchCollapsed] = useState<boolean>(
    typeof search === 'object' && search.defaultCollapsed !== undefined 
      ? search.defaultCollapsed 
      : true
  )

  // Effect to load column widths from localStorage if columnsStateKey is provided
  useEffect(() => {
    if (columnsStateKey) {
      try {
        const savedState = localStorage.getItem(`pro_table_columns_${columnsStateKey}`)
        if (savedState) {
          const parsedState = JSON.parse(savedState)
          setColumnWidths(parsedState.widths || {})
          
          // Update columns with saved visibility state
          if (parsedState.visibility) {
            const newColumns = columns.map(col => ({
              ...col,
              hideInTable: parsedState.visibility[col.dataIndex] === false
            }))
            setColumnsState(newColumns)
          }
          
          // Restore size
          if (parsedState.size) {
            setSize(parsedState.size)
            if (onSizeChange) {
              onSizeChange(parsedState.size)
            }
          }
        }
      } catch (e) {
        console.error('Failed to load column state from localStorage:', e)
      }
    }
  }, [columnsStateKey])
  
  // Save column state to localStorage
  const saveColumnState = () => {
    if (columnsStateKey) {
      try {
        // Create visibility state object
        const visibilityState: Record<string, boolean> = {}
        columnsState.forEach(col => {
          visibilityState[col.dataIndex] = !col.hideInTable
        })
        
        const stateToSave = {
          widths: columnWidths,
          visibility: visibilityState,
          size
        }
        
        localStorage.setItem(`pro_table_columns_${columnsStateKey}`, JSON.stringify(stateToSave))
      } catch (e) {
        console.error('Failed to save column state to localStorage:', e)
      }
    }
  }
  
  // Save state when columns or size changes
  useEffect(() => {
    saveColumnState()
  }, [columnsState, columnWidths, size])

  // Effect to fetch data on params change
  useEffect(() => {
    fetchData()
  }, [JSON.stringify(tableParams), JSON.stringify(searchValues)])

  // Effect to handle controlled loading prop
  useEffect(() => {
    if (controlledLoading !== undefined) {
      setLoading(controlledLoading)
    }
  }, [controlledLoading])

  // Control data source from props
  useEffect(() => {
    if (dataSource) {
      setData(dataSource)
      setTableParams(prev => ({
        ...prev,
        pagination:
          pagination === false
            ? undefined
            : {
                ...prev.pagination,
                total: dataSource.length
              }
      }))
    }
  }, [dataSource])

  // Function to fetch data
  const fetchData = async () => {
    if (!request && !dataSource) return

    if (onLoadingChange) {
      onLoadingChange(true)
    }
    setLoading(true)

    try {
      // If request function is provided, use it to fetch data
      if (request) {
        const params = {
          current: tableParams.pagination?.current,
          pageSize: tableParams.pagination?.pageSize,
          ...searchValues,
          ...(tableParams.sortField && tableParams.sortOrder
            ? {
                sortField: tableParams.sortField,
                sortOrder: tableParams.sortOrder
              }
            : {}),
          ...(tableParams.filters || {})
        }

        // Apply beforeSearchSubmit if provided
        const processedParams = beforeSearchSubmit ? beforeSearchSubmit(params) : params

        const result = await request(processedParams)

        if (result.success) {
          setData(result.data)
          setTableParams({
            ...tableParams,
            pagination:
              pagination === false
                ? undefined
                : {
                    ...tableParams.pagination,
                    total: result.total || result.data.length
                  }
          })

          if (onLoad) {
            onLoad(result.data)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
      if (onLoadingChange) {
        onLoadingChange(false)
      }
    }
  }

  // Handle table changes
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: any
  ) => {
    const sorterResult = Array.isArray(sorter) ? sorter[0] : sorter
    setTableParams({
      pagination,
      filters: filters as Record<string, FilterValue>,
      sortField: sorterResult.field as string,
      sortOrder: sorterResult.order as string
    })
  }

  // Handle search form submission
  const handleSearch = (values: Record<string, any>) => {
    // Format date values if needed
    const formattedValues = { ...values }

    if (dateFormatter !== false) {
      Object.keys(values).forEach(key => {
        const column = columns.find(col => col.dataIndex === key)
        if (column?.valueType === 'date' && values[key]) {
          formattedValues[key] =
            dateFormatter === 'string' ? values[key].format('YYYY-MM-DD') : values[key].valueOf()
        } else if (column?.valueType === 'dateRange' && values[key]) {
          const [start, end] = values[key]
          if (dateFormatter === 'string') {
            formattedValues[`${key}Start`] = start?.format('YYYY-MM-DD')
            formattedValues[`${key}End`] = end?.format('YYYY-MM-DD')
          } else {
            formattedValues[`${key}Start`] = start?.valueOf()
            formattedValues[`${key}End`] = end?.valueOf()
          }
          delete formattedValues[key]
        }
      })
    }

    // Reset pagination to first page
    setTableParams({
      ...tableParams,
      pagination:
        pagination === false
          ? undefined
          : {
              ...tableParams.pagination,
              current: 1
            }
    })

    setSearchValues(formattedValues)
  }

  // Handle form reset
  const handleReset = () => {
    form.resetFields()
    setSearchValues({})
    setTableParams({
      ...tableParams,
      filters: {},
      sortField: undefined,
      sortOrder: undefined,
      pagination:
        pagination === false
          ? undefined
          : {
              ...tableParams.pagination,
              current: 1
            }
    })
  }

  // Handle reload
  const handleReload = () => {
    fetchData()
  }

  // Handle table size change
  const handleSizeChange = (s: SizeType) => {
    setSize(s)
    if (onSizeChange) {
      onSizeChange(s)
    }
  }

  // Export data function
  const handleExportData = () => {
    const header = columnsState.filter(column => !column.hideInTable).map(column => column.title)

    const dataRows = data.map(record => {
      return columnsState
        .filter(column => !column.hideInTable)
        .map(column => {
          const key = column.dataIndex
          const value = (record as any)[key]

          // Handle different value types
          if (column.valueEnum && value !== undefined) {
            return column.valueEnum[value]?.text || value
          }

          return value
        })
    })

    // Convert to CSV
    const csvContent = [header.join(','), ...dataRows.map(row => row.join(','))].join('\n')

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const fileName = exportFileName || `exported_data_${new Date().getTime()}.csv`
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else if (containerRef.current) {
      containerRef.current.requestFullscreen()
    }
  }

  // Move column function for drag and drop
  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    const dragColumn = columnsState[dragIndex]
    const newColumns = [...columnsState]
    newColumns.splice(dragIndex, 1)
    newColumns.splice(hoverIndex, 0, dragColumn)
    setColumnsState(newColumns) 
  }

  // Handle resize column
  const handleResize = (index: number) => (e: React.SyntheticEvent<Element>, { size }: { size: { width: number } }) => {
    const newColumns = [...columnsState]
    newColumns[index] = {
      ...newColumns[index],
      width: size.width
    }
    setColumnsState(newColumns)
    
    // Save column width in state
    setColumnWidths({
      ...columnWidths,
      [newColumns[index].dataIndex]: size.width
    })
  }

  // Transform ProTableColumn to antd Table ColumnsType
  const getProcessedColumns = (): ColumnsType<RecordType> => {
    return columnsState
      .filter(column => !column.hideInTable)
      .map((column, index) => {
        const {
          dataIndex,
          title,
          valueType,
          valueEnum,
          render,
          copyable,
          ellipsis,
          width,
          ...restColumnProps
        } = column

        // Handle render based on valueType and valueEnum
        let finalRender = render
        if (!finalRender && valueEnum) {
          finalRender = value => {
            const item = valueEnum[value]
            if (item) {
              return <Tag color={item.status}>{item.text}</Tag>
            }
            return value
          }
        }

        // Handle copy and ellipsis
        if (copyable || ellipsis) {
          const originRender = finalRender
          finalRender = (text, record, idx) => {
            const dom = originRender ? originRender(text, record, idx) : text

            return (
              <Typography.Text copyable={copyable} ellipsis={ellipsis ? { tooltip: dom } : false}>
                {dom}
              </Typography.Text>
            )
          }
        }

        // Use saved width or original width
        const finalWidth = columnWidths[dataIndex] || width

        return {
          dataIndex,
          title: <DragableTitle index={index} moveColumn={moveColumn} title={title} />,
          width: finalWidth,
          onHeaderCell: (column: any) => ({
            width: finalWidth,
            onResize: handleResize(index) as any,
          }),
          ...restColumnProps,
          render: finalRender
        }
      })
  }

  // Render search form
  const renderSearchForm = () => {
    if (!search) return null

    const searchColumns = columns.filter(column => !column.hideInSearch)
    if (searchColumns.length === 0) return null

    // Determine layout
    const layout = typeof search === 'object' && search.layout ? search.layout : 'horizontal'
    
    // 默认显示的搜索项数量
    const defaultColsNumber = 
      typeof search === 'object' && search.defaultColsNumber 
        ? search.defaultColsNumber 
        : 3
    
    // 根据折叠状态决定显示的列
    const showColumns = searchCollapsed 
      ? searchColumns.slice(0, defaultColsNumber)
      : searchColumns
    
    // 是否显示展开/收起按钮
    const showExpand = searchColumns.length > defaultColsNumber

    return (
      <Card className='mb-4' bordered={false}>
        <Form
          form={form}
          onFinish={handleSearch}
          layout={layout === 'horizontal' ? 'inline' : layout}
        >
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            {showColumns.map(column => {
              const { dataIndex, title, valueType, valueEnum, formItemProps, renderFormItem } =
                column

              return (
                <Col
                  key={dataIndex}
                  xs={24}
                  sm={layout === 'vertical' ? 24 : 12}
                  md={layout === 'vertical' ? 12 : 8}
                  lg={layout === 'vertical' ? 8 : 6}
                >
                  {renderFormItem
                    ? renderFormItem(column, {
                        type: valueType,
                        defaultRender: () =>
                          getFormItemByValueType(
                            valueType,
                            dataIndex,
                            title,
                            valueEnum,
                            formItemProps
                          )
                      })
                    : getFormItemByValueType(valueType, dataIndex, title, valueEnum, formItemProps)}
                </Col>
              )
            })}

            <Col xs={24} className='flex justify-end items-center'>
              <div style={{ marginLeft: 'auto' }}>
                <Space size="middle">
                  <Button type='primary' htmlType='submit' icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button onClick={handleReset}>重置</Button>
                  {showExpand && (
                    <a 
                      onClick={() => setSearchCollapsed(!searchCollapsed)}
                      style={{ fontSize: '12px' }}
                    >
                      {searchCollapsed ? '展开' : '收起'} 
                      {searchCollapsed ? 
                        <DownOutlined style={{ marginLeft: 4 }} /> : 
                        <UpOutlined style={{ marginLeft: 4 }} />
                      }
                    </a>
                  )}
                </Space>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  // Render toolbar
  const renderToolbar = () => {
    if (!headerTitle && !toolbar && !toolBarRender && options === false) {
      return null
    }

    const toolBarActions = {
      reload: handleReload,
      exportData: handleExportData
    }

    return (
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center'>
          {headerTitle && (
            <Title level={4} className='m-0 mr-4'>
              {headerTitle}
            </Title>
          )}
          {toolbar}
        </div>

        <div className='flex items-center'>
          <Space size="middle" align="end">
            {toolBarRender && toolBarRender(toolBarActions)}

            {options !== false && (
              <Space>
                {options.reload !== false && (
                  <Tooltip title='刷新'>
                    <Button icon={<ReloadOutlined />} onClick={handleReload} />
                  </Tooltip>
                )}

                {options.density !== false && (
                  <Dropdown
                    overlay={
                      <Menu
                        selectedKeys={[size]}
                        onClick={({ key }) => handleSizeChange(key as SizeType)}
                      >
                        <Menu.Item key='large'>默认</Menu.Item>
                        <Menu.Item key='middle'>中等</Menu.Item>
                        <Menu.Item key='small'>紧凑</Menu.Item>
                      </Menu>
                    }
                  >
                    <Button>
                      <ColumnHeightOutlined />
                    </Button>
                  </Dropdown>
                )}

                {options.setting !== false && (
                  <Popover
                    content={
                      <div style={{ minWidth: 200 }}>
                        <div className='mb-2 font-medium'>列展示</div>
                        <div>
                          {columns.map(column => (
                            <div key={column.dataIndex} className='py-1'>
                              <Space>
                                <Form.Item valuePropName='checked' style={{ marginBottom: 0 }}>
                                  <input
                                    type='checkbox'
                                    checked={
                                      !columnsState.find(c => c.dataIndex === column.dataIndex)
                                        ?.hideInTable
                                    }
                                    onChange={e => {
                                      const newColumns = columnsState.map(c => {
                                        if (c.dataIndex === column.dataIndex) {
                                          return { ...c, hideInTable: !e.target.checked }
                                        }
                                        return c
                                      })
                                      setColumnsState(newColumns)
                                    }}
                                  />
                                </Form.Item>
                                <span>{column.title}</span>
                              </Space>
                            </div>
                          ))}
                        </div>
                      </div>
                    }
                    trigger='click'
                    placement='bottomRight'
                  >
                    <Button>
                      <SettingOutlined />
                    </Button>
                  </Popover>
                )}

                {options.fullScreen !== false && (
                  <Tooltip title={isFullScreen ? '退出全屏' : '全屏'}>
                    <Button icon={<FullscreenOutlined />} onClick={toggleFullScreen} />
                  </Tooltip>
                )}
              </Space>
            )}
          </Space>
        </div>
      </div>
    )
  }

  // Main render
  return (
    <DndProvider backend={HTML5Backend}>
      <div
        ref={containerRef}
        className={`pro-table ${isFullScreen ? 'fixed inset-0 z-50 bg-white p-4 overflow-auto' : ''}`}
        style={{
          ...(isFullScreen ? {
            backgroundColor: '#fff',
            padding: '16px',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
            width: '100vw',
            height: '100vh',
            overflow: 'auto',
          } : {}),
        }}
      >
        {renderSearchForm()}
        {renderToolbar()}

        <Table
          columns={getProcessedColumns()}
          dataSource={data}
          rowKey={rowKey}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
          size={size}
          className={tableClassName}
          style={tableStyle}
          scroll={scroll}
          rowSelection={rowSelection}
          components={{
            header: {
              cell: ResizableTitle
            }
          }}
        />
      </div>
    </DndProvider>
  )
}

export default ProTable
