# LiteSaaS 技术架构

> 版本：1.0
> 作者：czm
> 日期：2026-04-02

---

## 1. 系统架构

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         前端层 (React + Vite)                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  页面组件  │  状态管理(Zustand)  │  路由(React Router)    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                        Axios HTTP                               │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        后端层 (Koa.js)                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Routes  │  Controllers  │  Services  │  Middleware     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                         Prisma ORM                             │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        数据层                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    MySQL     │  │    Redis     │  │  文件存储    │          │
│  │   (主数据库)  │  │   (缓存)     │  │   (可选)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 技术选型

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端** | React 19 + Vite 7 | 现代化前端开发 |
| **UI 库** | Ant Design 5 | 企业级 UI 组件 |
| **状态** | Zustand 5 | 轻量级状态管理 |
| **后端** | Koa.js 2 | Node.js Web 框架 |
| **ORM** | Prisma 5 | 类型安全的 ORM |
| **数据库** | MySQL 8 | 关系型数据库 |
| **缓存** | Redis | Session/Token 缓存 |
| **认证** | JWT | 无状态认证 |

---

## 2. 模块划分

### 2.1 后端模块

```
back-end/
├── src/
│   ├── app.js                 # 应用入口
│   │
│   ├── config/                # 配置
│   │   ├── database.js        # 数据库配置
│   │   ├── redis.js           # Redis 配置
│   │   └── jwt.js             # JWT 配置
│   │
│   ├── middleware/            # 中间件
│   │   ├── auth.js            # JWT 认证
│   │   ├── permission.js      # 权限校验
│   │   ├── tenant.js          # 租户识别
│   │   └── errorHandler.js    # 错误处理
│   │
│   ├── routes/                # 路由
│   │   ├── auth.js            # 认证路由
│   │   ├── tenants.js         # 租户路由
│   │   ├── organizations.js   # 组织路由
│   │   ├── users.js           # 用户路由
│   │   ├── roles.js           # 角色路由
│   │   ├── permissions.js     # 权限路由
│   │   └── dicts.js           # 字典路由
│   │
│   ├── controllers/           # 控制器
│   │   ├── AuthController.js
│   │   ├── TenantController.js
│   │   ├── OrganizationController.js
│   │   ├── UserController.js
│   │   ├── RoleController.js
│   │   ├── PermissionController.js
│   │   └── DictController.js
│   │
│   ├── services/              # 服务层
│   │   ├── AuthService.js
│   │   ├── TenantService.js
│   │   ├── OrganizationService.js
│   │   ├── UserService.js
│   │   ├── RoleService.js
│   │   ├── PermissionService.js
│   │   └── DictService.js
│   │
│   └── utils/                 # 工具函数
│       ├── logger.js          # 日志
│       ├── response.js        # 响应格式化
│       └── password.js        # 密码工具
│
├── prisma/
│   └── schema.prisma          # 数据库模型
│
├── scripts/                   # 脚本
│   └── seed.js                # 初始化数据
│
└── tests/                     # 测试
    └── *.test.js
```

### 2.2 前端模块

```
front-end/
├── src/
│   ├── main.jsx               # 入口文件
│   ├── App.jsx                # 根组件
│   │
│   ├── api/                   # API 接口
│   │   ├── auth.js
│   │   ├── tenant.js
│   │   ├── organization.js
│   │   ├── user.js
│   │   ├── role.js
│   │   ├── permission.js
│   │   └── dict.js
│   │
│   ├── stores/                # 状态管理
│   │   ├── userStore.js       # 用户状态
│   │   ├── permissionStore.js # 权限状态
│   │   └── tenantStore.js     # 租户状态
│   │
│   ├── pages/                 # 页面
│   │   ├── login/             # 登录页
│   │   ├── dashboard/         # 首页
│   │   ├── tenants/           # 租户管理
│   │   ├── organizations/     # 组织管理
│   │   ├── users/             # 用户管理
│   │   ├── roles/             # 角色管理
│   │   ├── permissions/       # 权限管理
│   │   ├── dicts/             # 字典管理
│   │   └── profile/           # 个人中心
│   │
│   ├── components/            # 通用组件
│   │   ├── layout/            # 布局组件
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Content.jsx
│   │   ├── permission/        # 权限组件
│   │   │   └── AuthButton.jsx # 按钮权限控制
│   │   └── common/            # 通用组件
│   │       ├── Table.jsx
│   │       └── Form.jsx
│   │
│   ├── router/                # 路由配置
│   │   └── index.jsx
│   │
│   └── utils/                 # 工具函数
│       ├── request.js         # Axios 封装
│       └── permission.js      # 权限工具
│
└── public/
```

