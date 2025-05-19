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














<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>liuyuyang.net</groupId>
    <artifactId>ThriveX_Server</artifactId>
    <version>1.0-SNAPSHOT</version>

    <packaging>pom</packaging>

    <modules>
        <!-- 实体类 -->
        <module>model</module>
        <!-- 核心业务 -->
        <module>blog</module>
        <module>common</module>
    </modules>

    <parent>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-parent</artifactId>
      <version>2.7.12</version>
    </parent>

    <properties>
        <java.version>1.8</java.version>
        <spring-boot.version>2.7.12</spring-boot.version>
        <mybatis-plus.version>3.4.1</mybatis-plus.version>
        <mysql.version>8.0.23</mysql.version>
        <knife4j.version>4.4.0</knife4j.version>
        <jwt.version>0.7.0</jwt.version>
        <fastjson.version>1.2.29</fastjson.version>
        <jackson.version>2.13.3</jackson.version>
        <spring-beans.version>5.3.21</spring-beans.version>
        <rome.version>1.18.0</rome.version>
        <oshi.version>6.2.2</oshi.version>
        <qiniu.version>7.13.0</qiniu.version>
        <email.version>2.7.12</email.version>
    </properties>

    <!--配置dependencyManagement锁定依赖的版本-->
    <dependencyManagement>
        <dependencies>
            <!-- spring boot热重载 -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-devtools</artifactId>
                <version>${spring-boot.version}</version>
                <scope>runtime</scope>
            </dependency>

            <!-- 引入aop切面支持 -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-aop</artifactId>
                <version>${spring-boot.version}</version>
            </dependency>

            <!-- mybatis-plus 持久层 -->
            <dependency>
                <groupId>com.baomidou</groupId>
                <artifactId>mybatis-plus-boot-starter</artifactId>
                <version>${mybatis-plus.version}</version>
            </dependency>

            <!-- mysql -->
            <dependency>
                <groupId>mysql</groupId>
                <artifactId>mysql-connector-java</artifactId>
                <version>${mysql.version}</version>
            </dependency>

            <!-- redis -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-data-redis</artifactId>
            </dependency>

            <!-- 提供API文档生成和调试功能 -->
            <dependency>
                <groupId>com.github.xiaoymin</groupId>
                <artifactId>knife4j-openapi2-spring-boot-starter</artifactId>
                <version>${knife4j.version}</version>
            </dependency>

            <!-- jwt -->
            <dependency>
                <groupId>io.jsonwebtoken</groupId>
                <artifactId>jjwt</artifactId>
                <version>${jwt.version}</version>
            </dependency>

            <dependency>
                <groupId>com.fasterxml.jackson.core</groupId>
                <artifactId>jackson-databind</artifactId>
                <version>${jackson.version}</version>
            </dependency>

            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-beans</artifactId>
                <version>${spring-beans.version}</version>
            </dependency>

            <dependency>
                <groupId>com.rometools</groupId>
                <artifactId>rome</artifactId>
                <version>${rome.version}</version>
            </dependency>

            <dependency>
                <groupId>com.github.oshi</groupId>
                <artifactId>oshi-core</artifactId>
                <version>${oshi.version}</version>
            </dependency>

            <!-- 七牛云对象存储 -->
            <dependency>
                <groupId>com.qiniu</groupId>
                <artifactId>qiniu-java-sdk</artifactId>
                <version>${qiniu.version}</version>
            </dependency>

            <!-- 发送邮件 -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-mail</artifactId>
                <version>${email.version}</version>
            </dependency>
            <!-- 自定义模板 -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-thymeleaf</artifactId>
                <version>${email.version}</version>
            </dependency>

            <!-- 自定义模块 -->
            <dependency>
                <groupId>liuyuyang.net</groupId>
                <artifactId>common</artifactId>
                <version>1.0-SNAPSHOT</version>
            </dependency>
            <dependency>
                <groupId>liuyuyang.net</groupId>
                <artifactId>model</artifactId>
                <version>1.0-SNAPSHOT</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.1</version>

                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>