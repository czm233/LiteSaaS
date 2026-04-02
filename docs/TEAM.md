# LiteSaaS 团队协作规范

> 最后更新：2026-04-01

## 👥 团队成员

| 角色 | 姓名 | GitHub 用户名 | 分支 | 职责 |
|------|------|---------------|------|------|
| 主导者 | czm | @czm | `main` | 架构设计、核心功能、代码审核、分支合并 |
| 协作者 | wxp | @wxp | `feature/wxp/*` | 功能开发、前端界面 |

---

## 🔧 技术栈

### 后端
- **运行时**: Node.js 20+
- **框架**: Koa.js
- **ORM**: Prisma
- **数据库**: MySQL 8.0+
- **认证**: JWT
- **日志**: Winston / Pino

### 前端
- **框架**: React 18+ / Vue 3+
- **构建工具**: Vite
- **UI 组件库**: Ant Design / Element Plus
- **状态管理**: Zustand / Pinia
- **HTTP 客户端**: Axios

### 开发工具
- **包管理器**: pnpm
- **代码规范**: ESLint + Prettier
- **提交规范**: Commitlint + Conventional Commits
- **API 文档**: Apifox / Swagger

---

## 📋 编码规范

### 通用规范
- 使用 **中文注释** 和 **中文文档**
- 使用 **async/await**，不使用 callback
- 变量和函数命名使用 **camelCase**
- 类和组件命名使用 **PascalCase**
- 常量使用 **UPPER_SNAKE_CASE**
- 文件名使用 **kebab-case**

### 后端规范
- 如果项目中有 logger，**必须使用 logger**，不使用 console.log
- API 路由使用 **RESTful** 风格
- 错误处理使用统一的错误中间件
- 数据库变更必须写 **部署文档**

### 前端规范
- 组件使用 **函数式组件** + Hooks
- 样式优先使用 **CSS Modules** 或 **Tailwind CSS**
- 表单使用受控组件

### Git 提交规范
```
<type>(<scope>): <subject>

type:
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式（不影响功能）
- refactor: 重构
- perf: 性能优化
- test: 测试相关
- chore: 构建/工具相关
```

示例：
```
feat(user): 添加用户登录功能
fix(api): 修复用户列表分页问题
docs(readme): 更新安装说明
```

---

## 🌿 Git 工作流

### 分支策略

```
main (主导者 czm)
  │
  ├── feature/czm/*    (czm 的功能分支)
  │
  └── feature/wxp/*    (wxp 的功能分支)
```

### 分支命名规范
- 功能分支：`feature/<作者>/<功能名>`
- 修复分支：`fix/<作者>/<问题描述>`
- 热修复：`hotfix/<问题描述>`

### 工作流程

```
1. 协作者从 main 创建自己的功能分支
   git checkout -b feature/wxp/user-frontend

2. 在功能分支上开发、提交代码
   git add .
   git commit -m "feat(frontend): 完成用户列表页面"

3. 定期推送到远程
   git push origin feature/wxp/user-frontend

4. 功能完成后，创建 Pull Request
   - 目标分支：main
   - 填写 PR 模板（描述、测试情况等）

5. 主导者审核代码
   - 检查代码质量
   - 检查是否符合规范
   - 提出修改意见或批准

6. 审核通过后，主导者合并到 main
```

### 分支保护规则（main 分支）
- ❌ 禁止直接推送到 main
- ✅ 必须通过 PR 合并
- ✅ 必须经过代码审核
- ✅ 必须通过 CI 检查（如有）

---

## 📝 PR 规范

### PR 标题格式
```
[<类型>] <简短描述>
```
示例：`[feat] 用户登录功能`、`[fix] 修复分页问题`

### PR 描述模板
```markdown
## 变更类型
- [ ] 新功能 (feat)
- [ ] Bug 修复 (fix)
- [ ] 文档更新 (docs)
- [ ] 重构 (refactor)

## 变更内容
<!-- 描述本次变更的内容 -->

## 测试情况
- [ ] 本地测试通过
- [ ] 单元测试通过
- [ ] 功能测试通过

## 相关 Issue
<!-- 如果有关联的 Issue，在此列出 -->

## 截图（如有界面变更）
<!-- 粘贴截图 -->
```

---

## 🚀 部署流程

### 环境变量变更
- 必须更新 `.env.example` 文件
- 必须在部署文档中说明

### 数据库变更
- 必须创建 Prisma migration
- 必须在部署文档中说明执行步骤

### 部署检查清单
1. [ ] 数据库迁移（如需要）
2. [ ] 执行脚本（如需要）
3. [ ] 环境变量配置（如需要）
4. [ ] 前端部署（如需要）
5. [ ] 后端重启（如需要）

---

## 📞 沟通方式

- **日常沟通**：（企业微信/钉钉/飞书 等）
- **问题讨论**：GitHub Issues
- **代码讨论**：GitHub PR Comments
- **紧急问题**：（电话/即时通讯）

---

## 📚 相关文档

- [权限矩阵](./PERMISSIONS.md) - ⭐ **必读**：各角色可执行的命令
- [CLAUDE 模板指南](./CLAUDE-TEMPLATE.md) - 开发者配置模板
- [任务板](./TASKBOARD.md) - 任务分配和进度跟踪
- [Git 工作流](./GIT-WORKFLOW.md) - Git 协作指南
- [项目决策](./DECISIONS.md) - 技术决策记录

## 🤖 项目专用 Workflow

| Workflow | 触发命令 | 使用者 | 功能 |
|----------|----------|--------|------|
| **主导者** | `/litesaas-leader` | czm | 需求管理、架构设计、Story 拆分、任务分配、代码审核 |
| **协作者** | `/litesaas-collaborator` | wxp | 查看任务、阅读文档、开发 Story、标记完成 |

### 主导者命令

| 命令 | 功能 |
|------|------|
| `/leader-status` | 查看项目状态 |
| `/leader-requirement` | 创建/编辑需求文档 |
| `/leader-architecture` | 创建/编辑架构文档 |
| `/leader-create-story` | 创建新 Story |
| `/leader-assign` | 分配 Story |
| `/leader-review` | 审核 PR |
| `/leader-taskboard` | 查看任务板 |

### 协作者命令

| 命令 | 功能 |
|------|------|
| `/collab-status` | 查看分配给我的任务 |
| `/collab-read` | 阅读 Story 详情 |
| `/collab-dev` | 开始开发 |
| `/collab-done` | 标记完成 |

---

## 🤖 BMad 协作

> 详细指南请查看 [BMad 协作指南](./BMAD-COLLABORATION.md)

### 身份识别

每位开发者在本地 `CLAUDE.md` 中声明自己的身份：

```markdown
## 👤 身份

name: czm        # 你的名字缩写
role: leader     # leader 或 collaborator
```

### 权限控制

| 控制点 | 方式 | 强制程度 |
|------|------|----------|
| CLAUDE.md 身份 | 开发者自己填写 | 基于信任 |
| Claude 提醒 | 越权时提醒 | 软性约束 |
| **PR 审核** | 只有主导者能 merge | **硬性约束** |

> 💡 **核心理念**：身份靠自觉，控制靠 PR。只有 czm 能 merge 代码到 main。

### 个人状态目录

每个人在 `_bmad-output/` 下有自己的目录：

| 成员 | 目录 | 内容 |
|------|------|------|
| czm | `_bmad-output/czm/` | Sprint 状态、当前任务、 笔记 |
| wxp | `_bmad-output/wxp/` | Sprint 状态、当前任务、 笔记 |

---

> 💡 **提示**：本文档会随着项目发展持续更新，如有建议请提出 Issue 或 PR。
