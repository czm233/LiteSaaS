# STORY-002: 数据库初始化

## 基本信息
- **Owner**: wxp
- **状态**: 待开始
- **优先级**: P0
- **预计工时**: 1小时
- **依赖**: STORY-001

## 需求描述
根据架构设计创建 Prisma Schema，初始化数据库。

### 表结构
- Tenant（租户表）
- User（用户表）
- Organization（组织表）
- Role（角色表）
- Permission（权限表）
- RolePermission（角色-权限关联表）
- UserOrgRole（用户-组织-角色关联表）
- Dict（字典表）

## 技术要求
- 文件：`back-end/prisma/schema.prisma`
- 数据库：MySQL
- 命令：`pnpm db:push`

## 验收标准
- [ ] Prisma Schema 已创建
- [ ] 数据库表已创建
- [ ] `pnpm db:studio` 可查看表结构

## 相关文档
- [架构文档 - 数据库设计](../architecture.md#3-数据库设计)
