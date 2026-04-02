# LiteSaaS

> 可复用的多租户后台管理系统 - 支持多用户、多权限、层级管理

---

## 🚀 快速开始

### 1. 配置你的身份

首次使用前，请根据你的角色复制对应的模板：

```bash
# 主导者
cp docs/CLAUDE-LEADER.md CLAUDE.md

# 协作者
cp docs/CLAUDE-COLLABORATOR.md CLAUDE.md
# 然后编辑 CLAUDE.md，确认 name 和 role 正确
```

### 2. 启动你的工作流

```bash
# 主导者
/litesaas-leader

# 协作者
/litesaas-collaborator
```

---

## 📖 工作流程

### 主导者 (leader)

```
开始工作
    ↓
/litesaas-leader          # 启动主导者工作流
    ↓
/leader-status            # 查看项目状态
    ↓
根据提示执行：
├── /leader-requirement    # 创建需求文档
├── /leader-architecture   # 创建架构文档
├── /leader-create-story   # 创建 Story
└── /leader-review         # 审核 PR
```

### 协作者 (collaborator)

```
开始工作
    ↓
git pull                  # 拉取最新代码
    ↓
/litesaas-collaborator   # 启动协作者工作流
    ↓
/collab-status           # 查看分配给我的任务
    ↓
/collab-read STORY-xxx  # 阅读任务详情
    ↓
/collab-dev STORY-xxx   # 开始开发
    ↓
(编写代码、测试)
    ↓
/collab-done STORY-xxx  # 标记完成
    ↓
提 PR                   # 等待主导者审核
```

---

## 📋 命令速查

### 主导者命令

| 命令 | 功能 | 说明 |
|------|------|------|
| `/leader-status` | 查看项目状态 | 查看需求、架构、Story 的完成情况 |
| `/leader-requirement` | 需求文档 | 创建或编辑需求文档 |
| `/leader-architecture` | 架构文档 | 创建或编辑架构文档 |
| `/leader-create-story` | 创建 Story | 创建新的开发任务 |
| `/leader-assign` | 分配任务 | 将 Story 分配给协作者 |
| `/leader-review` | 审核 PR | 审核协作者提交的代码 |
| `/leader-taskboard` | 任务板 | 查看所有任务的状态 |

### 协作者命令

| 命令 | 功能 | 说明 |
|------|------|------|
| `/collab-status` | 我的任务 | 查看分配给自己的所有任务 |
| `/collab-read` | 阅读任务 | 阅读 Story 的详细需求和技术要求 |
| `/collab-dev` | 开始开发 | 引导你创建分支、编写代码、测试 |
| `/collab-done` | 完成任务 | 标记任务完成，提醒创建 PR |

---

## 🔧 常见问题

### 我是协作者，我该怎么开始？

1. 复制模板：`cp docs/CLAUDE-COLLABORATOR.md CLAUDE.md`
2. 拉取代码：`git pull`
3. 启动工作流：`/litesaas-collaborator`
4. 查看任务：`/collab-status`

### 我不知道要做什么？

运行对应的工作流命令，它会告诉你下一步该做什么：
- 主导者：`/litesaas-leader`
- 协作者：`/litesaas-collaborator`

### 我发现了 Bug 怎么办？

**协作者**：不要直接修改！在群里报告，让主导者创建修复任务。

**主导者**：创建新的 Story，分配给自己或协作者修复。

### PR 审核不通过怎么办？

主导者会通过**微信/线下**联系你，沟通修改方案。

### 我想添加新功能？

**协作者**：在群里提出想法，等主导者评估后创建 Story。

**主导者**：评估后创建 Story 并分配。

---

## 📁 项目结构

```
LiteSaaS/
├── CLAUDE.md                    # 你的身份配置（不推送）
│
├── docs/
│   ├── TEAM.md                # 团队规范
│   ├── TASKBOARD.md           # 任务板
│   └── CLAUDE-*.md            # 身份模板
│
├── _bmad-output/
│   ├── planning-artifacts/
│   │   └── requirements.md     # 需求文档
│   │
│   └── implementation-artifacts/
│       ├── architecture.md     # 架构文档
│       └── stories/            # Story 文件
│
└── .claude/skills/
    ├── litesaas-leader/       # 主导者工作流
    └── litesaas-collaborator/  # 协作者工作流
```

---

## 📚 更多文档

- [团队规范](./docs/TEAM.md) - 技术栈、编码规范
- [权限矩阵](./docs/PERMISSIONS.md) - 各角色可执行的命令
- [Git 工作流](./docs/GIT-WORKFLOW.md) - Git 协作详细指南

---

## 📄 License

MIT
