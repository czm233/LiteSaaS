---
name: litesaas-collaborator
description: |
  LiteSaaS 协作者工作流。用于：查看分配的任务、阅读文档、开发 Story、标记完成。
  当用户说"协作者"、"collaborator"、"我的任务"、"开始开发"、"查看任务"时触发。
---

# LiteSaaS 协作者工作流

> 你是 LiteSaaS 项目的协作者，负责根据文档开发分配给你的 Story。

## 👤 身份验证

首先读取 `CLAUDE.md` 确认用户身份：
- 读取 `name` 字段（如：wxp）
- 读取 `role` 字段（应为：collaborator）

如果 `role: leader` → 提醒用户这不是他的 workflow

## 🚫 权限提醒

作为协作者，你**不能**：
- 创建或修改需求文档
- 创建或修改架构文档
- 创建或分配 Story
- 合并 PR

你**只能**：
- 查看分配给你的 Story
- 开发你负责的 Story
- 提 PR 等待审核

---

## 🎯 可用命令

### /collab-status

**功能**：查看分配给我的任务（包含依赖检查）

**流程**：
1. 读取用户身份（name）
2. 扫描 `stories/` 目录，找到 Owner 匹配的 Story
3. **检查每个 Story 的依赖是否完成**
4. 标记哪些任务可以开始，哪些需要等待

**依赖检查逻辑**：
- 读取每个 Story 文件的「依赖」字段
- 检查依赖的 Story 状态是否为「已完成」
- 如果依赖未完成，标记为「⏳ 等待依赖」

**输出**：
```
📋 你的任务清单 (wxp)

## ✅ 可以开始
| ID | 任务 | 优先级 | 状态 |
|----|------|--------|------|
| (无) | | | |

## ⏳ 等待依赖
| ID | 任务 | 优先级 | 等待中 |
|----|------|--------|--------|
| STORY-010 | 前端布局 | P0 | STORY-003 (认证模块) |
| STORY-009 | 字典管理 | P1 | STORY-003 (认证模块) |

## 📝 说明
你目前没有可以立即开始的任务。
需要等待 czm 完成 STORY-003（认证模块）后，你才能开始工作。

## 建议
- 等待主导者通知
- 或者阅读文档提前了解需求
```

**如果可以开始**：
```
📋 你的任务清单 (wxp)

## ✅ 可以开始
| ID | 任务 | 优先级 | 预计工时 |
|----|------|--------|----------|
| STORY-010 | 前端布局 | P0 | 3h |

## ⏳ 等待依赖
| ID | 任务 | 优先级 | 等待中 |
|----|------|--------|--------|
| STORY-009 | 字典管理 | P1 | STORY-003 |

## 建议下一步
运行 /collab-read STORY-010 查看任务详情
```

---

### /collab-read

**功能**：阅读指定 Story 的详情和相关文档

**用法**：`/collab-read STORY-001`

**流程**：
1. 读取 Story 文件
2. 读取相关的需求文档和架构文档
3. 展示完整信息

**输出**：
```
📖 STORY-001: 用户登录功能

## 基本信息
- Owner: wxp (你)
- 状态: 待开始
- 优先级: P0
- 预计工时: 2天

## 需求描述
实现用户登录功能，支持：
- 用户名密码登录
- 选择租户
- JWT 认证

## 技术要求
- 后端: /api/auth/login
- 前端: /pages/login/

## 验收标准
- [ ] 可以用用户名密码登录
- [ ] 登录成功后返回 JWT
- [ ] 登录失败有错误提示

## 相关架构
[显示架构文档中相关的部分]

## 准备好了吗？
运行 /collab-dev STORY-001 开始开发
```

---

### /collab-dev

**功能**：开始开发 Story（会检查依赖）

**用法**：`/collab-dev STORY-010`

**流程**：
1. 确认 Story 存在且 Owner 是当前用户
2. **检查依赖是否完成**
3. 如果依赖未完成 → 拒绝并提示
4. 如果依赖完成 → 继续
5. 更新 Story 状态为「进行中」
6. 更新用户的 sprint-status.yaml
7. 引导开发

**依赖检查**：
读取 Story 文件中的「依赖」字段，检查每个依赖 Story 的状态。

**如果依赖未完成**：
```
❌ 无法开始 STORY-010: 前端布局

## 阻塞原因
依赖的任务尚未完成：
- STORY-003 (认证模块) - 状态：待开始

## 说明
你需要等待 czm 完成 STORY-003 后才能开始这个任务。

## 建议
- 等待主导者通知
- 或者先阅读文档了解需求
```

**如果可以开始**：
```
🚀 开始开发 STORY-010: 前端布局

## 开发步骤

### 1. 创建分支
```bash
git checkout main
git pull
git checkout -b feature/wxp/frontend-layout
```

### 2. 前端开发
- 文件: `src/components/layout/`
- 组件: Sidebar, Header, Content

### 3. 验收清单
- [ ] 布局结构正确
- [ ] Header 显示正确信息
- [ ] Sidebar 显示有权限的菜单
- [ ] 菜单可以折叠/展开
- [ ] 当前菜单高亮

## 完成后
运行 /collab-done STORY-010 标记完成
```

---

### /collab-done

**功能**：标记 Story 完成

**用法**：`/collab-done STORY-001`

**流程**：
1. 检查 Story 状态是否为「进行中」
2. 更新 Story 状态为「待审核」
3. 更新 sprint-status.yaml
4. 提醒创建 PR

**输出**：
```
✅ STORY-001 已标记为「待审核」

## 下一步

1. 确保代码已推送：
```bash
git push origin feature/wxp/user-login
```

2. 在 GitHub 创建 PR：
   - 标题: `[feat] STORY-001 用户登录功能`
   - 目标分支: main

3. 等待主导者审核
   - 通过: 代码合并到 main
   - 不通过: 主导者会私下联系你

## 你的其他任务
运行 /collab-status 查看下一个任务
```

---

## 🔄 协作者工作流程

```
开始工作
    ↓
git pull              # 拉取最新代码
    ↓
/collab-status        # 查看分配给我的任务
    ↓
/collab-read STORY-xxx  # 阅读任务详情
    ↓
/collab-dev STORY-xxx   # 开始开发
    ↓
(编写代码、测试)
    ↓
/collab-done STORY-xxx  # 标记完成
    ↓
提 PR                 # 等待审核
    ↓
继续下一个任务
```

---

## ⚠️ 注意事项

### 1. 不要越权

如果你尝试执行以下操作，我会拒绝：
- 修改需求文档
- 修改架构文档
- 创建/分配 Story
- 合并代码

有想法？在群里提出，让主导者评估。

### 2. 遇到问题怎么办？

| 问题类型 | 解决方法 |
|----------|----------|
| 需求不清晰 | 在群里提问 |
| 技术问题 | 在群里讨论 |
| 发现 Bug | 报告给主导者 |
| 被阻塞 | 更新 sprint-status.yaml，群里说明 |

### 3. PR 审核不通过？

主导者会通过微信/线下联系你，沟通修改方案。

### 4. 分支命名规范

```
feature/<你的名字>/<功能名>

例如：
feature/wxp/user-login
feature/wxp/role-management
```

---

## 📁 相关文件

| 文件 | 说明 |
|------|------|
| `CLAUDE.md` | 你的身份配置 |
| `_bmad-output/<你的名字>/sprint-status.yaml` | 你的状态文件 |
| `_bmad-output/implementation-artifacts/stories/` | Story 文件 |
| `docs/TEAM.md` | 团队规范 |
| `docs/GIT-WORKFLOW.md` | Git 工作流 |
