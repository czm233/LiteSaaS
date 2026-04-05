# STORY-003: 认证模块

## 基本信息
- **Owner**: cxm
- **状态**: 已完成
- **优先级**: P0
- **预计工时**: 4小时
- **依赖**: STORY-002

## 需求描述
实现用户登录认证功能，支持租户选择。

### 后端
- POST `/api/v1/auth/login` - 登录
- POST `/api/v1/auth/logout` - 登出
- GET `/api/v1/auth/me` - 获取当前用户信息
- GET `/api/v1/auth/tenants` - 获取租户列表（用于选择）

### 前端
- 登录页面：`/login`
- 租户选择下拉框
- 用户名/密码输入框
- 登录成功后跳转到首页
- Token 存储到 localStorage

## 技术要求

### 后端
- JWT 认证
- bcrypt 密码加密
- Redis 存储 Token（可选）

### 前端
- 状态管理：`userStore`
- 路由守卫：未登录跳转到登录页

## 验收标准
- [x] 可以选择租户
- [x] 可以用正确的用户名密码登录
- [x] 登录失败有错误提示
- [x] 登录成功后跳转到首页
- [x] 刷新页面后保持登录状态
- [x] 可以登出

## 完成记录
- **完成日期**: 2026-04-05
- **实际工时**: 4小时

### 变更的文件
- `back-end/.env.example` — 新增 JWT_SECRET、JWT_EXPIRES_IN 配置
- `back-end/package.json` — 新增 jsonwebtoken、bcryptjs、dotenv 依赖
- `back-end/scripts/seed.ts` — 创建测试用户和租户数据
- `back-end/src/config/database.js` — 数据库配置
- `back-end/src/config/jwt.js` — JWT 配置
- `back-end/src/controllers/AuthController.js` — 认证控制器
- `back-end/src/middleware/auth.js` — JWT 认证中间件
- `back-end/src/routes/auth.js` — 认证路由
- `back-end/src/services/AuthService.js` — 认证服务
- `back-end/src/utils/password.js` — 密码加密工具
- `back-end/src/utils/response.js` — 响应格式化工具
- `front-end/src/api/auth.js` — 认证 API
- `front-end/src/pages/login/index.jsx` — 登录页面
- `front-end/src/router/index.jsx` — 路由配置
- `front-end/src/stores/userStore.js` — 用户状态管理
- `front-end/src/utils/request.js` — 请求封装

## 相关文档
- [需求文档 - 认证模块](../../planning-artifacts/requirements.md#221-认证模块)
- [架构文档 - API 规范](../architecture.md#4-api-规范)
