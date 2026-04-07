# STORY-007: 角色管理

## 基本信息
- **Owner**: cxm
- **状态**: 待审核
- **优先级**: P0
- **预计工时**: 3小时
- **依赖**: STORY-003, STORY-008

## 需求描述
实现角色的增删改查功能，支持为角色分配权限。

### 后端
- GET `/api/v1/roles` - 角色列表
- GET `/api/v1/roles/:id` - 角色详情
- POST `/api/v1/roles` - 创建角色
- PUT `/api/v1/roles/:id` - 更新角色
- DELETE `/api/v1/roles/:id` - 删除角色
- PUT `/api/v1/roles/:id/permissions` - 分配权限

### 前端
- 角色管理页面：`/roles`
- 角色列表（表格）
- 新建/编辑弹窗
- 权限分配弹窗（树形选择）

## 验收标准
- [ ] 可以查看角色列表
- [ ] 可以创建新角色
- [ ] 可以编辑角色信息
- [ ] 可以为角色分配菜单权限
- [ ] 可以为角色分配按钮权限
- [ ] 可以为角色分配数据权限
- [ ] 可以删除角色

## 相关文档
- [需求文档 - 角色管理](../../planning-artifacts/requirements.md#225-角色管理)
