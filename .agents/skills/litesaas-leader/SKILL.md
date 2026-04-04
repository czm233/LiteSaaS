---
name: litesaas-leader
description: |
  LiteSaaS 主导者工作流入口。用于：查看可用命令和工作流程。
  当用户说"主导者"、"leader"、"我的工作流"时触发。
---

# LiteSaaS 主导者工作流

> 你是 LiteSaaS 项目的主导者，负责需求规划、架构设计、任务分配和代码审核。

## 👤 身份验证

首先读取 `AGENTS.md` 确认用户身份：
- 如果 `role: leader` → 继续
- 如果 `role: collaborator` → 提醒用户这不是他的 workflow，建议使用 /litesaas-collaborator

## 📊 项目状态检测

检测以下文件是否存在并评估完成度：

| 文件 | 路径 | 检测内容 |
|------|------|----------|
| 需求文档 | `_bmad-output/planning-artifacts/requirements.md` | 是否存在、内容完整性 |
| 架构文档 | `_bmad-output/implementation-artifacts/architecture.md` | 是否存在、内容完整性 |
| Story 文件 | `_bmad-output/implementation-artifacts/stories/*.md` | 数量、分配情况 |
| 任务板 | `docs/TASKBOARD.md` | 是否存在、状态 |

## 🎯 可用命令

以下命令都是独立的 skill，可以直接输入：

| 命令 | 功能 | 用法 |
|------|------|------|
| `/leader-status` | 查看项目状态 | `/leader-status` |
| `/leader-requirement` | 创建/编辑需求文档 | `/leader-requirement` |
| `/leader-architecture` | 创建/编辑架构文档 | `/leader-architecture` |
| `/leader-create-story` | 创建新 Story | `/leader-create-story` |
| `/leader-assign` | 分配 Story | `/leader-assign STORY-001 wxp` |
| `/leader-review` | 审核 PR | `/leader-review` |
| `/leader-taskboard` | 查看任务板 | `/leader-taskboard` |

---

## 🔄 主导者工作流程

```
开始工作
    ↓
/leader-status        # 查看项目状态
    ↓
根据建议执行命令：
    ├── /leader-requirement    # 需求文档未完成
    ├── /leader-architecture   # 架构文档未完成
    ├── /leader-create-story   # 开始拆分任务
    └── /leader-review         # 有 PR 待审核
    ↓
/leader-taskboard     # 更新任务板
    ↓
结束（或继续其他工作）
```

---

## ⚠️ 注意事项

1. **先需求后架构** - 架构依赖需求文档
2. **先架构后 Story** - Story 依赖架构文档
3. **Story 粒度** - 每个 Story 应该是 1-3 天的工作量
4. **私下沟通** - PR 不通过时，通过微信/线下沟通，不在系统记录

---

## 🚀 快速开始

建议你现在运行 `/leader-status` 查看项目当前状态。
