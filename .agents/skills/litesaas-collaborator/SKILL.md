---
name: litesaas-collaborator
description: |
  LiteSaaS 协作者工作流入口。用于：查看可用命令和工作流程。
  当用户说"协作者"、"collaborator"、"我的工作流"时触发。
---

# LiteSaaS 协作者工作流

> 你是 LiteSaaS 项目的协作者，负责根据文档开发分配给你的 Story。

## 👤 身份验证

首先读取 `AGENTS.md` 确认用户身份：
- 读取 `name` 字段（如：wxp）
- 读取 `role` 字段（应为：collaborator）

如果 `role: leader` → 提醒用户这不是他的 workflow，建议使用 /litesaas-leader

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

以下命令都是独立的 skill，可以直接输入：

| 命令 | 功能 | 用法 |
|------|------|------|
| `/collab-status` | 查看分配给我的任务 | `/collab-status` |
| `/collab-read` | 阅读 Story 详情 | `/collab-read STORY-001` |
| `/collab-dev` | 开始开发 Story | `/collab-dev STORY-001` |
| `/collab-done` | 标记 Story 完成 | `/collab-done STORY-001` |

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

有想法？在群里提出，让主导者评估。

### 2. 遇到问题怎么办？

| 问题类型 | 解决方法 |
|----------|----------|
| 需求不清晰 | 在群里提问 |
| 技术问题 | 在群里讨论 |
| 发现 Bug | 报告给主导者 |
| 被阻塞 | 更新 sprint-status.yaml，群里说明 |

### 3. 分支命名规范

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
| `AGENTS.md` | 你的身份配置 |
| `_bmad-output/<你的名字>/sprint-status.yaml` | 你的状态文件 |
| `_bmad-output/implementation-artifacts/stories/` | Story 文件 |
| `docs/TEAM.md` | 团队规范 |
| `docs/GIT-WORKFLOW.md` | Git 工作流 |

---

## 🚀 快速开始

建议你现在运行 `/collab-status` 查看分配给你的任务。
