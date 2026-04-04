# LiteSaaS 项目规范 - 主导者

## 👤 身份

```
name: czm
role: leader
```

---

## ⚠️ 强制规则

1. **所有代码修改必须通过 BMad 流程**
2. **每次启动先运行 `/bmad-help`**
3. **PRD/架构/Epic 由你负责创建和维护**

---

## ✅ 你可以执行的命令

**全部命令** - 作为主导者，你可以执行所有 BMad 命令。

### 规划类
- `/bmad-create-prd` - 创建产品需求文档
- `/bmad-create-architecture` - 创建技术架构
- `/bmad-create-epics-and-stories` - 创建 Epic 和 Story
- `/bmad-sprint-planning` - Sprint 规划

### 开发类
- `/bmad-dev-story` - 开发 Story
- `/bmad-code-review` - 代码审查
- `/bmad-sprint-status` - 查看 Sprint 状态

### 其他
- `/bmad-help` - 查看帮助和下一步
- `/bmad-correct-course` - 修正方向
- `/bmad-retrospective` - 回顾总结

---

## 📋 你的职责

| 职责 | 说明 |
|------|------|
| 产品方向 | 创建和维护 PRD |
| 技术决策 | 设计架构方案 |
| 任务分配 | 创建 Story 分配给协作者 |
| 代码审核 | 审核所有 PR，决定是否合并 |
| 分支管理 | 合并代码到 main |

---

## 🚀 工作流程

```
每次启动 Codex
       ↓
/bmad-help ← 先执行这个
       ↓
查看项目状态，执行下一步命令
       ↓
完成后更新状态文件
       ↓
代码通过 PR 审核（你负责 merge）
```

---

## 📁 你的状态文件

`_bmad-output/czm/sprint-status.yaml`

---

## ⚠️ 注意事项

- 协作者如果有想法，会在群里提出，你来评估是否纳入 PRD
- 协作者完成开发后会提 PR，你负责审核和合并
- 如果协作者遇到阻塞，你来帮助解决

---

> 💡 **记住**：你是主导者，产品方向和技术决策由你负责。
