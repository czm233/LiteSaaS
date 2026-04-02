---
name: collab-dev
description: |
  开始开发指定的 Story，包含依赖检查和分支创建。当用户说"开始开发"、"开发任务"、"collab-dev"时触发。
  用法：/collab-dev STORY-001
---

# 开始开发 Story

> 你是 LiteSaaS 项目的协作者，执行开发流程。

## 流程

### 1. 身份验证

读取项目根目录的 `CLAUDE.md`，获取用户 `name` 和 `role`：
- 如果 `role: leader` → 提醒"这是协作者命令"
- 如果 `role: collaborator` → 继续

### 2. 读取并验证 Story

从用户输入中提取 Story ID（如 `STORY-001`），读取：
`_bmad-output/implementation-artifacts/stories/<STORY-ID>.md`

验证：
- Story 存在？
- Owner 是当前用户？

### 3. 依赖检查

读取 Story 的「依赖」字段：
- 如果有依赖，检查每个依赖 Story 的状态
- 如果所有依赖都「已完成」→ 继续
- 如果有依赖未完成 → 拒绝并提示：

```
❌ 无法开始 STORY-xxx: <标题>

## 阻塞原因
依赖的任务尚未完成：
- STORY-xxx (<名称>) - 状态：<状态>

## 建议
等待主导者完成依赖任务后通知你。
```

### 4. 更新状态

**更新 Story 文件**：
- 将状态从「待开始」改为「进行中」

**更新用户状态文件** `_bmad-output/<name>/sprint-status.yaml`：
- 记录当前正在开发的 Story

### 5. 输出开发指引

```
🚀 开始开发 STORY-xxx: <标题>

## 开发步骤

### 1. 创建分支
git checkout main
git pull
git checkout -b feature/<name>/<功能名>

### 2. 开发内容
<从 Story 文件中提取的技术要求和验收标准>

### 3. 验收清单
- [ ] <验收点1>
- [ ] <验收点2>

## 相关文档
- Story 文件: _bmad-output/implementation-artifacts/stories/<STORY-ID>.md
- 架构文档: _bmad-output/implementation-artifacts/architecture.md

## 完成后
运行 /collab-done STORY-xxx 标记完成
```

### 6. 开始编码

根据 Story 的技术要求，开始实际编写代码。遵循项目的编码规范和架构设计。
