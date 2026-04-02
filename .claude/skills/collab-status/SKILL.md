---
name: collab-status
description: |
  查看协作者分配的任务状态和依赖检查。当用户说"查看任务"、"我的任务"、"collab-status"、"任务清单"时触发。
---

# 查看我的任务

> 你是 LiteSaaS 项目的协作者，执行查看任务状态流程。

## 流程

### 1. 身份验证

读取项目根目录的 `CLAUDE.md`，获取用户 `name` 和 `role`：
- 如果 `role: leader` → 提醒"这是协作者命令，你作为主导者请使用 /leader-taskboard"
- 如果 `role: collaborator` → 继续

### 2. 扫描任务

扫描 `_bmad-output/implementation-artifacts/stories/` 目录下所有 `.md` 文件：
- 找到 `Owner` 字段匹配用户 name 的 Story
- 读取每个 Story 的状态、优先级、依赖字段

### 3. 依赖检查

对每个 Story：
- 读取「依赖」字段
- 检查依赖的 Story 状态是否为「已完成」
- 标记哪些可以开始，哪些需要等待

### 4. 输出结果

```
📋 你的任务清单 (<name>)

## ✅ 可以开始
| ID | 任务 | 优先级 | 预计工时 |
|----|------|--------|----------|
| STORY-xxx | xxx | P0 | 2天 |

## ⏳ 等待依赖
| ID | 任务 | 优先级 | 等待中 |
|----|------|--------|--------|
| STORY-xxx | xxx | P1 | STORY-xxx (xxx) |

## 📝 已完成
| ID | 任务 |
|----|------|
| STORY-xxx | xxx |

## 建议下一步
运行 /collab-read STORY-xxx 查看任务详情
```

如果没有可分配的任务，提示：
- 等待主导者分配任务
- 可以阅读已有文档提前了解项目