---

## 3. 数据库设计

### 3.1 ER 图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Tenant    │────<│    User     │>────│    Role     │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                    │
                           │                    │
                           ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │Organization │     │ Permission  │
                    └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │UserOrgRole  │ (用户-组织-角色关联)
                    └─────────────┘
```

### 3.2 表结构

#### Tenant（租户表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| name | String | 租户名称 |
| code | String | 租户标识（唯一） |
| status | Int | 状态（1启用/0禁用） |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

#### User（用户表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| tenantId | String | 租户ID |
| username | String | 用户名 |
| password | String | 密码（加密） |
| name | String | 姓名 |
| email | String | 邮箱 |
| phone | String | 手机号 |
| status | Int | 状态（1启用/0禁用） |
| level | Int | 权限等级（1-5） |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

#### Organization（组织表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| tenantId | String | 租户ID |
| parentId | String | 父组织ID |
| name | String | 组织名称 |
| code | String | 组织编码 |
| level | Int | 层级（1/2/3...） |
| path | String | 路径（如：1/2/3） |
| sort | Int | 排序 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

#### Role（角色表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| tenantId | String | 租户ID |
| name | String | 角色名称 |
| code | String | 角色编码 |
| description | String | 描述 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

#### Permission（权限表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| tenantId | String | 租户ID（空=系统权限） |
| type | String | 类型（menu/button/data） |
| code | String | 权限编码 |
| name | String | 权限名称 |
| parentId | String | 父权限ID |
| path | String | 路由路径 |
| sort | Int | 排序 |
| createdAt | DateTime | 创建时间 |

#### RolePermission（角色-权限关联表）

| 字段 | 类型 | 说明 |
|------|------|------|
| roleId | String | 角色ID |
| permissionId | String | 权限ID |

#### UserOrgRole（用户-组织-角色关联表）

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | String | 用户ID |
| organizationId | String | 组织ID |
| roleId | String | 角色ID |
| dataScope | String | 数据权限范围 |
| createdAt | DateTime | 创建时间 |

#### Dict（字典表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| tenantId | String | 租户ID |
| type | String | 字典类型 |
| code | String | 字典编码 |
| name | String | 字典名称 |
| value | String | 字典值 |
| sort | Int | 排序 |
| createdAt | DateTime | 创建时间 |

### 3.3 Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Tenant {
  id        String   @id @default(cuid())
  name      String
  code      String   @unique
  status    Int      @default(1)
  users     User[]
  orgs      Organization[]
  roles     Role[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("tenants")
}

model User {
  id           String        @id @default(cuid())
  tenantId     String
  username     String
  password     String
  name         String
  email        String?
  phone        String?
  status       Int           @default(1)
  level        Int           @default(5)
  tenant       Tenant        @relation(fields: [tenantId], references: [id])
  userOrgRoles UserOrgRole[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@unique([tenantId, username])
  @@map("users")
}

model Organization {
  id        String   @id @default(cuid())
  tenantId  String
  parentId  String?
  name      String
  code      String
  level     Int
  path      String
  sort      Int      @default(0)
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  parent    Organization?  @relation("OrgTree", fields: [parentId], references: [id])
  children  Organization[] @relation("OrgTree")
  userOrgRoles UserOrgRole[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([tenantId, code])
  @@map("organizations")
}

model Role {
  id          String   @id @default(cuid())
  tenantId    String
  name        String
  code        String
  description String?
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  permissions RolePermission[]
  userOrgRoles UserOrgRole[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([tenantId, code])
  @@map("roles")
}

model Permission {
  id         String   @id @default(cuid())
  tenantId   String?
  type       String   // menu, button, data
  code       String
  name       String
  parentId   String?
  path       String?
  sort       Int      @default(0)
  parent     Permission?  @relation("PermTree", fields: [parentId], references: [id])
  children   Permission[] @relation("PermTree")
  roles      RolePermission[]
  createdAt  DateTime @default(now())

  @@unique([tenantId, code])
  @@map("permissions")
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
  @@map("role_permissions")
}

model UserOrgRole {
  id             String   @id @default(cuid())
  userId         String
  organizationId String
  roleId         String
  dataScope      String   @default("self") // all, org_and_below, self
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  role           Role         @relation(fields: [roleId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())

  @@unique([userId, organizationId])
  @@map("user_org_roles")
}

model Dict {
  id        String   @id @default(cuid())
  tenantId  String
  type      String
  code      String
  name      String
  value     String
  sort      Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([tenantId, type, code])
  @@map("dicts")
}
```

