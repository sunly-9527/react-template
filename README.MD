### 简介
react 项目模板, 以 webpack5 + react18 + typescript4.x + react-redux9.x + react-router6.x 相关技术栈构建

### 项目结构
- .husky: git 钩子配置文件
- .vscode: vscode 配置文件
- build: webpack 配置文件
- dist: 打包输出目录
- docs: md 文档
- env: 环境变量配置
- public: 静态资源
- servers: 服务端文件
- src: 源码
  - assets: 静态资源
  - components: 公共组件
  - pages: 页面
  - hooks: 自定义hook
  - stores: 状态管理
  - routers: 路由管理
  - services: 接口服务
  - utils: 工具函数
- typings: 类型定义
- .browserslistrc: 浏览器兼容配置文件
- .editorconfig: 编辑器配置文件
- .eslintrc.js: eslint 配置文件
- .eslintignore: eslint 忽略文件
- .markdownlint.js markdown 配置文件
- .markdownlintignore: markdownlint 忽略文件
- .prettierrc.js: 代码格式化配置
- .prettierrcignore: prettier 忽略文件
- .stylelintrc.js: stylelint 配置文件
- .stylelintignore: stylelint 忽略文件
- babel.config.js: babel 配置文件
- CHANGELOG.md: 更新日志
- .commitlintrc.js: commitlint 配置文件
- package.json: 项目配置文件
- package-lock.json: npm 依赖包版本锁定文件
- postcss.config.js: postcss 配置文件
- README.md: 项目说明文件
- tsconfig.json: ts 配置文件

### 脚本
- pnpm run dev 启动项目
- pnpm run build:[env] 打包项目
- pnpm run pre-check 检查项目
- pnpm run release 按规则自动升级版本号, 也能手动升级(release:major/minor/patch/alpha)
- git cz / npx git-cz 提交代码

### git 提交规范
采用 commitizen 规范, 使用 git cz / npx git-cz 来代替 git commit

- feat: 新功能（feature）
- fix: 修补bug
- docs: 文档（documentation）
- style: 格式（不影响代码运行的变动）
- refactor: 重构（即不是新增功能，也不是修改bug的代码变动）
- test: 增加测试
- chore: 构建过程或辅助工具的变动
- revert: 回滚到上一个版本

### 版本构成

版本号 major.minor.patch

主版本号(major)：做了不兼容的 API 修改
次版本号(minor)：做了向下兼容的功能性新增，可以理解为 Feature 版本
修订号(patch)：做了向下兼容的问题修正，可以理解为 Bug fix 版本

- alpha: 内部版本
- beta: 公测版本
- rc: 候选版本(Release candiate)

