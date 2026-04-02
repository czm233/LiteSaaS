---
name: collab-read
description: |
  阅读指定 Story 的详情和相关文档。当用户说"阅读任务"、"查看详情"、"collab-read"时触发。
  用法：/collab-read STORY-001
---

# 阅读 Story 详情

> 你是 LiteSaaS 项目的协作者，执行阅读任务详情流程。

## 流程

### 1. 身份验证

读取项目根目录的 `CLAUDE.md`，获取用户 `name` 和 `role`：
- 如果 `role: leader` → 提醒"这是协作者命令"
- 如果 `role: collaborator` → 继续

### 2. 读取 Story

从用户输入中提取 Story ID（如 `STORY-001`），读取文件：
`_bmad-output/implementation-artifacts/stories/<STORY-ID>.md`

如果文件不存在 → 提示 Story 不存在

### 3. 检查归属

确认 Story 的 Owner 是否是当前用户：
- 如果不是 → 提醒"这个任务不是分配给你的"
- 如果是 → 继续

### 4. 读取关联文档

读取以下文档（如果存在）：
- `_bmad-output/planning-artifacts/requirements.md` — 需求文档
- `_bmad-output/implementation-artifacts/architecture.md` — 架构文档

只展示与当前 Story 相关的部分。

### 5. 输出结果

```
📖 STORY-xxx: <标题>

## 基本信息
- Owner: <name> (你)
- 状态: <状态>
- 优先级: <优先级>
- 预计工时: <工时>
- 依赖: <依赖列表>

## 需求描述
<Story 中的需求描述>

## 技术要求
- 后端: <接口路径>
- 前端: <页面路径>

## 验收标准
- [ ] <验收点>

## 相关架构
<架构文档中的相关部分>

## 准备好了吗？
运行 /collab-dev STORY-xxx 开始开发
```
