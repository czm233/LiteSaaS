# STORY-005: 组织管理

## 基本信息
- **Owner**: cxm
- **状态**: 待开始
- **优先级**: P0
- **预计工时**: 4小时
- **依赖**: STORY-003

## 需求描述
实现组织的增删改查功能，支持多级树形结构。

### 后端
- GET `/api/v1/organizations` - 组织列表（树形）
- GET `/api/v1/organizations/:id` - 组织详情
- POST `/api/v1/organizations` - 创建组织
- PUT `/api/v1/organizations/:id` - 更新组织
- DELETE `/api/v1/organizations/:id` - 删除组织

### 前端
- 组织管理页面：`/organizations`
- 组织树（Tree 组件）
- 新建/编辑弹窗
- 删除确认

## 技术要求
- 支持 3 级组织（可扩展到 5 级）
- 组织树懒加载或一次性加载
- 删除前检查是否有子组织和关联用户

## 验收标准
- [ ] 可以查看组织树
- [ ] 可以创建子组织
- [ ] 可以编辑组织信息
- [ ] 可以删除无子组织的组织
- [ ] 有子组织时不能删除

## 相关文档
- [需求文档 - 组织管理](../../planning-artifacts/requirements.md#223-组织管理)
