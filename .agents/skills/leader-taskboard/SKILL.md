---
name: leader-taskboard
description: |
  查看或更新 LiteSaaS 任务板，展示所有 Story 的分配和状态。
  当用户说"任务板"、"leader-taskboard"、"看板"、"所有任务"时触发。
---

# 任务板

> 你是 LiteSaaS 项目的主导者，执行任务板查看流程。

## 流程

### 1. 身份验证

读取 `AGENTS.md`，确认 `role: leader`。

### 2. 扫描所有 Story

扫描 `_bmad-output/implementation-artifacts/stories/*.md` 所有文件，提取：
- Story ID
- 标题
- Owner
- 状态
- 优先级

### 3. 输出任务板

```
📋 TASKBOARD

## 当前 Sprint

| ID | 任务 | Owner | 状态 | 优先级 |
|----|------|-------|------|--------|
| STORY-001 | 用户登录 | wxp | 进行中 | P0 |
| STORY-002 | 角色管理 | wxp | 待开始 | P1 |
| STORY-003 | 权限管理 | czm | 待开始 | P0 |

## 统计
- 待开始: x
- 进行中: x
- 待审核: x
- 已完成: x
```

### 4. 可选操作

如果用户要求更新任务板：
- 生成/更新 `docs/TASKBOARD.md` 文件
