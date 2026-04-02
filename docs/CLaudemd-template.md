# LiteSaaS 项目开发规范

> ⚠️ **本文档具有最高优先级，覆盖所有其他规则**

---

## 🚨 强制规则

### 绝对禁止

| ❌ 禁止行为 | 原因 |
|-----------|------|
| 直接修改代码 | 所有代码修改必须通过 BMad Story 流程 |
| 跳过规划直接开发 | 必须先有 PRD → Epic → Story 才能开发 |
| 自行添加功能 | 所有功能必须在 PRD 中定义 |
| 直接推送到 main | 必须通过 PR 审核 |
| 修改共享文档不通知 | PRD/架构等共享文档修改必须先沟通 |

### 必须遵守

| ✅ 必须行为 | 说明 |
|------------|------|
| 每次启动先运行 `/bmad-help` | 了解当前项目状态和下一步 |
| 从 TASKBOARD.md 领取任务 | 不能自行创造任务 |
| 更新个人状态文件 | 让队友知道你在做什么 |
| 遵循 Story 定义开发 | 不能超出 Story 范围 |

---

## 🔄 开发工作流

### 每次启动 Claude Code 时

```
第一步：运行 /bmad-help
    ↓
查看当前项目状态
    ↓
根据提示执行下一步
```

### 你可能的状态和对应操作

| 当前状态 | 应该执行 | 命令 |
|----------|----------|------|
| 项目刚开始 | 创建 PRD | `/bmad-create-prd` |
| PRD 已完成 | 创建架构 | `/bmad-create-architecture` |
| 架构已完成 | 创建 Epic/Story | `/bmad-create-epics-and-stories` |
| Story 已就绪 | 开始开发 | `/bmad-dev-story` |
| 开发中 | 继续开发 | 继续当前 Story |
| Story 完成 | 代码审查 | `/bmad-code-review` |
| 不确定状态 | 查看帮助 | `/bmad-help` |

---

## 📋 任务领取流程

### 1. 查看任务板

```bash
# 阅读 docs/TASKBOARD.md
# 找到分配给自己的、状态为「待开始」的任务
```

### 2. 领取任务

```bash
# 在 TASKBOARD.md 中将任务状态改为「进行中」
# 更新自己的 sprint-status.yaml
```

### 3. 开始开发

```bash
# 如果有现成的 Story
/bmad-dev-story

# 如果需要创建 Story
/bmad-create-story
```

---

## 📝 个人状态文件

你的个人状态文件位于：`_bmad-output/<你的名字>/`

### 必须维护的文件

| 文件 | 用途 | 更新频率 |
|------|------|----------|
| `sprint-status.yaml` | Sprint 进度 | 每日开始/结束时 |
| `current-task.md` | 当前任务详情 | 任务变更时 |

### sprint-status.yaml 模板

```yaml
# Sprint 状态 - <你的名字>

last_updated: YYYY-MM-DD

## 当前 Sprint

sprint_number: X
start_date: YYYY-MM-DD
end_date: YYYY-MM-DD
status: in_progress  # planning / in_progress / completed

## 当前任务

current_task:
  id: T-XXX
  title: 任务标题
  story: STORY-XXX  # 关联的 Story ID
  status: in_progress  # waiting / in_progress / blocked / completed

## 任务统计

total_tasks: X
completed_tasks: X
in_progress_tasks: X
blocked_tasks: X

## 阻塞事项

blocked_by: []  # 阻塞原因列表

## 备注

今天的工作重点...
```

---

## 🚫 遇到问题时

### 不知道该做什么

```
/bmad-help
```

### 发现 Bug 或需要修改

```
# 不要直接修改！
# 1. 先在 TASKBOARD.md 添加任务
# 2. 创建对应的 Story
# 3. 然后才能开发
```

### 需要修改 PRD/架构

```
# 不要直接修改共享文档！
# 1. 在群里提出修改建议
# 2. 讨论通过后
# 3. 运行 /bmad-edit-prd 或相关命令
```

### 被阻塞了

```
# 1. 更新 sprint-status.yaml 中的 blocked_by
# 2. 在群里说明阻塞原因
# 3. 等待解决后继续
```

---

## ✅ 检查清单

### 每次开始工作

- [ ] 运行了 `/bmad-help`
- [ ] 查看了 TASKBOARD.md
- [ ] 查看了队友的状态文件
- [ ] 更新了自己的状态文件

### 开始开发前

- [ ] 确认有对应的 Story
- [ ] Story 状态是「就绪」
- [ ] 更新 sprint-status.yaml

### 提交代码前

- [ ] 代码在 Story 定义范围内
- [ ] 运行了代码审查
- [ ] 更新了 Story 状态
- [ ] 创建了 PR

---

## 🎯 快速参考

| 我想... | 命令 |
|---------|------|
| 查看项目状态 | `/bmad-help` |
| 创建 PRD | `/bmad-create-prd` |
| 创建架构 | `/bmad-create-architecture` |
| 创建 Story | `/bmad-create-story` |
| 开发 Story | `/bmad-dev-story` |
| 代码审查 | `/bmad-code-review` |
| 查看 Sprint 状态 | `/bmad-sprint-status` |
| 修正方向 | `/bmad-correct-course` |

---

> ⚠️ **再次强调**：本文档具有最高优先级。任何违反本文档的行为都可能导致代码被拒绝合并。
>
> 💡 **记住**：不确定的时候，永远先运行 `/bmad-help`
