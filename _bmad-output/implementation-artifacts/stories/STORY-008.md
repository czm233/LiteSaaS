# STORY-008: 权限管理

## 基本信息
- **Owner**: cxm
- **状态**: 待开始
- **优先级**: P0
- **预计工时**: 4小时
- **依赖**: STORY-003

## 需求描述
实现权限的增删改查功能，支持菜单/按钮/数据三种类型。

### 后端
- GET `/api/v1/permissions` - 权限列表（树形）
- GET `/api/v1/permissions/menus` - 当前用户菜单
- POST `/api/v1/permissions` - 创建权限
- PUT `/api/v1/permissions/:id` - 更新权限
- DELETE `/api/v1/permissions/:id` - 删除权限

### 前端
- 权限管理页面：`/permissions`
- 权限树（Tree 组件）
- 新建/编辑弹窗
- 权限类型选择（菜单/按钮/数据）

## 技术要求

### 权限类型
- **菜单权限**：type=menu，控制菜单显示
- **按钮权限**：type=button，控制按钮显示
- **数据权限**：type=data，控制数据范围

### 权限编码规范
- 菜单：`user:view`（用户管理查看）
- 按钮：`user:create`（创建用户按钮）
- 数据：`data:all` / `data:org` / `data:self`

## 验收标准
- [ ] 可以查看权限树
- [ ] 可以创建菜单权限
- [ ] 可以创建按钮权限
- [ ] 可以创建数据权限
- [ ] 可以编辑权限
- [ ] 可以删除权限
- [ ] 登录后只能看到有权限的菜单

## 相关文档
- [需求文档 - 权限管理](../../planning-artifacts/requirements.md#226-权限管理)
- [架构文档 - 权限控制](../architecture.md#5-权限控制实现)