---

## 4. API 规范

### 4.1 接口命名

```
GET    /api/v1/:resource          # 列表
GET    /api/v1/:resource/:id      # 详情
POST   /api/v1/:resource          # 创建
PUT    /api/v1/:resource/:id      # 更新
DELETE /api/v1/:resource/:id      # 删除
```

### 4.2 响应格式

```json
// 成功
{
  "code": 0,
  "message": "success",
  "data": { ... }
}

// 失败
{
  "code": 1001,
  "message": "用户名已存在",
  "data": null
}
```

### 4.3 核心接口

#### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/v1/auth/login | 登录 |
| POST | /api/v1/auth/logout | 登出 |
| GET | /api/v1/auth/me | 获取当前用户信息 |

#### 租户

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/tenants | 租户列表 |
| POST | /api/v1/tenants | 创建租户 |
| PUT | /api/v1/tenants/:id | 更新租户 |
| DELETE | /api/v1/tenants/:id | 删除租户 |

#### 组织

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/organizations | 组织列表（树形） |
| POST | /api/v1/organizations | 创建组织 |
| PUT | /api/v1/organizations/:id | 更新组织 |
| DELETE | /api/v1/organizations/:id | 删除组织 |

#### 用户

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/users | 用户列表 |
| GET | /api/v1/users/:id | 用户详情 |
| POST | /api/v1/users | 创建用户 |
| PUT | /api/v1/users/:id | 更新用户 |
| DELETE | /api/v1/users/:id | 删除用户 |
| PUT | /api/v1/users/:id/reset-password | 重置密码 |

#### 角色

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/roles | 角色列表 |
| POST | /api/v1/roles | 创建角色 |
| PUT | /api/v1/roles/:id | 更新角色 |
| DELETE | /api/v1/roles/:id | 删除角色 |
| PUT | /api/v1/roles/:id/permissions | 分配权限 |

#### 权限

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/permissions | 权限列表（树形） |
| GET | /api/v1/permissions/menus | 当前用户菜单 |
| POST | /api/v1/permissions | 创建权限 |
| PUT | /api/v1/permissions/:id | 更新权限 |
| DELETE | /api/v1/permissions/:id | 删除权限 |

---

## 5. 权限控制实现

### 5.1 菜单权限

```javascript
// 前端路由守卫
const routes = [
  {
    path: '/users',
    component: UserList,
    permission: 'user:view'  // 需要的权限
  }
]

// 检查权限
if (!hasPermission('user:view')) {
  return <NoPermission />
}
```

### 5.2 按钮权限

```jsx
// 权限按钮组件
<AuthButton permission="user:create">
  新建用户
</AuthButton>

// 实现
function AuthButton({ permission, children }) {
  const { permissions } = usePermissionStore()
  if (!permissions.includes(permission)) {
    return null
  }
  return <Button>{children}</Button>
}
```

### 5.3 数据权限

```javascript
// 后端 Service 层
async findUsers(userId) {
  const user = await this.getUserWithDataScope(userId)

  switch (user.dataScope) {
    case 'all':
      // 返回所有数据
      return this.prisma.user.findMany()
    case 'org_and_below':
      // 返回本组织及下级的数据
      return this.prisma.user.findMany({
        where: { organizationId: { in: user.orgIds } }
      })
    case 'self':
      // 只返回自己的数据
      return this.prisma.user.findMany({
        where: { id: userId }
      })
  }
}
```

---

## 6. 开发规范

### 6.1 分支命名

```
feature/<作者>/<功能名>    # 功能开发
fix/<作者>/<问题描述>      # Bug 修复
hotfix/<问题描述>         # 热修复
```

### 6.2 提交规范

```
feat(module): 功能描述
fix(module): 修复描述
docs: 文档更新
refactor(module): 重构描述
```

### 6.3 代码规范

- 中文注释
- async/await
- RESTful API
- ESLint + Prettier
