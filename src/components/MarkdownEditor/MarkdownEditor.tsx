import React, { useState, useEffect, useRef } from 'react'
import {
  Row,
  Col,
  Input,
  Button,
  Upload,
  message,
  Layout,
  Spin,
  Tooltip,
  Dropdown,
  Menu,
  Modal,
  Space,
  Divider,
  theme
} from 'antd'
import {
  UploadOutlined,
  DownloadOutlined,
  PictureOutlined,
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  CodeOutlined,
  FileTextOutlined,
  LinkOutlined,
  BlockOutlined,
  DownOutlined
} from '@ant-design/icons'
import { marked } from 'marked'
import OSS from 'ali-oss'
import type { UploadProps } from 'antd/es/upload/interface'
import type { InputRef } from 'antd'
import type { MenuProps } from 'antd' // 确保 MenuProps 已导入

const { TextArea } = Input
const { Header, Content } = Layout // Sider 不需要

// --- OSS 配置 (保持不变) ---
interface OssConfig {
  /* ... */
}
const ossConfig: OssConfig = {
  region: 'oss-cn-hangzhou',
  accessKeyId: 'LTAI5t7mMtUt1hZgxSgGo51F',
  accessKeySecret: 'KxgMGLVxWggw8QbGonT2kPwxx6wIH8',
  bucket: 'ly-hz-blog-oss',
  secure: true // 推荐使用 HTTPS
  // endpoint: 'your-custom-endpoint.com' // 如果使用了自定义域名或 CDN
}
let client: OSS | null = ossConfig ? new OSS(ossConfig) : null
try {
  /* ... */
} catch (error) {
  /* ... */
}
// --- 结束 OSS 配置 ---

interface MarkdownEditorProps {
  initialValue?: string
  onSave?: (markdown: string) => void
}

interface Template {
  key: string
  label: string
  content: string
}

