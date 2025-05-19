# MarkdownEditor 组件

## 功能
- Markdown 编辑与实时预览
- 支持阿里云 OSS 图片上传并回显
- 支持 Markdown 文件导入与导出
- 美观的 UI

## 使用方法

1. 安装依赖：
   - `react-markdown`
   - `ali-oss`

2. 引入组件：

```tsx
import MarkdownEditor from '@/components/MarkdownEditor';

<MarkdownEditor ossConfig={{
  region: 'your-region',
  accessKeyId: 'your-accessKeyId',
  accessKeySecret: 'your-accessKeySecret',
  bucket: 'your-bucket',
}} />
```

## 注意事项
- 需配置阿里云 OSS 权限
- 建议使用环境变量管理密钥 