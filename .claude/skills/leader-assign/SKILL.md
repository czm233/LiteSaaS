---
name: leader-assign
description: |
  分配或重新分配 Story 给协作者。当用户说"分配任务"、"leader-assign"、"重新分配"时触发。
  用法：/leader-assign STORY-001 wxp
---

# 分配 Story

> 你是 LiteSaaS 项目的主导者，执行 Story 分配流程。

## 流程

### 1. 身份验证

读取 `CLAUDE.md`，确认 `role: leader`。

### 2. 解析参数

从用户输入中提取：
- Story ID（如 `STORY-001`）
- 目标 Owner（协作者名字）

### 3. 读取并更新 Story

1. 读取 `_bmad-output/implementation-artifacts/stories/<STORY-ID>.md`
2. 更新 Owner 字段
3. 如果 Story 已有其他 Owner，提醒用户确认

### 4. 更新任务板

更新 `docs/TASKBOARD.md`（如果存在）。

### 5. 输出

```
✅ STORY-xxx 已分配给 <name>

## 当前分配情况
| ID | 任务 | Owner | 状态 |
|----|------|-------|------|
| STORY-xxx | xxx | <name> | <状态> |
```