const predefinedTemplates: Template[] = [
  {
    key: 'basic-report',
    label: '基本报告模板',
    content: `# 报告标题\n\n## 简介\n\n在此处填写报告简介...\n\n## 主要内容\n\n- 要点 1\n- 要点 2\n\n## 结论\n\n在此处填写结论...`
  },
  {
    key: 'meeting-notes',
    label: '会议纪要模板',
    content: `# 会议纪要 - [会议日期]\n\n**参会人员:** \n\n**议题:**\n\n1.  议题 A\n    - 讨论点\n    - 决定\n2.  议题 B\n\n**待办事项:**\n\n- [ ] 任务1 - @负责人`
  },
  {
    key: 'empty',
    label: '清空内容',
    content: ''
  }
]

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ initialValue = '', onSave }) => {
  const [markdownText, setMarkdownText] = useState<string>(initialValue)
  const [htmlPreview, setHtmlPreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const textAreaRef = useRef<InputRef>(null)
  const { token } = theme.useToken()

  useEffect(() => {
    const generatePreview = async () => {
      if (typeof marked === 'function') {
        marked.setOptions({
          renderer: new marked.Renderer(),
          gfm: true,
          breaks: true,
          pedantic: false
        })
        const rawMarkup = await marked.parse(markdownText)
        setHtmlPreview(rawMarkup)
      }
    }
    generatePreview()
  }, [markdownText])

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value)
  }

  const handleImport: UploadProps['beforeUpload'] = file => {
    const reader = new FileReader()
    reader.onload = e => {
      const content = e.target?.result as string
      setMarkdownText(content)
      message.success(`${file.name} 导入成功!`)
    }
    reader.readAsText(file)
    return false
  }

  const handleExport = () => {
    if (!markdownText.trim()) {
      message.warning('内容为空，无法导出。')
      return
    }
    const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `markdown_export_${Date.now()}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    message.success('导出成功!')
  }

  const handleImageUpload: UploadProps['customRequest'] = async options => {
    const { file, onSuccess, onError } = options
    if (!client) {
      message.error('OSS Client 未初始化，无法上传图片。请检查配置。')
      onError?.(new Error('OSS Client not initialized'))
      return
    }
    setIsUploading(true)
    try {
      const fileName = `blog-images/${Date.now()}-${(file as File).name}`
      const result = await client.put(fileName, file)
      if (result.res.status === 200 && result.url) {
        let imageUrl = result.url
        const imageMarkdown = `![${(file as File).name}](${imageUrl})`
        insertTextAtCursor(imageMarkdown)
        message.success(`${(file as File).name} 上传成功!`)
        onSuccess?.(result)
      } else {
        throw new Error('Upload failed with status: ' + result.res.status)
      }
    } catch (error: any) {
      console.error('上传失败:', error)
      message.error(`${(file as File).name} 上传失败: ${error.message || '未知错误'}`)
      onError?.(error)
    } finally {
      setIsUploading(false)
    }
  }

  const uploadProps: UploadProps = {
    name: 'file',
    customRequest: handleImageUpload,
    showUploadList: false,
    beforeUpload: file => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      if (!isJpgOrPng) message.error('只能上传 JPG/PNG/GIF 格式的图片!')
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) message.error('图片大小不能超过 5MB!')
      if (!client) {
        message.error('OSS Client 未初始化，无法上传。')
        return Upload.LIST_IGNORE
      }
      return isJpgOrPng && isLt2M ? true : Upload.LIST_IGNORE
    }
  }

  const getTextArea = (): HTMLTextAreaElement | null => {
    return textAreaRef.current?.resizableTextArea?.textArea || null
  }

  const modifyText = (
    getNewTextAndSelection: (
      currentText: string,
      start: number,
      end: number
    ) => { text: string; newStart: number; newEnd: number }
  ) => {
    const textArea = getTextArea()
    if (!textArea) return

    const { value, selectionStart, selectionEnd } = textArea
    const {
      text: newText,
      newStart,
      newEnd
    } = getNewTextAndSelection(value, selectionStart, selectionEnd)

    setMarkdownText(newText)

    // 确保在 React 重新渲染完成后更新光标
    setTimeout(() => {
      const freshTextArea = getTextArea() // 重新获取 DOM 元素
      if (freshTextArea) {
        freshTextArea.focus()
        freshTextArea.setSelectionRange(newStart, newEnd)
      }
    }, 0)
  }

  const insertTextAtCursor = (textToInsert: string, selectInserted = false) => {
    modifyText((currentText, start, end) => {
      const newText = currentText.substring(0, start) + textToInsert + currentText.substring(end)
      const newCursorPos = start + textToInsert.length
      return {
        text: newText,
        newStart: selectInserted ? start : newCursorPos,
        newEnd: newCursorPos
      }
    })
  }
  const wrapSelection = (prefix: string, suffix: string = prefix, placeholder: string = '') => {
    modifyText((currentText, start, end) => {
      const selectedText = currentText.substring(start, end)
      let newText
      let newStart
      let newEnd

      if (selectedText) {
        newText =
          currentText.substring(0, start) +
          prefix +
          selectedText +
          suffix +
          currentText.substring(end)
        newStart = start + prefix.length
        newEnd = newStart + selectedText.length
      } else {
        const textToInsert = prefix + placeholder + suffix
        newText = currentText.substring(0, start) + textToInsert + currentText.substring(end)
        newStart = start + prefix.length
        newEnd = newStart + placeholder.length // 选中占位符
      }
      return { text: newText, newStart, newEnd }
    })
  }

  const applyLinePrefix = (prefix: string) => {
    modifyText((currentText, start, end) => {
      let lineStartIndex = currentText.lastIndexOf('\n', start - 1) + 1
      // 修正：如果光标在行首且前一行是空行，lastIndexOf 可能返回错误。
      // 但对于行前缀操作，通常我们关心的是光标所在逻辑行的开始。
      if (start > 0 && currentText[start - 1] === '\n' && start === lineStartIndex) {
        // 如果光标恰好在一个新行的开始
      }

      // 确定操作范围：从选区开始行到选区结束行
      let selectionEndLineActualEnd = currentText.indexOf('\n', end)
      if (selectionEndLineActualEnd === -1) {
        selectionEndLineActualEnd = currentText.length
      } else {
        // 如果选区末尾正好是换行符，我们通常希望包含这一行，所以 index + 1
        selectionEndLineActualEnd = currentText.indexOf('\n', end - 1) // 如果end是换行符，往前找
        if (selectionEndLineActualEnd === -1 || selectionEndLineActualEnd < lineStartIndex) {
          selectionEndLineActualEnd = currentText.length
        } else {
          selectionEndLineActualEnd = currentText.indexOf('\n', end)
          if (selectionEndLineActualEnd === -1) selectionEndLineActualEnd = currentText.length
        }
      }

      const textBeforeSelection = currentText.substring(0, lineStartIndex)
      const linesTextToProcess = currentText.substring(lineStartIndex, selectionEndLineActualEnd)
      const textAfterSelection = currentText.substring(selectionEndLineActualEnd)

      const lines = linesTextToProcess.split('\n')
      const transformedLines = lines.map(line => {
        let currentLineContent = line
        // 移除已有的类似标记，避免重复
        if (prefix.startsWith('#')) {
          // 标题
          currentLineContent = currentLineContent.replace(/^#+\s*/, '')
        } else if (prefix === '- ' || prefix.match(/^\d+\.\s+/)) {
          // 列表
          currentLineContent = currentLineContent.replace(/^(- |\d+\.\s+)/, '')
        } else if (prefix === '> ') {
          // 引用
          currentLineContent = currentLineContent.replace(/^>+\s*/, '')
        }
        // 如果行为空或者只有空白符，并且不是列表项（列表项可以只有前缀），则不加前缀
        if (currentLineContent.trim() === '' && !(prefix === '- ' || prefix.match(/^\d+\.\s+/))) {
          return line // 返回原始行（可能是空行）
        }
        return prefix + currentLineContent
      })

      const newLinesText = transformedLines.join('\n')
      const newText = textBeforeSelection + newLinesText + textAfterSelection

      // 粗略计算光标位置：放在修改区域的末尾
      const newCursorPos = textBeforeSelection.length + newLinesText.length
      return { text: newText, newStart: newCursorPos, newEnd: newCursorPos }
    })
  }

  const handleBold = () => wrapSelection('**', '**', '加粗文字')
  const handleItalic = () => wrapSelection('*', '*', '斜体文字')
  const handleStrikethrough = () => wrapSelection('~~', '~~', '删除线文字')
  const handleInlineCode = () => wrapSelection('`', '`', '代码') // <--- 修复点：确保调用 wrapSelection

  const handleHeading = (level: HeadingLevel) => {
    applyLinePrefix('#'.repeat(level) + ' ')
  }
  const handleUnorderedList = () => applyLinePrefix('- ')
  const handleOrderedList = () => {
    applyLinePrefix('1. ')
  }
  const handleBlockquote = () => applyLinePrefix('> ')

  const handleCodeBlock = () => {
    // <--- 修复点：实现代码块逻辑
    modifyText((currentText, start, end) => {
      const selectedText = currentText.substring(start, end)
      const placeholderLanguage = 'language'
      let textToInsert
      let newStart
      let newEnd
      let newText
      if (selectedText) {
        textToInsert = `\n\`\`\`\n${selectedText}\n\`\`\`\n` // 在选中文本前后加空行和```
        newText = currentText.substring(0, start) + textToInsert + currentText.substring(end)
        newStart = start + textToInsert.indexOf(selectedText) // 光标在选中文本开始
        newEnd = newStart + selectedText.length
      } else {
        // 确保代码块前后有换行符，除非它在文档的开头或结尾
        const prefixNewline = start === 0 || currentText[start - 1] === '\n' ? '' : '\n'
        const suffixNewline = end === currentText.length || currentText[end] === '\n' ? '' : '\n'
        textToInsert = `${prefixNewline}\`\`\`${placeholderLanguage}\n\n\`\`\`${suffixNewline}`
        newText = currentText.substring(0, start) + textToInsert + currentText.substring(end)
        newStart = start + prefixNewline.length + 3 // 光标在 ```language 之后
        newEnd = newStart + placeholderLanguage.length // 选中 placeholderLanguage
      }
      return { text: newText, newStart, newEnd }
    })
  }

  const handleInsertLink = () => {
    const linkTextInputId = `linkText-${Date.now()}`
    const linkUrlInputId = `linkUrl-${Date.now()}`
    Modal.confirm({
      title: '插入链接',
      icon: <LinkOutlined />,
      content: (
        <Space direction='vertical' style={{ width: '100%' }}>
          {' '}
          <Input id={linkTextInputId} placeholder='链接文本 (可选)' />{' '}
          <Input id={linkUrlInputId} placeholder='链接 URL (例如 https://example.com)' />{' '}
        </Space>
      ),
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const textEl = document.getElementById(linkTextInputId) as HTMLInputElement
        const urlEl = document.getElementById(linkUrlInputId) as HTMLInputElement
        const text = textEl?.value || '链接' // 如果没输入文本，默认为 "链接"
        const url = urlEl?.value
        if (url) {
          insertTextAtCursor(`[${text}](${url})`)
        } else {
          message.error('URL 不能为空')
          return Promise.reject()
        }
      }
    })
  }

  const handleTemplateSelect = (info: { key: any }) => {
    // 使用 MenuInfo 类型
    const key = info.key
    const selectedTemplate = predefinedTemplates.find(t => t.key === key)
    if (selectedTemplate) {
      if (markdownText.trim() && selectedTemplate.content !== markdownText) {
        Modal.confirm({
          title: '应用模板',
          content: '当前编辑器有内容，应用模板将会覆盖现有内容。确定吗？',
          okText: '确定覆盖',
          cancelText: '取消',
          onOk: () => {
            setMarkdownText(selectedTemplate.content)
            message.success(`已应用模板: ${selectedTemplate.label}`)
          }
        })
      } else {
        setMarkdownText(selectedTemplate.content)
        if (selectedTemplate.label !== '清空内容' || markdownText.trim() !== '') {
          message.success(`已应用模板: ${selectedTemplate.label}`)
        }
      }
    }
  }

  const templateMenuItems: MenuProps['items'] = predefinedTemplates.map(template => ({
    key: template.key,
    label: template.label
  }))

  const toolbarItems = [
    { key: 'bold', label: '加粗', icon: <BoldOutlined />, action: handleBold },
    { key: 'italic', label: '斜体', icon: <ItalicOutlined />, action: handleItalic },
    {
      key: 'strike',
      label: '删除线',
      icon: <StrikethroughOutlined />,
      action: handleStrikethrough
    },
    { type: 'divider' as const },
    { key: 'h1', label: 'H1', iconContent: 'H1', action: () => handleHeading(1) },
    { key: 'h2', label: 'H2', iconContent: 'H2', action: () => handleHeading(2) },
    { key: 'h3', label: 'H3', iconContent: 'H3', action: () => handleHeading(3) },
    { type: 'divider' as const },
    { key: 'ul', label: '无序列表', icon: <UnorderedListOutlined />, action: handleUnorderedList },
    { key: 'ol', label: '有序列表', icon: <OrderedListOutlined />, action: handleOrderedList },
    { key: 'quote', label: '引用', icon: <BlockOutlined />, action: handleBlockquote },
    { type: 'divider' as const },
    { key: 'code', label: '行内代码', icon: <CodeOutlined />, action: handleInlineCode }, // 确保 action 正确
    { key: 'codeblock', label: '代码块', icon: <FileTextOutlined />, action: handleCodeBlock }, // 确保 action 正确
    { key: 'link', label: '链接', icon: <LinkOutlined />, action: handleInsertLink },
    {
      key: 'image',
      label: '图片',
      iconComponent: (
        <Upload {...uploadProps} disabled={isUploading || !client}>
          <Tooltip title='上传图片 (OSS)'>
            <Button
              type='text'
              icon={<PictureOutlined />}
              loading={isUploading}
              disabled={!client || isUploading}
              size='small'
              style={{ padding: '0 4px', color: token.colorTextSecondary }}
              className='toolbar-button'
            />
          </Tooltip>
        </Upload>
      ),
      action: () => {} // 空函数，因为 Upload 自己处理
    }
  ]

  return (
    <Layout
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: token.colorBgLayout
      }}
    >
      <Header
        style={{
          background: token.colorBgContainer,
          padding: `0 ${token.paddingLG}px`,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          height: '64px'
        }}
      >
        <h2 style={{ margin: 0, fontSize: token.fontSizeLG, color: token.colorTextHeading }}>
          Markdown 编辑器
        </h2>
        <Space size='middle'>
          <Dropdown
            menu={{ items: templateMenuItems, onClick: handleTemplateSelect }}
            placement='bottomRight'
          >
            <Button icon={<FileTextOutlined />}>
              {' '}
              使用模板 <DownOutlined />{' '}
            </Button>
          </Dropdown>
          <Upload beforeUpload={handleImport} showUploadList={false} accept='.md,text/markdown'>
            <Button icon={<UploadOutlined />}>导入</Button>
          </Upload>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出
          </Button>
          {onSave && (
            <Button type='primary' onClick={() => onSave(markdownText)}>
              保存
            </Button>
          )}
        </Space>
      </Header>

      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'hidden',
          padding: `${token.paddingSM}px ${token.paddingMD}px`
        }}
      >
        <div /* Toolbar */
          className='editor-toolbar'
          style={{
            padding: `${token.paddingXS}px ${token.paddingSM}px`,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            background: token.colorBgContainer,
            marginBottom: token.marginSM,
            flexShrink: 0,
            zIndex: 1,
            boxShadow: token.boxShadowTertiary
          }}
        >
          <Space wrap size='small'>
            {toolbarItems.map((item, index) => {
              if (item.type === 'divider') {
                return (
                  <Divider
                    type='vertical'
                    key={`divider-${index}`}
                    style={{ margin: `0 ${token.marginXS}px`, borderColor: token.colorSplit }}
                  />
                )
              }
              if (item.iconComponent) {
                // 对于像图片上传这样直接是组件的工具项
                return <React.Fragment key={item.key}>{item.iconComponent}</React.Fragment>
              }
              // 对于其他按钮，确保 action 存在且是函数
              if (typeof item.action !== 'function') {
                console.warn(`Toolbar item "${item.label || item.key}" has no valid action.`)
                return null // 或者渲染一个禁用的按钮
              }
              return (
                <Tooltip title={item.label} key={item.key} mouseEnterDelay={0.5}>
                  <Button
                    type='text'
                    icon={item.icon}
                    onClick={item.action}
                    size='small'
                    aria-label={item.label}
                    style={{
                      padding: item.iconContent
                        ? `0 ${token.paddingXS}px`
                        : `0 ${token.paddingXXS}px`,
                      minWidth: item.iconContent ? 'auto' : '28px',
                      height: '28px',
                      color: token.colorTextSecondary,
                      fontSize: item.iconContent ? token.fontSizeSM : token.fontSizeLG,
                      fontWeight: item.iconContent ? 'bold' : 'normal'
                    }}
                    className='toolbar-button'
                  >
                    {item.iconContent ? item.iconContent : null}
                  </Button>
                </Tooltip>
              )
            })}
          </Space>
        </div>

        <Row /* 编辑区和预览区容器 */
          gutter={token.marginSM}
          style={{ flexGrow: 1, overflow: 'hidden' }}
        >
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              backgroundColor: token.colorBgContainer,
              overflow: 'hidden'
            }}
          >
            <TextArea
              ref={textAreaRef}
              value={markdownText}
              onChange={handleMarkdownChange}
              placeholder='在此输入 Markdown 内容...'
              style={{
                flexGrow: 1,
                resize: 'none',
                fontFamily:
                  '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
                fontSize: token.fontSize,
                lineHeight: 1.65,
                border: 'none',
                padding: token.paddingMD,
                overflowY: 'auto',
                backgroundColor: 'transparent',
                color: token.colorText
              }}
            />
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              backgroundColor: token.colorBgContainer,
              overflow: 'hidden'
            }}
          >
            <div
              className='markdown-preview'
              style={{
                flexGrow: 1,
                overflowY: 'auto',
                padding: token.paddingMD,
                lineHeight: 1.7,
                color: token.colorText
              }}
              dangerouslySetInnerHTML={{ __html: htmlPreview }}
            />
          </Col>
        </Row>

        {isUploading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              background: 'rgba(255,255,255,0.7)',
              padding: '20px',
              borderRadius: token.borderRadiusLG
            }}
          >
            {' '}
            <Spin size='large' tip='图片上传中...' />{' '}
          </div>
        )}
      </Content>
    </Layout>
  )
}

export default MarkdownEditor
