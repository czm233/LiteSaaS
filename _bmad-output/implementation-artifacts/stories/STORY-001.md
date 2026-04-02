# STORY-001: 项目初始化

## 基本信息
- **Owner**: czm
- **状态**: 待开始
- **优先级**: P0
- **预计工时**: 2小时

## 需求描述
初始化前后端项目脚手架，配置基础开发环境。

### 后端初始化
- 创建 Koa.js 项目
- 配置 Prisma
- 配置 ESLint + Prettier
- 配置 nodemon 热重载

### 前端初始化
- 创建 Vite + React 项目
- 配置 Ant Design
- 配置 React Router
- 配置 Axios

## 技术要求

### 后端
- 目录：`back-end/`
- 入口：`src/app.js`
- 端口：3000

### 前端
- 目录：`front-end/`
- 入口：`src/main.jsx`
- 端口：5173

## 验收标准
- [ ] 后端 `pnpm dev` 可启动
- [ ] 前端 `pnpm dev` 可启动
- [ ] 访问 `http://localhost:5173` 显示空白页面
- [ ] 访问 `http://localhost:3000/api/health` 返回 `{ "status": "ok" }`

## 相关文档
- [需求文档](../../planning-artifacts/requirements.md)
- [架构文档](../architecture.md)
