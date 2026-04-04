---
name: leader-create-story
description: |
  创建新的 Story 并分配给协作者。当用户说"创建Story"、"leader-create-story"、"新建任务"、"拆分任务"时触发。
---

# 创建 Story

> 你是 LiteSaaS 项目的主导者，执行 Story 创建流程。

## 流程

### 1. 身份验证

读取 `AGENTS.md`，确认 `role: leader`。

### 2. 前置检查

检查架构文档 `_bmad-output/implementation-artifacts/architecture.md` 是否存在：
- 如果不存在 → 提醒"Story 依赖架构文档，请先运行 /leader-architecture"
- 如果存在 → 继续

### 3. 收集 Story 信息

向用户询问：
- 标题
- 描述
- Owner（协作者名字）
- 优先级（P0/P1/P2）
- 预计工时
- 依赖（可选）

### 4. 生成 Story 文件

在 `_bmad-output/implementation-artifacts/stories/` 目录下创建文件：

```markdown
# STORY-xxx: [标题]

## 基本信息
- **Owner**: [协作者名字]
- **状态**: 待开始
- **优先级**: P0 | P1 | P2
- **预计工时**: [x天/x小时]
- **依赖**: [依赖列表]

## 需求描述
<!-- 详细描述 -->

## 技术要求
- 后端：[接口路径/模块]
- 前端：[页面路径/组件]

## 验收标准
- [ ] [验收点1]
- [ ] [验收点2]

## 相关文档
- [需求文档](../../planning-artifacts/requirements.md)
- [架构文档](../architecture.md)
```

### 5. 更新任务板

更新 `docs/TASKBOARD.md`（如果存在）。
