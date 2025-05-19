import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import OSS from 'ali-oss';
import './MarkdownEditor.css';

interface MarkdownEditorProps {
  ossConfig: {
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    bucket: string;
    [key: string]: any;
  };
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ ossConfig }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 初始化 OSS 客户端
  const client = new OSS({
    ...ossConfig,
  });

  // Markdown 操作栏按钮配置
  const toolbarButtons = [
    { label: 'H1', action: () => insertAtCursor('# ', '', '标题') },
    { label: 'H2', action: () => insertAtCursor('## ', '', '标题') },
    { label: 'H3', action: () => insertAtCursor('### ', '', '标题') },
    { label: '加粗', action: () => wrapSelection('**', '**', '加粗文本') },
    { label: '斜体', action: () => wrapSelection('*', '*', '斜体文本') },
    { label: '删除线', action: () => wrapSelection('~~', '~~', '删除线') },
    { label: '引用', action: () => insertAtCursor('> ', '', '引用内容') },
    { label: '代码块', action: () => insertAtCursor('```\n', '\n```', '代码内容') },
    { label: '无序列表', action: () => insertAtCursor('- ', '', '列表项') },
    { label: '有序列表', action: () => insertAtCursor('1. ', '', '列表项') },
    { label: '分割线', action: () => insertAtCursor('\n---\n', '', '') },
    { label: '链接', action: () => insertAtCursor('[', '](url)', '链接文本') },
    { label: '图片', action: () => insertAtCursor('![](', ')', '图片地址') },
  ];

  // 上传图片到 OSS
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `images/${Date.now()}-${file.name}`;
      const result = await client.put(fileName, file);
      const imageUrl = result.url;
      setMarkdown((prev) => prev + `\n![](${imageUrl})\n`);
    } catch (err) {
      alert('图片上传失败');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 导入 Markdown 文件
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setMarkdown(event.target?.result as string);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 导出 Markdown 文件
  const handleExport = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 在光标处插入文本
  const insertAtCursor = (before: string, after: string, placeholder: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || placeholder;
    const newValue =
      textarea.value.substring(0, start) +
      before +
      selected +
      after +
      textarea.value.substring(end);
    setMarkdown(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selected.length;
    }, 0);
  };

  // 包裹选中文本
  const wrapSelection = (before: string, after: string, placeholder: string) => {
    insertAtCursor(before, after, placeholder);
  };

  return (
    <div className="markdown-editor-container">
      <div className="markdown-toolbar">
        <button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? '上传中...' : '上传图片'}
        </button>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <label className="import-label">
          导入
          <input
            type="file"
            accept=".md"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </label>
        <button onClick={handleExport}>导出</button>
      </div>
      <div className="markdown-main">
        <textarea
          className="markdown-textarea"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="请输入 Markdown 内容..."
          ref={textareaRef}
        />
        <div className="markdown-preview">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor; 