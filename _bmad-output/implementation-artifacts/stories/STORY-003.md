# STORY-003: 认证模块

## 基本信息
- **Owner**: cxm
- **状态**: 待开始
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
- [ ] 可以选择租户
- [ ] 可以用正确的用户名密码登录
- [ ] 登录失败有错误提示
- [ ] 登录成功后跳转到首页
- [ ] 刷新页面后保持登录状态
- [ ] 可以登出

## 相关文档
- [需求文档 - 认证模块](../../planning-artifacts/requirements.md#221-认证模块)
- [架构文档 - API 规范](../architecture.md#4-api-规范)
