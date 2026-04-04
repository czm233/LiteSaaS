---
name: collab-done
description: |
  标记 Story 开发完成，更新状态并引导创建 PR。当用户说"标记完成"、"任务完成"、"collab-done"时触发。
  用法：/collab-done STORY-001
---

# 标记 Story 完成

> 你是 LiteSaaS 项目的协作者，执行标记完成流程。

## 流程

### 1. 身份验证

读取项目根目录的 `AGENTS.md`，获取用户 `name` 和 `role`：
- 如果 `role: leader` → 提醒"这是协作者命令"
- 如果 `role: collaborator` → 继续

### 2. 读取并验证 Story

从用户输入中提取 Story ID，读取 Story 文件。

验证：
- Story 存在？
- Owner 是当前用户？
- 状态是「进行中」？（如果不是，提醒先运行 /collab-dev）

### 3. 更新状态

**更新 Story 文件**：
- 将状态从「进行中」改为「待审核」

**更新用户状态文件** `_bmad-output/<name>/sprint-status.yaml`：
- 移除当前正在开发的 Story 记录

### 4. 输出完成指引

```
✅ STORY-xxx 已标记为「待审核」

## 下一步

### 1. 确保代码已推送
git push origin feature/<name>/<功能名>

### 2. 在 GitHub 创建 PR
- 标题: `[feat] STORY-xxx <标题>`
- 目标分支: main

### 3. 等待主导者审核
- 通过 → 代码合并到 main
- 不通过 → 主导者会联系你

## 查看下一个任务
运行 /collab-status 查看剩余任务
```
