# STORY-004: 租户管理

## 基本信息
- **Owner**: wxp
- **状态**: 待开始
- **优先级**: P0
- **预计工时**: 2小时
- **依赖**: STORY-003

## 需求描述
实现租户的增删改查功能（仅系统管理员可操作）。

### 后端
- GET `/api/v1/tenants` - 租户列表
- GET `/api/v1/tenants/:id` - 租户详情
- POST `/api/v1/tenants` - 创建租户
- PUT `/api/v1/tenants/:id` - 更新租户
- DELETE `/api/v1/tenants/:id` - 删除租户

### 前端
- 租户管理页面：`/tenants`
- 租户列表（表格）
- 新建/编辑弹窗
- 删除确认

## 验收标准
- [ ] 可以查看租户列表
- [ ] 可以创建新租户
- [ ] 可以编辑租户信息
- [ ] 可以删除租户（有确认提示）
- [ ] 只有系统管理员（1级）可以操作

## 相关文档
- [需求文档 - 租户管理](../../planning-artifacts/requirements.md#222-租户管理)
